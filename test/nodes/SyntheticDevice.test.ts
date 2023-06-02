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
  SyntheticDevice,
  SyntheticDeviceId,
  Mapper,
  MockDimoToken
} from '../../typechain';
import {
  initialize,
  setup,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  MintSyntheticDeviceInput,
  C
} from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('SyntheticDevice', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let syntheticDeviceInstance: SyntheticDevice;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let sDIdInstance: SyntheticDeviceId;

  const [
    admin,
    nonAdmin,
    manufacturer1,
    integrationOwner1,
    user1,
    user2,
    sDAddress1,
    sDAddress2,
    notMintedSyntheticDevice
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
        'SyntheticDevice',
        'Mapper'
      ],
      nfts: [
        'ManufacturerId',
        'IntegrationId',
        'VehicleId',
        'SyntheticDeviceId'
      ],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    mapperInstance = deployments.Mapper;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    sDIdInstance = deployments.SyntheticDeviceId;

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

    const SYNTHETIC_DEVICE_MINTER_ROLE = await sDIdInstance.MINTER_ROLE();
    await sDIdInstance
      .connect(admin)
      .grantRole(SYNTHETIC_DEVICE_MINTER_ROLE, dimoRegistryInstance.address);

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
    await syntheticDeviceInstance
      .connect(admin)
      .setSyntheticDeviceIdProxyAddress(sDIdInstance.address);

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

    // Whitelist SyntheticDevice attributes
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1);
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute2);

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
    await sDIdInstance
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

  describe('setSyntheticDeviceIdProxyAddress', () => {
    let localSyntheticDeviceInstance: SyntheticDevice;
    beforeEach(async () => {
      const deployments = await initialize(admin, 'SyntheticDevice');
      localSyntheticDeviceInstance = deployments.SyntheticDevice;
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localSyntheticDeviceInstance
            .connect(nonAdmin)
            .setSyntheticDeviceIdProxyAddress(sDIdInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localSyntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceIdProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceIdProxySet event with correct params', async () => {
        await expect(
          localSyntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceIdProxyAddress(sDIdInstance.address)
        )
          .to.emit(localSyntheticDeviceInstance, 'SyntheticDeviceIdProxySet')
          .withArgs(sDIdInstance.address);
      });
    });
  });

  describe('addSyntheticDeviceAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(nonAdmin)
            .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1)
        ).to.be.revertedWith('Attribute already exists');
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceAttributeAdded event with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute3)
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeAdded')
          .withArgs(C.mockSyntheticDeviceAttribute3);
      });
    });
  });

  describe('mintSyntheticDeviceSign', () => {
    let mintSyntheticDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintSyntheticDeviceInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sDAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: syntheticDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: syntheticDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      correctMintInput = {
        integrationNode: '1',
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sDAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
      };
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(nonAdmin)
            .mintSyntheticDeviceSign(correctMintInput)
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
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceAddr: sDAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Invalid parent node');
      });
      it('Should revert if node is not a Vehicle', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '99',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceAddr: sDAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Invalid vehicle node');
      });
      it('Should revert if device address is already registered', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '2',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceAddr: sDAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Device address already registered');
      });
      it('Should revert if owner is not the vehicle node owner', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '2',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceAddr: sDAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Invalid synthetic device signature');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '1',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceAddr: sDAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted
        };

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Not whitelisted');
      });
      it('Should revert if vehicle is already paired', async () => {
        const incorrectMintInput = {
          integrationNode: '1',
          vehicleNode: '1',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceAddr: sDAddress2.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceSign(incorrectMintInput)
        ).to.be.revertedWith('Vehicle already paired');
      });

      context('Wrong signature', () => {
        context('Synthetic device signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid synthetic device signature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid synthetic device signature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid synthetic device signature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid synthetic device signature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '99',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid synthetic device signature');
          });
          it('Should revert if vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '2'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid synthetic device signature');
          });
          it('Should revert if synthetic device address is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: invalidSignature,
              vehicleOwnerSig: mintVehicleOwnerSig1,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid synthetic device signature');
          });
        });

        context('Vehicle owner signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: mintSyntheticDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: mintSyntheticDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: mintSyntheticDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: mintSyntheticDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '99',
                vehicleNode: '1'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: mintSyntheticDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
          it('Should revert if vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: syntheticDeviceInstance.address,
              message: {
                integrationNode: '1',
                vehicleNode: '2'
              }
            });
            const incorrectMintInput = {
              integrationNode: '1',
              vehicleNode: '1',
              syntheticDeviceSig: mintSyntheticDeviceSig1,
              vehicleOwnerSig: invalidSignature,
              syntheticDeviceAddr: sDAddress1.address,
              attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
            };

            await expect(
              syntheticDeviceInstance
                .connect(admin)
                .mintSyntheticDeviceSign(incorrectMintInput)
            ).to.be.revertedWith('Invalid vehicle owner signature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          sDIdInstance.address,
          1
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set node owner', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(await sDIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set device address', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sDAddress1.address
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set infos', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            sDIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            sDIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo2);
      });
      it('Should correctly map the synthetic device to the vehicle', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            vehicleIdInstance.address,
            sDIdInstance.address,
            1
          )
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the synthetic device', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            sDIdInstance.address,
            vehicleIdInstance.address,
            1
          )
        ).to.be.equal(1);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceNodeMinted event with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceSign(correctMintInput)
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(1, 1, sDAddress1.address, user1.address);
      });
    });
  });

  describe('setSyntheticDeviceInfo', () => {
    let mintInput: MintSyntheticDeviceInput;

    before(async () => {
      const mintSyntheticDeviceSig1 = await signMessage({
        _signer: sDAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: syntheticDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      const mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: syntheticDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      mintInput = {
        integrationNode: '1',
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sDAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
      };
    });

    beforeEach(async () => {
      await syntheticDeviceInstance
        .connect(admin)
        .mintSyntheticDeviceSign(mintInput);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(nonAdmin)
            .setSyntheticDeviceInfo(1, C.mockSyntheticDeviceAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not an Synthetic Device', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceInfo(99, C.mockSyntheticDeviceAttributeInfoPairs)
        ).to.be.revertedWith('Invalid AD node');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceInfo(
              1,
              C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockSyntheticDeviceAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            sDIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            sDIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo2);

        await syntheticDeviceInstance
          .connect(admin)
          .setSyntheticDeviceInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            sDIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            sDIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceInfo(1, C.mockSyntheticDeviceAttributeInfoPairs)
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info
          )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('getSyntheticDeviceIdByAddress', () => {
    let mintInput: MintSyntheticDeviceInput;

    before(async () => {
      const mintSyntheticDeviceSig1 = await signMessage({
        _signer: sDAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: syntheticDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      const mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: syntheticDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      mintInput = {
        integrationNode: '1',
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sDAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
      };
    });

    beforeEach(async () => {
      await syntheticDeviceInstance
        .connect(admin)
        .mintSyntheticDeviceSign(mintInput);
    });

    it('Should return 0 if the queried address is not associated with any minted device', async () => {
      const tokenId =
        await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          notMintedSyntheticDevice.address
        );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId =
        await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sDAddress1.address
        );

      expect(tokenId).to.equal(1);
    });
  });
});
