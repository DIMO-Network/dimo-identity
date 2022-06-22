import chai from 'chai';
import { waffle } from 'hardhat';

import { Getter, Root, Vehicle } from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from './utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Vehicle', function () {
  let snapshot: string;
  let getterInstance: Getter;
  let rootInstance: Root;
  let vehicleInstance: Vehicle;

  const [admin, nonAdmin, controller1, user1] = provider.getWallets();

  before(async () => {
    [, getterInstance, rootInstance, vehicleInstance] = await initialize([
      'Getter',
      'Root',
      'Vehicle'
    ]);

    // Set root node type
    await rootInstance.connect(admin).setRootNodeType(C.rootNodeType);

    // Set vehicle node type
    await vehicleInstance.connect(admin).setVehicleNodeType(C.vehicleNodeType);

    // Whitelist Root attributes
    await rootInstance.connect(admin).addRootAttribute(C.mockAttribute1);
    await rootInstance.connect(admin).addRootAttribute(C.mockAttribute2);

    // Whitelist Vehicle attributes
    await vehicleInstance.connect(admin).addVehicleAttribute(C.mockAttribute1);
    await vehicleInstance.connect(admin).addVehicleAttribute(C.mockAttribute2);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setNodeType', () => {
    it('Should revert if caller is not an admin', async () => {
      await expect(
        vehicleInstance.connect(nonAdmin).setVehicleNodeType(C.vehicleNodeType)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should revert if node type is already set', async () => {
      const [, , localVehicleInstance] = await initialize(['Root', 'Vehicle']);

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
    it('Should revert if caller is not an admin', async () => {
      await expect(
        vehicleInstance.connect(nonAdmin).addVehicleAttribute(C.mockAttribute1)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should emit AttributeAdded event with correct params', async () => {
      await expect(
        vehicleInstance.connect(admin).addVehicleAttribute(C.mockAttribute1)
      )
        .to.emit(vehicleInstance, 'AttributeAdded')
        .withArgs(C.mockAttribute1);
    });
  });

  describe('mintVehicle', () => {
    beforeEach(async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);
    });

    it('Should revert if caller is not an admin', async () => {
      await expect(
        vehicleInstance
          .connect(nonAdmin)
          .mintVehicle(1, user1.address, C.mockAttributes, C.mockInfos)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should revert if parent node is not a root node', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .mintVehicle(99, user1.address, C.mockAttributes, C.mockInfos)
      ).to.be.revertedWith('Invalid parent node');
    });
    it('Should correctly set node type', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockAttributes, C.mockInfos);

      const nodeType = await getterInstance.getNodeType(2);

      expect(nodeType).to.equal(C.vehicleNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockAttributes, C.mockInfos);

      const parentNode = await getterInstance.getParentNode(2);
      expect(parentNode).to.be.equal(1);
    });
    it('Should correctly set node owner', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockAttributes, C.mockInfos);

      expect(await getterInstance.ownerOf(2)).to.be.equal(user1.address);
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockAttributes, C.mockInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .mintVehicle(
            1,
            user1.address,
            C.attributesNotWhitelisted,
            C.mockInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockAttributes, C.mockInfos);

      expect(await getterInstance.getInfo(2, C.mockAttribute1)).to.be.equal(
        C.mockInfo1
      );
      expect(await getterInstance.getInfo(2, C.mockAttribute2)).to.be.equal(
        C.mockInfo2
      );
    });
  });

  describe('setVehicleInfo', () => {
    beforeEach(async () => {
      await rootInstance
        .connect(admin)
        .mintRoot(controller1.address, C.mockAttributes, C.mockInfos);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockAttributes, C.mockInfos);
    });

    it('Should revert if caller is not an admin', async () => {
      await expect(
        vehicleInstance
          .connect(nonAdmin)
          .setVehicleInfo(2, C.mockAttributes, C.mockInfos)
      ).to.be.revertedWith('Caller is not an admin');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .setVehicleInfo(2, C.mockAttributes, C.mockInfosWrongSize)
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        vehicleInstance
          .connect(admin)
          .setVehicleInfo(2, C.attributesNotWhitelisted, C.mockInfos)
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await vehicleInstance
        .connect(admin)
        .setVehicleInfo(1, C.mockAttributes, C.mockInfos);

      expect(await getterInstance.getInfo(2, C.mockAttribute1)).to.be.equal(
        C.mockInfo1
      );
      expect(await getterInstance.getInfo(2, C.mockAttribute2)).to.be.equal(
        C.mockInfo2
      );
    });
  });
});
