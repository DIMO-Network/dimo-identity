import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import { AdLicenseValidator, MockDimoToken, MockStake } from '../typechain';
import { setup, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('AdLicenseValidator', function () {
  let snapshot: string;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;

  const [admin, nonAdmin, foundation] = provider.getWallets();

  before(async () => {
    const deployments = await setup(admin, {
      modules: ['AdLicenseValidator'],
      nfts: [],
      upgradeableContracts: []
    });
    adLicenseValidatorInstance = deployments.AdLicenseValidator;

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );
    await mockDimoTokenInstance.deployed();

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();
    await mockStakeInstance.deployed();
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setFoundationAddress', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adLicenseValidatorInstance
          .connect(nonAdmin)
          .setFoundationAddress(foundation.address)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
  });

  describe('setDimoToken', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adLicenseValidatorInstance
          .connect(nonAdmin)
          .setDimoToken(mockDimoTokenInstance.address)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
  });

  describe('setLicense', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adLicenseValidatorInstance
          .connect(nonAdmin)
          .setLicense(mockStakeInstance.address)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
  });

  describe('setAdMintCost', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adLicenseValidatorInstance.connect(nonAdmin).setAdMintCost(C.adMintCost)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
  });

  describe('getAdMintCost', () => {
    it('Should correctly return the Aftermarket Device mint cost', async () => {
      await adLicenseValidatorInstance
        .connect(admin)
        .setAdMintCost(C.adMintCost);

      const adMintCost = await adLicenseValidatorInstance.getAdMintCost();

      expect(adMintCost).to.equal(C.adMintCost);
    });
  });
});
