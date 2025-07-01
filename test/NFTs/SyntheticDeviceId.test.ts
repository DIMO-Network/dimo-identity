import chai from 'chai';
import { ethers } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { time } from '@nomicfoundation/hardhat-network-helpers';

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
  MockDimoCredit,
  MockSacd,
  MockConnectionsManager,
  MockStorageNode
} from '../../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../../utils';

const { expect } = chai;

describe('SyntheticDeviceId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let dimoAccessControlInstance: DimoAccessControl;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let syntheticDeviceInstance: SyntheticDevice;
  let mapperInstance: Mapper;
  let sharedInstance: Shared;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let sdIdInstance: SyntheticDeviceId;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockSacdInstance: MockSacd;
  let mockConnectionsManagerInstance: MockConnectionsManager;
  let mockStorageNodeInstance: MockStorageNode;

  let DIMO_REGISTRY_ADDRESS: string;
  let expiresAtDefault: number;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let connectionOwner1: HardhatEthersSigner;
  let storageNodeOwner1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let sdAddress1: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      connectionOwner1,
      storageNodeOwner1,
      user1,
      user2,
      sdAddress1
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
        'SyntheticDeviceId'
      ],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    chargingInstance = deployments.Charging;
    dimoAccessControlInstance = deployments.DimoAccessControl;
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

    // Deploy MockDimoCredit contract
    const MockDimoCreditFactory = await ethers.getContractFactory(
      'MockDimoCredit'
    );
    mockDimoCreditInstance = await MockDimoCreditFactory.connect(admin).deploy();

    // Deploy MockSacd
    const MockSacdFactory = await ethers.getContractFactory('MockSacd');
    mockSacdInstance = await MockSacdFactory.connect(admin).deploy();

    // Deploy MockConnectionsManager contract
    const MockConnectionsManagerFactory = await ethers.getContractFactory(
      'MockConnectionsManager'
    );
    mockConnectionsManagerInstance = await MockConnectionsManagerFactory
      .connect(admin)
      .deploy(C.CONNECTIONS_MANAGER_ERC721_NAME, C.CONNECTIONS_MANAGER_ERC721_SYMBOL);

    // Deploy MockStorageNode contract
    const MockStorageNodeFactory = await ethers.getContractFactory('MockStorageNode');
    mockStorageNodeInstance = await MockStorageNodeFactory.connect(admin).deploy(DIMO_REGISTRY_ADDRESS);

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
      .setDimoCredit(await mockDimoCreditInstance.getAddress());
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

    // Set Dimo Registry in the NFTs
    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await vehicleIdInstance
      .connect(admin)
      .setSacdAddress(await mockSacdInstance.getAddress());

    // Set DimoForwarder in the SyntheticDeviceId
    await sdIdInstance
      .connect(admin)
      .setTrustedForwarder(await vehicleIdInstance.getAddress(), true);

    // Set SyntheticDeviceId in the VehicleId
    await vehicleIdInstance
      .connect(admin)
      .setSyntheticDeviceIdAddress(await sdIdInstance.getAddress());

    // Grant synthetic device minting permission to admin
    expiresAtDefault = (await time.latest()) + 31556926; // + 1 year
    await sharedInstance.connect(admin).setSacd(mockSacdInstance);
    await mockSacdInstance.setPermissions(mockConnectionsManagerInstance, C.CONNECTION_ID_1, admin, 12, expiresAtDefault, '');

    // Minting and linking a vehicle to a synthetic device
    const mintSyntheticDeviceSig1 = await signMessage({
      _signer: sdAddress1,
      _primaryType: 'MintSyntheticDeviceSign',
      _verifyingContract: await syntheticDeviceInstance.getAddress(),
      message: {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '1'
      }
    });
    const mintVehicleOwnerSig1 = await signMessage({
      _signer: user1,
      _primaryType: 'MintSyntheticDeviceSign',
      _verifyingContract: await syntheticDeviceInstance.getAddress(),
      message: {
        connectionId: C.CONNECTION_ID_1,
        vehicleNode: '1'
      }
    });
    const correctMintInput1 = {
      connectionId: C.CONNECTION_ID_1,
      vehicleNode: '1',
      syntheticDeviceSig: mintSyntheticDeviceSig1,
      vehicleOwnerSig: mintVehicleOwnerSig1,
      syntheticDeviceAddr: sdAddress1.address,
      attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
    };

    await vehicleInstance
      .connect(admin)
    ['mintVehicleWithDeviceDefinition(uint256,address,uint256,string,(string,string)[])'](1, user1.address, C.STORAGE_NODE_ID_1, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
    await syntheticDeviceInstance
      .connect(connectionOwner1)
      .mintSyntheticDeviceSign(correctMintInput1);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setDimoRegistryAddress', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        sdIdInstance.connect(nonAdmin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
    it('Should revert if addr is zero address', async () => {
      await expect(
        sdIdInstance.connect(admin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWithCustomError(sdIdInstance, 'ZeroAddress');
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        sdIdInstance.connect(nonAdmin).setTrustedForwarder(C.ZERO_ADDRESS, true)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set address as trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .false;

      await sdIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .true;
    });
    it('Should correctly set address as not trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();
      await sdIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .true;

      await sdIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, false);

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .false;
    });
  });

  context('On transfer', () => {
    context('Error handling', () => {
      it('Should revert if caller is approved, but not the token owner', async () => {
        await expect(
          sdIdInstance
            .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          )
        ).to.be.revertedWithCustomError(sdIdInstance, 'Unauthorized');
      });
    });

    context('State', () => {
      it('Should transfer vehicle ID to the new owner', async () => {
        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await vehicleIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          1
        );

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
      it('Should transfer synthetic device ID to the new owner', async () => {
        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await vehicleIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          1
        );

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
      it('Should keep pairing link between vehicle ID and synthetic device ID', async () => {
        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1
          )
        ).to.equal(1);
        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.equal(1);

        await vehicleIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          1
        );

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1
          )
        ).to.equal(1);
        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.equal(1);
      });
      it('Should keep the synthetic device ID parent node', async () => {
        expect(
          await nodesInstance.getParentNode(await sdIdInstance.getAddress(), 1)
        ).to.equal(C.CONNECTION_ID_1);

        await vehicleIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          1
        );

        expect(
          await nodesInstance.getParentNode(await sdIdInstance.getAddress(), 1)
        ).to.equal(C.CONNECTION_ID_1);
      });
      it('Should keep the same synthetic device ID infos', async () => {
        for (const attrInfoPair of C.mockSyntheticDeviceAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await sdIdInstance.getAddress(),
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }

        await vehicleIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          1
        );

        for (const attrInfoPair of C.mockSyntheticDeviceAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await sdIdInstance.getAddress(),
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should keep the same synthetic device address', async () => {
        expect(
          await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sdAddress1.address
          )
        ).to.equal(1);

        await vehicleIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          1
        );

        expect(
          await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sdAddress1.address
          )
        ).to.equal(1);
      });
    });
  });

  describe('burn', () => {
    context('Error handling', () => {
      it('Should revert if token is not a Synthetic Device', async () => {
        await expect(sdIdInstance.connect(user1).burn(99))
          .to.be.revertedWithCustomError(syntheticDeviceInstance, 'InvalidNode')
          .withArgs(await sdIdInstance.getAddress(), 99);
      });
      it('Should revert if caller is not the token owner', async () => {
        await expect(sdIdInstance.connect(user2).burn(1))
          .to.be.revertedWith('ERC721: caller is not token owner or approved');
      });
    });

    context('State', () => {
      it('Should correctly reset parent node to 0', async () => {
        await sdIdInstance.connect(user1).burn(1);

        const parentNode = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1,
        );

        expect(parentNode).to.be.equal(0);
      });
      it('Should correctly reset synthetic device address to 0', async () => {
        const sdAddressBefore = await syntheticDeviceInstance.getSyntheticDeviceAddressById(1);
        const sdIdBefore = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(sdAddress1.address);

        expect(sdAddressBefore).to.be.equal(sdAddress1.address);
        expect(sdIdBefore).to.be.equal(sdIdBefore);

        await sdIdInstance.connect(user1).burn(1);

        const sdAddressAfter = await syntheticDeviceInstance.getSyntheticDeviceAddressById(1);
        const sdIdAfter = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(sdAddress1.address);

        expect(sdAddressAfter).to.be.equal(C.ZERO_ADDRESS);
        expect(sdIdAfter).to.be.equal(0);
      });
      it('Should correctly reset node link', async () => {
        const vehicleIdAddress = await vehicleIdInstance.getAddress();
        const sdIdAddress = await sdIdInstance.getAddress();

        expect(await mapperInstance.getNodeLink(vehicleIdAddress, sdIdAddress, 1)).to.equal(1);
        expect(await mapperInstance.getNodeLink(sdIdAddress, vehicleIdAddress, 1)).to.equal(1);

        await sdIdInstance.connect(user1).burn(1);

        expect(await mapperInstance.getNodeLink(vehicleIdAddress, sdIdAddress, 1)).to.equal(0);
        expect(await mapperInstance.getNodeLink(sdIdAddress, vehicleIdAddress, 1)).to.equal(0);
      });
      it('Should correctly reset node owner to zero address', async () => {
        await sdIdInstance.connect(user1).burn(1);

        await expect(sdIdInstance.ownerOf(1)).to.be.revertedWith(
          'ERC721: invalid token ID',
        );
      });
      it('Should correctly reset infos to blank', async () => {
        await sdIdInstance.connect(user1).burn(1);

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
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute3,
          ),
        ).to.be.equal('');
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion = await sdIdInstance.tokenIdToVersion(1);

        await sdIdInstance.connect(user1).burn(1);

        expect(await sdIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion + 1n,
        );
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceNodeBurned event with correct params', async () => {
        await expect(sdIdInstance.connect(user1).burn(1))
          .to.emit(syntheticDeviceInstance, 'SyntheticDeviceNodeBurned')
          .withArgs(1, 1, user1.address);
      });
    });
  });
});
