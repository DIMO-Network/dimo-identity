import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  // Nodes,
  Manufacturer,
  ManufacturerId,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  AdLicenseValidator,
  // Mapper,
  Forwarder,
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
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('Forwarder', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let accessControlInstance: DimoAccessControl;
  // let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  // let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let forwarderInstance: Forwarder;

  const [
    admin,
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
    [
      dimoRegistryInstance,
      eip712CheckerInstance,
      accessControlInstance,
      ,
      manufacturerInstance,
      vehicleInstance,
      aftermarketDeviceInstance,
      adLicenseValidatorInstance,
      ,
      manufacturerIdInstance,
      vehicleIdInstance,
      adIdInstance
    ] = await setup(admin, {
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
      nfts: ['ManufacturerId', 'VehicleId', 'AftermarketDeviceId']
    });

    const ForwarderFactory = await ethers.getContractFactory(
      'Forwarder',
      admin
    );
    forwarderInstance = await ForwarderFactory.deploy();

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
    await vehicleIdInstance
      .connect(admin)
      .setTrustedForwarder(forwarderInstance.address);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await adIdInstance
      .connect(admin)
      .setTrustedForwarder(forwarderInstance.address);

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

  context('On transfer', async () => {
    it('Basic test forwarder', async () => {
      const vehicleIdInterface = ethers.Contract.getInterface(
        vehicleIdInstance.interface
      );
      const adIdInterface = ethers.Contract.getInterface(
        adIdInstance.interface
      );

      const transferEncoded1 = vehicleIdInterface.encodeFunctionData(
        'safeTransferFrom(address,address,uint256)',
        [user1.address, user2.address, 1]
      );
      const transferEncoded2 = adIdInterface.encodeFunctionData(
        'safeTransferFrom(address,address,uint256)',
        [user1.address, user2.address, 1]
      );

      expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
      expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);

      await forwarderInstance.connect(user1).execute([
        { to: vehicleIdInstance.address, data: transferEncoded1 },
        { to: adIdInstance.address, data: transferEncoded2 }
      ]);

      expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user2.address);
      expect(await adIdInstance.ownerOf(1)).to.be.equal(user2.address);
    });
  });
});
