import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-network-helpers';

import {
  streamRegistryABI,
  streamRegistryBytecode,
  ENSCacheV2ABI,
  ENSCacheV2Bytecode
} from '@streamr/network-contracts';
import type { StreamRegistry, ENSCacheV2 } from '@streamr/network-contracts';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  StreamrConfigurator,
  VehicleStream
} from '../../typechain-types';

import {
  setup,
  createSnapshot,
  revertToSnapshot,
  grantAdminRoles,
  C
} from '../../utils';

const { expect } = chai;

describe('VehicleStream', async function () {
  let snapshot: string;
  let subscriptionExpiresDefault: number;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let streamrConfiguratorInstance: StreamrConfigurator;
  let vehicleStreamInstance: VehicleStream;
  let ensCache: ENSCacheV2;
  let streamRegistry: StreamRegistry;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let streamrAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let subscriber: HardhatEthersSigner;

  async function setupStreamr(dimoRegistryAddress: string) {
    const ensCacheFactory = new ethers.ContractFactory(ENSCacheV2ABI, ENSCacheV2Bytecode, streamrAdmin);
    ensCache = await ensCacheFactory.deploy() as unknown as ENSCacheV2
    const streamRegistryFactory = new ethers.ContractFactory(streamRegistryABI, streamRegistryBytecode, streamrAdmin);
    streamRegistry = await streamRegistryFactory.deploy() as unknown as StreamRegistry;

    await streamRegistry
      .connect(streamrAdmin)
      .initialize(await ensCache.getAddress(), ethers.ZeroAddress);
    await ensCache
      .connect(streamrAdmin)
      .initialize(streamrAdmin.address, await streamRegistry.getAddress(), ethers.ZeroAddress);
    await streamRegistry
      .connect(streamrAdmin)
      .grantRole(C.TRUSTED_ROLE, await ensCache.getAddress());

    // Fill Streamr ENSCache with the dimo ENS and vehicle path streams.dimo.eth/vehicle/
    await ensCache
      .connect(streamrAdmin)
      .fulfillENSOwner(C.DIMO_STREAMR_ENS, '/vehicle/', '{}', dimoRegistryAddress);
  }

  before(async () => {
    [
      admin,
      streamrAdmin,
      manufacturer1,
      user1,
      user2,
      subscriber
    ] = await ethers.getSigners();

    subscriptionExpiresDefault = await time.latest() + 31556926; // + 1 year

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Vehicle',
        'Mapper',
        'StreamrConfigurator',
        'VehicleStream'
      ],
      nfts: ['ManufacturerId', 'VehicleId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;
    streamrConfiguratorInstance = deployments.StreamrConfigurator;
    vehicleStreamInstance = deployments.VehicleStream;

    DIMO_REGISTRY_ADDRESS = await dimoRegistryInstance.getAddress();

    await grantAdminRoles(admin, dimoAccessControlInstance);

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
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion
    );

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

    // Setting DIMORegistry address
    await manufacturerIdInstance.setDimoRegistryAddress(
      DIMO_REGISTRY_ADDRESS,
    );

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

    await setupStreamr(DIMO_REGISTRY_ADDRESS);

    await streamrConfiguratorInstance
      .connect(admin)
      .setStreamRegistry(await streamRegistry.getAddress());
    await streamrConfiguratorInstance
      .connect(admin)
      .setDimoStreamrNode(C.DIMO_STREAMR_NODE);
    await streamrConfiguratorInstance
      .connect(admin)
      .setDimoBaseStreamId(C.DIMO_STREAMR_ENS);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('createVehicleStream', () => {
    const streamId = `${C.DIMO_STREAMR_ENS}/vehicle/1`;

    context('Error handling', () => {
      it('Should revert if caller is not the vehicle ID owner', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user2)
            .createVehicleStream(1)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'Unauthorized'
        ).withArgs(user2.address);
      });
      it('Should revert if vehicle ID does not exist', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .createVehicleStream(99)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'InvalidNode'
        ).withArgs(
          await vehicleIdInstance.getAddress(),
          99
        );
      });
      it('Should revert if vehicle ID was already associated with a stream ID', async () => {
        const oldStreamId = `${await user1.address.toString().toLowerCase()}${C.MOCK_STREAM_PATH}`;

        await streamRegistry
          .connect(user1)
          .createStream(C.MOCK_STREAM_PATH, '{}');
        await streamRegistry
          .connect(user1)
          .grantPermission(oldStreamId, C.DIMO_STREAMR_NODE, C.StreamrPermissionType.Publish);
        await streamRegistry
          .connect(user1)
          .grantPermission(oldStreamId, DIMO_REGISTRY_ADDRESS, C.StreamrPermissionType.Grant);
        await vehicleStreamInstance
          .connect(user1)
          .setVehicleStream(1, oldStreamId);

        await expect(
          vehicleStreamInstance
            .connect(user1)
            .createVehicleStream(1)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'VehicleStreamAlreadySet'
        ).withArgs(1, oldStreamId);
      });
    });

    context('State', () => {
      it('Should correctly associate stream ID to vehicle ID', async () => {
        const streamIdBefore = await vehicleStreamInstance.getVehicleStream(1);
        expect(streamIdBefore).to.be.empty;

        await vehicleStreamInstance
          .connect(user1)
          .createVehicleStream(1);

        const streamIdAfter = await vehicleStreamInstance.getVehicleStream(1);
        expect(streamIdAfter).to.eql(streamId);
      });
      it('Should correctly set vehicle stream metadata', async () => {
        const streamId = `${C.DIMO_STREAMR_ENS}/vehicle/1`;

        await vehicleStreamInstance
          .connect(user1)
          .createVehicleStream(1);

        expect(await streamRegistry.getStreamMetadata(streamId)).to.be.equal('{}');
      });
      it('Should correctly set all permissions to DIMORegistry', async () => {
        const streamId = `${C.DIMO_STREAMR_ENS}/vehicle/1`;

        await vehicleStreamInstance
          .connect(user1)
          .createVehicleStream(1);

        const permissions = await streamRegistry.getPermissionsForUser(streamId, DIMO_REGISTRY_ADDRESS);

        expect(permissions).to.eql([
          true,
          true,
          ethers.MaxUint256,
          ethers.MaxUint256,
          true
        ]);
      });
      it('Should correctly set publishing permissions to DIMO Streamr Node', async () => {
        await vehicleStreamInstance
          .connect(user1)
          .createVehicleStream(1);

        const permissions = await streamRegistry.getPermissionsForUser(streamId, C.DIMO_STREAMR_NODE);

        expect(permissions[0]).to.eql(false);
        expect(permissions[1]).to.eql(false);
        expect(permissions[2]).to.equal(ethers.MaxUint256);
        expect(permissions[3]).to.equal('0');
        expect(permissions[4]).to.eql(false);
      });
    });

    context('Events', () => {
      it('Should emit VehicleStreamSet event with correct params', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .createVehicleStream(1)
        ).to.emit(vehicleStreamInstance, 'VehicleStreamSet')
          .withArgs(1, streamId);
      });
    });
  });

  describe('setVehicleStream', () => {
    let mockStreamId: string;
    beforeEach(async () => {
      mockStreamId = `${await user1.address.toString().toLowerCase()}${C.MOCK_STREAM_PATH}`;

      await streamRegistry
        .connect(user1)
        .createStream(C.MOCK_STREAM_PATH, '{}');

      await streamRegistry
        .connect(user1)
        .grantPermission(mockStreamId, C.DIMO_STREAMR_NODE, C.StreamrPermissionType.Publish);
      await streamRegistry
        .connect(user1)
        .grantPermission(mockStreamId, DIMO_REGISTRY_ADDRESS, C.StreamrPermissionType.Grant);
    });

    context('Error Handling', () => {
      it('Should revert if caller is not the vehicle ID owner', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user2)
            .setVehicleStream(1, mockStreamId)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'Unauthorized'
        ).withArgs(user2.address);
      });
      it('Should revert if vehicle ID does not exist', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .setVehicleStream(99, mockStreamId)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'InvalidNode'
        ).withArgs(
          await vehicleIdInstance.getAddress(),
          99
        );
      });
      it('Should revert if stream ID does not exist', async () => {
        const invalidStreamId: string = `${user1.address.toString()}/invalidStreamPath`;
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .setVehicleStream(1, invalidStreamId)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'StreamDoesNotExist'
        ).withArgs(
          invalidStreamId
        );
      });
      it('Should revert if DIMO Streamr Node does not have Publish permission', async () => {
        await streamRegistry
          .connect(user1)
          .revokePermission(mockStreamId, C.DIMO_STREAMR_NODE, C.StreamrPermissionType.Publish);

        await expect(
          vehicleStreamInstance
            .connect(user1)
            .setVehicleStream(1, mockStreamId)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'NoStreamrPermission'
        ).withArgs(
          C.DIMO_STREAMR_NODE,
          C.StreamrPermissionType.Publish
        );
      });
      it('Should revert if DIMO Registry does not have Grant permission', async () => {
        await streamRegistry
          .connect(user1)
          .revokePermission(mockStreamId, DIMO_REGISTRY_ADDRESS, C.StreamrPermissionType.Grant);

        await expect(
          vehicleStreamInstance
            .connect(user1)
            .setVehicleStream(1, mockStreamId)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'NoStreamrPermission'
        ).withArgs(
          DIMO_REGISTRY_ADDRESS,
          C.StreamrPermissionType.Grant
        );
      });
    });

    context('State', () => {
      it('Should correctly associate stream ID to vehicle ID', async () => {
        const streamIdBefore = await vehicleStreamInstance.getVehicleStream(1);
        expect(streamIdBefore).to.be.empty;

        await vehicleStreamInstance
          .connect(user1)
          .setVehicleStream(1, mockStreamId);

        const streamIdAfter = await vehicleStreamInstance.getVehicleStream(1);
        expect(streamIdAfter).to.eql(mockStreamId);
      });
    });

    context('Events', () => {
      it('Should emit VehicleStreamUnset event with correct params when vehicle ID was already associated with a stream ID', async () => {
        const oldStreamId = `${C.DIMO_STREAMR_ENS}/vehicle/1`;

        await vehicleStreamInstance
          .connect(user1)
          .createVehicleStream(1);

        await expect(
          vehicleStreamInstance
            .connect(user1)
            .setVehicleStream(1, mockStreamId)
        ).to.emit(vehicleStreamInstance, 'VehicleStreamUnset')
          .withArgs(1, oldStreamId);
      });
      it('Should emit VehicleStreamSet event with correct params', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .setVehicleStream(1, mockStreamId)
        ).to.emit(vehicleStreamInstance, 'VehicleStreamSet')
          .withArgs(1, mockStreamId);
      });
    });
  });

  describe('unsetVehicleStream', () => {
    let mockStreamId: string;
    beforeEach(async () => {
      await vehicleStreamInstance
        .connect(user1)
        .createVehicleStream(1);

      mockStreamId = `${C.DIMO_STREAMR_ENS}/vehicle/1`;
    });

    context('Error Handling', () => {
      it('Should revert if caller is not the vehicle ID owner', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user2)
            .unsetVehicleStream(1)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'Unauthorized'
        ).withArgs(user2.address);
      });
      it('Should revert if vehicle ID does not exist', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .unsetVehicleStream(99)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'InvalidNode'
        ).withArgs(
          await vehicleIdInstance.getAddress(),
          99
        );
      });
      it('Should revert if there is no stream ID associated to the vehicle ID', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          vehicleStreamInstance
            .connect(user2)
            .unsetVehicleStream(2)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'VehicleStreamNotSet'
        ).withArgs(
          2
        );
      });
    });

    context('State', () => {
      it('Should correctly dissociate stream ID from vehicle ID', async () => {
        const streamIdBefore = await vehicleStreamInstance.getVehicleStream(1);
        expect(streamIdBefore).to.eql(mockStreamId);

        await vehicleStreamInstance
          .connect(user1)
          .unsetVehicleStream(1);

        const streamIdAfter = await vehicleStreamInstance.getVehicleStream(1);
        expect(streamIdAfter).to.be.empty;
      });
    });

    context('Events', () => {
      it('Should emit VehicleStreamUnset event with correct params', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .unsetVehicleStream(1)
        ).to.emit(vehicleStreamInstance, 'VehicleStreamUnset')
          .withArgs(1, mockStreamId);
      });
    });
  });

  describe('subscribeToVehicleStream', () => {
    const streamId = `${C.DIMO_STREAMR_ENS}/vehicle/1`;

    beforeEach(async () => {
      await vehicleStreamInstance
        .connect(user1)
        .createVehicleStream(1);
    });

    context('Error Handling', () => {
      it('Should revert if caller is not the vehicle ID owner', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user2)
            .subscribeToVehicleStream(1, subscriber.address, subscriptionExpiresDefault)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'Unauthorized'
        ).withArgs(user2.address);
      });
      it('Should revert if vehicle ID does not exist', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .subscribeToVehicleStream(99, subscriber.address, subscriptionExpiresDefault)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'InvalidNode'
        ).withArgs(
          await vehicleIdInstance.getAddress(),
          99
        );
      });
    });

    context('State', () => {
      it('Should correctly set only subscription', async () => {
        await vehicleStreamInstance
          .connect(user1)
          .subscribeToVehicleStream(1, subscriber.address, subscriptionExpiresDefault)

        const permissions = await streamRegistry.getPermissionsForUser(streamId, subscriber.address);

        expect(permissions[0]).to.eql(false);
        expect(permissions[1]).to.eql(false);
        expect(permissions[2]).to.equal('0');
        expect(permissions[3]).to.equal(subscriptionExpiresDefault.toString());
        expect(permissions[4]).to.eql(false);
      });
    });

    context('Events', () => {
      it('Should emit SubscribedToVehicleStream event with correct params', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .subscribeToVehicleStream(1, subscriber.address, subscriptionExpiresDefault)
        ).to.emit(vehicleStreamInstance, 'SubscribedToVehicleStream')
          .withArgs(streamId, subscriber.address, subscriptionExpiresDefault);

        const permissions = await streamRegistry.getPermissionsForUser(streamId, subscriber.address);

        expect(permissions[0]).to.eql(false);
        expect(permissions[1]).to.eql(false);
        expect(permissions[2]).to.equal('0');
        expect(permissions[3]).to.equal(subscriptionExpiresDefault.toString());
        expect(permissions[4]).to.eql(false);
      });
      it('Should emit SubscribedToVehicleStream event with correct params', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .subscribeToVehicleStream(1, subscriber.address, subscriptionExpiresDefault)
        ).to.emit(vehicleStreamInstance, 'SubscribedToVehicleStream')
          .withArgs(streamId, subscriber.address, subscriptionExpiresDefault);
      });
    });
  });
});