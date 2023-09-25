import chai from "chai";
import { ethers, HardhatEthersSigner } from "hardhat";

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  Nodes,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  AdLicenseValidator,
  Mapper,
  DimoForwarder,
  MockDimoToken,
  MockStake,
} from "../typechain-types";
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C,
} from "../utils";

const { expect } = chai;

describe("DimoForwarder", async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let forwarderInstance: DimoForwarder;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let foundation: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let adAddress1: HardhatEthersSigner;
  let adAddress2: HardhatEthersSigner;

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList),
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted),
  );

  before(async () => {
    [
      admin,
      nonAdmin,
      foundation,
      manufacturer1,
      user1,
      user2,
      adAddress1,
      adAddress2,
    ] = await ethers.getSigners();

    mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
    mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

    const deployments = await setup(admin, {
      modules: [
        "Eip712Checker",
        "DimoAccessControl",
        "Nodes",
        "Manufacturer",
        "Vehicle",
        "AftermarketDevice",
        "AdLicenseValidator",
        "Mapper",
      ],
      nfts: ["ManufacturerId", "VehicleId", "AftermarketDeviceId"],
      upgradeableContracts: ["DimoForwarder"],
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;
    forwarderInstance = deployments.DimoForwarder;

    await grantAdminRoles(admin, dimoAccessControlInstance);

    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());
    await vehicleIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, await dimoRegistryInstance.getAddress());

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(await vehicleIdInstance.getAddress());
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(await adIdInstance.getAddress());

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion,
    );

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory =
      await ethers.getContractFactory("MockDimoToken");
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18,
    );

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory("MockStake");
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(
        await dimoRegistryInstance.getAddress(),
        C.manufacturerDimoTokensAmount,
      );

    // Setup AdLicenseValidator variables
    await adLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await adLicenseValidatorInstance.setDimoToken(
      await mockDimoTokenInstance.getAddress(),
    );
    await adLicenseValidatorInstance.setLicense(
      await mockStakeInstance.getAddress(),
    );
    await adLicenseValidatorInstance.setAdMintCost(C.adMintCost);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

    // Whitelist Vehicle attributes
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute1);
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute2);

    // Whitelist AftermarketDevice attributes
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1);
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute2);

    // Mint Manufacturer Node
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer1.address,
        C.mockManufacturerNames[0],
        C.mockManufacturerAttributeInfoPairs,
      );

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(
        C.NFT_TRANSFERER_ROLE,
        await dimoRegistryInstance.getAddress(),
      );

    // Minting aftermarket devices for testing
    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);

    await aftermarketDeviceInstance
      .connect(manufacturer1)
      .mintAftermarketDeviceByManufacturerBatch(
        1,
        mockAftermarketDeviceInfosList,
      );

    // Set Dimo Registry in the NFTs
    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(await dimoRegistryInstance.getAddress());
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(await dimoRegistryInstance.getAddress());
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(await dimoRegistryInstance.getAddress());

    // Set DimoForwarder in the NFTs
    await vehicleIdInstance
      .connect(admin)
      .setTrustedForwarder(await forwarderInstance.getAddress(), true);
    await adIdInstance
      .connect(admin)
      .setTrustedForwarder(await forwarderInstance.getAddress(), true);

    // Set Proxy Ids in the Forwarder
    await forwarderInstance.setDimoRegistryAddress(
      await dimoRegistryInstance.getAddress(),
    );
    await forwarderInstance.setVehicleIdProxyAddress(
      await vehicleIdInstance.getAddress(),
    );
    await forwarderInstance.setAftermarketDeviceIdProxyAddress(
      await adIdInstance.getAddress(),
    );

    // Minting and pairing 2 vehicles and aftermarket devices
    const claimOwnerSig1 = await signMessage({
      _signer: user1,
      _primaryType: "ClaimAftermarketDeviceSign",
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: "1",
        owner: user1.address,
      },
    });
    const claimOwnerSig2 = await signMessage({
      _signer: user2,
      _primaryType: "ClaimAftermarketDeviceSign",
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: "2",
        owner: user2.address,
      },
    });
    const claimAdSig2 = await signMessage({
      _signer: adAddress2,
      _primaryType: "ClaimAftermarketDeviceSign",
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: "2",
        owner: user2.address,
      },
    });
    const claimAdSig1 = await signMessage({
      _signer: adAddress1,
      _primaryType: "ClaimAftermarketDeviceSign",
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: "1",
        owner: user1.address,
      },
    });
    const pairSignature1 = await signMessage({
      _signer: user1,
      _primaryType: "PairAftermarketDeviceSign",
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: "1",
        vehicleNode: "1",
      },
    });
    const pairSignature2 = await signMessage({
      _signer: user2,
      _primaryType: "PairAftermarketDeviceSign",
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: "2",
        vehicleNode: "2",
      },
    });

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
    await aftermarketDeviceInstance
      .connect(admin)
      .claimAftermarketDeviceSign(
        1,
        user1.address,
        claimOwnerSig1,
        claimAdSig1,
      );
    await aftermarketDeviceInstance
      .connect(admin)
      .claimAftermarketDeviceSign(
        2,
        user2.address,
        claimOwnerSig2,
        claimAdSig2,
      );
    await aftermarketDeviceInstance
      .connect(admin)
      ["pairAftermarketDeviceSign(uint256,uint256,bytes)"](
        1,
        1,
        pairSignature1,
      );
    await aftermarketDeviceInstance
      .connect(admin)
      ["pairAftermarketDeviceSign(uint256,uint256,bytes)"](
        2,
        2,
        pairSignature2,
      );
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe("setDimoRegistryAddress", () => {
    it("Should revert if caller does not have admin role", async () => {
      await expect(
        forwarderInstance
          .connect(nonAdmin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS),
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`,
      );
    });
    it("Should revert if addr is zero address", async () => {
      await expect(
        forwarderInstance.connect(admin).setDimoRegistryAddress(C.ZERO_ADDRESS),
      ).to.be.revertedWithCustomError(forwarderInstance, "ZeroAddress");
    });
  });

  describe("setVehicleIdProxyAddress", () => {
    it("Should revert if caller does not have admin role", async () => {
      await expect(
        forwarderInstance
          .connect(nonAdmin)
          .setVehicleIdProxyAddress(await vehicleIdInstance.getAddress()),
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`,
      );
    });
  });

  describe("setAftermarketDeviceIdProxyAddress", () => {
    it("Should revert if caller does not have admin role", async () => {
      await expect(
        forwarderInstance
          .connect(nonAdmin)
          .setAftermarketDeviceIdProxyAddress(
            await aftermarketDeviceInstance.getAddress(),
          ),
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`,
      );
    });
  });

  describe("transferVehicleAndAftermarketDeviceIds", async () => {
    context("Error handling", () => {
      it("Should revert if vehicle and aftermarket device are not paired", async () => {
        await expect(
          forwarderInstance
            .connect(user1)
            .transferVehicleAndAftermarketDeviceIds(3, 2, user2.address),
        )
          .to.be.revertedWithCustomError(forwarderInstance, "InvalidLink")
          .withArgs(
            await vehicleIdInstance.getAddress(),
            await adIdInstance.getAddress(),
            3,
            2,
          );
      });
      /**
       * Note: we don't have to test a failure if the caller is not
       * aftermarket device owner because the paired vehicle and
       * aftermarket device must have the same owner.
       */
      it("Should revert if caller is not the vehicle owner", async () => {
        await expect(
          forwarderInstance
            .connect(user2)
            .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address),
        )
          .to.be.revertedWithCustomError(forwarderInstance, "TransferFailed")
          .withArgs(
            await vehicleIdInstance.getAddress(),
            1,
            "ERC721: caller is not token owner or approved",
          );
      });
    });

    context("State", () => {
      it("Should transfer vehicle ID to the new owner", async () => {
        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
      it("Should transfer aftermarket device ID to the new owner", async () => {
        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(await adIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
      it("Should keep pairing link between vehicle ID and aftermarket device ID", async () => {
        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1),
        ).to.equal(1);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.equal(1);

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1),
        ).to.equal(1);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.equal(1);
      });
      it("Should keep the vehicle ID parent node", async () => {
        expect(
          await nodesInstance.getParentNode(
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.equal(1);

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(
          await nodesInstance.getParentNode(
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.equal(1);
      });
      it("Should keep the aftermarket device ID parent node", async () => {
        expect(
          await nodesInstance.getParentNode(await adIdInstance.getAddress(), 1),
        ).to.equal(1);

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(
          await nodesInstance.getParentNode(await adIdInstance.getAddress(), 1),
        ).to.equal(1);
      });
      it("Should keep the same vehicle ID infos", async () => {
        for (const attrInfoPair of C.mockVehicleAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await vehicleIdInstance.getAddress(),
              1,
              attrInfoPair.attribute,
            ),
          ).to.equal(attrInfoPair.info);
        }

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        for (const attrInfoPair of C.mockVehicleAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await vehicleIdInstance.getAddress(),
              1,
              attrInfoPair.attribute,
            ),
          ).to.equal(attrInfoPair.info);
        }
      });
      it("Should keep the same aftermarket device ID infos", async () => {
        for (const attrInfoPair of C.mockAftermarketDeviceInfosList[0]
          .attrInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await adIdInstance.getAddress(),
              1,
              attrInfoPair.attribute,
            ),
          ).to.equal(attrInfoPair.info);
        }

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        for (const attrInfoPair of C.mockAftermarketDeviceInfosList[0]
          .attrInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await adIdInstance.getAddress(),
              1,
              attrInfoPair.attribute,
            ),
          ).to.equal(attrInfoPair.info);
        }
      });
      it("Should keep the same aftermarket device address", async () => {
        expect(
          await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
            adAddress1.address,
          ),
        ).to.equal(1);

        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(
          await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
            adAddress1.address,
          ),
        ).to.equal(1);
      });
    });
  });
});
