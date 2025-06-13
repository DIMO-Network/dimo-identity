import chai from 'chai';
import { ethers } from 'hardhat';
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
  Shared,
  MockDimoToken,
  MockDimoCredit,
  MockSacd,
  MockConnectionsManager
} from '../../typechain-types';
import {
  initialize,
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  MintSyntheticDeviceInput,
  MintSyntheticDeviceBatchInput,
  C,
} from '../../utils';

const { expect } = chai;

describe('SyntheticDevice', function () {
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
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockSacdInstance: MockSacd;
  let mockConnectionsManagerInstance: MockConnectionsManager;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let sdIdInstance: SyntheticDeviceId;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let connectionOwner1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let sdAddress1: HardhatEthersSigner;
  let sdAddress2: HardhatEthersSigner;
  let sdAddress3: HardhatEthersSigner;
  let notMintedSyntheticDevice: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      connectionOwner1,
      user1,
      user2,
      sdAddress1,
      sdAddress2,
      sdAddress3,
      notMintedSyntheticDevice,
    ] = await ethers.getSigners();

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
        'Shared'
      ],
      nfts: [
        'ManufacturerId',
        'VehicleId',
        'SyntheticDeviceId',
      ],
      upgradeableContracts: [],
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
      C.defaultDomainVersion,
    );

    // Mint DIMO Credit tokens to the admin and manufacturer
    await mockDimoCreditInstance
      .connect(admin)
      .mint(admin.address, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(manufacturer1.address, C.manufacturerDimoCreditTokensAmount);

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
        C.mockManufacturerAttributeInfoPairs,
      );

    // TODO Mint connections
    await mockConnectionsManagerInstance.mint(connectionOwner1.address, C.CONNECTION_NAME_1);

    // Setting DimoRegistry address in the AftermarketDeviceId
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    await vehicleInstance
      .connect(admin)
    ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
    await vehicleInstance
      .connect(admin)
    ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId2, C.mockVehicleAttributeInfoPairs);
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
      const deployments = await initialize(
        admin,
        'DimoAccessControl',
        'SyntheticDevice',
      );

      const localDimoAccessControlInstance = deployments.DimoAccessControl;
      localSyntheticDeviceInstance = deployments.SyntheticDevice;

      await localDimoAccessControlInstance
        .connect(admin)
        .grantRole(C.ADMIN_ROLE, admin.address);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localSyntheticDeviceInstance
            .connect(nonAdmin)
            .setSyntheticDeviceIdProxyAddress(await sdIdInstance.getAddress()),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`,
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localSyntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceIdProxyAddress(C.ZERO_ADDRESS),
        ).to.be.revertedWithCustomError(
          localSyntheticDeviceInstance,
          'ZeroAddress',
        );
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceIdProxySet event with correct params', async () => {
        await expect(
          localSyntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceIdProxyAddress(await sdIdInstance.getAddress()),
        )
          .to.emit(localSyntheticDeviceInstance, 'SyntheticDeviceIdProxySet')
          .withArgs(await sdIdInstance.getAddress());
      });
    });
  });

  describe('addSyntheticDeviceAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(nonAdmin)
            .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`,
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'AttributeExists',
          )
          .withArgs(C.mockSyntheticDeviceAttribute1);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceAttributeAdded event with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute3),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeAdded')
          .withArgs(C.mockSyntheticDeviceAttribute3);
      });
    });
  });

  describe('mintSyntheticDeviceBatch', () => {
    let incorrectMintInput: MintSyntheticDeviceBatchInput[];
    let correctMintInput: MintSyntheticDeviceBatchInput[] = [];

    before(async () => {
      correctMintInput = [
        {
          vehicleNode: '1',
          syntheticDeviceAddr: await sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
        },
        {
          vehicleNode: '2',
          syntheticDeviceAddr: await sdAddress2.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
        },
      ];
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = JSON.parse(JSON.stringify(correctMintInput));
      });

      it('Should revert if caller does not have MINT_SD_ROLE', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(nonAdmin)
            .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.MINT_SD_ROLE
          }`,
        );
      });
      it('Should revert if parent node is not a connection ID', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceBatch(99, incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidParentNode',
          )
          .withArgs(99);
      });
      it('Should revert if node is not a Vehicle', async () => {
        incorrectMintInput[0].vehicleNode = '99';

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, incorrectMintInput),
        )
          .to.be.revertedWithCustomError(syntheticDeviceInstance, 'InvalidNode')
          .withArgs(await vehicleIdInstance.getAddress(), 99);
      });
      it('Should revert if device address is already registered', async () => {
        incorrectMintInput[0].vehicleNode = '3';

        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'DeviceAlreadyRegistered',
          )
          .withArgs(sdAddress1.address);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        incorrectMintInput[0].attrInfoPairs =
          C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'AttributeNotWhitelisted',
          )
          .withArgs(
            C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted[1].attribute,
          );
      });
      it('Should revert if vehicle is already paired', async () => {
        incorrectMintInput[0].syntheticDeviceAddr = sdAddress3.address;

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'VehiclePaired',
          )
          .withArgs(1);
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1,
        );

        expect(parentNode).to.be.equal(C.CONNECTION_ID_1);
      });
      it('Should correctly set node owner', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set device address', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address,
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set infos', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1,
          ),
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2,
          ),
        ).to.be.equal(C.mockSyntheticDeviceInfo2);
      });
      it('Should correctly map the synthetic device to the vehicle', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the synthetic device', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(1);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceNodeMinted event with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(C.CONNECTION_ID_1, 1, 1, sdAddress1.address, user1.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .mintSyntheticDeviceBatch(C.CONNECTION_ID_1, correctMintInput),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info,
          )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info,
          )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            2,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info,
          )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            2,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info,
          );
      });
    });
  });

  describe('mintSyntheticDeviceSign', () => {
    let mintSyntheticDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintSyntheticDeviceInput;
    let incorrectMintInput: MintSyntheticDeviceInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      correctMintInput = {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = { ...correctMintInput };
      });

      it('Should revert if parent node is not a connection ID', async () => {
        incorrectMintInput.connectionId = '99';

        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidParentNode',
          )
          .withArgs(99);
      });
      it('Should revert if node is not a Vehicle', async () => {
        incorrectMintInput.vehicleNode = '99';

        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(incorrectMintInput),
        )
          .to.be.revertedWithCustomError(syntheticDeviceInstance, 'InvalidNode')
          .withArgs(await vehicleIdInstance.getAddress(), 99);
      });
      it('Should revert if device address is already registered', async () => {
        incorrectMintInput.vehicleNode = '2';

        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'DeviceAlreadyRegistered',
          )
          .withArgs(sdAddress1.address);
      });
      it('Should revert if owner is not the vehicle node owner', async () => {
        incorrectMintInput.vehicleNode = '2';

        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user2.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);

        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(incorrectMintInput),
        ).to.be.revertedWithCustomError(
          syntheticDeviceInstance,
          'InvalidSdSignature',
        );
      });
      it('Should revert if attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairs =
          C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'AttributeNotWhitelisted',
          )
          .withArgs(
            C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted[1].attribute,
          );
      });
      it('Should revert if vehicle is already paired', async () => {
        incorrectMintInput.syntheticDeviceAddr = sdAddress2.address;

        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(incorrectMintInput),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'VehiclePaired',
          )
          .withArgs(1);
      });

      context('Wrong signature', () => {
        context('Synthetic device signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress2,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidSdSignature',
            );
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidSdSignature',
            );
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainVersion: '99',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidSdSignature',
            );
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _chainId: 99,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidSdSignature',
            );
          });
          it('Should revert if connection ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: '99',
                vehicleNode: '1',
              },
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidSdSignature',
            );
          });
          it('Should revert if vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '2',
              },
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidSdSignature',
            );
          });
        });

        context('Vehicle owner signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '1',
              },
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if connection ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: '99',
                vehicleNode: '1',
              },
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintSyntheticDeviceSign',
              _verifyingContract: await syntheticDeviceInstance.getAddress(),
              message: {
                connectionId: C.CONNECTION_ID_1,
                vehicleNode: '2',
              },
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              syntheticDeviceInstance
                .connect(connectionOwner1)
                .mintSyntheticDeviceSign(incorrectMintInput),
            ).to.be.revertedWithCustomError(
              syntheticDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1,
        );

        expect(parentNode).to.be.equal(C.CONNECTION_ID_1);
      });
      it('Should correctly set node owner', async () => {
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set device address', async () => {
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address,
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set infos', async () => {
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1,
          ),
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2,
          ),
        ).to.be.equal(C.mockSyntheticDeviceInfo2);
      });
      it('Should correctly map the synthetic device to the vehicle', async () => {
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the synthetic device', async () => {
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(1);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceNodeMinted event with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(correctMintInput),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(C.CONNECTION_ID_1, 1, 1, sdAddress1.address, user1.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(correctMintInput),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info,
          );
      });
      it('Should not emit SyntheticDeviceAttributeSet event if attrInfoPairsDevice is empty', async () => {
        correctMintInput = {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: [],
        };

        await expect(
          syntheticDeviceInstance
            .connect(connectionOwner1)
            .mintSyntheticDeviceSign(correctMintInput),
        ).to.not.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet');
      });
    });
  });

  describe('burnSyntheticDeviceSign', () => {
    let mintSyntheticDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let mintSyntheticDeviceSig2: string;
    let mintVehicleOwnerSig2: string;
    let burnSyntheticDeviceOwnerSig1: string;
    let mintInput1: MintSyntheticDeviceInput;
    let mintInput2: MintSyntheticDeviceInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      mintSyntheticDeviceSig2 = await signMessage({
        _signer: sdAddress2,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '2',
        },
      });
      mintVehicleOwnerSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '2',
        },
      });
      mintInput1 = {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };
      mintInput2 = {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '2',
        syntheticDeviceSig: mintSyntheticDeviceSig2,
        vehicleOwnerSig: mintVehicleOwnerSig2,
        syntheticDeviceAddr: sdAddress2.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };
      burnSyntheticDeviceOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'BurnSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          vehicleNode: '1',
          syntheticDeviceNode: '1',
        },
      });
    });

    beforeEach(async () => {
      await syntheticDeviceInstance
        .connect(connectionOwner1)
        .mintSyntheticDeviceSign(mintInput1);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have BURN_SD_ROLE', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(nonAdmin)
            .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.BURN_SD_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .burnSyntheticDeviceSign(99, 1, burnSyntheticDeviceOwnerSig1),
        )
          .to.be.revertedWithCustomError(syntheticDeviceInstance, 'InvalidNode')
          .withArgs(await vehicleIdInstance.getAddress(), 99);
      });
      it('Should revert if node is not a Synthetic Device', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .burnSyntheticDeviceSign(1, 99, burnSyntheticDeviceOwnerSig1),
        )
          .to.be.revertedWithCustomError(syntheticDeviceInstance, 'InvalidNode')
          .withArgs(await sdIdInstance.getAddress(), 99);
      });
      it('Should revert if Vehicle is paired to another Synthetic Device', async () => {
        const localBurnSyntheticDeviceOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'BurnSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            vehicleNode: '2',
            syntheticDeviceNode: '1',
          },
        });

        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(mintInput2);

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .burnSyntheticDeviceSign(2, 1, localBurnSyntheticDeviceOwnerSig),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'VehicleNotPaired',
          )
          .withArgs(2);
      });
      it('Should revert if Synthetic Device is paired to another Vehicle', async () => {
        const localBurnSyntheticDeviceOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'BurnSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            vehicleNode: '1',
            syntheticDeviceNode: '2',
          },
        });

        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(mintInput2);

        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .burnSyntheticDeviceSign(1, 2, localBurnSyntheticDeviceOwnerSig),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'VehicleNotPaired',
          )
          .withArgs(1);
      });

      context('Wrong signature', () => {
        it('Should revert if signer does not match synthetic device owner', async () => {
          const invalidSignature = await signMessage({
            _signer: user2,
            _primaryType: 'BurnSyntheticDeviceSign',
            _verifyingContract: await syntheticDeviceInstance.getAddress(),
            message: {
              vehicleNode: '1',
              syntheticDeviceNode: '1',
            },
          });

          await expect(
            syntheticDeviceInstance
              .connect(admin)
              .burnSyntheticDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if domain name is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'BurnSyntheticDeviceSign',
            _verifyingContract: await syntheticDeviceInstance.getAddress(),
            message: {
              vehicleNode: '1',
              syntheticDeviceNode: '1',
            },
          });

          await expect(
            syntheticDeviceInstance
              .connect(admin)
              .burnSyntheticDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'BurnSyntheticDeviceSign',
            _verifyingContract: await syntheticDeviceInstance.getAddress(),
            message: {
              vehicleNode: '1',
              syntheticDeviceNode: '1',
            },
          });

          await expect(
            syntheticDeviceInstance
              .connect(admin)
              .burnSyntheticDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'BurnSyntheticDeviceSign',
            _verifyingContract: await syntheticDeviceInstance.getAddress(),
            message: {
              vehicleNode: '1',
              syntheticDeviceNode: '1',
            },
          });

          await expect(
            syntheticDeviceInstance
              .connect(admin)
              .burnSyntheticDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if vehicle node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'BurnSyntheticDeviceSign',
            _verifyingContract: await syntheticDeviceInstance.getAddress(),
            message: {
              vehicleNode: '99',
              syntheticDeviceNode: '1',
            },
          });

          await expect(
            syntheticDeviceInstance
              .connect(admin)
              .burnSyntheticDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if synthetic device node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'BurnSyntheticDeviceSign',
            _verifyingContract: await syntheticDeviceInstance.getAddress(),
            message: {
              vehicleNode: '1',
              syntheticDeviceNode: '99',
            },
          });

          await expect(
            syntheticDeviceInstance
              .connect(admin)
              .burnSyntheticDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
      });
    });

    context('State', () => {
      it('Should correctly reset parent node to 0', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1,
        );

        expect(parentNode).to.be.equal(0);
      });
      it('Should correctly reset node owner to zero address', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1);

        await expect(sdIdInstance.ownerOf(1)).to.be.revertedWith(
          'ERC721: invalid token ID',
        );
      });
      it('Should correctly reset device address do zero address', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address,
        );

        expect(id).to.equal(0);
      });
      it('Should correctly reset infos to blank', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2,
          ),
        ).to.be.equal('');
      });
      it('Should correctly reset mapping the synthetic device to 0', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1);

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(0);
      });
      it('Should correctly reset mapping the vehicle to 0', async () => {
        await syntheticDeviceInstance
          .connect(admin)
          .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceNodeBurned event with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceNodeBurned')
          .withArgs(1, 1, user1.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .burnSyntheticDeviceSign(1, 1, burnSyntheticDeviceOwnerSig1),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(1, C.mockSyntheticDeviceAttributeInfoPairs[0].attribute, '')
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            '',
          );
      });
    });
  });

  describe('setSyntheticDeviceInfo', () => {
    let mintInput: MintSyntheticDeviceInput;

    before(async () => {
      const mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      const mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      mintInput = {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };
    });

    beforeEach(async () => {
      await syntheticDeviceInstance
        .connect(connectionOwner1)
        .mintSyntheticDeviceSign(mintInput);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have SET_SD_INFO_ROLE', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(nonAdmin)
            .setSyntheticDeviceInfo(1, C.mockSyntheticDeviceAttributeInfoPairs),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.SET_SD_INFO_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Synthetic Device', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceInfo(
              99,
              C.mockSyntheticDeviceAttributeInfoPairs,
            ),
        )
          .to.be.revertedWithCustomError(syntheticDeviceInstance, 'InvalidNode')
          .withArgs(await sdIdInstance.getAddress(), 99);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceInfo(
              1,
              C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted,
            ),
        )
          .to.be.revertedWithCustomError(
            syntheticDeviceInstance,
            'AttributeNotWhitelisted',
          )
          .withArgs(
            C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted[1].attribute,
          );
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockSyntheticDeviceAttributeInfoPairs),
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1,
          ),
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2,
          ),
        ).to.be.equal(C.mockSyntheticDeviceInfo2);

        await syntheticDeviceInstance
          .connect(admin)
          .setSyntheticDeviceInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1,
          ),
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2,
          ),
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          syntheticDeviceInstance
            .connect(admin)
            .setSyntheticDeviceInfo(1, C.mockSyntheticDeviceAttributeInfoPairs),
        )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info,
          )
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info,
          );
      });
    });
  });

  describe('getSyntheticDeviceIdByAddress', () => {
    let mintInput: MintSyntheticDeviceInput;

    before(async () => {
      const mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      const mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      mintInput = {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };
    });

    beforeEach(async () => {
      await syntheticDeviceInstance
        .connect(connectionOwner1)
        .mintSyntheticDeviceSign(mintInput);
    });

    it('Should return 0 if the queried address is not associated with any minted device', async () => {
      const tokenId =
        await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          notMintedSyntheticDevice.address,
        );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId =
        await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address,
        );

      expect(tokenId).to.equal(1);
    });
  });

  describe('getSyntheticDeviceAddressById', () => {
    let mintInput: MintSyntheticDeviceInput;

    before(async () => {
      const mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      const mintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
        },
      });
      mintInput = {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };
    });

    beforeEach(async () => {
      await syntheticDeviceInstance
        .connect(connectionOwner1)
        .mintSyntheticDeviceSign(mintInput);
    });

    it('Should return 0x00 address if the queried node ID is not associated with any minted device', async () => {
      const address =
        await syntheticDeviceInstance.getSyntheticDeviceAddressById(99);

      expect(address).to.equal(C.ZERO_ADDRESS);
    });
    it('Should return the correct address', async () => {
      const address =
        await syntheticDeviceInstance.getSyntheticDeviceAddressById(1);

      expect(address).to.equal(sdAddress1.address);
    });
  });

  describe('validateSdBurnAndResetNode', () => {
    it('Should revert if caller is not the NFT Proxy', async () => {
      await expect(
        syntheticDeviceInstance.connect(nonAdmin).validateSdBurnAndResetNode(1)
      ).to.be.revertedWithCustomError(syntheticDeviceInstance, 'OnlyNftProxy');
    });
  });
});
