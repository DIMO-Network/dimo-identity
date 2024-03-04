import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
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
  MultipleMinter,
  MockDimoToken
} from '../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  MintVehicleAndSdInput,
  MintVehicleAndSdWithDdInput,
  C
} from '../utils';

const { expect } = chai;

describe('MultipleMinter', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let syntheticDeviceInstance: SyntheticDevice;
  let mapperInstance: Mapper;
  let multipleMinterInstance: MultipleMinter;
  let mockDimoTokenInstance: MockDimoToken;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let sdIdInstance: SyntheticDeviceId;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let integrationOwner1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let sdAddress1: HardhatEthersSigner;
  let sdAddress2: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      integrationOwner1,
      user1,
      user2,
      sdAddress1,
      sdAddress2
    ] = await ethers.getSigners()
    
    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Integration',
        'Vehicle',
        'SyntheticDevice',
        'Mapper',
        'MultipleMinter'
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
    dimoAccessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    mapperInstance = deployments.Mapper;
    multipleMinterInstance = deployments.MultipleMinter;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    sdIdInstance = deployments.SyntheticDeviceId;

    await grantAdminRoles(admin, dimoAccessControlInstance);

    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());
    await integrationIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());
    await vehicleIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, await dimoRegistryInstance.getAddress());

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());
    await integrationInstance
      .connect(admin)
      .setIntegrationIdProxyAddress(await integrationIdInstance.getAddress());
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(await vehicleIdInstance.getAddress());
    await syntheticDeviceInstance
      .connect(admin)
      .setSyntheticDeviceIdProxyAddress(await sdIdInstance.getAddress());

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

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(await dimoRegistryInstance.getAddress(), C.manufacturerDimoTokensAmount);

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
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(await dimoRegistryInstance.getAddress());

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
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

  describe('mintVehicleAndSdSign', () => {
    let mintSyntheticDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintVehicleAndSdInput;
    let incorrectMintInput: MintVehicleAndSdInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintVehicleAndSdSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          integrationNode: '1'
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVehicleSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos
        }
      });
      correctMintInput = {
        manufacturerNode: '1',
        owner: user1.address,
        attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
        integrationNode: '1',
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairsDevice: C.mockSyntheticDeviceAttributeInfoPairs
      };
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = { ...correctMintInput };
      });

      it('Should revert if caller does not have MINT_VEHICLE_SD_ROLE', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdSign(correctMintInput)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.MINT_VEHICLE_SD_ROLE
          }`
        );
      });
      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput.manufacturerNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
        .withArgs(99);
      });
      it('Should revert if synthetic device parent node is not an integration node', async () => {
        incorrectMintInput.integrationNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
        .withArgs(99);
      });
      it('Should revert if device address is already registered', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'DeviceAlreadyRegistered'
        ).withArgs(await sdAddress1.address);
      });
      it('Should revert if synthetic device attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsDevice =
          C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted[1].attribute);
      });
      it('Should revert if vehicle attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsVehicle =
          C.mockVehicleAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
      });

      context('Wrong signature', () => {
        context('Vehicle owner signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if manufacturer node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '99',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if attributes are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes.slice(1),
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if infos are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfosWrongSize
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if owner does not match signer', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user2.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
        });

        context('Synthetic device signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress2,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _chainId: 99,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '99'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set vehicle parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          3
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set vehicle node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
      });
      it('Should correctly set vehicle infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            3,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            3,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
      });
      it('Should correctly set synthetic device parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set synthetic device node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set synthetic device address', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set synthetic device infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo2);
      });
      it('Should correctly map the synthetic device to the vehicle', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            3
          )
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the synthetic device', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.be.equal(3);
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleNodeMinted')
          .withArgs(1, 3, user1.address);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(multipleMinterInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
      it('Should emit SyntheticDeviceNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(1, 1, 3, sdAddress1.address, user1.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info
          )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info
          );
      });
      it('Should not emit SyntheticDeviceAttributeSet event if attrInfoPairsDevice is empty', async () => {
        correctMintInput = {
          manufacturerNode: '1',
          owner: user1.address,
          attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
          integrationNode: '1',
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairsDevice: []
        };

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
      });
    });
  });

  describe('mintVehicleAndSdWithDeviceDefinitionSign', () => {
    let mintSyntheticDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintVehicleAndSdWithDdInput;
    let incorrectMintInput: MintVehicleAndSdWithDdInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintVehicleAndSdSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          integrationNode: '1'
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVehicleWithDeviceDefinitionSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1
        }
      });
      console.log(mintSyntheticDeviceSig1)
      console.log(mintVehicleOwnerSig1)
      correctMintInput = {
        manufacturerNode: '1',
        owner: user1.address,
        deviceDefinitionId: C.mockDdId1,
        integrationNode: '1',
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairsDevice: C.mockSyntheticDeviceAttributeInfoPairs
      };
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = { ...correctMintInput };
      });

      it('Should revert if caller does not have MINT_VEHICLE_SD_ROLE', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.MINT_VEHICLE_SD_ROLE
          }`
        );
      });
      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput.manufacturerNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
        .withArgs(99);
      });
      it('Should revert if synthetic device parent node is not an integration node', async () => {
        incorrectMintInput.integrationNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
        .withArgs(99);
      });
      it('Should revert if device address is already registered', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'DeviceAlreadyRegistered'
        ).withArgs(await sdAddress1.address);
      });
      it('Should revert if synthetic device attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsDevice =
          C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted[1].attribute);
      });

      context('Wrong signature', () => {
        context('Vehicle owner signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if manufacturer node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '99',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if deviceDefinitionId is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId2
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if owner does not match signer', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user2.address,
                deviceDefinitionId: C.mockDdId1
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
        });

        context('Synthetic device signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress2,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _chainId: 99,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                integrationNode: '99'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set vehicle parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          3
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set vehicle node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
      });
      it('Should correctly set synthetic device parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set synthetic device node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set synthetic device address', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set synthetic device infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo2);
      });
      it('Should correctly map the synthetic device to the vehicle', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            3
          )
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the synthetic device', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.be.equal(3);
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleNodeMinted')
          .withArgs(1, 3, user1.address);
      });
      it('Should emit SyntheticDeviceNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(1, 1, 3, sdAddress1.address, user1.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info
          )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info
          );
      });
      it('Should not emit SyntheticDeviceAttributeSet event if attrInfoPairsDevice is empty', async () => {
        correctMintInput = {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          integrationNode: '1',
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairsDevice: []
        };

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
      });
    });
  });
});
