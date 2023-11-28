import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';

import { DimoAccessControl, StreamrManager, MockStreamRegistry } from '../../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

const { expect } = chai;

describe('StreamrManager', async function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let streamrManagerInstance: StreamrManager;
  let mockStreamRegistry: MockStreamRegistry;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;

  before(async () => {
    [admin, nonAdmin] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'StreamrManager'],
      nfts: [],
      upgradeableContracts: []
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    streamrManagerInstance = deployments.StreamrManager;

    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.ADMIN_ROLE, admin.address);

    // Deploy MockStreamRegistry contract
    const MockSreamRegistryFactory = await ethers.getContractFactory('MockStreamRegistry');
    mockStreamRegistry = await MockSreamRegistryFactory.connect(admin).deploy();
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setStreamrRegistry', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          streamrManagerInstance
            .connect(nonAdmin)
            .setStreamrRegistry(await mockStreamRegistry.getAddress())
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('Events', () => {
      it('Should emit StreamrRegistrySet event with correct params', async () => {
        await expect(
          streamrManagerInstance
            .connect(admin)
            .setStreamrRegistry(await mockStreamRegistry.getAddress())
        )
          .to.emit(streamrManagerInstance, 'StreamrRegistrySet')
          .withArgs(await mockStreamRegistry.getAddress());
      });
    });
  });

  describe('setDimoBaseStreamId', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          streamrManagerInstance
            .connect(nonAdmin)
            .setDimoBaseStreamId(C.DIMO_BASE_STREAM_ID)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('Events', () => {
      it('Should emit DimoBaseStreamIdSet event with correct params', async () => {
        await expect(
          streamrManagerInstance
            .connect(admin)
            .setDimoBaseStreamId(C.DIMO_BASE_STREAM_ID)
        )
          .to.emit(streamrManagerInstance, 'DimoBaseStreamIdSet')
          .withArgs(C.DIMO_BASE_STREAM_ID);
      });
    });
  });
});
