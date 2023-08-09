import chai from 'chai';
import { ethers, waffle } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  Nodes,
  BaseDataURI,
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
  Mapper,
  MockDimoToken,
  MockStake
} from '../../typechain';
import {
  setup,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../../utils';

const { expect } = chai;
const provider = waffle.provider;

describe('VehicleId', async function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let nodesInstance: Nodes;
  let baseDataUriInstance: BaseDataURI;
  let manufacturerInstance: Manufacturer;
  let integrationInstance: Integration;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let syntheticDeviceInstance: SyntheticDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
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
        'BaseDataURI',
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
    baseDataUriInstance = deployments.BaseDataURI;
    manufacturerInstance = deployments.Manufacturer;
    integrationInstance = deployments.Integration;
    vehicleInstance = deployments.Vehicle;
    aftermarketDeviceInstance = deployments.AftermarketDevice;
    syntheticDeviceInstance = deployments.SyntheticDevice;
    adLicenseValidatorInstance = deployments.AdLicenseValidator;
    mapperInstance = deployments.Mapper;
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

    // Set base data URI
    await baseDataUriInstance.setBaseDataURI(
      vehicleIdInstance.address,
      C.BASE_DATA_URI
    );

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

    // Setting DimoRegistry address in the Proxy IDs
    await manufacturerIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await vehicleIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(dimoRegistryInstance.address);

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
        vehicleIdInstance
          .connect(nonAdmin)
          .setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should revert if addr is zero address', async () => {
      await expect(
        vehicleIdInstance.connect(admin).setDimoRegistryAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith('ZeroAddress');
    });
  });

  describe('setSyntheticDeviceIdAddress', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        vehicleIdInstance
          .connect(nonAdmin)
          .setSyntheticDeviceIdAddress(C.ZERO_ADDRESS)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set the Synthetic Device ID address', async () => {
      const mockSyntheticDeviceId = ethers.Wallet.createRandom();

      expect(await vehicleIdInstance.syntheticDeviceId()).to.be.equal(
        C.ZERO_ADDRESS
      );

      await vehicleIdInstance
        .connect(admin)
        .setSyntheticDeviceIdAddress(mockSyntheticDeviceId.address);

      expect(await vehicleIdInstance.syntheticDeviceId()).to.be.equal(
        mockSyntheticDeviceId.address
      );
    });
  });

  describe('setTrustedForwarder', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        vehicleIdInstance
          .connect(nonAdmin)
          .setTrustedForwarder(C.ZERO_ADDRESS, true)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.ADMIN_ROLE
        }`
      );
    });
    it('Should correctly set address as trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();

      // eslint-disable-next-line no-unused-expressions
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.false;

      await vehicleIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.true;
    });
    it('Should correctly set address as not trusted forwarder', async () => {
      const mockForwarder = ethers.Wallet.createRandom();
      await vehicleIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, true);

      // eslint-disable-next-line no-unused-expressions
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.true;

      await vehicleIdInstance
        .connect(admin)
        .setTrustedForwarder(mockForwarder.address, false);

      // eslint-disable-next-line no-unused-expressions
      expect(await vehicleIdInstance.trustedForwarders(mockForwarder.address))
        .to.be.false;
    });
  });

  context('On transfer', async () => {
    context('Error handling', () => {
      it('Should revert if caller is approved, but not the token owner', async () => {
        await vehicleIdInstance.connect(user1).approve(user2.address, 1);
        await expect(
          vehicleIdInstance
            .connect(user2)
            ['safeTransferFrom(address,address,uint256)'](
              user1.address,
              user2.address,
              1
            )
        ).to.be.revertedWith('Unauthorized');
      });
    });

    context('State', () => {
      it('Should set new owner', async () => {
        expect(await vehicleIdInstance.ownerOf(1)).to.equal(user1.address);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(await vehicleIdInstance.ownerOf(1)).to.equal(user2.address);
      });
      it('Should keep the same parent node', async () => {
        const parentNode = await nodesInstance.getParentNode(
          vehicleIdInstance.address,
          1
        );

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(vehicleIdInstance.address, 1)
        ).to.equal(parentNode);
      });
      it('Should keep the aftermarket device pairing', async () => {
        const pairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1'
          }
        });

        await aftermarketDeviceInstance
          .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            pairSignature
          );

        const vehicleIdToAdId = await mapperInstance.getLink(
          vehicleIdInstance.address,
          1
        );
        const adIdToVehicleId = await mapperInstance.getLink(
          adIdInstance.address,
          1
        );

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(
          await nodesInstance.getParentNode(vehicleIdInstance.address, 1)
        ).to.equal(vehicleIdToAdId);
        expect(
          await nodesInstance.getParentNode(adIdInstance.address, 1)
        ).to.equal(adIdToVehicleId);
      });
      it('Should keep the same infos', async () => {
        for (const attrInfoPair of C.mockVehicleAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        for (const attrInfoPair of C.mockVehicleAttributeInfoPairs) {
          expect(
            await nodesInstance.getInfo(
              vehicleIdInstance.address,
              1,
              attrInfoPair.attribute
            )
          ).to.equal(attrInfoPair.info);
        }
      });
      it('Should update multi-privilege token version', async () => {
        const previousVersion = await vehicleIdInstance.tokenIdToVersion(1);

        await vehicleIdInstance
          .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1
          );

        expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
          previousVersion.add(1)
        );
      });
    });
  });

  describe('getDataURI', () => {
    it('Should return the default data URI if no data is set in the token', async () => {
      const dataUriReturn = await vehicleIdInstance.getDataURI(1);

      expect(dataUriReturn).to.eq(`${C.BASE_DATA_URI}1`);
    });
    it('Should correctly return the data URI set in the token', async () => {
      const customDataUri = 'custom.data.uri';

      await vehicleInstance.addVehicleAttribute('Data URI');
      await vehicleInstance.connect(admin).setVehicleInfo(1, [
        {
          attribute: 'Data URI',
          info: customDataUri
        }
      ]);

      const dataUriReturn = await vehicleIdInstance.getDataURI(1);

      expect(dataUriReturn).to.equal(customDataUri);
    });
  });

  describe('getDefinitionURI', () => {
    it('Should return the empty if no definition is set in the token', async () => {
      const definitionUriReturn = await vehicleIdInstance.getDefinitionURI(1);

      expect(definitionUriReturn).to.eq('');
    });
    it('Should correctly return the definition URI set in the token', async () => {
      const customDefinitionUri = 'custom.definition.uri';

      await vehicleInstance.addVehicleAttribute('Definition URI');
      await vehicleInstance.connect(admin).setVehicleInfo(1, [
        {
          attribute: 'Definition URI',
          info: customDefinitionUri
        }
      ]);

      const definitionUriReturn = await vehicleIdInstance.getDefinitionURI(1);

      expect(definitionUriReturn).to.equal(customDefinitionUri);
    });
  });

  describe('burn', () => {
    context('Error handling', () => {
      it('Should revert if token is not a Vehicle', async () => {
        await expect(
          vehicleIdInstance.connect(user1).burn(99)
        ).to.be.revertedWith(`InvalidNode("${vehicleIdInstance.address}", 99)`);
      });
      it('Should revert if caller is not the token owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          vehicleIdInstance.connect(user1).burn(2)
        ).to.be.revertedWith('ERC721: caller is not token owner nor approved');
      });
      it('Should revert if Vehicle is paired to an Aftermarket Device', async () => {
        const localPairSignature = await signMessage({
          _signer: user1,
          _primaryType: 'PairAftermarketDeviceSign',
          _verifyingContract: aftermarketDeviceInstance.address,
          message: {
            aftermarketDeviceNode: '1',
            vehicleNode: '1'
          }
        });

        await aftermarketDeviceInstance
          .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            localPairSignature
          );

        await expect(
          vehicleIdInstance.connect(user1).burn(1)
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
          vehicleIdInstance.connect(user1).burn(1)
        ).to.be.revertedWith('VehiclePaired(1)');
      });

      context('State', () => {
        it('Should correctly reset parent node to 0', async () => {
          await vehicleIdInstance.connect(user1).burn(1);

          const parentNode = await nodesInstance.getParentNode(
            sdIdInstance.address,
            1
          );

          expect(parentNode).to.be.equal(0);
        });
        it('Should correctly reset node owner to zero address', async () => {
          await vehicleIdInstance.connect(user1).burn(1);

          await expect(sdIdInstance.ownerOf(1)).to.be.revertedWith(
            'ERC721: invalid token ID'
          );
        });
        it('Should correctly reset infos to blank', async () => {
          await vehicleIdInstance.connect(user1).burn(1);

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

          await vehicleIdInstance.connect(user1).burn(1);

          expect(await vehicleIdInstance.tokenIdToVersion(1)).to.equal(
            previousVersion.add(1)
          );
        });
      });

      context('Events', () => {
        it('Should emit VehicleNodeBurned event with correct params', async () => {
          await expect(vehicleIdInstance.connect(user1).burn(1))
            .to.emit(vehicleInstance, 'VehicleNodeBurned')
            .withArgs(1, user1.address);
        });
        it('Should emit VehicleAttributeSet events with correct params', async () => {
          await expect(vehicleIdInstance.connect(user1).burn(1))
            .to.emit(vehicleInstance, 'VehicleAttributeSet')
            .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, '')
            .to.emit(vehicleInstance, 'VehicleAttributeSet')
            .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, '');
        });
      });
    });
  });
});
