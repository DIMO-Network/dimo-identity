import chai from 'chai';
import { ethers, } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import type {
  DimoAccessControl,
  AdLicenseValidator,
  MockDimoToken,
  MockStake
} from '../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;

describe('AdLicenseValidator', function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;

  let admin: HardhatEthersSigner, nonAdmin: HardhatEthersSigner, foundation: HardhatEthersSigner;

  before(async () => {
    [admin, nonAdmin, foundation] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'AdLicenseValidator'],
      nfts: [],
      upgradeableContracts: []
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;

    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.ADMIN_ROLE, admin.address);

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();
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
      ).to.be.rejectedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
  });

  describe('setDimoToken', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adLicenseValidatorInstance
          .connect(nonAdmin)
          .setDimoToken(mockDimoTokenInstance.getAddress())
      ).to.be.rejectedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
  });

  describe('setLicense', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adLicenseValidatorInstance
          .connect(nonAdmin)
          .setLicense(mockStakeInstance.getAddress())
      ).to.be.rejectedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
  });

  describe('setAdMintCost', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adLicenseValidatorInstance.connect(nonAdmin).setAdMintCost(C.adMintCost)
      ).to.be.rejectedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
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
