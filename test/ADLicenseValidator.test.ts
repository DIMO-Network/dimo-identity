import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import { AdLicenseValidator, MockDimoToken, MockLicense } from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('AdLicenseValidator', function () {
  let snapshot: string;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mockDimoTokenInstance: MockDimoToken;
  let mockLicenseInstance: MockLicense;

  const [admin, nonAdmin, foundation] = provider.getWallets();

  before(async () => {
    [, adLicenseValidatorInstance] = await initialize(
      admin,
      [C.name, C.symbol, C.baseURI],
      'AdLicenseValidator'
    );

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );
    await mockDimoTokenInstance.deployed();

    // Deploy MockLicense contract
    const MockLicenseFactory = await ethers.getContractFactory('MockLicense');
    mockLicenseInstance = await MockLicenseFactory.connect(admin).deploy();
    await mockLicenseInstance.deployed();
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
          .setLicense(mockLicenseInstance.address)
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
});
