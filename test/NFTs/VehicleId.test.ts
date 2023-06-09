import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  Nodes,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  AdLicenseValidator,
  Mapper,
  MockDimoToken,
  MockStake
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

describe('VehicleId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
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

  const [
    admin,
    nonAdmin,
    foundation,
    manufacturer1,
    user1,
    user2,
    adAddress1,
    adAddress2
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
        'Vehicle',
        'AftermarketDevice',
        'AdLicenseValidator',
        'Mapper'
      ],
      nfts: ['ManufacturerId', 'VehicleId', 'AftermarketDeviceId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;

    const MANUFACTURER_MINTER_ROLE = await manufacturerIdInstance.MINTER_ROLE();
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(MANUFACTURER_MINTER_ROLE, dimoRegistryInstance.address);

    const VEHICLE_MINTER_ROLE = await vehicleIdInstance.MINTER_ROLE();
    await vehicleIdInstance
      .connect(admin)
      .grantRole(VEHICLE_MINTER_ROLE, dimoRegistryInstance.address);

    const AD_MINTER_ROLE = await adIdInstance.MINTER_ROLE();
    await adIdInstance
      .connect(admin)
      .grantRole(AD_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerIdProxyAddress(manufacturerIdInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleIdProxyAddress(vehicleIdInstance.address);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(adIdInstance.address);

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
        C.mockManufacturerAttributeInfoPairs
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

    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    const claimOwnerSig1 = await signMessage({
      _signer: user1,
      _primaryType: 'ClaimAftermarketDeviceSign',
      _verifyingContract: aftermarketDeviceInstance.address,
      message: {
        aftermarketDeviceNode: '1',
        owner: user1.address
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
    const pairSignature = await signMessage({
      _signer: user1,
      _primaryType: 'PairAftermarketDeviceSign',
      _verifyingContract: aftermarketDeviceInstance.address,
      message: {
        aftermarketDeviceNode: '1',
        vehicleNode: '1'
      }
    });

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
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
      ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSignature);
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
        vehicleIdInstance
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
        vehicleIdInstance.connect(admin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith('ZeroAddress');
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        vehicleIdInstance
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
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.false;

      await vehicleIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.true;
    });
    it('Should correctly set address as not trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();
      await vehicleIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.true;

      await vehicleIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, false);

      // eslint-disable-next-line no-unused-expressions
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.false;
    });
  });

  context('On transfer', async () => {
    context('Error handling', () => {
      it('Should revert if caller is approved, but not the token owner', async () => {
        await vehicleIdInstance.connect(user1).approve(user2.address, 1);
        await expect(
          vehicleIdInstance
            .connect(user2)
            ['safeTransferFrom(address,address,uint256)'](
              user1.address,
              user2.address,
              1
            )
        ).to.be.revertedWith('Unauthorized');
      });
    });

    context('State', () => {
      it('Should set new owner', async () => {
        expect(await vehicleIdInstance.ownerOf(1)).to.equal(user1.address);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(await vehicleIdInstance.ownerOf(1)).to.equal(user2.address);
      });
      it('Should keep the same parent node', async () => {
        const parentNode = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          1
        );

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(vehicleIdInstance.address, 1)
        ).to.equal(parentNode);
      });
      it('Should keep the aftermarket device pairing', async () => {
        const vehicleIdToAdId = await mapperInstance.getLink(
          vehicleIdInstance.address,
          1
        );
        const adIdToVehicleId = await mapperInstance.getLink(
          adIdInstance.address,
          1
        );

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(vehicleIdInstance.address, 1)
        ).to.equal(vehicleIdToAdId);
        expect(
          await nodesInstance.getParentNode(adIdInstance.address, 1)
        ).to.equal(adIdToVehicleId);
      });
      it('Should keep the same infos', async () => {
        for (const attrInfoPair of C.mockVehicleAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
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

        for (const attrInfoPair of C.mockVehicleAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion = await vehicleIdInstance.tokenIdToVersion(1);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion.add(1)
        );
      });
    });
  });
});
