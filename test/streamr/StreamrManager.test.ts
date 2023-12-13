import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';

import { DimoAccessControl, StreamrManager } from '../../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

import { streamRegistryABI, streamRegistryBytecode } from '@streamr/network-contracts'
import type { StreamRegistry } from '@streamr/network-contracts'

const { expect } = chai;

describe('StreamrManager', async function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let streamrManagerInstance: StreamrManager;
  let streamRegistry: StreamRegistry;

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

    // Deploy StreamRegistry contract
    const streamRegistryFactory = new ethers.ContractFactory(streamRegistryABI, streamRegistryBytecode, admin);
    streamRegistry = await streamRegistryFactory.deploy() as unknown as StreamRegistry;
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setStreamRegistry', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          streamrManagerInstance
            .connect(nonAdmin)
            .setStreamRegistry(await streamRegistry.getAddress())
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('Events', () => {
      it('Should emit StreamRegistrySet event with correct params', async () => {
        await expect(
          streamrManagerInstance
            .connect(admin)
            .setStreamRegistry(await streamRegistry.getAddress())
        )
          .to.emit(streamrManagerInstance, 'StreamRegistrySet')
          .withArgs(await streamRegistry.getAddress());
      });
    });
  });
});
