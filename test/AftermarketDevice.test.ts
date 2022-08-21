import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  AccessControl,
  Getter,
  Manufacturer,
  Vehicle,
  AftermarketDevice,
  AMLicenseValidator,
  MockDimoToken,
  MockLicense
} from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('AftermarketDevice', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let accessControlInstance: AccessControl;
  let getterInstance: Getter;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let amLicenseValidatorInstance: AMLicenseValidator;
  let mockDimoTokenInstance: MockDimoToken;
  let mockLicenseInstance: MockLicense;

  const [
    admin,
    nonAdmin,
    foundation,
    controller1,
    manufacturer1,
    nonManufacturer,
    user1
  ] = provider.getWallets();

  before(async () => {
    [
      dimoRegistryInstance,
      accessControlInstance,
      getterInstance,
      manufacturerInstance,
      vehicleInstance,
      aftermarketDeviceInstance,
      amLicenseValidatorInstance
    ] = await initialize(
      admin,
      [C.name, C.symbol, C.baseURI],
      'AccessControl',
      'Getter',
      'Manufacturer',
      'Vehicle',
      'AftermarketDevice',
      'AMLicenseValidator'
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

    // Setup AMLicenseValidator variables
    await amLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await amLicenseValidatorInstance.setDimoToken(
      mockDimoTokenInstance.address
    );
    await amLicenseValidatorInstance.setLicense(mockLicenseInstance.address);
    await amLicenseValidatorInstance.setAmDeviceMintCost(C.amDeviceMintCost);

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
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setAftermarketDeviceNodeType', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .setAftermarketDeviceNodeType(C.vehicleNodeType)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node type is already set', async () => {
      const [, , , localAftermarketDeviceInstance] = await initialize(
        admin,
        [C.name, C.symbol, C.baseURI],
        'Manufacturer',
        'Vehicle',
        'AftermarketDevice'
      );

      await localAftermarketDeviceInstance
        .connect(admin)
        .setAftermarketDeviceNodeType(C.aftermarketDeviceNodeType);

      await expect(
        localAftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceNodeType(C.aftermarketDeviceNodeType)
      ).to.be.revertedWith('Node type already set');
    });
  });

  describe('addAftermarketDeviceAttribute', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should emit AttributeAdded event with correct params', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute3)
      )
        .to.emit(aftermarketDeviceInstance, 'AttributeAdded')
        .withArgs(
          C.aftermarketDeviceNodeTypeId,
          C.mockAftermarketDeviceAttribute3
        );
    });
  });

  describe('mintAftermarketDeviceByManufacturerBatch', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          controller1.address,
          C.mockManufacturerAttributes,
          C.mockManufacturerInfos
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );
      await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 1);
    });

    it('Should revert if caller does not have manufacturer role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonManufacturer)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonManufacturer.address.toLowerCase()} is missing role ${
          C.MANUFACTURER_ROLE
        }`
      );
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if manufacturer does not have a license', async () => {
      await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 0);

      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('Invalid license');
    });
    it('Should revert if manufacturer does not have a enougth DIMO tokens', async () => {
      await mockDimoTokenInstance
        .connect(manufacturer1)
        .burn(C.manufacturerDimoTokensAmount);

      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });
    it('Should revert if manufacturer has not approve DIMORegistry', async () => {
      await mockDimoTokenInstance
        .connect(manufacturer1)
        .approve(dimoRegistryInstance.address, 0);

      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('ERC20: insufficient allowance');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.aftermarketDeviceAttributesNotWhitelisted,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set node type', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      const nodeType1 = await getterInstance.getNodeType(3);
      const nodeType2 = await getterInstance.getNodeType(4);

      expect(nodeType1).to.equal(C.aftermarketDeviceNodeTypeId);
      expect(nodeType2).to.equal(C.aftermarketDeviceNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      const parentNode1 = await getterInstance.getParentNode(3);
      const parentNode2 = await getterInstance.getParentNode(4);

      expect(parentNode1).to.be.equal(1);
      expect(parentNode2).to.be.equal(1);
    });
    it('Should correctly set nodes owner', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      expect(await dimoRegistryInstance.ownerOf(3)).to.be.equal(
        manufacturer1.address
      );
      expect(await dimoRegistryInstance.ownerOf(4)).to.be.equal(
        manufacturer1.address
      );
    });
    it('Should correctly set infos', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute1)
      ).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute2)
      ).to.be.equal(C.mockAftermarketDeviceInfo2);
      expect(
        await getterInstance.getInfo(4, C.mockAftermarketDeviceAttribute1)
      ).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(
        await getterInstance.getInfo(4, C.mockAftermarketDeviceAttribute2)
      ).to.be.equal(C.mockAftermarketDeviceInfo2);
    });
    it('Should correctly decrease the DIMO balance of the manufacturer', async () => {
      const balanceChange = C.amDeviceMintCost
        .mul(C.mockAftermarketDeviceMultipleInfos.length)
        .mul(-1);

      await expect(() =>
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).changeTokenBalance(mockDimoTokenInstance, manufacturer1, balanceChange);
    });
    it('Should correctly transfer the DIMO tokens to the foundation', async () => {
      const balanceChange = C.amDeviceMintCost.mul(
        C.mockAftermarketDeviceMultipleInfos.length
      );

      await expect(() =>
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).changeTokenBalance(mockDimoTokenInstance, foundation, balanceChange);
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      )
        .to.emit(aftermarketDeviceInstance, 'NodeMinted')
        .withArgs(C.aftermarketDeviceNodeTypeId, 3)
        .to.emit(aftermarketDeviceInstance, 'NodeMinted')
        .withArgs(C.aftermarketDeviceNodeTypeId, 4);
    });
  });

  describe('setAftermarketDeviceInfo', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          controller1.address,
          C.mockManufacturerAttributes,
          C.mockManufacturerInfos
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );
      await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 1);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .setAftermarketDeviceInfo(
            3,
            C.mockAftermarketDeviceAttributes,
            C.mockVehicleInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node is not an Aftermarket Device', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(
            99,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceInfos
          )
      ).to.be.revertedWith('Node must be an Aftermarket Device');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(
            3,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(
            3,
            C.aftermarketDeviceAttributesNotWhitelisted,
            C.mockAftermarketDeviceInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .setAftermarketDeviceInfo(
          3,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceInfos
        );

      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute1)
      ).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute2)
      ).to.be.equal(C.mockAftermarketDeviceInfo2);
    });
  });
});
