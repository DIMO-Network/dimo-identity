import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
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
  MultipleMinter,
  MockDimoToken,
  MockStake
} from '../typechain';
import {
  setup,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  MintVehicleAndAdInput,
  MintVehicleAndSdInput,
  C
} from '../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('MultipleMinter', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let syntheticDeviceInstance: SyntheticDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let multipleMinterInstance: MultipleMinter;
  let mockDimoTokenInstance: MockDimoToken;
  let mockStakeInstance: MockStake;
  let manufacturerIdInstance: ManufacturerId;
  let integrationIdInstance: IntegrationId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let sdIdInstance: SyntheticDeviceId;

  const [
    admin,
    nonAdmin,
    foundation,
    vehicleManufacturer1,
    adManufacturer1,
    integrationOwner1,
    user1,
    user2,
    adAddress1,
    adAddress2,
    sdAddress1,
    sdAddress2
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
        'SyntheticDevice',
        'AdLicenseValidator',
        'Mapper',
        'MultipleMinter'
      ],
      nfts: [
        'ManufacturerId',
        'IntegrationId',
        'VehicleId',
        'AftermarketDeviceId',
        'SyntheticDeviceId'
      ],
      upgradeableContracts: []
    });

    dimoRegistryInstance = deployments.DIMORegistry;
    eip712CheckerInstance = deployments.Eip712Checker;
    nodesInstance = deployments.Nodes;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
    multipleMinterInstance = deployments.MultipleMinter;
    manufacturerIdInstance = deployments.ManufacturerId;
    integrationIdInstance = deployments.IntegrationId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;
    sdIdInstance = deployments.SyntheticDeviceId;

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

    const SYNTHETIC_DEVICE_MINTER_ROLE = await sdIdInstance.MINTER_ROLE();
    await sdIdInstance
      .connect(admin)
      .grantRole(SYNTHETIC_DEVICE_MINTER_ROLE, dimoRegistryInstance.address);
    const SYNTHETIC_DEVICE_BURNER_ROLE = await sdIdInstance.BURNER_ROLE();
    await sdIdInstance
      .connect(admin)
      .grantRole(SYNTHETIC_DEVICE_BURNER_ROLE, dimoRegistryInstance.address);

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
    await syntheticDeviceInstance
      .connect(admin)
      .setSyntheticDeviceIdProxyAddress(sdIdInstance.address);

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
      .transfer(vehicleManufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(vehicleManufacturer1)
      .approve(dimoRegistryInstance.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(adManufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(adManufacturer1)
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

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, dimoRegistryInstance.address);

    // Mint Vehicle Manufacturer Node
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        vehicleManufacturer1.address,
        C.mockManufacturerNames[0],
        C.mockManufacturerAttributeInfoPairs
      );
    // Mint Aftermarket Device Manufacturer Node
    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        adManufacturer1.address,
        C.mockManufacturerNames[1],
        C.mockManufacturerAttributeInfoPairs
      );

    await mockStakeInstance.setLicenseBalance(adManufacturer1.address, 1);

    // Mint Integration Node
    await integrationInstance
      .connect(admin)
      .mintIntegration(
        integrationOwner1.address,
        C.mockIntegrationNames[0],
        C.mockIntegrationAttributeInfoPairs
      );

    // Setting DimoRegistry address in the AftermarketDeviceId
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    // Setting DimoRegistry address in the SyntheticDeviceId
    await sdIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
    await vehicleInstance
      .connect(admin)
      .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

    await adIdInstance
      .connect(adManufacturer1)
      .setApprovalForAll(aftermarketDeviceInstance.address, true);
    await aftermarketDeviceInstance
      .connect(adManufacturer1)
      .mintAftermarketDeviceByManufacturerBatch(
        2,
        mockAftermarketDeviceInfosList
      );
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('mintVehicleAndAdSign', () => {
    let mintAftermarketDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintVehicleAndAdInput;
    let incorrectMintInput: MintVehicleAndAdInput;

    before(async () => {
      mintAftermarketDeviceSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'MintVehicleAndAdSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1'
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
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
      correctMintInput = {
        manufacturerNodeVehicle: '1',
        owner: user1.address,
        attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
        aftermarketDeviceNode: '1',
        vehicleOwnerSig: mintVehicleOwnerSig1,
        aftermarketDeviceSig: mintAftermarketDeviceSig1
      };
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = { ...correctMintInput };
      });

      it('Should revert if caller does not have admin role', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndAdSign(correctMintInput)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput.manufacturerNodeVehicle = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(incorrectMintInput)
        ).to.be.revertedWith('InvalidParentNode(99)');
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        incorrectMintInput.aftermarketDeviceNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(incorrectMintInput)
        ).to.be.revertedWith(`InvalidNode("${adIdInstance.address}", 99)`);
      });
      it('Should revert if device is already claimed', async () => {
        const claimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const claimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig,
            claimAdSig
          );

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(incorrectMintInput)
        ).to.be.revertedWith('DeviceAlreadyClaimed(1)');
      });
      it('Should revert if vehicle attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsVehicle =
          C.mockVehicleAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(incorrectMintInput)
        ).to.be.revertedWith(
          `AttributeNotWhitelisted("${C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute}")`
        );
      });

      context('Wrong signature', () => {
        context('Vehicle owner signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if manufacturer node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '99',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if attributes are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes.slice(1),
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if infos are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfosWrongSize
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if owner does not match signer', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user2.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
        });

        context('Aftermarket device signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress2,
              _primaryType: 'MintVehicleAndAdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                aftermarketDeviceNode: '1'
              }
            });
            incorrectMintInput.aftermarketDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidAdSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleAndAdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                aftermarketDeviceNode: '1'
              }
            });
            incorrectMintInput.aftermarketDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidAdSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleAndAdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                aftermarketDeviceNode: '1'
              }
            });
            incorrectMintInput.aftermarketDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidAdSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _chainId: 99,
              _primaryType: 'MintVehicleAndAdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                aftermarketDeviceNode: '1'
              }
            });
            incorrectMintInput.aftermarketDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidAdSignature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _primaryType: 'MintVehicleAndAdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                aftermarketDeviceNode: '99'
              }
            });
            incorrectMintInput.aftermarketDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndAdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidAdSignature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set vehicle parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndAdSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          3
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set vehicle node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndAdSign(correctMintInput);

        expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
      });
      it('Should correctly set vehicle infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndAdSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            3,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            3,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
      });
      it('Should correctly set aftermarket device node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndAdSign(correctMintInput);

        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndAdSign(correctMintInput);

        expect(
          await mapperInstance.getLink(vehicleIdInstance.address, 3)
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndAdSign(correctMintInput);

        // Returning 0
        expect(
          await mapperInstance.getLink(adIdInstance.address, 1)
        ).to.be.equal(3);
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleNodeMinted')
          .withArgs(1, 3, user1.address);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(multipleMinterInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
      it('Should emit AftermarketDeviceClaimed event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(correctMintInput)
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
          .withArgs(1, user1.address);
      });
      it('Should emit AftermarketDevicePaired event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndAdSign(correctMintInput)
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDevicePaired')
          .withArgs(1, 3, user1.address);
      });
    });
  });

  describe('mintVehicleAndSdSign', () => {
    let mintSyntheticDeviceSig1: string;
    let mintVehicleOwnerSig1: string;
    let correctMintInput: MintVehicleAndSdInput;
    let incorrectMintInput: MintVehicleAndSdInput;

    before(async () => {
      mintSyntheticDeviceSig1 = await signMessage({
        _signer: sdAddress1,
        _primaryType: 'MintVehicleAndSdSign',
        _verifyingContract: syntheticDeviceInstance.address,
        message: {
          integrationNode: '1'
        }
      });
      mintVehicleOwnerSig1 = await signMessage({
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
      correctMintInput = {
        manufacturerNode: '1',
        owner: user1.address,
        attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
        integrationNode: '1',
        vehicleOwnerSig: mintVehicleOwnerSig1,
        syntheticDeviceSig: mintSyntheticDeviceSig1,
        syntheticDeviceAddr: sdAddress1.address,
        attrInfoPairsDevice: C.mockSyntheticDeviceAttributeInfoPairs
      };
    });

    context('Error handling', () => {
      beforeEach(() => {
        incorrectMintInput = { ...correctMintInput };
      });

      it('Should revert if caller does not have admin role', async () => {
        await expect(
          multipleMinterInstance
            .connect(nonAdmin)
            .mintVehicleAndSdSign(correctMintInput)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if vehicle parent node is not a manufacturer node', async () => {
        incorrectMintInput.manufacturerNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWith('InvalidParentNode(99)');
      });
      it('Should revert if synthetic device parent node is not an integration node', async () => {
        incorrectMintInput.integrationNode = '99';

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWith('InvalidParentNode(99)');
      });
      it('Should revert if device address is already registered', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        ).to.be.revertedWith(
          `DeviceAlreadyRegistered("${sdAddress1.address}")`
        );
      });
      it('Should revert if synthetic device attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsDevice =
          C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWith(
          `AttributeNotWhitelisted("${C.mockSyntheticDeviceAttributeInfoPairsNotWhitelisted[1].attribute}")`
        );
      });
      it('Should revert if vehicle attribute is not whitelisted', async () => {
        incorrectMintInput.attrInfoPairsVehicle =
          C.mockVehicleAttributeInfoPairsNotWhitelisted;

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(incorrectMintInput)
        ).to.be.revertedWith(
          `AttributeNotWhitelisted("${C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute}")`
        );
      });

      context('Wrong signature', () => {
        context('Vehicle owner signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: user2,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if manufacturer node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '99',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if attributes are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes.slice(1),
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if infos are incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user1.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfosWrongSize
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
          it('Should revert if owner does not match signer', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'MintVehicleSign',
              _verifyingContract: vehicleInstance.address,
              message: {
                manufacturerNode: '1',
                owner: user2.address,
                attributes: C.mockVehicleAttributes,
                infos: C.mockVehicleInfos
              }
            });
            incorrectMintInput.vehicleOwnerSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidOwnerSignature');
          });
        });

        context('Synthetic device signature', () => {
          it('Should revert if signer does not match vehicle owner', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress2,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidSdSignature');
          });
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidSdSignature');
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _domainVersion: '99',
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidSdSignature');
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _chainId: 99,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                integrationNode: '1'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidSdSignature');
          });
          it('Should revert if integration node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: sdAddress1,
              _primaryType: 'MintVehicleAndSdSign',
              _verifyingContract: multipleMinterInstance.address,
              message: {
                integrationNode: '99'
              }
            });
            incorrectMintInput.syntheticDeviceSig = invalidSignature;

            await expect(
              multipleMinterInstance
                .connect(admin)
                .mintVehicleAndSdSign(incorrectMintInput)
            ).to.be.revertedWith('InvalidSdSignature');
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly set vehicle parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          3
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set vehicle node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(await vehicleIdInstance.ownerOf(3)).to.be.equal(user1.address);
      });
      it('Should correctly set vehicle infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            3,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            3,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
      });
      it('Should correctly set synthetic device parent node', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        const parentNode = await nodesInstance.getParentNode(
          sdIdInstance.address,
          1
        );

        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set synthetic device node owner', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(await sdIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set synthetic device address', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        const id = await syntheticDeviceInstance.getSyntheticDeviceIdByAddress(
          sdAddress1.address
        );

        expect(id).to.equal(1);
      });
      it('Should correctly set synthetic device infos', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await nodesInstance.getInfo(
            sdIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            sdIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal(C.mockSyntheticDeviceInfo2);
      });
      it('Should correctly map the synthetic device to the vehicle', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            vehicleIdInstance.address,
            sdIdInstance.address,
            3
          )
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the synthetic device', async () => {
        await multipleMinterInstance
          .connect(admin)
          .mintVehicleAndSdSign(correctMintInput);

        expect(
          await mapperInstance.getNodeLink(
            sdIdInstance.address,
            vehicleIdInstance.address,
            1
          )
        ).to.be.equal(3);
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleNodeMinted')
          .withArgs(1, 3, user1.address);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(multipleMinterInstance, 'VehicleAttributeSet')
          .withArgs(
            3,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
      it('Should emit SyntheticDeviceNodeMinted event with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceNodeMinted')
          .withArgs(1, 1, 3, sdAddress1.address, user1.address);
      });
      it('Should emit SyntheticDeviceAttributeSet events with correct params', async () => {
        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[0].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[0].info
          )
          .to.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet')
          .withArgs(
            1,
            C.mockSyntheticDeviceAttributeInfoPairs[1].attribute,
            C.mockSyntheticDeviceAttributeInfoPairs[1].info
          );
      });
      it('Should not emit SyntheticDeviceAttributeSet event if attrInfoPairsDevice is empty', async () => {
        correctMintInput = {
          manufacturerNode: '1',
          owner: user1.address,
          attrInfoPairsVehicle: C.mockVehicleAttributeInfoPairs,
          integrationNode: '1',
          vehicleOwnerSig: mintVehicleOwnerSig1,
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairsDevice: []
        };

        await expect(
          multipleMinterInstance
            .connect(admin)
            .mintVehicleAndSdSign(correctMintInput)
        ).to.not.emit(multipleMinterInstance, 'SyntheticDeviceAttributeSet');
      });
    });
  });
});
