import chai from 'chai';
import { waffle } from 'hardhat';

import { DimoAccessControl } from '../typechain';
import { setup2, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('DimoAccessControl', async function () {
  let snapshot: string;
  let accessControlInstance: DimoAccessControl;

  const [admin1, admin2, nonAdmin] = provider.getWallets();

  before(async () => {
    const deployments = await setup2(admin1, {
      modules: ['DimoAccessControl'],
      nfts: [],
      upgradeableContracts: []
    });
    accessControlInstance = deployments.DimoAccessControl;
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
          accessControlInstance
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
        const admin2RoleBefore: boolean = await accessControlInstance.hasRole(
          C.MOCK_ROLE,
          admin2.address
        );

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleBefore).to.be.false;

        await expect(
          accessControlInstance
            .connect(admin1)
            .grantRole(C.MOCK_ROLE, admin2.address)
        ).to.not.be.reverted;

        const admin2RoleAfter: boolean = await accessControlInstance.hasRole(
          C.MOCK_ROLE,
          admin2.address
        );

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleAfter).to.be.true;
      });
    });
  });

  describe('revokeRole', async () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          accessControlInstance
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
        await accessControlInstance
          .connect(admin1)
          .grantRole(C.MOCK_ROLE, admin2.address);

        const admin2RoleBefore: boolean = await accessControlInstance.hasRole(
          C.MOCK_ROLE,
          admin2.address
        );

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleBefore).to.be.true;

        await expect(
          accessControlInstance
            .connect(admin1)
            .revokeRole(C.MOCK_ROLE, admin2.address)
        ).to.not.be.reverted;

        const admin2RoleAfter: boolean = await accessControlInstance.hasRole(
          C.MOCK_ROLE,
          admin2.address
        );

        // eslint-disable-next-line no-unused-expressions
        expect(admin2RoleAfter).to.be.false;
      });
    });
  });

  describe('renounceRole', async () => {
    context('State', () => {
      it('Should correctly renounce role', async () => {
        await accessControlInstance
          .connect(admin1)
          .grantRole(C.MOCK_ROLE, admin1.address);

        const admin1RoleBefore: boolean = await accessControlInstance.hasRole(
          C.MOCK_ROLE,
          admin1.address
        );

        // eslint-disable-next-line no-unused-expressions
        expect(admin1RoleBefore).to.be.true;

        await expect(
          accessControlInstance.connect(admin1).renounceRole(C.MOCK_ROLE)
        ).to.not.be.reverted;

        const admin1RoleAfter: boolean = await accessControlInstance.hasRole(
          C.MOCK_ROLE,
          admin1.address
        );

        // eslint-disable-next-line no-unused-expressions
        expect(admin1RoleAfter).to.be.false;
      });
    });
  });

  describe('hasRole', async () => {
    it('Should return true if account has role', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await accessControlInstance.hasRole(
          C.DEFAULT_ADMIN_ROLE,
          admin1.address
        )
      ).to.be.true;
    });
    it('Should return false if account has role', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await accessControlInstance.hasRole(
          C.DEFAULT_ADMIN_ROLE,
          nonAdmin.address
        )
      ).to.be.false;
    });
  });
});
