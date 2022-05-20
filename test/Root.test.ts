import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import { DIMORegistry, Root } from '../typechain';
import { getSelectors } from './utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

// Mock attributes
const mockAttribute1 = ethers.utils.formatBytes32String('mockAttribute1');
const mockAttribute2 = ethers.utils.formatBytes32String('mockAttribute2');
const mockAttribute3 = ethers.utils.formatBytes32String('mockAttribute3');
const mockAttributes = [mockAttribute1, mockAttribute2];
const attributesNotWhitelisted = [mockAttribute1, mockAttribute3];

// Infos associated with attributes
const mockInfo1 = 'mockInfo1';
const mockInfo2 = 'mockInfo2';
const mockInfos = [mockInfo1, mockInfo2];
const mockInfosWrongSize = [mockInfo1];

describe('DIMORegistry', function () {
  let dimoRegistry: DIMORegistry;
  let rootInstance: Root;

  const [
    admin,
    nonAdmin,
    controller1,
    controller2,
    nonController
  ] = provider.getWallets();

  beforeEach(async () => {
    // Deploy DIMORegistry Implementation        
    const DIMORegistry = await ethers.getContractFactory('DIMORegistry');
    // eslint-disable-next-line prettier/prettier
    const dimoRegistryImplementation = await DIMORegistry.connect(admin).deploy() as DIMORegistry;
    await dimoRegistryImplementation.deployed();

    // Deploy Root module
    const Root = await ethers.getContractFactory('Root');
    const rootImplementation = await Root.connect(admin).deploy() as Root;
    await rootImplementation.deployed();

    // Get Root selectors
    const rootSelectors = getSelectors(Root.interface);

    dimoRegistry = await ethers.getContractAt('DIMORegistry', dimoRegistryImplementation.address) as DIMORegistry;
    rootInstance = await ethers.getContractAt('Root', dimoRegistry.address) as Root;

    // Register Root module
    await dimoRegistry.connect(admin).addModule(rootImplementation.address, rootSelectors);

    // Whitelist attributes
    await rootInstance.connect(admin).addAttribute(mockAttribute1);
    await rootInstance.connect(admin).addAttribute(mockAttribute2);
  });

  describe('addAttribute', () => {
    it('Should revert if caller is an admin', async () => {
      await expect(
        rootInstance.connect(nonAdmin).addAttribute(mockAttribute1)
      ).to.be.revertedWith('Caller is not an admin');
    });
  });

  describe('setController', () => {
    it('Should revert if caller is not the owner', async () => {
      await expect(
        rootInstance.connect(nonAdmin).setController(controller1.address)
      ).to.be.revertedWith('Caller is not an admin');
    });
  });

  describe('mintRoot', () => {
    it('Should revert if caller is not the admin', async () => {
      await expect(
        rootInstance
          .connect(nonAdmin)
          .mintRoot(nonController.address, mockAttributes, mockInfos)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should revert if controller has already minted a root', async () => {
      await rootInstance.connect(admin).mintRoot(controller1.address, mockAttributes, mockInfos);

      await expect(
        rootInstance.connect(admin).mintRoot(controller1.address, mockAttributes, mockInfos)
      ).to.be.revertedWith('Invalid request');
    });
    it('Should correctly set owner as controller', async () => {
      const isControllerBefore: boolean = await rootInstance.isController(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isControllerBefore).to.be.false;

      await rootInstance.connect(admin).mintRoot(controller1.address, mockAttributes, mockInfos);

      const isControllerAfter: boolean = await rootInstance.isController(
        controller1.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isControllerAfter).to.be.true;
    });
    it('Should correctly set node as root', async () => {
      await rootInstance.connect(admin).mintRoot(controller1.address, mockAttributes, mockInfos);

      const parentNode = await dimoRegistry.getParentNode(1);

      // Assure it does not have parent
      expect(parentNode).to.be.equal(0);
      // Assure if has an owner although there is no parent
      expect(await rootInstance.ownerOf(1)).to.be.equal(controller1.address);
    });
    it('Should correctly set rootMinted', async () => {
      const isRootMintedBefore = await rootInstance.isRootMinted(controller1.address);

      // eslint-disable-next-line no-unused-expressions
      expect(isRootMintedBefore).to.be.false;

      await rootInstance.connect(admin).mintRoot(controller1.address, mockAttributes, mockInfos);

      const isRootMintedAfter = await rootInstance.isRootMinted(controller1.address);

      // eslint-disable-next-line no-unused-expressions
      expect(isRootMintedAfter).to.be.true;
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(controller1.address, mockAttributes, mockInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        rootInstance
          .connect(admin)
          .mintRoot(controller1.address, attributesNotWhitelisted, mockInfos)
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, mockAttributes, mockInfos);

      expect(
        await rootInstance.getInfo(1, mockAttribute1)
      ).to.be.equal(mockInfo1);
      expect(
        await rootInstance.getInfo(1, mockAttribute2)
      ).to.be.equal(mockInfo2);
    });
  });

  describe('setInfo', () => {
    beforeEach(async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, mockAttributes, mockInfos);
    });

    // it('Should revert if caller is not the owner', async () => {
    //   await expect(
    //     dimoRegistry.connect(user2).setInfo(mockRootId, attributes, mockInfos)
    //   ).to.be.revertedWith('Only node owner');
    // });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        rootInstance
          .connect(controller1)
          .setInfo(1, mockAttributes, mockInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        rootInstance
          .connect(controller1)
          .setInfo(1, attributesNotWhitelisted, mockInfos)
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await rootInstance
        .connect(controller1)
        .setInfo(1, mockAttributes, mockInfos);

      expect(
        await rootInstance.getInfo(1, mockAttribute1)
      ).to.be.equal(mockInfo1);
      expect(
        await rootInstance.getInfo(1, mockAttribute2)
      ).to.be.equal(mockInfo2);
    });
  });

  describe('controller transfer', () => {
    it('Should revert if receiver is not a controller', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, mockAttributes, mockInfos);

      await expect(
        rootInstance
          .connect(controller1)
          .safeTransferFrom(
            controller1.address,
            controller2.address,
            1
          )
      ).to.be.revertedWith('Invalid transfer');
    });
    it('Should revert if receiver has already minted a root', async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, mockAttributes, mockInfos);
      await rootInstance
        .connect(admin)
        .mintRoot(controller2.address, mockAttributes, mockInfos);

      await expect(
        rootInstance
          .connect(controller1)
          .safeTransferFrom(
            controller1.address,
            controller2.address,
            1
          )
      ).to.be.revertedWith('Invalid transfer');
    });
    it('Should correctly update rootMinted status', async () => {
      await rootInstance.connect(admin).setController(controller2.address);
      await rootInstance.connect(admin).mintRoot(controller1.address, mockAttributes, mockInfos);

      const isRootMinted1Before = await rootInstance.isRootMinted(
        controller1.address
      );
      const isRootMinted2Before = await rootInstance.isRootMinted(
        controller2.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isRootMinted1Before).to.be.true;
      // eslint-disable-next-line no-unused-expressions
      expect(isRootMinted2Before).to.be.false;

      await rootInstance
        .connect(controller1)
        .safeTransferFrom(
          controller1.address,
          controller2.address,
          1
        );

      const isRootMinted1After = await rootInstance.isRootMinted(
        controller1.address
      );
      const isRootMinted2After = await rootInstance.isRootMinted(
        controller2.address
      );
      // eslint-disable-next-line no-unused-expressions
      expect(isRootMinted1After).to.be.false;
      // eslint-disable-next-line no-unused-expressions
      expect(isRootMinted2After).to.be.true;
    });
  });
});
