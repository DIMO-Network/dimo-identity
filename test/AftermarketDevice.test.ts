import chai from 'chai';
import { ethers, waffle, upgrades } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  DimoAccessControl,
  Nodes,
  Manufacturer,
  ManufacturerNft,
  Vehicle,
  VehicleNft,
  AftermarketDevice,
  AftermarketDeviceNft,
  AdLicenseValidator,
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
  let accessControlInstance: DimoAccessControl;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let aftermarketDeviceInstance: AftermarketDevice;
  let adLicenseValidatorInstance: AdLicenseValidator;
  let mapperInstance: Mapper;
  let mockDimoTokenInstance: MockDimoToken;
  let mockLicenseInstance: MockLicense;
  let manufacturerNftInstance: ManufacturerNft;
  let vehicleNftInstance: VehicleNft;
  let adNftInstance: AftermarketDeviceNft;

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
    adAddress2,
    notMintedAd
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
      nodesInstance,
      manufacturerInstance,
      vehicleInstance,
      aftermarketDeviceInstance,
      adLicenseValidatorInstance,
      mapperInstance
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

    const ManufacturerNftFactory = await ethers.getContractFactory(
      'ManufacturerNft'
    );
    const VehicleNftFactory = await ethers.getContractFactory('VehicleNft');
    const AftermarketDeviceNftFactory = await ethers.getContractFactory(
      'AftermarketDeviceNft'
    );

    manufacturerNftInstance = await upgrades.deployProxy(
      ManufacturerNftFactory,
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
    ) as ManufacturerNft;
    await manufacturerNftInstance.deployed();

    vehicleNftInstance = await upgrades.deployProxy(
      VehicleNftFactory,
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
    ) as VehicleNft;
    await vehicleNftInstance.deployed();

    adNftInstance = await upgrades.deployProxy(
      AftermarketDeviceNftFactory,
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
    ) as AftermarketDeviceNft;
    await adNftInstance.deployed();

    const MANUFACTURER_MINTER_ROLE =
      await manufacturerNftInstance.MINTER_ROLE();
    await manufacturerNftInstance
      .connect(admin)
      .grantRole(MANUFACTURER_MINTER_ROLE, dimoRegistryInstance.address);

    const VEHICLE_MINTER_ROLE = await vehicleNftInstance.MINTER_ROLE();
    await vehicleNftInstance
      .connect(admin)
      .grantRole(VEHICLE_MINTER_ROLE, dimoRegistryInstance.address);

    const AD_MINTER_ROLE = await adNftInstance.MINTER_ROLE();
    await adNftInstance
      .connect(admin)
      .grantRole(AD_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerNftProxyAddress(manufacturerNftInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleNftProxyAddress(vehicleNftInstance.address);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceNftProxyAddress(adNftInstance.address);

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

    // Setup AdLicenseValidator variables
    await adLicenseValidatorInstance.setFoundationAddress(foundation.address);
    await adLicenseValidatorInstance.setDimoToken(
      mockDimoTokenInstance.address
    );
    await adLicenseValidatorInstance.setLicense(mockLicenseInstance.address);
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
        controller1.address,
        C.mockManufacturerAttributeInfoPairs
      );

    await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adNftInstance
      .connect(admin)
      .grantRole(C.NFT_TRANSFERER_ROLE, dimoRegistryInstance.address);
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setAftermarketDeviceNftProxyAddress', () => {
    let localAdInstance: AftermarketDevice;
    beforeEach(async () => {
      [, localAdInstance] = await initialize(admin, 'AftermarketDevice');
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localAdInstance
            .connect(nonAdmin)
            .setAftermarketDeviceNftProxyAddress(adNftInstance.address)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localAdInstance
            .connect(admin)
            .setAftermarketDeviceNftProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceNftProxySet event with correct params', async () => {
        await expect(
          localAdInstance
            .connect(admin)
            .setAftermarketDeviceNftProxyAddress(adNftInstance.address)
        )
          .to.emit(localAdInstance, 'AftermarketDeviceNftProxySet')
          .withArgs(adNftInstance.address);
      });
    });
  });

  describe('addAftermarketDeviceAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1)
        ).to.be.revertedWith('Attribute already exists');
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceAttributeAdded event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute3)
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeAdded')
          .withArgs(C.mockAftermarketDeviceAttribute3);
      });
    });
  });

  describe('mintAftermarketDeviceByManufacturerBatch', () => {
    beforeEach(async () => {
      await adNftInstance
        .connect(manufacturer1)
        .setApprovalForAll(aftermarketDeviceInstance.address, true);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have manufacturer role', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonManufacturer)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList
            )
        ).to.be.revertedWith(
          `AccessControl: account ${nonManufacturer.address.toLowerCase()} is missing role ${C.MANUFACTURER_ROLE
          }`
        );
      });
      // TODO Check manufacturer ID ?
      it.skip('Should revert if parent node is not a Manufacturer', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              99,
              mockAftermarketDeviceInfosList
            )
        ).to.be.revertedWith('Invalid parent node');
      });
      it('Should revert if DIMO Registry is not approved for all', async () => {
        await adNftInstance
          .connect(manufacturer1)
          .setApprovalForAll(aftermarketDeviceInstance.address, false);

        await expect(
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList
            )
        ).to.be.revertedWith('Registry must be approved for all');
      });
      it('Should revert if manufacturer does not have a license', async () => {
        await mockLicenseInstance.setLicenseBalance(manufacturer1.address, 0);

        await expect(
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList
            )
        ).to.be.revertedWith('Invalid license');
      });
      it('Should revert if manufacturer does not have a enough DIMO tokens', async () => {
        await mockDimoTokenInstance
          .connect(manufacturer1)
          .burn(C.manufacturerDimoTokensAmount);

        await expect(
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList
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
              mockAftermarketDeviceInfosList
            )
        ).to.be.revertedWith('ERC20: insufficient allowance');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosListNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
      it('Should revert if device address is already registered', async () => {
        const localInfos = JSON.parse(
          JSON.stringify(mockAftermarketDeviceInfosList)
        );
        localInfos[1].addr = adAddress1.address;

        await expect(
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(1, localInfos)
        ).to.be.revertedWith('Device address already registered');
      });
    });

    context('State change', () => {
      // TODO Fix parent node type
      // it('Should correctly set parent node', async () => {
      //   await aftermarketDeviceInstance
      //     .connect(manufacturer1)
      //     .mintAftermarketDeviceByManufacturerBatch(
      //       1,
      //       mockAftermarketDeviceInfosList
      //     );

      //   const parentNode1 = await nodesInstance.getParentNode(2);
      //   const parentNode2 = await nodesInstance.getParentNode(3);

      //   expect(parentNode1).to.be.equal(1);
      //   expect(parentNode2).to.be.equal(1);
      // });
      it('Should correctly set nodes owner', async () => {
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList
          );

        expect(await adNftInstance.ownerOf(1)).to.be.equal(
          manufacturer1.address
        );
        expect(await adNftInstance.ownerOf(2)).to.be.equal(
          manufacturer1.address
        );
      });
      it('Should correctly set infos', async () => {
        await aftermarketDeviceInstance
          .connect(manufacturer1)
          .mintAftermarketDeviceByManufacturerBatch(
            1,
            mockAftermarketDeviceInfosList
          );

        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            1,
            C.mockAftermarketDeviceAttribute1
          )
        ).to.be.equal(C.mockAftermarketDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            1,
            C.mockAftermarketDeviceAttribute2
          )
        ).to.be.equal(C.mockAftermarketDeviceInfo2);
        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            2,
            C.mockAftermarketDeviceAttribute1
          )
        ).to.be.equal(C.mockAftermarketDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            2,
            C.mockAftermarketDeviceAttribute2
          )
        ).to.be.equal(C.mockAftermarketDeviceInfo2);
      });
      // TODO
      it('Should correctly set device address', async () => { });
      it('Should correctly decrease the DIMO balance of the manufacturer', async () => {
        const balanceChange = C.adMintCost
          .mul(C.mockAdAttributeInfoPairs.length)
          .mul(-1);

        await expect(() =>
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList
            )
        ).changeTokenBalance(
          mockDimoTokenInstance,
          manufacturer1,
          balanceChange
        );
      });
      it('Should correctly transfer the DIMO tokens to the foundation', async () => {
        const balanceChange = C.adMintCost.mul(
          C.mockAdAttributeInfoPairs.length
        );

        await expect(() =>
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList
            )
        ).changeTokenBalance(mockDimoTokenInstance, foundation, balanceChange);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceNodeMinted event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList
            )
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
          .withArgs(1, adAddress1.address)
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
          .withArgs(2, adAddress2.address);
      });
    });
  });

  describe('claimAftermarketDeviceSign', () => {
    let ownerSig: string;
    let adSig: string;
    before(async () => {
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
    });

    beforeEach(async () => {
      await adNftInstance
        .connect(manufacturer1)
        .setApprovalForAll(aftermarketDeviceInstance.address, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      // TODO Check node type ?
      it.skip('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(99, user1.address, ownerSig, adSig)
        ).to.be.revertedWith('Invalid AD node');
      });
      it('Should revert if device is already claimed', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);

        await expect(aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig)).to.be.revertedWith('Device already claimed');
      });

      context('Wrong owner signature', () => {
        it('Should revert if domain name is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if aftermarket device node is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '99',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if owner does not match signer', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user2.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
      });

      context('Wrong aftermarket device signature', () => {
        it('Should revert if domain name is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _domainName: 'Wrong domain',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _domainVersion: '99',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _chainId: 99,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if aftermarket device node is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '99',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if owner does not match owner parameter', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              owner: user2.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if signer does not match address associated with aftermarket device ID', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '2',
              owner: user1.address
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig
              )
          ).to.be.revertedWith('Invalid signature');
        });
      });
    });

    context('State change', async () => {
      it('Should correctly set node owner', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);

        expect(await adNftInstance.ownerOf(1)).to.be.equal(user1.address);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceClaimed event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig)
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
          .withArgs(1, user1.address);
      });
    });
  });

  describe('pairAftermarketDeviceSign', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    let pairSignature: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address
        }
      });
      claimOwnerSig2 = await signMessage({
        _signer: user2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address
        }
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address
        }
      });
      pairSignature = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: aftermarketDeviceInstance.address,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1'
        }
      });
    });

    beforeEach(async () => {
      await adNftInstance
        .connect(manufacturer1)
        .setApprovalForAll(aftermarketDeviceInstance.address, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
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

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .pairAftermarketDeviceSign(1, 1, pairSignature)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      // TODO check node type?
      it.skip('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(99, 4, pairSignature)
        ).to.be.revertedWith('Invalid AD node');
      });
      // TODO check node type?
      it.skip('Should revert if node is not a Vehicle', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 99, pairSignature)
        ).to.be.revertedWith('Invalid vehicle node');
      });
      it('Should revert if device is not claimed', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 1, pairSignature)
        ).to.be.revertedWith('AD must be claimed');
      });
      it('Should revert if owner is not the vehicle node owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(1, 2, pairSignature)
        ).to.be.revertedWith('Owner of the nodes does not match');
      });
      it('Should revert if owner is not the aftermarket device node owner', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            2,
            user2.address,
            claimOwnerSig2,
            claimAdSig2
          );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(2, 1, pairSignature)
        ).to.be.revertedWith('Owner of the nodes does not match');
      });
      it('Should revert if vehicle is already paired', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(1, 1, pairSignature);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(1, 1, pairSignature)
        ).to.be.revertedWith('Vehicle already paired');
      });
      it('Should revert if aftermarket device is already paired', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(1, 1, pairSignature);

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(1, 2, pairSignature)
        ).to.be.revertedWith('AD already paired');
      });

      context('Wrong signature', () => {
        it('Should revert if domain name is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1'
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .pairAftermarketDeviceSign(1, 1, invalidSignature)
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1'
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .pairAftermarketDeviceSign(1, 1, invalidSignature)
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1'
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .pairAftermarketDeviceSign(1, 1, invalidSignature)
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if aftermarket device node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '99',
              vehicleNode: '1'
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .pairAftermarketDeviceSign(1, 1, invalidSignature)
          ).to.be.revertedWith('Invalid signature');
        });
        it('Should revert if aftermarket vehicle node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: aftermarketDeviceInstance.address,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '99'
            }
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .pairAftermarketDeviceSign(1, 1, invalidSignature)
          ).to.be.revertedWith('Invalid signature');
        });
      });
    });

    context('State change', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(1, 1, pairSignature);

        expect(
          await mapperInstance.getLink(adNftInstance.address, 1)
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .pairAftermarketDeviceSign(1, 1, pairSignature);

        expect(
          await mapperInstance.getLink(vehicleNftInstance.address, 1)
        ).to.be.equal(1);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDevicePaired event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .pairAftermarketDeviceSign(1, 1, pairSignature)
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDevicePaired')
          .withArgs(1, 1, user1.address);
      });
    });
  });

  describe('setAftermarketDeviceInfo', () => {
    beforeEach(async () => {
      await adNftInstance
        .connect(manufacturer1)
        .setApprovalForAll(aftermarketDeviceInstance.address, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .setAftermarketDeviceInfo(1, C.mockAdAttributeInfoPairs)
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.DEFAULT_ADMIN_ROLE
          }`
        );
      });
      // TODO Check node type?
      it.skip('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .setAftermarketDeviceInfo(99, C.mockAdAttributeInfoPairs)
        ).to.be.revertedWith('Node must be an AD');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .setAftermarketDeviceInfo(
              1,
              C.mockAdAttributeInfoPairsNotWhitelisted
            )
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State change', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockAdAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            1,
            C.mockAftermarketDeviceAttribute1
          )
        ).to.be.equal(C.mockAftermarketDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            1,
            C.mockAftermarketDeviceAttribute2
          )
        ).to.be.equal(C.mockAftermarketDeviceInfo2);

        await aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            1,
            C.mockAftermarketDeviceAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            adNftInstance.address,
            1,
            C.mockAftermarketDeviceAttribute2
          )
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });
  });

  describe('getAftermarketDeviceIdByAddress', () => {
    beforeEach(async () => {
      await adNftInstance
        .connect(manufacturer1)
        .setApprovalForAll(aftermarketDeviceInstance.address, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList
        );
    });

    it('Should return 0 if the queried address is not associated with any minted device', async () => {
      const tokenId =
        await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
          notMintedAd.address
        );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId =
        await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
          adAddress1.address
        );

      expect(tokenId).to.equal(1);
    });
  });
});
