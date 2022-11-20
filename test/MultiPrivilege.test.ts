import chai from 'chai';
import { ethers, waffle, upgrades } from 'hardhat';

import { MultiPrivilege } from '../typechain';
import { createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('MultiPrivilege', function () {
  let snapshot: string;
  let multiPrivilegeInstance: MultiPrivilege;
  let nftTokenId: string;
  let expiresAtDefault: number;

  const [admin, nonAdmin, user1, user2, user3, newOwner] = provider.getWallets();

  before(async () => {
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    expiresAtDefault = blockBefore.timestamp + 31556926; // + 1 year

    // Deploy MultiPrivilege contract
    const MultiPrivilegeFactory = await ethers.getContractFactory(
      'MultiPrivilege'
    );
    multiPrivilegeInstance = await upgrades.deployProxy(
      MultiPrivilegeFactory,
      [
        C.MULTI_PRIVILEGE_NAME,
        C.MULTI_PRIVILEGE_SYMBOL,
        C.MULTI_PRIVILEGE_URI
      ],
      {
        initializer: 'initialize',
        kind: 'uups'
      }
      // eslint-disable-next-line prettier/prettier
    ) as MultiPrivilege;
    await multiPrivilegeInstance.deployed();

    const receipt = await (
      await multiPrivilegeInstance['safeMint(address)'](user1.address)
    ).wait();

    nftTokenId = receipt.events
      ?.filter((x: any) => {
        return x.event === 'Transfer';
      })[0]
      .args?.tokenId.toString();
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('createPrivilege', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          multiPrivilegeInstance.connect(nonAdmin).createPrivilege(true, '')
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
    });

    context('State change', () => {
      it('Should correctly set new privilege record', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .createPrivilege(true, C.MULTI_PRIVILEGE_DESCRIPTION);

        const [enabled, description] =
          await multiPrivilegeInstance.privilegeRecord(1);

        // eslint-disable-next-line no-unused-expressions
        expect(enabled).to.be.true;
        expect(description).to.equal(C.MULTI_PRIVILEGE_DESCRIPTION);
      });
    });

    context('Events', () => {
      it('Should emit PrivilegeCreated event with correct params', async () => {
        await expect(
          multiPrivilegeInstance.createPrivilege(
            true,
            C.MULTI_PRIVILEGE_DESCRIPTION
          )
        )
          .to.emit(multiPrivilegeInstance, 'PrivilegeCreated')
          .withArgs(1, true, C.MULTI_PRIVILEGE_DESCRIPTION);
      });
    });
  });

  describe('enablePrivilege', () => {
    beforeEach(async () => {
      await multiPrivilegeInstance
        .connect(admin)
        .createPrivilege(true, C.MULTI_PRIVILEGE_DESCRIPTION);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          multiPrivilegeInstance.connect(nonAdmin).enablePrivilege(1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if privilege Id is not valid', async () => {
        await expect(
          multiPrivilegeInstance.connect(admin).enablePrivilege(99)
        ).to.be.revertedWith('Invalid privilege id');
      });
      it('Should revert if privilege is already enabled', async () => {
        await expect(
          multiPrivilegeInstance.connect(admin).enablePrivilege(1)
        ).to.be.revertedWith('Privilege is enabled');
      });
    });

    context('State change', () => {
      it('Should correctly set new privilege record', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .createPrivilege(true, C.MULTI_PRIVILEGE_DESCRIPTION);
        await multiPrivilegeInstance.connect(admin).disablePrivilege(1);

        const enabledBefore = (await multiPrivilegeInstance.privilegeRecord(1))
          .enabled;

        // eslint-disable-next-line no-unused-expressions
        expect(enabledBefore).to.be.false;

        await multiPrivilegeInstance.connect(admin).enablePrivilege(1);

        const enabledAfter = (await multiPrivilegeInstance.privilegeRecord(1))
          .enabled;

        // eslint-disable-next-line no-unused-expressions
        expect(enabledAfter).to.be.true;
      });
    });

    context('Events', () => {
      it('Should emit PrivilegeEnabled event with correct params', async () => {
        await multiPrivilegeInstance.connect(admin).disablePrivilege(1);

        await expect(multiPrivilegeInstance.connect(admin).enablePrivilege(1))
          .to.emit(multiPrivilegeInstance, 'PrivilegeEnabled')
          .withArgs(1);
      });
    });
  });

  describe('disablePrivilege', () => {
    beforeEach(async () => {
      await multiPrivilegeInstance
        .connect(admin)
        .createPrivilege(false, C.MULTI_PRIVILEGE_DESCRIPTION);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          multiPrivilegeInstance.connect(nonAdmin).disablePrivilege(1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if privilege Id is not valid', async () => {
        await expect(
          multiPrivilegeInstance.connect(admin).disablePrivilege(99)
        ).to.be.revertedWith('Invalid privilege id');
      });
      it('Should revert if privilege is already disabled', async () => {
        await expect(
          multiPrivilegeInstance.connect(admin).disablePrivilege(1)
        ).to.be.revertedWith('Privilege is disabled');
      });
    });

    context('State change', () => {
      it('Should correctly set new privilege record', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .createPrivilege(true, C.MULTI_PRIVILEGE_DESCRIPTION);
        await multiPrivilegeInstance.connect(admin).enablePrivilege(1);

        const disabledBefore = (await multiPrivilegeInstance.privilegeRecord(1))
          .enabled;

        // eslint-disable-next-line no-unused-expressions
        expect(disabledBefore).to.be.true;

        await multiPrivilegeInstance.connect(admin).disablePrivilege(1);

        const disabledAfter = (await multiPrivilegeInstance.privilegeRecord(1))
          .enabled;

        // eslint-disable-next-line no-unused-expressions
        expect(disabledAfter).to.be.false;
      });
    });

    context('Events', () => {
      it('Should emit PrivilegeDisabled event with correct params', async () => {
        await multiPrivilegeInstance.connect(admin).enablePrivilege(1);

        await expect(multiPrivilegeInstance.connect(admin).disablePrivilege(1))
          .to.emit(multiPrivilegeInstance, 'PrivilegeDisabled')
          .withArgs(1);
      });
    });
  });

  describe('grantPrivilege', () => {
    context('Error handling', () => {
      it('Should revert if caller is not owner or approved', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(nonAdmin)
            .grantPrivilege(
              nftTokenId,
              1,
              user2.address,
              expiresAtDefault
            )
        ).to.be.revertedWith('Caller is not owner nor approved');
      });
      it('Should revert if privilege Id is not valid', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .grantPrivilege(
              nftTokenId,
              99,
              user2.address,
              expiresAtDefault
            )
        ).to.be.revertedWith('Invalid privilege id');
      });
      it('Should revert if privilege is not enabled', async () => {
        await multiPrivilegeInstance.createPrivilege(false, '');

        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .grantPrivilege(
              nftTokenId,
              1,
              user2.address,
              expiresAtDefault
            )
        ).to.be.revertedWith('Privilege not enabled');
      });
    });

    context('State change', () => {
      it('Should correctly set privilege expiration', async () => {
        await multiPrivilegeInstance.createPrivilege(true, '');

        await multiPrivilegeInstance
          .connect(user1)
          .grantPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
        const expiresAt = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );

        expect(expiresAt).to.equal(expiresAtDefault);
      });
    });

    context('Events', () => {
      it('Should emit PrivilegeAssigned event with correct params', async () => {
        await multiPrivilegeInstance.createPrivilege(true, '');

        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .grantPrivilege(
              nftTokenId,
              1,
              user2.address,
              expiresAtDefault
            )
        )
          .to.emit(multiPrivilegeInstance, 'PrivilegeAssigned')
          .withArgs(nftTokenId, 1, user2.address, expiresAtDefault);
      });
    });

    context('Transferring token to new owner', () => {
      it('Should correctly set privilege expiration', async () => {
        await multiPrivilegeInstance.connect(admin).grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
        await multiPrivilegeInstance.connect(user1)['safeTransferFrom(address,address,uint256)'](user1.address, newOwner.address, nftTokenId);

        await multiPrivilegeInstance.createPrivilege(true, '');

        await multiPrivilegeInstance
          .connect(newOwner)
          .grantPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
        const expiresAt = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );

        expect(expiresAt).to.equal(expiresAtDefault);
      });
    });
  });

  describe('revokePrivilege', () => {
    beforeEach(async () => {
      await multiPrivilegeInstance.createPrivilege(true, '');
      await multiPrivilegeInstance
        .connect(user1)
        .grantPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
    });

    context('Error handling', () => {
      it('Should revert if caller is not owner or approved', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(nonAdmin)
            .revokePrivilege(nftTokenId, 1, user2.address)
        ).to.be.revertedWith('Caller is not owner nor approved');
      });
      it('Should revert if privilege Id is not valid', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .revokePrivilege(nftTokenId, 99, user2.address)
        ).to.be.revertedWith('User does not have privilege');
      });
      it('Should revert if user does not have privilege', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .revokePrivilege(nftTokenId, 1, user3.address)
        ).to.be.revertedWith('User does not have privilege');
      });
    });

    context('State change', () => {
      it('Should correctly set user and privilege expiration to 1', async () => {
        await multiPrivilegeInstance
          .connect(user1)
          .revokePrivilege(nftTokenId, 1, user2.address);

        const expiresAt = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );

        expect(expiresAt).to.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit PrivilegeRevoked event with correct params', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .revokePrivilege(nftTokenId, 1, user2.address)
        )
          .to.emit(multiPrivilegeInstance, 'PrivilegeRevoked')
          .withArgs(nftTokenId, 1, user2.address);
      });
    });

    context('Transferring token to new owner', () => {
      beforeEach(async () => {
        await multiPrivilegeInstance.connect(admin).grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
        await multiPrivilegeInstance.connect(user1)['safeTransferFrom(address,address,uint256)'](user1.address, newOwner.address, nftTokenId);
      });

      it('Should revert if revoking privilege assigned by previous owner', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(newOwner)
            .revokePrivilege(nftTokenId, 1, user2.address)
        ).to.be.revertedWith('User does not have privilege');
      });
      it('Should correctly set user and privilege expiration to 1', async () => {
        await multiPrivilegeInstance
          .connect(newOwner)
          .grantPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
        await multiPrivilegeInstance
          .connect(newOwner)
          .revokePrivilege(nftTokenId, 1, user2.address);

        const expiresAt = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );

        expect(expiresAt).to.equal(0);
      });
    });
  });

  describe('hasPrivilege', () => {
    beforeEach(async () => {
      await multiPrivilegeInstance.createPrivilege(true, '');
      await multiPrivilegeInstance
        .connect(user1)
        .grantPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
    });

    it('Should return false if privilege is not enabled', async () => {
      await multiPrivilegeInstance.disablePrivilege(1);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(
          nftTokenId,
          1,
          user2.address
        )
      ).to.be.false;
    });
    it('Should return false if user has no privilege', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(
          nftTokenId,
          1,
          user3.address
        )
      ).to.be.false;
    });
    it('Should return false if privilege Id is not valid', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(
          nftTokenId,
          99,
          user2.address
        )
      ).to.be.false;
    });
    it('Should return true if user has privilege', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(
          nftTokenId,
          1,
          user2.address
        )
      ).to.be.true;
    });
    it('Should return true if user is the NFT owner', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(
          nftTokenId,
          1,
          user1.address
        )
      ).to.be.true;
    });

    context('Transferring token to new owner', () => {
      beforeEach(async () => {
        await multiPrivilegeInstance.connect(admin).grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
      });

      it('Should return false for previous owner', async () => {
        // eslint-disable-next-line no-unused-expressions
        expect(
          await multiPrivilegeInstance.hasPrivilege(
            nftTokenId,
            1,
            user1.address
          )
        ).to.be.true;

        await multiPrivilegeInstance.connect(user1)['safeTransferFrom(address,address,uint256)'](user1.address, newOwner.address, nftTokenId);

        // eslint-disable-next-line no-unused-expressions
        expect(
          await multiPrivilegeInstance.hasPrivilege(
            nftTokenId,
            1,
            user1.address
          )
        ).to.be.false;
      });
      it('Should return true for the new owner', async () => {
        // eslint-disable-next-line no-unused-expressions
        expect(
          await multiPrivilegeInstance.hasPrivilege(
            nftTokenId,
            1,
            newOwner.address
          )
        ).to.be.false;

        await multiPrivilegeInstance.connect(user1)['safeTransferFrom(address,address,uint256)'](user1.address, newOwner.address, nftTokenId);

        // eslint-disable-next-line no-unused-expressions
        expect(
          await multiPrivilegeInstance.hasPrivilege(
            nftTokenId,
            1,
            newOwner.address
          )
        ).to.be.true;
      });
      it('Should return false for previous users that received the privilege', async () => {
        // eslint-disable-next-line no-unused-expressions
        expect(
          await multiPrivilegeInstance.hasPrivilege(
            nftTokenId,
            1,
            user2.address
          )
        ).to.be.true;

        await multiPrivilegeInstance.connect(user1)['safeTransferFrom(address,address,uint256)'](user1.address, newOwner.address, nftTokenId);

        // eslint-disable-next-line no-unused-expressions
        expect(
          await multiPrivilegeInstance.hasPrivilege(
            nftTokenId,
            1,
            user2.address
          )
        ).to.be.false;
      });
    });
  });
});
