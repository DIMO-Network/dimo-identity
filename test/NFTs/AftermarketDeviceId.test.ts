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
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  Mapper,
  Shared,
  MockDimoToken,
  MockDimoCredit,
  MockManufacturerLicense
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

describe('AftermarketDeviceId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let dimoAccessControlInstance: DimoAccessControl;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let mapperInstance: Mapper;
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockDimoCreditInstance: MockDimoCredit;
  let mockManufacturerLicenseInstance: MockManufacturerLicense;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let beneficiary1: HardhatEthersSigner;
  let adAddress1: HardhatEthersSigner;
  let adAddress2: HardhatEthersSigner;

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList)
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted)
  );

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      user1,
      user2,
      beneficiary1,
      adAddress1,
      adAddress2
    ] = await ethers.getSigners();

    mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
    mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'Charging',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Vehicle',
        'AftermarketDevice',
        'Mapper',
        'Shared'
      ],
      nfts: ['ManufacturerId', 'VehicleId', 'AftermarketDeviceId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    eip712CheckerInstance = deployments.Eip712Checker;
    chargingInstance = deployments.Charging;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    mapperInstance = deployments.Mapper;
    sharedInstance = deployments.Shared;
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;

    DIMO_REGISTRY_ADDRESS = await dimoRegistryInstance.getAddress();

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory = await ethers.getContractFactory(
      'MockDimoToken'
    );
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18
    );

    // Deploy MockDimoCredit contract
    const MockDimoCreditFactory = await ethers.getContractFactory(
      'MockDimoCredit'
    );
    mockDimoCreditInstance = await MockDimoCreditFactory.connect(admin).deploy();

    // Deploy MockManufacturerLicense contract
    const MockManufacturerLicenseFactory = await ethers.getContractFactory('MockManufacturerLicense');
    mockManufacturerLicenseInstance = await MockManufacturerLicenseFactory.connect(admin).deploy();

    await grantAdminRoles(admin, dimoAccessControlInstance);

    // Grant NFT minter roles to DIMO Registry contract
    await manufacturerIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await vehicleIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);

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
      C.defaultDomainVersion
    );

    // Mint DIMO Credit tokens to the admin and manufacturer
    await mockDimoCreditInstance
      .connect(admin)
      .mint(admin.address, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(manufacturer1.address, C.manufacturerDimoCreditTokensAmount);

    // Grant BURNER role to DIMORegistry
    await mockDimoCreditInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Setup Shared variables
    await sharedInstance
      .connect(admin)
      .setDimoToken(await mockDimoTokenInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setDimoCredit(await mockDimoCreditInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setManufacturerLicense(await mockManufacturerLicenseInstance.getAddress());

    // Setup Charging variables
    await chargingInstance
      .connect(admin)
      .setDcxOperationCost(C.MINT_VEHICLE_OPERATION, C.MINT_VEHICLE_OPERATION_COST);
    await chargingInstance
      .connect(admin)
      .setDcxOperationCost(C.MINT_AD_OPERATION, C.MINT_AD_OPERATION_COST);

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

    await mockManufacturerLicenseInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Minting aftermarket devices for testing
    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);

    await aftermarketDeviceInstance
      .connect(manufacturer1)
      .mintAftermarketDeviceByManufacturerBatch(
        1,
        mockAftermarketDeviceInfosList
      );

    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    const claimOwnerSig1 = await signMessage({
      _signer: user1,
      _primaryType: 'ClaimAftermarketDeviceSign',
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: '1',
        owner: user1.address
      }
    });
    const claimAdSig1 = await signMessage({
      _signer: adAddress1,
      _primaryType: 'ClaimAftermarketDeviceSign',
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: '1',
        owner: user1.address
      }
    });
    const claimOwnerSig2 = await signMessage({
      _signer: user1,
      _primaryType: 'ClaimAftermarketDeviceSign',
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: '2',
        owner: user1.address
      }
    });
    const claimAdSig2 = await signMessage({
      _signer: adAddress2,
      _primaryType: 'ClaimAftermarketDeviceSign',
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: '2',
        owner: user1.address
      }
    });
    const pairSignature = await signMessage({
      _signer: user1,
      _primaryType: 'PairAftermarketDeviceSign',
      _verifyingContract: await aftermarketDeviceInstance.getAddress(),
      message: {
        aftermarketDeviceNode: '1',
        vehicleNode: '1'
      }
    });

    await vehicleInstance
      .connect(admin)
      ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);
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
        user1.address,
        claimOwnerSig2,
        claimAdSig2
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
        adIdInstance.connect(nonAdmin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
    it('Should revert if addr is zero address', async () => {
      await expect(
        adIdInstance.connect(admin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWithCustomError(adIdInstance, 'ZeroAddress');
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        adIdInstance.connect(nonAdmin).setTrustedForwarder(C.ZERO_ADDRESS, true)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set address as trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();

      // eslint-disable-next-line no-unused-expressions
      expect(await adIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .false;

      await adIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await adIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .true;
    });
    it('Should correctly set address as not trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();
      await adIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await adIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .true;

      await adIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, false);

      // eslint-disable-next-line no-unused-expressions
      expect(await adIdInstance.trustedForwarders(mockForwarder.address)).to.be
        .false;
    });
  });

  describe('getDefinitionURI', () => {
    it('Should return the empty if no definition is set in the token', async () => {
      const definitionUriReturn = await adIdInstance.getDefinitionURI(1);

      expect(definitionUriReturn).to.eq('');
    });
    it('Should correctly return the definitionURI set in the token', async () => {
      const customDefinitionUri = 'custom.definition.uri';

      await aftermarketDeviceInstance.addAftermarketDeviceAttribute(
        'DefinitionURI'
      );
      await aftermarketDeviceInstance
        .connect(admin)
        .setAftermarketDeviceInfo(1, [
          {
            attribute: 'DefinitionURI',
            info: customDefinitionUri
          }
        ]);

      const definitionUriReturn = await adIdInstance.getDefinitionURI(1);

      expect(definitionUriReturn).to.equal(customDefinitionUri);
    });
  });

  context('On transfer', async () => {
    context('Error handling', () => {
      it('Should revert if caller is approved, but not the token owner or DimoRegistry', async () => {
        await adIdInstance.connect(user1).approve(user2.address, 1);
        await expect(
          adIdInstance
            .connect(user2)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          )
        ).to.be.revertedWithCustomError(adIdInstance, 'Unauthorized');
      });
    });

    context('State', () => {
      it('Should set new owner', async () => {
        expect(await adIdInstance.ownerOf(2)).to.equal(user1.address);

        await adIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          2
        );

        expect(await adIdInstance.ownerOf(2)).to.equal(user2.address);
      });
      it('Should keep the same parent node', async () => {
        const parentNode = await nodesInstance.getParentNode(
          await adIdInstance.getAddress(),
          2
        );

        await adIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          2
        );

        expect(
          await nodesInstance.getParentNode(await adIdInstance.getAddress(), 2)
        ).to.equal(parentNode);
      });
      it('Should keep the same infos', async () => {
        expect(
          await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
            adAddress2.address
          )
        ).to.equal(2);
        for (const attrInfoPair of mockAftermarketDeviceInfosList[1]
          .attrInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await adIdInstance.getAddress(),
              2,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }

        await adIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          2
        );

        expect(
          await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
            adAddress2.address
          )
        ).to.equal(2);
        for (const attrInfoPair of mockAftermarketDeviceInfosList[1]
          .attrInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              await adIdInstance.getAddress(),
              2,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion = await adIdInstance.tokenIdToVersion(2);

        await adIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          2
        );

        expect(await adIdInstance.tokenIdToVersion(2)).to.equal(
          previousVersion + ethers.toBigInt(1)
        );
      });
      it('Should reset aftermarket device beneficiary', async () => {
        await mapperInstance
          .connect(user1)
          .setAftermarketDeviceBeneficiary(2, beneficiary1.address);

        expect(
          await mapperInstance.getBeneficiary(await adIdInstance.getAddress(), 2)
        ).to.equal(beneficiary1.address);

        await adIdInstance
          .connect(user1)
        ['safeTransferFrom(address,address,uint256)'](
          user1.address,
          user2.address,
          2
        );

        expect(
          await mapperInstance.getBeneficiary(await adIdInstance.getAddress(), 2)
        ).to.equal(user2.address);
      });
    });
  });

  describe('burn', () => {
    context('Error handling', () => {
      it('Should revert if caller is not the DIMORegistry', async () => {
        await expect(adIdInstance.connect(user1).burn(1))
          .to.be.revertedWithCustomError(adIdInstance, 'Unauthorized');
      });
    });
  });
});
