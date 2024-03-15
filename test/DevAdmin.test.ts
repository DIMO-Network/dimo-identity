import chai from 'chai';
import { EventLog } from 'ethers';
import { ethers, HardhatEthersSigner } from 'hardhat';

import {
  streamRegistryABI,
  streamRegistryBytecode,
  ENSCacheV2ABI,
  ENSCacheV2Bytecode
} from '@streamr/network-contracts';
import type { StreamRegistry, ENSCacheV2 } from '@streamr/network-contracts';

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
  AftermarketDevice,
  AftermarketDeviceId,
  SyntheticDevice,
  SyntheticDeviceId,
  AdLicenseValidator,
  Mapper,
  StreamrConfigurator,
  MockDimoToken,
  MockStake,
  DevAdmin,
} from '../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  IdManufacturerName,
  C,
} from '../utils';

const { expect } = chai;

describe('DevAdmin', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let syntheticDeviceInstance: SyntheticDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let devAdminInstance: DevAdmin;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let sdIdInstance: SyntheticDeviceId;
  let streamrConfiguratorInstance: StreamrConfigurator;
  let ensCache: ENSCacheV2;
  let streamRegistry: StreamRegistry;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let foundation: HardhatEthersSigner;
  let streamrAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let manufacturer2: HardhatEthersSigner;
  let manufacturer3: HardhatEthersSigner;
  let integrationOwner1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let adAddress1: HardhatEthersSigner;
  let adAddress2: HardhatEthersSigner;
  let sdAddress1: HardhatEthersSigner;
  let sdAddress2: HardhatEthersSigner;

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList),
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted),
  );

  async function setupStreamr() {
    const ensCacheFactory = new ethers.ContractFactory(ENSCacheV2ABI, ENSCacheV2Bytecode, streamrAdmin);
    ensCache = await ensCacheFactory.deploy() as unknown as ENSCacheV2
    const streamRegistryFactory = new ethers.ContractFactory(streamRegistryABI, streamRegistryBytecode, streamrAdmin);
    streamRegistry = await streamRegistryFactory.deploy() as unknown as StreamRegistry;

    await streamRegistry
      .connect(streamrAdmin)
      .initialize(await ensCache.getAddress(), ethers.ZeroAddress);
    await ensCache
      .connect(streamrAdmin)
      .initialize(streamrAdmin.address, await streamRegistry.getAddress(), ethers.ZeroAddress);
    await streamRegistry
      .connect(streamrAdmin)
      .grantRole(C.TRUSTED_ROLE, await ensCache.getAddress());
  }

  before(async () => {
    [
      admin,
      nonAdmin,
      foundation,
      streamrAdmin,
      manufacturer1,
      manufacturer2,
      manufacturer3,
      integrationOwner1,
      user1,
      user2,
      adAddress1,
      adAddress2,
      sdAddress1,
      sdAddress2
    ] = await ethers.getSigners();
    mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
    mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

    const deployments = await setup(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Integration',
        'Vehicle',
        'AftermarketDevice',
        'SyntheticDevice',
        'AdLicenseValidator',
        'Mapper',
        'StreamrConfigurator',
        'DevAdmin'
      ],
      nfts: [
        'ManufacturerId',
        'IntegrationId',
        'VehicleId',
        'AftermarketDeviceId',
        'SyntheticDeviceId',
      ],
      upgradeableContracts: [],
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    eip712CheckerInstance = deployments.Eip712Checker;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
    devAdminInstance = deployments.DevAdmin;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;
    sdIdInstance = deployments.SyntheticDeviceId;
    streamrConfiguratorInstance = deployments.StreamrConfigurator;

    DIMO_REGISTRY_ADDRESS = await dimoRegistryInstance.getAddress();

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
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_MINTER_ROLE, DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, DIMO_REGISTRY_ADDRESS);

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
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(await adIdInstance.getAddress());
    await syntheticDeviceInstance
      .connect(admin)
      .setSyntheticDeviceIdProxyAddress(await sdIdInstance.getAddress());

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion,
    );

    // Deploy MockDimoToken contract
    const MockDimoTokenFactory =
      await ethers.getContractFactory('MockDimoToken');
    mockDimoTokenInstance = await MockDimoTokenFactory.connect(admin).deploy(
      C.oneBillionE18,
    );

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(
        DIMO_REGISTRY_ADDRESS,
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

    // Whitelist SyntheticDevice attributes
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute1);
    await syntheticDeviceInstance
      .connect(admin)
      .addSyntheticDeviceAttribute(C.mockSyntheticDeviceAttribute2);

    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer1.address,
        C.mockManufacturerNames[0],
        C.mockManufacturerAttributeInfoPairs,
      );
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer2.address,
        C.mockManufacturerNames[1],
        C.mockManufacturerAttributeInfoPairs,
      );
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        manufacturer3.address,
        C.mockManufacturerNames[2],
        C.mockManufacturerAttributeInfoPairs,
      );

    // Mint Integration Node
    await integrationInstance
      .connect(admin)
      .mintIntegration(
        integrationOwner1.address,
        C.mockIntegrationNames[0],
        C.mockIntegrationAttributeInfoPairs,
      );

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(
        C.NFT_TRANSFERER_ROLE,
        DIMO_REGISTRY_ADDRESS,
      );

    // Approve DIMO Registry to spend manufacturer1's tokens
    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);

    // Approve DIMO Registry to spend user1's tokens
    await adIdInstance
      .connect(user1)
      .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);

    // Setting DimoRegistry address in the Proxy IDs
    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await integrationIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    // Setting DimoRegistry address in the AftermarketDeviceId
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    await setupStreamr();

    await streamrConfiguratorInstance
      .connect(admin)
      .setStreamRegistry(await streamRegistry.getAddress());
    await streamrConfiguratorInstance
      .connect(admin)
      .setDimoBaseStreamId(C.DIMO_STREAMR_ENS);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('transferAftermarketDeviceOwnership', () => {
    let ownerSig: string;
    let adSig: string;
    before(async () => {
      ownerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_TRANSFER_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .transferAftermarketDeviceOwnership(1, user2.address),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_AD_TRANSFER_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .transferAftermarketDeviceOwnership(99, user2.address),
        ).to.be.rejectedWith('Invalid AD node');
      });
    });

    context('State', () => {
      it('Should correctly set new node owner', async () => {
        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);

        await devAdminInstance
          .connect(admin)
          .transferAftermarketDeviceOwnership(1, user2.address);

        expect(await adIdInstance.ownerOf(1)).to.be.equal(user2.address);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceTransferredDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .transferAftermarketDeviceOwnership(1, user2.address),
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceTransferredDevAdmin')
          .withArgs(1, user1.address, user2.address);
      });
    });
  });

  describe('unclaimAftermarketDeviceNode', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimOwnerSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address,
        },
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address,
        },
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
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
          user1.address,
          claimOwnerSig2,
          claimAdSig2,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_UNCLAIM_ROLE', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).unclaimAftermarketDeviceNode([1]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_AD_UNCLAIM_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 99]),
        ).to.be.rejectedWith('Invalid AD node');
      });
    });

    context('State', () => {
      it('Should correctly unclaim aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              1,
              user1.address,
              claimOwnerSig1,
              claimAdSig1,
            ),
        ).to.be.rejectedWith('DeviceAlreadyClaimed(1)');
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              claimOwnerSig2,
              claimAdSig2,
            ),
        ).to.be.rejectedWith('DeviceAlreadyClaimed(2)');

        await devAdminInstance
          .connect(admin)
          .unclaimAftermarketDeviceNode([1, 2]);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              1,
              user1.address,
              claimOwnerSig1,
              claimAdSig1,
            ),
        ).to.not.be.rejected;
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              claimOwnerSig2,
              claimAdSig2,
            ),
        ).to.not.be.rejected;
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnclaimedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance.connect(admin).unclaimAftermarketDeviceNode([1, 2]),
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnclaimedDevAdmin')
          .withArgs(1)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnclaimedDevAdmin')
          .withArgs(2);
      });
    });
  });

  describe('unpairAftermarketDeviceByDeviceNode', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    let pairSig1: string;
    let pairSig2: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimOwnerSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address,
        },
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address,
        },
      });
      pairSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
        },
      });
      pairSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '2',
        },
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
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
          user1.address,
          claimOwnerSig2,
          claimAdSig2,
        );
      await aftermarketDeviceInstance
        .connect(admin)
      ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
      await aftermarketDeviceInstance
        .connect(admin)
      ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_UNPAIR_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByDeviceNode([2]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_AD_UNPAIR_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 99]),
        ).to.be.rejectedWith('Invalid AD node');
      });
    });

    context('State', () => {
      it('Should correctly delete mapping of the aftermarket device to the vehicle', async () => {
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 2),
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode([1, 2]);

        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 2),
        ).to.be.equal(0);
      });
      it('Should correctly delete mapping of the vehicle to the aftermarket device', async () => {
        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1),
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 2),
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByDeviceNode([1, 2]);

        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 2),
        ).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpairedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByDeviceNode([1, 2]),
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(2, 2, user1.address);
      });
    });
  });

  describe('unpairAftermarketDeviceByVehicleNode', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    let pairSig1: string;
    let pairSig2: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimOwnerSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address,
        },
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          owner: user1.address,
        },
      });
      pairSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
        },
      });
      pairSig2 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '2',
        },
      });
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
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
          user1.address,
          claimOwnerSig2,
          claimAdSig2,
        );
      await aftermarketDeviceInstance
        .connect(admin)
      ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
      await aftermarketDeviceInstance
        .connect(admin)
      ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_UNPAIR_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceByVehicleNode([4, 5]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_AD_UNPAIR_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode([1, 99]),
        ).to.be.rejectedWith('Invalid vehicle node');
      });
    });

    context('State', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 2),
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode([1, 2]);

        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 2),
        ).to.be.equal(0);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1),
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 2),
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .unpairAftermarketDeviceByVehicleNode([1, 2]);

        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 2),
        ).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpairedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .unpairAftermarketDeviceByVehicleNode([1, 2]),
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(2, 2, user1.address);
      });
    });
  });

  describe('renameManufacturers', () => {
    const newIdManufacturerNames: IdManufacturerName[] = [
      { tokenId: '1', name: 'NewManufacturer1' },
      { tokenId: '2', name: 'NewManufacturer2' },
      { tokenId: '3', name: 'NewManufacturer3' },
    ];

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_RENAME_MANUFACTURERS_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .renameManufacturers(newIdManufacturerNames),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_RENAME_MANUFACTURERS_ROLE
          }`,
        );
      });
      it('Should revert if token Id does not exist', async () => {
        const invalidNewIdManufacturerNames = [
          { tokenId: '99', name: 'NewManufacturer99' },
        ];

        await expect(
          devAdminInstance
            .connect(admin)
            .renameManufacturers(invalidNewIdManufacturerNames),
        ).to.be.rejectedWith('Invalid manufacturer node');
      });
    });

    context('State', () => {
      it('Should rename manufacturers', async () => {
        for (let i = 0; i < C.mockManufacturerNames.length; i++) {
          const idReturned = await manufacturerInstance.getManufacturerIdByName(
            C.mockManufacturerNames[i],
          );
          const nameReturned =
            await manufacturerInstance.getManufacturerNameById(i + 1);

          expect(idReturned).to.equal(i + 1);
          expect(nameReturned).to.equal(C.mockManufacturerNames[i]);
        }

        await devAdminInstance
          .connect(admin)
          .renameManufacturers(newIdManufacturerNames);

        for (let i = 0; i < newIdManufacturerNames.length; i++) {
          const idReturned = await manufacturerInstance.getManufacturerIdByName(
            newIdManufacturerNames[i].name,
          );
          const nameReturned =
            await manufacturerInstance.getManufacturerNameById(
              newIdManufacturerNames[i].tokenId,
            );

          expect(idReturned).to.equal(newIdManufacturerNames[i].tokenId);
          expect(nameReturned).to.equal(newIdManufacturerNames[i].name);
        }
      });
    });
  });

  describe('adminBurnVehicles', () => {
    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_VEHICLE_BURN_ROLE', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).adminBurnVehicles([1, 2]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_VEHICLE_BURN_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance.connect(admin).adminBurnVehicles([1, 99]),
        ).to.be.rejectedWith(
          `InvalidNode("${await vehicleIdInstance.getAddress()}", 99)`,
        );
      });
      it('Should revert if Vehicle is paired to an Aftermarket Device', async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address,
          },
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address,
          },
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1',
          },
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(
            await aftermarketDeviceInstance.getAddress(),
            true,
          );
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList,
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig,
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          localPairSignature,
        );

        await expect(
          devAdminInstance.connect(admin).adminBurnVehicles([1, 2]),
        ).to.be.rejectedWith('VehiclePaired(1)');
      });
      it('Should revert if Vehicle is paired to a Synthetic Device', async () => {
        const localMintVehicleOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            integrationNode: '1',
            vehicleNode: '1',
          },
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            integrationNode: '1',
            vehicleNode: '1',
          },
        });
        const localMintSdInput = {
          integrationNode: '1',
          vehicleNode: '1',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(localMintSdInput);

        await expect(
          devAdminInstance.connect(admin).adminBurnVehicles([1, 2]),
        ).to.be.rejectedWith('VehiclePaired(1)');
      });
    });

    context('State', () => {
      it('Should correctly reset vehicle parent node to 0', async () => {
        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        const parentNode1 = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          1,
        );
        const parentNode2 = await nodesInstance.getParentNode(
          await vehicleIdInstance.getAddress(),
          2,
        );

        expect(parentNode1).to.be.equal(0);
        expect(parentNode2).to.be.equal(0);
      });
      it('Should correctly reset vehicle node owner to zero address', async () => {
        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        await expect(vehicleIdInstance.ownerOf(1)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
        await expect(vehicleIdInstance.ownerOf(2)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
      });
      it('Should correctly reset device definition Id to empty if it was minted with DD', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleWithDeviceDefinition(1, user1.address, C.mockDdId1);
        await vehicleInstance
          .connect(admin)
          .mintVehicleWithDeviceDefinition(1, user1.address, C.mockDdId2);

        expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(3)).to.be.equal(C.mockDdId1);
        expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(4)).to.be.equal(C.mockDdId2);

        await devAdminInstance.connect(admin).adminBurnVehicles([3, 4]);

        expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(3)).to.be.empty;
        expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(4)).to.be.empty;
      });
      it('Should correctly reset vehicle infos to blank', async () => {
        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            1,
            C.mockVehicleAttribute2,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            2,
            C.mockVehicleAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await vehicleIdInstance.getAddress(),
            2,
            C.mockVehicleAttribute2,
          ),
        ).to.be.equal('');
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion1 = await vehicleIdInstance.tokenIdToVersion(1);
        const previousVersion2 = await vehicleIdInstance.tokenIdToVersion(2);

        await devAdminInstance.connect(admin).adminBurnVehicles([1, 2]);

        expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion1 + ethers.toBigInt(1),
        );
        expect(await vehicleIdInstance.tokenIdToVersion(2)).to.equal(
          previousVersion2 + ethers.toBigInt(1),
        );
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeBurnedDevAdmin event with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnVehicles([1, 2]))
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(1, user1.address)
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(2, user2.address);
      });
      it('Should emit VehicleAttributeSetDevAdmin events with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnVehicles([1, 2]))
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[1].attribute, '');
      });
    });
  });

  describe('adminBurnVehiclesAndDeletePairings', () => {
    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_VEHICLE_BURN_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .adminBurnVehiclesAndDeletePairings([1, 2]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_VEHICLE_BURN_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 99]),
        ).to.be.rejectedWith(
          `InvalidNode("${await vehicleIdInstance.getAddress()}", 99)`,
        );
      });
    });

    context('State', () => {
      beforeEach(async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address,
          },
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address,
          },
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1',
          },
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(
            await aftermarketDeviceInstance.getAddress(),
            true,
          );
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList,
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig,
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          localPairSignature,
        );

        const localMintVehicleOwnerSig = await signMessage({
          _signer: user2,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            integrationNode: '1',
            vehicleNode: '2',
          },
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            integrationNode: '1',
            vehicleNode: '2',
          },
        });
        const localMintSdInput = {
          integrationNode: '1',
          vehicleNode: '2',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(localMintSdInput);
      });

      context('Vehicle', () => {
        it('Should correctly reset vehicle parent node to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          const parentNode1 = await nodesInstance.getParentNode(
            await vehicleIdInstance.getAddress(),
            1,
          );
          const parentNode2 = await nodesInstance.getParentNode(
            await vehicleIdInstance.getAddress(),
            2,
          );

          expect(parentNode1).to.be.equal(0);
          expect(parentNode2).to.be.equal(0);
        });
        it('Should correctly reset vehicle node owner to zero address', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          await expect(vehicleIdInstance.ownerOf(1)).to.be.rejectedWith(
            'ERC721: invalid token ID',
          );
          await expect(vehicleIdInstance.ownerOf(2)).to.be.rejectedWith(
            'ERC721: invalid token ID',
          );
        });
        it('Should correctly reset device definition Id to empty if it was minted with DD', async () => {
          await vehicleInstance
            .connect(admin)
            .mintVehicleWithDeviceDefinition(1, user1.address, C.mockDdId1);
          await vehicleInstance
            .connect(admin)
            .mintVehicleWithDeviceDefinition(1, user1.address, C.mockDdId2);
  
          expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(3)).to.be.equal(C.mockDdId1);
          expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(4)).to.be.equal(C.mockDdId2);
  
          await devAdminInstance.connect(admin).adminBurnVehiclesAndDeletePairings([3, 4]);
  
          expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(3)).to.be.empty;
          expect(await vehicleInstance.getDeviceDefinitionIdByVehicleId(4)).to.be.empty;
        });
        it('Should correctly reset vehicle infos to blank', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await nodesInstance.getInfo(
              await vehicleIdInstance.getAddress(),
              1,
              C.mockVehicleAttribute1,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              await vehicleIdInstance.getAddress(),
              1,
              C.mockVehicleAttribute2,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              await vehicleIdInstance.getAddress(),
              2,
              C.mockVehicleAttribute1,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              await vehicleIdInstance.getAddress(),
              2,
              C.mockVehicleAttribute2,
            ),
          ).to.be.equal('');
        });
        it('Should update multi-privilege token version', async () => {
          const previousVersion1 = await vehicleIdInstance.tokenIdToVersion(1);
          const previousVersion2 = await vehicleIdInstance.tokenIdToVersion(2);

          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
            previousVersion1 + ethers.toBigInt(1),
          );
          expect(await vehicleIdInstance.tokenIdToVersion(2)).to.equal(
            previousVersion2 + ethers.toBigInt(1),
          );
        });
      });

      context('Aftermarket Device paired', () => {
        it('Should correctly reset mapping the aftermarket device to vehicle to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getLink(
              await vehicleIdInstance.getAddress(),
              1,
            ),
          ).to.be.equal(0);
        });
        it('Should correctly reset mapping the vehicle to aftermarket device to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
          ).to.be.equal(0);
        });
      });

      context('Synthetic Device paired', () => {
        it('Should correctly reset synthetic device parent node to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          const parentNode = await nodesInstance.getParentNode(
            await sdIdInstance.getAddress(),
            1,
          );

          expect(parentNode).to.be.equal(0);
        });
        it('Should correctly reset synthetic device node owner to zero address', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          await expect(sdIdInstance.ownerOf(1)).to.be.rejectedWith(
            'ERC721: invalid token ID',
          );
        });
        it('Should correctly reset synthetic device address do zero address', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          const id =
            await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
              sdAddress1.address,
            );

          expect(id).to.equal(0);
        });
        it('Should correctly reset synthetic device infos to blank', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await nodesInstance.getInfo(
              await sdIdInstance.getAddress(),
              1,
              C.mockSyntheticDeviceAttribute1,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              await sdIdInstance.getAddress(),
              1,
              C.mockSyntheticDeviceAttribute2,
            ),
          ).to.be.equal('');
        });
        it('Should correctly reset mapping the synthetic device to vehicle to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getNodeLink(
              await vehicleIdInstance.getAddress(),
              await sdIdInstance.getAddress(),
              2,
            ),
          ).to.be.equal(0);
        });
        it('Should correctly reset mapping the vehicle to synthetic device to 0', async () => {
          await devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]);

          expect(
            await mapperInstance.getNodeLink(
              await sdIdInstance.getAddress(),
              await vehicleIdInstance.getAddress(),
              1,
            ),
          ).to.be.equal(0);
        });
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnpairedDevAdmin event with correct params', async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address,
          },
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address,
          },
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1',
          },
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(
            await aftermarketDeviceInstance.getAddress(),
            true,
          );
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList,
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig,
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          localPairSignature,
        );

        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]),
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(1, 1, user1.address);
      });
      it('Should emit SyntheticDeviceNodeBurnedDevAdmin event with correct params', async () => {
        const localMintVehicleOwnerSig = await signMessage({
          _signer: user2,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            integrationNode: '1',
            vehicleNode: '2',
          },
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: await syntheticDeviceInstance.getAddress(),
          message: {
            integrationNode: '1',
            vehicleNode: '2',
          },
        });
        const localMintSdInput = {
          integrationNode: '1',
          vehicleNode: '2',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(localMintSdInput);

        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]),
        )
          .to.emit(devAdminInstance, 'SyntheticDeviceNodeBurnedDevAdmin')
          .withArgs(1, 2, user2.address);
      });
      it('Should emit VehicleNodeBurnedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]),
        )
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(1, user1.address)
          .to.emit(devAdminInstance, 'VehicleNodeBurnedDevAdmin')
          .withArgs(2, user2.address);
      });
      it('Should emit VehicleAttributeSetDevAdmin events with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnVehiclesAndDeletePairings([1, 2]),
        )
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'VehicleAttributeSetDevAdmin')
          .withArgs(2, C.mockVehicleAttributeInfoPairs[1].attribute, '');
      });
    });
  });

  describe('adminBurnAftermarketDevices', () => {
    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_BURN_ROLE', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).adminBurnAftermarketDevices([1, 2]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_AD_BURN_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 99]),
        ).to.be.rejectedWith(
          `InvalidNode("${await adIdInstance.getAddress()}", 99)`,
        );
      });
      it('Should revert if Vehicle is paired to an Aftermarket Device', async () => {
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1',
          },
        });

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceBatch(1, [{ aftermarketDeviceNodeId: '1', owner: await user1.address }]);

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          localPairSignature,
        );

        await expect(
          devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]),
        ).to.be.rejectedWith('AdPaired(1)');
      });
    });

    context('State', () => {
      it('Should correctly reset Aftermarket Device parent node to 0', async () => {
        await devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]);

        const parentNode1 = await nodesInstance.getParentNode(
          await adIdInstance.getAddress(),
          1,
        );
        const parentNode2 = await nodesInstance.getParentNode(
          await adIdInstance.getAddress(),
          2,
        );

        expect(parentNode1).to.be.equal(0);
        expect(parentNode2).to.be.equal(0);
      });
      it('Should correctly set nodes as not claimed', async () => {
        const localAdOwnerPairs = [
          { aftermarketDeviceNodeId: '1', owner: await user1.address },
          { aftermarketDeviceNodeId: '2', owner: await user2.address },
        ];
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.true;
        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.true;

        await devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]);

        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.false;
        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.false;
      });
      it('Should correctly reset Aftermarket Device node owner to zero address', async () => {
        await devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]);

        await expect(adIdInstance.ownerOf(1)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
        await expect(adIdInstance.ownerOf(2)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
      });
      it('Should correctly reset Aftermarket Device infos to blank', async () => {
        await devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]);

        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            1,
            C.mockAftermarketDeviceAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            1,
            C.mockAftermarketDeviceAttribute2,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            2,
            C.mockAftermarketDeviceAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            2,
            C.mockAftermarketDeviceAttribute2,
          ),
        ).to.be.equal('');
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion1 = await adIdInstance.tokenIdToVersion(1);
        const previousVersion2 = await adIdInstance.tokenIdToVersion(2);

        await devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]);

        expect(await adIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion1 + ethers.toBigInt(1),
        );
        expect(await adIdInstance.tokenIdToVersion(2)).to.equal(
          previousVersion2 + ethers.toBigInt(1),
        );
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceNodeBurnedDevAdmin event with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]))
          .to.emit(devAdminInstance, 'AftermarketDeviceNodeBurnedDevAdmin')
          .withArgs(1, manufacturer1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceNodeBurnedDevAdmin')
          .withArgs(2, manufacturer1.address);
      });
      it('Should emit AftermarketDeviceAttributeSetDevAdmin events with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnAftermarketDevices([1, 2]))
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(1, C.mockAdAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(1, C.mockAdAttributeInfoPairs[1].attribute, '')
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(2, C.mockAdAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(2, C.mockAdAttributeInfoPairs[1].attribute, '');
      });
    });
  });

  describe('adminBurnAftermarketDevicesAndDeletePairings', () => {
    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_BURN_ROLE', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_AD_BURN_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 99]),
        ).to.be.rejectedWith(
          `InvalidNode("${await adIdInstance.getAddress()}", 99)`,
        );
      });
    });

    context('State', () => {
      beforeEach(async () => {
        const localAdOwnerPairs = [
          { aftermarketDeviceNodeId: '1', owner: await user1.address },
          { aftermarketDeviceNodeId: '2', owner: await user2.address },
        ];
        const localPairSignature1 = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1',
          },
        });
        const localPairSignature2 = await signMessage({
          _signer: user2,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '2',
            vehicleNode: '2',
          },
        });

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
        await vehicleInstance
          .connect(admin)
          .mintVehicle(2, user2.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          localPairSignature1,
        );
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          2,
          2,
          localPairSignature2,
        );
      });

      it('Should correctly reset mapping the aftermarket device to vehicle to 0', async () => {
        expect(
          await mapperInstance.getLink(
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(
            await vehicleIdInstance.getAddress(),
            2,
          ),
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .adminBurnAftermarketDevicesAndDeletePairings([1, 2]);

        expect(
          await mapperInstance.getLink(
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(
            await vehicleIdInstance.getAddress(),
            2,
          ),
        ).to.be.equal(0);
      });
      it('Should correctly reset mapping the vehicle to aftermarket device to 0', async () => {
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 2),
        ).to.be.equal(2);

        await devAdminInstance
          .connect(admin)
          .adminBurnAftermarketDevicesAndDeletePairings([1, 2]);

        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 2),
        ).to.be.equal(0);
      });
      it('Should correctly reset Aftermarket Device parent node to 0', async () => {
        await devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]);

        const parentNode1 = await nodesInstance.getParentNode(
          await adIdInstance.getAddress(),
          1,
        );
        const parentNode2 = await nodesInstance.getParentNode(
          await adIdInstance.getAddress(),
          2,
        );

        expect(parentNode1).to.be.equal(0);
        expect(parentNode2).to.be.equal(0);
      });
      it('Should correctly set nodes as not claimed', async () => {
        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.true;
        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.true;

        await devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]);

        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.false;
        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.false;
      });
      it('Should correctly reset Aftermarket Device node owner to zero address', async () => {
        await devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]);

        await expect(adIdInstance.ownerOf(1)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
        await expect(adIdInstance.ownerOf(2)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
      });
      it('Should correctly reset Aftermarket Device infos to blank', async () => {
        await devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]);

        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            1,
            C.mockAftermarketDeviceAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            1,
            C.mockAftermarketDeviceAttribute2,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            2,
            C.mockAftermarketDeviceAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await adIdInstance.getAddress(),
            2,
            C.mockAftermarketDeviceAttribute2,
          ),
        ).to.be.equal('');
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion1 = await adIdInstance.tokenIdToVersion(1);
        const previousVersion2 = await adIdInstance.tokenIdToVersion(2);

        await devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]);

        expect(await adIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion1 + ethers.toBigInt(1),
        );
        expect(await adIdInstance.tokenIdToVersion(2)).to.equal(
          previousVersion2 + ethers.toBigInt(1),
        );
      });
    });

    context('Events', () => {
      beforeEach(async () => {
        const localAdOwnerPairs = [
          { aftermarketDeviceNodeId: '1', owner: await user1.address },
          { aftermarketDeviceNodeId: '2', owner: await user2.address },
        ];
        const localPairSignature1 = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1',
          },
        });
        const localPairSignature2 = await signMessage({
          _signer: user2,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: await aftermarketDeviceInstance.getAddress(),
          message: {
            aftermarketDeviceNode: '2',
            vehicleNode: '2',
          },
        });

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
        await vehicleInstance
          .connect(admin)
          .mintVehicle(2, user2.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          localPairSignature1,
        );
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          2,
          2,
          localPairSignature2,
        );
      });

      it('Should emit AftermarketDeviceUnpairedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnAftermarketDevicesAndDeletePairings([1, 2]),
        )
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceUnpairedDevAdmin')
          .withArgs(2, 2, user2.address);
      });
      it('Should emit AftermarketDeviceNodeBurnedDevAdmin event with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]))
          .to.emit(devAdminInstance, 'AftermarketDeviceNodeBurnedDevAdmin')
          .withArgs(1, user1.address)
          .to.emit(devAdminInstance, 'AftermarketDeviceNodeBurnedDevAdmin')
          .withArgs(2, user2.address);
      });
      it('Should emit After2arketDeviceAttributeSetDevAdmin events with correct params', async () => {
        await expect(devAdminInstance.connect(admin).adminBurnAftermarketDevicesAndDeletePairings([1, 2]))
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(1, C.mockAdAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(1, C.mockAdAttributeInfoPairs[1].attribute, '')
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(2, C.mockAdAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'AftermarketDeviceAttributeSetDevAdmin')
          .withArgs(2, C.mockAdAttributeInfoPairs[1].attribute, '');
      });
    });
  });

  describe('adminBurnSyntheticDevicesAndDeletePairings', () => {
    beforeEach(async () => {
      const localMintVehicleOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          integrationNode: '1',
          vehicleNode: '1',
        },
      });
      const localMintVehicleOwnerSig2 = await signMessage({
        _signer: user2,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          integrationNode: '1',
          vehicleNode: '2',
        },
      });
      const mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          integrationNode: '1',
          vehicleNode: '1',
        },
      });
      const mintSyntheticDeviceSig2 = await signMessage({
        _signer: sdAddress2,
        _primaryType: 'MintSyntheticDeviceSign',
        _verifyingContract: await syntheticDeviceInstance.getAddress(),
        message: {
          integrationNode: '1',
          vehicleNode: '2',
        },
      });
      const localMintSdInput1 = {
        integrationNode: '1',
        vehicleNode: '1',
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        vehicleOwnerSig: localMintVehicleOwnerSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };
      const localMintSdInput2 = {
        integrationNode: '1',
        vehicleNode: '2',
        syntheticDeviceSig: mintSyntheticDeviceSig2,
        vehicleOwnerSig: localMintVehicleOwnerSig2,
        syntheticDeviceAddr: sdAddress2.address,
        attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs,
      };

      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);

      await syntheticDeviceInstance
        .connect(admin)
        .mintSyntheticDeviceSign(localMintSdInput1);
      await syntheticDeviceInstance
        .connect(admin)
        .mintSyntheticDeviceSign(localMintSdInput2);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_SD_BURN_ROLE', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .adminBurnSyntheticDevicesAndDeletePairings([1, 2]),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_SD_BURN_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Synthetic Device', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnSyntheticDevicesAndDeletePairings([1, 99]),
        ).to.be.rejectedWith(
          `InvalidNode("${await sdIdInstance.getAddress()}", 99)`,
        );
      });
    });

    context('State', () => {
      it('Should correctly reset synthetic device parent node to 0', async () => {
        await devAdminInstance
          .connect(admin)
          .adminBurnSyntheticDevicesAndDeletePairings([1, 2]);

        const parentNode1 = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          1,
        );
        const parentNode2 = await nodesInstance.getParentNode(
          await sdIdInstance.getAddress(),
          2,
        );

        expect(parentNode1).to.be.equal(0);
        expect(parentNode2).to.be.equal(0);
      });
      it('Should correctly reset synthetic device node owner to zero address', async () => {
        await devAdminInstance
          .connect(admin)
          .adminBurnSyntheticDevicesAndDeletePairings([1, 2]);

        await expect(sdIdInstance.ownerOf(1)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
        await expect(sdIdInstance.ownerOf(2)).to.be.rejectedWith(
          'ERC721: invalid token ID',
        );
      });
      it('Should correctly reset synthetic device address do zero address', async () => {
        await devAdminInstance
          .connect(admin)
          .adminBurnSyntheticDevicesAndDeletePairings([1, 2]);

        const id1 =
          await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sdAddress1.address,
          );
        const id2 =
          await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
            sdAddress2.address,
          );

        expect(id1).to.equal(0);
        expect(id2).to.equal(0);
      });
      it('Should correctly reset synthetic device infos to blank', async () => {
        await devAdminInstance
          .connect(admin)
          .adminBurnSyntheticDevicesAndDeletePairings([1, 2]);

        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            1,
            C.mockSyntheticDeviceAttribute2,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            2,
            C.mockSyntheticDeviceAttribute1,
          ),
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            await sdIdInstance.getAddress(),
            2,
            C.mockSyntheticDeviceAttribute2,
          ),
        ).to.be.equal('');
      });
      it('Should correctly reset mapping the synthetic device to vehicle to 0', async () => {
        await devAdminInstance
          .connect(admin)
          .adminBurnSyntheticDevicesAndDeletePairings([1, 2]);

        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getNodeLink(
            await vehicleIdInstance.getAddress(),
            await sdIdInstance.getAddress(),
            2,
          ),
        ).to.be.equal(0);
      });
      it('Should correctly reset mapping the vehicle to synthetic device to 0', async () => {
        await devAdminInstance
          .connect(admin)
          .adminBurnSyntheticDevicesAndDeletePairings([1, 2]);

        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            1,
          ),
        ).to.be.equal(0);
        expect(
          await mapperInstance.getNodeLink(
            await sdIdInstance.getAddress(),
            await vehicleIdInstance.getAddress(),
            2,
          ),
        ).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit SyntheticDeviceNodeBurnedDevAdmin event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnSyntheticDevicesAndDeletePairings([1, 2])
        )
          .to.emit(devAdminInstance, 'SyntheticDeviceNodeBurnedDevAdmin')
          .withArgs(1, 1, user1.address)
          .to.emit(devAdminInstance, 'SyntheticDeviceNodeBurnedDevAdmin')
          .withArgs(2, 2, user2.address);
      });
      it('Should emit SyntheticDeviceAttributeSetDevAdmin events with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminBurnSyntheticDevicesAndDeletePairings([1, 2])
        )
          .to.emit(devAdminInstance, 'SyntheticDeviceAttributeSetDevAdmin')
          .withArgs(1, C.mockSyntheticDeviceAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'SyntheticDeviceAttributeSetDevAdmin')
          .withArgs(1, C.mockSyntheticDeviceAttributeInfoPairs[1].attribute, '')
          .to.emit(devAdminInstance, 'SyntheticDeviceAttributeSetDevAdmin')
          .withArgs(2, C.mockSyntheticDeviceAttributeInfoPairs[0].attribute, '')
          .to.emit(devAdminInstance, 'SyntheticDeviceAttributeSetDevAdmin')
          .withArgs(2, C.mockSyntheticDeviceAttributeInfoPairs[1].attribute, '');
      });
    });
  });

  describe('adminPairAftermarketDevice', () => {
    let claimOwnerSig1: string;
    let claimAdSig1: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          1,
          user1.address,
          claimOwnerSig1,
          claimAdSig1,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_AD_PAIR_ROLE role', async () => {
        await expect(
          devAdminInstance.connect(nonAdmin).adminPairAftermarketDevice(1, 1),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_AD_PAIR_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 99),
        ).to.be.rejectedWith(
          `InvalidNode("${await vehicleIdInstance.getAddress()}", 99)`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          devAdminInstance.connect(admin).adminPairAftermarketDevice(99, 1),
        ).to.be.rejectedWith(
          `InvalidNode("${await adIdInstance.getAddress()}", 99)`,
        );
      });
      it('Should revert if device is not claimed', async () => {
        await expect(
          devAdminInstance.connect(admin).adminPairAftermarketDevice(2, 1),
        ).to.be.rejectedWith('AdNotClaimed(2)');
      });
      it('Should revert if vehicle is already paired', async () => {
        await devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 1);

        await expect(
          devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 1),
        ).to.be.rejectedWith('VehiclePaired(1)');
      });
      it('Should revert if aftermarket device is already paired', async () => {
        await devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 1);

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 2),
        ).to.be.rejectedWith('AdPaired(1)');
      });
    });

    context('State', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        await devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 1);

        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1),
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        await devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 1);

        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1),
        ).to.be.equal(1);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDevicePaired event with correct params', async () => {
        await expect(
          devAdminInstance.connect(admin).adminPairAftermarketDevice(1, 1),
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDevicePaired')
          .withArgs(1, 1, user1.address);
      });
    });
  });

  describe('adminChangeParentNode', () => {
    const adIdsList = Array.from({ length: mockAftermarketDeviceInfosList.length }, (_, i) => i + 1)
    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have DEV_CHANGE_PARENT_NODE role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .adminChangeParentNode(2, await adIdInstance.getAddress(), adIdsList),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_CHANGE_PARENT_NODE
          }`,
        );
      });
      it('Should revert if parent node is not minted', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminChangeParentNode(99, await adIdInstance.getAddress(), adIdsList),
        ).to.be.rejectedWith(
          `InvalidNode("${await manufacturerIdInstance.getAddress()}", 99)`,
        );
      });
      it('Should revert if node is not minted', async () => {
        const invalidAdIdList = [...adIdsList, 99];

        await expect(
          devAdminInstance
            .connect(admin)
            .adminChangeParentNode(2, await adIdInstance.getAddress(), invalidAdIdList),
        ).to.be.rejectedWith(
          `InvalidNode("${await adIdInstance.getAddress()}", 99)`,
        );
      });
    });

    context('State', () => {
      it('Should correctly change the parent node', async () => {
        const adProxyAddress = await adIdInstance.getAddress();

        for (const adId of adIdsList) {
          expect(await nodesInstance.getParentNode(adProxyAddress, adId)).to.equal(1);
        }

        await devAdminInstance
          .connect(admin)
          .adminChangeParentNode(2, await adIdInstance.getAddress(), adIdsList);

        for (const adId of adIdsList) {
          expect(await nodesInstance.getParentNode(adProxyAddress, adId)).to.equal(2);
        }
      });
    });
  });

  describe('adminCacheDimoStreamrEns', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have DEV_CACHE_ENS role', async () => {
        await expect(
          devAdminInstance
            .connect(nonAdmin)
            .adminCacheDimoStreamrEns(),
        ).to.be.rejectedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEV_CACHE_ENS
          }`,
        );
      });
    });

    context('Events', () => {
      it('Should emit RequestENSOwnerAndCreateStream (ENSCacheV2Streamr) event with correct params', async () => {
        await expect(
          devAdminInstance
            .connect(admin)
            .adminCacheDimoStreamrEns()
        )
          .to.emit(ensCache, 'RequestENSOwnerAndCreateStream')
          .withArgs(C.DIMO_STREAMR_ENS, '/vehicles/', '{}', DIMO_REGISTRY_ADDRESS);
      });
    });
  });
});
