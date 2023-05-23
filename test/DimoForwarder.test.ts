import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  // Nodes,
  Manufacturer,
  ManufacturerId,
  Integration,
  IntegrationId,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  VirtualDevice,
  VirtualDeviceId,
  AdLicenseValidator,
  // Mapper,
  DimoForwarder,
  MockDimoToken,
  MockStake
} from '../typechain';
import {
  setup,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('DimoForwarder', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let accessControlInstance: DimoAccessControl;
  // let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let virtualDeviceInstance: VirtualDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  // let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let virtualDeviceIdInstance: VirtualDeviceId;
  let forwarderInstance: DimoForwarder;

  const [
    admin,
    nonAdmin,
    foundation,
    manufacturer1,
    integrationOwner1,
    user1,
    user2,
    adAddress1,
    adAddress2,
    virtualDeviceAddress1,
    virtualDeviceAddress2
  ] = provider.getWallets();

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList)
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted)
  );
  mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
  mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
  mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
  mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

  before(async () => {
    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Integration',
        'Vehicle',
        'AftermarketDevice',
        'VirtualDevice',
        'AdLicenseValidator',
        'Mapper'
      ],
      nfts: [
        'ManufacturerId',
        'IntegrationId',
        'VehicleId',
        'AftermarketDeviceId',
        'VirtualDeviceId'
      ],
      upgradeableContracts: ['DimoForwarder']
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    accessControlInstance = deployments.DimoAccessControl;
    // nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    virtualDeviceInstance = deployments.VirtualDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    // mapperInstance = deployments.Mapper;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;
    virtualDeviceIdInstance = deployments.VirtualDeviceId;
    forwarderInstance = deployments.DimoForwarder;

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

    const AD_MINTER_ROLE = await adIdInstance.MINTER_ROLE();
    await adIdInstance
      .connect(admin)
      .grantRole(AD_MINTER_ROLE, dimoRegistryInstance.address);

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
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(adIdInstance.address);
    await virtualDeviceInstance
      .connect(admin)
      .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address);

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion
    );

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );
    await mockDimoTokenInstance.deployed();

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();
    await mockStakeInstance.deployed();

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(dimoRegistryInstance.address, C.manufacturerDimoTokensAmount);

    // Setup AdLicenseValidator variables
    await adLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await adLicenseValidatorInstance.setDimoToken(
      mockDimoTokenInstance.address
    );
    await adLicenseValidatorInstance.setLicense(mockStakeInstance.address);
    await adLicenseValidatorInstance.setAdMintCost(C.adMintCost);

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

    // Whitelist AftermarketDevice attributes
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1);
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute2);

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

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, dimoRegistryInstance.address);

    // Minting aftermarket devices for testing
    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);

    await aftermarketDeviceInstance
      .connect(manufacturer1)
      .mintAftermarketDeviceByManufacturerBatch(
        1,
        mockAftermarketDeviceInfosList
      );

    // Set Dimo Registry in the NFTs
    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await vehicleIdInstance
      .connect(admin)
      .setTrustedForwarder(forwarderInstance.address);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await adIdInstance
      .connect(admin)
      .setTrustedForwarder(forwarderInstance.address);

    // Set Proxy Ids in the Forwarder
    await forwarderInstance.setDimoRegistryAddress(
      dimoRegistryInstance.address
    );
    await forwarderInstance.setVehicleIdProxyAddress(vehicleIdInstance.address);
    await forwarderInstance.setAftermarketDeviceIdProxyAddress(
      adIdInstance.address
    );
    await forwarderInstance.setVirtualDeviceIdProxyAddress(
      virtualDeviceIdInstance.address
    );
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
        forwarderInstance
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
        forwarderInstance.connect(admin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith('zeroAddress');
    });
  });

  describe('setVehicleIdProxyAddress', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        forwarderInstance
          .connect(nonAdmin)
          .setVehicleIdProxyAddress(vehicleIdInstance.address)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
  });

  describe('setAftermarketDeviceIdProxyAddress', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        forwarderInstance
          .connect(nonAdmin)
          .setAftermarketDeviceIdProxyAddress(aftermarketDeviceInstance.address)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
  });

  describe('setVirtualDeviceIdProxyAddress', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        forwarderInstance
          .connect(nonAdmin)
          .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
  });

  describe('transferVehicleAndAftermarketDeviceIds', async () => {
    beforeEach(async () => {
      const claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      const claimOwnerSig2 = await signMessage({
        _signer: user2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address
        }
      });
      const claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address
        }
      });
      const claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      const pairSignature1 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1'
        }
      });
      const pairSignature2 = await signMessage({
        _signer: user2,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '2'
        }
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
          claimAdSig1
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user2.address,
          claimOwnerSig2,
          claimAdSig2
        );
      await aftermarketDeviceInstance
        .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature1
        );
      await aftermarketDeviceInstance
        .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          2,
          2,
          pairSignature2
        );
    });

    context('Error handling', () => {
      it('Should revert if vehicle and aftermarket device are not paired', async () => {
        // Vehicle #3
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          forwarderInstance
            .connect(user1)
            .transferVehicleAndAftermarketDeviceIds(3, 2, user2.address)
        ).to.be.revertedWith(
          `invalidLink("${vehicleIdInstance.address}", "${adIdInstance.address}", 3, 2)`
        );
      });
      it('Should revert if caller is not the vehicle owner', async () => {
        await expect(
          forwarderInstance
            .connect(user2)
            .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address)
        ).to.be.revertedWith(
          `transferFailed("${vehicleIdInstance.address}", 1)`
        );
      });
      /// TODO Fix it
      it.skip('Should revert if caller is not the aftermarket device owner', async () => {
        await expect(
          forwarderInstance
            .connect(user1)
            .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address)
        ).to.be.revertedWith(`transferFailed("${adIdInstance.address}", 1)`);
      });
    });

    context('State', () => {
      it('Should transfer vehicle ID to the new owner', async () => {
        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
      it('Should transfer vehicle ID to the new owner', async () => {
        await forwarderInstance
          .connect(user1)
          .transferVehicleAndAftermarketDeviceIds(1, 1, user2.address);

        expect(await adIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
    });
  });

  describe('transferVehicleAndVirtualDeviceIds', async () => {
    beforeEach(async () => {
      const mintVirtualDeviceSig1 = await signMessage({
        _signer: virtualDeviceAddress1,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '1'
        }
      });
      const mintVirtualDeviceSig2 = await signMessage({
        _signer: virtualDeviceAddress2,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '2'
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
      const mintVehicleOwnerSig2 = await signMessage({
        _signer: user2,
        _primaryType: 'MintVirtualDeviceSign',
        _verifyingContract: virtualDeviceInstance.address,
        message: {
          integrationNode: '1',
          vehicleNode: '2'
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
      const correctMintInput2 = {
        integrationNode: '1',
        vehicleNode: '2',
        virtualDeviceSig: mintVirtualDeviceSig2,
        vehicleOwnerSig: mintVehicleOwnerSig2,
        virtualDeviceAddr: virtualDeviceAddress2.address,
        attrInfoPairs: C.mockVirtualDeviceAttributeInfoPairs
      };

      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
      await virtualDeviceInstance
        .connect(admin)
        .mintVirtualDeviceSign(correctMintInput1);
      await virtualDeviceInstance
        .connect(admin)
        .mintVirtualDeviceSign(correctMintInput2);
    });

    context('Error handling', () => {
      it('Should revert if vehicle and virtual device are not linked', async () => {
        await expect(
          forwarderInstance
            .connect(user1)
            .transferVehicleAndVirtualDeviceIds(2, 1, user2.address)
        ).to.be.revertedWith(
          `invalidLink("${vehicleIdInstance.address}", "${virtualDeviceIdInstance.address}", 2, 1)`
        );
      });
      it('Should revert if caller is not the vehicle owner', async () => {
        await expect(
          forwarderInstance
            .connect(user2)
            .transferVehicleAndVirtualDeviceIds(1, 1, user2.address)
        ).to.be.revertedWith(
          `transferFailed("${vehicleIdInstance.address}", 1)`
        );
      });
      /// TODO Double check
      it('Should revert if caller is not the virtual device owner', async () => {
        await expect(
          forwarderInstance
            .connect(user1)
            .transferVehicleAndVirtualDeviceIds(1, 1, user2.address)
        ).to.be.revertedWith(
          `transferFailed("${virtualDeviceIdInstance.address}", 1)`
        );
      });
    });

    context('State', () => {
      /// TODO Fix it
      it.skip('Should transfer vehicle ID to the new owner', async () => {
        console.log(user1.address);
        console.log(user2.address);
        console.log(await virtualDeviceIdInstance.ownerOf(1));
        console.log(await virtualDeviceIdInstance.ownerOf(2));
        await forwarderInstance
          .connect(user1)
          .transferVehicleAndVirtualDeviceIds(1, 1, user2.address);

        console.log(await virtualDeviceIdInstance.ownerOf(1));
        console.log(await virtualDeviceIdInstance.ownerOf(2));
        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
    });
  });
});
