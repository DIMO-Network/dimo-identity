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
  MockStake,
  Multicall
} from '../typechain-types';
import {
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../utils';

const { expect } = chai;

describe('Multicall', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let chargingInstance: Charging;
  let dimoAccessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let mapperInstance: Mapper;
  let sharedInstance: Shared;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let mockDimoCreditInstance: MockDimoCredit;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let multicallInstance: Multicall;

  let DIMO_REGISTRY_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
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
      manufacturer1,
      user1,
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
        'Multicall',
        'Shared'
      ],
      nfts: ['ManufacturerId', 'VehicleId', 'AftermarketDeviceId'],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    chargingInstance = deployments.Charging;
    dimoAccessControlInstance = deployments.DimoAccessControl;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    mapperInstance = deployments.Mapper;
    sharedInstance = deployments.Shared;
    multicallInstance = deployments.Multicall;
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

    // Deploy MockStake contract
    const MockStakeFactory = await ethers.getContractFactory('MockStake');
    mockStakeInstance = await MockStakeFactory.connect(admin).deploy();

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
      .setManufacturerLicense(await mockStakeInstance.getAddress());

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

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Setting DimoRegistry address in the AftermarketDeviceId
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    await adIdInstance
      .connect(manufacturer1)
      .setApprovalForAll(await aftermarketDeviceInstance.getAddress(), true);
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
        _primaryType: 'MintVehicleWithDeviceDefinitionSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          deviceDefinitionId: C.mockDdId1,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos
        }
      });
      ownerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      pairSign = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1'
        }
      });
    });

    context('State', () => {
      it('Should mint vehicle and claim aftermarket device in the same transaction', async () => {
        const mintVehicleWithDdSignEncoded = vehicleInstance.interface.encodeFunctionData(
          'mintVehicleWithDeviceDefinitionSign',
          [1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs, mintSig]
        );
        const claimAftermarketDeviceSignEncoded =
          aftermarketDeviceInstance.interface.encodeFunctionData(
            'claimAftermarketDeviceSign',
            [1, user1.address, ownerSig, adSig]
          );

        await expect(vehicleIdInstance.ownerOf(1)).to.be.reverted;
        expect(await adIdInstance.ownerOf(1)).to.be.equal(
          manufacturer1.address
        );

        await multicallInstance.multiDelegateCall([
          mintVehicleWithDdSignEncoded,
          claimAftermarketDeviceSignEncoded
        ]);

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should mint vehicle, claim aftermarket device and pair them in the same transaction', async () => {
        const mintVehicleWithDdSignEncoded = vehicleInstance.interface.encodeFunctionData(
          'mintVehicleWithDeviceDefinitionSign',
          [1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs, mintSig]
        );
        const claimAftermarketDeviceSignEncoded =
          aftermarketDeviceInstance.interface.encodeFunctionData(
            'claimAftermarketDeviceSign',
            [1, user1.address, ownerSig, adSig]
          );
        const pairAftermarketDeviceSignEncoded =
          aftermarketDeviceInstance.interface.encodeFunctionData(
            'pairAftermarketDeviceSign(uint256,uint256,bytes)',
            [1, 1, pairSign]
          );

        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1)
        ).to.be.equal(0);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1)
        ).to.be.equal(0);

        await multicallInstance.multiDelegateCall([
          mintVehicleWithDdSignEncoded,
          claimAftermarketDeviceSignEncoded,
          pairAftermarketDeviceSignEncoded
        ]);

        expect(
          await mapperInstance.getLink(await vehicleIdInstance.getAddress(), 1)
        ).to.be.equal(1);
        expect(
          await mapperInstance.getLink(await adIdInstance.getAddress(), 1)
        ).to.be.equal(1);
      });
    });
  });

  describe('multiStaticCall', () => {
    it('Should return information about manufacturer', async () => {
      const getIdByName1 = manufacturerInstance.interface.encodeFunctionData(
        'getManufacturerIdByName',
        [C.mockManufacturerNames[0]]
      );
      const getInfoEncoded1 = nodesInstance.interface.encodeFunctionData('getInfo', [
        await manufacturerIdInstance.getAddress(),
        1,
        C.mockManufacturerAttribute1
      ]);
      const getInfoEncoded2 = nodesInstance.interface.encodeFunctionData('getInfo', [
        await manufacturerIdInstance.getAddress(),
        1,
        C.mockManufacturerAttribute2
      ]);

      const results = await multicallInstance.multiStaticCall([
        getIdByName1,
        getInfoEncoded1,
        getInfoEncoded2
      ]);

      expect(results.length).to.be.equal(3);

      const id = multicallInstance.interface.getAbiCoder().decode(
        ['uint256'],
        results[0]
      )[0];
      const info1 = multicallInstance.interface.getAbiCoder().decode(
        ['string'],
        results[1]
      )[0];
      const info2 = multicallInstance.interface.getAbiCoder().decode(
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
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[])'](1, user1.address, C.mockDdId1, C.mockVehicleAttributeInfoPairs);

      const getInfoEncoded1 = nodesInstance.interface.encodeFunctionData('getInfo', [
        await vehicleIdInstance.getAddress(),
        1,
        C.mockVehicleAttribute1
      ]);
      const getInfoEncoded2 = nodesInstance.interface.encodeFunctionData('getInfo', [
        await vehicleIdInstance.getAddress(),
        1,
        C.mockVehicleAttribute2
      ]);

      const results = await multicallInstance.multiStaticCall([
        getInfoEncoded1,
        getInfoEncoded2
      ]);

      expect(results.length).to.be.equal(2);

      const info1 = multicallInstance.interface.getAbiCoder().decode(
        ['string'],
        results[0]
      )[0];
      const info2 = multicallInstance.interface.getAbiCoder().decode(
        ['string'],
        results[1]
      )[0];

      expect(info1).to.be.equal(C.mockVehicleInfo1);
      expect(info2).to.be.equal(C.mockVehicleInfo2);
    });
    it('Should return information about aftermarket device', async () => {
      const getAdByAddress1 = aftermarketDeviceInstance.interface.encodeFunctionData(
        'getAftermarketDeviceIdByAddress',
        [adAddress1.address]
      );
      const getInfoEncoded1 = nodesInstance.interface.encodeFunctionData('getInfo', [
        await adIdInstance.getAddress(),
        1,
        C.mockAftermarketDeviceAttribute1
      ]);
      const getInfoEncoded2 = nodesInstance.interface.encodeFunctionData('getInfo', [
        await adIdInstance.getAddress(),
        1,
        C.mockAftermarketDeviceAttribute2
      ]);

      const results = await multicallInstance.multiStaticCall([
        getAdByAddress1,
        getInfoEncoded1,
        getInfoEncoded2
      ]);

      expect(results.length).to.be.equal(3);

      const id = multicallInstance.interface.getAbiCoder().decode(
        ['uint256'],
        results[0]
      )[0];
      const info1 = multicallInstance.interface.getAbiCoder().decode(
        ['string'],
        results[1]
      )[0];
      const info2 = multicallInstance.interface.getAbiCoder().decode(
        ['string'],
        results[2]
      )[0];

      expect(id).to.be.equal(1);
      expect(info1).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(info2).to.be.equal(C.mockAftermarketDeviceInfo2);
    });
  });
});
