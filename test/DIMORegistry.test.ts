import chai, { expect } from 'chai';
import { ethers, waffle } from 'hardhat';

import { nodeHash } from './utils';
import { Controller, Record } from './types';
import { DIMORegistry } from '../typechain';

const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

const mockRootLabel = 'mockRootLabel';
const mockDeviceLabel = 'mockDeviceLabel';
const mockNodeLabel = 'mockNodeLabel';
const mockRootHash = nodeHash(mockRootLabel);
const mockDeviceHash = nodeHash(`${mockDeviceLabel}.${mockRootLabel}`);
const mockNodeHash = nodeHash(
  `${mockNodeLabel}.${mockDeviceLabel}.${mockRootLabel}`
);
const mockRootId = ethers.BigNumber.from(mockRootHash);
const mockDeviceId = ethers.BigNumber.from(mockDeviceHash);
const mockNodeId = ethers.BigNumber.from(mockNodeHash);

const mockAttribute1 = ethers.utils.formatBytes32String('mockAttribute1');
const mockAttribute2 = ethers.utils.formatBytes32String('mockAttribute2');
const mockAttribute3 = ethers.utils.formatBytes32String('mockAttribute3');

const mockBaseURI = 'https://tokenURI.dimo.ngrok.io/nft/';
const mockTokenURI = ethers.utils.hexlify(mockDeviceId);
const mockTokenURI2 = mockTokenURI + 'TEST';
const fullTokenURI = `${mockBaseURI}${mockTokenURI}`;
const fullTokenURI2 = `${mockBaseURI}${mockTokenURI2}`;
const contractMetadataURI = 'https://tokenURI.dimo.ngrok.io/nft/metadata.json';
describe('DIMORegistry', () => {
  let dimoRegistry: DIMORegistry;

  const [admin, user1, user2, controller1, controller2] = provider.getWallets();

  beforeEach(async () => {
    const DimoRegistryFactory = await ethers.getContractFactory('DIMORegistry');
    dimoRegistry = await DimoRegistryFactory.connect(admin).deploy();
    await dimoRegistry.deployed();
  });

  describe('constructor', () => {
    it('Should set owner as controller', async () => {
      const controllerInfo: Controller = await dimoRegistry.controllers(
        admin.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerInfo.isController).to.be.true;
    });
  });
  describe('addBaseURI', () => {
    it('Should revert if caller is not the owner', async () => {
      await expect(
        dimoRegistry.connect(user1).setBaseURI(mockBaseURI)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
    it('Should be successful', async () => {
      await expect(dimoRegistry.connect(admin).setBaseURI(mockBaseURI));
    });
  });

  describe('addAttribute', () => {
    it('Should revert if caller is not the owner', async () => {
      await expect(
        dimoRegistry.connect(user1).addAttribute(mockAttribute1)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('setController', () => {
    it('Should revert if caller is not the owner', async () => {
      await expect(
        dimoRegistry.connect(user1).setController(controller1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('mintRootByOwner', () => {
    it('Should revert if caller is not the owner', async () => {
      await expect(
        dimoRegistry
          .connect(controller1)
          .mintRootByOwner(mockRootLabel, controller1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
    it('Should revert if controller has already minted a root', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      await expect(
        dimoRegistry
          .connect(admin)
          .mintRootByOwner(mockRootLabel, controller1.address)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if root already exists', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      await expect(
        dimoRegistry
          .connect(admin)
          .mintRootByOwner(mockRootLabel, controller2.address)
      ).to.be.revertedWith('Node already exists');
    });
    it('Should correctly set owner as controller', async () => {
      const controllerInfoBefore: Controller = await dimoRegistry.controllers(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerInfoBefore.isController).to.be.false;

      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      const controllerInfoAfter: Controller = await dimoRegistry.controllers(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerInfoAfter.isController).to.be.true;
    });
    it('Should correctly set node as root', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      const recordInfo: Record = await dimoRegistry.records(mockRootId);
      // eslint-disable-next-line no-unused-expressions
      expect(recordInfo.root).to.be.true;
    });
    it('Should correctly set originNode', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      const recordInfo: Record = await dimoRegistry.records(mockRootId);
      expect(recordInfo.originNode).to.be.equal(mockRootId);
    });
    it('Should correctly set rootMinted', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      const controllerInfo: Controller = await dimoRegistry.controllers(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerInfo.rootMinted).to.be.true;
    });
  });

  describe('mintRoot', () => {
    it('Should revert if caller is not a controller', async () => {
      await expect(
        dimoRegistry.connect(user1).mintRoot(mockRootLabel)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if controller has already minted a root', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      await expect(
        dimoRegistry.connect(controller1).mintRoot(mockRootLabel)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if root already exists', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(admin).setController(controller2.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      await expect(
        dimoRegistry.connect(controller2).mintRoot(mockRootLabel)
      ).to.be.revertedWith('Node already exists');
    });
    it('Should correctly set node as root', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      const recordInfo = await dimoRegistry.records(mockRootId);
      // eslint-disable-next-line no-unused-expressions
      expect(recordInfo.root).to.be.true;
    });
    it('Should correctly set originNode', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      const recordInfo: Record = await dimoRegistry.records(mockRootId);
      expect(recordInfo.originNode).to.be.equal(mockRootId);
    });
    it('Should correctly set rootMinted', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      const controllerInfo: Controller = await dimoRegistry.controllers(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controllerInfo.rootMinted).to.be.true;
    });
  });

  describe('mintDevice', () => {
    const attributes = [mockAttribute1, mockAttribute2];
    const mockInfo1 = 'mockInfo1';
    const mockInfo2 = 'mockInfo2';
    const mockInfos = [mockInfo1, mockInfo2];

    beforeEach(async () => {
      await dimoRegistry.connect(admin).addAttribute(mockAttribute1);
      await dimoRegistry.connect(admin).addAttribute(mockAttribute2);
    });

    it('Should revert if the parent node does not exist', async () => {
      await expect(
        dimoRegistry
          .connect(user1)
          .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if the parent node is not a root', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);

      await expect(
        dimoRegistry
          .connect(user1)
          .mintDevice(mockDeviceId, mockDeviceLabel, attributes, mockInfos)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if device already exists', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);

      await expect(
        dimoRegistry
          .connect(user1)
          .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos)
      ).to.be.revertedWith('Node already exists');
    });
    it('Should correctly set originNode', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);

      const recordInfo: Record = await dimoRegistry.records(mockDeviceId);
      expect(recordInfo.originNode).to.be.equal(mockDeviceId);
    });

    it('TokenURI should be baseURI + nodeId', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);
      await dimoRegistry
        .connect(user1)
        .setNode(mockDeviceId, mockNodeLabel, attributes, mockInfos);

      await dimoRegistry.connect(admin).setBaseURI(mockBaseURI);
      expect(
        await dimoRegistry.connect(user1).tokenURI(mockDeviceId)
      ).to.be.equals(fullTokenURI);

      await expect(
        dimoRegistry.connect(user2).setTokenURI(mockDeviceId, mockTokenURI)
      ).to.be.revertedWith('Only node owner');

      await dimoRegistry
        .connect(user1)
        .setTokenURI(mockDeviceId, mockTokenURI2);
      expect(
        await dimoRegistry.connect(user1).tokenURI(mockDeviceId)
      ).to.be.equals(fullTokenURI2);
    });
  });

  describe('setNode', () => {
    const attributes = [mockAttribute1, mockAttribute2];
    const mockInfo1 = 'mockInfo1';
    const mockInfo2 = 'mockInfo2';
    const mockInfos = [mockInfo1, mockInfo2];

    beforeEach(async () => {
      await dimoRegistry.connect(admin).addAttribute(mockAttribute1);
      await dimoRegistry.connect(admin).addAttribute(mockAttribute2);
    });

    it('Should revert if the parent node does not exist', async () => {
      await expect(
        dimoRegistry
          .connect(user1)
          .setNode(mockDeviceId, mockNodeLabel, attributes, mockInfos)
      ).to.be.revertedWith('ERC721: owner query for nonexistent token');
    });
    it('Should revert if caller is not the owner of the parent node', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);

      await expect(
        dimoRegistry
          .connect(user2)
          .setNode(mockDeviceId, mockNodeLabel, attributes, mockInfos)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if the parent node is a root', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      await expect(
        dimoRegistry
          .connect(controller1)
          .setNode(mockRootId, mockNodeLabel, attributes, mockInfos)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if node already exists', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);
      await dimoRegistry
        .connect(user1)
        .setNode(mockDeviceId, mockNodeLabel, attributes, mockInfos);

      await expect(
        dimoRegistry
          .connect(user1)
          .setNode(mockDeviceId, mockNodeLabel, attributes, mockInfos)
      ).to.be.revertedWith('Node already exists');
    });
    it('Should correctly set originNode', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);
      await dimoRegistry
        .connect(user1)
        .setNode(mockDeviceId, mockNodeLabel, attributes, mockInfos);

      const recordInfo: Record = await dimoRegistry.records(mockNodeId);
      expect(recordInfo.originNode).to.be.equal(mockDeviceId);
    });
  });

  describe('setInfo', () => {
    const attributes = [mockAttribute1, mockAttribute2];
    const attributesNotWhitelisted = [mockAttribute1, mockAttribute3];
    const mockInfo1 = 'mockInfo1';
    const mockInfo2 = 'mockInfo2';
    const mockInfos = [mockInfo1, mockInfo2];
    const mockInfosWrongSize = [mockInfo1];

    beforeEach(async () => {
      await dimoRegistry.connect(admin).addAttribute(mockAttribute1);
      await dimoRegistry.connect(admin).addAttribute(mockAttribute2);
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootId, mockDeviceLabel, attributes, mockInfos);
    });

    it('Should revert if caller is not the owner', async () => {
      await expect(
        dimoRegistry.connect(user2).setInfo(mockDeviceId, attributes, mockInfos)
      ).to.be.revertedWith('Only node owner');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        dimoRegistry
          .connect(user1)
          .setInfo(mockDeviceId, attributes, mockInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        dimoRegistry
          .connect(user1)
          .setInfo(mockDeviceId, attributesNotWhitelisted, mockInfos)
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await dimoRegistry
        .connect(user1)
        .setInfo(mockDeviceId, attributes, mockInfos);

      expect(
        await dimoRegistry.getInfo(mockDeviceId, mockAttribute1)
      ).to.be.equal(mockInfo1);
      expect(
        await dimoRegistry.getInfo(mockDeviceId, mockAttribute2)
      ).to.be.equal(mockInfo2);
    });
  });

  describe('controller transfer', () => {
    it('Should revert if receiver is not a controller', async () => {
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);

      await expect(
        dimoRegistry
          .connect(controller1)
          ['safeTransferFrom(address,address,uint256)'](
            controller1.address,
            controller2.address,
            mockRootId
          )
      ).to.be.revertedWith('Invalid transfer');
    });
    it('Should revert if receiver has already minted a root', async () => {
      const mockRootLabel2 = 'mockRootLabel2';

      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel, controller1.address);
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(mockRootLabel2, controller2.address);

      await expect(
        dimoRegistry
          .connect(controller1)
          ['safeTransferFrom(address,address,uint256)'](
            controller1.address,
            controller2.address,
            mockRootId
          )
      ).to.be.revertedWith('Invalid transfer');
    });
    it('Should correctly update rootMinted status', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(admin).setController(controller2.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      const controller1InfoBefore: Controller = await dimoRegistry.controllers(
        controller1.address
      );
      const controller2InfoBefore: Controller = await dimoRegistry.controllers(
        controller2.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controller1InfoBefore.rootMinted).to.be.true;
      // eslint-disable-next-line no-unused-expressions
      expect(controller2InfoBefore.rootMinted).to.be.false;

      await dimoRegistry
        .connect(controller1)
        ['safeTransferFrom(address,address,uint256)'](
          controller1.address,
          controller2.address,
          mockRootId
        );

      const controller1InfoAfter: Controller = await dimoRegistry.controllers(
        controller1.address
      );
      const controller2InfoAfter: Controller = await dimoRegistry.controllers(
        controller2.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(controller1InfoAfter.rootMinted).to.be.false;
      // eslint-disable-next-line no-unused-expressions
      expect(controller2InfoAfter.rootMinted).to.be.true;
    });
  });

  describe('Contract Metadata URI', () => {
    it('Non-admin should not be able to set', async () => {
      await expect(
        dimoRegistry
          .connect(user1)
          .setContractMetadataURI(contractMetadataURI + 'TEST')
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Admin should be able to set', async () => {
      await dimoRegistry
        .connect(admin)
        .setContractMetadataURI(contractMetadataURI);

      expect(await dimoRegistry.connect(user1).contractURI()).to.be.equals(
        contractMetadataURI
      );
    });
  });
});
