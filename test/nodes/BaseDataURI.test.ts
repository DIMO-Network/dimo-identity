import chai from 'chai';
import { waffle } from 'hardhat';

import { BaseDataURI } from '../../typechain';
import { setup, createSnapshot, revertToSnapshot, C } from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('BaseDataURI', async function () {
  let snapshot: string;
  let baseDataUriInstance: BaseDataURI;

  const [admin, nonAdmin, mockProxy] = provider.getWallets();

  before(async () => {
    const deployments = await setup(admin, {
      modules: ['BaseDataURI'],
      nfts: [],
      upgradeableContracts: []
    });

    baseDataUriInstance = deployments.BaseDataURI;
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setBaseDataURI', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          baseDataUriInstance
            .connect(nonAdmin)
            .setBaseDataURI(mockProxy.address, C.BASE_DATA_URI)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
    });

    context('Events', () => {
      it('Should emit BaseDataURISet event with correct params', async () => {
        await expect(
          baseDataUriInstance
            .connect(admin)
            .setBaseDataURI(mockProxy.address, C.BASE_DATA_URI)
        )
          .to.emit(baseDataUriInstance, 'BaseDataURISet')
          .withArgs(mockProxy.address, C.BASE_DATA_URI);
      });
    });
  });
});
