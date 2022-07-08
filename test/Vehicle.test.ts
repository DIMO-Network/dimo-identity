import chai from 'chai';
import { waffle } from 'hardhat';

import { Eip712Checker, Getter, Root, Vehicle } from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from './utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Vehicle', function () {
  let snapshot: string;
  let eip712CheckerInstance: Eip712Checker;
  let getterInstance: Getter;
  let rootInstance: Root;
  let vehicleInstance: Vehicle;

  const [admin, nonAdmin, controller1, user1] = provider.getWallets();

  before(async () => {
    [, eip712CheckerInstance, getterInstance, rootInstance, vehicleInstance] =
      await initialize(
        [C.name, C.symbol, C.baseURI],
        'Eip712Checker',
        'Getter',
        'Root',
        'Vehicle'
      );

    await eip712CheckerInstance.initialize('DIMO', '1');

    // Set root node type
    await rootInstance.connect(admin).setRootNodeType(C.rootNodeType);

    // Set vehicle node type
    await vehicleInstance.connect(admin).setVehicleNodeType(C.vehicleNodeType);

    // Whitelist Root attributes
    await rootInstance.connect(admin).addRootAttribute(C.mockRootAttribute1);
    await rootInstance.connect(admin).addRootAttribute(C.mockRootAttribute2);

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

  describe('setNodeType', () => {
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
        [C.name, C.symbol, C.baseURI],
        'Root',
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
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);
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
    it('Should revert if parent node is not a root node', async () => {
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

      expect(await getterInstance.ownerOf(2)).to.be.equal(user1.address);
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
        .to.emit(rootInstance, 'NodeMinted')
        .withArgs(C.vehicleNodeTypeId, 2);
    });
  });

  describe('setVehicleInfo', () => {
    beforeEach(async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockRootAttributes, C.mockRootInfos);
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
