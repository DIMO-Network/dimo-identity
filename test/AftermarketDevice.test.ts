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
  AMLicenseValidator,
  Resolver,
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
  let amLicenseValidatorInstance: AMLicenseValidator;
  let resolverInstance: Resolver;
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
    user2
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
      amLicenseValidatorInstance,
      resolverInstance
    ] = await initialize(
      admin,
      [C.name, C.symbol, C.baseURI],
      'Eip712Checker',
      'AccessControl',
      'Getter',
      'Manufacturer',
      'Vehicle',
      'AftermarketDevice',
      'AMLicenseValidator',
      'Resolver'
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

    // Setup AMLicenseValidator variables
    await amLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await amLicenseValidatorInstance.setDimoToken(
      mockDimoTokenInstance.address
    );
    await amLicenseValidatorInstance.setLicense(mockLicenseInstance.address);
    await amLicenseValidatorInstance.setAmDeviceMintCost(C.amDeviceMintCost);

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
    it('Should correctly decrease the DIMO balance of the manufacturer', async () => {
      const balanceChange = C.amDeviceMintCost
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
      const balanceChange = C.amDeviceMintCost.mul(
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
    let signature: string;
    before(async () => {
      signature = await signMessage(
        user1,
        C.defaultDomainName,
        C.defaultDomainVersion,
        network.config.chainId || 31337,
        'ClaimAftermarketDeviceSign',
        aftermarketDeviceInstance.address,
        {
          aftermarketDeviceNode: '2',
          _owner: user1.address
        }
      );
    });

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
          .claimAftermarketDeviceSign(2, user1.address, signature)
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
          .claimAftermarketDeviceSign(99, user1.address, signature)
      ).to.be.revertedWith('Invalid aftermarket device node');
    });

    context('Wrong signature', () => {
      it('Should revert if domain name is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          'Wrong domain',
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            _owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(2, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain version is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          '99',
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            _owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(2, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if domain chain ID is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          99,
          'ClaimAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            _owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(2, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if aftermarket device node is incorrect', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '99',
            _owner: user1.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(2, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
      it('Should revert if owner does not match signer', async () => {
        const invalidSignature = await signMessage(
          user1,
          C.defaultDomainName,
          C.defaultDomainVersion,
          network.config.chainId || 31337,
          'ClaimAftermarketDeviceSign',
          aftermarketDeviceInstance.address,
          {
            aftermarketDeviceNode: '2',
            _owner: user2.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(2, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
    });

    it('Should correctly set node owner', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(2, user1.address, signature);

      expect(await dimoRegistryInstance.ownerOf(2)).to.be.equal(user1.address);
    });
    it('Should emit AftermarketDeviceClaimed event with correct params', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(2, user1.address, signature)
      )
        .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
        .withArgs(2, user1.address);
    });
  });

  describe('pairAftermarketDeviceSign', () => {
    let signature: string;
    before(async () => {
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
          _owner: user1.address
        }
      );
    });

    beforeEach(async () => {
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          C.mockAftermarketDeviceAttributes,
          C.mockAftermarketDeviceMultipleInfos
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(
          1,
          user1.address,
          C.mockVehicleAttributes,
          C.mockVehicleInfos
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
      ).to.be.revertedWith('Invalid aftermarket device node');
    });
    it('Should revert if node is not a Vehicle', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(2, 99, user1.address, signature)
      ).to.be.revertedWith('Invalid vehicle node');
    });
    it('Should revert if _owner is not the vehicle node owner', async () => {
      await expect(
        aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(2, 4, user2.address, signature)
      ).to.be.revertedWith('Invalid vehicleNode owner');
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
            _owner: user1.address
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
            _owner: user1.address
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
            _owner: user1.address
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
            _owner: user1.address
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
            _owner: user1.address
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
            _owner: user2.address
          }
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 4, user1.address, invalidSignature)
        ).to.be.revertedWith('Invalid signature');
      });
    });

    it('Should correctly set aftermarket device as vehicle child', async () => {
      await aftermarketDeviceInstance
        .connect(admin)
        .pairAftermarketDeviceSign(2, 4, user1.address, signature);

      expect(await resolverInstance.getChild(4)).to.be.equal(2);
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
      ).to.be.revertedWith('Node must be an Aftermarket Device');
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
