import chai from "chai";
import { ethers, HardhatEthersSigner } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { LocalTableland, getAccounts, getDatabase } from "@tableland/local";
import { Database, Validator } from "@tableland/sdk";

import { DimoAccessControl, VehicleTable } from "../../typechain-types";
import { setup, C } from "../../utils";

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
  let vehicleTableInstance: VehicleTable;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;

  async function deployFixture() {
    [admin, nonAdmin] = await ethers.getSigners();
    db = getDatabase(accounts[0]);
    // validator = new Validator(db.config);

    const deployments = await setup(admin, {
      modules: ["DimoAccessControl", "VehicleTable"],
      nfts: [],
      upgradeableContracts: [],
    });

    dimoAccessControlInstance = deployments.DimoAccessControl;
    vehicleTableInstance = deployments.VehicleTable;

    await dimoAccessControlInstance
      .connect(admin)
      .grantRole(C.ADMIN_ROLE, admin.address);
  }

  describe("setBaseDataURI", () => {
    before(async function () {
      await loadFixture(deployFixture);
    });

    context("Error handling", () => {
      it("Should revert if caller does not have admin role", async () => {
        await expect(
          vehicleTableInstance
            .connect(nonAdmin)
            .createVehicleTable(nonAdmin.address, "MockVehicle"),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.ADMIN_ROLE
          }`,
        );
      });
    });

    context("State", () => {
      it("Test", async () => {
        await vehicleTableInstance
          .connect(admin)
          .createVehicleTable(nonAdmin.address, "MockVehicle");
      });
    });
  });
});
