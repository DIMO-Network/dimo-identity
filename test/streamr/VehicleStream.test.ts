import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';

import { DimoAccessControl, StreamrManager, VehicleStream, MockStreamRegistry } from '../../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

const { expect } = chai;

describe.skip('VehicleStream', async function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let streamrManagerInstance: StreamrManager;
  let vehicleStreamInstance: VehicleStream;
  let mockStreamRegistry: MockStreamRegistry;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;

  before(async () => {
    [admin, nonAdmin] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'StreamrManager', 'VehicleStream'],
      nfts: [],
      upgradeableContracts: []
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    streamrManagerInstance = deployments.StreamrManager;
    vehicleStreamInstance = deployments.VehicleStream;

    // Deploy MockStreamRegistry contract
    const MockSreamRegistryFactory = await ethers.getContractFactory('MockStreamRegistry');
    mockStreamRegistry = await MockSreamRegistryFactory.connect(admin).deploy();

    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.ADMIN_ROLE, admin.address);

    await streamrManagerInstance.setStreamrRegistry(await mockStreamRegistry.getAddress());
    await streamrManagerInstance.setDimoBaseStreamId(C.DIMO_BASE_STREAM_ID);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('createStream', () => {
    it('Test', async () => {
      await vehicleStreamInstance
        .connect(admin)
        .createStream(1);
    });
  });
});
