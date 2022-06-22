import chai from 'chai';
import { waffle } from 'hardhat';

import { Getter, Root } from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from './utils';

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
    [, getterInstance, rootInstance] = await initialize(['Getter', 'Root']);

    // Set root node type
    await rootInstance.connect(admin).setRootNodeType(C.rootNodeType);

    // Whitelist Root attributes
    await rootInstance.connect(admin).addRootAttribute(C.mockAttribute1);
    await rootInstance.connect(admin).addRootAttribute(C.mockAttribute2);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setNodeType', () => {
    it('Should revert if caller is not an admin', async () => {
      await expect(
        rootInstance.connect(nonAdmin).setRootNodeType(C.rootNodeType)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should revert if node type is already set', async () => {
      const [, localRootInstance] = await initialize(['Root']);

      await localRootInstance.connect(admin).setRootNodeType(C.rootNodeType);

      await expect(
        localRootInstance.connect(admin).setRootNodeType(C.rootNodeType)
      ).to.be.revertedWith('Node type already set');
    });
  });

  describe('addRootAttribute', () => {
    it('Should revert if caller is not an admin', async () => {
      await expect(
        rootInstance.connect(nonAdmin).addRootAttribute(C.mockAttribute1)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should emit AttributeAdded event with correct params', async () => {
      await expect(
        rootInstance.connect(admin).addRootAttribute(C.mockAttribute1)
      )
        .to.emit(rootInstance, 'AttributeAdded')
        .withArgs(C.mockAttribute1);
    });
  });

  describe('setController', () => {
    it('Should revert if caller is not an admin', async () => {
      await expect(
        rootInstance.connect(nonAdmin).setController(controller1.address)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should emit ControllerSet event with correct params', async () => {
      await expect(
        rootInstance.connect(admin).setController(controller1.address)
      )
        .to.emit(rootInstance, 'ControllerSet')
        .withArgs(controller1.address);
    });
  });

  describe('mintRoot', () => {
    it('Should revert if caller is not an admin', async () => {
      await expect(
        rootInstance
          .connect(nonAdmin)
          .mintRoot(nonController.address, C.mockAttributes, C.mockInfos)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should revert if controller has already minted a root', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);

      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(controller1.address, C.mockAttributes, C.mockInfos)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should correctly set owner as controller', async () => {
      const isControllerBefore: boolean = await rootInstance.isController(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isControllerBefore).to.be.false;

      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);

      const isControllerAfter: boolean = await rootInstance.isController(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isControllerAfter).to.be.true;
    });
    it('Should correctly set node type', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);

      const nodeType = await getterInstance.getNodeType(1);

      expect(nodeType).to.equal(C.rootNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);

      const parentNode = await getterInstance.getParentNode(1);

      // Assure it does not have parent
      expect(parentNode).to.be.equal(0);
    });
    it('Should correctly set node owner', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);

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
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);

      const isRootMintedAfter = await rootInstance.isRootMinted(
        controller1.address
      );

      // eslint-disable-next-line no-unused-expressions
      expect(isRootMintedAfter).to.be.true;
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(controller1.address, C.mockAttributes, C.mockInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(
            controller1.address,
            C.attributesNotWhitelisted,
            C.mockInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);

      expect(await getterInstance.getInfo(1, C.mockAttribute1)).to.be.equal(
        C.mockInfo1
      );
      expect(await getterInstance.getInfo(1, C.mockAttribute2)).to.be.equal(
        C.mockInfo2
      );
    });
  });

  describe('setRootInfo', () => {
    beforeEach(async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);
    });

    it('Should revert if caller is not an admin', async () => {
      await expect(
        rootInstance
          .connect(nonAdmin)
          .setRootInfo(1, C.mockAttributes, C.mockInfos)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .setRootInfo(1, C.mockAttributes, C.mockInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .setRootInfo(1, C.attributesNotWhitelisted, C.mockInfos)
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await rootInstance
        .connect(admin)
        .setRootInfo(1, C.mockAttributes, C.mockInfos);

      expect(await getterInstance.getInfo(1, C.mockAttribute1)).to.be.equal(
        C.mockInfo1
      );
      expect(await getterInstance.getInfo(1, C.mockAttribute2)).to.be.equal(
        C.mockInfo2
      );
    });
  });
});
