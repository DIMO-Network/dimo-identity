import chai from 'chai';
import { ethers, } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import type {
  DimoAccessControl,
  Shared,
  MockDimoToken,
  MockDimoCredit,
  MockManufacturerLicense,
  MockConnectionsManager,
  MockSacd
} from '../typechain-types';
import { setup, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;

describe('Shared', function () {
  let snapshot: string;
  let dimoAccessControlInstance: DimoAccessControl;
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockManufacturerLicenseInstance: MockManufacturerLicense;
  let mockConnectionsManagerInstance: MockConnectionsManager;
  let mockSacdInstance: MockSacd;

  let MOCK_DIMO_TOKEN_ADDRESS: string;
  let MOCK_DIMO_CREDIT_ADDRESS: string;
  let MOCK_MANUFACTURER_LICENSE_ADDRESS: string;
  let MOCK_CONNECTIONS_ADDRESS: string;
  let MOCK_SACD_ADDRESS: string;
  let MOCK_STORAGE_NODE_ADDRESS: string;

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

    // Deploy MockManufacturerLicense contract
    const MockManufacturerLicenseFactory = await ethers.getContractFactory('MockManufacturerLicense');
    mockManufacturerLicenseInstance = await MockManufacturerLicenseFactory.connect(admin).deploy();
    MOCK_MANUFACTURER_LICENSE_ADDRESS = await mockManufacturerLicenseInstance.getAddress();

    // Deploy MockConnectionsManager contract
    const MockConnectionsManagerFactory = await ethers.getContractFactory('MockConnectionsManager');
    mockConnectionsManagerInstance = await MockConnectionsManagerFactory.connect(admin).deploy(C.CONNECTIONS_MANAGER_ERC721_NAME, C.CONNECTIONS_MANAGER_ERC721_SYMBOL);
    MOCK_CONNECTIONS_ADDRESS = await mockConnectionsManagerInstance.getAddress();

    // Deploy MockSacd contract
    const MockSacdFactory = await ethers.getContractFactory('MockSacd');
    mockSacdInstance = await MockSacdFactory.connect(admin).deploy();
    MOCK_SACD_ADDRESS = await mockSacdInstance.getAddress();

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
            .setManufacturerLicense(MOCK_MANUFACTURER_LICENSE_ADDRESS)
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
          .setManufacturerLicense(MOCK_MANUFACTURER_LICENSE_ADDRESS);

        const manufacturerLicenseAddress = await sharedInstance.getManufacturerLicense();

        expect(manufacturerLicenseAddress).to.equal(MOCK_MANUFACTURER_LICENSE_ADDRESS);
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerLicenseSet event with correct params', async () => {
        await expect(
          sharedInstance
            .connect(admin)
            .setManufacturerLicense(MOCK_MANUFACTURER_LICENSE_ADDRESS)
        )
          .to.emit(sharedInstance, 'ManufacturerLicenseSet')
          .withArgs(MOCK_MANUFACTURER_LICENSE_ADDRESS);
      });
    });
  });

  describe('setConnections', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          sharedInstance
            .connect(nonAdmin)
            .setConnectionsManager(MOCK_CONNECTIONS_ADDRESS)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return ConnectionsManager address', async () => {
        await sharedInstance
          .connect(admin)
          .setConnectionsManager(MOCK_CONNECTIONS_ADDRESS);

        const connectionsAddress = await sharedInstance.getConnectionsManager();

        expect(connectionsAddress).to.equal(MOCK_CONNECTIONS_ADDRESS);
      });
    });

    context('Events', () => {
      it('Should emit ConnectionsSet event with correct params', async () => {
        await expect(
          sharedInstance
            .connect(admin)
            .setConnectionsManager(MOCK_CONNECTIONS_ADDRESS)
        )
          .to.emit(sharedInstance, 'ConnectionsManagerSet')
          .withArgs(MOCK_CONNECTIONS_ADDRESS);
      });
    });
  });

  describe('setSacd', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          sharedInstance
            .connect(nonAdmin)
            .setSacd(MOCK_SACD_ADDRESS)
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`
        );
      });
    });

    context('State', () => {
      it('Should correctly return Sacd address', async () => {
        await sharedInstance
          .connect(admin)
          .setSacd(MOCK_SACD_ADDRESS);

        const sacdAddress = await sharedInstance.getSacd();

        expect(sacdAddress).to.equal(MOCK_SACD_ADDRESS);
      });
    });

    context('Events', () => {
      it('Should emit SacdSet event with correct params', async () => {
        await expect(
          sharedInstance
            .connect(admin)
            .setSacd(MOCK_SACD_ADDRESS)
        )
          .to.emit(sharedInstance, 'SacdSet')
          .withArgs(MOCK_SACD_ADDRESS);
      });
    });
  });
});
