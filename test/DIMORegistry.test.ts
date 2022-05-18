import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import { DIMORegistry, Root } from '../typechain';
import { nodeHash, getSelectors } from './utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

const mockRootLabel = 'mockRootLabel';
const mockRootHash = nodeHash(mockRootLabel);
const mockRootId = ethers.BigNumber.from(mockRootHash);

describe('DIMORegistry', function () {
  let dimoRegistry: DIMORegistry;

  const [
    admin,
    user
  ] = provider.getWallets();

  beforeEach(async () => {
    // Deploy DIMORegistry Implementation        
    const DIMORegistry = await ethers.getContractFactory('DIMORegistry');
    // eslint-disable-next-line prettier/prettier
    const dimoRegistryImplementation = await DIMORegistry.deploy() as DIMORegistry;
    await dimoRegistryImplementation.deployed();

    // deploy modules
    const Root = await ethers.getContractFactory('Root');
    const rootImplementation = await Root.deploy() as Root;
    await rootImplementation.deployed();

    // deploy modules selectors
    const rootSelectors = getSelectors(Root.interface);

    dimoRegistry = await ethers.getContractAt('DIMORegistry', dimoRegistryImplementation.address) as DIMORegistry;

    // set Dao in token contract
    await dimoRegistry.addModule(rootImplementation.address, rootSelectors);

    // console.log(dimoRegistryImplementation.address);
    // console.log(dimoRegistry.address);
    // console.log(rootImplementation.address);
    // console.log(Root.interface.functions);
    // console.log(rootSelectors);
  });

  describe('Initial tests', async function () {
    it('Should revert if caller is not the owner', async function () {
      const root = await ethers.getContractAt('Root', dimoRegistry.address) as Root;
      await expect(root.connect(user).mintRootByOwner(mockRootLabel, admin.address)).to.be.revertedWith('Caller is not the owner');
    });
    it('Mint test', async function () {
      // const isAdmin = await pollenDAO.isAdmin(admin.address);
      // expect(isAdmin).to.be.true;
      console.log(await dimoRegistry.getRecord(0));
      console.log(await dimoRegistry.getRecord(mockRootId));

      const root = await ethers.getContractAt('Root', dimoRegistry.address) as Root;
      await root.mintRootByOwner(mockRootLabel, admin.address);

      console.log(await dimoRegistry.getRecord(0));
      console.log(await dimoRegistry.getRecord(mockRootId));
    });
  });
});
