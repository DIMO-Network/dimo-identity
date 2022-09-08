import chai from 'chai';
import { ethers, waffle, network } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  AccessControl,
  Getter,
  Manufacturer,
  Vehicle,
  AftermarketDevice,
  ADLicenseValidator,
  Mapper,
  MockDimoToken,
  MockLicense
} from '../typechain';
import {
  initialize,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  C
} from '../utils';

const { expect } = chai;
const { solidity } = waffle;
const provider = waffle.provider;

chai.use(solidity);

describe('AftermarketDevice', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let accessControlInstance: AccessControl;
  let getterInstance: Getter;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let adLicenseValidatorInstance: ADLicenseValidator;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockLicenseInstance: MockLicense;

  const [
    admin,
    nonAdmin,
    foundation,
    controller1,
    manufacturer1,
    nonManufacturer,
    user1,
    user2,
    adAddress1,
    adAddress2
  ] = provider.getWallets();

  before(async () => {
    [
      dimoRegistryInstance,
      eip712CheckerInstance,
      accessControlInstance,
      getterInstance,
      manufacturerInstance,
      vehicleInstance,
      aftermarketDeviceInstance,
      adLicenseValidatorInstance,
      mapperInstance
    ] = await initialize(
      admin,
      [C.name, C.symbol, C.baseURI],
      'Eip712Checker',
      'AccessControl',
      'Getter',
      'Manufacturer',
      'Vehicle',
      'AftermarketDevice',
      'ADLicenseValidator',
      'Mapper'
    );

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

    // Deploy MockLicense contract
    const MockLicenseFactory = await ethers.getContractFactory('MockLicense');
    mockLicenseInstance = await MockLicenseFactory.connect(admin).deploy();
    await mockLicenseInstance.deployed();

    // Transfer DIMO Tokens to the manufacturer and approve DIMORegistry
    await mockDimoTokenInstance
      .connect(admin)
      .transfer(manufacturer1.address, C.manufacturerDimoTokensAmount);
    await mockDimoTokenInstance
      .connect(manufacturer1)
      .approve(dimoRegistryInstance.address, C.manufacturerDimoTokensAmount);

    // Setup ADLicenseValidator variables
    await adLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await adLicenseValidatorInstance.setDimoToken(
      mockDimoTokenInstance.address
    );
    await adLicenseValidatorInstance.setLicense(mockLicenseInstance.address);
    await adLicenseValidatorInstance.setAdMintCost(C.adMintCost);

    // Set node types
    await manufacturerInstance
      .connect(admin)
      .setManufacturerNodeType(C.manufacturerNodeType);
    await vehicleInstance.connect(admin).setVehicleNodeType(C.vehicleNodeType);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceNodeType(C.aftermarketDeviceNodeType);

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
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttributeAddress);
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1);
    await aftermarketDeviceInstance
      .connect(admin)
      .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute2);

    await manufacturerInstance
      .connect(admin)
      .mintManufacturer(
        controller1.address,
        C.mockManufacturerAttributes,
        C.mockManufacturerInfos
      );

    await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 1);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setAftermarketDeviceNodeType', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .setAftermarketDeviceNodeType(C.aftermarketDeviceNodeType)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node type is already set', async () => {
      const [, , , localAftermarketDeviceInstance] = await initialize(
        admin,
        [C.name, C.symbol, C.baseURI],
        'Manufacturer',
        'Vehicle',
        'AftermarketDevice'
      );

      await localAftermarketDeviceInstance
        .connect(admin)
        .setAftermarketDeviceNodeType(C.aftermarketDeviceNodeType);

      await expect(
        localAftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceNodeType(C.aftermarketDeviceNodeType)
      ).to.be.revertedWith('Node type already set');
    });
  });

  describe('addAftermarketDeviceAttribute', () => {
    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should emit AttributeAdded event with correct params', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute3)
      )
        .to.emit(aftermarketDeviceInstance, 'AttributeAdded')
        .withArgs(
          C.aftermarketDeviceNodeTypeId,
          C.mockAftermarketDeviceAttribute3
        );
    });
  });

  describe('mintAftermarketDeviceByManufacturerBatch', () => {
    it('Should revert if caller does not have manufacturer role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonManufacturer)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonManufacturer.address.toLowerCase()} is missing role ${
          C.MANUFACTURER_ROLE
        }`
      );
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if manufacturer does not have a license', async () => {
      await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 0);

      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('Invalid license');
    });
    it('Should revert if manufacturer does not have a enougth DIMO tokens', async () => {
      await mockDimoTokenInstance
        .connect(manufacturer1)
        .burn(C.manufacturerDimoTokensAmount);

      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });
    it('Should revert if manufacturer has not approve DIMORegistry', async () => {
      await mockDimoTokenInstance
        .connect(manufacturer1)
        .approve(dimoRegistryInstance.address, 0);

      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('ERC20: insufficient allowance');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.aftermarketDeviceAttributesNotWhitelisted,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should revert if device address is already registered', async () => {
      const infos = JSON.parse(
        JSON.stringify(C.mockAftermarketDeviceMultipleInfos)
      );
      infos[0][0] = adAddress1.address;
      infos[1][0] = adAddress1.address;

      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            infos
          )
      ).to.be.revertedWith('Device address already registered');
    });
    it('Should correctly set node type', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      const nodeType1 = await getterInstance.getNodeType(2);
      const nodeType2 = await getterInstance.getNodeType(3);

      expect(nodeType1).to.equal(C.aftermarketDeviceNodeTypeId);
      expect(nodeType2).to.equal(C.aftermarketDeviceNodeTypeId);
    });
    it('Should correctly set parent node', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      const parentNode1 = await getterInstance.getParentNode(2);
      const parentNode2 = await getterInstance.getParentNode(3);

      expect(parentNode1).to.be.equal(1);
      expect(parentNode2).to.be.equal(1);
    });
    it('Should correctly set nodes owner', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      expect(await dimoRegistryInstance.ownerOf(2)).to.be.equal(
        manufacturer1.address
      );
      expect(await dimoRegistryInstance.ownerOf(3)).to.be.equal(
        manufacturer1.address
      );
    });
    it('Should correctly set infos', async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );

      expect(
        await getterInstance.getInfo(2, C.mockAftermarketDeviceAttribute1)
      ).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(
        await getterInstance.getInfo(2, C.mockAftermarketDeviceAttribute2)
      ).to.be.equal(C.mockAftermarketDeviceInfo2);
      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute1)
      ).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute2)
      ).to.be.equal(C.mockAftermarketDeviceInfo2);
    });
    // TODO
    it('Should correctly set device address', async () => {});
    it('Should correctly decrease the DIMO balance of the manufacturer', async () => {
      const balanceChange = C.adMintCost
        .mul(C.mockAftermarketDeviceMultipleInfos.length)
        .mul(-1);

      await expect(() =>
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).changeTokenBalance(mockDimoTokenInstance, manufacturer1, balanceChange);
    });
    it('Should correctly transfer the DIMO tokens to the foundation', async () => {
      const balanceChange = C.adMintCost.mul(
        C.mockAftermarketDeviceMultipleInfos.length
      );

      await expect(() =>
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      ).changeTokenBalance(mockDimoTokenInstance, foundation, balanceChange);
    });
    it('Should emit NodeMinted event with correct params', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceMultipleInfos
          )
      )
        .to.emit(aftermarketDeviceInstance, 'NodeMinted')
        .withArgs(C.aftermarketDeviceNodeTypeId, 2)
        .to.emit(aftermarketDeviceInstance, 'NodeMinted')
        .withArgs(C.aftermarketDeviceNodeTypeId, 3);
    });
  });

  describe('claimAftermarketDeviceSign', () => {
    let ownerSig: string;
    let adSig: string;
    before(async () => {
      ownerSig = await signMessage(
        user1,
        C.defaultDomainName,
        C.defaultDomainVersion,
        network.config.chainId || 31337,
        'ClaimAftermarketDeviceOwnerSign',
        aftermarketDeviceInstance.address,
        {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      );
      adSig = await signMessage(
        adAddress1,
        C.defaultDomainName,
        C.defaultDomainVersion,
        network.config.chainId || 31337,
        'ClaimAftermarketDeviceAdSign',
        aftermarketDeviceInstance.address,
        {
          aftermarketDeviceNode: '2',
          signer: adAddress1.address
        }
      );
    });

    beforeEach(async () => {
      const infos = C.mockAftermarketDeviceMultipleInfos;
      infos[0][0] = adAddress1.address;
      infos[1][0] = adAddress2.address;

      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          infos
        );
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .claimAftermarketDeviceSign(2, user1.address, ownerSig, adSig)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node is not an Aftermarket Device', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(99, user1.address, ownerSig, adSig)
      ).to.be.revertedWith('Invalid AD node');
    });
    it('Should revert if device is already paired', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(2, user1.address, ownerSig, adSig);
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );

      const pairingSignature = await signMessage(
        user1,
        C.defaultDomainName,
        C.defaultDomainVersion,
        network.config.chainId || 31337,
        'PairAftermarketDeviceSign',
        aftermarketDeviceInstance.address,
        {
          aftermarketDeviceNode: '2',
          vehicleNode: '4',
          owner: user1.address
        }
      );

      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, user1.address, pairingSignature);

      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(2, user1.address, ownerSig, adSig)
      ).to.be.revertedWith('Device already paired');
    });

    context('Wrong owner signature', () => {
      it('Should revert if domain name is incorrect', async () => {
        const invalidOwnerSig = await signMessage(
          user1,
          'Wrong domain',
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceOwnerSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              invalidOwnerSig,
              adSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain version is incorrect', async () => {
        const invalidOwnerSig = await signMessage(
          user1,
          C.defaultDomainName,
          '99',
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceOwnerSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              invalidOwnerSig,
              adSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain chain ID is incorrect', async () => {
        const invalidOwnerSig = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          99,
          'ClaimAftermarketDeviceOwnerSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              invalidOwnerSig,
              adSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if aftermarket device node is incorrect', async () => {
        const invalidOwnerSig = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceOwnerSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '99',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              invalidOwnerSig,
              adSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if owner does not match signer', async () => {
        const invalidOwnerSig = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceOwnerSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            owner: user2.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              invalidOwnerSig,
              adSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
    });

    context('Wrong aftermarket device signature', () => {
      it('Should revert if domain name is incorrect', async () => {
        const invalidAdSig = await signMessage(
          adAddress1,
          'Wrong domain',
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceAdSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            signer: adAddress1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              ownerSig,
              invalidAdSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain version is incorrect', async () => {
        const invalidAdSig = await signMessage(
          adAddress1,
          C.defaultDomainName,
          '99',
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceAdSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            signer: adAddress1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              ownerSig,
              invalidAdSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain chain ID is incorrect', async () => {
        const invalidAdSig = await signMessage(
          adAddress1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          99,
          'ClaimAftermarketDeviceAdSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            signer: adAddress1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              ownerSig,
              invalidAdSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if aftermarket device node is incorrect', async () => {
        const invalidAdSig = await signMessage(
          adAddress1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceAdSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '99',
            signer: adAddress1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              ownerSig,
              invalidAdSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if signer does not match signer parameter', async () => {
        const invalidAdSig = await signMessage(
          adAddress1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceAdSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            signer: adAddress2.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              ownerSig,
              invalidAdSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if signer does not match address associated with aftermarket device ID', async () => {
        const invalidAdSig = await signMessage(
          adAddress1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceAdSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '3',
            signer: adAddress1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              2,
              user1.address,
              ownerSig,
              invalidAdSig
            )
        ).to.be.revertedWith('Invalid signature');
      });
    });

    it('Should correctly set node owner', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(2, user1.address, ownerSig, adSig);

      expect(await dimoRegistryInstance.ownerOf(2)).to.be.equal(user1.address);
    });
    it('Should emit AftermarketDeviceClaimed event with correct params', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(2, user1.address, ownerSig, adSig)
      )
        .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
        .withArgs(2, user1.address);
    });
  });

  describe('pairAftermarketDeviceSign', () => {
    let claimOwnerSig: string;
    let claimAdSig: string;
    let signature: string;
    before(async () => {
      claimOwnerSig = await signMessage(
        user1,
        C.defaultDomainName,
        C.defaultDomainVersion,
        network.config.chainId || 31337,
        'ClaimAftermarketDeviceOwnerSign',
        aftermarketDeviceInstance.address,
        {
          aftermarketDeviceNode: '2',
          owner: user1.address
        }
      );
      claimAdSig = await signMessage(
        adAddress1,
        C.defaultDomainName,
        C.defaultDomainVersion,
        network.config.chainId || 31337,
        'ClaimAftermarketDeviceAdSign',
        aftermarketDeviceInstance.address,
        {
          aftermarketDeviceNode: '2',
          signer: adAddress1.address
        }
      );
      signature = await signMessage(
        user1,
        C.defaultDomainName,
        C.defaultDomainVersion,
        network.config.chainId || 31337,
        'PairAftermarketDeviceSign',
        aftermarketDeviceInstance.address,
        {
          aftermarketDeviceNode: '2',
          vehicleNode: '4',
          owner: user1.address
        }
      );
    });

    beforeEach(async () => {
      const infos = C.mockAftermarketDeviceMultipleInfos;
      infos[0][0] = adAddress1.address;
      infos[1][0] = adAddress2.address;

      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          infos
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user1.address,
          claimOwnerSig,
          claimAdSig
        );
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .pairAftermarketDeviceSign(2, 4, user1.address, signature)
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node is not an Aftermarket Device', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(99, 4, user1.address, signature)
      ).to.be.revertedWith('Invalid AD node');
    });
    it('Should revert if node is not a Vehicle', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(2, 99, user1.address, signature)
      ).to.be.revertedWith('Invalid vehicle node');
    });
    it('Should revert if owner is not the vehicle node owner', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(2, 4, user2.address, signature)
      ).to.be.revertedWith('Invalid vehicleNode owner');
    });
    it('Should revert if owner is not the aftermarket device node owner', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(3, 4, user1.address, signature)
      ).to.be.revertedWith('Invalid AD node owner');
    });
    it('Should revert if vehicle is already paired', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, user1.address, signature);

      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(2, 4, user1.address, signature)
      ).to.be.revertedWith('Vehicle already paired');
    });
    it('Should revert if aftermarket device is already paired', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, user1.address, signature);

      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
        );

      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(2, 5, user1.address, signature)
      ).to.be.revertedWith('AD already paired');
    });

    context('Wrong signature', () => {
      it('Should revert if domain name is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          'Wrong domain',
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'PairAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            vehicleNode: '4',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 4, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain version is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          '99',
          network.config.chainId || 31337,
          'PairAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            vehicleNode: '4',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 4, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain chain ID is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          99,
          'PairAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            vehicleNode: '4',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 4, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if aftermarket device node is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'PairAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '99',
            vehicleNode: '4',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 4, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if aftermarket vehicle node is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'PairAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            vehicleNode: '99',
            owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 4, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if owner does not match signer', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'PairAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            vehicleNode: '4',
            owner: user2.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 4, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
    });

    it('Should correctly map the aftermarket device to the vehicle', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, user1.address, signature);

      expect(await mapperInstance.getLink(4)).to.be.equal(2);
    });
    it('Should correctly map the vehicle to the aftermarket device', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, user1.address, signature);

      expect(await mapperInstance.getLink(2)).to.be.equal(4);
    });
    it('Should emit AftermarketDevicePaired event with correct params', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(2, 4, user1.address, signature)
      )
        .to.emit(aftermarketDeviceInstance, 'AftermarketDevicePaired')
        .withArgs(2, 4, user1.address);
    });
  });

  describe('setAftermarketDeviceInfo', () => {
    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );
    });

    it('Should revert if caller does not have admin role', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(nonAdmin)
          .setAftermarketDeviceInfo(
            3,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceInfos
          )
      ).to.be.revertedWith(
        `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${
          C.DEFAULT_ADMIN_ROLE
        }`
      );
    });
    it('Should revert if node is not an Aftermarket Device', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(
            99,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceInfos
          )
      ).to.be.revertedWith('Node must be an AD');
    });
    it('Should revert if attributes and infos array length does not match', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(
            3,
            C.mockAftermarketDeviceAttributes,
            C.mockAftermarketDeviceInfosWrongSize
          )
      ).to.be.revertedWith('Same length');
    });
    it('Should revert if attribute is not whitelisted', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(
            3,
            C.aftermarketDeviceAttributesNotWhitelisted,
            C.mockAftermarketDeviceInfos
          )
      ).to.be.revertedWith('Not whitelisted');
    });
    it('Should correctly set infos', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .setAftermarketDeviceInfo(
          3,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceInfos
        );

      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute1)
      ).to.be.equal(C.mockAftermarketDeviceInfo1);
      expect(
        await getterInstance.getInfo(3, C.mockAftermarketDeviceAttribute2)
      ).to.be.equal(C.mockAftermarketDeviceInfo2);
    });
  });
});
