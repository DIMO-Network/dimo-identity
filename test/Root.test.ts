import chai from 'chai';
import { waffle } from 'hardhat';

import { Getter, Root } from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Root', async function () {
  let snapshot: string;
  let getterInstance: Getter;
  let rootInstance: Root;

  const [admin, nonAdmin, controller1, nonController] = provider.getWallets();

  before(async () => {
    [, getterInstance, , rootInstance] = await initialize(
      admin,
      [C.name, C.symbol, C.baseURI],
      'Getter',
      'Metadata',
      'Root'
    );

    // Set root node type
    await rootInstance.connect(admin).setRootNodeType(C.rootNodeType);

    // Whitelist Root attributes
    await rootInstance.connect(admin).addRootAttribute(C.mockRootAttributeName);
    await rootInstance.connect(admin).addRootAttribute(C.mockRootAttribute1);
    await rootInstance.connect(admin).addRootAttribute(C.mockRootAttribute2);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setRootNodeType', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        rootInstance.connect(nonAdmin).setRootNodeType(C.rootNodeType)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node type is already set', async () => {
      const [, localRootInstance] = await initialize(
        admin,
        [C.name, C.symbol, C.baseURI],
        'Root'
      );

      await localRootInstance.connect(admin).setRootNodeType(C.rootNodeType);

      await expect(
        localRootInstance.connect(admin).setRootNodeType(C.rootNodeType)
      ).to.be.revertedWith('Node type already set');
    });
  });

  describe('addRootAttribute', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        rootInstance.connect(nonAdmin).addRootAttribute(C.mockRootAttribute1)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if attribute already exists', async () => {
      await expect(
        rootInstance.connect(admin).addRootAttribute(C.mockRootAttribute1)
      ).to.be.revertedWith('Attribute already exists');
    });
    it('Should emit AttributeAdded event with correct params', async () => {
      await expect(
        rootInstance.connect(admin).addRootAttribute(C.mockRootAttribute3)
      )
        .to.emit(rootInstance, 'AttributeAdded')
        .withArgs(C.rootNodeTypeId, C.mockRootAttribute3);
    });
  });

  describe('setController', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        rootInstance.connect(nonAdmin).setController(controller1.address)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if address is already a controller', async () => {
      await rootInstance.connect(admin).setController(controller1.address);

      await expect(
        rootInstance.connect(admin).setController(controller1.address)
      ).to.be.revertedWith('Already a controller');
    });
    it('Should emit ControllerSet event with correct params', async () => {
      await expect(
        rootInstance.connect(admin).setController(controller1.address)
      )
        .to.emit(rootInstance, 'ControllerSet')
        .withArgs(controller1.address);
    });
  });

  describe('mintRootBatch', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        rootInstance
          .connect(nonAdmin)
          .mintRootBatch(nonAdmin.address, C.mockRootNames)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set node type', async () => {
      await rootInstance
        .connect(admin)
        .mintRootBatch(admin.address, C.mockRootNames);

      const nodeType1 = await getterInstance.getNodeType(1);
      const nodeType2 = await getterInstance.getNodeType(2);
      const nodeType3 = await getterInstance.getNodeType(3);

      expect(nodeType1).to.equal(C.rootNodeTypeId);
      expect(nodeType2).to.equal(C.rootNodeTypeId);
      expect(nodeType3).to.equal(C.rootNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await rootInstance
        .connect(admin)
        .mintRootBatch(admin.address, C.mockRootNames);

      const parentNode1 = await getterInstance.getParentNode(1);
      const parentNode2 = await getterInstance.getParentNode(2);
      const parentNode3 = await getterInstance.getParentNode(3);

      // Assure it does not have parent
      expect(parentNode1).to.be.equal(0);
      expect(parentNode2).to.be.equal(0);
      expect(parentNode3).to.be.equal(0);
    });
    it('Should correctly set node owner', async () => {
      await rootInstance
        .connect(admin)
        .mintRootBatch(admin.address, C.mockRootNames);

      const nodeOwner1 = await getterInstance.ownerOf(1);
      const nodeOwner2 = await getterInstance.ownerOf(2);
      const nodeOwner3 = await getterInstance.ownerOf(3);

      expect(nodeOwner1).to.be.equal(admin.address);
      expect(nodeOwner2).to.be.equal(admin.address);
      expect(nodeOwner3).to.be.equal(admin.address);
    });
    it('Should correctly set names', async () => {
      await rootInstance
        .connect(admin)
        .mintRootBatch(admin.address, C.mockRootNames);

      const nameAttribute1 = await getterInstance.getInfo(
        1,
        C.mockRootAttributeName
      );
      const nameAttribute2 = await getterInstance.getInfo(
        2,
        C.mockRootAttributeName
      );
      const nameAttribute3 = await getterInstance.getInfo(
        3,
        C.mockRootAttributeName
      );

      expect([nameAttribute1, nameAttribute2, nameAttribute3]).to.eql(
        C.mockRootNames
      );
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRootBatch(admin.address, C.mockRootNames)
      )
        .to.emit(rootInstance, 'NodeMinted')
        .withArgs(C.rootNodeTypeId, 1)
        .to.emit(rootInstance, 'NodeMinted')
        .withArgs(C.rootNodeTypeId, 2)
        .to.emit(rootInstance, 'NodeMinted')
        .withArgs(C.rootNodeTypeId, 3);
    });
  });

  describe('mintRoot', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        rootInstance
          .connect(nonAdmin)
          .mintRoot(
            nonController.address,
            C.mockRootAttributes,
            C.mockRootInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if controller has already minted a root', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);

      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(
            controller1.address,
            C.mockRootAttributes,
            C.mockRootInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(
            controller1.address,
            C.rootAttributesNotWhitelisted,
            C.mockRootInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set owner as controller', async () => {
      const isControllerBefore: boolean = await rootInstance.isController(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isControllerBefore).to.be.false;

      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);

      const isControllerAfter: boolean = await rootInstance.isController(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isControllerAfter).to.be.true;
    });
    it('Should correctly set node type', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);

      const nodeType = await getterInstance.getNodeType(1);

      expect(nodeType).to.equal(C.rootNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);

      const parentNode = await getterInstance.getParentNode(1);

      // Assure it does not have parent
      expect(parentNode).to.be.equal(0);
    });
    it('Should correctly set node owner', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);

      expect(await getterInstance.ownerOf(1)).to.be.equal(controller1.address);
    });
    it('Should correctly set rootMinted', async () => {
      const isRootMintedBefore = await rootInstance.isRootMinted(
        controller1.address
      );

      // eslint-disable-next-line no-unused-expressions
      expect(isRootMintedBefore).to.be.false;

      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);

      const isRootMintedAfter = await rootInstance.isRootMinted(
        controller1.address
      );

      // eslint-disable-next-line no-unused-expressions
      expect(isRootMintedAfter).to.be.true;
    });
    it('Should correctly set infos', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);

      expect(await getterInstance.getInfo(1, C.mockRootAttribute1)).to.be.equal(
        C.mockRootInfo1
      );
      expect(await getterInstance.getInfo(1, C.mockRootAttribute2)).to.be.equal(
        C.mockRootInfo2
      );
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos)
      )
        .to.emit(rootInstance, 'NodeMinted')
        .withArgs(C.rootNodeTypeId, 1);
    });
  });

  describe('setRootInfo', () => {
    beforeEach(async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        rootInstance
          .connect(nonAdmin)
          .setRootInfo(1, C.mockRootAttributes, C.mockRootInfos)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node is not a root', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .setRootInfo(99, C.mockRootAttributes, C.mockRootInfos)
      ).to.be.revertedWith('Node must be a root');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .setRootInfo(1, C.mockRootAttributes, C.mockRootInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .setRootInfo(1, C.rootAttributesNotWhitelisted, C.mockRootInfos)
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await rootInstance
        .connect(admin)
        .setRootInfo(1, C.mockRootAttributes, C.mockRootInfos);

      expect(await getterInstance.getInfo(1, C.mockRootAttribute1)).to.be.equal(
        C.mockRootInfo1
      );
      expect(await getterInstance.getInfo(1, C.mockRootAttribute2)).to.be.equal(
        C.mockRootInfo2
      );
    });
  });
});
