import chai, { expect } from 'chai';
import { ethers, waffle } from 'hardhat';

import { DIMORegistry } from '../typechain';
import nodeHash from './utils/nodeHash';

const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('NodeRegistry', () => {
  let dimoRegistry: DIMORegistry;

  const [admin, user1, user2, controller1] = provider.getWallets();
  const rootLabel = 'dimo';
  const mockSubrootLabel = 'mockSubroot';
  const mockNode = ethers.utils.formatBytes32String(
    'mockNode.mockSubroot.dimo'
  );
  const mockLabel = 'mockLabel';
  const newAttribute = ethers.utils.formatBytes32String('new attribute');

  beforeEach(async () => {
    const DimoRegistryFactory = await ethers.getContractFactory('DIMORegistry');
    dimoRegistry = await DimoRegistryFactory.connect(admin).deploy();
    await dimoRegistry.deployed();

    // TODO add list of attributes
  });

  describe.skip('constructor', () => {
    it('Should', async () => {});
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

  describe('mintSubroot', () => {
    it('Should revert if caller is not a controller', async () => {
      await expect(
        dimoRegistry.connect(user1).mintSubroot(mockNode, user1.address)
      ).to.be.revertedWith('Only controller');
    });
  });

  describe('mintVehicle', () => {
    it('Should revert if the parent node is the ROOT', async () => {
      const rootNode = ethers.utils.namehash(rootLabel);

      await expect(
        dimoRegistry.connect(user1).mintVehicle(rootNode, mockLabel)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if the parent node does not exist', async () => {
      await expect(
        dimoRegistry.connect(user1).mintVehicle(mockNode, mockLabel)
      ).to.be.revertedWith('Invalid node');
    });
    it('Should revert if the parent node is not a subroot', async () => {
      const subrootNodeHash = nodeHash(`${mockSubrootLabel}.${rootLabel}`);
      const wrongNodeHash = nodeHash(
        `${mockLabel}.${mockSubrootLabel}.${rootLabel}`
      );

      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry
        .connect(admin)
        .mintSubroot(mockSubrootLabel, controller1.address);
      await dimoRegistry.connect(user1).mintVehicle(subrootNodeHash, mockLabel);

      await expect(
        dimoRegistry.connect(user1).mintVehicle(wrongNodeHash, mockLabel)
      ).to.be.revertedWith('Invalid node');
    });
  });

  describe('setNode', () => {
    it('Should revert if caller is not the owner of the parent node', async () => {
      const subrootNodeHash = nodeHash(`${mockSubrootLabel}.${rootLabel}`);
      const wrongNodeHash = nodeHash(
        `${mockLabel}.${mockSubrootLabel}.${rootLabel}`
      );

      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry
        .connect(admin)
        .mintSubroot(mockSubrootLabel, controller1.address);
      await dimoRegistry.connect(user1).mintVehicle(subrootNodeHash, mockLabel);

      await expect(
        dimoRegistry.connect(user2).setNode(wrongNodeHash, mockLabel)
      ).to.be.revertedWith('Only node owner');
    });
    it('Should revert if the parent node is a subroot', async () => {
      const subrootNodeHash = nodeHash(`${mockSubrootLabel}.${rootLabel}`);

      await dimoRegistry.connect(admin).setController(controller1.address);
      await dimoRegistry
        .connect(admin)
        .mintSubroot(mockSubrootLabel, controller1.address);

      await expect(
        dimoRegistry.connect(controller1).setNode(subrootNodeHash, mockLabel)
      ).to.be.revertedWith('Parent cannot be subroot');
    });
  });
});
