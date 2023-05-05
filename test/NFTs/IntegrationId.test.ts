import chai from 'chai';
import { waffle } from 'hardhat';

import {
  DIMORegistry,
  Nodes,
  Integration,
  IntegrationId
} from '../../typechain';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe.skip('IntegrationId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let nodesInstance: Nodes;
  let integrationInstance: Integration;
  let integrationIdInstance: IntegrationId;

  const [admin, integrationOwner1] = provider.getWallets();

  before(async () => {
    [
      dimoRegistryInstance,
      nodesInstance,
      integrationInstance,
      integrationIdInstance
    ] = await setup(admin, {
      modules: ['Nodes', 'Integration'],
      nfts: ['IntegrationId']
    });

    const MINTER_ROLE = await integrationIdInstance.MINTER_ROLE();
    await integrationIdInstance
      .connect(admin)
      .grantRole(MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxy
    await integrationInstance
      .connect(admin)
      .setIntegrationIdProxyAddress(integrationIdInstance.address);

    // Whitelist Integration attributes
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute1);
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute2);

    // Setting DIMORegistry address
    await integrationIdInstance.setDimoRegistryAddress(
      dimoRegistryInstance.address
    );
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setDimoRegistryAddress', () => {
    it('Should revert if addr is zero address', async () => {
      await expect(
        integrationIdInstance
          .connect(admin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith('Non zero address');
    });
  });

  context('On transfer', async () => {
    beforeEach(async () => {
      await integrationInstance
        .connect(admin)
        .mintIntegration(
          integrationOwner1.address,
          C.mockIntegrationNames[0],
          C.mockIntegrationAttributeInfoPairs
        );
      // for (const mockIntegrationName of C.mockIntegrationNames) {
      //   console.log('here');
      //   await integrationInstance
      //     .connect(admin)
      //     .mintIntegration(
      //       integrationOwner1.address,
      //       mockIntegrationName,
      //       C.mockIntegrationAttributeInfoPairs
      //     );
      // }
    });

    context('Error handling', () => {
      it('Should revert if the new owner is not a controller', async () => {
        await expect(
          integrationIdInstance
            .connect(admin)
            ['safeTransferFrom(address,address,uint256)'](
              admin.address,
              integrationOwner1.address,
              1
            )
        ).to.be.revertedWith('Address is not allowed to own a new token');
      });
      it('Should revert if the new owner has already minted', async () => {
        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            'New name',
            C.mockIntegrationAttributeInfoPairs
          );

        await expect(
          integrationIdInstance
            .connect(admin)
            ['safeTransferFrom(address,address,uint256)'](
              admin.address,
              integrationOwner1.address,
              1
            )
        ).to.be.revertedWith('Address is not allowed to own a new token');
      });
      it('Should revert if caller does not have transferer role', async () => {
        await integrationIdInstance
          .connect(admin)
          .renounceRole(C.NFT_TRANSFERER_ROLE, admin.address);
        await integrationInstance
          .connect(admin)
          .setController(integrationOwner1.address);

        await expect(
          integrationIdInstance
            .connect(admin)
            ['safeTransferFrom(address,address,uint256)'](
              admin.address,
              integrationOwner1.address,
              1
            )
        ).to.be.revertedWith(
          `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
            C.NFT_TRANSFERER_ROLE
          }`
        );
      });
    });

    context('State', () => {
      beforeEach(async () => {
        await integrationInstance
          .connect(admin)
          .setController(integrationOwner1.address);
        await integrationInstance
          .connect(admin)
          .setIntegrationInfo(1, C.mockIntegrationAttributeInfoPairs);
      });

      it('Should keep parent node as 0', async () => {
        expect(
          await nodesInstance.getParentNode(integrationInstance.address, 1)
        ).to.equal(0);

        await integrationIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            integrationOwner1.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(integrationInstance.address, 1)
        ).to.equal(0);
      });
      it('Should set new owner', async () => {
        expect(await integrationIdInstance.ownerOf(1)).to.equal(admin.address);

        await integrationIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            integrationOwner1.address,
            1
          );

        expect(await integrationIdInstance.ownerOf(1)).to.equal(
          integrationOwner1.address
        );
      });
      it('Should keep the same name', async () => {
        expect(
          await integrationInstance.getIntegrationIdByName(
            C.mockIntegrationNames[0]
          )
        ).to.equal(1);

        await integrationIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            integrationOwner1.address,
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
              integrationIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }

        await integrationIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            integrationOwner1.address,
            1
          );

        for (const attrInfoPair of C.mockIntegrationAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              integrationIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should correctly set integrationMinted', async () => {
        const isIntegrationMintedBefore =
          await integrationInstance.isIntegrationMinted(
            integrationOwner1.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedBefore).to.be.false;

        await integrationIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            integrationOwner1.address,
            1
          );

        const isIntegrationMintedAfter =
          await integrationInstance.isIntegrationMinted(
            integrationOwner1.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedAfter).to.be.true;
      });
    });
  });
});
