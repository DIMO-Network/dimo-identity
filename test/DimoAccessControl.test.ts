import chai from 'chai';
import { ethers, HardhatEthersSigner } from 'hardhat';

import { DimoAccessControl } from '../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;

describe('DimoAccessControl', async function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;

  let admin1: HardhatEthersSigner;
  let admin2: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;

  before(async () => {
    [admin1, admin2, nonAdmin] = await ethers.getSigners();

    const deployments = await setup(admin1, {
      modules: ['DimoAccessControl'],
      nfts: [],
      upgradeableContracts: []
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;

    await dimoAccessControlInstance
      .connect(admin1)
      .grantRole(C.ADMIN_ROLE, admin1.address);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('grantRole', async () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          dimoAccessControlInstance
            .connect(nonAdmin)
            .grantRole(C.MOCK_ROLE, nonAdmin.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly grant a role to an account', async () => {
        const admin2RoleBefore: boolean =
          await dimoAccessControlInstance.hasRole(C.MOCK_ROLE, admin2.address);

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleBefore).to.be.false;

        await expect(
          dimoAccessControlInstance
            .connect(admin1)
            .grantRole(C.MOCK_ROLE, admin2.address)
        ).to.not.be.reverted;

        const admin2RoleAfter: boolean =
          await dimoAccessControlInstance.hasRole(C.MOCK_ROLE, admin2.address);

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleAfter).to.be.true;
      });
    });
  });

  describe('revokeRole', async () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          dimoAccessControlInstance
            .connect(nonAdmin)
            .revokeRole(C.MOCK_ROLE, admin1.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly revoke a role from an account', async () => {
        await dimoAccessControlInstance
          .connect(admin1)
          .grantRole(C.MOCK_ROLE, admin2.address);

        const admin2RoleBefore: boolean =
          await dimoAccessControlInstance.hasRole(C.MOCK_ROLE, admin2.address);

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleBefore).to.be.true;

        await expect(
          dimoAccessControlInstance
            .connect(admin1)
            .revokeRole(C.MOCK_ROLE, admin2.address)
        ).to.not.be.reverted;

        const admin2RoleAfter: boolean =
          await dimoAccessControlInstance.hasRole(C.MOCK_ROLE, admin2.address);

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleAfter).to.be.false;
      });
    });
  });

  describe('renounceRole', async () => {
    context('State', () => {
      it('Should correctly renounce role', async () => {
        await dimoAccessControlInstance
          .connect(admin1)
          .grantRole(C.MOCK_ROLE, admin1.address);

        const admin1RoleBefore: boolean =
          await dimoAccessControlInstance.hasRole(C.MOCK_ROLE, admin1.address);

        // eslint-disable-next-line no-unused-expressions
        expect(admin1RoleBefore).to.be.true;

        await expect(
          dimoAccessControlInstance.connect(admin1).renounceRole(C.MOCK_ROLE)
        ).to.not.be.reverted;

        const admin1RoleAfter: boolean =
          await dimoAccessControlInstance.hasRole(C.MOCK_ROLE, admin1.address);

        // eslint-disable-next-line no-unused-expressions
        expect(admin1RoleAfter).to.be.false;
      });
    });
  });

  describe('hasRole', async () => {
    it('Should return true if account has role', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await dimoAccessControlInstance.hasRole(
          C.DEFAULT_ADMIN_ROLE,
          admin1.address
        )
      ).to.be.true;
    });
    it('Should return false if account has role', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await dimoAccessControlInstance.hasRole(
          C.DEFAULT_ADMIN_ROLE,
          nonAdmin.address
        )
      ).to.be.false;
    });
  });
});
