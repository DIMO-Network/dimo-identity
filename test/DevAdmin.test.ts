import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  AccessControl,
  Manufacturer,
  Vehicle,
  AftermarketDevice,
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
      [C.name, C.symbol, C.baseURI],
      'Eip712Checker',
      'AccessControl',
      'Manufacturer',
      'Vehicle',
      'AftermarketDevice',
      'AdLicenseValidator',
      'Mapper',
      'DevAdmin'
    );

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

    // Set node types
    await manufacturerInstance
      .connect(admin)
      .setManufacturerNodeType(C.manufacturerNodeType);
    await vehicleInstance.connect(admin).setVehicleNodeType(C.vehicleNodeType);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceNodeType(C.aftermarketDeviceNodeType);

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
        C.mockManufacturerAttributes,
        C.mockManufacturerInfos
      );

    await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 1);
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
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      adSig = await signMessage({
        _signer: adAddress1,
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
          [adAddress1.address, adAddress2.address],
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(2, user1.address, ownerSig, adSig);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .transferAftermarketDeviceOwnership(2, user2.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
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

    context('State change', () => {
      it('Should correctly set new node owner', async () => {
        expect(await dimoRegistryInstance.ownerOf(2)).to.be.equal(
          user1.address
        );

        await devAdminInstance
          .connect(admin)
          .transferAftermarketDeviceOwnership(2, user2.address);

        expect(await dimoRegistryInstance.ownerOf(2)).to.be.equal(
          user2.address
        );
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceTransferred event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .transferAftermarketDeviceOwnership(2, user2.address)
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceTransferred')
          .withArgs(2, user1.address, user2.address);
      });
    });
  });

  describe('unpairAftermarketDevice', () => {
    let claimOwnerSig: string;
    let claimAdSig: string;
    let signature: string;
    before(async () => {
      claimOwnerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      claimAdSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      signature = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '4'
        }
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          [adAddress1.address, adAddress2.address],
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user1.address,
          claimOwnerSig,
          claimAdSig
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, signature);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).unpairAftermarketDevice(2, 4)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance.connect(admin).unpairAftermarketDevice(99, 4)
        ).to.be.revertedWith('Invalid AD node');
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance.connect(admin).unpairAftermarketDevice(2, 99)
        ).to.be.revertedWith('Invalid vehicle node');
      });
    });

    context('State change', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(await mapperInstance.getLink(4)).to.be.equal(2);

        await devAdminInstance.connect(admin).unpairAftermarketDevice(2, 4);

        expect(await mapperInstance.getLink(4)).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(await mapperInstance.getLink(2)).to.be.equal(4);

        await devAdminInstance.connect(admin).unpairAftermarketDevice(2, 4);

        expect(await mapperInstance.getLink(2)).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpaired event with correct params', async () => {
        await expect(
          devAdminInstance.connect(admin).unpairAftermarketDevice(2, 4)
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpaired')
          .withArgs(2, 4, user1.address);
      });
    });
  });

  describe('unpairAftermarketDeviceByDeviceNode', () => {
    let claimOwnerSig: string;
    let claimAdSig: string;
    let signature: string;
    before(async () => {
      claimOwnerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      claimAdSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      signature = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '4'
        }
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          [adAddress1.address, adAddress2.address],
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user1.address,
          claimOwnerSig,
          claimAdSig
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, signature);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByDeviceNode(2)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode(99)
        ).to.be.revertedWith('Invalid AD node');
      });
    });

    context('State change', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(await mapperInstance.getLink(4)).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode(2);

        expect(await mapperInstance.getLink(4)).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(await mapperInstance.getLink(2)).to.be.equal(4);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode(2);

        expect(await mapperInstance.getLink(2)).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpaired event with correct params', async () => {
        await expect(
          devAdminInstance.connect(admin).unpairAftermarketDeviceByDeviceNode(2)
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpaired')
          .withArgs(2, 4, user1.address);
      });
    });
  });

  describe('unpairAftermarketDeviceByVehicleNode', () => {
    let claimOwnerSig: string;
    let claimAdSig: string;
    let signature: string;
    before(async () => {
      claimOwnerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      claimAdSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      });
      signature = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '4'
        }
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          [adAddress1.address, adAddress2.address],
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user1.address,
          claimOwnerSig,
          claimAdSig
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, signature);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByVehicleNode(4)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode(99)
        ).to.be.revertedWith('Invalid vehicle node');
      });
    });

    context('State change', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(await mapperInstance.getLink(4)).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode(4);

        expect(await mapperInstance.getLink(4)).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(await mapperInstance.getLink(2)).to.be.equal(4);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode(4);

        expect(await mapperInstance.getLink(2)).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpaired event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode(4)
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpaired')
          .withArgs(2, 4, user1.address);
      });
    });
  });
});
