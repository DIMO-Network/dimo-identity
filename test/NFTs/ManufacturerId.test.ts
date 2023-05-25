import chai from 'chai';
import { waffle } from 'hardhat';

import {
  DIMORegistry,
  Nodes,
  Manufacturer,
  ManufacturerId
} from '../../typechain';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('ManufacturerId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let manufacturerIdInstance: ManufacturerId;

  const [admin, manufacturer1, manufacturer2] = provider.getWallets();

  before(async () => {
    [
      dimoRegistryInstance,
      nodesInstance,
      manufacturerInstance,
      manufacturerIdInstance
    ] = await setup(admin, {
      modules: ['Nodes', 'Manufacturer'],
      nfts: ['ManufacturerId']
    });

    const MINTER_ROLE = await manufacturerIdInstance.MINTER_ROLE();
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(MINTER_ROLE, dimoRegistryInstance.address);

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

    // Setting DIMORegistry address
    await manufacturerIdInstance.setDimoRegistryAddress(
      dimoRegistryInstance.address
    );

    await manufacturerInstance
      .connect(admin)
      .mintManufacturerBatch(admin.address, C.mockManufacturerNames);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setDimoRegistryAddress', () => {
    it('Should revert if addr is zero address', async () => {
      await expect(
        manufacturerIdInstance
          .connect(admin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith('Non zero address');
    });
  });

  context('On transfer', async () => {
    context('Error handling', () => {
      it('Should revert if the new owner is not a controller', async () => {
        await expect(
          manufacturerIdInstance
            .connect(admin)
            ['safeTransferFrom(address,address,uint256)'](
              admin.address,
              manufacturer1.address,
              1
            )
        ).to.be.revertedWith('Address is not allowed to own a new token');
      });
      it('Should revert if the new owner has already minted', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(
            manufacturer1.address,
            'New name',
            C.mockManufacturerAttributeInfoPairs
          );

        await expect(
          manufacturerIdInstance
            .connect(admin)
            ['safeTransferFrom(address,address,uint256)'](
              admin.address,
              manufacturer1.address,
              1
            )
        ).to.be.revertedWith('Address is not allowed to own a new token');
      });
      it('Should revert if caller does not have transferer role', async () => {
        await manufacturerIdInstance
          .connect(admin)
          .renounceRole(C.NFT_TRANSFERER_ROLE, admin.address);
        await manufacturerInstance
          .connect(admin)
          .setController(manufacturer1.address);

        await expect(
          manufacturerIdInstance
            .connect(admin)
            ['safeTransferFrom(address,address,uint256)'](
              admin.address,
              manufacturer1.address,
              1
            )
        ).to.be.revertedWith(
          `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
            C.NFT_TRANSFERER_ROLE
          }`
        );
      });
    });

    context('State', () => {
      beforeEach(async () => {
        await manufacturerInstance
          .connect(admin)
          .setController(manufacturer1.address);
        await manufacturerInstance
          .connect(admin)
          .setManufacturerInfo(1, C.mockManufacturerAttributeInfoPairs);
      });

      it('Should keep parent node as 0', async () => {
        expect(
          await nodesInstance.getParentNode(manufacturerInstance.address, 1)
        ).to.equal(0);

        await manufacturerIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            manufacturer1.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(manufacturerInstance.address, 1)
        ).to.equal(0);
      });
      it('Should set new owner', async () => {
        expect(await manufacturerIdInstance.ownerOf(1)).to.equal(admin.address);

        await manufacturerIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            manufacturer1.address,
            1
          );

        expect(await manufacturerIdInstance.ownerOf(1)).to.equal(
          manufacturer1.address
        );
      });
      it('Should keep the same name', async () => {
        expect(
          await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[0]
          )
        ).to.equal(1);

        await manufacturerIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            manufacturer1.address,
            1
          );

        expect(
          await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[0]
          )
        ).to.equal(1);
      });
      it('Should keep the same infos', async () => {
        for (const attrInfoPair of C.mockManufacturerAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              manufacturerIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }

        await manufacturerIdInstance
          .connect(admin)
          ['safeTransferFrom(address,address,uint256)'](
            admin.address,
            manufacturer1.address,
            1
          );

        for (const attrInfoPair of C.mockManufacturerAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              manufacturerIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should correctly set manufacturerMinted', async () => {
        await manufacturerIdInstance.grantRole(
          C.NFT_TRANSFERER_ROLE,
          manufacturer1.address
        );
        await manufacturerInstance.setController(manufacturer2.address);
        await manufacturerInstance.mintManufacturer(
          manufacturer1.address,
          'Manufacturer4',
          []
        );

        const isManufacturerMintedBefore1 =
          await manufacturerInstance.isManufacturerMinted(
            manufacturer1.address
          );
        const isManufacturerMintedBefore2 =
          await manufacturerInstance.isManufacturerMinted(
            manufacturer2.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedBefore1).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedBefore2).to.be.false;

        await manufacturerIdInstance
          .connect(manufacturer1)
          ['safeTransferFrom(address,address,uint256)'](
            manufacturer1.address,
            manufacturer2.address,
            4
          );

        const isManufacturerMintedAfter1 =
          await manufacturerInstance.isManufacturerMinted(
            manufacturer1.address
          );
        const isManufacturerMintedAfter2 =
          await manufacturerInstance.isManufacturerMinted(
            manufacturer2.address
          );

        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedAfter1).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(isManufacturerMintedAfter2).to.be.true;
      });
    });
  });
});
