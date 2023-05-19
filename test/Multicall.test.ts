import chai from 'chai';
import { ethers, waffle } from 'hardhat';

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
  MockDimoToken,
  MockStake,
  Multicall
} from '../typechain';
import {
  setup2,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('Multicall', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let accessControlInstance: DimoAccessControl;
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
  let multicallInstance: Multicall;

  const [admin, foundation, manufacturer1, user1, adAddress1, adAddress2] =
    provider.getWallets();

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
    const deployments = await setup2(admin, {
      modules: [
        'Eip712Checker',
        'DimoAccessControl',
        'Nodes',
        'Manufacturer',
        'Vehicle',
        'AftermarketDevice',
        'AdLicenseValidator',
        'Mapper',
        'Multicall'
      ],
      nfts: ['ManufacturerId', 'VehicleId', 'AftermarketDeviceId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    accessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
    multicallInstance = deployments.Multicall;
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

    // Setting DimoRegistry address in the AftermarketDeviceId
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);
    await aftermarketDeviceInstance
      .connect(manufacturer1)
      .mintAftermarketDeviceByManufacturerBatch(
        1,
        mockAftermarketDeviceInfosList
      );
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('multiDelegateCall', () => {
    let mintSig: string;
    let ownerSig: string;
    let adSig: string;
    let pairSign: string;
    before(async () => {
      mintSig = await signMessage({
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
      ownerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      pairSign = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1'
        }
      });
    });

    context('State', () => {
      it('Should mint vehicle and claim aftermarket device in the same transaction', async () => {
        const vehicleInterface = ethers.Contract.getInterface(
          vehicleInstance.interface
        );
        const aftermarketDeviceInterface = ethers.Contract.getInterface(
          aftermarketDeviceInstance.interface
        );

        const mintVehicleSignEncoded = vehicleInterface.encodeFunctionData(
          'mintVehicleSign',
          [1, user1.address, C.mockVehicleAttributeInfoPairs, mintSig]
        );
        const claimAftermarketDeviceSignEncoded =
          aftermarketDeviceInterface.encodeFunctionData(
            'claimAftermarketDeviceSign',
            [1, user1.address, ownerSig, adSig]
          );

        await expect(vehicleIdInstance.ownerOf(1)).to.be.reverted;
        expect(await adIdInstance.ownerOf(1)).to.be.equal(
          manufacturer1.address
        );

        await multicallInstance.multiDelegateCall([
          mintVehicleSignEncoded,
          claimAftermarketDeviceSignEncoded
        ]);

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should mint vehicle, claim aftermarket device and pair them in the same transaction', async () => {
        const vehicleInterface = ethers.Contract.getInterface(
          vehicleInstance.interface
        );
        const aftermarketDeviceInterface = ethers.Contract.getInterface(
          aftermarketDeviceInstance.interface
        );

        const mintVehicleSignEncoded = vehicleInterface.encodeFunctionData(
          'mintVehicleSign',
          [1, user1.address, C.mockVehicleAttributeInfoPairs, mintSig]
        );
        const claimAftermarketDeviceSignEncoded =
          aftermarketDeviceInterface.encodeFunctionData(
            'claimAftermarketDeviceSign',
            [1, user1.address, ownerSig, adSig]
          );
        const pairAftermarketDeviceSignEncoded =
          aftermarketDeviceInterface.encodeFunctionData(
            'pairAftermarketDeviceSign(uint256,uint256,bytes)',
            [1, 1, pairSign]
          );

        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(adIdInstance.address, 1)
        ).to.be.equal(0);

        await multicallInstance.multiDelegateCall([
          mintVehicleSignEncoded,
          claimAftermarketDeviceSignEncoded,
          pairAftermarketDeviceSignEncoded
        ]);

        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(adIdInstance.address, 1)
        ).to.be.equal(1);
      });
    });
  });

  describe('multiStaticCall', () => {
    it('Should return information about manufacturer', async () => {
      const manufacturerInterface = ethers.Contract.getInterface(
        manufacturerInstance.interface
      );
      const nodesInterface = ethers.Contract.getInterface(
        nodesInstance.interface
      );

      const getIdByName1 = manufacturerInterface.encodeFunctionData(
        'getManufacturerIdByName',
        [C.mockManufacturerNames[0]]
      );
      const getInfoEncoded1 = nodesInterface.encodeFunctionData('getInfo', [
        manufacturerIdInstance.address,
        1,
        C.mockManufacturerAttribute1
      ]);
      const getInfoEncoded2 = nodesInterface.encodeFunctionData('getInfo', [
        manufacturerIdInstance.address,
        1,
        C.mockManufacturerAttribute2
      ]);

      const results = await multicallInstance.multiStaticCall([
        getIdByName1,
        getInfoEncoded1,
        getInfoEncoded2
      ]);

      expect(results.length).to.be.equal(3);

      const id = ethers.utils.defaultAbiCoder.decode(
        ['uint256'],
        results[0]
      )[0];
      const info1 = ethers.utils.defaultAbiCoder.decode(
        ['string'],
        results[1]
      )[0];
      const info2 = ethers.utils.defaultAbiCoder.decode(
        ['string'],
        results[2]
      )[0];

      expect(id).to.be.equal(1);
      expect(info1).to.be.equal(C.mockManufacturerInfo1);
      expect(info2).to.be.equal(C.mockManufacturerInfo2);
    });
    it('Should return information about vehicle', async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

      const nodesInterface = ethers.Contract.getInterface(
        nodesInstance.interface
      );

      const getInfoEncoded1 = nodesInterface.encodeFunctionData('getInfo', [
        vehicleIdInstance.address,
        1,
        C.mockVehicleAttribute1
      ]);
      const getInfoEncoded2 = nodesInterface.encodeFunctionData('getInfo', [
        vehicleIdInstance.address,
        1,
        C.mockVehicleAttribute2
      ]);

      const results = await multicallInstance.multiStaticCall([
        getInfoEncoded1,
        getInfoEncoded2
      ]);

      expect(results.length).to.be.equal(2);

      const info1 = ethers.utils.defaultAbiCoder.decode(
        ['string'],
        results[0]
      )[0];
      const info2 = ethers.utils.defaultAbiCoder.decode(
        ['string'],
        results[1]
      )[0];

      expect(info1).to.be.equal(C.mockVehicleInfo1);
      expect(info2).to.be.equal(C.mockVehicleInfo2);
    });
    it('Should return information about aftermarket device', async () => {
      const aftermarketDeviceInterface = ethers.Contract.getInterface(
        aftermarketDeviceInstance.interface
      );
      const nodesInterface = ethers.Contract.getInterface(
        nodesInstance.interface
      );

      const getAdByAddress1 = aftermarketDeviceInterface.encodeFunctionData(
        'getAftermarketDeviceIdByAddress',
        [adAddress1.address]
      );
      const getInfoEncoded1 = nodesInterface.encodeFunctionData('getInfo', [
        adIdInstance.address,
        1,
        C.mockAftermarketDeviceAttribute1
      ]);
      const getInfoEncoded2 = nodesInterface.encodeFunctionData('getInfo', [
        adIdInstance.address,
        1,
        C.mockAftermarketDeviceAttribute2
      ]);

      const results = await multicallInstance.multiStaticCall([
        getAdByAddress1,
        getInfoEncoded1,
        getInfoEncoded2
      ]);

      expect(results.length).to.be.equal(3);

      const id = ethers.utils.defaultAbiCoder.decode(
        ['uint256'],
        results[0]
      )[0];
      const info1 = ethers.utils.defaultAbiCoder.decode(
        ['string'],
        results[1]
      )[0];
      const info2 = ethers.utils.defaultAbiCoder.decode(
        ['string'],
        results[2]
      )[0];

      expect(id).to.be.equal(1);
      expect(info1).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(info2).to.be.equal(C.mockAftermarketDeviceInfo2);
    });
  });
});
