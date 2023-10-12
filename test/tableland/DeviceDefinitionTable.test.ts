import chai from 'chai';
import { ethers, network, HardhatEthersSigner } from 'hardhat';

import { LocalTableland, getAccounts, getDatabase, getValidator, getRegistry } from '@tableland/local';
import { Database, Validator, Registry } from '@tableland/sdk';

import {
  DimoAccessControl,
  Manufacturer,
  ManufacturerId,
  DeviceDefinitionTable,
} from '../../typechain-types';
import { setup, createSnapshot, revertToSnapshot, grantAdminRoles, C } from '../../utils';

const { expect } = chai;

const lt = new LocalTableland({
  silent: true,
});

before(async function () {
  lt.start();
  await lt.isReady();
});

after(async function () {
  await lt.shutdown();
});

const accounts = getAccounts();

describe.only('DeviceDefinitionTable', async function () {
  let CURRENT_CHAIN_ID: number;
  let snapshot: string;
  let tablelandDb: Database;
  let tablelandValidator: Validator;
  let tablelandRegistry: Registry;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let manufacturerIdInstance: ManufacturerId;
  let ddTableInstance: DeviceDefinitionTable;

  let DIMO_REGISTRY_ADDRESS: string;
  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let insertAuthorized: HardhatEthersSigner;
  let unauthorized: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let manufacturer2: HardhatEthersSigner;
  let manufacturer3: HardhatEthersSigner;

  before(async () => {
    CURRENT_CHAIN_ID = network.config.chainId ?? 31337;
    [
      admin,
      nonAdmin,
      insertAuthorized,
      unauthorized,
      manufacturer1,
      manufacturer2,
      manufacturer3
    ] = await ethers.getSigners();

    tablelandDb = getDatabase(accounts[0]);
    tablelandValidator = getValidator(tablelandDb.config.baseUrl);
    tablelandRegistry = getRegistry(accounts[0]);

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'Manufacturer', 'DeviceDefinitionTable'],
      nfts: ['ManufacturerId'],
      upgradeableContracts: [],
    });

    DIMO_REGISTRY_ADDRESS = await deployments.DIMORegistry.getAddress();
    dimoAccessControlInstance = deployments.DimoAccessControl;
    ddTableInstance = deployments.DeviceDefinitionTable;
    manufacturerInstance = deployments.Manufacturer;
    manufacturerIdInstance = deployments.ManufacturerId;

    await grantAdminRoles(admin, dimoAccessControlInstance);

    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.INSERT_DEVICE_DEFINITION_ROLE, insertAuthorized.address);

    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await manufacturerInstance.getAddress());

    // Set NFT Proxy
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

    // Setting DIMORegistry address
    await manufacturerIdInstance.setDimoRegistryAddress(
      await manufacturerInstance.getAddress(),
    );

    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(manufacturer1.address, C.mockManufacturerNames[0], []);
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(manufacturer2.address, C.mockManufacturerNames[1], []);
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(manufacturer3.address, C.mockManufacturerNames[2], []);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
    await lt.restartValidator();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('createDeviceDefinitionTable', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          ddTableInstance
            .connect(nonAdmin)
            .createDeviceDefinitionTable(1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`,
        );
      });
      it('Should revert if manufacturer ID does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(99)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'InvalidManufacturerId',
        ).withArgs(99);
      });
      it('Should revert if Device Definition table already exists', async () => {
        await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(1);

        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableAlreadyExists',
        ).withArgs(1);
      });
    });

    context('State', () => {
      it('Should create register a new table to a manufacturer', async () => {
        expect(await tablelandRegistry.listTables(DIMO_REGISTRY_ADDRESS)).to.be.empty;

        await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(1);

        expect(await tablelandRegistry.listTables(DIMO_REGISTRY_ADDRESS))
          .to.deep.include.members([{ tableId: '2', chainId: CURRENT_CHAIN_ID }]);
      });
      it('Should correctly map the manufacturer ID to the new table created', async () => {
        expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(0);

        await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(1);

        expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(2);
      });
    });

    context('Events', () => {
      it('Should emit DeviceDefinitionTableCreated event with correct params', async () => {
        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(1)
        )
          .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
          .withArgs(1, 2);
      });
    });
  });

  describe('insertDeviceDefinition', () => {
    beforeEach(async () => {
      const tx = await ddTableInstance
        .connect(admin)
        .createDeviceDefinitionTable(1);

      await tablelandValidator.pollForReceiptByTransactionHash({
        chainId: CURRENT_CHAIN_ID,
        transactionHash: (await tx.wait())?.hash as string,
      });
    });

    context('Error handling', () => {
      it('Should revert if Device Definition table does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(manufacturer1)
            .insertDeviceDefinition(99, C.mockDdModel1, C.mockDdYear1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableDoesNotExist',
        ).withArgs(99);
      });
      it('Should revert if caller is not the manufacturer ID owner or has the INSERT_DEVICE_DEFINITION_ROLE', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .insertDeviceDefinition(1, C.mockDdModel1, C.mockDdYear1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized'
        ).withArgs(2, unauthorized.address);
      });
    });

    context('Manufacturer as caller', () => {
      context('State', () => {
        it('Should correctly insert DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(manufacturer1)
            .insertDeviceDefinition(1, C.mockDdModel1, C.mockDdYear1);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([1]);

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = 1`
          ).first();

          expect(selectQuery).to.deep.include({
            id: 1,
            model: C.mockDdModel1,
            year: C.mockDdYear1
          });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionInserted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(manufacturer1)
              .insertDeviceDefinition(1, C.mockDdModel1, C.mockDdYear1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(1, 1, C.mockDdModel1, C.mockDdYear1);
        });
      });
    });

    context('Insert role holder as caller', () => {
      context('State', () => {
        it('Should correctly insert DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(insertAuthorized)
            .insertDeviceDefinition(1, C.mockDdModel1, C.mockDdYear1);
          console.log('here')

          console.log(await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          }));
          console.log('here')

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');
          console.log('here')

          expect(count).to.deep.equal([1]);

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = 1`
          ).first();
          console.log('here')

          expect(selectQuery).to.deep.include({
            id: 1,
            model: C.mockDdModel1,
            year: C.mockDdYear1
          });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionInserted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(insertAuthorized)
              .insertDeviceDefinition(1, C.mockDdModel1, C.mockDdYear1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(1, 1, C.mockDdModel1, C.mockDdYear1);
        });
      });
    });
  });


  describe('insertDeviceDefinitionBatch', () => {
    beforeEach(async () => {
      const tx = await ddTableInstance
        .connect(admin)
        .createDeviceDefinitionTable(1);

      await tablelandValidator.pollForReceiptByTransactionHash({
        chainId: CURRENT_CHAIN_ID,
        transactionHash: (await tx.wait())?.hash as string,
      });
    });

    context('Error handling', () => {
      it('Should revert if Device Definition table does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(manufacturer1)
            .insertDeviceDefinitionBatch(99, C.mockDdInputBatch)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableDoesNotExist',
        ).withArgs(99);
      });
      it('Should revert if caller is not the manufacturer ID owner or has the INSERT_DEVICE_DEFINITION_ROLE', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .insertDeviceDefinitionBatch(1, C.mockDdInputBatch)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized'
        ).withArgs(2, unauthorized.address);
      });
    });

    context('Manufacturer as caller', () => {
      context('State', () => {
        it('Should correctly insert DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(manufacturer1)
            .insertDeviceDefinitionBatch(1, C.mockDdInputBatch);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([3]);

          // const selectQuery = await tablelandDb.prepare(
          //   `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = 1`
          // ).first();

          // expect(selectQuery).to.deep.include({
          //   id: 1,
          //   model: C.mockDdModel1,
          //   year: C.mockDdYear1
          // });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionInserted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(manufacturer1)
              .insertDeviceDefinitionBatch(1, C.mockDdInputBatch)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(0, 1, C.mockDdModel1, C.mockDdYear1)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(0, 1, C.mockDdModel2, C.mockDdYear2)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(0, 1, C.mockDdModel3, C.mockDdYear3);
        });
      });
    });

    context('Insert role holder as caller', () => {
      context('State', () => {
        it('Should correctly insert DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(insertAuthorized)
            .insertDeviceDefinitionBatch(1, C.mockDdInputBatch);
          console.log('here')

          console.log(await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          }));
          console.log('here')

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');
          console.log('here')

          expect(count).to.deep.equal([3]);

          // const selectQuery = await tablelandDb.prepare(
          //   `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = 1`
          // ).first();
          // console.log('here')

          // expect(selectQuery).to.deep.include({
          //   id: 1,
          //   model: C.mockDdModel1,
          //   year: C.mockDdYear1
          // });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionInserted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(insertAuthorized)
              .insertDeviceDefinitionBatch(1, C.mockDdInputBatch)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(0, 1, C.mockDdModel1, C.mockDdYear1)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(0, 1, C.mockDdModel2, C.mockDdYear2)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(0, 1, C.mockDdModel3, C.mockDdYear3);
        });
      });
    });
  });

  describe('getDeviceDefinitionTableName', () => {
    context('State', () => {
      it('Should return empty string if there is no table minted to the manufacturer', async () => {
        expect(await ddTableInstance.getDeviceDefinitionTableName(99)).to.equal('');
      });
      it('Should correctly return the table name', async () => {
        await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(1);

        expect(await ddTableInstance.getDeviceDefinitionTableName(1))
          .to.equal(`${C.mockManufacturerNames[0]}_${CURRENT_CHAIN_ID}_2`);
      });
    });
  });
});
