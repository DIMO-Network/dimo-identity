import chai from 'chai';
import { waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  Getter,
  Manufacturer,
  Vehicle
} from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Vehicle', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let getterInstance: Getter;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;

  const [admin, nonAdmin, controller1, user1] = provider.getWallets();

  before(async () => {
    [
      dimoRegistryInstance,
      eip712CheckerInstance,
      getterInstance,
      manufacturerInstance,
      vehicleInstance
    ] = await initialize(
      admin,
      [C.name, C.symbol, C.baseURI],
      'Eip712Checker',
      'Getter',
      'Manufacturer',
      'Vehicle'
    );

    await eip712CheckerInstance.initialize('DIMO', '1');

    // Set manufacturer node type
    await manufacturerInstance
      .connect(admin)
      .setManufacturerNodeType(C.manufacturerNodeType);

    // Set vehicle node type
    await vehicleInstance.connect(admin).setVehicleNodeType(C.vehicleNodeType);

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
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setVehicleNodeType', () => {
    it.skip('testSign', async () => {
      // bytes memory signature = hex"80a4fe4fb13de1ecd13eb218da32638f0faa60006807d3186306c0f99b232b62adb10d6c5f5790f7246286c03fcd914e3521804b91b115c1f93db7955f351c041b";
      await vehicleInstance
        .connect(admin)
        .testSign(
          admin.address,
          '0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8',
          '0x80a4fe4fb13de1ecd13eb218da32638f0faa60006807d3186306c0f99b232b62adb10d6c5f5790f7246286c03fcd914e3521804b91b115c1f93db7955f351c041b'
        );
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        vehicleInstance.connect(nonAdmin).setVehicleNodeType(C.vehicleNodeType)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node type is already set', async () => {
      const [, , localVehicleInstance] = await initialize(
        admin,
        [C.name, C.symbol, C.baseURI],
        'Manufacturer',
        'Vehicle'
      );

      await localVehicleInstance
        .connect(admin)
        .setVehicleNodeType(C.vehicleNodeType);

      await expect(
        localVehicleInstance
          .connect(admin)
          .setVehicleNodeType(C.vehicleNodeType)
      ).to.be.revertedWith('Node type already set');
    });
  });

  describe('addVehicleAttribute', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        vehicleInstance
          .connect(nonAdmin)
          .addVehicleAttribute(C.mockVehicleAttribute1)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should emit AttributeAdded event with correct params', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .addVehicleAttribute(C.mockVehicleAttribute3)
      )
        .to.emit(vehicleInstance, 'AttributeAdded')
        .withArgs(C.vehicleNodeTypeId, C.mockVehicleAttribute3);
    });
  });

  describe('mintVehicle', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          controller1.address,
          C.mockManufacturerAttributes,
          C.mockManufacturerInfos
        );
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        vehicleInstance
          .connect(nonAdmin)
          .mintVehicle(
            1,
            user1.address,
            C.mockVehicleAttributes,
            C.mockVehicleInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if parent node is not a manufacturer node', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .mintVehicle(
            99,
            user1.address,
            C.mockVehicleAttributes,
            C.mockVehicleInfos
          )
      ).to.be.revertedWith('Invalid parent node');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .mintVehicle(
            1,
            user1.address,
            C.mockVehicleAttributes,
            C.mockVehicleInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .mintVehicle(
            1,
            user1.address,
            C.vehicleAttributesNotWhitelisted,
            C.mockVehicleInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set node type', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );

      const nodeType = await getterInstance.getNodeType(2);

      expect(nodeType).to.equal(C.vehicleNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );

      const parentNode = await getterInstance.getParentNode(2);
      expect(parentNode).to.be.equal(1);
    });
    it('Should correctly set node owner', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );

      expect(await dimoRegistryInstance.ownerOf(2)).to.be.equal(user1.address);
    });
    it('Should correctly set infos', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );

      expect(
        await getterInstance.getInfo(2, C.mockVehicleAttribute1)
      ).to.be.equal(C.mockVehicleInfo1);
      expect(
        await getterInstance.getInfo(2, C.mockVehicleAttribute2)
      ).to.be.equal(C.mockVehicleInfo2);
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .mintVehicle(
            1,
            user1.address,
            C.mockVehicleAttributes,
            C.mockVehicleInfos
          )
      )
        .to.emit(vehicleInstance, 'NodeMinted')
        .withArgs(C.vehicleNodeTypeId, 2);
    });
  });

  describe('setVehicleInfo', () => {
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
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        vehicleInstance
          .connect(nonAdmin)
          .setVehicleInfo(2, C.mockVehicleAttributes, C.mockVehicleInfos)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node is not a vehicle', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .setVehicleInfo(99, C.mockVehicleAttributes, C.mockVehicleInfos)
      ).to.be.revertedWith('Node must be a vehicle');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .setVehicleInfo(
            2,
            C.mockVehicleAttributes,
            C.mockVehicleInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .setVehicleInfo(
            2,
            C.vehicleAttributesNotWhitelisted,
            C.mockVehicleInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await vehicleInstance
        .connect(admin)
        .setVehicleInfo(2, C.mockVehicleAttributes, C.mockVehicleInfos);

      expect(
        await getterInstance.getInfo(2, C.mockVehicleAttribute1)
      ).to.be.equal(C.mockVehicleInfo1);
      expect(
        await getterInstance.getInfo(2, C.mockVehicleAttribute2)
      ).to.be.equal(C.mockVehicleInfo2);
    });
  });
});
