import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  AccessControl,
  Manufacturer,
  ManufacturerNft,
  Vehicle,
  VehicleNft,
  AftermarketDevice,
  AftermarketDeviceNft,
  AdLicenseValidator,
  Mapper,
  MockDimoToken,
  MockLicense,
  DevAdmin
} from '../typechain';
import {
  initialize,
  createSnapshot,
  revertToSnapshot,
  signMessage,
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
  let accessControlInstance: AccessControl;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockLicenseInstance: MockLicense;
  let devAdminInstance: DevAdmin;
  let manufacturerNftInstance: ManufacturerNft;
  let vehicleNftInstance: VehicleNft;
  let adNftInstance: AftermarketDeviceNft;

  const [
    admin,
    nonAdmin,
    foundation,
    controller1,
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
      './contracts/access/AccessControl.sol:AccessControl',
      'Manufacturer',
      'Vehicle',
      'AftermarketDevice',
      'AdLicenseValidator',
      'Mapper',
      'DevAdmin'
    );

    const ManufacturerNftFactory = await ethers.getContractFactory(
      'ManufacturerNft'
    );
    const VehicleNftFactory = await ethers.getContractFactory('VehicleNft');
    const AftermarketDeviceNftFactory = await ethers.getContractFactory(
      'AftermarketDeviceNft'
    );

    manufacturerNftInstance = await ManufacturerNftFactory.connect(
      admin
    ).deploy(C.MANUFACTURER_NFT_NAME, C.MANUFACTURER_NFT_SYMBOL);
    await manufacturerNftInstance.deployed();

    vehicleNftInstance = await VehicleNftFactory.connect(admin).deploy(
      C.VEHICLE_NFT_NAME,
      C.VEHICLE_NFT_SYMBOL
    );
    await vehicleNftInstance.deployed();

    adNftInstance = await AftermarketDeviceNftFactory.connect(admin).deploy(
      C.AD_NFT_NAME,
      C.AD_NFT_SYMBOL
    );
    await adNftInstance.deployed();

    const MANUFACTURER_MINTER_ROLE =
      await manufacturerNftInstance.MINTER_ROLE();
    await manufacturerNftInstance
      .connect(admin)
      .grantRole(MANUFACTURER_MINTER_ROLE, dimoRegistryInstance.address);

    const VEHICLE_MINTER_ROLE = await vehicleNftInstance.MINTER_ROLE();
    await vehicleNftInstance
      .connect(admin)
      .grantRole(VEHICLE_MINTER_ROLE, dimoRegistryInstance.address);

    const AD_MINTER_ROLE = await adNftInstance.MINTER_ROLE();
    await adNftInstance
      .connect(admin)
      .grantRole(AD_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerNftProxyAddress(manufacturerNftInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleNftProxyAddress(vehicleNftInstance.address);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceNftProxyAddress(adNftInstance.address);

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

    // Deploy MockLicense contract
    const MockLicenseFactory = await ethers.getContractFactory('MockLicense');
    mockLicenseInstance = await MockLicenseFactory.connect(admin).deploy();
    await mockLicenseInstance.deployed();

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
    await adLicenseValidatorInstance.setLicense(mockLicenseInstance.address);
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
        controller1.address,
        C.mockManufacturerAttributeInfoPairs
      );

    await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adNftInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, dimoRegistryInstance.address);

    // Approve DIMO Registry to spend manufacturer1's tokens
    await adNftInstance
      .connect(manufacturer1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);

    // Approve DIMO Registry to spend user1's tokens
    await adNftInstance
      .connect(user1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);
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
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      // TODO Check not tyep ?
      it.skip('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .transferAftermarketDeviceOwnership(99, user2.address)
        ).to.be.revertedWith('Invalid AD node');
      });
    });

    context('State change', () => {
      it('Should correctly set new node owner', async () => {
        expect(await adNftInstance.ownerOf(1)).to.be.equal(user1.address);

        await devAdminInstance
          .connect(admin)
          .transferAftermarketDeviceOwnership(1, user2.address);

        expect(await adNftInstance.ownerOf(1)).to.be.equal(user2.address);
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
        .pairAftermarketDeviceSign(1, 1, pairSig1);
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 2, pairSig2);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByDeviceNode([2])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      // TODO Check node type ?
      it.skip('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 99])
        ).to.be.revertedWith('Invalid AD node');
      });
    });

    context('State change', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(
          await mapperInstance.getLink(adNftInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(adNftInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode([1, 2]);

        expect(
          await mapperInstance.getLink(adNftInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(adNftInstance.address, 2)
        ).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode([1, 2]);

        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 2)
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
        .pairAftermarketDeviceSign(1, 1, pairSig1);
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 2, pairSig2);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByVehicleNode([4, 5])
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      // TODO Check node type ?
      it.skip('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode([1, 99])
        ).to.be.revertedWith('Invalid vehicle node');
      });
    });

    context('State change', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(
          await mapperInstance.getLink(adNftInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(adNftInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode([1, 2]);

        expect(
          await mapperInstance.getLink(adNftInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(adNftInstance.address, 2)
        ).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 2)
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode([1, 2]);

        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 2)
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
});
