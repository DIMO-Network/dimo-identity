import chai from 'chai';
import { ethers } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
  DIMORegistry,
  Eip712Checker,
  Charging,
  DimoAccessControl,
  Nodes,
  Manufacturer,
  ManufacturerId,
  Integration,
  IntegrationId,
  Vehicle,
  VehicleId,
  SyntheticDevice,
  SyntheticDeviceId,
  Mapper,
  Shared,
  MockDimoCredit
} from '../../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../../utils';

const { expect } = chai;

describe('SyntheticDeviceId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let dimoAccessControlInstance: DimoAccessControl;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let syntheticDeviceInstance: SyntheticDevice;
  let mapperInstance: Mapper;
  let sharedInstance: Shared;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let sdIdInstance: SyntheticDeviceId;
  let mockDimoCreditInstance: MockDimoCredit;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let foundation: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let integrationOwner1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let sDAddress1: HardhatEthersSigner;

  before(async () => {
    [
      admin,
      nonAdmin,
      foundation,
      manufacturer1,
      integrationOwner1,
      user1,
      user2,
      sDAddress1
    ] = await ethers.getSigners();

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'Charging',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Integration',
        'Vehicle',
        'SyntheticDevice',
        'Mapper',
        'Shared'
      ],
      nfts: [
        'ManufacturerId',
        'IntegrationId',
        'VehicleId',
        'SyntheticDeviceId'
      ],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    chargingInstance = deployments.Charging;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    mapperInstance = deployments.Mapper;
    sharedInstance = deployments.Shared;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    sdIdInstance = deployments.SyntheticDeviceId;

    DIMO_REGISTRY_ADDRESS = await dimoRegistryInstance.getAddress();

    // Deploy MockDimoCredit contract
    const MockDimoCreditFactory = await ethers.getContractFactory(
      'MockDimoCredit'
    );
    mockDimoCreditInstance = await MockDimoCreditFactory.connect(admin).deploy();

    await grantAdminRoles(admin, dimoAccessControlInstance);

    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await integrationIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await vehicleIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(await manufacturerIdInstance.getAddress());
    await integrationInstance
      .connect(admin)
      .setIntegrationIdProxyAddress(await integrationIdInstance.getAddress());
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(await vehicleIdInstance.getAddress());
    await syntheticDeviceInstance
      .connect(admin)
      .setSyntheticDeviceIdProxyAddress(await sdIdInstance.getAddress());

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion
    );

    // Mint DIMO Credit Tokens to admin and approve DIMORegistry
    await mockDimoCreditInstance
      .connect(admin)
      .mint(admin.address, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .approve(DIMO_REGISTRY_ADDRESS, C.adminDimoCreditTokensAmount);

    // Setup Shared variables
    await sharedInstance
      .connect(admin)
      .setFoundation(foundation.address);
    await sharedInstance
      .connect(admin)
      .setDimoCredit(await mockDimoCreditInstance.getAddress());

    // Setup Charging variables
    await chargingInstance
      .connect(admin)
      .setDcxOperationCost(C.MINT_VEHICLE_OPERATION, C.MINT_VEHICLE_OPERATION_COST);

    // Whitelist Manufacturer attributes
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute1);
    await manufacturerInstance
      .connect(admin)
      .addManufacturerAttribute(C.mockManufacturerAttribute2);

    // Whitelist Integration attributes
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute1);
    await integrationInstance
      .connect(admin)
      .addIntegrationAttribute(C.mockIntegrationAttribute2);

    // Whitelist Vehicle attributes
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute1);
    await vehicleInstance
      .connect(admin)
      .addVehicleAttribute(C.mockVehicleAttribute2);

    // Whitelist SyntheticDevice attributes
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1);
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute2);

    // Mint Manufacturer Node
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer1.address,
        C.mockManufacturerNames[0],
        C.mockManufacturerAttributeInfoPairs
      );

    // Mint Integration Node
    await integrationInstance
      .connect(admin)
      .mintIntegration(
        integrationOwner1.address,
        C.mockIntegrationNames[0],
        C.mockIntegrationAttributeInfoPairs
      );

    // Set Dimo Registry in the NFTs
    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    // Set DimoForwarder in the SyntheticDeviceId
    await sdIdInstance
      .connect(admin)
      .setTrustedForwarder(await vehicleIdInstance.getAddress(), true);

    // Set SyntheticDeviceId in the VehicleId
    await vehicleIdInstance
      .connect(admin)
      .setSyntheticDeviceIdAddress(await sdIdInstance.getAddress());

    // Minting and linking a vehicle to a synthetic device
    const mintSyntheticDeviceSig1 = await signMessage({
      _signer: sDAddress1,
      _primaryType: 'MintSyntheticDeviceSign',
      _verifyingContract: await syntheticDeviceInstance.getAddress(),
      message: {
        integrationNode: '1',
        vehicleNode: '1'
      }
    });
    const mintVehicleOwnerSig1 = await signMessage({
      _signer: user1,
      _primaryType: 'MintSyntheticDeviceSign',
      _verifyingContract: await syntheticDeviceInstance.getAddress(),
      message: {
        integrationNode: '1',
        vehicleNode: '1'
      }
    });
    const correctMintInput1 = {
      integrationNode: '1',
      vehicleNode: '1',
      syntheticDeviceSig: mintSyntheticDeviceSig1,
      vehicleOwnerSig: mintVehicleOwnerSig1,
      syntheticDeviceAddr: sDAddress1.address,
      attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
    };

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
    await syntheticDeviceInstance
      .connect(admin)
      .mintSyntheticDeviceSign(correctMintInput1);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setDimoRegistryAddress', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        sdIdInstance.connect(nonAdmin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should revert if addr is zero address', async () => {
      await expect(
        sdIdInstance.connect(admin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWithCustomError(sdIdInstance, 'ZeroAddress');
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        sdIdInstance.connect(nonAdmin).setTrustedForwarder(C.ZERO_ADDRESS, true)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set address as trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .false;

      await sdIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .true;
    });
    it('Should correctly set address as not trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();
      await sdIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .true;

      await sdIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, false);

      // eslint-disable-next-line no-unused-expressions
      expect(await sdIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .false;
    });
  });

  context('On transfer', () => {
    context('Error handling', () => {
      it('Should revert if caller is approved, but not the token owner', async () => {
        await expect(
          sdIdInstance
            .connect(user1)
            ['safeTransferFrom(address,address,uint256)'](
              user1.address,
              user2.address,
              1
            )
        ).to.be.revertedWithCustomError(sdIdInstance, 'Unauthorized');
      });
    });

    context('State', () => {
      it('Should transfer vehicle ID to the new owner', async () => {
        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
      it('Should transfer synthetic device ID to the new owner', async () => {
        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
      it('Should keep pairing link between vehicle ID and synthetic device ID', async () => {
        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1
          )
        ).to.equal(1);
        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.equal(1);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1
          )
        ).to.equal(1);
        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1
          )
        ).to.equal(1);
      });
      it('Should keep the synthetic device ID parent node', async () => {
        expect(
          await nodesInstance.getParentNode(await sdIdInstance.getAddress(), 1)
        ).to.equal(1);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(await sdIdInstance.getAddress(), 1)
        ).to.equal(1);
      });
      it('Should keep the same synthetic device ID infos', async () => {
        for (const attrInfoPair of C.mockSyntheticDeviceAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await sdIdInstance.getAddress(),
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        for (const attrInfoPair of C.mockSyntheticDeviceAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await sdIdInstance.getAddress(),
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should keep the same synthetic device address', async () => {
        expect(
          await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sDAddress1.address
          )
        ).to.equal(1);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sDAddress1.address
          )
        ).to.equal(1);
      });
    });
  });
});
