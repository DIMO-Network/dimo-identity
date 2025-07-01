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
  AftermarketDevice,
  AftermarketDeviceId,
  Shared,
  MockDimoToken,
  MockDimoCredit,
  MockManufacturerLicense,
  MockSacd,
  MockConnectionsManager,
  MockStorageNode
} from '../../typechain-types';
import {
  initialize,
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  SacdInput,
  C
} from '../../utils';

const { expect } = chai;

describe('Vehicle', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let syntheticDeviceInstance: SyntheticDevice;
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockManufacturerLicenseInstance: MockManufacturerLicense;
  let mockConnectionsManagerInstance: MockConnectionsManager;
  let mockSacdInstance: MockSacd;
  let mockStorageNodeInstance: MockStorageNode;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let sdIdInstance: SyntheticDeviceId;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let connectionOwner1: HardhatEthersSigner;
  let storageNodeOwner1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let adAddress1: HardhatEthersSigner;
  let adAddress2: HardhatEthersSigner;
  let sdAddress1: HardhatEthersSigner;

  let DEFAULT_EXPIRATION: string

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList)
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted)
  );

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      connectionOwner1,
      storageNodeOwner1,
      user1,
      user2,
      adAddress1,
      adAddress2,
      sdAddress1
    ] = await ethers.getSigners();

    DEFAULT_EXPIRATION = ((await time.latest()) + time.duration.years(1)).toString()

    mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
    mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'Charging',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Vehicle',
        'AftermarketDevice',
        'SyntheticDevice',
        'Mapper',
        'Shared'
      ],
      nfts: [
        'ManufacturerId',
        'VehicleId',
        'AftermarketDeviceId',
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
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    sharedInstance = deployments.Shared;
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;
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

    // Deploy MockManufacturerLicense contract
    const MockManufacturerLicenseFactory = await ethers.getContractFactory('MockManufacturerLicense');
    mockManufacturerLicenseInstance = await MockManufacturerLicenseFactory.connect(admin).deploy();

    // Deploy MockSacd contract
    const MockSacdFactory = await ethers.getContractFactory('MockSacd');
    mockSacdInstance = await MockSacdFactory.connect(admin).deploy();

    // Deploy MockStorageNode contract
    const MockStorageNodeFactory = await ethers.getContractFactory('MockStorageNode');
    mockStorageNodeInstance = await MockStorageNodeFactory.connect(admin).deploy(DIMO_REGISTRY_ADDRESS);

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
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(await vehicleIdInstance.getAddress());
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(await adIdInstance.getAddress());
    await syntheticDeviceInstance
      .connect(admin)
      .setSyntheticDeviceIdProxyAddress(await sdIdInstance.getAddress());

    // Initialize EIP-712
    await eip712CheckerInstance
      .connect(admin)
      .initialize(
        C.defaultDomainName,
        C.defaultDomainVersion
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
      .setManufacturerLicense(await mockManufacturerLicenseInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setConnectionsManager(await mockConnectionsManagerInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setSacd(await mockSacdInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setStorageNode(await mockStorageNodeInstance.getAddress());

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

    // Whitelist AftermarketDevice attributes
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1);
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute2);

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

    // Mint Connection ID
    await mockConnectionsManagerInstance
      .mint(
        connectionOwner1.address,
        C.CONNECTION_NAME_1
      );

    // Mint Storage Node IDs
    await mockStorageNodeInstance
      .mint(
        admin.address,
        C.STORAGE_NODE_LABEL_DEFAULT
      );
    await mockStorageNodeInstance
      .mint(
        storageNodeOwner1.address,
        C.STORAGE_NODE_LABEL_1
      );

    await mockManufacturerLicenseInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Setting DimoRegistry address in the Proxy IDs
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await manufacturerIdInstance.setDimoRegistryAddress(
      DIMO_REGISTRY_ADDRESS
    );

    await vehicleIdInstance
      .connect(admin)
      .setSacdAddress(await mockSacdInstance.getAddress());
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setVehicleIdProxyAddress', () => {
    let localVehicleInstance: Vehicle;
    beforeEach(async () => {
      const deployments = await initialize(
        admin,
        'DimoAccessControl',
        'Vehicle'
      );

      const localDimoAccessControlInstance = deployments.DimoAccessControl;
      localVehicleInstance = deployments.Vehicle;

      await localDimoAccessControlInstance
        .connect(admin)
        .grantRole(C.ADMIN_ROLE, admin.address);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localVehicleInstance
            .connect(nonAdmin)
            .setVehicleIdProxyAddress(await localVehicleInstance.getAddress())
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localVehicleInstance
            .connect(admin)
            .setVehicleIdProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWithCustomError(localVehicleInstance, 'ZeroAddress');
      });
    });

    context('Events', () => {
      it('Should emit VehicleIdProxySet event with correct params', async () => {
        await expect(
          localVehicleInstance
            .connect(admin)
            .setVehicleIdProxyAddress(await localVehicleInstance.getAddress())
        )
          .to.emit(localVehicleInstance, 'VehicleIdProxySet')
          .withArgs(await localVehicleInstance.getAddress());
      });
    });
  });

  describe('addVehicleAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          vehicleInstance
            .connect(nonAdmin)
            .addVehicleAttribute(C.mockVehicleAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .addVehicleAttribute(C.mockVehicleAttribute1)
        ).to.be.revertedWithCustomError(vehicleInstance, 'AttributeExists')
          .withArgs(C.mockVehicleAttribute1);
      });
    });

    context('Events', () => {
      it('Should emit VehicleAttributeAdded event with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .addVehicleAttribute(C.mockVehicleAttribute3)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeAdded')
          .withArgs(C.mockVehicleAttribute3);
      });
    });
  });

  describe('mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])', () => {
    context('Error handling', () => {
      it('Should revert if parent node is not a manufacturer node', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
            99,
            user1.address,
            C.STORAGE_NODE_ID_1,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
          )
        ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
            1,
            user1.address,
            C.STORAGE_NODE_ID_1,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairsNotWhitelisted
          )
        ).to.be.revertedWithCustomError(
          vehicleInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
      });
      it('Should revert Storage Node ID does not exist', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
            1,
            user1.address,
            99,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairsNotWhitelisted
          )
        ).to.be.revertedWithCustomError(
          vehicleInstance,
          'InvalidStorageNode'
        ).withArgs(99);
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
          1,
          user1.address,
          C.STORAGE_NODE_ID_1,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs
        );

        const parentNode = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          1
        );
        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set node owner', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
          1,
          user1.address,
          C.STORAGE_NODE_ID_1,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs
        );

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set Device Definition Id', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
          1,
          user1.address,
          C.STORAGE_NODE_ID_1,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs
        );

        expect(
          await vehicleInstance
            .getDeviceDefinitionIdByVehicleId(1)
        ).to.be.equal(C.mockDdId1);
      });
      it('Should correctly set infos', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
          1,
          user1.address,
          C.STORAGE_NODE_ID_1,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs
        );

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
      it('Should correctly burn DIMO Credit tokens from the sender', async () => {
        await expect(() =>
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
            1,
            user1.address,
            C.STORAGE_NODE_ID_1,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs
          )
        ).changeTokenBalance(
          mockDimoCreditInstance,
          admin.address,
          -C.MINT_VEHICLE_OPERATION_COST
        );
      });
      it('Should correctly set Storage Node ID for vehicle ID', async () => {
        const nodeIdForVehicleBefore = await mockStorageNodeInstance.vehicleIdToNodeId(1);
        expect(nodeIdForVehicleBefore).to.equal(0)

        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
          1,
          user1.address,
          C.STORAGE_NODE_ID_1,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs
        )

        const nodeIdForVehicleAfter = await mockStorageNodeInstance.vehicleIdToNodeId(1);        
        expect(nodeIdForVehicleAfter).to.equal(C.STORAGE_NODE_ID_1)
      });
      it.skip('Should correctly set Storage Node ID Default for vehicle ID if no Storage Node ID is specified')
    });

    context('Events', () => {
      it('Should emit VehicleNodeMintedWithDeviceDefinition event with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
            1,
            user1.address,
            C.STORAGE_NODE_ID_1,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs
          )
        )
          .to.emit(vehicleInstance, 'VehicleNodeMintedWithDeviceDefinition')
          .withArgs(1, 1, user1.address, C.mockDdId1);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
            1,
            user1.address,
            C.STORAGE_NODE_ID_1,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs
          )
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
      it('Should not emit VehicleAttributeSet event if attrInfo is empty', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
            1,
            user1.address,
            C.STORAGE_NODE_ID_1,
            C.mockDdId1,
            []
          )
        ).to.not.emit(vehicleInstance, 'VehicleAttributeSet');
      });
    });
  });

  describe('mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))', () => {
    let sacdInput: SacdInput;
    before(() => {
      sacdInput = {
        ...C.mockSacdInput,
        grantee: user2.address,
        expiration: DEFAULT_EXPIRATION
      };
    })

    context('Error handling', () => {
      it('Should revert if parent node is not a manufacturer node', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
            99,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            sacdInput
          )
        ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairsNotWhitelisted,
            sacdInput
          )
        ).to.be.revertedWithCustomError(
          vehicleInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
          1,
          user1.address,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs,
          sacdInput
        );

        const parentNode = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          1
        );
        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set node owner', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
          1,
          user1.address,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs,
          sacdInput
        );

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set Device Definition Id', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
          1,
          user1.address,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs,
          sacdInput
        );

        expect(
          await vehicleInstance
            .getDeviceDefinitionIdByVehicleId(1)
        ).to.be.equal(C.mockDdId1);
      });
      it('Should correctly set infos', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
          1,
          user1.address,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs,
          sacdInput
        );

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
      it('Should correctly burn DIMO Credit tokens from the sender', async () => {
        await expect(() =>
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            sacdInput
          )
        ).changeTokenBalance(
          mockDimoCreditInstance,
          admin.address,
          -C.MINT_VEHICLE_OPERATION_COST
        );
      });
      it('Should correctly set SACD permissions', async () => {
        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 1, 0, user2.address)
        ).to.eql([0n, 0n, ''])

        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
          1,
          user1.address,
          C.mockDdId1,
          C.mockVehicleAttributeInfoPairs,
          sacdInput
        )

        expect(
          await mockSacdInstance.permissionRecords(await vehicleIdInstance.getAddress(), 1, 0, user2.address)
        ).to.eql([BigInt(C.mockSacdInput.permissions), BigInt(DEFAULT_EXPIRATION), C.mockSacdInput.source])
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMintedWithDeviceDefinition event with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            sacdInput
          )
        )
          .to.emit(vehicleInstance, 'VehicleNodeMintedWithDeviceDefinition')
          .withArgs(1, 1, user1.address, C.mockDdId1);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            sacdInput
          )
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
      it('Should not emit VehicleAttributeSet event if attrInfo is empty', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
          ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
            1,
            user1.address,
            C.mockDdId1,
            [],
            sacdInput
          )
        ).to.not.emit(vehicleInstance, 'VehicleAttributeSet');
      });
    });
  });

  describe('mintVehicleWithDeviceDefinitionSign', () => {
    let signature: string;
    before(async () => {
      signature = await signMessage({
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
    });

    context('Error handling', () => {
      it('Should revert if caller does not have MINT_VEHICLE_ROLE', async () => {
        await expect(
          vehicleInstance
            .connect(nonAdmin)
            .mintVehicleWithDeviceDefinitionSign(
              99,
              user1.address,
              C.mockDdId1,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.MINT_VEHICLE_ROLE
          }`
        );
      });
      it('Should revert if parent node is not a manufacturer node', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleWithDeviceDefinitionSign(
              99,
              user1.address,
              C.mockDdId1,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidParentNode')
          .withArgs(99);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleWithDeviceDefinitionSign(
              1,
              user1.address,
              C.mockDdId1,
              C.mockVehicleAttributeInfoPairsNotWhitelisted,
              signature
            )
        ).to.be.revertedWithCustomError(
          vehicleInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
      });

      context('Wrong signature', () => {
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
        it('Should revert if manufactuer node is incorrect', async () => {
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
        it('Should revert if attributes are incorrect', async () => {
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
        it('Should revert if infos are incorrect', async () => {
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleWithDeviceDefinitionSign(
                1,
                user1.address,
                C.mockDdId1,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleWithDeviceDefinitionSign(
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

        const parentNode = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          1
        );
        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set node owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleWithDeviceDefinitionSign(
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set Device Definition Id', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleWithDeviceDefinitionSign(
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

        expect(
          await vehicleInstance
            .getDeviceDefinitionIdByVehicleId(1)
        ).to.be.equal(C.mockDdId1);
      });
      it('Should correctly set infos', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleWithDeviceDefinitionSign(
            1,
            user1.address,
            C.mockDdId1,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

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
      it('Should correctly burn DIMO Credit tokens from the sender', async () => {
        await expect(() =>
          vehicleInstance
            .connect(admin)
            .mintVehicleWithDeviceDefinitionSign(
              1,
              user1.address,
              C.mockDdId1,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
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
          vehicleInstance
            .connect(admin)
            .mintVehicleWithDeviceDefinitionSign(
              1,
              user1.address,
              C.mockDdId1,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        )
          .to.emit(vehicleInstance, 'VehicleNodeMintedWithDeviceDefinition')
          .withArgs(1, 1, user1.address, C.mockDdId1);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleWithDeviceDefinitionSign(
              1,
              user1.address,
              C.mockDdId1,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('burnVehicleSign', () => {
    let burnVehicleSig1: string;
    let burnVehicleSig2: string;

    before(async () => {
      burnVehicleSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'BurnVehicleSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          vehicleNode: '1'
        }
      });
      burnVehicleSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'BurnVehicleSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          vehicleNode: '2'
        }
      });
    });

    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
      ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
        1,
        user1.address,
        C.STORAGE_NODE_ID_1,
        C.mockDdId1,
        C.mockVehicleAttributeInfoPairs
      );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have BURN_VEHICLE_ROLE', async () => {
        await expect(
          vehicleInstance.connect(nonAdmin).burnVehicleSign(1, burnVehicleSig1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.BURN_VEHICLE_ROLE
          }`
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(99, burnVehicleSig1)
        ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidNode')
          .withArgs(await vehicleIdInstance.getAddress(), 99);
      });
      it('Should revert if Vehicle is paired to an Aftermarket Device', async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1'
          }
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          localPairSignature
        );

        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig1)
        ).to.be.revertedWithCustomError(vehicleInstance, 'VehiclePaired')
          .withArgs(1);
      });
      it('Should revert if Vehicle is paired to a Synthetic Device', async () => {
        const localMintVehicleOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            connectionId: C.CONNECTION_ID_1,
            vehicleNode: '1'
          }
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            connectionId: C.CONNECTION_ID_1,
            vehicleNode: '1'
          }
        });
        const localMintSdInput = {
          connectionId: C.CONNECTION_ID_1,
          vehicleNode: '1',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await syntheticDeviceInstance
          .connect(connectionOwner1)
          .mintSyntheticDeviceSign(localMintSdInput);

        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig1)
        ).to.be.revertedWithCustomError(vehicleInstance, 'VehiclePaired')
          .withArgs(1);
      });

      context('Wrong signature', () => {
        it('Should revert if signer does not match synthetic device owner', async () => {
          const invalidSignature = await signMessage({
            _signer: user2,
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: await vehicleInstance.getAddress(),
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
        it('Should revert if domain name is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: await vehicleInstance.getAddress(),
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: await vehicleInstance.getAddress(),
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: await vehicleInstance.getAddress(),
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
        it('Should revert if vehicle node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: await vehicleInstance.getAddress(),
            message: {
              vehicleNode: '99'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidOwnerSignature');
        });
      });
    });

    context('State', () => {
      it('Should correctly reset parent node to 0', async () => {
        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig1);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1
        );

        expect(parentNode).to.be.equal(0);
      });
      it('Should correctly reset node owner to zero address', async () => {
        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig1);

        await expect(sdIdInstance.ownerOf(1)).to.be.revertedWith(
          'ERC721: invalid token ID'
        );
      });
      it('Should correctly reset device definition Id to empty if it was minted with DD', async () => {
        await vehicleInstance
          .connect(admin)
        ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
          1,
          user1.address,
          C.STORAGE_NODE_ID_1,
          C.mockDdId2,
          C.mockVehicleAttributeInfoPairs
        );

        expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(2)).to.be.equal(C.mockDdId2);

        await vehicleInstance.connect(admin).burnVehicleSign(2, burnVehicleSig2);

        expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(2)).to.be.empty;
      });
      it('Should correctly reset infos to blank', async () => {
        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig1);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal('');
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion = await vehicleIdInstance.tokenIdToVersion(1);

        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig1);

        expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion + 1n
        );
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeBurned event with correct params', async () => {
        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig1)
        )
          .to.emit(vehicleInstance, 'VehicleNodeBurned')
          .withArgs(1, user1.address);
      });
    });
  });

  describe('setVehicleInfo', () => {
    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
      ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
        1,
        user1.address,
        C.STORAGE_NODE_ID_1,
        C.mockDdId1,
        C.mockVehicleAttributeInfoPairs
      );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have SET_VEHICLE_INFO_ROLE', async () => {
        await expect(
          vehicleInstance
            .connect(nonAdmin)
            .setVehicleInfo(1, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.SET_VEHICLE_INFO_ROLE
          }`
        );
      });
      it('Should revert if node is not a vehicle', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(99, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWithCustomError(vehicleInstance, 'InvalidNode')
          .withArgs(await vehicleIdInstance.getAddress(), 99);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(1, C.mockVehicleAttributeInfoPairsNotWhitelisted)
        ).to.be.revertedWithCustomError(
          vehicleInstance,
          'AttributeNotWhitelisted'
        ).withArgs(C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute);
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockVehicleAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

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

        await vehicleInstance
          .connect(admin)
          .setVehicleInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockVehicleAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(1, localNewAttributeInfoPairs)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[0].attribute,
            localNewAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[1].attribute,
            localNewAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('validateBurnAndResetNode', () => {
    it('Should revert if caller is not the NFT Proxy', async () => {
      await expect(
        vehicleInstance.connect(nonAdmin).validateBurnAndResetNode(1)
      ).to.be.revertedWithCustomError(vehicleInstance, 'OnlyNftProxy');
    });
  });
});
