import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';

import { streamRegistryABI, streamRegistryBytecode, ENSCacheV2ABI, ENSCacheV2Bytecode } from '@streamr/network-contracts'
import type { StreamRegistry, ENSCacheV2 } from '@streamr/network-contracts'

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  StreamrManager,
  VehicleStream
} from '../../typechain-types';

import {
  setup,
  createSnapshot,
  revertToSnapshot,
  grantAdminRoles,
  C
} from '../../utils';

const { provider } = ethers;
const { expect } = chai;

describe.only('VehicleStream', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let streamrManagerInstance: StreamrManager;
  let vehicleStreamInstance: VehicleStream;
  let ensCache: ENSCacheV2;
  let streamRegistry: StreamRegistry;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      user1,
      user2
    ] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Vehicle',
        'Mapper',
        'StreamrManager',
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
    streamrManagerInstance = deployments.StreamrManager;
    vehicleStreamInstance = deployments.VehicleStream;

    await grantAdminRoles(admin, dimoAccessControlInstance);

    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());
    await vehicleIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());

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
      await dimoRegistryInstance.getAddress(),
    );

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);


    const ensCacheFactory = new ethers.ContractFactory(ENSCacheV2ABI, ENSCacheV2Bytecode, admin);
    ensCache = await ensCacheFactory.deploy() as unknown as ENSCacheV2

    const streamRegistryFactory = new ethers.ContractFactory(streamRegistryABI, streamRegistryBytecode, admin);
    streamRegistry = await streamRegistryFactory.deploy() as unknown as StreamRegistry;

    await streamRegistry.initialize(await ensCache.getAddress(), admin.address);
    await ensCache.initialize(admin.address, await streamRegistry.getAddress(), ethers.ZeroAddress);

    await streamrManagerInstance.setStreamrRegistry(await streamRegistry.getAddress());
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe.only('createStream', () => {
    context('Error handling', () => {
      it('Should revert if caller is not the vehicle ID owner', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user2)
            .createStream(1)
        ).to.be.revertedWithCustomError(
          vehicleStreamInstance,
          'Unauthorized'
        ).withArgs(user2.address);
      });
      it('Should revert if vehicle ID does not exist', async () => {
        await expect(
          vehicleStreamInstance
            .connect(user1)
            .createStream(99)
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

    });

    context('Events', () => {

    });
    
    it.skip('Test', async () => {
      const now = (await provider.getBlock('latest'))!.timestamp
      const myAddress = await dimoRegistryInstance.getAddress()
      const streamId = `${myAddress.toLowerCase()}/vehicle/1`
      await expect(vehicleStreamInstance.connect(admin).createStream(1))

      // await ensCache.fulfillENSOwner('dimo.eth', '/vehicle/1', '{}', admin.address)
      //   .to.emit(streamRegistry, 'StreamCreated').withArgs(streamId, '{}')

      await expect(
        vehicleStreamInstance
          .connect(admin)
          .subscribe(1, nonAdmin.address, now + 10000)
      )
        .to.emit(streamRegistry, 'PermissionUpdated')
        .withArgs(streamId, nonAdmin.address, false, false, 0, ethers.MaxUint256, false);
      await expect(
        vehicleStreamInstance
          .connect(admin)
          .subscribe(1, manufacturer1.address, now + 10000)
      )
        .to.emit(streamRegistry, 'PermissionUpdated')
        .withArgs(streamId, manufacturer1.address, false, false, 0, ethers.MaxUint256, false)

      // TODO: replace with nft transfer
      await expect(vehicleStreamInstance.connect(admin).onTransfer(admin.address, admin.address, 1))
        .to.emit(streamRegistry, 'PermissionUpdated').withArgs(streamId, nonAdmin.address, false, false, 0, 0, false)
    });
  });
});
