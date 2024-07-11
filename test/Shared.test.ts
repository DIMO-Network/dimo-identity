import chai from 'chai';
import { ethers, } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import type {
  DimoAccessControl,
  Shared,
  MockDimoToken,
  MockDimoCredit,
  MockStake
} from '../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;

describe('Shared', function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockStakeInstance: MockStake;

  let MOCK_DIMO_TOKEN_ADDRESS: string;
  let MOCK_DIMO_CREDIT_ADDRESS: string;
  let MOCK_STAKE_ADDRESS: string;

  let admin: HardhatEthersSigner
  let nonAdmin: HardhatEthersSigner;
  let foundation: HardhatEthersSigner;

  before(async () => {
    [admin, nonAdmin, foundation] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'Shared'],
      nfts: [],
      upgradeableContracts: []
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    sharedInstance = deployments.Shared;

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();
    MOCK_STAKE_ADDRESS = await mockStakeInstance.getAddress();

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
    MOCK_DIMO_TOKEN_ADDRESS = await mockDimoTokenInstance.getAddress();

    // Deploy MockDimoCredit contract
    const MockDimoCreditFactory = await ethers.getContractFactory(
      'MockDimoCredit'
    );
    mockDimoCreditInstance = await MockDimoCreditFactory.connect(admin).deploy();
    MOCK_DIMO_CREDIT_ADDRESS = await mockDimoCreditInstance.getAddress();
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setFoundation', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          sharedInstance
            .connect(nonAdmin)
            .setFoundation(foundation.address)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return the foundation address', async () => {
        await sharedInstance
          .connect(admin)
          .setFoundation(foundation.address);

        const foundationAddress = await sharedInstance.getFoundation();

        expect(foundationAddress).to.equal(foundation.address);
      });
    });

    context('Events', () => {
      it('Should emit FoundationSet event with correct params', async () => {
        await expect(
          sharedInstance
            .connect(admin)
            .setFoundation(foundation.address)
        )
          .to.emit(sharedInstance, 'FoundationSet')
          .withArgs(foundation.address);
      });
    });
  });

  describe('setDimoToken', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          sharedInstance
            .connect(nonAdmin)
            .setDimoToken(MOCK_DIMO_TOKEN_ADDRESS)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return DIMO token address', async () => {
        await sharedInstance
          .connect(admin)
          .setDimoToken(MOCK_DIMO_TOKEN_ADDRESS);

        const dimoTokenAddress = await sharedInstance.getDimoToken();

        expect(dimoTokenAddress).to.equal(MOCK_DIMO_TOKEN_ADDRESS);
      });
    });

    context('Events', () => {
      it('Should emit DimoTokenSet event with correct params', async () => {
        await expect(
          sharedInstance
            .connect(admin)
            .setDimoToken(MOCK_DIMO_TOKEN_ADDRESS)
        )
          .to.emit(sharedInstance, 'DimoTokenSet')
          .withArgs(MOCK_DIMO_TOKEN_ADDRESS);
      });
    });
  });

  describe('setDimoCredit', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          sharedInstance
            .connect(nonAdmin)
            .setDimoCredit(MOCK_DIMO_CREDIT_ADDRESS)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return DIMO Credit token address', async () => {
        await sharedInstance
          .connect(admin)
          .setDimoCredit(MOCK_DIMO_CREDIT_ADDRESS);

        const dimoCreditAddress = await sharedInstance.getDimoCredit();

        expect(dimoCreditAddress).to.equal(MOCK_DIMO_CREDIT_ADDRESS);
      });
    });

    context('Events', () => {
      it('Should emit DimoCreditSet event with correct params', async () => {
        await expect(
          sharedInstance
            .connect(admin)
            .setDimoCredit(MOCK_DIMO_CREDIT_ADDRESS)
        )
          .to.emit(sharedInstance, 'DimoCreditSet')
          .withArgs(MOCK_DIMO_CREDIT_ADDRESS);
      });
    });
  });
  
  describe('setManufacturerLicense', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          sharedInstance
            .connect(nonAdmin)
            .setManufacturerLicense(MOCK_STAKE_ADDRESS)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return Manufacturer License address', async () => {
        await sharedInstance
          .connect(admin)
          .setManufacturerLicense(MOCK_STAKE_ADDRESS);

        const manufacturerLicenseAddress = await sharedInstance.getManufacturerLicense();

        expect(manufacturerLicenseAddress).to.equal(MOCK_STAKE_ADDRESS);
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerLicenseSet event with correct params', async () => {
        await expect(
          sharedInstance
            .connect(admin)
            .setManufacturerLicense(MOCK_STAKE_ADDRESS)
        )
          .to.emit(sharedInstance, 'ManufacturerLicenseSet')
          .withArgs(MOCK_STAKE_ADDRESS);
      });
    });
  });
});
