import chai from 'chai';
import { ethers } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
  DIMORegistry,
  Eip712Checker,
  Charging,
  DimoAccessControl,
  Manufacturer,
  ManufacturerId,
  AftermarketDevice,
  AftermarketDeviceId,
  AdLicenseValidator,
  Mapper,
  Shared,
  MockDimoToken,
  MockDimoCredit,
  MockStake
} from '../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  C
} from '../utils';

const { expect } = chai;

describe('Mapper', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let aftermarketDeviceInstance: AftermarketDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockStakeInstance: MockStake;
  let manufacturerIdInstance: ManufacturerId;
  let adIdInstance: AftermarketDeviceId;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let foundation: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let beneficiary1: HardhatEthersSigner;
  let adAddress1: HardhatEthersSigner;
  let adAddress2: HardhatEthersSigner;

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList)
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted)
  );

  before(async () => {
    [
      admin,
      foundation,
      manufacturer1,
      user1,
      beneficiary1,
      adAddress1,
      adAddress2
    ] = await ethers.getSigners();

    mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
    mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'Charging',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'AftermarketDevice',
        'AdLicenseValidator',
        'Mapper',
        'Shared'
      ],
      nfts: ['ManufacturerId', 'AftermarketDeviceId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    chargingInstance = deployments.Charging;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    manufacturerInstance = deployments.Manufacturer;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
    sharedInstance = deployments.Shared;
    manufacturerIdInstance = deployments.ManufacturerId;
    adIdInstance = deployments.AftermarketDeviceId;

    DIMO_REGISTRY_ADDRESS = await dimoRegistryInstance.getAddress();

    await grantAdminRoles(admin, dimoAccessControlInstance);

    // Grant NFT minter roles to DIMO Registry contract
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(await adIdInstance.getAddress());

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion
    );

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );

    // Deploy MockDimoCredit contract
    const MockDimoCreditFactory = await ethers.getContractFactory(
      'MockDimoCredit'
    );
    mockDimoCreditInstance = await MockDimoCreditFactory.connect(admin).deploy();

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();

    // Mint DIMO Credit tokens to the admin and manufacturer
    await mockDimoCreditInstance
      .connect(admin)
      .mint(admin.address, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(manufacturer1.address, C.manufacturerDimoCreditTokensAmount);

    // Grant BURNER role to DIMORegistry
    await mockDimoCreditInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Setup Shared variables
    await sharedInstance
      .connect(admin)
      .setDimoTokenAddress(await mockDimoTokenInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setDimoCredit(await mockDimoCreditInstance.getAddress());

    // Setup Charging variables
    await chargingInstance
      .connect(admin)
      .setDcxOperationCost(C.MINT_AD_OPERATION, C.MINT_AD_OPERATION_COST);

    // Setup AdLicenseValidator variables
    await adLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await adLicenseValidatorInstance.setDimoToken(
      await mockDimoTokenInstance.getAddress()
    );
    await adLicenseValidatorInstance.setLicense(await mockStakeInstance.getAddress());
    await adLicenseValidatorInstance.setAdMintCost(C.adMintCost);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

    // Whitelist AftermarketDevice attributes
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1);
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute2);

    // Mint Manufacturer Node
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer1.address,
        C.mockManufacturerNames[0],
        C.mockManufacturerAttributeInfoPairs
      );

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Setting DimoRegistry address in the AftermarketDeviceId
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);
    await aftermarketDeviceInstance
      .connect(manufacturer1)
      .mintAftermarketDeviceByManufacturerBatch(
        1,
        mockAftermarketDeviceInfosList
      );
    await aftermarketDeviceInstance
      .connect(admin)
      .claimAftermarketDeviceBatch(1, [
        { aftermarketDeviceNodeId: '1', owner: user1.address }
      ]);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setAftermarketDeviceBeneficiary', () => {
    context('Error handling', () => {
      it('Should revert if caller is not the node owner', async () => {
        await expect(
          mapperInstance
            .connect(beneficiary1)
            .setAftermarketDeviceBeneficiary(1, beneficiary1.address)
        ).to.be.revertedWith('Only owner or proxy');
      });
      it('Should revert if beneficiary is equal to owner', async () => {
        await expect(
          mapperInstance
            .connect(user1)
            .setAftermarketDeviceBeneficiary(1, user1.address)
        ).to.be.revertedWith('Beneficiary cannot be the owner');
      });
    });

    context('State', () => {
      it('Should return the node owner if no beneficiary is set', async () => {
        expect(
          await mapperInstance.getBeneficiary(await adIdInstance.getAddress(), 1)
        ).to.be.equal(user1.address);
      });
      it('Should correctly set beneficiary', async () => {
        await mapperInstance
          .connect(user1)
          .setAftermarketDeviceBeneficiary(1, beneficiary1.address);

        expect(
          await mapperInstance.getBeneficiary(await adIdInstance.getAddress(), 1)
        ).to.be.equal(beneficiary1.address);
      });
    });

    context('Events', () => {
      it('Should emit BeneficiarySet event with correct params', async () => {
        await expect(
          mapperInstance
            .connect(user1)
            .setAftermarketDeviceBeneficiary(1, beneficiary1.address)
        )
          .to.emit(mapperInstance, 'BeneficiarySet')
          .withArgs(await adIdInstance.getAddress(), 1, beneficiary1.address);
      });
    });
  });
});
