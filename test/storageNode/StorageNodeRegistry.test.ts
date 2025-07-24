import chai from 'chai';
import { ethers } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
  DIMORegistry,
  Eip712Checker,
  Charging,
  DimoAccessControl,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  Shared,
  StorageNodeRegistry,
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
  C
} from '../../utils';

const { expect } = chai;

describe('StorageNode', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let sharedInstance: Shared;
  let storageNodeRegistryInstance: StorageNodeRegistry;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockManufacturerLicenseInstance: MockManufacturerLicense;
  let mockConnectionsManagerInstance: MockConnectionsManager;
  let mockSacdInstance: MockSacd;
  let mockStorageNodeInstance: MockStorageNode;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;

  let DIMO_REGISTRY_ADDRESS: string;
  let MOCK_STORAGE_NODE_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let connectionOwner1: HardhatEthersSigner;
  let storageNodeOwner1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      connectionOwner1,
      storageNodeOwner1,
      user1,
      user2
    ] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'Charging',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Vehicle',
        'Mapper',
        'Shared',
        'StorageNodeRegistry'
      ],
      nfts: [
        'ManufacturerId',
        'VehicleId'
      ],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    chargingInstance = deployments.Charging;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    sharedInstance = deployments.Shared;
    storageNodeRegistryInstance = deployments.StorageNodeRegistry;
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;

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
    mockStorageNodeInstance = await MockStorageNodeFactory.connect(admin).deploy();
    MOCK_STORAGE_NODE_ADDRESS = await mockStorageNodeInstance.getAddress();

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

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(await vehicleIdInstance.getAddress());

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

    // Setup Storage Node Registry
    await storageNodeRegistryInstance
      .connect(admin)
      .setStorageNode(await mockStorageNodeInstance.getAddress());
    await storageNodeRegistryInstance
      .connect(admin)
      .setDefaultStorageNodeId(C.STORAGE_NODE_ID_DEFAULT)

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

    // Setting DimoRegistry address in the Proxy IDs
    await vehicleIdInstance
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

  describe('setStorageNode', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          storageNodeRegistryInstance
            .connect(nonAdmin)
            .setStorageNode(MOCK_STORAGE_NODE_ADDRESS)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return StorageNode address', async () => {
        await storageNodeRegistryInstance
          .connect(admin)
          .setStorageNode(MOCK_STORAGE_NODE_ADDRESS);

        const storageNodeAddress = await storageNodeRegistryInstance.getStorageNode();

        expect(storageNodeAddress).to.equal(MOCK_STORAGE_NODE_ADDRESS);
      });
    });

    context('Events', () => {
      it('Should emit StorageNodeSet event with correct params', async () => {
        await expect(
          storageNodeRegistryInstance
            .connect(admin)
            .setStorageNode(MOCK_STORAGE_NODE_ADDRESS)
        )
          .to.emit(storageNodeRegistryInstance, 'StorageNodeSet')
          .withArgs(MOCK_STORAGE_NODE_ADDRESS);
      });
    });
  });

  describe('setDefaultStorageNodeId', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          storageNodeRegistryInstance
            .connect(nonAdmin)
            .setDefaultStorageNodeId(C.STORAGE_NODE_ID_DEFAULT)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return StorageNode address', async () => {
        await storageNodeRegistryInstance
          .connect(admin)
          .setDefaultStorageNodeId(C.STORAGE_NODE_ID_DEFAULT);

        const storageNodeIdDdefault = await storageNodeRegistryInstance.getDefaultStorageNodeId();

        expect(storageNodeIdDdefault).to.equal(C.STORAGE_NODE_ID_DEFAULT);
      });
    });
  });

  describe('setStorageNodeIdForVehicle', () => {
    before(async () => {
      await vehicleInstance
        .connect(admin)
      ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](
        1,
        user1.address,
        0,
        C.mockDdId1,
        C.mockVehicleAttributeInfoPairs,
      )
    })

    context('Error handling', () => {
      it('Should revert if caller is not the vehicle ID owner', async () => {
        await expect(
          storageNodeRegistryInstance
            .connect(user2)
            .setStorageNodeIdForVehicle(1, C.STORAGE_NODE_ID_1)
        )
          .to.be.revertedWithCustomError(storageNodeRegistryInstance, 'Unauthorized')
          .withArgs(user2.address)
      });
      it('Should revert if vehicle ID does not exist', async () => {
        await expect(
          storageNodeRegistryInstance
            .connect(user1)
            .setStorageNodeIdForVehicle(99, C.STORAGE_NODE_ID_1)
        )
          .to.be.revertedWithCustomError(storageNodeRegistryInstance, 'InvalidNode')
          .withArgs(await vehicleIdInstance.getAddress(), 99)
      });
      it('Should revert if storage node ID does not exist', async () => {
        await expect(
          storageNodeRegistryInstance
            .connect(user1)
            .setStorageNodeIdForVehicle(1, 99)
        )
          .to.be.revertedWithCustomError(storageNodeRegistryInstance, 'InvalidStorageNode')
          .withArgs(99)
      });
    });

    context('State', () => {
      it('Should correctly set the Storage Node ID', async () => {
        const storageNodeIdBefore = await storageNodeRegistryInstance.vehicleIdToStorageNodeId(1)

        await storageNodeRegistryInstance
          .connect(user1)
          .setStorageNodeIdForVehicle(1, C.STORAGE_NODE_ID_1)

        const storageNodeIdAfter = await storageNodeRegistryInstance.vehicleIdToStorageNodeId(1)

        expect(storageNodeIdBefore).to.not.equal(storageNodeIdAfter);
        expect(storageNodeIdAfter).to.equal(C.STORAGE_NODE_ID_1);
      });
    });

    context('Events', () => {
      it('Should emit VehicleStorageNodeIdSet event with correct params', async () => {
        await expect(
          storageNodeRegistryInstance
            .connect(user1)
            .setStorageNodeIdForVehicle(1, C.STORAGE_NODE_ID_1)
        )
          .to.emit(storageNodeRegistryInstance, 'VehicleStorageNodeIdSet')
          .withArgs(1, C.STORAGE_NODE_ID_1);
      });
    });
  });
});
