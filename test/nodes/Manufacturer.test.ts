import chai from 'chai';
import { waffle } from 'hardhat';

import {
  DIMORegistry,
  DimoAccessControl,
  Nodes,
  Manufacturer,
  ManufacturerId
} from '../../typechain';
import {
  initialize,
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  C
} from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('Manufacturer', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let manufacturerIdInstance: ManufacturerId;

  const [admin, nonAdmin, manufacturer1, manufacturer2, nonController] =
    provider.getWallets();

  before(async () => {
    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'Nodes', 'Manufacturer'],
      nfts: ['ManufacturerId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    manufacturerIdInstance = deployments.ManufacturerId;

    await grantAdminRoles(admin, dimoAccessControlInstance);

    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxy
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(manufacturerIdInstance.address);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setManufacturerIdProxyAddress', () => {
    let localManufacturerInstance: Manufacturer;
    beforeEach(async () => {
      const deployments = await initialize(
        admin,
        'DimoAccessControl',
        'Manufacturer'
      );

      const localDimoAccessControlInstance = deployments.DimoAccessControl;
      localManufacturerInstance = deployments.Manufacturer;

      await localDimoAccessControlInstance
        .connect(admin)
        .grantRole(C.ADMIN_ROLE, admin.address);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localManufacturerInstance
            .connect(nonAdmin)
            .setManufacturerIdProxyAddress(manufacturerIdInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localManufacturerInstance
            .connect(admin)
            .setManufacturerIdProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerIdProxySet event with correct params', async () => {
        await expect(
          localManufacturerInstance
            .connect(admin)
            .setManufacturerIdProxyAddress(manufacturerIdInstance.address)
        )
          .to.emit(localManufacturerInstance, 'ManufacturerIdProxySet')
          .withArgs(manufacturerIdInstance.address);
      });
    });
  });

  describe('addManufacturerAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .addManufacturerAttribute(C.mockManufacturerAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .addManufacturerAttribute(C.mockManufacturerAttribute1)
        ).to.be.revertedWith('Attribute already exists');
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerAttributeAdded event with correct params', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .addManufacturerAttribute(C.mockManufacturerAttribute3)
        )
          .to.emit(manufacturerInstance, 'ManufacturerAttributeAdded')
          .withArgs(C.mockManufacturerAttribute3);
      });
    });
  });

  describe('setController', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .setController(manufacturer1.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.ADMIN_ROLE
          }`
        );
      });
      it('Should revert if address is the zero address', async () => {
        await expect(
          manufacturerInstance.connect(admin).setController(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
      it('Should revert if address is already a controller', async () => {
        await manufacturerInstance
          .connect(admin)
          .setController(manufacturer1.address);

        await expect(
          manufacturerInstance
            .connect(admin)
            .setController(manufacturer1.address)
        ).to.be.revertedWith('Already a controller');
      });
    });

    context('Events', () => {
      it('Should emit ControllerSet event with correct params', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .setController(manufacturer1.address)
        )
          .to.emit(manufacturerInstance, 'ControllerSet')
          .withArgs(manufacturer1.address);
      });
    });
  });

  describe('mintManufacturerBatch', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have MINT_MANUFACTURER_ROLE', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .mintManufacturerBatch(nonAdmin.address, C.mockManufacturerNames)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.MINT_MANUFACTURER_ROLE
          }`
        );
      });
      it('Should revert if owner does not have admin role', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturerBatch(nonAdmin.address, C.mockManufacturerNames)
        ).to.be.revertedWith('Owner must be an admin');
      });
      it('Should revert if manufacturer name is already registered', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturerBatch(admin.address, C.mockManufacturerNames);

        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturerBatch(admin.address, C.mockManufacturerNames)
        ).to.be.revertedWith('Manufacturer name already registered');
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturerBatch(admin.address, C.mockManufacturerNames);

        const parentNode1 = await nodesInstance.getParentNode(
          manufacturerIdInstance.address,
          1
        );
        const parentNode2 = await nodesInstance.getParentNode(
          manufacturerIdInstance.address,
          2
        );
        const parentNode3 = await nodesInstance.getParentNode(
          manufacturerIdInstance.address,
          3
        );

        // Assure it does not have parent
        expect(parentNode1).to.be.equal(0);
        expect(parentNode2).to.be.equal(0);
        expect(parentNode3).to.be.equal(0);
      });
      it('Should correctly set node owner', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturerBatch(admin.address, C.mockManufacturerNames);

        const nodeOwner1 = await manufacturerIdInstance.ownerOf(1);
        const nodeOwner2 = await manufacturerIdInstance.ownerOf(2);
        const nodeOwner3 = await manufacturerIdInstance.ownerOf(3);

        expect(nodeOwner1).to.be.equal(admin.address);
        expect(nodeOwner2).to.be.equal(admin.address);
        expect(nodeOwner3).to.be.equal(admin.address);
      });
      it('Should correctly set names', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturerBatch(admin.address, C.mockManufacturerNames);

        const id1 = (
          await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[0]
          )
        ).toNumber();
        const id2 = (
          await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[1]
          )
        ).toNumber();
        const id3 = (
          await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[2]
          )
        ).toNumber();

        expect([id1, id2, id3]).to.eql([1, 2, 3]);
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerNodeMinted event with correct params', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturerBatch(admin.address, C.mockManufacturerNames)
        )
          .to.emit(manufacturerInstance, 'ManufacturerNodeMinted')
          .withArgs(1, admin.address)
          .to.emit(manufacturerInstance, 'ManufacturerNodeMinted')
          .withArgs(2, admin.address)
          .to.emit(manufacturerInstance, 'ManufacturerNodeMinted')
          .withArgs(3, admin.address);
      });
    });
  });

  describe('mintManufacturer', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have MINT_MANUFACTURER_ROLE', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .mintManufacturer(
              nonController.address,
              C.mockManufacturerNames[0],
              C.mockManufacturerAttributeInfoPairs
            )
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.MINT_MANUFACTURER_ROLE
          }`
        );
      });
      it('Should revert if controller has already minted a manufacturer', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturer(
              manufacturer1.address,
              C.mockManufacturerNames[1],
              C.mockManufacturerAttributeInfoPairs
            )
        ).to.be.revertedWith('Invalid request');
      });
      it('Should revert if manufacturer name is already registered', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturer(
              manufacturer2.address,
              C.mockManufacturerNames[0],
              C.mockManufacturerAttributeInfoPairs
            )
        ).to.be.revertedWith('Manufacturer name already registered');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturer(
              manufacturer1.address,
              C.mockManufacturerNames[0],
              C.mockManufacturerAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State', () => {
      it('Should correctly set owner as controller', async () => {
        const isControllerBefore: boolean =
          await manufacturerInstance.isController(manufacturer1.address);
        // eslint-disable-next-line no-unused-expressions
        expect(isControllerBefore).to.be.false;

        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        const isControllerAfter: boolean =
          await manufacturerInstance.isController(manufacturer1.address);
        // eslint-disable-next-line no-unused-expressions
        expect(isControllerAfter).to.be.true;
      });
      it('Should correctly set parent node', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        const parentNode = await nodesInstance.getParentNode(
          manufacturerIdInstance.address,
          1
        );

        // Assure it does not have parent
        expect(parentNode).to.be.equal(0);
      });
      it('Should correctly set node owner', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        expect(await manufacturerIdInstance.ownerOf(1)).to.be.equal(
          manufacturer1.address
        );
      });
      it('Should correctly set manufacturerMinted', async () => {
        const isManufacturerMintedBefore =
          await manufacturerInstance.isManufacturerMinted(
            manufacturer1.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedBefore).to.be.false;

        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        const isManufacturerMintedAfter =
          await manufacturerInstance.isManufacturerMinted(
            manufacturer1.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedAfter).to.be.true;
      });
      it('Should correctly set name', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        const id = (
          await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[0]
          )
        ).toNumber();

        expect(id).to.be.equal(1);
      });
      it('Should correctly set infos', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            C.mockManufacturerNames[0],
            C.mockManufacturerAttributeInfoPairs
          );

        expect(
          await nodesInstance.getInfo(
            manufacturerIdInstance.address,
            1,
            C.mockManufacturerAttribute1
          )
        ).to.be.equal(C.mockManufacturerInfo1);
        expect(
          await nodesInstance.getInfo(
            manufacturerIdInstance.address,
            1,
            C.mockManufacturerAttribute2
          )
        ).to.be.equal(C.mockManufacturerInfo2);
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerNodeMinted event with correct params', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturer(
              manufacturer1.address,
              C.mockManufacturerNames[0],
              C.mockManufacturerAttributeInfoPairs
            )
        )
          .to.emit(manufacturerInstance, 'ManufacturerNodeMinted')
          .withArgs(1, admin.address);
      });
      it('Should emit ManufacturerAttributeSet events with correct params', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturer(
              manufacturer1.address,
              C.mockManufacturerNames[0],
              C.mockManufacturerAttributeInfoPairs
            )
        )
          .to.emit(manufacturerInstance, 'ManufacturerAttributeSet')
          .withArgs(
            1,
            C.mockManufacturerAttributeInfoPairs[0].attribute,
            C.mockManufacturerAttributeInfoPairs[0].info
          )
          .to.emit(manufacturerInstance, 'ManufacturerAttributeSet')
          .withArgs(
            1,
            C.mockManufacturerAttributeInfoPairs[1].attribute,
            C.mockManufacturerAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('setManufacturerInfo', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          manufacturer1.address,
          C.mockManufacturerNames[0],
          C.mockManufacturerAttributeInfoPairs
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have SET_MANUFACTURER_INFO_ROLE', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .setManufacturerInfo(1, C.mockManufacturerAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.SET_MANUFACTURER_INFO_ROLE
          }`
        );
      });
      it('Should revert if node is not a manufacturer', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .setManufacturerInfo(99, C.mockManufacturerAttributeInfoPairs)
        ).to.be.revertedWith('Invalid manufacturer node');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .setManufacturerInfo(
              1,
              C.mockManufacturerAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockManufacturerAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            manufacturerIdInstance.address,
            1,
            C.mockManufacturerAttribute1
          )
        ).to.be.equal(C.mockManufacturerInfo1);
        expect(
          await nodesInstance.getInfo(
            manufacturerIdInstance.address,
            1,
            C.mockManufacturerAttribute2
          )
        ).to.be.equal(C.mockManufacturerInfo2);

        await manufacturerInstance
          .connect(admin)
          .setManufacturerInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            manufacturerIdInstance.address,
            1,
            C.mockManufacturerAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            manufacturerIdInstance.address,
            1,
            C.mockManufacturerAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerAttributeSet events with correct params', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockManufacturerAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        await expect(
          manufacturerInstance
            .connect(admin)
            .setManufacturerInfo(1, localNewAttributeInfoPairs)
        )
          .to.emit(manufacturerInstance, 'ManufacturerAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[0].attribute,
            localNewAttributeInfoPairs[0].info
          )
          .to.emit(manufacturerInstance, 'ManufacturerAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[1].attribute,
            localNewAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('updateManufacturerMinted', () => {
    it('Should revert if caller is not the NFT Proxy', async () => {
      await expect(
        manufacturerInstance
          .connect(nonAdmin)
          .updateManufacturerMinted(
            manufacturer1.address,
            manufacturer2.address
          )
      ).to.be.revertedWith('Only NFT Proxy');
    });
  });

  describe('getManufacturerIdByName', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          manufacturer1.address,
          C.mockManufacturerNames[0],
          C.mockManufacturerAttributeInfoPairs
        );
    });

    it('Should return 0 if the queried name is not associated with any minted device', async () => {
      const tokenId = await manufacturerInstance.getManufacturerIdByName(
        C.mockManufacturerNames[1]
      );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId = await manufacturerInstance.getManufacturerIdByName(
        C.mockManufacturerNames[0]
      );

      expect(tokenId).to.equal(1);
    });
  });

  describe('getManufacturerNameById', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          manufacturer1.address,
          C.mockManufacturerNames[0],
          C.mockManufacturerAttributeInfoPairs
        );
    });

    it('Should return an empty string if the queried Id is not associated with any minted device', async () => {
      const name = await manufacturerInstance.getManufacturerNameById(99);

      expect(name).to.equal('');
    });
    it('Should return the correct name', async () => {
      const name = await manufacturerInstance.getManufacturerNameById(1);

      expect(name).to.equal(C.mockManufacturerNames[0]);
    });
  });

  describe('isController', () => {
    it('Should return false if address is not a controller', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(await manufacturerInstance.isController(nonController.address)).to
        .be.false;
    });
    it('Should return true if address is a controller', async () => {
      await manufacturerInstance
        .connect(admin)
        .setController(manufacturer1.address);

      // eslint-disable-next-line no-unused-expressions
      expect(await manufacturerInstance.isController(manufacturer1.address)).to
        .be.true;
    });
  });

  describe('isManufacturerMinted', () => {
    it('Should return false if manufacturer has not yet minted', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await manufacturerInstance.isManufacturerMinted(manufacturer1.address)
      ).to.be.false;
    });
    it('Should return true if manufacturer has minted', async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          manufacturer1.address,
          C.mockManufacturerNames[0],
          C.mockManufacturerAttributeInfoPairs
        );

      // eslint-disable-next-line no-unused-expressions
      expect(
        await manufacturerInstance.isManufacturerMinted(manufacturer1.address)
      ).to.be.true;
    });
  });

  describe('isAllowedToOwnManufacturerNode', () => {
    it('Should return false if address is not a controller', async () => {
      // eslint-disable-next-line no-unused-expressions
      expect(
        await manufacturerInstance.isAllowedToOwnManufacturerNode(
          manufacturer1.address
        )
      ).to.be.false;
    });
    it('Should return false if address has already minted', async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          manufacturer1.address,
          C.mockManufacturerNames[0],
          C.mockManufacturerAttributeInfoPairs
        );

      // eslint-disable-next-line no-unused-expressions
      expect(
        await manufacturerInstance.isAllowedToOwnManufacturerNode(
          manufacturer1.address
        )
      ).to.be.false;
    });
    it('Should return true if address is a controller and has not yet minted', async () => {
      await manufacturerInstance
        .connect(admin)
        .setController(manufacturer1.address);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await manufacturerInstance.isAllowedToOwnManufacturerNode(
          manufacturer1.address
        )
      ).to.be.true;
    });
  });
});
