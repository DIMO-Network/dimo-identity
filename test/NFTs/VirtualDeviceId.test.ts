import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import { VirtualDeviceId } from '../../typechain';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('VirtualDeviceId', async function () {
  let snapshot: string;
  let virtualDeviceIdInstance: VirtualDeviceId;

  const [admin, nonAdmin] = provider.getWallets();

  before(async () => {
    const deployments = await setup(admin, {
      modules: [],
      nfts: ['VirtualDeviceId'],
      upgradeableContracts: []
    });

    virtualDeviceIdInstance = deployments.VirtualDeviceId;
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
        virtualDeviceIdInstance
          .connect(nonAdmin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should revert if addr is zero address', async () => {
      await expect(
        virtualDeviceIdInstance
          .connect(admin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith('Non zero address');
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        virtualDeviceIdInstance
          .connect(nonAdmin)
          .setTrustedForwarder(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();

      expect(await virtualDeviceIdInstance.trustedForwarder()).to.be.equal(
        C.ZERO_ADDRESS
      );

      await virtualDeviceIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address);

      expect(await virtualDeviceIdInstance.trustedForwarder()).to.be.equal(
        mockForwarder.address
      );
    });
  });
});
