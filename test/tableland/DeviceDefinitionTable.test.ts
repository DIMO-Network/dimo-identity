import chai from 'chai';
import { ethers, network } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { time } from '@nomicfoundation/hardhat-network-helpers';

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

describe('DeviceDefinitionTable', async function () {
  let CURRENT_CHAIN_ID: number;
  let snapshot: string;
  let tablelandDb: Database;
  let tablelandValidator: Validator;
  let tablelandRegistry: Registry;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let manufacturerIdInstance: ManufacturerId;
  let ddTableInstance: DeviceDefinitionTable;
  let expiresAtDefault: number;

  let admin: HardhatEthersSigner;
  let unauthorized: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let manufacturer2: HardhatEthersSigner;
  let manufacturer3: HardhatEthersSigner;
  let manufacturerAdmin: HardhatEthersSigner;
  let privilegedUser1: HardhatEthersSigner;

  before(async () => {
    CURRENT_CHAIN_ID = network.config.chainId ?? 31337;
    [
      admin,
      unauthorized,
      manufacturer1,
      manufacturer2,
      manufacturer3,
      manufacturerAdmin,
      privilegedUser1
    ] = await ethers.getSigners();

    tablelandDb = getDatabase(accounts[0]) as unknown as Database;
    tablelandValidator = getValidator(tablelandDb.config.baseUrl);
    tablelandRegistry = getRegistry(accounts[0]) as unknown as Registry;

    const deployments = await setup(admin, {
      modules: [
        'DimoAccessControl',
        'Manufacturer',
        'DeviceDefinitionTable',
        'ERC721Holder',
        'DeviceDefinitionController'
      ],
      nfts: ['ManufacturerId'],
      upgradeableContracts: [],
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    ddTableInstance = deployments.DeviceDefinitionTable;
    manufacturerInstance = deployments.Manufacturer;
    manufacturerIdInstance = deployments.ManufacturerId;

    expiresAtDefault = (await time.latest()) + 31556926; // + 1 year

    await grantAdminRoles(admin, dimoAccessControlInstance);

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

    // Minting manufacturer nodes
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(manufacturer1.address, C.mockManufacturerNames[0], []);
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(manufacturer2.address, C.mockManufacturerNames[1], []);
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(manufacturer3.address, C.mockManufacturerNames[2], []);

    // Setting Manufacturer Privileges
    await manufacturerIdInstance
      .connect(admin)
      .createPrivilege(true, 'Minter');
    await manufacturerIdInstance
      .connect(admin)
      .createPrivilege(true, 'Claimer');
    await manufacturerIdInstance
      .connect(admin)
      .createPrivilege(true, 'Manufacturer Factory Reset');
    await manufacturerIdInstance
      .connect(admin)
      .createPrivilege(true, 'Manufacturer Reprovision');
    await manufacturerIdInstance
      .connect(admin)
      .createPrivilege(true, 'Device Definition Inserter');
    await manufacturerIdInstance
      .connect(manufacturer1)
      .setPrivilege(
        1,
        C.MANUFACTURER_INSERT_DD_PRIVILEGE,
        privilegedUser1.address,
        expiresAtDefault,
      );
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
      it('Should revert if manufacturer ID does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(manufacturer1.address, 99)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'InvalidManufacturerId',
        ).withArgs(99);
      });
      it('Should revert if caller does not have ADMIN_ROLE or it is not he manufacturer ID owner', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .createDeviceDefinitionTable(manufacturer1.address, 1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized',
        ).withArgs(unauthorized.address);
      });
      it('Should revert if Device Definition table already exists', async () => {
        await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(manufacturer1.address, 1);

        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(manufacturer1.address, 1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableAlreadyExists',
        ).withArgs(1);
      });
    });

    context('Admin as caller', () => {
      context('State', () => {
        it('Should create a new table to a manufacturer', async () => {
          expect(await tablelandRegistry.listTables(manufacturer1.address)).to.be.empty;

          await ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(manufacturer1.address, 1);

          expect(await tablelandRegistry.listTables(manufacturer1.address))
            .to.deep.include.members([{ tableId: '2', chainId: CURRENT_CHAIN_ID }]);
        });
        it('Should correctly map the manufacturer ID to the new table created', async () => {
          expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(0);

          await ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(manufacturer1.address, 1);

          expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(2);
        });
        it('Should set DIMO Registry as controller', async () => {
          await ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(manufacturer1.address, 1);

          const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(1);

          expect(await tablelandRegistry.getController(ddTableName)).to.equal(await ddTableInstance.getAddress());
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionTableCreated event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(admin)
              .createDeviceDefinitionTable(manufacturer1.address, 1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(manufacturer1.address, 1, 2);
        });
      });
    });

    context('Manufacturer as caller', () => {
      context('State', () => {
        it('Should create a new table to a manufacturer', async () => {
          expect(await tablelandRegistry.listTables(manufacturer1.address)).to.be.empty;

          await ddTableInstance
            .connect(manufacturer1)
            .createDeviceDefinitionTable(manufacturer1.address, 1);

          expect(await tablelandRegistry.listTables(manufacturer1.address))
            .to.deep.include.members([{ tableId: '2', chainId: CURRENT_CHAIN_ID }]);
        });
        it('Should correctly map the manufacturer ID to the new table created', async () => {
          expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(0);

          await ddTableInstance
            .connect(manufacturer1)
            .createDeviceDefinitionTable(manufacturer1.address, 1);

          expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(2);
        });
        it('Should set DIMO Registry as controller', async () => {
          await ddTableInstance
            .connect(manufacturer1)
            .createDeviceDefinitionTable(manufacturer1.address, 1);

          const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(1);

          expect(await tablelandRegistry.getController(ddTableName)).to.equal(await ddTableInstance.getAddress());
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionTableCreated event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(manufacturer1)
              .createDeviceDefinitionTable(manufacturer1.address, 1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(manufacturer1.address, 1, 2);
        });
      });
    });
  });

  describe('createDeviceDefinitionTableBatch', () => {
    context('Error handling', () => {
      it('Should revert if a manufacturer ID does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTableBatch(admin.address, [1, 2, 99])
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'InvalidManufacturerId',
        ).withArgs(99);
      });
      it('Should revert if caller does not have ADMIN_ROLE or it is not he manufacturer ID owner', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .createDeviceDefinitionTableBatch(admin.address, [1, 2, 3])
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized',
        ).withArgs(unauthorized.address);
      });
      it('Should revert if Device Definition table already exists', async () => {
        await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(manufacturer1.address, 1);

        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTableBatch(admin.address, [1, 2, 3])
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableAlreadyExists',
        ).withArgs(1);
      });
    });

    context('Admin as caller', () => {
      context('State', () => {
        it('Should create a new table for each manufacturer ID to the admin', async () => {
          expect(await tablelandRegistry.listTables(manufacturer1.address)).to.be.empty;

          await ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTableBatch(admin.address, [1, 2, 3]);

          expect(await tablelandRegistry.listTables(admin.address))
            .to.deep.include.members([{ tableId: '2', chainId: CURRENT_CHAIN_ID }]);
          expect(await tablelandRegistry.listTables(admin.address))
            .to.deep.include.members([{ tableId: '3', chainId: CURRENT_CHAIN_ID }]);
          expect(await tablelandRegistry.listTables(admin.address))
            .to.deep.include.members([{ tableId: '4', chainId: CURRENT_CHAIN_ID }]);
        });
        it('Should correctly map each manufacturer ID to the corresponding table created', async () => {
          expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(0);
          expect(await ddTableInstance.getDeviceDefinitionTableId(2)).to.equal(0);
          expect(await ddTableInstance.getDeviceDefinitionTableId(3)).to.equal(0);

          await ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTableBatch(admin.address, [1, 2, 3]);

          expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.equal(2);
          expect(await ddTableInstance.getDeviceDefinitionTableId(2)).to.equal(3);
          expect(await ddTableInstance.getDeviceDefinitionTableId(3)).to.equal(4);
        });
        it('Should set DIMO Registry as controller', async () => {
          await ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTableBatch(admin.address, [1, 2, 3]);

          const ddTableName1 = await ddTableInstance.getDeviceDefinitionTableName(1);
          const ddTableName2 = await ddTableInstance.getDeviceDefinitionTableName(2);
          const ddTableName3 = await ddTableInstance.getDeviceDefinitionTableName(3);

          expect(await tablelandRegistry.getController(ddTableName1)).to.equal(await ddTableInstance.getAddress());
          expect(await tablelandRegistry.getController(ddTableName2)).to.equal(await ddTableInstance.getAddress());
          expect(await tablelandRegistry.getController(ddTableName3)).to.equal(await ddTableInstance.getAddress());
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionTableCreated event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(admin)
              .createDeviceDefinitionTableBatch(admin.address, [1, 2, 3])
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(admin.address, 1, 2)
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(admin.address, 2, 3)
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(admin.address, 3, 4);
        });
      });
    });

    context('Manufacturer as caller', () => {
      beforeEach(async () => {
        await dimoAccessControlInstance
          .connect(admin)
          .grantRole(C.ADMIN_ROLE, manufacturerAdmin.address);

        // Minting new mock manufacturer nodes
        await manufacturerInstance
          .connect(admin)
          .mintManufacturerBatch(
            manufacturerAdmin.address,
            [
              'mockAdminManuf1',
              'mockAdminManuf2',
              'mockAdminManuf3'
            ]
          );
      });

      context('State', () => {
        it('Should create a new table for each manufacturer Id to the manufacturerAdmin', async () => {
          expect(await tablelandRegistry.listTables(manufacturerAdmin.address)).to.be.empty;

          await ddTableInstance
            .connect(manufacturerAdmin)
            .createDeviceDefinitionTableBatch(manufacturerAdmin.address, [4, 5, 6]);

          expect(await tablelandRegistry.listTables(manufacturerAdmin.address))
            .to.deep.include.members([{ tableId: '2', chainId: CURRENT_CHAIN_ID }]);
          expect(await tablelandRegistry.listTables(manufacturerAdmin.address))
            .to.deep.include.members([{ tableId: '3', chainId: CURRENT_CHAIN_ID }]);
          expect(await tablelandRegistry.listTables(manufacturerAdmin.address))
            .to.deep.include.members([{ tableId: '4', chainId: CURRENT_CHAIN_ID }]);
        });
        it('Should correctly map each manufacturer ID to the corresponding table created', async () => {
          expect(await ddTableInstance.getDeviceDefinitionTableId(4)).to.equal(0);
          expect(await ddTableInstance.getDeviceDefinitionTableId(5)).to.equal(0);
          expect(await ddTableInstance.getDeviceDefinitionTableId(6)).to.equal(0);

          await ddTableInstance
            .connect(manufacturerAdmin)
            .createDeviceDefinitionTableBatch(manufacturerAdmin.address, [4, 5, 6]);

          expect(await ddTableInstance.getDeviceDefinitionTableId(4)).to.equal(2);
          expect(await ddTableInstance.getDeviceDefinitionTableId(5)).to.equal(3);
          expect(await ddTableInstance.getDeviceDefinitionTableId(6)).to.equal(4);
        });
        it('Should set DIMO Registry as controller', async () => {
          await ddTableInstance
            .connect(manufacturerAdmin)
            .createDeviceDefinitionTableBatch(manufacturerAdmin.address, [1, 2, 3]);

          const ddTableName1 = await ddTableInstance.getDeviceDefinitionTableName(1);
          const ddTableName2 = await ddTableInstance.getDeviceDefinitionTableName(2);
          const ddTableName3 = await ddTableInstance.getDeviceDefinitionTableName(3);

          expect(await tablelandRegistry.getController(ddTableName1)).to.equal(await ddTableInstance.getAddress());
          expect(await tablelandRegistry.getController(ddTableName2)).to.equal(await ddTableInstance.getAddress());
          expect(await tablelandRegistry.getController(ddTableName3)).to.equal(await ddTableInstance.getAddress());
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionTableCreated event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(manufacturerAdmin)
              .createDeviceDefinitionTableBatch(manufacturerAdmin.address, [4, 5, 6])
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(manufacturerAdmin.address, 4, 2)
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(manufacturerAdmin.address, 5, 3)
            .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
            .withArgs(manufacturerAdmin.address, 6, 4);
        });
      });
    });
  });

  describe('setDeviceDefinitionTable', () => {
    beforeEach(async () => {
      const tx = await ddTableInstance
        .connect(admin)
        .createDeviceDefinitionTable(manufacturer1.address, 1);

      await tablelandValidator.pollForReceiptByTransactionHash({
        chainId: CURRENT_CHAIN_ID,
        transactionHash: (await tx.wait())?.hash as string,
      });
    });

    context('Error handling', () => {
      it('Should revert if manufacturer ID does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(admin)
            .setDeviceDefinitionTable(99, 2)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'InvalidManufacturerId',
        ).withArgs(99);
      });
      it('Should revert if Device Definition table does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(manufacturer1)
            .setDeviceDefinitionTable(1, 99)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableDoesNotExist',
        );
      });
      it('Should revert if caller is not the manufacturer ID owner', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .setDeviceDefinitionTable(1, 2)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized'
        ).withArgs(unauthorized.address);
      });
    });

    context('State', () => {
      it('Should correctly set the Device Definition table', async () => {
        let tx = await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(manufacturer2.address, 2);
        await tablelandValidator.pollForReceiptByTransactionHash({
          chainId: CURRENT_CHAIN_ID,
          transactionHash: (await tx.wait())?.hash as string,
        });

        expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.be.equal(2);

        tx = await ddTableInstance
          .connect(manufacturer1)
          .setDeviceDefinitionTable(1, 3);

        expect(await ddTableInstance.getDeviceDefinitionTableId(1)).to.be.equal(3);
      });
    });

    context('Events', () => {
      it('Should emit ManufacturerTableSet event with correct params', async () => {
        const tx = await ddTableInstance
          .connect(admin)
          .createDeviceDefinitionTable(manufacturer2.address, 2);
        await tablelandValidator.pollForReceiptByTransactionHash({
          chainId: CURRENT_CHAIN_ID,
          transactionHash: (await tx.wait())?.hash as string,
        });

        await expect(
          await ddTableInstance
            .connect(manufacturer1)
            .setDeviceDefinitionTable(1, 3)
        )
          .to.emit(ddTableInstance, 'ManufacturerTableSet')
          .withArgs(1, 3);
      });
    });
  });

  describe('insertDeviceDefinition', () => {
    beforeEach(async () => {
      const tx = await ddTableInstance
        .connect(admin)
        .createDeviceDefinitionTable(manufacturer1.address, 1);

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
            .insertDeviceDefinition(99, C.mockDdInput1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableDoesNotExist',
        ).withArgs(99);
      });
      it('Should revert if caller is not the manufacturer ID owner or has not the MANUFACTURER_INSERT_DD_PRIVILEGE', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .insertDeviceDefinition(1, C.mockDdInput1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized',
        ).withArgs(unauthorized.address);
      });
      it('Should revert if (model,year) pair already exists', async () => {
        let tx = await ddTableInstance
          .connect(manufacturer1)
          .insertDeviceDefinition(1, C.mockDdInput1);

        await tablelandValidator.pollForReceiptByTransactionHash({
          chainId: CURRENT_CHAIN_ID,
          transactionHash: (await tx.wait())?.hash as string,
        });

        tx = await ddTableInstance
          .connect(manufacturer1)
          .insertDeviceDefinition(1, C.mockDdInput1);

        const validatorResponse = await tablelandValidator.pollForReceiptByTransactionHash({
          chainId: CURRENT_CHAIN_ID,
          transactionHash: (await tx.wait())?.hash as string,
        });

        const tableId = await ddTableInstance.getDeviceDefinitionTableId(1);

        expect(validatorResponse.error).to.be.equal(
          `db query execution failed (code: SQLITE_UNIQUE constraint failed: _${CURRENT_CHAIN_ID}_${tableId}.model, _${CURRENT_CHAIN_ID}_${tableId}.year, msg: UNIQUE constraint failed: _${CURRENT_CHAIN_ID}_${tableId}.model, _${CURRENT_CHAIN_ID}_${tableId}.year)`
        );
      });
    });

    context('Table owner as caller', () => {
      context('State', () => {
        it('Should correctly insert DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(manufacturer1)
            .insertDeviceDefinition(1, C.mockDdInput1);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([1]);

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = "${C.mockDdId1}"`
          ).first();

          expect(selectQuery).to.deep.include({
            id: C.mockDdId1,
            model: C.mockDdModel1,
            year: C.mockDdYear1,
            metadata: C.mockDdMetadata1,
            ksuid: C.mockKsuid1,
            deviceType: C.mockDdDeviceType1,
            imageURI: C.mockDdImageURI1
          });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionInserted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(manufacturer1)
              .insertDeviceDefinition(1, C.mockDdInput1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(2, C.mockDdId1, C.mockDdModel1, C.mockDdYear1);
        });
      });
    });

    context('Privileged address as caller', () => {
      context('State', () => {
        it('Should correctly insert DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(privilegedUser1)
            .insertDeviceDefinition(1, C.mockDdInput1);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([1]);

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = "${C.mockDdId1}"`
          ).first();

          expect(selectQuery).to.deep.include({
            id: C.mockDdId1,
            model: C.mockDdModel1,
            year: C.mockDdYear1,
            metadata: C.mockDdMetadata1,
            ksuid: C.mockKsuid1,
            deviceType: C.mockDdDeviceType1,
            imageURI: C.mockDdImageURI1,
          });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionInserted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(privilegedUser1)
              .insertDeviceDefinition(1, C.mockDdInput1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(2, C.mockDdId1, C.mockDdModel1, C.mockDdYear1);
        });
      });
    });
  });

  describe('insertDeviceDefinitionBatch', () => {
    beforeEach(async () => {
      const tx = await ddTableInstance
        .connect(admin)
        .createDeviceDefinitionTable(manufacturer1.address, 1);

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
      it('Should revert if caller is not the manufacturer ID owner or has not the MANUFACTURER_INSERT_DD_PRIVILEGE', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .insertDeviceDefinitionBatch(1, C.mockDdInputBatch)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized',
        ).withArgs(unauthorized.address);
      });
      it('Should revert if (model,year) pair already exists', async () => {
        let tx = await ddTableInstance
          .connect(manufacturer1)
          .insertDeviceDefinitionBatch(1, C.mockDdInputBatch);

        await tablelandValidator.pollForReceiptByTransactionHash({
          chainId: CURRENT_CHAIN_ID,
          transactionHash: (await tx.wait())?.hash as string,
        });

        tx = await ddTableInstance
          .connect(manufacturer1)
          .insertDeviceDefinitionBatch(1, C.mockDdInputBatch);

        const validatorResponse = await tablelandValidator.pollForReceiptByTransactionHash({
          chainId: CURRENT_CHAIN_ID,
          transactionHash: (await tx.wait())?.hash as string,
        });

        const tableId = await ddTableInstance.getDeviceDefinitionTableId(1);

        expect(validatorResponse.error).to.be.equal(
          `db query execution failed (code: SQLITE_UNIQUE constraint failed: _${CURRENT_CHAIN_ID}_${tableId}.model, _${CURRENT_CHAIN_ID}_${tableId}.year, msg: UNIQUE constraint failed: _${CURRENT_CHAIN_ID}_${tableId}.model, _${CURRENT_CHAIN_ID}_${tableId}.year)`
        );
      });
      it('Should revert if (model,year) pair in the input are not unique', async () => {
        const tx = await ddTableInstance
          .connect(manufacturer1)
          .insertDeviceDefinitionBatch(1, C.mockDdInvalidInputBatch);

        const validatorResponse = await tablelandValidator.pollForReceiptByTransactionHash({
          chainId: CURRENT_CHAIN_ID,
          transactionHash: (await tx.wait())?.hash as string,
        });

        const tableId = await ddTableInstance.getDeviceDefinitionTableId(1);

        expect(validatorResponse.error).to.be.equal(
          `db query execution failed (code: SQLITE_UNIQUE constraint failed: _${CURRENT_CHAIN_ID}_${tableId}.model, _${CURRENT_CHAIN_ID}_${tableId}.year, msg: UNIQUE constraint failed: _${CURRENT_CHAIN_ID}_${tableId}.model, _${CURRENT_CHAIN_ID}_${tableId}.year)`
        );
      });
    });

    context('Table owner as caller', () => {
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

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).all();


          expect(selectQuery.results)
            .to.deep.include.members(
              [
                {
                  id: C.mockDdId1,
                  model: C.mockDdModel1,
                  year: C.mockDdYear1,
                  metadata: C.mockDdMetadata1,
                  ksuid: C.mockKsuid1,
                  deviceType: C.mockDdDeviceType1,
                  imageURI: C.mockDdImageURI1
                },
                {
                  id: C.mockDdId2,
                  model: C.mockDdModel2,
                  year: C.mockDdYear2,
                  metadata: C.mockDdMetadata2,
                  ksuid: C.mockKsuid2,
                  deviceType: C.mockDdDeviceType2,
                  imageURI: C.mockDdImageURI2
                },
                {
                  id: C.mockDdId3,
                  model: C.mockDdModel3,
                  year: C.mockDdYear3,
                  metadata: C.mockDdMetadata3,
                  ksuid: C.mockKsuid3,
                  deviceType: C.mockDdDeviceType3,
                  imageURI: C.mockDdImageURI3
                }
              ]
            );
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
            .withArgs(2, C.mockDdId1, C.mockDdModel1, C.mockDdYear1)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(2, C.mockDdId2, C.mockDdModel2, C.mockDdYear2)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(2, C.mockDdId3, C.mockDdModel3, C.mockDdYear3);
        });
      });
    });

    context('Privileged address as caller', () => {
      context('State', () => {
        it('Should correctly insert DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(privilegedUser1)
            .insertDeviceDefinitionBatch(1, C.mockDdInputBatch);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([3]);

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).all();


          expect(selectQuery.results)
            .to.deep.include.members(
              [
                {
                  id: C.mockDdId1,
                  model: C.mockDdModel1,
                  year: C.mockDdYear1,
                  metadata: C.mockDdMetadata1,
                  ksuid: C.mockKsuid1,
                  deviceType: C.mockDdDeviceType1,
                  imageURI: C.mockDdImageURI1
                },
                {
                  id: C.mockDdId2,
                  model: C.mockDdModel2,
                  year: C.mockDdYear2,
                  metadata: C.mockDdMetadata2,
                  ksuid: C.mockKsuid2,
                  deviceType: C.mockDdDeviceType2,
                  imageURI: C.mockDdImageURI2
                },
                {
                  id: C.mockDdId3,
                  model: C.mockDdModel3,
                  year: C.mockDdYear3,
                  metadata: C.mockDdMetadata3,
                  ksuid: C.mockKsuid3,
                  deviceType: C.mockDdDeviceType3,
                  imageURI: C.mockDdImageURI3
                }
              ]
            );
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionInserted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(privilegedUser1)
              .insertDeviceDefinitionBatch(1, C.mockDdInputBatch)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(2, C.mockDdId1, C.mockDdModel1, C.mockDdYear1)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(2, C.mockDdId2, C.mockDdModel2, C.mockDdYear2)
            .to.emit(ddTableInstance, 'DeviceDefinitionInserted')
            .withArgs(2, C.mockDdId3, C.mockDdModel3, C.mockDdYear3);
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
          .createDeviceDefinitionTable(manufacturer1.address, 1);

        expect(await ddTableInstance.getDeviceDefinitionTableName(1))
          .to.equal(`_${CURRENT_CHAIN_ID}_2`);
      });
    });
  });

  describe('updateDeviceDefinition', () => {
    beforeEach(async () => {
      const tx = await ddTableInstance
        .connect(admin)
        .createDeviceDefinitionTable(manufacturer1.address, 1);

      await tablelandValidator.pollForReceiptByTransactionHash({
        chainId: CURRENT_CHAIN_ID,
        transactionHash: (await tx.wait())?.hash as string,
      });

      const txInsert = await ddTableInstance
        .connect(manufacturer1)
        .insertDeviceDefinition(1, C.mockDdInput1);

      await tablelandValidator.pollForReceiptByTransactionHash({
        chainId: CURRENT_CHAIN_ID,
        transactionHash: (await txInsert.wait())?.hash as string,
      });


    });

    context('Error handling', () => {
      it('Should revert if Device Definition table does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(manufacturer1)
            .updateDeviceDefinition(99, C.mockDdInput1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableDoesNotExist',
        ).withArgs(99);
      });
      it('Should revert if caller is not the manufacturer ID owner or has not the MANUFACTURER_UPDATE_DD_PRIVILEGE', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .updateDeviceDefinition(1, C.mockDdInput1)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized',
        ).withArgs(unauthorized.address);
      });
    });

    context('Table owner as caller', () => {
      context('State', () => {
        it('Should correctly update DD from the table', async () => {
          const tx = await ddTableInstance
            .connect(manufacturer1)
            .updateDeviceDefinition(1, C.mockDdUpdate1);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([1]);

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = "${C.mockDdId1}"`
          ).first();

          expect(selectQuery).to.deep.include({
            id: C.mockDdId1,
            model: C.mockDdModel1,
            year: C.mockDdYear1,
            metadata: C.mockDdMetadataUpdate1,
            ksuid: C.mockKsuid1,
            deviceType: C.mockDdDeviceType1,
            imageURI: C.mockDdImageURI1
          });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionUpdated event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(manufacturer1)
              .updateDeviceDefinition(1, C.mockDdUpdate1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionUpdated')
            .withArgs(2, C.mockDdId1, C.mockDdModel1, C.mockDdYear1);
        });
      });
    });

    context('Privileged address as caller', () => {
      context('State', () => {
        it('Should correctly update DD from the table', async () => {
          const tx = await ddTableInstance
            .connect(privilegedUser1)
            .updateDeviceDefinition(1, C.mockDdUpdate1);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([1]);

          const selectQuery = await tablelandDb.prepare(
            `SELECT * FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)} WHERE id = "${C.mockDdId1}"`
          ).first();

          expect(selectQuery).to.deep.include({
            id: C.mockDdId1,
            model: C.mockDdModel1,
            year: C.mockDdYear1,
            metadata: C.mockDdMetadataUpdate1,
            ksuid: C.mockKsuid1,
            deviceType: C.mockDdDeviceType1,
            imageURI: C.mockDdImageURI1,
          });
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionUpdated event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(privilegedUser1)
              .updateDeviceDefinition(1, C.mockDdUpdate1)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionUpdated')
            .withArgs(2, C.mockDdId1, C.mockDdModel1, C.mockDdYear1);
        });
      });
    });
  });

  describe('deleteDeviceDefinition', () => {
    beforeEach(async () => {
      const tx = await ddTableInstance
        .connect(admin)
        .createDeviceDefinitionTable(manufacturer1.address, 1);

      await tablelandValidator.pollForReceiptByTransactionHash({
        chainId: CURRENT_CHAIN_ID,
        transactionHash: (await tx.wait())?.hash as string,
      });

      const txInsert = await ddTableInstance
        .connect(manufacturer1)
        .insertDeviceDefinition(1, C.mockDdInput1);

      await tablelandValidator.pollForReceiptByTransactionHash({
        chainId: CURRENT_CHAIN_ID,
        transactionHash: (await txInsert.wait())?.hash as string,
      });


    });

    context('Error handling', () => {
      it('Should revert if Device Definition table does not exist', async () => {
        await expect(
          ddTableInstance
            .connect(manufacturer1)
            .deleteDeviceDefinition(99, C.mockDdInput1.id)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'TableDoesNotExist',
        ).withArgs(99);
      });
      it('Should revert if caller is not the manufacturer ID owner or has not the MANUFACTURER_DELETE_DD_PRIVILEGE', async () => {
        await expect(
          ddTableInstance
            .connect(unauthorized)
            .deleteDeviceDefinition(1, C.mockDdInput1.id)
        ).to.be.revertedWithCustomError(
          ddTableInstance,
          'Unauthorized',
        ).withArgs(unauthorized.address);
      });
    });

    context('Table owner as caller', () => {
      context('State', () => {
        it('Should correctly delete DD from the table', async () => {
          const tx = await ddTableInstance
            .connect(manufacturer1)
            .deleteDeviceDefinition(1, C.mockDdInput1.id);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([0]);
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionDeleted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(manufacturer1)
              .deleteDeviceDefinition(1, C.mockDdInput1.id)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionDeleted')
            .withArgs(2, C.mockDdId1);
        });
      });
    });

    context('Privileged address as caller', () => {
      context('State', () => {
        it('Should correctly delete DD into the table', async () => {
          const tx = await ddTableInstance
            .connect(privilegedUser1)
            .deleteDeviceDefinition(1, C.mockDdInput1.id);

          await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CURRENT_CHAIN_ID,
            transactionHash: (await tx.wait())?.hash as string,
          });

          const count = await tablelandDb.prepare(
            `SELECT COUNT(*) AS total FROM ${await ddTableInstance.getDeviceDefinitionTableName(1)}`
          ).first<{ total: number }>('total');

          expect(count).to.deep.equal([0]);
        });
      });

      context('Events', () => {
        it('Should emit DeviceDefinitionDeleted event with correct params', async () => {
          await expect(
            ddTableInstance
              .connect(privilegedUser1)
              .deleteDeviceDefinition(1, C.mockDdInput1.id)
          )
            .to.emit(ddTableInstance, 'DeviceDefinitionDeleted')
            .withArgs(2, C.mockDdId1);
        });
      });
    });
  });
});