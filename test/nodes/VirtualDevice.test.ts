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
  // Mapper,
  MockDimoToken,
  MockStake
} from '../../typechain';
import {
  initialize,
  setup,
  createSnapshot,
  revertToSnapshot,
  // signMessage,
  // AftermarketDeviceOwnerPair,
  C
} from '../../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('VirtualDevice', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let accessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let virtualDeviceInstance: VirtualDevice;
  // let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let virtualDeviceIdInstance: VirtualDeviceId;

  const [
    admin,
    nonAdmin,
    manufacturer1,
    // manufacturer2,
    // nonManufacturer,
    integrationOwner1,
    // user1,
    // user2,
    adAddress1,
    adAddress2,
    notMintedAd
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
    [
      dimoRegistryInstance,
      eip712CheckerInstance,
      accessControlInstance,
      nodesInstance,
      manufacturerInstance,
      integrationInstance,
      vehicleInstance,
      virtualDeviceInstance,
      ,
      manufacturerIdInstance,
      integrationIdInstance,
      vehicleIdInstance,
      virtualDeviceIdInstance
    ] = await setup(admin, {
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
      nfts: ['ManufacturerId', 'IntegrationId', 'VehicleId', 'VirtualDeviceId']
    });

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

    const AD_MINTER_ROLE = await virtualDeviceIdInstance.MINTER_ROLE();
    await virtualDeviceIdInstance
      .connect(admin)
      .grantRole(AD_MINTER_ROLE, dimoRegistryInstance.address);

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

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Setting DimoRegistry address in the AftermarketDeviceId
    await virtualDeviceIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setVirtualDeviceIdProxyAddress', () => {
    let localVirtualDeviceInstance: VirtualDevice;
    beforeEach(async () => {
      [, localVirtualDeviceInstance] = await initialize(admin, 'VirtualDevice');
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localVirtualDeviceInstance
            .connect(nonAdmin)
            .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localVirtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceIdProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit VirtualDeviceIdProxySet event with correct params', async () => {
        await expect(
          localVirtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceIdProxyAddress(virtualDeviceIdInstance.address)
        )
          .to.emit(localVirtualDeviceInstance, 'VirtualDeviceIdProxySet')
          .withArgs(virtualDeviceIdInstance.address);
      });
    });
  });

  describe('addVirtualDeviceAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          virtualDeviceInstance
            .connect(nonAdmin)
            .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute1)
        ).to.be.revertedWith('Attribute already exists');
      });
    });

    context('Events', () => {
      it('Should emit VirtualDeviceAttributeAdded event with correct params', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .addVirtualDeviceAttribute(C.mockVirtualDeviceAttribute3)
        )
          .to.emit(virtualDeviceInstance, 'VirtualDeviceAttributeAdded')
          .withArgs(C.mockVirtualDeviceAttribute3);
      });
    });
  });

  describe.skip('mintVirtualDeviceSign', () => {});

  describe.skip('setVirtualDeviceInfo', () => {
    beforeEach(async () => {
      await virtualDeviceIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(virtualDeviceInstance.address, true);
      // await virtualDeviceInstance
      //   .connect(manufacturer1)
      //   .mintAftermarketDeviceByManufacturerBatch(
      //     1,
      //     mockAftermarketDeviceInfosList
      //   );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          virtualDeviceInstance
            .connect(nonAdmin)
            .setVirtualDeviceInfo(1, C.mockVirtualDeviceAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not an Virtual Device', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceInfo(99, C.mockVirtualDeviceAttributeInfoPairs)
        ).to.be.revertedWith('Invalid AD node');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceInfo(
              1,
              C.mockVirtualDeviceAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockVirtualDeviceAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute1
          )
        ).to.be.equal(C.mockVirtualDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute2
          )
        ).to.be.equal(C.mockVirtualDeviceInfo2);

        await virtualDeviceInstance
          .connect(admin)
          .setVirtualDeviceInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            virtualDeviceIdInstance.address,
            1,
            C.mockVirtualDeviceAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit VirtualDeviceAttributeSet events with correct params', async () => {
        await expect(
          virtualDeviceInstance
            .connect(admin)
            .setVirtualDeviceInfo(1, C.mockVirtualDeviceAttributeInfoPairs)
        )
          .to.emit(virtualDeviceInstance, 'VirtualDeviceAttributeSet')
          .withArgs(
            1,
            C.mockVirtualDeviceAttributeInfoPairs[0].attribute,
            C.mockVirtualDeviceAttributeInfoPairs[0].info
          )
          .to.emit(virtualDeviceInstance, 'VirtualDeviceAttributeSet')
          .withArgs(
            1,
            C.mockVirtualDeviceAttributeInfoPairs[1].attribute,
            C.mockVirtualDeviceAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe.skip('getVirtualDeviceIdByAddress', () => {
    beforeEach(async () => {
      await virtualDeviceIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(virtualDeviceInstance.address, true);
      // await virtualDeviceInstance
      //   .connect(manufacturer1)
      //   .mintAftermarketDeviceByManufacturerBatch(
      //     1,
      //     mockAftermarketDeviceInfosList
      //   );
    });

    it('Should return 0 if the queried address is not associated with any minted device', async () => {
      const tokenId = await virtualDeviceInstance.getVirtualDeviceIdByAddress(
        notMintedAd.address
      );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId = await virtualDeviceInstance.getVirtualDeviceIdByAddress(
        adAddress1.address
      );

      expect(tokenId).to.equal(1);
    });
  });
});
