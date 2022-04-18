import chai, { expect } from 'chai';
import { ethers, waffle } from 'hardhat';

import { DIMORegistry } from '../typechain';
import { nodeHash } from './utils';
import { Controller } from './types';

const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('DIMORegistry', () => {
  let dimoRegistry: DIMORegistry;

  const [admin, user1, user2, controller1, controller2] = provider.getWallets();

  const mockRootLabel = 'mockRootLabel';
  const mockRootHash = nodeHash(mockRootLabel);
  const mockDeviceLabel = 'mockDeviceLabel';
  const mockDeviceHash = nodeHash(`${mockDeviceLabel}.${mockRootLabel}`);
  const mockNodeLabel = 'mockNodeLabel';
  const mockNodeHash = nodeHash(
    `${mockNodeLabel}.${mockDeviceLabel}.${mockRootLabel}`
  );

  const attribute1 = ethers.utils.formatBytes32String('attribute1');
  const attribute2 = ethers.utils.formatBytes32String('attribute2');
  const attribute3 = ethers.utils.formatBytes32String('attribute3');

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

  describe('addAttribute', () => {
    it('Should revert if caller is not the owner', async () => {
      await expect(
        dimoRegistry.connect(user1).addAttribute(attribute1)
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
  });

  describe('mintRoot', () => {
    it('Should revert if caller is not a controller', async () => {
      await expect(
        dimoRegistry.connect(user1).mintRoot(mockDeviceHash)
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
  });

  describe('mintDevice', () => {
    it('Should revert if the parent node does not exist', async () => {
      await expect(
        dimoRegistry.connect(user1).mintDevice(mockRootHash, mockDeviceLabel)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if the parent node is not a root', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootHash, mockDeviceLabel);

      await expect(
        dimoRegistry.connect(user1).mintDevice(mockDeviceHash, mockDeviceLabel)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if device already exists', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootHash, mockDeviceLabel);

      await expect(
        dimoRegistry.connect(user1).mintDevice(mockRootHash, mockDeviceLabel)
      ).to.be.revertedWith('Node already exists');
    });
  });

  describe('setNode', () => {
    it('Should revert if caller is not the owner of the parent node', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootHash, mockDeviceLabel);

      await expect(
        dimoRegistry.connect(user2).setNode(mockNodeHash, mockNodeLabel)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if the parent node is a root', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      await expect(
        dimoRegistry.connect(controller1).setNode(mockRootHash, mockNodeLabel)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if node already exists', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootHash, mockDeviceLabel);
      await dimoRegistry.connect(user1).setNode(mockDeviceHash, mockNodeLabel);

      await expect(
        dimoRegistry.connect(user1).setNode(mockDeviceHash, mockNodeLabel)
      ).to.be.revertedWith('Node already exists');
    });
  });

  describe('setInfo', () => {
    const attributes = [attribute1, attribute2];
    const attributesNotWhitelisted = [attribute1, attribute3];
    const infos = ['info1', 'info2'];
    const infosWrongSize = ['info1'];

    beforeEach(async () => {
      await dimoRegistry.connect(admin).addAttribute(attribute1);
      await dimoRegistry.connect(admin).addAttribute(attribute2);
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);
      await dimoRegistry
        .connect(user1)
        .mintDevice(mockRootHash, mockDeviceLabel);
    });

    it('Should revert if caller is not the owner', async () => {
      await expect(
        dimoRegistry.connect(user2).setInfo(mockDeviceHash, attributes, infos)
      ).to.be.revertedWith('Only node owner');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        dimoRegistry
          .connect(user1)
          .setInfo(mockDeviceHash, attributes, infosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        dimoRegistry
          .connect(user1)
          .setInfo(mockDeviceHash, attributesNotWhitelisted, infos)
      ).to.be.revertedWith('Not whitelisted');
    });
  });
});
