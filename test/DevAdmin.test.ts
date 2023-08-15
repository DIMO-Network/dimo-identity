import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  Nodes,
  Manufacturer,
  ManufacturerId,
  Integration,
  IntegrationId,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  SyntheticDevice,
  SyntheticDeviceId,
  AdLicenseValidator,
  Mapper,
  MockDimoToken,
  MockStake,
  DevAdmin
} from '../typechain';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  IdManufacturerName,
  C
} from '../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('DevAdmin', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let dimoAccessControlInstance: DimoAccessControl;
  let eip712CheckerInstance: Eip712Checker;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let syntheticDeviceInstance: SyntheticDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let devAdminInstance: DevAdmin;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let sdIdInstance: SyntheticDeviceId;

  const [
    admin,
    nonAdmin,
    foundation,
    manufacturer1,
    integrationOwner1,
    user1,
    user2,
    adAddress1,
    adAddress2,
    sdAddress1
  ] = provider.getWallets();

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList)
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted)
  );
  mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
  mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
  mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
  mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

  before(async () => {
    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Integration',
        'Vehicle',
        'AftermarketDevice',
        'SyntheticDevice',
        'AdLicenseValidator',
        'Mapper',
        'DevAdmin'
      ],
      nfts: [
        'ManufacturerId',
        'IntegrationId',
        'VehicleId',
        'AftermarketDeviceId',
        'SyntheticDeviceId'
      ],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    eip712CheckerInstance = deployments.Eip712Checker;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
    devAdminInstance = deployments.DevAdmin;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;
    sdIdInstance = deployments.SyntheticDeviceId;

    await grantAdminRoles(admin, dimoAccessControlInstance);

    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.DEV_AD_TRANSFER_ROLE, admin.address);
    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.DEV_AD_UNCLAIM_ROLE, admin.address);
    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.DEV_AD_UNPAIR_ROLE, admin.address);
    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.DEV_RENAME_MANUFACTURERS_ROLE, admin.address);
    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.DEV_VEHICLE_BURN_ROLE, admin.address);

    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, dimoRegistryInstance.address);
    await integrationIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, dimoRegistryInstance.address);
    await vehicleIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, dimoRegistryInstance.address);
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, dimoRegistryInstance.address);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, dimoRegistryInstance.address);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(manufacturerIdInstance.address);
    await integrationInstance
      .connect(admin)
      .setIntegrationIdProxyAddress(integrationIdInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(vehicleIdInstance.address);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(adIdInstance.address);
    await syntheticDeviceInstance
      .connect(admin)
      .setSyntheticDeviceIdProxyAddress(sdIdInstance.address);

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
    await mockDimoTokenInstance.deployed();

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();
    await mockStakeInstance.deployed();

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(dimoRegistryInstance.address, C.manufacturerDimoTokensAmount);

    // Setup AdLicenseValidator variables
    await adLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await adLicenseValidatorInstance.setDimoToken(
      mockDimoTokenInstance.address
    );
    await adLicenseValidatorInstance.setLicense(mockStakeInstance.address);
    await adLicenseValidatorInstance.setAdMintCost(C.adMintCost);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

    // Whitelist Integration attributes
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute1);
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute2);

    // Whitelist Vehicle attributes
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute1);
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute2);

    // Whitelist AftermarketDevice attributes
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1);
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute2);

    // Whitelist SyntheticDevice attributes
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1);
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute2);

    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer1.address,
        C.mockManufacturerNames[0],
        C.mockManufacturerAttributeInfoPairs
      );

    // Mint Integration Node
    await integrationInstance
      .connect(admin)
      .mintIntegration(
        integrationOwner1.address,
        C.mockIntegrationNames[0],
        C.mockIntegrationAttributeInfoPairs
      );

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, dimoRegistryInstance.address);

    // Approve DIMO Registry to spend manufacturer1's tokens
    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);

    // Approve DIMO Registry to spend user1's tokens
    await adIdInstance
      .connect(user1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);

    // Setting DimoRegistry address in the Proxy IDs
    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await integrationIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    // Setting DimoRegistry address in the AftermarketDeviceId
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('transferAftermarketDeviceOwnership', () => {
    let ownerSig: string;
    let adSig: string;
    before(async () => {
      ownerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_TRANSFER_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .transferAftermarketDeviceOwnership(1, user2.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEV_AD_TRANSFER_ROLE
          }`
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .transferAftermarketDeviceOwnership(99, user2.address)
        ).to.be.revertedWith('Invalid AD node');
      });
    });

    context('State', () => {
      it('Should correctly set new node owner', async () => {
        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await devAdminInstance
          .connect(admin)
          .transferAftermarketDeviceOwnership(1, user2.address);

        expect(await adIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceTransferredDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .transferAftermarketDeviceOwnership(1, user2.address)
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceTransferredDevAdmin')
          .withArgs(1, user1.address, user2.address);
      });
    });
  });

  describe('unclaimAftermarketDeviceNode', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimOwnerSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          1,
          user1.address,
          claimOwnerSig1,
          claimAdSig1
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user1.address,
          claimOwnerSig2,
          claimAdSig2
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_UNCLAIM_ROLE', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).unclaimAftermarketDeviceNode([1])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEV_AD_UNCLAIM_ROLE
          }`
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 99])
        ).to.be.revertedWith('Invalid AD node');
      });
    });

    context('State', () => {
      it('Should correctly unclaim aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              1,
              user1.address,
              claimOwnerSig1,
              claimAdSig1
            )
        ).to.be.revertedWith('DeviceAlreadyClaimed(1)');
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              claimOwnerSig2,
              claimAdSig2
            )
        ).to.be.revertedWith('DeviceAlreadyClaimed(2)');

        await devAdminInstance
          .connect(admin)
          .unclaimAftermarketDeviceNode([1, 2]);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              1,
              user1.address,
              claimOwnerSig1,
              claimAdSig1
            )
        ).to.not.be.reverted;
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              claimOwnerSig2,
              claimAdSig2
            )
        ).to.not.be.reverted;
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnclaimedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance.connect(admin).unclaimAftermarketDeviceNode([1, 2])
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnclaimedDevAdmin')
          .withArgs(1)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnclaimedDevAdmin')
          .withArgs(2);
      });
    });
  });

  describe('unpairAftermarketDeviceByDeviceNode', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    let pairSig1: string;
    let pairSig2: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimOwnerSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      pairSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1'
        }
      });
      pairSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '2'
        }
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          1,
          user1.address,
          claimOwnerSig1,
          claimAdSig1
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user1.address,
          claimOwnerSig2,
          claimAdSig2
        );
      await aftermarketDeviceInstance
        .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
      await aftermarketDeviceInstance
        .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_UNPAIR_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByDeviceNode([2])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEV_AD_UNPAIR_ROLE
          }`
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 99])
        ).to.be.revertedWith('Invalid AD node');
      });
    });

    context('State', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(
          await mapperInstance.getLink(adIdInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(adIdInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode([1, 2]);

        expect(
          await mapperInstance.getLink(adIdInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(adIdInstance.address, 2)
        ).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode([1, 2]);

        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 2)
        ).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpairedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 2])
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(2, 2, user1.address);
      });
    });
  });

  describe('unpairAftermarketDeviceByVehicleNode', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    let pairSig1: string;
    let pairSig2: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimOwnerSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      pairSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1'
        }
      });
      pairSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '2'
        }
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          1,
          user1.address,
          claimOwnerSig1,
          claimAdSig1
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user1.address,
          claimOwnerSig2,
          claimAdSig2
        );
      await aftermarketDeviceInstance
        .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
      await aftermarketDeviceInstance
        .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_UNPAIR_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByVehicleNode([4, 5])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEV_AD_UNPAIR_ROLE
          }`
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode([1, 99])
        ).to.be.revertedWith('Invalid vehicle node');
      });
    });

    context('State', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(
          await mapperInstance.getLink(adIdInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(adIdInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode([1, 2]);

        expect(
          await mapperInstance.getLink(adIdInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(adIdInstance.address, 2)
        ).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode([1, 2]);

        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 2)
        ).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpairedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode([1, 2])
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(2, 2, user1.address);
      });
    });
  });

  describe('renameManufacturers', () => {
    const newIdManufacturerNames: IdManufacturerName[] = [
      { tokenId: '1', name: 'NewManufacturer1' },
      { tokenId: '2', name: 'NewManufacturer2' },
      { tokenId: '3', name: 'NewManufacturer3' }
    ];

    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturerBatch(admin.address, C.mockManufacturerNames.slice(1));
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_RENAME_MANUFACTURERS_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .renameManufacturers(newIdManufacturerNames)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEV_RENAME_MANUFACTURERS_ROLE
          }`
        );
      });
      it('Should revert if token Id does not exist', async () => {
        const invalidNewIdManufacturerNames = [
          { tokenId: '99', name: 'NewManufacturer99' }
        ];

        await expect(
          devAdminInstance
            .connect(admin)
            .renameManufacturers(invalidNewIdManufacturerNames)
        ).to.be.revertedWith('Invalid manufacturer node');
      });
    });

    context('State', () => {
      it('Should rename manufacturers', async () => {
        for (let i = 0; i < C.mockManufacturerNames.length; i++) {
          const idReturned = await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[i]
          );
          const nameReturned =
            await manufacturerInstance.getManufacturerNameById(i + 1);

          expect(idReturned).to.equal(i + 1);
          expect(nameReturned).to.equal(C.mockManufacturerNames[i]);
        }

        await devAdminInstance
          .connect(admin)
          .renameManufacturers(newIdManufacturerNames);

        for (let i = 0; i < newIdManufacturerNames.length; i++) {
          const idReturned = await manufacturerInstance.getManufacturerIdByName(
            newIdManufacturerNames[i].name
          );
          const nameReturned =
            await manufacturerInstance.getManufacturerNameById(
              newIdManufacturerNames[i].tokenId
            );

          expect(idReturned).to.equal(newIdManufacturerNames[i].tokenId);
          expect(nameReturned).to.equal(newIdManufacturerNames[i].name);
        }
      });
    });
  });

  describe('adminBurnVehicles', () => {
    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_VEHICLE_BURN_ROLE', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).adminBurnVehicles([1, 2])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEV_VEHICLE_BURN_ROLE
          }`
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance.connect(admin).adminBurnVehicles([1, 99])
        ).to.be.revertedWith(`InvalidNode("${vehicleIdInstance.address}", 99)`);
      });
      it('Should revert if Vehicle is paired to an Aftermarket Device', async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1'
          }
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(aftermarketDeviceInstance.address, true);
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig
          );

        await aftermarketDeviceInstance
          .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            localPairSignature
          );

        await expect(
          devAdminInstance.connect(admin).adminBurnVehicles([1, 2])
        ).to.be.revertedWith('VehiclePaired(1)');
      });
      it('Should revert if Vehicle is paired to a Synthetic Device', async () => {
        const localMintVehicleOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '1'
          }
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '1'
          }
        });
        const localMintSdInput = {
          integrationNode: '1',
          vehicleNode: '1',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(localMintSdInput);

        await expect(
          devAdminInstance.connect(admin).adminBurnVehicles([1, 2])
        ).to.be.revertedWith('VehiclePaired(1)');
      });
    });

    context('State', () => {
      it('Should correctly reset vehicle parent node to 0', async () => {
        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        const parentNode1 = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          1
        );
        const parentNode2 = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          2
        );

        expect(parentNode1).to.be.equal(0);
        expect(parentNode2).to.be.equal(0);
      });
      it('Should correctly reset vehicle node owner to zero address', async () => {
        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        await expect(vehicleIdInstance.ownerOf(1)).to.be.revertedWith(
          'ERC721: invalid token ID'
        );
        await expect(vehicleIdInstance.ownerOf(2)).to.be.revertedWith(
          'ERC721: invalid token ID'
        );
      });
      it('Should correctly reset vehicle infos to blank', async () => {
        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            2,
            C.mockVehicleAttribute1
          )
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            2,
            C.mockVehicleAttribute2
          )
        ).to.be.equal('');
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion1 = await vehicleIdInstance.tokenIdToVersion(1);
        const previousVersion2 = await vehicleIdInstance.tokenIdToVersion(2);

        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion1.add(1)
        );
        expect(await vehicleIdInstance.tokenIdToVersion(2)).to.equal(
          previousVersion2.add(1)
        );
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeBurnedDevAdmin event with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnVehicles([1, 2]))
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(1, user1.address)
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(2, user2.address);
      });
      it('Should emit VehicleAttributeSetDevAdmin events with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnVehicles([1, 2]))
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[1].attribute, '');
      });
    });
  });

  describe('adminBurnVehiclesAndDeletePairings', () => {
    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_VEHICLE_BURN_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .adminBurnVehiclesAndDeletePairings([1, 2])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEV_VEHICLE_BURN_ROLE
          }`
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 99])
        ).to.be.revertedWith(`InvalidNode("${vehicleIdInstance.address}", 99)`);
      });
    });

    context('State', () => {
      beforeEach(async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1'
          }
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(aftermarketDeviceInstance.address, true);
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig
          );

        await aftermarketDeviceInstance
          .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            localPairSignature
          );

        const localMintVehicleOwnerSig = await signMessage({
          _signer: user2,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '2'
          }
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '2'
          }
        });
        const localMintSdInput = {
          integrationNode: '1',
          vehicleNode: '2',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(localMintSdInput);
      });

      context('Vehicle', () => {
        it('Should correctly reset vehicle parent node to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          const parentNode1 = await nodesInstance.getParentNode(
            vehicleIdInstance.address,
            1
          );
          const parentNode2 = await nodesInstance.getParentNode(
            vehicleIdInstance.address,
            2
          );

          expect(parentNode1).to.be.equal(0);
          expect(parentNode2).to.be.equal(0);
        });
        it('Should correctly reset vehicle node owner to zero address', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          await expect(vehicleIdInstance.ownerOf(1)).to.be.revertedWith(
            'ERC721: invalid token ID'
          );
          await expect(vehicleIdInstance.ownerOf(2)).to.be.revertedWith(
            'ERC721: invalid token ID'
          );
        });
        it('Should correctly reset vehicle infos to blank', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
              1,
              C.mockVehicleAttribute1
            )
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
              1,
              C.mockVehicleAttribute2
            )
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
              2,
              C.mockVehicleAttribute1
            )
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
              2,
              C.mockVehicleAttribute2
            )
          ).to.be.equal('');
        });
        it('Should update multi-privilege token version', async () => {
          const previousVersion1 = await vehicleIdInstance.tokenIdToVersion(1);
          const previousVersion2 = await vehicleIdInstance.tokenIdToVersion(2);

          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
            previousVersion1.add(1)
          );
          expect(await vehicleIdInstance.tokenIdToVersion(2)).to.equal(
            previousVersion2.add(1)
          );
        });
      });

      context('Aftermarket Device paired', () => {
        it('Should correctly reset mapping the aftermarket device to vehicle to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getLink(vehicleIdInstance.address, 1)
          ).to.be.equal(0);
        });
        it('Should correctly reset mapping the vehicle to aftermarket device to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getLink(adIdInstance.address, 1)
          ).to.be.equal(0);
        });
      });

      context('Synthetic Device paired', () => {
        it('Should correctly reset synthetic device parent node to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          const parentNode = await nodesInstance.getParentNode(
            sdIdInstance.address,
            1
          );

          expect(parentNode).to.be.equal(0);
        });
        it('Should correctly reset synthetic device node owner to zero address', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          await expect(sdIdInstance.ownerOf(1)).to.be.revertedWith(
            'ERC721: invalid token ID'
          );
        });
        it('Should correctly reset synthetic device address do zero address', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          const id =
            await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
              sdAddress1.address
            );

          expect(id).to.equal(0);
        });
        it('Should correctly reset synthetic device infos to blank', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await nodesInstance.getInfo(
              sdIdInstance.address,
              2,
              C.mockSyntheticDeviceAttribute1
            )
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              sdIdInstance.address,
              2,
              C.mockSyntheticDeviceAttribute2
            )
          ).to.be.equal('');
        });
        it('Should correctly reset mapping the synthetic device to vehicle to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getNodeLink(
              vehicleIdInstance.address,
              sdIdInstance.address,
              2
            )
          ).to.be.equal(0);
        });
        it('Should correctly reset mapping the vehicle to synthetic device to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getNodeLink(
              sdIdInstance.address,
              vehicleIdInstance.address,
              1
            )
          ).to.be.equal(0);
        });
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpairedDevAdmin event with correct params', async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1'
          }
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(aftermarketDeviceInstance.address, true);
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig
          );

        await aftermarketDeviceInstance
          .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            localPairSignature
          );

        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2])
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(1, 1, user1.address);
      });
      it('Should emit SyntheticDeviceNodeBurnedDevAdmin event with correct params', async () => {
        const localMintVehicleOwnerSig = await signMessage({
          _signer: user2,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '2'
          }
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '2'
          }
        });
        const localMintSdInput = {
          integrationNode: '1',
          vehicleNode: '2',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(localMintSdInput);

        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2])
        )
          .to.emit(devAdminInstance, 'SyntheticDeviceNodeBurnedDevAdmin')
          .withArgs(1, 2, user2.address);
      });
      it('Should emit VehicleNodeBurnedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2])
        )
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(1, user1.address)
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(2, user2.address);
      });
      it('Should emit VehicleAttributeSetDevAdmin events with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2])
        )
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[1].attribute, '');
      });
    });
  });
});
