import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';

import { DimoAccessControl, StreamrConfigurator } from '../../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

import { streamRegistryABI, streamRegistryBytecode } from '@streamr/network-contracts'
import type { StreamRegistry } from '@streamr/network-contracts'

const { expect } = chai;

describe('StreamrConfigurator', async function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let streamrConfiguratorInstance: StreamrConfigurator;
  let streamRegistry: StreamRegistry;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;

  before(async () => {
    [admin, nonAdmin] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'StreamrConfigurator'],
      nfts: [],
      upgradeableContracts: []
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    streamrConfiguratorInstance = deployments.StreamrConfigurator;

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
          streamrConfiguratorInstance
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
          streamrConfiguratorInstance
            .connect(admin)
            .setStreamRegistry(await streamRegistry.getAddress())
        )
          .to.emit(streamrConfiguratorInstance, 'StreamRegistrySet')
          .withArgs(await streamRegistry.getAddress());
      });
    });
  });

  describe('setDimoStreamrNode', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          streamrConfiguratorInstance
            .connect(nonAdmin)
            .setDimoStreamrNode(C.DIMO_STREAMR_NODE)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('Events', () => {
      it('Should emit DimoStreamrNodeSet event with correct params', async () => {
        await expect(
          streamrConfiguratorInstance
            .connect(admin)
            .setDimoStreamrNode(C.DIMO_STREAMR_NODE)
        )
          .to.emit(streamrConfiguratorInstance, 'DimoStreamrNodeSet')
          .withArgs(C.DIMO_STREAMR_NODE);
      });
    });
  });
});
