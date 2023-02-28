import chai from 'chai';
import { ethers, waffle, upgrades } from 'hardhat';

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
  MockDimoToken,
  MockStake,
  Multicall
} from '../typechain';
import {
  initialize,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  // AftermarketDeviceOwnerPair,
  C
} from '../utils';

// const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe.only('Multicall - Vehicle', function () {
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
  let multicallInstance: Multicall;

  const [
    admin,
    // nonAdmin,
    foundation,
    manufacturer1,
    // manufacturer2,
    // nonManufacturer,
    user1,
    // user2,
    adAddress1,
    adAddress2,
    // notMintedAd
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
      // nodesInstance,
      manufacturerInstance,
      vehicleInstance,
      aftermarketDeviceInstance,
      adLicenseValidatorInstance,
      // mapperInstance
    ] = await initialize(
      admin,
      'Eip712Checker',
      'DimoAccessControl',
      'Nodes',
      'Manufacturer',
      'Vehicle',
      'AftermarketDevice',
      'AdLicenseValidator',
      'Mapper'
    );

    const MulticallFactory = await ethers.getContractFactory('Multicall');
    multicallInstance = await MulticallFactory.deploy();

    const ManufacturerIdFactory = await ethers.getContractFactory(
      'ManufacturerId'
    );
    const VehicleIdFactory = await ethers.getContractFactory('VehicleId');
    const AftermarketDeviceIdFactory = await ethers.getContractFactory(
      'AftermarketDeviceId'
    );

    manufacturerIdInstance = await upgrades.deployProxy(
      ManufacturerIdFactory,
      [
        C.MANUFACTURER_NFT_NAME,
        C.MANUFACTURER_NFT_SYMBOL,
        C.MANUFACTURER_NFT_BASE_URI
      ],
      {
        initializer: 'initialize',
        kind: 'uups'
      }
      // eslint-disable-next-line prettier/prettier
    ) as ManufacturerId;
    await manufacturerIdInstance.deployed();

    vehicleIdInstance = await upgrades.deployProxy(
      VehicleIdFactory,
      [
        C.VEHICLE_NFT_NAME,
        C.VEHICLE_NFT_SYMBOL,
        C.VEHICLE_NFT_BASE_URI
      ],
      {
        initializer: 'initialize',
        kind: 'uups'
      }
      // eslint-disable-next-line prettier/prettier
    ) as VehicleId;
    await vehicleIdInstance.deployed();

    adIdInstance = await upgrades.deployProxy(
      AftermarketDeviceIdFactory,
      [
        C.AD_NFT_NAME,
        C.AD_NFT_SYMBOL,
        C.AD_NFT_BASE_URI
      ],
      {
        initializer: 'initialize',
        kind: 'uups'
      }
      // eslint-disable-next-line prettier/prettier
    ) as AftermarketDeviceId;
    await adIdInstance.deployed();

    const MANUFACTURER_MINTER_ROLE =
      await manufacturerIdInstance.MINTER_ROLE();
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
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe.skip('multiDelegateCall', () => {
    let signature: string;
    before(async () => {
      signature = await signMessage({
        _signer: user1,
        _primaryType: 'MintVehicleSign',
        _verifyingContract: vehicleInstance.address,
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos
        }
      });
    });

    context('State', () => {
      // TODO Add multicall as a module
      it('Should mint vehicle and claim aftermarket device in the same transaction', async () => {
        const vehicleInterface = ethers.Contract.getInterface(vehicleInstance.interface);
        // const aftermarketDeviceInterface = ethers.Contract.getInterface(aftermarketDeviceInstance.interface);

        // await vehicleInstance
        //   .connect(admin)
        //   .mintVehicleSign(
        //     1,
        //     user1.address,
        //     C.mockVehicleAttributeInfoPairs,
        //     signature
        //   );

        const mintVehicleSignEncoded = vehicleInterface.encodeFunctionData("mintVehicleSign", [1,
          user1.address,
          C.mockVehicleAttributeInfoPairs,
          signature]);

        await multicallInstance.multiDelegateCall([mintVehicleSignEncoded]);
      });
    });
  });
});
