import chai, { expect } from 'chai';
import { ethers, waffle } from 'hardhat';

import { DIMORegistry } from '../typechain';

const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe.only('DIMORegistry', () => {
  let dimoRegistry: DIMORegistry;

  const [admin, user] = provider.getWallets();
  const mockNode = ethers.utils.formatBytes32String('node');
  const mockLabel = ethers.utils.formatBytes32String('label');
  const mockValue = 'Value';

  beforeEach(async () => {
    const DIMORegistryFactory = await ethers.getContractFactory('DIMORegistry');
    dimoRegistry = await DIMORegistryFactory.connect(admin).deploy();
    await dimoRegistry.deployed();
  });

  describe('newRecord', () => {
    it('Should revert if record already exists', async () => {
      await dimoRegistry
        .connect(user)
        .newRecord(mockNode, user.address, mockNode, mockValue);

      await expect(
        dimoRegistry
          .connect(user)
          .newRecord(mockNode, user.address, mockNode, mockValue)
      ).to.be.revertedWith('Node already exists');
    });
  });

  describe('setRecord', () => {
    it('Should revert if caller is not an authorized user', async () => {
      await expect(
        dimoRegistry
          .connect(user)
          .setRecord(mockNode, user.address, mockNode, mockValue)
      ).to.be.revertedWith('Not authorized');
    });
  });

  describe('setSubnodeRecord', () => {
    it('Should revert if caller is not an authorized user', async () => {
      await expect(
        dimoRegistry
          .connect(user)
          .setSubnodeRecord(mockNode, mockLabel, user.address)
      ).to.be.revertedWith('Not authorized');
    });
  });

  describe('setOwner', () => {
    it('Should revert if caller is not an authorized user', async () => {
      await expect(
        dimoRegistry.connect(user).setOwner(mockNode, user.address)
      ).to.be.revertedWith('Not authorized');
    });
  });

  describe('setSubnodeOwner', () => {
    it('Should revert if caller is not an authorized user', async () => {
      await expect(
        dimoRegistry
          .connect(user)
          .setSubnodeOwner(mockNode, mockLabel, user.address)
      ).to.be.revertedWith('Not authorized');
    });
  });

  // TODO setApprovalForAll
  describe.skip('setApprovalForAll', () => {});

  // TODO owner
  describe.skip('owner', () => {});

  // TODO recordExists
  describe.skip('recordExists', () => {});

  // TODO isApprovedForAll
  describe.skip('isApprovedForAll', () => {});
});
