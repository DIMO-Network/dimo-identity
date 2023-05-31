import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  Nodes,
  Manufacturer,
  ManufacturerId,
  Integration,
  IntegrationId,
  Vehicle,
  VehicleId,
  VirtualDevice,
  VirtualDeviceId,
  Mapper
} from '../../typechain';
import {
  setup,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('VirtualDeviceId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let accessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let virtualDeviceInstance: VirtualDevice;
  let mapperInstance: Mapper;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let virtualDeviceIdInstance: VirtualDeviceId;

  const [
    admin,
    nonAdmin,
    manufacturer1,
    integrationOwner1,
    user1,
    user2,
    virtualDeviceAddress1
  ] = provider.getWallets();

  before(async () => {
    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Integration',
        'Vehicle',
        'VirtualDevice',
        'Mapper'
      ],
      nfts: ['ManufacturerId', 'IntegrationId', 'VehicleId', 'VirtualDeviceId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    accessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    virtualDeviceInstance = deployments.VirtualDevice;
    mapperInstance = deployments.Mapper;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    virtualDeviceIdInstance = deployments.VirtualDeviceId;

    const MANUFACTURER_MINTER_ROLE = await manufacturerIdInstance.MINTER_ROLE();
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(MANUFACTURER_MINTER_ROLE, dimoRegistryInstance.address);

    const INTEGRATION_MINTER_ROLE = await integrationIdInstance.MINTER_ROLE();
    await integrationIdInstance
      .connect(admin)
      .grantRole(INTEGRATION_MINTER_ROLE, dimoRegistryInstance.address);

    const VEHICLE_MINTER_ROLE = await vehicleIdInstance.MINTER_ROLE();
    await vehicleIdInstance
      .connect(admin)
      .grantRole(VEHICLE_MINTER_ROLE, dimoRegistryInstance.address);

    const VIRTUAL_DEVICE_MINTER_ROLE =
      await virtualDeviceIdInstance.MINTER_ROLE();
    await virtualDeviceIdInstance
      .connect(admin)
      .grantRole(VIRTUAL_DEVICE_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(manufacturerIdInstance.address);
    await integrationInstance
      .connect(admin)
      .setIntegrationIdProxyAddress(integrationIdInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(vehicleIdInstance.address);
    await virtualDeviceInstance
      .connect(admin)
      .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address);

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion
    );

    // Grant MANUFACTURER_ROLE to manufacturer
    await accessControlInstance
      .connect(admin)
      .grantRole(C.MANUFACTURER_ROLE, manufacturer1.address);

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

    // Whitelist VirtualDevice attributes
    await virtualDeviceInstance
      .connect(admin)
      .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute1);
    await virtualDeviceInstance
      .connect(admin)
      .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute2);

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
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    // Set DimoForwarder in the VirtualDeviceId
    await virtualDeviceIdInstance
      .connect(admin)
      .setTrustedForwarder(vehicleIdInstance.address, true);

    // Set VirtualDeviceId in the VehicleId
    await vehicleIdInstance
      .connect(admin)
      .setVirtualDeviceIdAddress(virtualDeviceIdInstance.address);

    // Minting and linking a vehicle to a virtual device
    const mintVirtualDeviceSig1 = await signMessage({
      _signer: virtualDeviceAddress1,
      _primaryType: 'MintVirtualDeviceSign',
      _verifyingContract: virtualDeviceInstance.address,
      message: {
        integrationNode: '1',
        vehicleNode: '1'
      }
    });
    const mintVehicleOwnerSig1 = await signMessage({
      _signer: user1,
      _primaryType: 'MintVirtualDeviceSign',
      _verifyingContract: virtualDeviceInstance.address,
      message: {
        integrationNode: '1',
        vehicleNode: '1'
      }
    });
    const correctMintInput1 = {
      integrationNode: '1',
      vehicleNode: '1',
      virtualDeviceSig: mintVirtualDeviceSig1,
      vehicleOwnerSig: mintVehicleOwnerSig1,
      virtualDeviceAddr: virtualDeviceAddress1.address,
      attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
    };

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
    await virtualDeviceInstance
      .connect(admin)
      .mintVirtualDeviceSign(correctMintInput1);
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
        virtualDeviceIdInstance
          .connect(nonAdmin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should revert if addr is zero address', async () => {
      await expect(
        virtualDeviceIdInstance
          .connect(admin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith('ZeroAddress');
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        virtualDeviceIdInstance
          .connect(nonAdmin)
          .setTrustedForwarder(C.ZERO_ADDRESS, true)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set address as trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();

      // eslint-disable-next-line no-unused-expressions
      expect(
        await virtualDeviceIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.false;

      await virtualDeviceIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await virtualDeviceIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.true;
    });
    it('Should correctly set address as not trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();
      await virtualDeviceIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await virtualDeviceIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.true;

      await virtualDeviceIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, false);

      // eslint-disable-next-line no-unused-expressions
      expect(
        await virtualDeviceIdInstance.trustedForwarders(mockForwarder.address)
      ).to.be.false;
    });
  });

  context('On transfer', () => {
    context('Error handling', () => {
      it('Should revert if caller is approved, but not the token owner', async () => {
        await expect(
          virtualDeviceIdInstance
            .connect(user1)
            ['safeTransferFrom(address,address,uint256)'](
              user1.address,
              user2.address,
              1
            )
        ).to.be.revertedWith('Unauthorized');
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
      it('Should transfer virtual device ID to the new owner', async () => {
        expect(await virtualDeviceIdInstance.ownerOf(1)).to.be.equal(
          user1.address
        );

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(await virtualDeviceIdInstance.ownerOf(1)).to.be.equal(
          user2.address
        );
      });
      it('Should keep pairing link between vehicle ID and virtual device ID', async () => {
        expect(
          await mapperInstance.getNodeLink(
            vehicleIdInstance.address,
            virtualDeviceIdInstance.address,
            1
          )
        ).to.equal(1);
        expect(
          await mapperInstance.getNodeLink(
            virtualDeviceIdInstance.address,
            vehicleIdInstance.address,
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
            vehicleIdInstance.address,
            virtualDeviceIdInstance.address,
            1
          )
        ).to.equal(1);
        expect(
          await mapperInstance.getNodeLink(
            virtualDeviceIdInstance.address,
            vehicleIdInstance.address,
            1
          )
        ).to.equal(1);
      });
      it('Should keep the virtual device ID parent node', async () => {
        expect(
          await nodesInstance.getParentNode(virtualDeviceIdInstance.address, 1)
        ).to.equal(1);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(virtualDeviceIdInstance.address, 1)
        ).to.equal(1);
      });
      it('Should keep the same virtual device ID infos', async () => {
        for (const attrInfoPair of C.mockVirtualDeviceAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              virtualDeviceIdInstance.address,
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

        for (const attrInfoPair of C.mockVirtualDeviceAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              virtualDeviceIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should keep the same virtual device address', async () => {
        expect(
          await virtualDeviceInstance.getVirtualDeviceIdByAddress(
            virtualDeviceAddress1.address
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
          await virtualDeviceInstance.getVirtualDeviceIdByAddress(
            virtualDeviceAddress1.address
          )
        ).to.equal(1);
      });
    });
  });
});
