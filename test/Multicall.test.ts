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
  AdLicenseValidator,
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
  MintVehicleInput,
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
  let adLicenseValidatorInstance: AdLicenseValidator;
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
  let foundation: HardhatEthersSigner;
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
      foundation,
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
        'AdLicenseValidator',
        'Mapper',
        'Multicall',
        'Shared',
        'Nonces'
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
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
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

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(DIMO_REGISTRY_ADDRESS, C.manufacturerDimoTokensAmount);

    // Mint DIMO Credit Tokens to admin and approve DIMORegistry
    await mockDimoCreditInstance
      .connect(admin)
      .mint(admin.address, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .approve(DIMO_REGISTRY_ADDRESS, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .grantRole(C.NFT_BURNER_ROLE, DIMO_REGISTRY_ADDRESS);

    // Setup Shared variables
    await sharedInstance
      .connect(admin)
      .setDimoTokenAddress(await mockDimoTokenInstance.getAddress());
    await sharedInstance
      .connect(admin)
      .setDimoCredit(await mockDimoCreditInstance.getAddress());

    // Setup Charging variables
    await chargingInstance
      .connect(admin)
      .setDcxOperationCost(C.MINT_VEHICLE_OPERATION, C.MINT_VEHICLE_OPERATION_COST);

    // Setup AdLicenseValidator variables
    await adLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await adLicenseValidatorInstance.setDimoToken(
      await mockDimoTokenInstance.getAddress()
    );
    await adLicenseValidatorInstance.setLicense(await mockStakeInstance.getAddress());
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
    let mintVehicleInput: MintVehicleInput;

    before(async () => {
      mintSig = await signMessage({
        _signer: user1,
        _primaryType: 'MintVehicleSign',
        _verifyingContract: await vehicleInstance.getAddress(),
        message: {
          manufacturerNode: '1',
          owner: user1.address,
          attributes: C.mockVehicleAttributes,
          infos: C.mockVehicleInfos,
          nonce: 0
        }
      });
      ownerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
          nonce: 0
        }
      });
      adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
          nonce: 0
        }
      });
      pairSign = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: await aftermarketDeviceInstance.getAddress(),
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
          nonce: 0
        }
      });

      mintVehicleInput = {
        manufacturerNode: '1',
        owner: user1.address,
        attrInfo: C.mockVehicleAttributeInfoPairs,
        signature: mintSig
      }
    });

    context('State', () => {
      it('Should mint vehicle and claim aftermarket device in the same transaction', async () => {
        const mintVehicleSignEncoded = vehicleInstance.interface.encodeFunctionData(
          'mintVehicleSign',
          [mintVehicleInput]
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
          mintVehicleSignEncoded,
          claimAftermarketDeviceSignEncoded
        ]);

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should mint vehicle, claim aftermarket device and pair them in the same transaction', async () => {
        const mintVehicleSignEncoded = vehicleInstance.interface.encodeFunctionData(
          'mintVehicleSign',
          [mintVehicleInput]
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
          mintVehicleSignEncoded,
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
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

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
