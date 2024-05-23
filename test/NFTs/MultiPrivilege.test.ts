import chai from 'chai';
import { EventLog } from 'ethers';
import { ethers } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { time } from '@nomicfoundation/hardhat-network-helpers';

import { MockMultiPrivilege } from '../../typechain-types';
import {
  deployUpgradeableContracts,
  createSnapshot,
  revertToSnapshot,
  SetPrivilegeData,
  C
} from '../../utils';

const { expect } = chai;

describe('MultiPrivilege', function () {
  let snapshot: string;
  let multiPrivilegeInstance: MockMultiPrivilege;
  let nftTokenId: string;
  let expiresAtDefault: number;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let user3: HardhatEthersSigner;
  let newOwner: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      user1,
      user2,
      user3,
      newOwner
    ] = await ethers.getSigners();

    expiresAtDefault = await time.latest() + 31556926; // + 1 year

    const deployments = await deployUpgradeableContracts(admin, [
      {
        name: 'MockMultiPrivilege',
        args: [
          C.MULTI_PRIVILEGE_NAME,
          C.MULTI_PRIVILEGE_SYMBOL,
          C.MULTI_PRIVILEGE_URI
        ],
        opts: {
          initializer: 'initialize',
          kind: 'uups'
        }
      }
    ]);
    multiPrivilegeInstance = deployments.MockMultiPrivilege;

    await multiPrivilegeInstance
      .connect(admin)
      .grantRole(C.ADMIN_ROLE, admin.address);

    const receipt = await (
      await multiPrivilegeInstance['safeMint(address)'](user1.address)
    ).wait();

    nftTokenId = (receipt?.logs[0] as EventLog).args[2].toString()
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
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
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
        .createPrivilege(true, C.MULTI_PRIVILEGE_DESCRIPTION); // 1
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          multiPrivilegeInstance.connect(nonAdmin).enablePrivilege(1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
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

    context('State', () => {
      it('Should correctly set new privilege record', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .createPrivilege(true, C.MULTI_PRIVILEGE_DESCRIPTION); // 1
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
        .createPrivilege(false, C.MULTI_PRIVILEGE_DESCRIPTION); // 1
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          multiPrivilegeInstance.connect(nonAdmin).disablePrivilege(1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
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

    context('State', () => {
      it('Should correctly set new privilege record', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .createPrivilege(true, C.MULTI_PRIVILEGE_DESCRIPTION); // 1
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

  describe('setPrivilege', () => {
    context('Error handling', () => {
      it('Should revert if caller is not owner or approved', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(nonAdmin)
            .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault)
        ).to.be.revertedWith('Caller is not owner nor approved');
      });
      it('Should revert if privilege Id is not valid', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .setPrivilege(nftTokenId, 99, user2.address, expiresAtDefault)
        ).to.be.revertedWith('Invalid privilege id');
      });
      it('Should revert if privilege is not enabled', async () => {
        await multiPrivilegeInstance.createPrivilege(false, ''); // 1

        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault)
        ).to.be.revertedWith('Privilege not enabled');
      });
    });

    context('State', () => {
      it('Should correctly set privilege expiration', async () => {
        await multiPrivilegeInstance.createPrivilege(true, ''); // 1

        await multiPrivilegeInstance
          .connect(user1)
          .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
        const expiresAt = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );

        expect(expiresAt).to.equal(expiresAtDefault);
      });
    });

    context('Events', () => {
      it('Should emit PrivilegeSet event with correct params', async () => {
        await multiPrivilegeInstance.createPrivilege(true, '');

        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault)
        )
          .to.emit(multiPrivilegeInstance, 'PrivilegeSet')
          .withArgs(nftTokenId, 0, 1, user2.address, expiresAtDefault);
      });
    });

    context('Transferring token to new owner', () => {
      it('Should correctly set privilege expiration', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
        await multiPrivilegeInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          newOwner.address,
          nftTokenId
        );

        await multiPrivilegeInstance.createPrivilege(true, ''); // 1

        await multiPrivilegeInstance
          .connect(newOwner)
          .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
        const expiresAt = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );

        expect(expiresAt).to.equal(expiresAtDefault);
      });
      it('Should emit PrivilegeSet event with the new version', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
        await multiPrivilegeInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          newOwner.address,
          nftTokenId
        );

        await multiPrivilegeInstance.createPrivilege(true, ''); // 1

        await expect(
          multiPrivilegeInstance
            .connect(newOwner)
            .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault)
        )
          .to.emit(multiPrivilegeInstance, 'PrivilegeSet')
          .withArgs(nftTokenId, 1, 1, user2.address, expiresAtDefault);
      });
    });
  });

  describe('setPrivileges', () => {
    let nftTokenId2: string;
    let nftTokenId3: string;
    let mockSetPrivilegeData: SetPrivilegeData[] = [];
    let mockSetPrivilegeDataWrongPrivId: SetPrivilegeData[] = [];

    beforeEach(async () => {
      const receipt2 = await (
        await multiPrivilegeInstance['safeMint(address)'](user1.address)
      ).wait();
      const receipt3 = await (
        await multiPrivilegeInstance['safeMint(address)'](user1.address)
      ).wait();

      nftTokenId2 = (receipt2?.logs[0] as EventLog).args[2].toString()
      nftTokenId3 = (receipt3?.logs[0] as EventLog).args[2].toString()

      mockSetPrivilegeData = [
        {
          tokenId: nftTokenId,
          privId: '1',
          user: user2.address,
          expires: expiresAtDefault.toString()
        },
        {
          tokenId: nftTokenId2,
          privId: '2',
          user: user2.address,
          expires: expiresAtDefault.toString()
        },
        {
          tokenId: nftTokenId3,
          privId: '3',
          user: user2.address,
          expires: expiresAtDefault.toString()
        }
      ];
      mockSetPrivilegeDataWrongPrivId = [
        {
          tokenId: nftTokenId,
          privId: '1',
          user: user2.address,
          expires: expiresAtDefault.toString()
        },
        {
          tokenId: nftTokenId2,
          privId: '99',
          user: user2.address,
          expires: expiresAtDefault.toString()
        },
        {
          tokenId: nftTokenId3,
          privId: '3',
          user: user2.address,
          expires: expiresAtDefault.toString()
        }
      ];
    });

    context('Error handling', () => {
      it('Should revert if caller is not owner or approved', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(nonAdmin)
            .setPrivileges(mockSetPrivilegeData)
        ).to.be.revertedWith('Caller is not owner nor approved');
      });
      it('Should revert if privilege Id is not valid', async () => {
        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .setPrivileges(mockSetPrivilegeDataWrongPrivId)
        ).to.be.revertedWith('Invalid privilege id');
      });
      it('Should revert if privilege is not enabled', async () => {
        await multiPrivilegeInstance.createPrivilege(false, ''); // 1

        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .setPrivileges(mockSetPrivilegeData)
        ).to.be.revertedWith('Privilege not enabled');
      });
    });

    context('State', () => {
      it('Should correctly set privilege expiration', async () => {
        await multiPrivilegeInstance.createPrivilege(true, ''); // 1
        await multiPrivilegeInstance.createPrivilege(true, ''); // 2
        await multiPrivilegeInstance.createPrivilege(true, ''); // 3

        await multiPrivilegeInstance
          .connect(user1)
          .setPrivileges(mockSetPrivilegeData);
        const expiresAt1 = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );
        const expiresAt2 = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId2,
          2,
          user2.address
        );
        const expiresAt3 = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId3,
          3,
          user2.address
        );

        expect(expiresAt1).to.equal(expiresAtDefault);
        expect(expiresAt2).to.equal(expiresAtDefault);
        expect(expiresAt3).to.equal(expiresAtDefault);
      });
    });

    context('Events', () => {
      it('Should emit PrivilegeSet event with correct params', async () => {
        await multiPrivilegeInstance.createPrivilege(true, ''); // 1
        await multiPrivilegeInstance.createPrivilege(true, ''); // 2
        await multiPrivilegeInstance.createPrivilege(true, ''); // 3

        await expect(
          multiPrivilegeInstance
            .connect(user1)
            .setPrivileges(mockSetPrivilegeData)
        )
          .to.emit(multiPrivilegeInstance, 'PrivilegeSet')
          .withArgs(nftTokenId, 0, 1, user2.address, expiresAtDefault)
          .to.emit(multiPrivilegeInstance, 'PrivilegeSet')
          .withArgs(nftTokenId2, 0, 2, user2.address, expiresAtDefault)
          .to.emit(multiPrivilegeInstance, 'PrivilegeSet')
          .withArgs(nftTokenId3, 0, 3, user2.address, expiresAtDefault);
      });
    });

    context('Transferring token to new owner', () => {
      it('Should correctly set privilege expiration', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
        await multiPrivilegeInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          newOwner.address,
          nftTokenId
        );

        await multiPrivilegeInstance.createPrivilege(true, ''); // 1

        await multiPrivilegeInstance
          .connect(newOwner)
          .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
        const expiresAt = await multiPrivilegeInstance.privilegeExpiresAt(
          nftTokenId,
          1,
          user2.address
        );

        expect(expiresAt).to.equal(expiresAtDefault);
      });
      it('Should emit PrivilegeSet event with the new version', async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
        await multiPrivilegeInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          newOwner.address,
          nftTokenId
        );

        await multiPrivilegeInstance.createPrivilege(true, ''); // 1

        await expect(
          multiPrivilegeInstance
            .connect(newOwner)
            .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault)
        )
          .to.emit(multiPrivilegeInstance, 'PrivilegeSet')
          .withArgs(nftTokenId, 1, 1, user2.address, expiresAtDefault);
      });
    });
  });

  describe('hasPrivilege', () => {
    beforeEach(async () => {
      await multiPrivilegeInstance.createPrivilege(true, ''); // 1
      await multiPrivilegeInstance
        .connect(user1)
        .setPrivilege(nftTokenId, 1, user2.address, expiresAtDefault);
    });

    it('Should return false if privilege is not enabled', async () => {
      await multiPrivilegeInstance.disablePrivilege(1);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(nftTokenId, 1, user2.address)
      ).to.be.false;
    });
    it('Should return false if user has no privilege', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(nftTokenId, 1, user3.address)
      ).to.be.false;
    });
    it('Should return false if privilege Id is not valid', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(nftTokenId, 99, user2.address)
      ).to.be.false;
    });
    it('Should return false if privilege is expired', async () => {
      await time.increase(expiresAtDefault + 100);
      // await provider.send('evm_increaseTime', [expiresAtDefault * 100]);
      // await provider.send('evm_mine', []);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(nftTokenId, 1, user2.address)
      ).to.be.false;
    });
    it('Should return true if user has privilege', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(nftTokenId, 1, user2.address)
      ).to.be.true;
    });
    it('Should return true if user is the NFT owner', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await multiPrivilegeInstance.hasPrivilege(nftTokenId, 1, user1.address)
      ).to.be.true;
    });

    context('Transferring token to new owner', () => {
      beforeEach(async () => {
        await multiPrivilegeInstance
          .connect(admin)
          .grantRole(C.NFT_TRANSFERER_ROLE, user1.address);
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

        await multiPrivilegeInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          newOwner.address,
          nftTokenId
        );

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

        await multiPrivilegeInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          newOwner.address,
          nftTokenId
        );

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

        await multiPrivilegeInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          newOwner.address,
          nftTokenId
        );

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
