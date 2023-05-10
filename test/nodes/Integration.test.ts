import chai from 'chai';
import { waffle } from 'hardhat';

import {
  DIMORegistry,
  Nodes,
  Integration,
  IntegrationId
} from '../../typechain';
import {
  initialize,
  setup,
  createSnapshot,
  revertToSnapshot,
  C
} from '../../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Integration', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let nodesInstance: Nodes;
  let integrationInstance: Integration;
  let integrationIdInstance: IntegrationId;

  const [admin, nonAdmin, integrationOwner1, nonController] =
    provider.getWallets();

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
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setIntegrationIdProxyAddress', () => {
    let localIntegrationInstance: Integration;
    beforeEach(async () => {
      [, localIntegrationInstance] = await initialize(admin, 'Integration');
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localIntegrationInstance
            .connect(nonAdmin)
            .setIntegrationIdProxyAddress(integrationIdInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localIntegrationInstance
            .connect(admin)
            .setIntegrationIdProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit IntegrationIdProxySet event with correct params', async () => {
        await expect(
          localIntegrationInstance
            .connect(admin)
            .setIntegrationIdProxyAddress(integrationIdInstance.address)
        )
          .to.emit(localIntegrationInstance, 'IntegrationIdProxySet')
          .withArgs(integrationIdInstance.address);
      });
    });
  });

  describe('addIntegrationAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          integrationInstance
            .connect(nonAdmin)
            .addIntegrationAttribute(C.mockIntegrationAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .addIntegrationAttribute(C.mockIntegrationAttribute1)
        ).to.be.revertedWith('Attribute already exists');
      });
    });

    context('Events', () => {
      it('Should emit IntegrationAttributeAdded event with correct params', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .addIntegrationAttribute(C.mockIntegrationAttribute3)
        )
          .to.emit(integrationInstance, 'IntegrationAttributeAdded')
          .withArgs(C.mockIntegrationAttribute3);
      });
    });
  });

  describe('setIntegrationController', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          integrationInstance
            .connect(nonAdmin)
            .setIntegrationController(integrationOwner1.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if address is the zero address', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .setIntegrationController(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
      it('Should revert if address is already a controller', async () => {
        await integrationInstance
          .connect(admin)
          .setIntegrationController(integrationOwner1.address);

        await expect(
          integrationInstance
            .connect(admin)
            .setIntegrationController(integrationOwner1.address)
        ).to.be.revertedWith('Already a controller');
      });
    });

    context('Events', () => {
      it('Should emit ControllerSet event with correct params', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .setIntegrationController(integrationOwner1.address)
        )
          .to.emit(integrationInstance, 'ControllerSet')
          .withArgs(integrationOwner1.address);
      });
    });
  });

  describe('mintIntegration', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          integrationInstance
            .connect(nonAdmin)
            .mintIntegration(
              nonController.address,
              C.mockIntegrationNames[0],
              C.mockIntegrationAttributeInfoPairs
            )
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if controller has already minted a integration', async () => {
        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            C.mockIntegrationNames[0],
            C.mockIntegrationAttributeInfoPairs
          );

        await expect(
          integrationInstance
            .connect(admin)
            .mintIntegration(
              integrationOwner1.address,
              C.mockIntegrationNames[1],
              C.mockIntegrationAttributeInfoPairs
            )
        ).to.be.revertedWith('Invalid request');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .mintIntegration(
              integrationOwner1.address,
              C.mockIntegrationNames[0],
              C.mockIntegrationAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State', () => {
      it('Should correctly set owner as controller', async () => {
        const isControllerBefore: boolean =
          await integrationInstance.isIntegrationController(
            integrationOwner1.address
          );
        // eslint-disable-next-line no-unused-expressions
        expect(isControllerBefore).to.be.false;

        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            C.mockIntegrationNames[0],
            C.mockIntegrationAttributeInfoPairs
          );

        const isControllerAfter: boolean =
          await integrationInstance.isIntegrationController(
            integrationOwner1.address
          );
        // eslint-disable-next-line no-unused-expressions
        expect(isControllerAfter).to.be.true;
      });
      it('Should correctly set parent node', async () => {
        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            C.mockIntegrationNames[0],
            C.mockIntegrationAttributeInfoPairs
          );

        const parentNode = await nodesInstance.getParentNode(
          integrationIdInstance.address,
          1
        );

        // Assure it does not have parent
        expect(parentNode).to.be.equal(0);
      });
      it('Should correctly set node owner', async () => {
        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            C.mockIntegrationNames[0],
            C.mockIntegrationAttributeInfoPairs
          );

        expect(await integrationIdInstance.ownerOf(1)).to.be.equal(
          integrationOwner1.address
        );
      });
      it('Should correctly set integrationMinted', async () => {
        const isIntegrationMintedBefore =
          await integrationInstance.isIntegrationMinted(
            integrationOwner1.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedBefore).to.be.false;

        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            C.mockIntegrationNames[0],
            C.mockIntegrationAttributeInfoPairs
          );

        const isIntegrationMintedAfter =
          await integrationInstance.isIntegrationMinted(
            integrationOwner1.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isIntegrationMintedAfter).to.be.true;
      });
      it('Should correctly set name', async () => {
        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            C.mockIntegrationNames[0],
            C.mockIntegrationAttributeInfoPairs
          );

        const id = (
          await integrationInstance.getIntegrationIdByName(
            C.mockIntegrationNames[0]
          )
        ).toNumber();

        expect(id).to.be.equal(1);
      });
      it('Should correctly set infos', async () => {
        await integrationInstance
          .connect(admin)
          .mintIntegration(
            integrationOwner1.address,
            C.mockIntegrationNames[0],
            C.mockIntegrationAttributeInfoPairs
          );

        expect(
          await nodesInstance.getInfo(
            integrationIdInstance.address,
            1,
            C.mockIntegrationAttribute1
          )
        ).to.be.equal(C.mockIntegrationInfo1);
        expect(
          await nodesInstance.getInfo(
            integrationIdInstance.address,
            1,
            C.mockIntegrationAttribute2
          )
        ).to.be.equal(C.mockIntegrationInfo2);
      });
    });

    context('Events', () => {
      it('Should emit IntegrationNodeMinted event with correct params', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .mintIntegration(
              integrationOwner1.address,
              C.mockIntegrationNames[0],
              C.mockIntegrationAttributeInfoPairs
            )
        )
          .to.emit(integrationInstance, 'IntegrationNodeMinted')
          .withArgs(1, admin.address);
      });
      it('Should emit IntegrationAttributeSet events with correct params', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .mintIntegration(
              integrationOwner1.address,
              C.mockIntegrationNames[0],
              C.mockIntegrationAttributeInfoPairs
            )
        )
          .to.emit(integrationInstance, 'IntegrationAttributeSet')
          .withArgs(
            1,
            C.mockIntegrationAttributeInfoPairs[0].attribute,
            C.mockIntegrationAttributeInfoPairs[0].info
          )
          .to.emit(integrationInstance, 'IntegrationAttributeSet')
          .withArgs(
            1,
            C.mockIntegrationAttributeInfoPairs[1].attribute,
            C.mockIntegrationAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('setIntegrationInfo', () => {
    beforeEach(async () => {
      await integrationInstance
        .connect(admin)
        .mintIntegration(
          integrationOwner1.address,
          C.mockIntegrationNames[0],
          C.mockIntegrationAttributeInfoPairs
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          integrationInstance
            .connect(nonAdmin)
            .setIntegrationInfo(1, C.mockIntegrationAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not a integration', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .setIntegrationInfo(99, C.mockIntegrationAttributeInfoPairs)
        ).to.be.revertedWith('Invalid integration node');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          integrationInstance
            .connect(admin)
            .setIntegrationInfo(
              1,
              C.mockIntegrationAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockIntegrationAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            integrationIdInstance.address,
            1,
            C.mockIntegrationAttribute1
          )
        ).to.be.equal(C.mockIntegrationInfo1);
        expect(
          await nodesInstance.getInfo(
            integrationIdInstance.address,
            1,
            C.mockIntegrationAttribute2
          )
        ).to.be.equal(C.mockIntegrationInfo2);

        await integrationInstance
          .connect(admin)
          .setIntegrationInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            integrationIdInstance.address,
            1,
            C.mockIntegrationAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            integrationIdInstance.address,
            1,
            C.mockIntegrationAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit IntegrationAttributeSet events with correct params', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockIntegrationAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        await expect(
          integrationInstance
            .connect(admin)
            .setIntegrationInfo(1, localNewAttributeInfoPairs)
        )
          .to.emit(integrationInstance, 'IntegrationAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[0].attribute,
            localNewAttributeInfoPairs[0].info
          )
          .to.emit(integrationInstance, 'IntegrationAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[1].attribute,
            localNewAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('setIntegrationMinted', () => {
    it('Should revert if caller is not the NFT Proxy', async () => {
      await expect(
        integrationInstance
          .connect(nonAdmin)
          .setIntegrationMinted(integrationOwner1.address)
      ).to.be.revertedWith('Only NFT Proxy');
    });
  });

  describe('getIntegrationIdByName', () => {
    beforeEach(async () => {
      await integrationInstance
        .connect(admin)
        .mintIntegration(
          integrationOwner1.address,
          C.mockIntegrationNames[0],
          C.mockIntegrationAttributeInfoPairs
        );
    });

    it('Should return 0 if the queried name is not associated with any minted device', async () => {
      const tokenId = await integrationInstance.getIntegrationIdByName(
        C.mockIntegrationNames[1]
      );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId = await integrationInstance.getIntegrationIdByName(
        C.mockIntegrationNames[0]
      );

      expect(tokenId).to.equal(1);
    });
  });

  describe('getIntegrationNameById', () => {
    beforeEach(async () => {
      await integrationInstance
        .connect(admin)
        .mintIntegration(
          integrationOwner1.address,
          C.mockIntegrationNames[0],
          C.mockIntegrationAttributeInfoPairs
        );
    });

    it('Should return an empty string if the queried Id is not associated with any minted device', async () => {
      const name = await integrationInstance.getIntegrationNameById(99);

      expect(name).to.equal('');
    });
    it('Should return the correct name', async () => {
      const name = await integrationInstance.getIntegrationNameById(1);

      expect(name).to.equal(C.mockIntegrationNames[0]);
    });
  });

  describe('isIntegrationController', () => {
    it('Should return false if address is not a controller', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationInstance.isIntegrationController(nonController.address)
      ).to.be.false;
    });
    it('Should return true if address is a controller', async () => {
      await integrationInstance
        .connect(admin)
        .setIntegrationController(integrationOwner1.address);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationInstance.isIntegrationController(
          integrationOwner1.address
        )
      ).to.be.true;
    });
  });

  describe('isIntegrationMinted', () => {
    it('Should return false if integration has not yet minted', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationInstance.isIntegrationMinted(integrationOwner1.address)
      ).to.be.false;
    });
    it('Should return true if integration has minted', async () => {
      await integrationInstance
        .connect(admin)
        .mintIntegration(
          integrationOwner1.address,
          C.mockIntegrationNames[0],
          C.mockIntegrationAttributeInfoPairs
        );

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationInstance.isIntegrationMinted(integrationOwner1.address)
      ).to.be.true;
    });
  });

  describe('isAllowedToOwnIntegrationNode', () => {
    it('Should return false if address is not a controller', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationInstance.isAllowedToOwnIntegrationNode(
          integrationOwner1.address
        )
      ).to.be.false;
    });
    it('Should return false if address has already minted', async () => {
      await integrationInstance
        .connect(admin)
        .mintIntegration(
          integrationOwner1.address,
          C.mockIntegrationNames[0],
          C.mockIntegrationAttributeInfoPairs
        );

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationInstance.isAllowedToOwnIntegrationNode(
          integrationOwner1.address
        )
      ).to.be.false;
    });
    it('Should return true if address is a controller and has not yet minted', async () => {
      await integrationInstance
        .connect(admin)
        .setIntegrationController(integrationOwner1.address);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await integrationInstance.isAllowedToOwnIntegrationNode(
          integrationOwner1.address
        )
      ).to.be.true;
    });
  });
});
