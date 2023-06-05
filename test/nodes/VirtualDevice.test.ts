import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  Nodes,
  Manufacturer,
  ManufacturerId,
  Integration,
  IntegrationId,
  Vehicle,
  VehicleId,
  VirtualDevice,
  VirtualDeviceId,
  Mapper,
  MockDimoToken
} from '../../typechain';
import {
  initialize,
  setup,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  MintVirtualDeviceInput,
  C
} from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('VirtualDevice', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let virtualDeviceInstance: VirtualDevice;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let virtualDeviceIdInstance: VirtualDeviceId;

  const [
    admin,
    nonAdmin,
    manufacturer1,
    integrationOwner1,
    user1,
    user2,
    virtualDeviceAddress1,
    virtualDeviceAddress2,
    notMintedVirtualDevice
  ] = provider.getWallets();

  before(async () => {
    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Integration',
        'Vehicle',
        'VirtualDevice',
        'Mapper'
      ],
      nfts: ['ManufacturerId', 'IntegrationId', 'VehicleId', 'VirtualDeviceId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    virtualDeviceInstance = deployments.VirtualDevice;
    mapperInstance = deployments.Mapper;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    virtualDeviceIdInstance = deployments.VirtualDeviceId;

    const MANUFACTURER_MINTER_ROLE = await manufacturerIdInstance.MINTER_ROLE();
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(MANUFACTURER_MINTER_ROLE, dimoRegistryInstance.address);

    const INTEGRATION_MINTER_ROLE = await integrationIdInstance.MINTER_ROLE();
    await integrationIdInstance
      .connect(admin)
      .grantRole(INTEGRATION_MINTER_ROLE, dimoRegistryInstance.address);

    const VEHICLE_MINTER_ROLE = await vehicleIdInstance.MINTER_ROLE();
    await vehicleIdInstance
      .connect(admin)
      .grantRole(VEHICLE_MINTER_ROLE, dimoRegistryInstance.address);

    const VIRTUAL_DEVICE_MINTER_ROLE =
      await virtualDeviceIdInstance.MINTER_ROLE();
    await virtualDeviceIdInstance
      .connect(admin)
      .grantRole(VIRTUAL_DEVICE_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(manufacturerIdInstance.address);
    await integrationInstance
      .connect(admin)
      .setIntegrationIdProxyAddress(integrationIdInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(vehicleIdInstance.address);
    await virtualDeviceInstance
      .connect(admin)
      .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address);

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion
    );

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );
    await mockDimoTokenInstance.deployed();

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(dimoRegistryInstance.address, C.manufacturerDimoTokensAmount);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

    // Whitelist Integration attributes
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute1);
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute2);

    // Whitelist Vehicle attributes
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute1);
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute2);

    // Whitelist VirtualDevice attributes
    await virtualDeviceInstance
      .connect(admin)
      .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute1);
    await virtualDeviceInstance
      .connect(admin)
      .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute2);

    // Mint Manufacturer Node
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer1.address,
        C.mockManufacturerNames[0],
        C.mockManufacturerAttributeInfoPairs
      );

    // Mint Integration Node
    await integrationInstance
      .connect(admin)
      .mintIntegration(
        integrationOwner1.address,
        C.mockIntegrationNames[0],
        C.mockIntegrationAttributeInfoPairs
      );

    // Setting DimoRegistry address in the AftermarketDeviceId
    await virtualDeviceIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setVirtualDeviceIdProxyAddress', () => {
    let localVirtualDeviceInstance: VirtualDevice;
    beforeEach(async () => {
      const deployments = await initialize(admin, 'VirtualDevice');
      localVirtualDeviceInstance = deployments.VirtualDevice;
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localVirtualDeviceInstance
            .connect(nonAdmin)
            .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localVirtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceIdProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit VirtualDeviceIdProxySet event with correct params', async () => {
        await expect(
          localVirtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address)
        )
          .to.emit(localVirtualDeviceInstance, 'VirtualDeviceIdProxySet')
          .withArgs(virtualDeviceIdInstance.address);
      });
    });
  });

  describe('addVirtualDeviceAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          virtualDeviceInstance
            .connect(nonAdmin)
            .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute1)
        ).to.be.revertedWith('Attribute already exists');
      });
    });

    context('Events', () => {
      it('Should emit VirtualDeviceAttributeAdded event with correct params', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute3)
        )
          .to.emit(virtualDeviceInstance, 'VirtualDeviceAttributeAdded')
          .withArgs(C.mockVirtualDeviceAttribute3);
      });
    });
  });

  describe('mintVirtualDeviceSign', () => {
    let mintVirtualDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintVirtualDeviceInput;

    before(async () => {
      mintVirtualDeviceSig1 = await signMessage({
        _signer: virtualDeviceAddress1,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      correctMintInput = {
        integrationNode: '1',
        vehicleNode: '1',
        virtualDeviceSig: mintVirtualDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        virtualDeviceAddr: virtualDeviceAddress1.address,
        attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
      };
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          virtualDeviceInstance
            .connect(nonAdmin)
            .mintVirtualDeviceSign(correctMintInput)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if parent node is not an integration node', async () => {
        const incorrectMintInput = {
          integrationNode: '99',
          vehicleNode: '1',
          virtualDeviceSig: mintVirtualDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          virtualDeviceAddr: virtualDeviceAddress1.address,
          attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
        };

        await expect(
          virtualDeviceInstance
            .connect(admin)
            .mintVirtualDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Invalid parent node');
      });
      it('Should revert if node is not a Vehicle', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '99',
          virtualDeviceSig: mintVirtualDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          virtualDeviceAddr: virtualDeviceAddress1.address,
          attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
        };

        await expect(
          virtualDeviceInstance
            .connect(admin)
            .mintVirtualDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Invalid vehicle node');
      });
      it('Should revert if device address is already registered', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '2',
          virtualDeviceSig: mintVirtualDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          virtualDeviceAddr: virtualDeviceAddress1.address,
          attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
        };

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        await expect(
          virtualDeviceInstance
            .connect(admin)
            .mintVirtualDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Device address already registered');
      });
      it('Should revert if owner is not the vehicle node owner', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '2',
          virtualDeviceSig: mintVirtualDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          virtualDeviceAddr: virtualDeviceAddress1.address,
          attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
        };

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          virtualDeviceInstance
            .connect(admin)
            .mintVirtualDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Invalid virtual device signature');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '1',
          virtualDeviceSig: mintVirtualDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          virtualDeviceAddr: virtualDeviceAddress1.address,
          attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairsNotWhitelisted
        };

        await expect(
          virtualDeviceInstance
            .connect(admin)
            .mintVirtualDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Not whitelisted');
      });
      it('Should revert if vehicle is already paired', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '1',
          virtualDeviceSig: mintVirtualDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          virtualDeviceAddr: virtualDeviceAddress2.address,
          attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
        };

        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        await expect(
          virtualDeviceInstance
            .connect(admin)
            .mintVirtualDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Vehicle already paired');
      });

      context('Wrong signature', () => {
        context('Virtual device signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid virtual device signature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid virtual device signature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid virtual device signature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid virtual device signature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '99',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid virtual device signature');
          });
          it('Should revert if vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '2'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid virtual device signature');
          });
          it('Should revert if virtual device address is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid virtual device signature');
          });
        });

        context('Vehicle owner signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: mintVirtualDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: mintVirtualDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: mintVirtualDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: mintVirtualDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '99',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: mintVirtualDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVirtualDeviceSign',
              _verifyingContract: virtualDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '2'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              virtualDeviceSig: mintVirtualDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              virtualDeviceAddr: virtualDeviceAddress1.address,
              attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
            };

            await expect(
              virtualDeviceInstance
                .connect(admin)
                .mintVirtualDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          virtualDeviceIdInstance.address,
          1
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set node owner', async () => {
        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        expect(await virtualDeviceIdInstance.ownerOf(1)).to.be.equal(
          user1.address
        );
      });
      it('Should correctly set device address', async () => {
        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        const id = await virtualDeviceInstance.getVirtualDeviceIdByAddress(
          virtualDeviceAddress1.address
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set infos', async () => {
        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute1
          )
        ).to.be.equal(C.mockVirtualDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute2
          )
        ).to.be.equal(C.mockVirtualDeviceInfo2);
      });
      it('Should correctly map the virtual device to the vehicle', async () => {
        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            vehicleIdInstance.address,
            virtualDeviceIdInstance.address,
            1
          )
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the virtual device', async () => {
        await virtualDeviceInstance
          .connect(admin)
          .mintVirtualDeviceSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            virtualDeviceIdInstance.address,
            vehicleIdInstance.address,
            1
          )
        ).to.be.equal(1);
      });
    });

    context('Events', () => {
      it('Should emit VirtualDeviceNodeMinted event with correct params', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .mintVirtualDeviceSign(correctMintInput)
        )
          .to.emit(virtualDeviceInstance, 'VirtualDeviceNodeMinted')
          .withArgs(1, 1, virtualDeviceAddress1.address, user1.address);
      });
    });
  });

  describe('setVirtualDeviceInfo', () => {
    let mintInput: MintVirtualDeviceInput;

    before(async () => {
      const mintVirtualDeviceSig1 = await signMessage({
        _signer: virtualDeviceAddress1,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      const mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      mintInput = {
        integrationNode: '1',
        vehicleNode: '1',
        virtualDeviceSig: mintVirtualDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        virtualDeviceAddr: virtualDeviceAddress1.address,
        attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
      };
    });

    beforeEach(async () => {
      await virtualDeviceInstance
        .connect(admin)
        .mintVirtualDeviceSign(mintInput);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          virtualDeviceInstance
            .connect(nonAdmin)
            .setVirtualDeviceInfo(1, C.mockVirtualDeviceAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not an Virtual Device', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceInfo(99, C.mockVirtualDeviceAttributeInfoPairs)
        ).to.be.revertedWith('Invalid virtual device node');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceInfo(
              1,
              C.mockVirtualDeviceAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockVirtualDeviceAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute1
          )
        ).to.be.equal(C.mockVirtualDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute2
          )
        ).to.be.equal(C.mockVirtualDeviceInfo2);

        await virtualDeviceInstance
          .connect(admin)
          .setVirtualDeviceInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit VirtualDeviceAttributeSet events with correct params', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceInfo(1, C.mockVirtualDeviceAttributeInfoPairs)
        )
          .to.emit(virtualDeviceInstance, 'VirtualDeviceAttributeSet')
          .withArgs(
            1,
            C.mockVirtualDeviceAttributeInfoPairs[0].attribute,
            C.mockVirtualDeviceAttributeInfoPairs[0].info
          )
          .to.emit(virtualDeviceInstance, 'VirtualDeviceAttributeSet')
          .withArgs(
            1,
            C.mockVirtualDeviceAttributeInfoPairs[1].attribute,
            C.mockVirtualDeviceAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('getVirtualDeviceIdByAddress', () => {
    let mintInput: MintVirtualDeviceInput;

    before(async () => {
      const mintVirtualDeviceSig1 = await signMessage({
        _signer: virtualDeviceAddress1,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      const mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      mintInput = {
        integrationNode: '1',
        vehicleNode: '1',
        virtualDeviceSig: mintVirtualDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        virtualDeviceAddr: virtualDeviceAddress1.address,
        attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
      };
    });

    beforeEach(async () => {
      await virtualDeviceInstance
        .connect(admin)
        .mintVirtualDeviceSign(mintInput);
    });

    it('Should return 0 if the queried address is not associated with any minted device', async () => {
      const tokenId = await virtualDeviceInstance.getVirtualDeviceIdByAddress(
        notMintedVirtualDevice.address
      );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId = await virtualDeviceInstance.getVirtualDeviceIdByAddress(
        virtualDeviceAddress1.address
      );

      expect(tokenId).to.equal(1);
    });
  });
});
