import chai, { expect } from 'chai';
import { ethers, waffle } from 'hardhat';

import { DIMORegistry } from '../typechain';
import { nodeHash } from './utils';
import { Controller } from './types';

const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('NodeRegistry', () => {
  let dimoRegistry: DIMORegistry;

  const [admin, user1, user2, controller1] = provider.getWallets();
  const mockRootLabel = 'mockRootLabel';
  const mockRootHash = nodeHash(mockRootLabel);
  const mockNodeLabel = 'mockNodeLabel';
  const mockNodeHash = nodeHash(mockNodeLabel);
  const newAttribute = ethers.utils.formatBytes32String('new attribute');

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
        dimoRegistry.connect(user1).addAttribute(newAttribute)
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
    it('Should revert if caller is not a controller', async () => {
      await expect(
        dimoRegistry.connect(user1).mintRootByOwner(mockNodeHash, user1.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('mintRoot', () => {
    it('Should revert if caller is not a controller', async () => {
      await expect(
        dimoRegistry.connect(user1).mintRoot(mockNodeHash)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if controller has already minted a root', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(controller1).mintRoot(mockRootLabel);

      await expect(
        dimoRegistry.connect(controller1).mintRoot(mockRootLabel)
      ).to.be.revertedWith('Invalid request');
    });
  });

  describe('mintDevice', () => {
    it('Should revert if the parent node does not exist', async () => {
      await expect(
        dimoRegistry.connect(user1).mintDevice(mockRootHash, mockNodeLabel)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if the parent node is not a root', async () => {
      const wrongNodeHash = nodeHash(`${mockNodeLabel}.${mockRootLabel}`);

      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(admin).mintRoot(mockRootLabel);
      await dimoRegistry.connect(user1).mintDevice(mockRootHash, mockNodeLabel);

      await expect(
        dimoRegistry.connect(user1).mintDevice(wrongNodeHash, mockNodeLabel)
      ).to.be.revertedWith('Invalid node');
    });
  });

  describe('setNode', () => {
    it('Should revert if caller is not the owner of the parent node', async () => {
      const wrongNodeHash = nodeHash(`${mockNodeLabel}.${mockRootLabel}`);

      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(admin).mintRoot(mockRootLabel);
      await dimoRegistry.connect(user1).mintDevice(mockRootHash, mockNodeLabel);

      await expect(
        dimoRegistry.connect(user2).setNode(wrongNodeHash, mockNodeLabel)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should revert if the parent node is a root', async () => {
      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry.connect(admin).mintRoot(mockRootLabel);

      await expect(
        dimoRegistry.connect(controller1).setNode(mockRootHash, mockNodeLabel)
      ).to.be.revertedWith('Invalid request');
    });
  });
});
