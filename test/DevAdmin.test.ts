import chai from 'chai';
import { ethers, waffle, upgrades } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  AdLicenseValidator,
  Mapper,
  MockDimoToken,
  MockStake,
  DevAdmin
} from '../typechain';
import {
  initialize,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  IdManufacturerName,
  C
} from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('DevAdmin', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let accessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let devAdminInstance: DevAdmin;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;

  const [
    admin,
    nonAdmin,
    foundation,
    manufacturer1,
    user1,
    user2,
    adAddress1,
    adAddress2
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
    [
      dimoRegistryInstance,
      eip712CheckerInstance,
      accessControlInstance,
      manufacturerInstance,
      vehicleInstance,
      aftermarketDeviceInstance,
      adLicenseValidatorInstance,
      mapperInstance,
      devAdminInstance
    ] = await initialize(
      admin,
      'Eip712Checker',
      'DimoAccessControl',
      'Manufacturer',
      'Vehicle',
      'AftermarketDevice',
      'AdLicenseValidator',
      'Mapper',
      'DevAdmin'
    );

    const ManufacturerIdFactory = await ethers.getContractFactory(
      'ManufacturerId'
    );
    const vehicleIdFactory = await ethers.getContractFactory('VehicleId');
    const AftermarketDeviceIdFactory = await ethers.getContractFactory(
      'AftermarketDeviceId'
    );

    manufacturerIdInstance = await upgrades.deployProxy(
      ManufacturerIdFactory,
      [
        C.MANUFACTURER_NFT_NAME,
        C.MANUFACTURER_NFT_SYMBOL,
        C.MANUFACTURER_NFT_BASE_URI
      ],
      {
        initializer: 'initialize',
        kind: 'uups'
      }
      // eslint-disable-next-line prettier/prettier
    ) as ManufacturerId;
    await manufacturerIdInstance.deployed();

    vehicleIdInstance = await upgrades.deployProxy(
      vehicleIdFactory,
      [
        C.VEHICLE_NFT_NAME,
        C.VEHICLE_NFT_SYMBOL,
        C.VEHICLE_NFT_BASE_URI
      ],
      {
        initializer: 'initialize',
        kind: 'uups'
      }
      // eslint-disable-next-line prettier/prettier
    ) as VehicleId;
    await vehicleIdInstance.deployed();

    adIdInstance = await upgrades.deployProxy(
      AftermarketDeviceIdFactory,
      [
        C.AD_NFT_NAME,
        C.AD_NFT_SYMBOL,
        C.AD_NFT_BASE_URI
      ],
      {
        initializer: 'initialize',
        kind: 'uups'
      }
      // eslint-disable-next-line prettier/prettier
    ) as AftermarketDeviceId;
    await adIdInstance.deployed();

    const MANUFACTURER_MINTER_ROLE =
      await manufacturerIdInstance.MINTER_ROLE();
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(MANUFACTURER_MINTER_ROLE, dimoRegistryInstance.address);

    const VEHICLE_MINTER_ROLE = await vehicleIdInstance.MINTER_ROLE();
    await vehicleIdInstance
      .connect(admin)
      .grantRole(VEHICLE_MINTER_ROLE, dimoRegistryInstance.address);

    const AD_MINTER_ROLE = await adIdInstance.MINTER_ROLE();
    await adIdInstance
      .connect(admin)
      .grantRole(AD_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(manufacturerIdInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(vehicleIdInstance.address);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(adIdInstance.address);

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

    // Grant MANUFACTURER_ROLE to manufacturer
    await accessControlInstance
      .connect(admin)
      .grantRole(C.MANUFACTURER_ROLE, manufacturer1.address);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

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
      .grantRole(C.NFT_TRANSFERER_ROLE, dimoRegistryInstance.address);

    // Approve DIMO Registry to spend manufacturer1's tokens
    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);

    // Approve DIMO Registry to spend user1's tokens
    await adIdInstance
      .connect(user1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);

    // Setting DimoRegistry address in the AftermarketDeviceId
    await adIdInstance
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
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .transferAftermarketDeviceOwnership(1, user2.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
      it('Should emit AftermarketDeviceTransferred event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .transferAftermarketDeviceOwnership(1, user2.address)
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceTransferred')
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
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unclaimAftermarketDeviceNode([1])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
        await expect(aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig1,
            claimAdSig1
          )).to.be.revertedWith('Device already claimed');
        await expect(aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            2,
            user1.address,
            claimOwnerSig2,
            claimAdSig2
          )).to.be.revertedWith('Device already claimed');

        await devAdminInstance
          .connect(admin)
          .unclaimAftermarketDeviceNode([1, 2]);

        await expect(aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig1,
            claimAdSig1
          )).to.not.be.reverted;
        await expect(aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            2,
            user1.address,
            claimOwnerSig2,
            claimAdSig2
          )).to.not.be.reverted;
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnclaimed event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unclaimAftermarketDeviceNode([1, 2])
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnclaimed')
          .withArgs(1)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnclaimed')
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
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByDeviceNode([2])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
      it('Should emit AftermarketDeviceUnpaired event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 2])
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpaired')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpaired')
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
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByVehicleNode([4, 5])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
      it('Should emit AftermarketDeviceUnpaired event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode([1, 2])
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpaired')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpaired')
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
        .mintManufacturerBatch(
          admin.address,
          C.mockManufacturerNames.slice(1,)
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .renameManufacturers(newIdManufacturerNames)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
          const idReturned = await manufacturerInstance.getManufacturerIdByName(C.mockManufacturerNames[i]);
          const nameReturned = await manufacturerInstance.getManufacturerNameById(i + 1);

          expect(idReturned).to.equal(i + 1);
          expect(nameReturned).to.equal(C.mockManufacturerNames[i]);
        }

        await devAdminInstance
          .connect(admin)
          .renameManufacturers(newIdManufacturerNames);

        for (let i = 0; i < newIdManufacturerNames.length; i++) {
          const idReturned = await manufacturerInstance.getManufacturerIdByName(newIdManufacturerNames[i].name);
          const nameReturned = await manufacturerInstance.getManufacturerNameById(newIdManufacturerNames[i].tokenId);

          expect(idReturned).to.equal(newIdManufacturerNames[i].tokenId);
          expect(nameReturned).to.equal(newIdManufacturerNames[i].name);
        }
      });
    });
  });
});
