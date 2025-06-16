import chai from 'chai';
import { ethers } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
  DIMORegistry,
  Eip712Checker,
  Charging,
  DimoAccessControl,
  Nodes,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  SyntheticDevice,
  SyntheticDeviceId,
  Mapper,
  MultipleMinter,
  Shared,
  MockDimoToken,
  MockDimoCredit,
  MockSacd,
  MockConnectionsManager
} from '../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  MintVehicleAndSdInput,
  MintVehicleAndSdWithDdInput,
  MintVehicleAndSdWithDdInputBatch,
  SacdInput,
  C
} from '../utils';

const { expect } = chai;

describe.only('MultipleMinter', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let syntheticDeviceInstance: SyntheticDevice;
  let mapperInstance: Mapper;
  let multipleMinterInstance: MultipleMinter;
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockConnectionsManagerInstance: MockConnectionsManager;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let sdIdInstance: SyntheticDeviceId;
  let mockSacdInstance: MockSacd;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let manufacturer2: HardhatEthersSigner;
  let connectionOwner1: HardhatEthersSigner;
  let connectionOwner2: HardhatEthersSigner;
  let minterWithPermission1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let user3: HardhatEthersSigner;
  let sdAddress1: HardhatEthersSigner;
  let sdAddress2: HardhatEthersSigner;

  let DEFAULT_EXPIRATION: string

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      manufacturer2,
      connectionOwner1,
      connectionOwner2,
      minterWithPermission1,
      user1,
      user2,
      user3,
      sdAddress1,
      sdAddress2
    ] = await ethers.getSigners()

    DEFAULT_EXPIRATION = ((await time.latest()) + time.duration.years(1)).toString()

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'Charging',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Vehicle',
        'SyntheticDevice',
        'Mapper',
        'MultipleMinter',
        'Shared'
      ],
      nfts: [
        'ManufacturerId',
        'VehicleId',
        'SyntheticDeviceId'
      ],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    chargingInstance = deployments.Charging;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    mapperInstance = deployments.Mapper;
    multipleMinterInstance = deployments.MultipleMinter;
    sharedInstance = deployments.Shared;
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;
    sdIdInstance = deployments.SyntheticDeviceId;

    DIMO_REGISTRY_ADDRESS = await dimoRegistryInstance.getAddress();

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );

    // Deploy MockDimoCredit contract
    const MockDimoCreditFactory = await ethers.getContractFactory(
      'MockDimoCredit'
    );
    mockDimoCreditInstance = await MockDimoCreditFactory.connect(admin).deploy();

    // Deploy MockSacd contract
    const MockSacdFactory = await ethers.getContractFactory('MockSacd');
    mockSacdInstance = await MockSacdFactory.connect(admin).deploy();

    // Deploy MockConnectionsManager contract
    const MockConnectionsManagerFactory = await ethers.getContractFactory(
      'MockConnectionsManager'
    );
    mockConnectionsManagerInstance = await MockConnectionsManagerFactory
      .connect(admin)
      .deploy(C.CONNECTIONS_MANAGER_ERC721_NAME, C.CONNECTIONS_MANAGER_ERC721_SYMBOL);

    await grantAdminRoles(admin, dimoAccessControlInstance);

    // Grant NFT minter roles to DIMO Registry contract
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await vehicleIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Grant synthetic device minting permission to admin
    await sharedInstance.connect(admin).setSacd(mockSacdInstance);
    await mockSacdInstance.setPermissions(mockConnectionsManagerInstance, C.CONNECTION_ID_1, minterWithPermission1.address, 12, DEFAULT_EXPIRATION, '');
    await mockSacdInstance.setPermissions(mockConnectionsManagerInstance, C.CONNECTION_ID_2, minterWithPermission1.address, 12, DEFAULT_EXPIRATION, '');

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());
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

    // Mint DIMO Credit tokens to accounts
    await mockDimoCreditInstance
      .connect(admin)
      .mint(admin.address, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(manufacturer1.address, C.manufacturerDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(connectionOwner1.address, C.connectionOwnerDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(connectionOwner2.address, C.connectionOwnerDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(minterWithPermission1.address, C.minterWithPermissionDimoCreditTokensAmount);

    // Grant BURNER role to DIMORegistry
    await mockDimoCreditInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Setup Shared variables
    await sharedInstance
      .connect(admin)
      .setDimoToken(await mockDimoTokenInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setDimoCredit(await mockDimoCreditInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setConnectionsManager(await mockConnectionsManagerInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setSacd(await mockSacdInstance.getAddress());

    // Setup Charging variables
    await chargingInstance
      .connect(admin)
      .setDcxOperationCost(C.MINT_VEHICLE_OPERATION, C.MINT_VEHICLE_OPERATION_COST);
    await chargingInstance
      .connect(admin)
      .setDcxOperationCost(C.MINT_AD_OPERATION, C.MINT_AD_OPERATION_COST);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

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
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer2.address,
        C.mockManufacturerNames[1],
        C.mockManufacturerAttributeInfoPairs
      );

    // Mint Connection ID
    await mockConnectionsManagerInstance
      .mint(
        connectionOwner1.address,
        C.CONNECTION_NAME_1,
      );
    await mockConnectionsManagerInstance
      .mint(
        connectionOwner2.address,
        C.CONNECTION_NAME_2,
      );

    // Setting DimoRegistry address in the Proxy IDs
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    await vehicleIdInstance
      .connect(admin)
      .setSacdAddress(await mockSacdInstance.getAddress());

    await vehicleInstance
      .connect(admin)
    ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
    await vehicleInstance
      .connect(admin)
    ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
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
          connectionId: C.CONNECTION_ID_1
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
        connectionId: C.CONNECTION_ID_1,
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

      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput.manufacturerNode = '99';

        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if synthetic device parent node is not a connection ID', async () => {
        incorrectMintInput.connectionId = '99';

        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if caller is not the connection ID owner nor has permissions', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.be.revertedWithCustomError(
            multipleMinterInstance,
            'Unauthorized',
          )
          .withArgs(nonAdmin.address);
      });
    })

    context('Connection owner as minter', () => {
      context('Error handling', () => {
        beforeEach(() => {
          incorrectMintInput = { ...correctMintInput };
        });

        it('Should revert if device address is already registered', async () => {
          await multipleMinterInstance
            .connect(connectionOwner1)
            .mintVehicleAndSdSign(correctMintInput);

          await expect(
            multipleMinterInstance
              .connect(connectionOwner1)
              .mintVehicleAndSdSign(correctMintInput)
          ).to.be.revertedWithCustomError(
            multipleMinterInstance,
            'DeviceAlreadyRegistered'
          ).withArgs(sdAddress1.address);
        });
        it('Should revert if synthetic device attribute is not whitelisted', async () => {
          incorrectMintInput.attrInfoPairsDevice =
            C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

          await expect(
            multipleMinterInstance
              .connect(connectionOwner1)
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
              .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  .connect(connectionOwner1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(connectionOwner1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(connectionOwner1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(connectionOwner1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(connectionOwner1)
                  .mintVehicleAndSdSign(incorrectMintInput)
              ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
            });
            it('Should revert if connection ID is incorrect', async () => {
              const invalidSignature = await signMessage({
                _signer: sdAddress1,
                _primaryType: 'MintVehicleAndSdSign',
                _verifyingContract: await multipleMinterInstance.getAddress(),
                message: {
                  connectionId: '99'
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(connectionOwner1)
                  .mintVehicleAndSdSign(incorrectMintInput)
              ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
            });
          });
        });
      });

      context('State', () => {
        it('Should correctly set vehicle parent node', async () => {
          await multipleMinterInstance
            .connect(connectionOwner1)
            .mintVehicleAndSdSign(correctMintInput);

          const parentNode = await nodesInstance.getParentNode(
            await vehicleIdInstance.getAddress(),
            3
          );

          expect(parentNode).to.be.equal(1);
        });
        it('Should correctly set vehicle node owner', async () => {
          await multipleMinterInstance
            .connect(connectionOwner1)
            .mintVehicleAndSdSign(correctMintInput);

          expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
        });
        it('Should correctly set vehicle infos', async () => {
          await multipleMinterInstance
            .connect(connectionOwner1)
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
            .connect(connectionOwner1)
            .mintVehicleAndSdSign(correctMintInput);

          const parentNode = await nodesInstance.getParentNode(
            await sdIdInstance.getAddress(),
            1
          );

          expect(parentNode).to.be.equal(C.CONNECTION_ID_1);
        });
        it('Should correctly set synthetic device node owner', async () => {
          await multipleMinterInstance
            .connect(connectionOwner1)
            .mintVehicleAndSdSign(correctMintInput);

          expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
        });
        it('Should correctly set synthetic device address', async () => {
          await multipleMinterInstance
            .connect(connectionOwner1)
            .mintVehicleAndSdSign(correctMintInput);

          const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sdAddress1.address
          );

          expect(id).to.equal(1);
        });
        it('Should correctly set synthetic device infos', async () => {
          await multipleMinterInstance
            .connect(connectionOwner1)
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
            .connect(connectionOwner1)
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
            .connect(connectionOwner1)
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
              .connect(connectionOwner1)
              .mintVehicleAndSdSign(correctMintInput)
          )
            .to.emit(multipleMinterInstance, 'VehicleNodeMinted')
            .withArgs(1, 3, user1.address);
        });
        it('Should emit VehicleAttributeSet events with correct params', async () => {
          await expect(
            multipleMinterInstance
              .connect(connectionOwner1)
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
              .connect(connectionOwner1)
              .mintVehicleAndSdSign(correctMintInput)
          )
            .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
            .withArgs(C.CONNECTION_ID_1, 1, 3, sdAddress1.address, user1.address);
        });
        it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
          await expect(
            multipleMinterInstance
              .connect(connectionOwner1)
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
          const localCorrectMintInput = {
            manufacturerNode: '1',
            owner: user1.address,
            attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
            connectionId: C.CONNECTION_ID_1,
            vehicleOwnerSig: mintVehicleOwnerSig1,
            syntheticDeviceSig: mintSyntheticDeviceSig1,
            syntheticDeviceAddr: sdAddress1.address,
            attrInfoPairsDevice: []
          };

          await expect(
            multipleMinterInstance
              .connect(connectionOwner1)
              .mintVehicleAndSdSign(localCorrectMintInput)
          ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
        });
      });
    });

    context('Minter has permission', () => {
      context('Error handling', () => {
        beforeEach(() => {
          incorrectMintInput = { ...correctMintInput };
        });

        it('Should revert if device address is already registered', async () => {
          await multipleMinterInstance
            .connect(minterWithPermission1)
            .mintVehicleAndSdSign(correctMintInput);

          await expect(
            multipleMinterInstance
              .connect(minterWithPermission1)
              .mintVehicleAndSdSign(correctMintInput)
          ).to.be.revertedWithCustomError(
            multipleMinterInstance,
            'DeviceAlreadyRegistered'
          ).withArgs(sdAddress1.address);
        });
        it('Should revert if synthetic device attribute is not whitelisted', async () => {
          incorrectMintInput.attrInfoPairsDevice =
            C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

          await expect(
            multipleMinterInstance
              .connect(minterWithPermission1)
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
              .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  .connect(minterWithPermission1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(minterWithPermission1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(minterWithPermission1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(minterWithPermission1)
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
                  connectionId: C.CONNECTION_ID_1
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(minterWithPermission1)
                  .mintVehicleAndSdSign(incorrectMintInput)
              ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
            });
            it('Should revert if connection ID is incorrect', async () => {
              const invalidSignature = await signMessage({
                _signer: sdAddress1,
                _primaryType: 'MintVehicleAndSdSign',
                _verifyingContract: await multipleMinterInstance.getAddress(),
                message: {
                  connectionId: '99'
                }
              });
              incorrectMintInput.syntheticDeviceSig = invalidSignature;

              await expect(
                multipleMinterInstance
                  .connect(minterWithPermission1)
                  .mintVehicleAndSdSign(incorrectMintInput)
              ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
            });
          });
        });
      });

      context('State', () => {
        it('Should correctly set vehicle parent node', async () => {
          await multipleMinterInstance
            .connect(minterWithPermission1)
            .mintVehicleAndSdSign(correctMintInput);

          const parentNode = await nodesInstance.getParentNode(
            await vehicleIdInstance.getAddress(),
            3
          );

          expect(parentNode).to.be.equal(1);
        });
        it('Should correctly set vehicle node owner', async () => {
          await multipleMinterInstance
            .connect(minterWithPermission1)
            .mintVehicleAndSdSign(correctMintInput);

          expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
        });
        it('Should correctly set vehicle infos', async () => {
          await multipleMinterInstance
            .connect(minterWithPermission1)
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
            .connect(minterWithPermission1)
            .mintVehicleAndSdSign(correctMintInput);

          const parentNode = await nodesInstance.getParentNode(
            await sdIdInstance.getAddress(),
            1
          );

          expect(parentNode).to.be.equal(C.CONNECTION_ID_1);
        });
        it('Should correctly set synthetic device node owner', async () => {
          await multipleMinterInstance
            .connect(minterWithPermission1)
            .mintVehicleAndSdSign(correctMintInput);

          expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
        });
        it('Should correctly set synthetic device address', async () => {
          await multipleMinterInstance
            .connect(minterWithPermission1)
            .mintVehicleAndSdSign(correctMintInput);

          const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sdAddress1.address
          );

          expect(id).to.equal(1);
        });
        it('Should correctly set synthetic device infos', async () => {
          await multipleMinterInstance
            .connect(minterWithPermission1)
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
            .connect(minterWithPermission1)
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
            .connect(minterWithPermission1)
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
              .connect(minterWithPermission1)
              .mintVehicleAndSdSign(correctMintInput)
          )
            .to.emit(multipleMinterInstance, 'VehicleNodeMinted')
            .withArgs(1, 3, user1.address);
        });
        it('Should emit VehicleAttributeSet events with correct params', async () => {
          await expect(
            multipleMinterInstance
              .connect(minterWithPermission1)
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
              .connect(minterWithPermission1)
              .mintVehicleAndSdSign(correctMintInput)
          )
            .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
            .withArgs(C.CONNECTION_ID_1, 1, 3, sdAddress1.address, user1.address);
        });
        it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
          await expect(
            multipleMinterInstance
              .connect(minterWithPermission1)
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
          const localCorrectMintInput = {
            manufacturerNode: '1',
            owner: user1.address,
            attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
            connectionId: C.CONNECTION_ID_1,
            vehicleOwnerSig: mintVehicleOwnerSig1,
            syntheticDeviceSig: mintSyntheticDeviceSig1,
            syntheticDeviceAddr: sdAddress1.address,
            attrInfoPairsDevice: []
          };

          await expect(
            multipleMinterInstance
              .connect(minterWithPermission1)
              .mintVehicleAndSdSign(localCorrectMintInput)
          ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
        });
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
          connectionId: C.CONNECTION_ID_1
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVehicleWithDeviceDefinitionSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos
        }
      });
      correctMintInput = {
        manufacturerNode: '1',
        owner: user1.address,
        deviceDefinitionId: C.mockDdId1,
        attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
        connectionId: C.CONNECTION_ID_1,
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

      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput.manufacturerNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if synthetic device parent node is not a connection ID', async () => {
        incorrectMintInput.connectionId = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if caller is not the connection ID owner nor has permissions', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        )
          .to.be.revertedWithCustomError(
            multipleMinterInstance,
            'Unauthorized',
          )
          .withArgs(nonAdmin.address);
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
      it('Should revert if vehicle attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsVehicle =
          C.mockVehicleAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
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
                deviceDefinitionId: C.mockDdId2,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if vehicle attributes are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes.slice(1),
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if vehicle infos are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfosWrongSize
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
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
                connectionId: C.CONNECTION_ID_1
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
                connectionId: C.CONNECTION_ID_1
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
                connectionId: C.CONNECTION_ID_1
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
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSign(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if connection ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: '99'
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

        expect(parentNode).to.be.equal(C.CONNECTION_ID_1);
      });
      it('Should correctly set synthetic device node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set Device Definition Id', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(
          await vehicleInstance
            .getDeviceDefinitionIdByVehicleId(3)
        ).to.be.equal(C.mockDdId1);
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
      it('Should correctly set vehicle infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
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
      it('Should correctly burn DIMO Credit tokens from the sender', async () => {
        await expect(() =>
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        ).changeTokenBalance(
          mockDimoCreditInstance,
          admin.address,
          -C.MINT_VEHICLE_OPERATION_COST
        );
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMintedWithDeviceDefinition event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleNodeMintedWithDeviceDefinition')
          .withArgs(1, 3, user1.address, C.mockDdId1);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
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
            .mintVehicleAndSdWithDeviceDefinitionSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(C.CONNECTION_ID_1, 1, 3, sdAddress1.address, user1.address);
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
        const localCorrectMintInput = {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
          connectionId: C.CONNECTION_ID_1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairsDevice: []
        };

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSign(localCorrectMintInput)
        ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
      });
    });
  });

  describe('mintVehicleAndSdWithDeviceDefinitionSignAndSacd', () => {
    let mintSyntheticDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintVehicleAndSdWithDdInput;
    let incorrectMintInput: MintVehicleAndSdWithDdInput;
    let sacdInput: SacdInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintVehicleAndSdSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVehicleWithDeviceDefinitionSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos
        }
      });
      correctMintInput = {
        manufacturerNode: '1',
        owner: user1.address,
        deviceDefinitionId: C.mockDdId1,
        attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
        connectionId: C.CONNECTION_ID_1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairsDevice: C.mockSyntheticDeviceAttributeInfoPairs
      };
      sacdInput = {
        ...C.mockSacdInput,
        grantee: user2.address,
        expiration: DEFAULT_EXPIRATION
      };
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = { ...correctMintInput };
      });

      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput.manufacturerNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if synthetic device parent node is not a connection ID', async () => {
        incorrectMintInput.connectionId = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if caller is not the connection ID owner nor has permissions', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput)
        )
          .to.be.revertedWithCustomError(
            multipleMinterInstance,
            'Unauthorized',
          )
          .withArgs(nonAdmin.address);
      });
      it('Should revert if device address is already registered', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'DeviceAlreadyRegistered'
        ).withArgs(sdAddress1.address);
      });
      it('Should revert if vehicle attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsVehicle =
          C.mockVehicleAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
      });
      it('Should revert if synthetic device attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsDevice =
          C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                deviceDefinitionId: C.mockDdId2,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if vehicle attributes are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes.slice(1),
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if vehicle infos are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfosWrongSize
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
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
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _chainId: 99,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if connection ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: '99'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(incorrectMintInput, sacdInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set vehicle parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        const parentNode = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          3
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set vehicle node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
      });
      it('Should correctly set synthetic device parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1
        );

        expect(parentNode).to.be.equal(C.CONNECTION_ID_1);
      });
      it('Should correctly set synthetic device node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set Device Definition Id', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        expect(
          await vehicleInstance
            .getDeviceDefinitionIdByVehicleId(3)
        ).to.be.equal(C.mockDdId1);
      });
      it('Should correctly set synthetic device address', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set vehicle infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
      });
      it('Should correctly set synthetic device infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

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
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

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
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.be.equal(3);
      });
      it('Should correctly burn DIMO Credit tokens from the sender', async () => {
        await expect(() =>
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput)
        ).changeTokenBalance(
          mockDimoCreditInstance,
          admin.address,
          -C.MINT_VEHICLE_OPERATION_COST
        );
      });
      it('Should correctly set SACD permissions', async () => {
        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 3, 0, user2.address)
        ).to.eql([0n, 0n, ''])

        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput);

        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 3, 0, user2.address)
        ).to.eql([BigInt(C.mockSacdInput.permissions), BigInt(DEFAULT_EXPIRATION), C.mockSacdInput.source])
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMintedWithDeviceDefinition event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleNodeMintedWithDeviceDefinition')
          .withArgs(1, 3, user1.address, C.mockDdId1);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
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
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(C.CONNECTION_ID_1, 1, 3, sdAddress1.address, user1.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(correctMintInput, sacdInput)
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
        const localCorrectMintInput = {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
          connectionId: C.CONNECTION_ID_1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairsDevice: []
        };

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignAndSacd(localCorrectMintInput, sacdInput)
        ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
      });
    });
  });

  describe('mintVehicleAndSdWithDeviceDefinitionSignBatch', () => {
    let mintSyntheticDeviceSig1: string;
    let mintSyntheticDeviceSig2: string;
    let mintVehicleOwnerSig1: string;
    let mintVehicleOwnerSig2: string;
    let correctMintInput: MintVehicleAndSdWithDdInputBatch[];
    let incorrectMintInput: MintVehicleAndSdWithDdInputBatch[];
    let sacdInput1: SacdInput;
    let sacdInput2: SacdInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintVehicleAndSdSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1
        }
      });
      mintSyntheticDeviceSig2 = await signMessage({
        _signer: sdAddress2,
        _primaryType: 'MintVehicleAndSdSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_2
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintVehicleWithDeviceDefinitionSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos
        }
      });
      mintVehicleOwnerSig2 = await signMessage({
        _signer: user2,
        _primaryType: 'MintVehicleWithDeviceDefinitionSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '2',
          owner: user2.address,
          deviceDefinitionId: C.mockDdId2,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos
        }
      });
      sacdInput1 = {
        ...C.mockSacdInput,
        grantee: user3.address,
        expiration: DEFAULT_EXPIRATION
      };
      sacdInput2 = {
        ...C.mockSacdInput,
        grantee: user3.address,
        expiration: DEFAULT_EXPIRATION
      };
      correctMintInput = [
        {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
          connectionId: C.CONNECTION_ID_1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairsDevice: C.mockSyntheticDeviceAttributeInfoPairs,
          sacdInput: sacdInput1
        },
        {
          manufacturerNode: '2',
          owner: user2.address,
          deviceDefinitionId: C.mockDdId2,
          attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
          connectionId: C.CONNECTION_ID_2,
          vehicleOwnerSig: mintVehicleOwnerSig2,
          syntheticDeviceSig: mintSyntheticDeviceSig2,
          syntheticDeviceAddr: sdAddress2.address,
          attrInfoPairsDevice: C.mockSyntheticDeviceAttributeInfoPairs,
          sacdInput: sacdInput2
        },
      ]
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = JSON.parse(JSON.stringify(correctMintInput));
      });

      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput[0].manufacturerNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if synthetic device parent node is not a connection ID', async () => {
        incorrectMintInput[0].connectionId = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
        ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if caller is not the connection ID owner nor has permissions', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput)
        )
          .to.be.revertedWithCustomError(
            multipleMinterInstance,
            'Unauthorized',
          )
          .withArgs(nonAdmin.address);
      });
      it('Should revert if device address is already registered', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'DeviceAlreadyRegistered'
        ).withArgs(sdAddress1.address);
      });
      it('Should revert if vehicle attribute is not whitelisted', async () => {
        incorrectMintInput[0].attrInfoPairsVehicle =
          C.mockVehicleAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
        ).to.be.revertedWithCustomError(
          multipleMinterInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
      });
      it('Should revert if synthetic device attribute is not whitelisted', async () => {
        incorrectMintInput[0].attrInfoPairsDevice =
          C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                deviceDefinitionId: C.mockDdId2,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if vehicle attributes are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes.slice(1),
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidOwnerSignature');
          });
          it('Should revert if vehicle infos are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleWithDeviceDefinitionSign',
              _verifyingContract: await vehicleInstance.getAddress(),
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfosWrongSize
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                deviceDefinitionId: C.mockDdId1,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput[0].vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
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
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput[0].syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput[0].syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput[0].syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _chainId: 99,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1
              }
            });
            incorrectMintInput[0].syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
          it('Should revert if connection ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: await multipleMinterInstance.getAddress(),
              message: {
                connectionId: '99'
              }
            });
            incorrectMintInput[0].syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdWithDeviceDefinitionSignBatch(incorrectMintInput)
            ).to.be.revertedWithCustomError(multipleMinterInstance, 'InvalidSdSignature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set vehicle parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        const parentNode1 = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          3
        );
        const parentNode2 = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          4
        );

        expect(parentNode1).to.be.equal(1);
        expect(parentNode2).to.be.equal(2);
      });
      it('Should correctly set vehicle node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
        expect(await vehicleIdInstance.ownerOf(4)).to.be.equal(user2.address);
      });
      it('Should correctly set synthetic device parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        const parentNode1 = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1
        );
        const parentNode2 = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          2
        );

        expect(parentNode1).to.be.equal(C.CONNECTION_ID_1);
        expect(parentNode2).to.be.equal(C.CONNECTION_ID_2);
      });
      it('Should correctly set synthetic device node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
        expect(await sdIdInstance.ownerOf(2)).to.be.equal(user2.address);
      });
      it('Should correctly set Device Definition Id', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        expect(
          await vehicleInstance
            .getDeviceDefinitionIdByVehicleId(3)
        ).to.be.equal(C.mockDdId1);
        expect(
          await vehicleInstance
            .getDeviceDefinitionIdByVehicleId(4)
        ).to.be.equal(C.mockDdId2);
      });
      it('Should correctly set synthetic device address', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        const id1 = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address
        );
        const id2 = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress2.address
        );

        expect(id1).to.equal(1);
        expect(id2).to.equal(2);
      });
      it('Should correctly set vehicle infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            2,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            2,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
      });
      it('Should correctly set synthetic device infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

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
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            2,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            2,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo2);
      });
      it('Should correctly map the synthetic device to the vehicle', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            3
          )
        ).to.be.equal(1);
        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            4
          )
        ).to.be.equal(2);
      });
      it('Should correctly map the vehicle to the synthetic device', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.be.equal(3);
        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            2
          )
        ).to.be.equal(4);
      });
      it('Should correctly burn DIMO Credit tokens from the sender', async () => {
        await expect(() =>
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput)
        ).changeTokenBalance(
          mockDimoCreditInstance,
          admin.address,
          -BigInt(C.MINT_VEHICLE_OPERATION_COST) * BigInt(correctMintInput.length)
        );
      });
      it('Should correctly set SACD permissions', async () => {
        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 3, 0, user3.address)
        ).to.eql([0n, 0n, ''])
        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 4, 0, user3.address)
        ).to.eql([0n, 0n, ''])

        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput);

        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 3, 0, user3.address)
        ).to.eql([BigInt(C.mockSacdInput.permissions), BigInt(DEFAULT_EXPIRATION), C.mockSacdInput.source])
        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 4, 0, user3.address)
        ).to.eql([BigInt(C.mockSacdInput.permissions), BigInt(DEFAULT_EXPIRATION), C.mockSacdInput.source])
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMintedWithDeviceDefinition event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleNodeMintedWithDeviceDefinition')
          .withArgs(1, 3, user1.address, C.mockDdId1)
          .to.emit(multipleMinterInstance, 'VehicleNodeMintedWithDeviceDefinition')
          .withArgs(2, 4, user2.address, C.mockDdId2);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            4,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            4,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
      it('Should emit SyntheticDeviceNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(C.CONNECTION_ID_1, 1, 3, sdAddress1.address, user1.address)
          .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(C.CONNECTION_ID_2, 2, 4, sdAddress2.address, user2.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(correctMintInput)
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
          )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            2,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info
          )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            2,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info
          );
      });
      it('Should not emit SyntheticDeviceAttributeSet event if attrInfoPairsDevice is empty', async () => {
        const newCorrectMintInput = JSON.parse(JSON.stringify(correctMintInput))
        newCorrectMintInput[0].attrInfoPairsDevice = []
        newCorrectMintInput[1].attrInfoPairsDevice = []

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdWithDeviceDefinitionSignBatch(newCorrectMintInput)
        ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
      });
    });
  });
});
