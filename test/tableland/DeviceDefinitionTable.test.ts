import chai from 'chai';
import { ethers, network, HardhatEthersSigner } from 'hardhat';

import { LocalTableland, getAccounts, getRegistry } from '@tableland/local';
import { Registry } from '@tableland/sdk';

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
  // let tablelandDb: Database;
  // let tablelandValidator: Validator;
  let tablelandRegistry: Registry;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let manufacturerIdInstance: ManufacturerId;
  let ddTableInstance: DeviceDefinitionTable;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;

  before(async () => {
    CURRENT_CHAIN_ID = network.config.chainId ?? 31337;
    [admin, nonAdmin, manufacturer1] = await ethers.getSigners();
    // tablelandDb = getDatabase(accounts[0]);
    // tablelandValidator = new Validator(tablelandDb.config);
    tablelandRegistry = getRegistry(accounts[0]);

    const deployments = await setup(admin, {
      modules: ['DimoAccessControl', 'Manufacturer', 'DeviceDefinitionTable'],
      nfts: ['ManufacturerId'],
      upgradeableContracts: [],
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    ddTableInstance = deployments.DeviceDefinitionTable;
    manufacturerInstance = deployments.Manufacturer;
    manufacturerIdInstance = deployments.ManufacturerId;

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


  describe('createDeviceDefinitionTable', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          ddTableInstance
            .connect(nonAdmin)
            .createDeviceDefinitionTable(nonAdmin.address, 1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`,
        );
      });
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
      it('Should revert if manufacturer table already exists', async () => {
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

    context('State', () => {
      it('Should create register a new table to a manufacturer', async () => {
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
    });

    context('Events', () => {
      it('Should emit DeviceDefinitionTableCreated event with correct params', async () => {
        await expect(
          ddTableInstance
            .connect(admin)
            .createDeviceDefinitionTable(manufacturer1.address, 1)
        )
          .to.emit(ddTableInstance, 'DeviceDefinitionTableCreated')
          .withArgs(1, 2);
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
          .to.equal(`${C.mockManufacturerNames[0]}_${CURRENT_CHAIN_ID}_2`);
      });
    });
  });
});
