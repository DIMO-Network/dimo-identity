import chai from 'chai';
import { ethers } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
  DIMORegistry,
  DimoAccessControl,
  Nodes,
  Integration,
  IntegrationId
} from '../../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  C
} from '../../utils';

const { expect } = chai;

describe('IntegrationId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let integrationInstance: Integration;
  let integrationIdInstance: IntegrationId;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let integrationOwner1: HardhatEthersSigner;
  let integrationOwner2: HardhatEthersSigner;
  let nonController: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      integrationOwner1,
      integrationOwner2,
      nonController
    ] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'Nodes', 'Integration'],
      nfts: ['IntegrationId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    integrationInstance = deployments.Integration;
    integrationIdInstance = deployments.IntegrationId;

    await grantAdminRoles(admin, dimoAccessControlInstance);

    // Grant NFT minter roles to DIMO Registry contract
    await integrationIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());

    // Set NFT Proxy
    await integrationInstance
      .connect(admin)
      .setIntegrationIdProxyAddress(await integrationIdInstance.getAddress());

    // Whitelist Integration attributes
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute1);
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute2);

    // Setting DIMORegistry address
    await integrationIdInstance.setDimoRegistryAddress(
      await dimoRegistryInstance.getAddress()
    );

    await integrationInstance
      .connect(admin)
      .mintIntegration(
        integrationOwner1.address,
        C.mockIntegrationNames[0],
        C.mockIntegrationAttributeInfoPairs
      );
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
        integrationIdInstance
          .connect(nonAdmin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
    it('Should revert if addr is zero address', async () => {
      await expect(
        integrationIdInstance
          .connect(admin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWithCustomError(integrationIdInstance, 'ZeroAddress');
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        integrationIdInstance
          .connect(nonAdmin)
          .setTrustedForwarder(C.ZERO_ADDRESS, true)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set address as trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.false;

      await integrationIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.true;
    });
    it('Should correctly set address as not trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();
      await integrationIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.true;

      await integrationIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, false);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.false;
    });
  });

  context('On transfer', async () => {
    context('Error handling', () => {
      it('Should revert if the new owner is not a controller', async () => {
        await expect(
          integrationIdInstance
            .connect(integrationOwner1)
          ['safeTransferFrom(address,address,uint256)'](
            integrationOwner1.address,
            nonController.address,
            1
          )
        ).to.be.revertedWithCustomError(integrationInstance, 'NotAllowed')
          .withArgs(nonController.address);
      });
      it('Should revert if the new owner has already minted', async () => {
        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner2.address,
            C.mockIntegrationNames[1],
            C.mockIntegrationAttributeInfoPairs
          );

        await expect(
          integrationIdInstance
            .connect(integrationOwner1)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            integrationOwner2.address,
            1
          )
        ).to.be.revertedWithCustomError(integrationInstance, 'NotAllowed')
          .withArgs(integrationOwner2.address);
      });
      it('Should revert if caller does not have transferer role', async () => {
        await integrationInstance
          .connect(admin)
          .setIntegrationController(integrationOwner2.address);

        await expect(
          integrationIdInstance
            .connect(integrationOwner1)
          ['safeTransferFrom(address,address,uint256)'](
            integrationOwner1.address,
            integrationOwner2.address,
            1
          )
        ).to.be.revertedWith(
          `AccessControl: account ${integrationOwner1.address.toLowerCase()} is missing role ${C.NFT_TRANSFERER_ROLE
          }`
        );
      });
    });

    context('State', () => {
      beforeEach(async () => {
        await integrationIdInstance
          .connect(admin)
          .grantRole(C.NFT_TRANSFERER_ROLE, integrationOwner1.address);
        await integrationInstance
          .connect(admin)
          .setIntegrationController(integrationOwner2.address);
        await integrationInstance
          .connect(admin)
          .setIntegrationInfo(1, C.mockIntegrationAttributeInfoPairs);
      });

      it('Should keep parent node as 0', async () => {
        expect(
          await nodesInstance.getParentNode(await integrationInstance.getAddress(), 1)
        ).to.equal(0);

        await integrationIdInstance
          .connect(integrationOwner1)
        ['safeTransferFrom(address,address,uint256)'](
          integrationOwner1.address,
          integrationOwner2.address,
          1
        );

        expect(
          await nodesInstance.getParentNode(await integrationInstance.getAddress(), 1)
        ).to.equal(0);
      });
      it('Should set new owner', async () => {
        expect(await integrationIdInstance.ownerOf(1)).to.equal(
          integrationOwner1.address
        );

        await integrationIdInstance
          .connect(integrationOwner1)
        ['safeTransferFrom(address,address,uint256)'](
          integrationOwner1.address,
          integrationOwner2.address,
          1
        );

        expect(await integrationIdInstance.ownerOf(1)).to.equal(
          integrationOwner2.address
        );
      });
      it('Should keep the same name', async () => {
        expect(
          await integrationInstance.getIntegrationIdByName(
            C.mockIntegrationNames[0]
          )
        ).to.equal(1);

        await integrationIdInstance
          .connect(integrationOwner1)
        ['safeTransferFrom(address,address,uint256)'](
          integrationOwner1.address,
          integrationOwner2.address,
          1
        );

        expect(
          await integrationInstance.getIntegrationIdByName(
            C.mockIntegrationNames[0]
          )
        ).to.equal(1);
      });
      it('Should keep the same infos', async () => {
        for (const attrInfoPair of C.mockIntegrationAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await integrationIdInstance.getAddress(),
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }

        await integrationIdInstance
          .connect(integrationOwner1)
        ['safeTransferFrom(address,address,uint256)'](
          integrationOwner1.address,
          integrationOwner2.address,
          1
        );

        for (const attrInfoPair of C.mockIntegrationAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await integrationIdInstance.getAddress(),
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should correctly set integrationMinted', async () => {
        const isIntegrationMintedBefore1 =
          await integrationInstance.isIntegrationMinted(
            integrationOwner1.address
          );
        const isIntegrationMintedBefore2 =
          await integrationInstance.isIntegrationMinted(
            integrationOwner2.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedBefore1).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedBefore2).to.be.false;

        await integrationIdInstance
          .connect(integrationOwner1)
        ['safeTransferFrom(address,address,uint256)'](
          integrationOwner1.address,
          integrationOwner2.address,
          1
        );

        const isIntegrationMintedAfter1 =
          await integrationInstance.isIntegrationMinted(
            integrationOwner1.address
          );
        const isIntegrationMintedAfter2 =
          await integrationInstance.isIntegrationMinted(
            integrationOwner2.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedAfter1).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedAfter2).to.be.true;
      });
    });
  });
});
