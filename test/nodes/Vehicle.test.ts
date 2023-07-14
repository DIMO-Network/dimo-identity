import chai from 'chai';
import { waffle, ethers } from 'hardhat';

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
  SyntheticDevice,
  SyntheticDeviceId,
  AftermarketDevice,
  AftermarketDeviceId,
  AdLicenseValidator,
  MockDimoToken,
  MockStake
} from '../../typechain';
import {
  initialize,
  setup,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('Vehicle', function () {
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
    manufacturer1,
    integrationOwner1,
    user1,
    user2,
    adAddress1,
    adAddress2,
    sdAddress1
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
        'Mapper'
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

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, dimoRegistryInstance.address);

    // Setting DimoRegistry address in the Proxy IDs
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

    // Setting DIMORegistry address
    await manufacturerIdInstance.setDimoRegistryAddress(
      dimoRegistryInstance.address
    );
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setVehicleIdProxyAddress', () => {
    let localVehicleInstance: Vehicle;
    beforeEach(async () => {
      const deployments = await initialize(admin, 'Vehicle');
      localVehicleInstance = deployments.Vehicle;
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localVehicleInstance
            .connect(nonAdmin)
            .setVehicleIdProxyAddress(localVehicleInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localVehicleInstance
            .connect(admin)
            .setVehicleIdProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('ZeroAddress');
      });
    });

    context('Events', () => {
      it('Should emit VehicleIdProxySet event with correct params', async () => {
        await expect(
          localVehicleInstance
            .connect(admin)
            .setVehicleIdProxyAddress(localVehicleInstance.address)
        )
          .to.emit(localVehicleInstance, 'VehicleIdProxySet')
          .withArgs(localVehicleInstance.address);
      });
    });
  });

  describe('addVehicleAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          vehicleInstance
            .connect(nonAdmin)
            .addVehicleAttribute(C.mockVehicleAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .addVehicleAttribute(C.mockVehicleAttribute1)
        ).to.be.revertedWith(`AttributeExists("${C.mockVehicleAttribute1}")`);
      });
    });

    context('Events', () => {
      it('Should emit VehicleAttributeAdded event with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .addVehicleAttribute(C.mockVehicleAttribute3)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeAdded')
          .withArgs(C.mockVehicleAttribute3);
      });
    });
  });

  describe('mintVehicle', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          vehicleInstance
            .connect(nonAdmin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if parent node is not a manufacturer node', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicle(99, user1.address, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWith('InvalidParentNode(99)');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicle(
              1,
              user1.address,
              C.mockVehicleAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith(
          `AttributeNotWhitelisted("${C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute}")`
        );
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        const parentNode = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          1
        );
        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set node owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set infos', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMinted event with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs)
        )
          .to.emit(vehicleInstance, 'VehicleNodeMinted')
          .withArgs(1, user1.address);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('mintVehicleSign', () => {
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

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          vehicleInstance
            .connect(nonAdmin)
            .mintVehicleSign(
              1,
              user1.address,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if parent node is not a manufacturer node', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleSign(
              99,
              user1.address,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        ).to.be.revertedWith('InvalidParentNode(99)');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleSign(
              1,
              user1.address,
              C.mockVehicleAttributeInfoPairsNotWhitelisted,
              signature
            )
        ).to.be.revertedWith(
          `AttributeNotWhitelisted("${C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute}")`
        );
      });

      context('Wrong signature', () => {
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleSign(
                1,
                user1.address,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleSign(
                1,
                user1.address,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleSign(
                1,
                user1.address,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWith('InvalidOwnerSignature');
        });
        it('Should revert if manufactuer node is incorrect', async () => {
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleSign(
                1,
                user1.address,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleSign(
                1,
                user1.address,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleSign(
                1,
                user1.address,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
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

          await expect(
            vehicleInstance
              .connect(admin)
              .mintVehicleSign(
                1,
                user1.address,
                C.mockVehicleAttributeInfoPairs,
                invalidSignature
              )
          ).to.be.revertedWith('InvalidOwnerSignature');
        });
      });
    });

    context('State', () => {
      it('Should correctly set parent node', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleSign(
            1,
            user1.address,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

        const parentNode = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          1
        );
        expect(parentNode).to.be.equal(1);
      });
      it('Should correctly set node owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleSign(
            1,
            user1.address,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

        expect(await vehicleIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set infos', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleSign(
            1,
            user1.address,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeMinted event with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleSign(
              1,
              user1.address,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        )
          .to.emit(vehicleInstance, 'VehicleNodeMinted')
          .withArgs(1, user1.address);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleSign(
              1,
              user1.address,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[0].attribute,
            C.mockVehicleAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            C.mockVehicleAttributeInfoPairs[1].attribute,
            C.mockVehicleAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('burnVehicleSign', () => {
    let burnVehicleSig: string;

    before(async () => {
      burnVehicleSig = await signMessage({
        _signer: user1,
        _primaryType: 'BurnVehicleSign',
        _verifyingContract: vehicleInstance.address,
        message: {
          vehicleNode: '1'
        }
      });
    });

    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          vehicleInstance.connect(nonAdmin).burnVehicleSign(1, burnVehicleSig)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(99, burnVehicleSig)
        ).to.be.revertedWith(`InvalidNode("${vehicleIdInstance.address}", 99)`);
      });
      it('Should revert if Vehicle is paired to an Aftermarket Device', async () => {
        const localClaimOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localClaimAdSig = await signMessage({
          _signer: adAddress1,
          _primaryType: 'ClaimAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            owner: user1.address
          }
        });
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1'
          }
        });

        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(aftermarketDeviceInstance.address, true);
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList
          );
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            localClaimOwnerSig,
            localClaimAdSig
          );

        await aftermarketDeviceInstance
          .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            localPairSignature
          );

        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig)
        ).to.be.revertedWith('VehiclePaired(1)');
      });
      it('Should revert if Vehicle is paired to a Synthetic Device', async () => {
        const localMintVehicleOwnerSig = await signMessage({
          _signer: user1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '1'
          }
        });
        const mintSyntheticDeviceSig1 = await signMessage({
          _signer: sdAddress1,
          _primaryType: 'MintSyntheticDeviceSign',
          _verifyingContract: syntheticDeviceInstance.address,
          message: {
            integrationNode: '1',
            vehicleNode: '1'
          }
        });
        const localMintSdInput = {
          integrationNode: '1',
          vehicleNode: '1',
          syntheticDeviceSig: mintSyntheticDeviceSig1,
          vehicleOwnerSig: localMintVehicleOwnerSig,
          syntheticDeviceAddr: sdAddress1.address,
          attrInfoPairs: C.mockSyntheticDeviceAttributeInfoPairs
        };

        await syntheticDeviceInstance
          .connect(admin)
          .mintSyntheticDeviceSign(localMintSdInput);

        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig)
        ).to.be.revertedWith('VehiclePaired(1)');
      });

      context('Wrong signature', () => {
        it('Should revert if signer does not match synthetic device owner', async () => {
          const invalidSignature = await signMessage({
            _signer: user2,
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: vehicleInstance.address,
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWith('InvalidOwnerSignature');
        });
        it('Should revert if domain name is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: vehicleInstance.address,
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWith('InvalidOwnerSignature');
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: vehicleInstance.address,
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWith('InvalidOwnerSignature');
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: vehicleInstance.address,
            message: {
              vehicleNode: '1'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWith('InvalidOwnerSignature');
        });
        it('Should revert if vehicle node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'BurnVehicleSign',
            _verifyingContract: vehicleInstance.address,
            message: {
              vehicleNode: '99'
            }
          });

          await expect(
            vehicleInstance.connect(admin).burnVehicleSign(1, invalidSignature)
          ).to.be.revertedWith('InvalidOwnerSignature');
        });
      });
    });

    context('State', () => {
      it('Should correctly reset parent node to 0', async () => {
        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig);

        const parentNode = await nodesInstance.getParentNode(
          sdIdInstance.address,
          1
        );

        expect(parentNode).to.be.equal(0);
      });
      it('Should correctly reset node owner to zero address', async () => {
        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig);

        await expect(sdIdInstance.ownerOf(1)).to.be.revertedWith(
          'ERC721: invalid token ID'
        );
      });
      it('Should correctly reset infos to blank', async () => {
        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig);

        expect(
          await nodesInstance.getInfo(
            sdIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute1
          )
        ).to.be.equal('');
        expect(
          await nodesInstance.getInfo(
            sdIdInstance.address,
            1,
            C.mockSyntheticDeviceAttribute2
          )
        ).to.be.equal('');
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion = await vehicleIdInstance.tokenIdToVersion(1);

        await vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig);

        expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion.add(1)
        );
      });
    });

    context('Events', () => {
      it('Should emit VehicleNodeBurned event with correct params', async () => {
        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig)
        )
          .to.emit(vehicleInstance, 'VehicleNodeBurned')
          .withArgs(1, user1.address);
      });
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        await expect(
          vehicleInstance.connect(admin).burnVehicleSign(1, burnVehicleSig)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, '')
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, '');
      });
    });
  });

  describe('setVehicleInfo', () => {
    beforeEach(async () => {
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          vehicleInstance
            .connect(nonAdmin)
            .setVehicleInfo(1, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
            C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if node is not a vehicle', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(99, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWith(`InvalidNode("${vehicleIdInstance.address}", 99)`);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(1, C.mockVehicleAttributeInfoPairsNotWhitelisted)
        ).to.be.revertedWith(
          `AttributeNotWhitelisted("${C.mockVehicleAttributeInfoPairsNotWhitelisted[1].attribute}")`
        );
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockVehicleAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);

        await vehicleInstance
          .connect(admin)
          .setVehicleInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            vehicleIdInstance.address,
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit VehicleAttributeSet events with correct params', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockVehicleAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(1, localNewAttributeInfoPairs)
        )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[0].attribute,
            localNewAttributeInfoPairs[0].info
          )
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(
            1,
            localNewAttributeInfoPairs[1].attribute,
            localNewAttributeInfoPairs[1].info
          );
      });
    });
  });

  describe('validateBurnAndResetNode', () => {
    it('Should revert if caller is not the NFT Proxy', async () => {
      await expect(
        vehicleInstance.connect(nonAdmin).validateBurnAndResetNode(1)
      ).to.be.revertedWith('OnlyNftProxy');
    });
  });
});
