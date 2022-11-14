import chai from 'chai';
import { waffle } from 'hardhat';

import { DIMORegistry, Metadata, Manufacturer } from '../typechain';
import { initialize, createSnapshot, revertToSnapshot, C } from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Metadata', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let metadataInstance: Metadata;
  let manufacturerInstance: Manufacturer;

  const [admin, nonAdmin] = provider.getWallets();

  before(async () => {
    [dimoRegistryInstance, metadataInstance, manufacturerInstance] =
      await initialize(
        admin,
        [C.name, C.symbol, ''],
        'Metadata',
        'Manufacturer'
      );
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setBaseURI', async () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          metadataInstance.connect(nonAdmin).setBaseURI(C.baseURI)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
    });

    context('State change', () => {
      it('Should correctly set baseURI', async () => {
        await metadataInstance.connect(admin).setBaseURI(C.baseURI);

        expect(await metadataInstance.baseURI()).to.equal(C.baseURI);
      });
    });
  });

  describe('setTokenURI', async () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          metadataInstance.connect(nonAdmin).setTokenURI(1, C.mockTokenURI)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if tokenId does not exist', async () => {
        await expect(
          metadataInstance.connect(admin).setTokenURI(0, C.mockTokenURI)
        ).to.be.revertedWith('NFT does not exist');
      });
    });

    context('State change', () => {
      it('Should correctly set tokenURI', async () => {
        await manufacturerInstance
          .connect(admin)
          .mintManufacturer(admin.address, [], []);

        await metadataInstance.connect(admin).setTokenURI(1, C.mockTokenURI);

        expect(await dimoRegistryInstance.tokenURI(1)).to.be.equal(
          C.mockTokenURI
        );
      });
    });
  });

  describe('tokenURI', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(admin.address, [], []);
    });

    context('Error handling', () => {
      it('Should revert if token id does not exist', async () => {
        // It should revert with 'NFT does not exist', but it actually reverts with 'Error: missing revert data in call exception'
        // It seems to be an ethers bug https://github.com/ethers-io/ethers.js/discussions/2849
        await expect(dimoRegistryInstance.tokenURI(0)).to.be.reverted;
      });
    });

    it('Should return empty string if baseURI and tokenIdURI are not set', async () => {
      expect(await dimoRegistryInstance.tokenURI(1)).to.equal('');
    });
    it('Should return token id if baseURI is not set', async () => {
      await metadataInstance.connect(admin).setTokenURI(1, C.mockTokenURI);

      expect(await dimoRegistryInstance.tokenURI(1)).to.equal(C.mockTokenURI);
    });
    it('Should return baseURI + tokenIdURI if set', async () => {
      await metadataInstance.setBaseURI(C.baseURI);
      await metadataInstance.connect(admin).setTokenURI(1, C.mockTokenURI);

      expect(await dimoRegistryInstance.tokenURI(1)).to.equal(
        C.baseURI + C.mockTokenURI
      );
    });
    it('Should return baseURI + tokenId if tokenIdURI is not set', async () => {
      await metadataInstance.setBaseURI(C.baseURI);

      expect(await dimoRegistryInstance.tokenURI(1)).to.equal(C.baseURI + '1');
    });
  });
});
