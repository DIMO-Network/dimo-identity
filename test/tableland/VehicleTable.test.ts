import chai from "chai";
import { ethers, HardhatEthersSigner } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { LocalTableland, getAccounts, getDatabase } from "@tableland/local";
import { Database, Validator } from "@tableland/sdk";

import {
  DimoAccessControl,
  Manufacturer,
  ManufacturerId,
  VehicleTable,
} from "../../typechain-types";
import { setup, grantAdminRoles, C } from "../../utils";

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

describe.only("VehicleTable", async function () {
  // let snapshot: string;
  let db: Database;
  // let validator: Validator;
  let dimoAccessControlInstance: DimoAccessControl;
  let manufacturerInstance: Manufacturer;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleTableInstance: VehicleTable;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;

  async function deployFixture() {
    [admin, nonAdmin, manufacturer1] = await ethers.getSigners();
    db = getDatabase(accounts[0]);
    // validator = new Validator(db.config);

    const deployments = await setup(admin, {
      modules: ["DimoAccessControl", "Manufacturer", "VehicleTable"],
      nfts: ["ManufacturerId"],
      upgradeableContracts: [],
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    vehicleTableInstance = deployments.VehicleTable;
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
  }

  describe("createVehicleTable", () => {
    before(async function () {
      await loadFixture(deployFixture);
    });

    context("Error handling", () => {
      it("Should revert if caller does not have admin role", async () => {
        await expect(
          vehicleTableInstance
            .connect(nonAdmin)
            .createVehicleTable(nonAdmin.address, 1),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.ADMIN_ROLE
          }`,
        );
      });
    });

    context("State", () => {
      it("Test", async () => {
        const tx = await vehicleTableInstance
          .connect(admin)
          .createVehicleTable(manufacturer1.address, 1);

        // console.log((await tx.wait())?.logs);

        console.log(await vehicleTableInstance.metadataTable());
        console.log(await vehicleTableInstance.metadataTableId());
        console.log(await vehicleTableInstance.getMaufacturerTable(1));

        // const tx2 = await vehicleTableInstance.connect(admin).safeMint("MockVehicle", await vehicleTableInstance.getAddress(), "Mock", "Model", "2023");

        // console.log((await tx2.wait())?.logs)
      });
    });
  });
});
