import chai from 'chai';
import { ethers, waffle, upgrades } from 'hardhat';

import {
  DIMORegistry,
  Nodes,
  Manufacturer,
  ManufacturerNft
} from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Manufacturer', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let manufacturerNftInstance: ManufacturerNft;

  const [admin, nonAdmin, controller1, nonController] = provider.getWallets();

  before(async () => {
    [dimoRegistryInstance, nodesInstance, manufacturerInstance] =
      await initialize(admin, 'Nodes', 'Manufacturer');

    const ManufacturerNftFactory = await ethers.getContractFactory(
      'ManufacturerNft'
    );
    manufacturerNftInstance = await upgrades.deployProxy(
      ManufacturerNftFactory,
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
    ) as ManufacturerNft;
    await manufacturerNftInstance.deployed();

    const MINTER_ROLE = await manufacturerNftInstance.MINTER_ROLE();
    await manufacturerNftInstance
      .connect(admin)
      .grantRole(MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxy
    await manufacturerInstance
      .connect(admin)
      .setManufacturerNftProxyAddress(manufacturerNftInstance.address);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttributeName);
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

  describe('setManufacturerNftProxyAddress', () => {
    let localManufacturerInstance: Manufacturer;
    beforeEach(async () => {
      [, localManufacturerInstance] = await initialize(admin, 'Manufacturer');
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localManufacturerInstance
            .connect(nonAdmin)
            .setManufacturerNftProxyAddress(manufacturerNftInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localManufacturerInstance
            .connect(admin)
            .setManufacturerNftProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerNftProxySet event with correct params', async () => {
        await expect(
          localManufacturerInstance
            .connect(admin)
            .setManufacturerNftProxyAddress(manufacturerNftInstance.address)
        )
          .to.emit(localManufacturerInstance, 'ManufacturerNftProxySet')
          .withArgs(manufacturerNftInstance.address);
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
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
            .setController(controller1.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
          .setController(controller1.address);

        await expect(
          manufacturerInstance.connect(admin).setController(controller1.address)
        ).to.be.revertedWith('Already a controller');
      });
    });

    context('Events', () => {
      it('Should emit ControllerSet event with correct params', async () => {
        await expect(
          manufacturerInstance.connect(admin).setController(controller1.address)
        )
          .to.emit(manufacturerInstance, 'ControllerSet')
          .withArgs(controller1.address);
      });
    });
  });

  describe('mintManufacturerBatch', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .mintManufacturerBatch(nonAdmin.address, C.mockManufacturerNames)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
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
    });

    context('State change', () => {
      it('Should correctly set parent node', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturerBatch(admin.address, C.mockManufacturerNames);

        const parentNode1 = await nodesInstance.getParentNode(
          manufacturerNftInstance.address,
          1
        );
        const parentNode2 = await nodesInstance.getParentNode(
          manufacturerNftInstance.address,
          2
        );
        const parentNode3 = await nodesInstance.getParentNode(
          manufacturerNftInstance.address,
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

        const nodeOwner1 = await manufacturerNftInstance.ownerOf(1);
        const nodeOwner2 = await manufacturerNftInstance.ownerOf(2);
        const nodeOwner3 = await manufacturerNftInstance.ownerOf(3);

        expect(nodeOwner1).to.be.equal(admin.address);
        expect(nodeOwner2).to.be.equal(admin.address);
        expect(nodeOwner3).to.be.equal(admin.address);
      });
      it('Should correctly set names', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturerBatch(admin.address, C.mockManufacturerNames);

        const nameAttribute1 = await nodesInstance.getInfo(
          manufacturerNftInstance.address,
          1,
          C.mockManufacturerAttributeName
        );
        const nameAttribute2 = await nodesInstance.getInfo(
          manufacturerNftInstance.address,
          2,
          C.mockManufacturerAttributeName
        );
        const nameAttribute3 = await nodesInstance.getInfo(
          manufacturerNftInstance.address,
          3,
          C.mockManufacturerAttributeName
        );

        expect([nameAttribute1, nameAttribute2, nameAttribute3]).to.eql(
          C.mockManufacturerNames
        );
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
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .mintManufacturer(
              nonController.address,
              C.mockManufacturerAttributeInfoPairs
            )
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if controller has already minted a manufacturer', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            controller1.address,
            C.mockManufacturerAttributeInfoPairs
          );

        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturer(
              controller1.address,
              C.mockManufacturerAttributeInfoPairs
            )
        ).to.be.revertedWith('Invalid request');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .mintManufacturer(
              controller1.address,
              C.mockManufacturerAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State change', () => {
      it('Should correctly set owner as controller', async () => {
        const isControllerBefore: boolean =
          await manufacturerInstance.isController(controller1.address);
        // eslint-disable-next-line no-unused-expressions
        expect(isControllerBefore).to.be.false;

        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            controller1.address,
            C.mockManufacturerAttributeInfoPairs
          );

        const isControllerAfter: boolean =
          await manufacturerInstance.isController(controller1.address);
        // eslint-disable-next-line no-unused-expressions
        expect(isControllerAfter).to.be.true;
      });
      it('Should correctly set parent node', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            controller1.address,
            C.mockManufacturerAttributeInfoPairs
          );

        const parentNode = await nodesInstance.getParentNode(
          manufacturerNftInstance.address,
          1
        );

        // Assure it does not have parent
        expect(parentNode).to.be.equal(0);
      });
      it('Should correctly set node owner', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            controller1.address,
            C.mockManufacturerAttributeInfoPairs
          );

        expect(await manufacturerNftInstance.ownerOf(1)).to.be.equal(
          controller1.address
        );
      });
      it('Should correctly set manufacturerMinted', async () => {
        const isManufacturerMintedBefore =
          await manufacturerInstance.isManufacturerMinted(controller1.address);

        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedBefore).to.be.false;

        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            controller1.address,
            C.mockManufacturerAttributeInfoPairs
          );

        const isManufacturerMintedAfter =
          await manufacturerInstance.isManufacturerMinted(controller1.address);

        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedAfter).to.be.true;
      });
      it('Should correctly set infos', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            controller1.address,
            C.mockManufacturerAttributeInfoPairs
          );

        expect(
          await nodesInstance.getInfo(
            manufacturerNftInstance.address,
            1,
            C.mockManufacturerAttribute1
          )
        ).to.be.equal(C.mockManufacturerInfo1);
        expect(
          await nodesInstance.getInfo(
            manufacturerNftInstance.address,
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
              controller1.address,
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
            .mintManufacturer(controller1.address, C.mockManufacturerAttributeInfoPairs)
        )
          .to.emit(manufacturerInstance, 'ManufacturerAttributeSet')
          .withArgs(1, C.mockManufacturerAttributeInfoPairs[0].attribute, C.mockManufacturerAttributeInfoPairs[0].info)
          .to.emit(manufacturerInstance, 'ManufacturerAttributeSet')
          .withArgs(1, C.mockManufacturerAttributeInfoPairs[1].attribute, C.mockManufacturerAttributeInfoPairs[1].info);
      });
    });
  });

  describe('setManufacturerInfo', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          controller1.address,
          C.mockManufacturerAttributeInfoPairs
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          manufacturerInstance
            .connect(nonAdmin)
            .setManufacturerInfo(1, C.mockManufacturerAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      // TODO
      it.skip('Should revert if node is not a manufacturer', async () => {
        await expect(
          manufacturerInstance
            .connect(admin)
            .setManufacturerInfo(99, C.mockManufacturerAttributeInfoPairs)
        ).to.be.revertedWith('Node must be a manufacturer');
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

    context('State change', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockManufacturerAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            manufacturerNftInstance.address,
            1,
            C.mockManufacturerAttribute1
          )
        ).to.be.equal(C.mockManufacturerInfo1);
        expect(
          await nodesInstance.getInfo(
            manufacturerNftInstance.address,
            1,
            C.mockManufacturerAttribute2
          )
        ).to.be.equal(C.mockManufacturerInfo2);

        await manufacturerInstance
          .connect(admin)
          .setManufacturerInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            manufacturerNftInstance.address,
            1,
            C.mockManufacturerAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            manufacturerNftInstance.address,
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
          .withArgs(1, localNewAttributeInfoPairs[0].attribute, localNewAttributeInfoPairs[0].info)
          .to.emit(manufacturerInstance, 'ManufacturerAttributeSet')
          .withArgs(1, localNewAttributeInfoPairs[1].attribute, localNewAttributeInfoPairs[1].info);
      });
    });
  });
});
