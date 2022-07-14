import chai from 'chai';
import { waffle } from 'hardhat';

import { Getter, Root, Vehicle, AutoPi } from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('AutoPi', function () {
  let snapshot: string;
  let getterInstance: Getter;
  let rootInstance: Root;
  let vehicleInstance: Vehicle;
  let autoPiInstance: AutoPi;

  const [admin, nonAdmin, controller1, manufacturer1, user1] =
    provider.getWallets();

  before(async () => {
    [, getterInstance, rootInstance, vehicleInstance, autoPiInstance] =
      await initialize(
        admin,
        [C.name, C.symbol, C.baseURI],
        'Getter',
        'Root',
        'Vehicle',
        'AutoPi'
      );

    // Set node types
    await rootInstance.connect(admin).setRootNodeType(C.rootNodeType);
    await vehicleInstance.connect(admin).setVehicleNodeType(C.vehicleNodeType);
    await autoPiInstance.connect(admin).setAutoPiNodeType(C.autoPiNodeType);

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

    // Whitelist AutoPi attributes
    await autoPiInstance
      .connect(admin)
      .addAutoPiAttribute(C.mockAutoPiAttribute1);
    await autoPiInstance
      .connect(admin)
      .addAutoPiAttribute(C.mockAutoPiAttribute2);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setAutoPiNodeType', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        autoPiInstance.connect(nonAdmin).setAutoPiNodeType(C.vehicleNodeType)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node type is already set', async () => {
      const [, , , localAutoPiInstance] = await initialize(
        admin,
        [C.name, C.symbol, C.baseURI],
        'Root',
        'Vehicle',
        'AutoPi'
      );

      await localAutoPiInstance
        .connect(admin)
        .setAutoPiNodeType(C.autoPiNodeType);

      await expect(
        localAutoPiInstance.connect(admin).setAutoPiNodeType(C.autoPiNodeType)
      ).to.be.revertedWith('Node type already set');
    });
  });

  describe('addAutoPiAttribute', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        autoPiInstance
          .connect(nonAdmin)
          .addAutoPiAttribute(C.mockAutoPiAttribute1)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should emit AttributeAdded event with correct params', async () => {
      await expect(
        autoPiInstance.connect(admin).addAutoPiAttribute(C.mockAutoPiAttribute3)
      )
        .to.emit(autoPiInstance, 'AttributeAdded')
        .withArgs(C.autoPiNodeTypeId, C.mockAutoPiAttribute3);
    });
  });

  describe('mintAutoPiByManufacturer', () => {
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

    // TODO Manufactuerer role test
    it.skip('Should revert if caller does not have admin role', async () => {
      await expect(
        autoPiInstance
          .connect(nonAdmin)
          .mintAutoPi(
            2,
            user1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPiByManufacturer(
            manufacturer1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPiByManufacturer(
            manufacturer1.address,
            C.autoPiAttributesNotWhitelisted,
            C.mockAutoPiInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set node type', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturer(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      const nodeType = await getterInstance.getNodeType(3);

      expect(nodeType).to.equal(C.autoPiNodeTypeId);
    });
    it('Should correctly set node without parent node', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturer(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      const parentNode = await getterInstance.getParentNode(3);
      expect(parentNode).to.be.equal(0);
    });
    it('Should correctly set node owner', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturer(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      expect(await getterInstance.ownerOf(3)).to.be.equal(
        manufacturer1.address
      );
    });
    it('Should correctly set infos', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturer(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute1)
      ).to.be.equal(C.mockAutoPiInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute2)
      ).to.be.equal(C.mockAutoPiInfo2);
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPiByManufacturer(
            manufacturer1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfos
          )
      )
        .to.emit(autoPiInstance, 'NodeMinted')
        .withArgs(C.autoPiNodeTypeId, 3);
    });
  });

  describe('mintAutoPiByManufacturerBatch', () => {
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

    // TODO Manufactuerer role test
    it.skip('Should revert if caller does not have admin role', async () => {
      await expect(
        autoPiInstance
          .connect(nonAdmin)
          .mintAutoPi(
            2,
            user1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPiByManufacturerBatch(
            manufacturer1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiMultipleInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPiByManufacturerBatch(
            manufacturer1.address,
            C.autoPiAttributesNotWhitelisted,
            C.mockAutoPiMultipleInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set node type', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturerBatch(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiMultipleInfos
        );

      const nodeType1 = await getterInstance.getNodeType(3);
      const nodeType2 = await getterInstance.getNodeType(4);

      expect(nodeType1).to.equal(C.autoPiNodeTypeId);
      expect(nodeType2).to.equal(C.autoPiNodeTypeId);
    });
    it('Should correctly set nodes without parent node', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturerBatch(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiMultipleInfos
        );

      const parentNode1 = await getterInstance.getParentNode(3);
      const parentNode2 = await getterInstance.getParentNode(4);

      expect(parentNode1).to.be.equal(0);
      expect(parentNode2).to.be.equal(0);
    });
    it('Should correctly set nodes owner', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturerBatch(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiMultipleInfos
        );

      expect(await getterInstance.ownerOf(3)).to.be.equal(
        manufacturer1.address
      );
      expect(await getterInstance.ownerOf(4)).to.be.equal(
        manufacturer1.address
      );
    });
    it('Should correctly set infos', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturerBatch(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiMultipleInfos
        );

      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute1)
      ).to.be.equal(C.mockAutoPiInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute2)
      ).to.be.equal(C.mockAutoPiInfo2);
      expect(
        await getterInstance.getInfo(4, C.mockAutoPiAttribute1)
      ).to.be.equal(C.mockAutoPiInfo1);
      expect(
        await getterInstance.getInfo(4, C.mockAutoPiAttribute2)
      ).to.be.equal(C.mockAutoPiInfo2);
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPiByManufacturerBatch(
            manufacturer1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiMultipleInfos
          )
      )
        .to.emit(autoPiInstance, 'NodeMinted')
        .withArgs(C.autoPiNodeTypeId, 3)
        .to.emit(autoPiInstance, 'NodeMinted')
        .withArgs(C.autoPiNodeTypeId, 4);
    });
  });

  describe('mintAutoPi', () => {
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
        autoPiInstance
          .connect(nonAdmin)
          .mintAutoPi(
            2,
            user1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if parent node is not a vehicle node', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPi(
            99,
            user1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfos
          )
      ).to.be.revertedWith('Invalid parent node');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPi(
            2,
            user1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPi(
            2,
            user1.address,
            C.autoPiAttributesNotWhitelisted,
            C.mockAutoPiInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set node type', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPi(
          2,
          user1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      const nodeType = await getterInstance.getNodeType(3);

      expect(nodeType).to.equal(C.autoPiNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPi(
          2,
          user1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      const parentNode = await getterInstance.getParentNode(3);
      expect(parentNode).to.be.equal(2);
    });
    it('Should correctly set node owner', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPi(
          2,
          user1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      expect(await getterInstance.ownerOf(3)).to.be.equal(user1.address);
    });
    it('Should correctly set infos', async () => {
      await autoPiInstance
        .connect(admin)
        .mintAutoPi(
          2,
          user1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );

      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute1)
      ).to.be.equal(C.mockAutoPiInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute2)
      ).to.be.equal(C.mockAutoPiInfo2);
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .mintAutoPi(
            2,
            user1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfos
          )
      )
        .to.emit(autoPiInstance, 'NodeMinted')
        .withArgs(C.autoPiNodeTypeId, 3);
    });
  });

  describe('claimAutoPi', () => {
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
      await autoPiInstance
        .connect(admin)
        .mintAutoPiByManufacturer(
          manufacturer1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );
    });

    // TODO Role test
    it.skip('Should revert if caller does not have admin role', async () => {
      await expect(
        autoPiInstance
          .connect(nonAdmin)
          .mintAutoPi(
            2,
            user1.address,
            C.mockAutoPiAttributes,
            C.mockAutoPiInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if AutoPi is already claimed', async () => {
      await autoPiInstance.connect(admin).claimAutoPi(2, 3);

      await expect(
        autoPiInstance.connect(admin).claimAutoPi(2, 3)
      ).to.be.revertedWith('AutoPi already claimed');
    });
    it('Should revert if parent node is not a vehicle node', async () => {
      await expect(
        autoPiInstance.connect(admin).claimAutoPi(99, 3)
      ).to.be.revertedWith('Invalid parent node');
    });
    it('Should correctly set parent node', async () => {
      await autoPiInstance.connect(admin).claimAutoPi(2, 3);

      const parentNode = await getterInstance.getParentNode(3);
      expect(parentNode).to.be.equal(2);
    });
    it('Should correctly set node owner', async () => {
      await autoPiInstance.connect(admin).claimAutoPi(2, 3);

      expect(await getterInstance.ownerOf(3)).to.be.equal(user1.address);
    });
    // TODO Event test
    it.skip('Should emit AutoPiClaimed event with correct params', async () => {
      await expect(autoPiInstance.connect(admin).claimAutoPi(2, 3))
        .to.emit(autoPiInstance, 'AutoPiClaimed')
        .withArgs(C.autoPiNodeTypeId, 3);
    });
  });

  describe('setAutoPiInfo', () => {
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
      await autoPiInstance
        .connect(admin)
        .mintAutoPi(
          2,
          user1.address,
          C.mockAutoPiAttributes,
          C.mockAutoPiInfos
        );
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        autoPiInstance
          .connect(nonAdmin)
          .setAutoPiInfo(3, C.mockAutoPiAttributes, C.mockVehicleInfos)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node is not an AutoPi', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .setAutoPiInfo(99, C.mockAutoPiAttributes, C.mockAutoPiInfos)
      ).to.be.revertedWith('Node must be an AutoPi');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .setAutoPiInfo(3, C.mockAutoPiAttributes, C.mockAutoPiInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        autoPiInstance
          .connect(admin)
          .setAutoPiInfo(3, C.autoPiAttributesNotWhitelisted, C.mockAutoPiInfos)
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await autoPiInstance
        .connect(admin)
        .setAutoPiInfo(3, C.mockAutoPiAttributes, C.mockAutoPiInfos);

      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute1)
      ).to.be.equal(C.mockAutoPiInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAutoPiAttribute2)
      ).to.be.equal(C.mockAutoPiInfo2);
    });
  });
});
