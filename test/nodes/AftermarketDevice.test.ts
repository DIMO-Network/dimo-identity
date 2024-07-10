import chai from 'chai';
import { ethers } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { time } from '@nomicfoundation/hardhat-network-helpers';

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
} from '../../typechain-types';
import {
  initialize,
  setup,
  grantAdminRoles,
  createSnapshot,
  revertToSnapshot,
  signMessage,
  AftermarketDeviceOwnerPair,
  AftermarketDeviceIdAddressPair,
  C,
} from '../../utils';

const { expect } = chai;

describe('AftermarketDevice', function () {
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
  let mockDimoCreditInstance: MockDimoCredit;
  let mockStakeInstance: MockStake;
  let manufacturerIdInstance: ManufacturerId;
  let vehicleIdInstance: VehicleId;
  let adIdInstance: AftermarketDeviceId;
  let expiresAtDefault: number;

  let DIMO_REGISTRY_ADDRESS: string;
  let VEHICLE_ID_ADDRESS: string;
  let AD_ID_ADDRESS: string;

  let admin: HardhatEthersSigner;
  let nonAdmin: HardhatEthersSigner;
  let manufacturer1: HardhatEthersSigner;
  let manufacturer2: HardhatEthersSigner;
  let manufacturerPrivileged1: HardhatEthersSigner;
  let nonManufacturer: HardhatEthersSigner;
  let nonManufacturerPrivilged: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let adAddress1: HardhatEthersSigner;
  let adAddress2: HardhatEthersSigner;
  let newAdAddress1: HardhatEthersSigner;
  let newAdAddress2: HardhatEthersSigner;
  let notMintedAd: HardhatEthersSigner;

  const mockAftermarketDeviceInfosList = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosList),
  );
  const mockAftermarketDeviceInfosListNotWhitelisted = JSON.parse(
    JSON.stringify(C.mockAftermarketDeviceInfosListNotWhitelisted),
  );

  before(async () => {
    [
      admin,
      nonAdmin,
      manufacturer1,
      manufacturer2,
      manufacturerPrivileged1,
      nonManufacturer,
      nonManufacturerPrivilged,
      user1,
      user2,
      adAddress1,
      adAddress2,
      newAdAddress1,
      newAdAddress2,
      notMintedAd,
    ] = await ethers.getSigners();

    mockAftermarketDeviceInfosList[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosList[1].addr = adAddress2.address;
    mockAftermarketDeviceInfosListNotWhitelisted[0].addr = adAddress1.address;
    mockAftermarketDeviceInfosListNotWhitelisted[1].addr = adAddress2.address;

    expiresAtDefault = (await time.latest()) + 31556926; // + 1 year

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
        'Shared'
      ],
      nfts: ['ManufacturerId', 'VehicleId', 'AftermarketDeviceId'],
      upgradeableContracts: [],
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
    manufacturerIdInstance = deployments.ManufacturerId;
    vehicleIdInstance = deployments.VehicleId;
    adIdInstance = deployments.AftermarketDeviceId;

    DIMO_REGISTRY_ADDRESS = await dimoRegistryInstance.getAddress();
    VEHICLE_ID_ADDRESS = await vehicleIdInstance.getAddress();
    AD_ID_ADDRESS = await adIdInstance.getAddress();

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
      .setVehicleIdProxyAddress(VEHICLE_ID_ADDRESS);
    await aftermarketDeviceInstance
      .connect(admin)
      .setAftermarketDeviceIdProxyAddress(AD_ID_ADDRESS);

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion,
    );

    // Mint DIMO Credit tokens to the admin, manufacturer and privileged address
    await mockDimoCreditInstance
      .connect(admin)
      .mint(admin.address, C.adminDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(manufacturer1.address, C.manufacturerDimoCreditTokensAmount);
    await mockDimoCreditInstance
      .connect(admin)
      .mint(
        manufacturerPrivileged1.address,
        C.manufacturerDimoCreditTokensAmount,
      );

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
        C.mockManufacturerAttributeInfoPairs,
      );

    await mockStakeInstance.setLicenseBalance(manufacturer1.address, 1);

    // Grant Transferer role to DIMO Registry
    await adIdInstance
      .connect(admin)
      .grantRole(
        C.NFT_TRANSFERER_ROLE,
        DIMO_REGISTRY_ADDRESS,
      );

    // Setting DimoRegistry address in the AftermarketDeviceId
    await adIdInstance
      .connect(admin)
      .setDimoRegistryAddress(DIMO_REGISTRY_ADDRESS);

    // Setting DIMORegistry address
    await manufacturerIdInstance.setDimoRegistryAddress(
      DIMO_REGISTRY_ADDRESS,
    );

    // Create and set privileges
    await manufacturerIdInstance.createPrivilege(true, 'Minter');
    await manufacturerIdInstance.createPrivilege(true, 'Claimer');
    await manufacturerIdInstance.createPrivilege(true, 'Manufacturer Factory Reset');
    await manufacturerIdInstance.createPrivilege(true, 'Manufacturer Reprovision');
    await manufacturerIdInstance
      .connect(manufacturer1)
      .setPrivilege(
        1,
        C.MANUFACTURER_MINTER_PRIVILEGE,
        manufacturerPrivileged1.address,
        expiresAtDefault,
      );
    await manufacturerIdInstance
      .connect(manufacturer1)
      .setPrivilege(
        1,
        C.MANUFACTURER_CLAIMER_PRIVILEGE,
        manufacturerPrivileged1.address,
        expiresAtDefault,
      );
    await manufacturerIdInstance
      .connect(manufacturer1)
      .setPrivilege(
        1,
        C.MANUFACTURER_FACTORY_RESET_PRIVILEGE,
        manufacturerPrivileged1.address,
        expiresAtDefault,
      );
    await manufacturerIdInstance
      .connect(manufacturer1)
      .setPrivilege(
        1,
        C.MANUFACTURER_REPROVISION_PRIVILEGE,
        manufacturerPrivileged1.address,
        expiresAtDefault,
      );
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setAftermarketDeviceIdProxyAddress', () => {
    let localAdInstance: AftermarketDevice;
    beforeEach(async () => {
      const deployments = await initialize(
        admin,
        'DimoAccessControl',
        'AftermarketDevice',
      );

      const localDimoAccessControlInstance = deployments.DimoAccessControl;
      localAdInstance = deployments.AftermarketDevice;

      await localDimoAccessControlInstance
        .connect(admin)
        .grantRole(C.ADMIN_ROLE, admin.address);
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localAdInstance
            .connect(nonAdmin)
            .setAftermarketDeviceIdProxyAddress(
              AD_ID_ADDRESS,
            ),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`,
        );
      });
      it('Should revert if proxy is zero address', async () => {
        await expect(
          localAdInstance
            .connect(admin)
            .setAftermarketDeviceIdProxyAddress(C.ZERO_ADDRESS),
        ).to.be.revertedWithCustomError(localAdInstance, 'ZeroAddress');
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceIdProxySet event with correct params', async () => {
        await expect(
          localAdInstance
            .connect(admin)
            .setAftermarketDeviceIdProxyAddress(
              AD_ID_ADDRESS,
            ),
        )
          .to.emit(localAdInstance, 'AftermarketDeviceIdProxySet')
          .withArgs(AD_ID_ADDRESS);
      });
    });
  });

  describe('addAftermarketDeviceAttribute', () => {
    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.ADMIN_ROLE
          }`,
        );
      });
      it('Should revert if attribute already exists', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute1),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'AttributeExists',
          )
          .withArgs(C.mockAftermarketDeviceAttribute1);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceAttributeAdded event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .addAftermarketDeviceAttribute(C.mockAftermarketDeviceAttribute3),
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeAdded')
          .withArgs(C.mockAftermarketDeviceAttribute3);
      });
    });
  });

  describe('mintAftermarketDeviceByManufacturerBatch', () => {
    context('Manufacturer as minter', () => {
      beforeEach(async () => {
        await adIdInstance
          .connect(manufacturer1)
          .setApprovalForAll(
            DIMO_REGISTRY_ADDRESS,
            true,
          );
      });

      context('Error handling', () => {
        it('Should revert if caller is not authorized nor the manufacturer node owner', async () => {
          await adIdInstance
            .connect(nonManufacturer)
            .setApprovalForAll(
              DIMO_REGISTRY_ADDRESS,
              true,
            );

          await expect(
            aftermarketDeviceInstance
              .connect(nonManufacturer)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'Unauthorized',
            )
            .withArgs(nonManufacturer.address);
        });
        it('Should revert if parent node is not a Manufacturer', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(
                99,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidParentNode',
            )
            .withArgs(99);
        });
        it('Should revert if the caller is not the parent node owner', async () => {
          await adIdInstance
            .connect(manufacturer2)
            .setApprovalForAll(
              DIMO_REGISTRY_ADDRESS,
              true,
            );

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer2)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'Unauthorized',
            )
            .withArgs(manufacturer2.address);
        });
        it('Should revert if manufacturer does not have a license', async () => {
          await mockStakeInstance.setLicenseBalance(manufacturer1.address, 0);

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidLicense',
          );
        });
        it('Should revert if manufacturer does not have enough DIMO Credit tokens', async () => {
          await mockDimoCreditInstance
            .connect(admin)
            .burn(manufacturer1.address, C.manufacturerDimoCreditTokensAmount);

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWith('ERC20: burn amount exceeds balance');
        });
        it('Should revert if attribute is not whitelisted', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosListNotWhitelisted,
              ),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'AttributeNotWhitelisted',
            )
            .withArgs(
              mockAftermarketDeviceInfosListNotWhitelisted[1].attrInfoPairs[1]
                .attribute,
            );
        });
        it('Should revert if device address is already registered', async () => {
          const localInfos = JSON.parse(
            JSON.stringify(mockAftermarketDeviceInfosList),
          );
          localInfos[1].addr = adAddress1.address;

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(1, localInfos),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'DeviceAlreadyRegistered',
            )
            .withArgs(adAddress1.address);
        });
      });

      context('State', () => {
        it('Should correctly set parent node', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          const parentNode1 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            1,
          );
          const parentNode2 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            2,
          );

          expect(parentNode1).to.be.equal(1);
          expect(parentNode2).to.be.equal(1);
        });
        it('Should correctly set nodes owner', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          expect(await adIdInstance.ownerOf(1)).to.be.equal(
            manufacturer1.address,
          );
          expect(await adIdInstance.ownerOf(2)).to.be.equal(
            manufacturer1.address,
          );
        });
        it('Should correctly set device address', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          const id1 =
            await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
              mockAftermarketDeviceInfosList[0].addr,
            );
          const id2 =
            await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
              mockAftermarketDeviceInfosList[1].addr,
            );

          expect(id1).to.equal(1);
          expect(id2).to.equal(2);
        });
        it('Should correctly set infos', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
        });
        it('Should correctly burn DIMO Credit tokens from the sender', async () => {
          const balanceChange =
            C.MINT_AD_OPERATION_COST *
            ethers.toBigInt(C.mockAdAttributeInfoPairs.length) *
            ethers.toBigInt(-1);

          await expect(() =>
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).changeTokenBalance(
            mockDimoCreditInstance,
            manufacturer1,
            balanceChange,
          );
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceNodeMinted event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 1, adAddress1.address, manufacturer1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 2, adAddress2.address, manufacturer1.address);
        });
        it('Should emit AftermarketDeviceAttributeSet events with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].info,
            );
        });
      });
    });

    context('Privileged address as minter', () => {
      context('Error handling', () => {
        it('Should revert if parent node is not a Manufacturer', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                99,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidParentNode',
            )
            .withArgs(99);
        });
        it('Should revert if the caller does not have the minter privilege', async () => {
          await adIdInstance
            .connect(nonManufacturerPrivilged)
            .setApprovalForAll(
              DIMO_REGISTRY_ADDRESS,
              true,
            );

          await expect(
            aftermarketDeviceInstance
              .connect(nonManufacturerPrivilged)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if privilage has been disabled', async () => {
          await manufacturerIdInstance.disablePrivilege(
            C.MANUFACTURER_MINTER_PRIVILEGE,
          );
          await adIdInstance
            .connect(manufacturerPrivileged1)
            .setApprovalForAll(
              DIMO_REGISTRY_ADDRESS,
              true,
            );

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if privilage is expired', async () => {
          await time.increase(expiresAtDefault + 100);

          await adIdInstance
            .connect(manufacturerPrivileged1)
            .setApprovalForAll(
              DIMO_REGISTRY_ADDRESS,
              true,
            );

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if manufacturer has transferred their token', async () => {
          await manufacturerInstance
            .connect(admin)
            .setController(manufacturer2.address);
          await manufacturerIdInstance
            .connect(admin)
            .grantRole(C.NFT_TRANSFERER_ROLE, manufacturer1.address);
          await manufacturerIdInstance
            .connect(manufacturer1)
          ['safeTransferFrom(address,address,uint256)'](
            manufacturer1.address,
            manufacturer2.address,
            1,
          );

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if manufacturer does not have a license', async () => {
          await mockStakeInstance.setLicenseBalance(manufacturer1.address, 0);

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidLicense',
          );
        });
        it('Should revert if privileged account does not have enough DIMO Credit tokens', async () => {
          await mockDimoCreditInstance
            .connect(admin)
            .burn(manufacturerPrivileged1.address, C.manufacturerDimoTokensAmount);

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).to.be.revertedWith('ERC20: burn amount exceeds balance');
        });
        it('Should revert if attribute is not whitelisted', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosListNotWhitelisted,
              ),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'AttributeNotWhitelisted',
            )
            .withArgs(
              mockAftermarketDeviceInfosListNotWhitelisted[1].attrInfoPairs[1]
                .attribute,
            );
        });
        it('Should revert if device address is already registered', async () => {
          const localInfos = JSON.parse(
            JSON.stringify(mockAftermarketDeviceInfosList),
          );
          localInfos[1].addr = adAddress1.address;

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(1, localInfos),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'DeviceAlreadyRegistered',
            )
            .withArgs(localInfos[1].addr);
        });
      });

      context('State', () => {
        it('Should correctly set parent node', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          const parentNode1 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            1,
          );
          const parentNode2 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            2,
          );

          expect(parentNode1).to.be.equal(1);
          expect(parentNode2).to.be.equal(1);
        });
        it('Should correctly set nodes owner', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          expect(await adIdInstance.ownerOf(1)).to.be.equal(
            manufacturer1.address,
          );
          expect(await adIdInstance.ownerOf(2)).to.be.equal(
            manufacturer1.address,
          );
        });
        it('Should correctly set device address', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          const id1 =
            await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
              mockAftermarketDeviceInfosList[0].addr,
            );
          const id2 =
            await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
              mockAftermarketDeviceInfosList[1].addr,
            );

          expect(id1).to.equal(1);
          expect(id2).to.equal(2);
        });
        it('Should correctly set infos', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .mintAftermarketDeviceByManufacturerBatch(
              1,
              mockAftermarketDeviceInfosList,
            );

          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
        });
        it('Should correctly decrease the DIMO balance of the privileged address', async () => {
          const balanceChange =
            C.MINT_AD_OPERATION_COST *
            ethers.toBigInt(C.mockAdAttributeInfoPairs.length) *
            ethers.toBigInt(-1);

          await expect(() =>
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          ).changeTokenBalance(
            mockDimoCreditInstance,
            manufacturerPrivileged1,
            balanceChange,
          );
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceNodeMinted event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 1, adAddress1.address, manufacturer1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 2, adAddress2.address, manufacturer1.address);
        });
        it('Should emit AftermarketDeviceAttributeSet events with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .mintAftermarketDeviceByManufacturerBatch(
                1,
                mockAftermarketDeviceInfosList,
              ),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].info,
            );
        });
      });
    });
  });

  describe('claimAftermarketDeviceBatch', () => {
    let localAdOwnerPairs: AftermarketDeviceOwnerPair[] = [];
    let ownerSig: string;
    let adSig: string;
    before(async () => {
      localAdOwnerPairs = [
        { aftermarketDeviceNodeId: '1', owner: await user1.address },
        { aftermarketDeviceNodeId: '2', owner: await user2.address },
      ];

      ownerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Admin as claimer', () => {
      context('Error handling', () => {
        it('Should revert if caller does not have admin role', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(nonAdmin)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if device is already claimed', async () => {
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'DeviceAlreadyClaimed',
            )
            .withArgs(1);
        });
      });

      context('State', async () => {
        it('Should correctly set node owners', async () => {
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);
          expect(await adIdInstance.ownerOf(2)).to.be.equal(user2.address);
        });
        it('Should correctly set nodes as claimed', async () => {
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.false;

          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.true;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.true;
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceClaimed event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
            .withArgs(1, user1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
            .withArgs(2, user2.address);
        });
      });
    });

    context('Privileged address as claimer', () => {
      context('Error handling', () => {
        it('Should revert if device is already claimed', async () => {
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'DeviceAlreadyClaimed',
            )
            .withArgs(1);
        });
        it('Should revert if the caller does not have the minter privilege', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(nonManufacturerPrivilged)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if privilage has been disabled', async () => {
          await manufacturerIdInstance.disablePrivilege(
            C.MANUFACTURER_CLAIMER_PRIVILEGE,
          );
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if privilage is expired', async () => {
          await time.increase(expiresAtDefault + 100);

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
        it('Should revert if manufacturer has transferred their token', async () => {
          await manufacturerInstance
            .connect(admin)
            .setController(manufacturer2.address);
          await manufacturerIdInstance
            .connect(admin)
            .grantRole(C.NFT_TRANSFERER_ROLE, manufacturer1.address);
          await manufacturerIdInstance
            .connect(manufacturer1)
          ['safeTransferFrom(address,address,uint256)'](
            manufacturer1.address,
            manufacturer2.address,
            1,
          );

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          );
        });
      });

      context('State', async () => {
        it('Should correctly set node owners', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);
          expect(await adIdInstance.ownerOf(2)).to.be.equal(user2.address);
        });
        it('Should correctly set nodes as claimed', async () => {
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.false;

          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.true;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.true;
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceClaimed event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .claimAftermarketDeviceBatch(1, localAdOwnerPairs),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
            .withArgs(1, user1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
            .withArgs(2, user2.address);
        });
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
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have CLAIM_AD_ROLE', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.CLAIM_AD_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(99, user1.address, ownerSig, adSig),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(AD_ID_ADDRESS, 99);
      });
      it('Should revert if device is already claimed', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'DeviceAlreadyClaimed',
          )
          .withArgs(1);
      });

      context('Wrong owner signature', () => {
        it('Should revert if domain name is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if aftermarket device node is incorrect', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '99',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if owner does not match signer', async () => {
          const invalidOwnerSig = await signMessage({
            _signer: user1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user2.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                invalidOwnerSig,
                adSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
      });

      context('Wrong aftermarket device signature', () => {
        it('Should revert if domain name is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _domainName: 'Wrong domain',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidAdSignature',
          );
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _domainVersion: '99',
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidAdSignature',
          );
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _chainId: 99,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidAdSignature',
          );
        });
        it('Should revert if aftermarket device node is incorrect', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '99',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidAdSignature',
          );
        });
        it('Should revert if owner does not match owner parameter', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              owner: user2.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidAdSignature',
          );
        });
        it('Should revert if signer does not match address associated with aftermarket device ID', async () => {
          const invalidAdSig = await signMessage({
            _signer: adAddress1,
            _primaryType: 'ClaimAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '2',
              owner: user1.address,
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                ownerSig,
                invalidAdSig,
              ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidAdSignature',
          );
        });
      });
    });

    context('State', async () => {
      it('Should correctly set node owner', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);

        expect(await adIdInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set node as claimed', async () => {
        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.false;

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);

        expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.true;
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceClaimed event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig),
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceClaimed')
          .withArgs(1, user1.address);
      });
    });
  });

  describe('pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)', () => {
    let claimOwnerSig2: string;
    let claimAdSig2: string;
    let pairVehicleSig1: string;
    let pairAdSig1: string;
    let pairAdSig2: string;
    before(async () => {
      claimOwnerSig2 = await signMessage({
        _signer: user2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address,
        },
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address,
        },
      });
      pairVehicleSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '1',
        },
      });
      pairAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
        },
      });
      pairAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '2',
          vehicleNode: '1',
        },
      });
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
      await vehicleInstance
        .connect(admin)
        .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(
          2,
          user2.address,
          claimOwnerSig2,
          claimAdSig2,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have PAIR_AD_ROLE', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
            2,
            1,
            pairAdSig2,
            pairVehicleSig1,
          ),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.PAIR_AD_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
            2,
            99,
            pairAdSig2,
            pairVehicleSig1,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(VEHICLE_ID_ADDRESS, 99);
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
            99,
            1,
            pairAdSig2,
            pairVehicleSig1,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(AD_ID_ADDRESS, 99);
      });
      it('Should revert if device is not claimed', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
            1,
            1,
            pairAdSig1,
            pairVehicleSig1,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'AdNotClaimed',
          )
          .withArgs(1);
      });
      it('Should revert if vehicle is already paired', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
          2,
          1,
          pairAdSig2,
          pairVehicleSig1,
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
            2,
            1,
            pairAdSig2,
            pairVehicleSig1,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'VehiclePaired',
          )
          .withArgs(1);
      });
      it('Should revert if aftermarket device is already paired', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
          2,
          1,
          pairAdSig2,
          pairVehicleSig1,
        );

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
            2,
            2,
            pairAdSig2,
            pairVehicleSig1,
          ),
        )
          .to.be.revertedWithCustomError(aftermarketDeviceInstance, 'AdPaired')
          .withArgs(2);
      });

      context('Wrong signature', () => {
        context('Aftermarket device signature', () => {
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _domainName: 'Wrong domain',
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                invalidSignature,
                pairVehicleSig1,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidAdSignature',
            );
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _domainVersion: '99',
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                invalidSignature,
                pairVehicleSig1,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidAdSignature',
            );
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _chainId: 99,
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                invalidSignature,
                pairVehicleSig1,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidAdSignature',
            );
          });
          it('Should revert if aftermarket device node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '99',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                invalidSignature,
                pairVehicleSig1,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidAdSignature',
            );
          });
          it('Should revert if aftermarket vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: adAddress1,
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '99',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                invalidSignature,
                pairVehicleSig1,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidAdSignature',
            );
          });
        });

        context('Vehicle owner signature', () => {
          it('Should revert if domain name is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainName: 'Wrong domain',
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                pairAdSig2,
                invalidSignature,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if domain version is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _domainVersion: '99',
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                pairAdSig2,
                invalidSignature,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if domain chain ID is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _chainId: 99,
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                pairAdSig2,
                invalidSignature,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if aftermarket device node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '99',
                vehicleNode: '1',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                pairAdSig2,
                invalidSignature,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
          it('Should revert if aftermarket vehicle node is incorrect', async () => {
            const invalidSignature = await signMessage({
              _signer: user1,
              _primaryType: 'PairAftermarketDeviceSign',
              _verifyingContract: DIMO_REGISTRY_ADDRESS,
              message: {
                aftermarketDeviceNode: '1',
                vehicleNode: '99',
              },
            });

            await expect(
              aftermarketDeviceInstance
                .connect(admin)
              ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
                2,
                1,
                pairAdSig2,
                invalidSignature,
              ),
            ).to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidOwnerSignature',
            );
          });
        });
      });
    });

    context('State', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
          2,
          1,
          pairAdSig2,
          pairVehicleSig1,
        );

        expect(
          await mapperInstance.getLink(AD_ID_ADDRESS, 2),
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
          2,
          1,
          pairAdSig2,
          pairVehicleSig1,
        );

        expect(
          await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 1),
        ).to.be.equal(2);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDevicePaired event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes,bytes)'](
            2,
            1,
            pairAdSig2,
            pairVehicleSig1,
          ),
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDevicePaired')
          .withArgs(2, 1, user2.address);
      });
    });
  });

  describe('pairAftermarketDeviceSign(uint256,uint256,bytes)', () => {
    let claimOwnerSig1: string;
    let claimOwnerSig2: string;
    let claimAdSig1: string;
    let claimAdSig2: string;
    let pairSignature: string;
    before(async () => {
      claimOwnerSig1 = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimAdSig1 = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimOwnerSig2 = await signMessage({
        _signer: user2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address,
        },
      });
      claimAdSig2 = await signMessage({
        _signer: adAddress2,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '2',
          owner: user2.address,
        },
      });
      pairSignature = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
        },
      });
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
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
          claimAdSig1,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have PAIR_AD_ROLE', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            pairSignature,
          ),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.PAIR_AD_ROLE
          }`,
        );
      });
      it('Should revert if node is not a Vehicle', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            99,
            pairSignature,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(VEHICLE_ID_ADDRESS, 99);
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            99,
            1,
            pairSignature,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(AD_ID_ADDRESS, 99);
      });
      it('Should revert if device is not claimed', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            2,
            1,
            pairSignature,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'AdNotClaimed',
          )
          .withArgs(2);
      });
      it('Should revert if owner is not the vehicle node owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            2,
            pairSignature,
          ),
        ).to.be.revertedWithCustomError(
          aftermarketDeviceInstance,
          'OwnersDoNotMatch',
        );
      });
      it('Should revert if owner is not the aftermarket device node owner', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            2,
            user2.address,
            claimOwnerSig2,
            claimAdSig2,
          );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            2,
            1,
            pairSignature,
          ),
        ).to.be.revertedWithCustomError(
          aftermarketDeviceInstance,
          'OwnersDoNotMatch',
        );
      });
      it('Should revert if vehicle is already paired', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            pairSignature,
          ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'VehiclePaired',
          )
          .withArgs(1);
      });
      it('Should revert if aftermarket device is already paired', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );

        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            2,
            pairSignature,
          ),
        )
          .to.be.revertedWithCustomError(aftermarketDeviceInstance, 'AdPaired')
          .withArgs(1);
      });

      context('Wrong signature', () => {
        it('Should revert if domain name is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
            ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
              1,
              1,
              invalidSignature,
            ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
            ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
              1,
              1,
              invalidSignature,
            ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
            ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
              1,
              1,
              invalidSignature,
            ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if aftermarket device node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '99',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
            ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
              1,
              1,
              invalidSignature,
            ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
        it('Should revert if aftermarket vehicle node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '99',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
            ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
              1,
              1,
              invalidSignature,
            ),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidOwnerSignature',
          );
        });
      });
    });

    context('State', () => {
      it('Should correctly map the aftermarket device to the vehicle', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );

        expect(
          await mapperInstance.getLink(AD_ID_ADDRESS, 1),
        ).to.be.equal(1);
      });
      it('Should correctly map the vehicle to the aftermarket device', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );

        expect(
          await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 1),
        ).to.be.equal(1);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDevicePaired event with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            pairSignature,
          ),
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDevicePaired')
          .withArgs(1, 1, user1.address);
      });
    });
  });

  describe('unpairAftermarketDevice', () => {
    let claimOwnerSig: string;
    let claimAdSig: string;
    let pairSignature: string;

    before(async () => {
      claimOwnerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimAdSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      pairSignature = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
        },
      });
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Error handling', () => {
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(user1)
            .unpairAftermarketDevice(99, 1),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(AD_ID_ADDRESS, 99);
      });
      it('Should revert if node is not a Vehicle', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          aftermarketDeviceInstance
            .connect(user1)
            .unpairAftermarketDevice(1, 99),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(VEHICLE_ID_ADDRESS, 99);
      });
      it('Should revert if vehicle is not paired', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig,
            claimAdSig,
          );
        await expect(
          aftermarketDeviceInstance
            .connect(user1)
            .unpairAftermarketDevice(1, 1),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'VehicleNotPaired',
          )
          .withArgs(1);
      });
      it('Should revert if caller does the vehicle or aftermarket device owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig,
            claimAdSig,
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );

        await expect(
          aftermarketDeviceInstance
            .connect(user2)
            .unpairAftermarketDevice(1, 1),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'Unauthorized',
          )
          .withArgs(user2.address);
      });
    });

    context('State', () => {
      beforeEach(async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig,
            claimAdSig,
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );
      });

      context(
        'Being the owner of the vehicle and the aftermarket device',
        () => {
          it('Should correctly unmap the aftermarket device from vehicle', async () => {
            await aftermarketDeviceInstance
              .connect(user1)
              .unpairAftermarketDevice(1, 1);

            expect(
              await mapperInstance.getLink(AD_ID_ADDRESS, 1),
            ).to.be.equal(0);
          });

          it('Should correctly unmap the vehicle from the aftermarket device', async () => {
            await aftermarketDeviceInstance
              .connect(user1)
              .unpairAftermarketDevice(1, 1);

            expect(
              await mapperInstance.getLink(
                VEHICLE_ID_ADDRESS,
                1,
              ),
            ).to.be.equal(0);
          });
        },
      );

      context('Being the owner of the vehicle', () => {
        beforeEach(async () => {
          await adIdInstance
            .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1,
          );
        });

        it('Should correctly unmap the aftermarket device from vehicle', async () => {
          await aftermarketDeviceInstance
            .connect(user1)
            .unpairAftermarketDevice(1, 1);

          expect(
            await mapperInstance.getLink(AD_ID_ADDRESS, 1),
          ).to.be.equal(0);
        });

        it('Should correctly unmap the vehicle from the aftermarket device', async () => {
          await aftermarketDeviceInstance
            .connect(user1)
            .unpairAftermarketDevice(1, 1);

          expect(
            await mapperInstance.getLink(
              VEHICLE_ID_ADDRESS,
              1,
            ),
          ).to.be.equal(0);
        });
      });

      context('Being the owner of the aftermarket device', () => {
        beforeEach(async () => {
          await adIdInstance
            .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1,
          );
        });

        it('Should correctly unmap the aftermarket device from vehicle', async () => {
          await aftermarketDeviceInstance
            .connect(user2)
            .unpairAftermarketDevice(1, 1);

          expect(
            await mapperInstance.getLink(AD_ID_ADDRESS, 1),
          ).to.be.equal(0);
        });

        it('Should correctly unmap the vehicle from the aftermarket device', async () => {
          await aftermarketDeviceInstance
            .connect(user2)
            .unpairAftermarketDevice(1, 1);

          expect(
            await mapperInstance.getLink(
              VEHICLE_ID_ADDRESS,
              1,
            ),
          ).to.be.equal(0);
        });
      });
    });

    context('Events', () => {
      context(
        'Being the owner of the vehicle and the aftermarket device',
        () => {
          it('Should emit AftermarketDeviceUnPaired event with correct params', async () => {
            await vehicleInstance
              .connect(admin)
              .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

            await aftermarketDeviceInstance
              .connect(admin)
              .claimAftermarketDeviceSign(
                1,
                user1.address,
                claimOwnerSig,
                claimAdSig,
              );

            await aftermarketDeviceInstance
              .connect(admin)
            ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
              1,
              1,
              pairSignature,
            );

            await expect(
              aftermarketDeviceInstance
                .connect(user1)
                .unpairAftermarketDevice(1, 1),
            )
              .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
              .withArgs(1, 1, user1.address);
          });
        },
      );

      context('Being the owner of the vehicle', () => {
        it('Should emit AftermarketDeviceUnPaired event with correct params', async () => {
          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              1,
              user1.address,
              claimOwnerSig,
              claimAdSig,
            );

          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            pairSignature,
          );

          await adIdInstance
            .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1,
          );

          await expect(
            aftermarketDeviceInstance
              .connect(user1)
              .unpairAftermarketDevice(1, 1),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
            .withArgs(1, 1, user2.address);
        });
      });

      context('Being the owner of the aftermarket device', () => {
        it('Should emit AftermarketDeviceUnPaired event with correct params', async () => {
          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              1,
              user1.address,
              claimOwnerSig,
              claimAdSig,
            );

          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            pairSignature,
          );

          await adIdInstance
            .connect(user1)
          ['safeTransferFrom(address,address,uint256)'](
            user1.address,
            user2.address,
            1,
          );

          await expect(
            aftermarketDeviceInstance
              .connect(user2)
              .unpairAftermarketDevice(1, 1),
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
            .withArgs(1, 1, user2.address);
        });
      });
    });
  });

  describe('unpairAftermarketDeviceSign', () => {
    let claimOwnerSig: string;
    let claimAdSig: string;
    let pairSignature: string;
    let unPairSignature: string;
    before(async () => {
      claimOwnerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      claimAdSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      pairSignature = await signMessage({
        _signer: user1,
        _primaryType: 'PairAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
        },
      });
      unPairSignature = await signMessage({
        _signer: user1,
        _primaryType: 'UnPairAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          vehicleNode: '1',
        },
      });
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have UNPAIR_AD_ROLE', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .unpairAftermarketDeviceSign(1, 1, unPairSignature),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.UNPAIR_AD_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .unpairAftermarketDeviceSign(99, 1, unPairSignature),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(AD_ID_ADDRESS, 99);
      });
      it('Should revert if node is not a Vehicle', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .unpairAftermarketDeviceSign(1, 99, unPairSignature),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(VEHICLE_ID_ADDRESS, 99);
      });
      it('Should revert if vehicle is not paired', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig,
            claimAdSig,
          );
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .unpairAftermarketDeviceSign(1, 1, unPairSignature),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'VehicleNotPaired',
          )
          .withArgs(1);
      });

      context('Wrong signature', () => {
        beforeEach(async () => {
          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceSign(
              1,
              user1.address,
              claimOwnerSig,
              claimAdSig,
            );

          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
            1,
            1,
            pairSignature,
          );
        });

        it('Should revert if domain name is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainName: 'Wrong domain',
            _primaryType: 'UnPairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .unpairAftermarketDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidSigner',
          );
        });
        it('Should revert if domain version is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _domainVersion: '99',
            _primaryType: 'UnPairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .unpairAftermarketDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidSigner',
          );
        });
        it('Should revert if domain chain ID is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _chainId: 99,
            _primaryType: 'UnPairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .unpairAftermarketDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidSigner',
          );
        });
        it('Should revert if aftermarket device node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'UnPairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '99',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .unpairAftermarketDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidSigner',
          );
        });
        it('Should revert if aftermarket vehicle node is incorrect', async () => {
          const invalidSignature = await signMessage({
            _signer: user1,
            _primaryType: 'UnPairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '99',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .unpairAftermarketDeviceSign(1, 1, invalidSignature),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidSigner',
          );
        });
        it('Should revert if signer is not the aftermarket device node or vehicle owner', async () => {
          const wrongSignerSignature = await signMessage({
            _signer: user2,
            _primaryType: 'UnPairAftermarketDeviceSign',
            _verifyingContract: DIMO_REGISTRY_ADDRESS,
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });

          await expect(
            aftermarketDeviceInstance
              .connect(admin)
              .unpairAftermarketDeviceSign(1, 1, wrongSignerSignature),
          ).to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidSigner',
          );
        });
      });
    });

    context('State', () => {
      beforeEach(async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig,
            claimAdSig,
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );
      });

      it('Should correctly unmap the aftermarket device from vehicle', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .unpairAftermarketDeviceSign(1, 1, unPairSignature);

        expect(
          await mapperInstance.getLink(AD_ID_ADDRESS, 1),
        ).to.be.equal(0);
      });

      it('Should correctly unmap the vehicle from the aftermarket device', async () => {
        await aftermarketDeviceInstance
          .connect(admin)
          .unpairAftermarketDeviceSign(1, 1, unPairSignature);

        expect(
          await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 1),
        ).to.be.equal(0);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceUnPaired event with correct params', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        await aftermarketDeviceInstance
          .connect(admin)
          .claimAftermarketDeviceSign(
            1,
            user1.address,
            claimOwnerSig,
            claimAdSig,
          );

        await aftermarketDeviceInstance
          .connect(admin)
        ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](
          1,
          1,
          pairSignature,
        );

        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .unpairAftermarketDeviceSign(1, 1, unPairSignature),
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
          .withArgs(1, 1, user1.address);
      });
    });
  });

  describe('setAftermarketDeviceInfo', () => {
    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Error handling', () => {
      it('Should revert if caller does not have SET_AD_INFO_ROLE', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(nonAdmin)
            .setAftermarketDeviceInfo(1, C.mockAdAttributeInfoPairs),
        ).to.be.revertedWith(
          `AccessControl: account ${nonAdmin.address.toLowerCase()} is missing role ${C.SET_AD_INFO_ROLE
          }`,
        );
      });
      it('Should revert if node is not an Aftermarket Device', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .setAftermarketDeviceInfo(99, C.mockAdAttributeInfoPairs),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'InvalidNode',
          )
          .withArgs(AD_ID_ADDRESS, 99);
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .setAftermarketDeviceInfo(
              1,
              C.mockAdAttributeInfoPairsNotWhitelisted,
            ),
        )
          .to.be.revertedWithCustomError(
            aftermarketDeviceInstance,
            'AttributeNotWhitelisted',
          )
          .withArgs(C.mockAdAttributeInfoPairsNotWhitelisted[1].attribute);
      });
    });

    context('State', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockAdAttributeInfoPairs),
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            AD_ID_ADDRESS,
            1,
            C.mockAftermarketDeviceAttribute1,
          ),
        ).to.be.equal(C.mockAftermarketDeviceInfo1);
        expect(
          await nodesInstance.getInfo(
            AD_ID_ADDRESS,
            1,
            C.mockAftermarketDeviceAttribute2,
          ),
        ).to.be.equal(C.mockAftermarketDeviceInfo2);

        await aftermarketDeviceInstance
          .connect(admin)
          .setAftermarketDeviceInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            AD_ID_ADDRESS,
            1,
            C.mockAftermarketDeviceAttribute1,
          ),
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            AD_ID_ADDRESS,
            1,
            C.mockAftermarketDeviceAttribute2,
          ),
        ).to.be.equal(localNewAttributeInfoPairs[1].info);
      });
    });

    context('Events', () => {
      it('Should emit AftermarketDeviceAttributeSet events with correct params', async () => {
        await expect(
          aftermarketDeviceInstance
            .connect(admin)
            .setAftermarketDeviceInfo(1, C.mockAdAttributeInfoPairs),
        )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
          .withArgs(
            1,
            C.mockAdAttributeInfoPairs[0].attribute,
            C.mockAdAttributeInfoPairs[0].info,
          )
          .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
          .withArgs(
            1,
            C.mockAdAttributeInfoPairs[1].attribute,
            C.mockAdAttributeInfoPairs[1].info,
          );
      });
    });
  });

  describe('resetAftermarketDeviceAddressByManufacturerBatch', () => {
    let mockAftermarketDeviceIdAddressPairs: AftermarketDeviceIdAddressPair[]
    before(async () => {
      mockAftermarketDeviceIdAddressPairs =
        [
          {
            aftermarketDeviceNodeId: '1',
            deviceAddress: newAdAddress1.address
          },
          {
            aftermarketDeviceNodeId: '2',
            deviceAddress: newAdAddress2.address
          }
        ];
    });

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Manufacturer as minter', () => {
      context('Error handling', () => {
        it('Should revert if node is not an Aftermarket Device', async () => {
          const invalidMockAftermarketDeviceIdAddressPairs = JSON.parse(
            JSON.stringify(mockAftermarketDeviceIdAddressPairs)
          );
          invalidMockAftermarketDeviceIdAddressPairs[1].aftermarketDeviceNodeId = '99';

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .resetAftermarketDeviceAddressByManufacturerBatch(invalidMockAftermarketDeviceIdAddressPairs)
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidNode'
            )
            .withArgs(AD_ID_ADDRESS, 99);
        });
        it('Should revert if caller is not the manufacturer node owner or does not have the factory reset privilege', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(nonManufacturer)
              .resetAftermarketDeviceAddressByManufacturerBatch(mockAftermarketDeviceIdAddressPairs)
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'Unauthorized'
            )
            .withArgs(nonManufacturer.address);
        });
      });

      context('State', () => {
        it('Should correctly set device address', async () => {
          const adAddress1Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1Before).to.be.equal(adAddress1.address);
          expect(adAddress2Before).to.be.equal(adAddress2.address);

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .resetAftermarketDeviceAddressByManufacturerBatch(mockAftermarketDeviceIdAddressPairs);

          const adAddress1After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1After).to.be.equal(newAdAddress1.address);
          expect(adAddress2After).to.be.equal(newAdAddress2.address);
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceAddressReset events with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .resetAftermarketDeviceAddressByManufacturerBatch(mockAftermarketDeviceIdAddressPairs)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAddressReset')
            .withArgs(
              1,
              1,
              newAdAddress1.address
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAddressReset')
            .withArgs(
              1,
              2,
              newAdAddress2.address
            );
        });
      });
    });

    context('Privileged address as caller', () => {
      context('Error handling', () => {
        it('Should revert if node is not an Aftermarket Device', async () => {
          const invalidMockAftermarketDeviceIdAddressPairs = JSON.parse(
            JSON.stringify(mockAftermarketDeviceIdAddressPairs)
          );
          invalidMockAftermarketDeviceIdAddressPairs[1].aftermarketDeviceNodeId = '99';

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .resetAftermarketDeviceAddressByManufacturerBatch(invalidMockAftermarketDeviceIdAddressPairs)
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidNode'
            )
            .withArgs(AD_ID_ADDRESS, 99);
        });
      });

      context('State', () => {
        it('Should correctly set device address', async () => {
          const adAddress1Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1Before).to.be.equal(adAddress1.address);
          expect(adAddress2Before).to.be.equal(adAddress2.address);

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .resetAftermarketDeviceAddressByManufacturerBatch(mockAftermarketDeviceIdAddressPairs);

          const adAddress1After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1After).to.be.equal(newAdAddress1.address);
          expect(adAddress2After).to.be.equal(newAdAddress2.address);
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceAddressReset events with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .resetAftermarketDeviceAddressByManufacturerBatch(mockAftermarketDeviceIdAddressPairs)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAddressReset')
            .withArgs(
              1,
              1,
              newAdAddress1.address
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAddressReset')
            .withArgs(
              1,
              2,
              newAdAddress2.address
            );
        });
      });
    });
  });

  describe('reprovisionAftermarketDeviceByManufacturerBatch', () => {
    const mockAftermarketDeviceIdList = [1, 2];
    const invalidMockAftermarketDeviceIdList = [1, 2, 99];

    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    context('Manufacturer as minter', () => {
      context('Error handling', () => {
        it('Should revert if node is not an Aftermarket Device', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .reprovisionAftermarketDeviceByManufacturerBatch(invalidMockAftermarketDeviceIdList)
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidNode'
            )
            .withArgs(AD_ID_ADDRESS, 99);
        });
        it('Should revert if caller is not the manufacturer node owner or does not have the factory reset privilege', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(nonManufacturer)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'Unauthorized'
            )
            .withArgs(nonManufacturer.address);
        });
      });

      context('State', () => {
        it('Should burn the old Aftermarket Device Id', async () => {
          expect(await adIdInstance.exists(1)).to.be.true;
          expect(await adIdInstance.exists(2)).to.be.true;

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.exists(1)).to.be.false;
          expect(await adIdInstance.exists(2)).to.be.false;
        });
        it('Should mint the new Aftermarket Device Id', async () => {
          expect(await adIdInstance.exists(3)).to.be.false;
          expect(await adIdInstance.exists(4)).to.be.false;

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.exists(3)).to.be.true;
          expect(await adIdInstance.exists(4)).to.be.true;
        });
        it('Should reset Aftermarket Device parent node to 0', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const parentNode1 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            1,
          );
          const parentNode2 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            2,
          );

          expect(parentNode1).to.be.equal(0);
          expect(parentNode2).to.be.equal(0);
        });
        it('Should set new Aftermarket Device parent', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const parentNode1 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            3,
          );
          const parentNode2 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            4,
          );

          expect(parentNode1).to.be.equal(1);
          expect(parentNode2).to.be.equal(1);
        });
        it('Should set old Aftermarket Device nodes as not claimed', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.true;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.true;

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.false;
        });
        it('Should set new Aftermarket Device nodes as not claimed', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(3)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(4)).to.be.false;

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(3)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(4)).to.be.false;
        });
        it('Should reset old Aftermarket Device node owner to zero address', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          await expect(adIdInstance.ownerOf(1)).to.be.rejectedWith(
            'ERC721: invalid token ID',
          );
          await expect(adIdInstance.ownerOf(2)).to.be.rejectedWith(
            'ERC721: invalid token ID',
          );
        });
        it('Should set new Aftermarket Device node owner to Manufacturer node owner', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.ownerOf(3)).to.be.equal(
            manufacturer1.address,
          );
          expect(await adIdInstance.ownerOf(4)).to.be.equal(
            manufacturer1.address,
          );
        });
        it('Should reset old Aftermarket Device infos to blank', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal('');
        });
        it('Should set new Aftermarket Device infos', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              3,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              3,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              4,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              4,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
        });
        it('Should update old multi-privilege token version', async () => {
          const previousVersion1 = await adIdInstance.tokenIdToVersion(1);
          const previousVersion2 = await adIdInstance.tokenIdToVersion(2);

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.tokenIdToVersion(1)).to.equal(
            previousVersion1 + ethers.toBigInt(1),
          );
          expect(await adIdInstance.tokenIdToVersion(2)).to.equal(
            previousVersion2 + ethers.toBigInt(1),
          );
        });
        it('Should delete mapping of the old Aftermarket Device to the Vehicle if paired', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          const pairSig1 = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });
          const pairSig2 = await signMessage({
            _signer: user2,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '2',
              vehicleNode: '2',
            },
          });

          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);

          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 1)).to.be.equal(1);
          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 2)).to.be.equal(2);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 1)).to.be.equal(1);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 2)).to.be.equal(2);

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 1)).to.be.equal(0);
          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 2)).to.be.equal(0);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 1)).to.be.equal(0);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 2)).to.be.equal(0);
        });
        it('Should delete mapping of the old Aftermarket Device to the device address', async () => {
          const adAddress1Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1Before).to.be.equal(adAddress1.address);
          expect(adAddress2Before).to.be.equal(adAddress2.address);

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const adAddress1After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1After).to.be.equal(C.ZERO_ADDRESS);
          expect(adAddress2After).to.be.equal(C.ZERO_ADDRESS);
        });
        it('Should set device address to the new Aftermarket Device', async () => {
          const adAddress3Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(3);
          const adAddress4Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(4);
          expect(adAddress3Before).to.be.equal(C.ZERO_ADDRESS);
          expect(adAddress4Before).to.be.equal(C.ZERO_ADDRESS);

          await aftermarketDeviceInstance
            .connect(manufacturer1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const adAddress3After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(3);
          const adAddress4After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(4);
          expect(adAddress3After).to.be.equal(adAddress1.address);
          expect(adAddress4After).to.be.equal(adAddress2.address);
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceUnpaired event with correct params if Aftermarket Device is paired', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          const pairSig1 = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });
          const pairSig2 = await signMessage({
            _signer: user2,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '2',
              vehicleNode: '2',
            },
          });

          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
            .withArgs(1, 1, user1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
            .withArgs(2, 2, user2.address);
        });
        it('Should emit AftermarketDeviceNodeBurned event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeBurned')
            .withArgs(1, manufacturer1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeBurned')
            .withArgs(2, manufacturer1.address);
        });
        it('Should emit AftermarketDeviceNodeMinted event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 3, adAddress1.address, manufacturer1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 4, adAddress2.address, manufacturer1.address);
        });
        it('Should emit AftermarketDeviceAttributeSet event with correct params for the old Aftermakert Device', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].attribute,
              '',
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].attribute,
              '',
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].attribute,
              '',
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].attribute,
              '',
            );
        });
        it('Should emit AftermarketDeviceAttributeSet event with correct params for the new Aftermakert Device', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturer1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              3,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              3,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              4,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              4,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].info,
            );
        });
      });
    });

    context('Privileged address as caller', () => {
      context('Error handling', () => {
        it('Should revert if node is not an Aftermarket Device', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .reprovisionAftermarketDeviceByManufacturerBatch(invalidMockAftermarketDeviceIdList)
          )
            .to.be.revertedWithCustomError(
              aftermarketDeviceInstance,
              'InvalidNode'
            )
            .withArgs(AD_ID_ADDRESS, 99);
        });
      });

      context('State', () => {
        it('Should burn the old Aftermarket Device Id', async () => {
          expect(await adIdInstance.exists(1)).to.be.true;
          expect(await adIdInstance.exists(2)).to.be.true;

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.exists(1)).to.be.false;
          expect(await adIdInstance.exists(2)).to.be.false;
        });
        it('Should mint the new Aftermarket Device Id', async () => {
          expect(await adIdInstance.exists(3)).to.be.false;
          expect(await adIdInstance.exists(4)).to.be.false;

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.exists(3)).to.be.true;
          expect(await adIdInstance.exists(4)).to.be.true;
        });
        it('Should reset Aftermarket Device parent node to 0', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const parentNode1 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            1,
          );
          const parentNode2 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            2,
          );

          expect(parentNode1).to.be.equal(0);
          expect(parentNode2).to.be.equal(0);
        });
        it('Should set new Aftermarket Device parent', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const parentNode1 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            3,
          );
          const parentNode2 = await nodesInstance.getParentNode(
            AD_ID_ADDRESS,
            4,
          );

          expect(parentNode1).to.be.equal(1);
          expect(parentNode2).to.be.equal(1);
        });
        it('Should set old Aftermarket Device nodes as not claimed', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.true;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.true;

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(2)).to.be.false;
        });
        it('Should set new Aftermarket Device nodes as not claimed', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(3)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(4)).to.be.false;

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(3)).to.be.false;
          expect(await aftermarketDeviceInstance.isAftermarketDeviceClaimed(4)).to.be.false;
        });
        it('Should reset old Aftermarket Device node owner to zero address', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          await expect(adIdInstance.ownerOf(1)).to.be.rejectedWith(
            'ERC721: invalid token ID',
          );
          await expect(adIdInstance.ownerOf(2)).to.be.rejectedWith(
            'ERC721: invalid token ID',
          );
        });
        it('Should set new Aftermarket Device node owner to Manufacturer node owner', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.ownerOf(3)).to.be.equal(
            manufacturer1.address,
          );
          expect(await adIdInstance.ownerOf(4)).to.be.equal(
            manufacturer1.address,
          );
        });
        it('Should reset old Aftermarket Device infos to blank', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              1,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal('');
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              2,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal('');
        });
        it('Should set new Aftermarket Device infos', async () => {
          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              3,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              3,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              4,
              C.mockAftermarketDeviceAttribute1,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo1);
          expect(
            await nodesInstance.getInfo(
              AD_ID_ADDRESS,
              4,
              C.mockAftermarketDeviceAttribute2,
            ),
          ).to.be.equal(C.mockAftermarketDeviceInfo2);
        });
        it('Should update old multi-privilege token version', async () => {
          const previousVersion1 = await adIdInstance.tokenIdToVersion(1);
          const previousVersion2 = await adIdInstance.tokenIdToVersion(2);

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await adIdInstance.tokenIdToVersion(1)).to.equal(
            previousVersion1 + ethers.toBigInt(1),
          );
          expect(await adIdInstance.tokenIdToVersion(2)).to.equal(
            previousVersion2 + ethers.toBigInt(1),
          );
        });
        it('Should delete mapping of the old Aftermarket Device to the Vehicle if paired', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          const pairSig1 = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });
          const pairSig2 = await signMessage({
            _signer: user2,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '2',
              vehicleNode: '2',
            },
          });

          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);

          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 1)).to.be.equal(1);
          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 2)).to.be.equal(2);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 1)).to.be.equal(1);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 2)).to.be.equal(2);

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 1)).to.be.equal(0);
          expect(await mapperInstance.getLink(VEHICLE_ID_ADDRESS, 2)).to.be.equal(0);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 1)).to.be.equal(0);
          expect(await mapperInstance.getLink(AD_ID_ADDRESS, 2)).to.be.equal(0);
        });
        it('Should delete mapping of the old Aftermarket Device to the device address', async () => {
          const adAddress1Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1Before).to.be.equal(adAddress1.address);
          expect(adAddress2Before).to.be.equal(adAddress2.address);

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const adAddress1After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);
          const adAddress2After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(2);
          expect(adAddress1After).to.be.equal(C.ZERO_ADDRESS);
          expect(adAddress2After).to.be.equal(C.ZERO_ADDRESS);
        });
        it('Should set device address to the new Aftermarket Device', async () => {
          const adAddress3Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(3);
          const adAddress4Before = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(4);
          expect(adAddress3Before).to.be.equal(C.ZERO_ADDRESS);
          expect(adAddress4Before).to.be.equal(C.ZERO_ADDRESS);

          await aftermarketDeviceInstance
            .connect(manufacturerPrivileged1)
            .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList);

          const adAddress3After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(3);
          const adAddress4After = await aftermarketDeviceInstance.getAftermarketDeviceAddressById(4);
          expect(adAddress3After).to.be.equal(adAddress1.address);
          expect(adAddress4After).to.be.equal(adAddress2.address);
        });
      });

      context('Events', () => {
        it('Should emit AftermarketDeviceUnpaired event with correct params if Aftermarket Device is paired', async () => {
          const localAdOwnerPairs = [
            { aftermarketDeviceNodeId: '1', owner: await user1.address },
            { aftermarketDeviceNodeId: '2', owner: await user2.address },
          ];
          const pairSig1 = await signMessage({
            _signer: user1,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '1',
              vehicleNode: '1',
            },
          });
          const pairSig2 = await signMessage({
            _signer: user2,
            _primaryType: 'PairAftermarketDeviceSign',
            _verifyingContract: await aftermarketDeviceInstance.getAddress(),
            message: {
              aftermarketDeviceNode: '2',
              vehicleNode: '2',
            },
          });

          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);
          await vehicleInstance
            .connect(admin)
            .mintVehicle(1, user2.address, C.mockVehicleAttributeInfoPairs);
          await aftermarketDeviceInstance
            .connect(admin)
            .claimAftermarketDeviceBatch(1, localAdOwnerPairs);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](1, 1, pairSig1);
          await aftermarketDeviceInstance
            .connect(admin)
          ['pairAftermarketDeviceSign(uint256,uint256,bytes)'](2, 2, pairSig2);

          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
            .withArgs(1, 1, user1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceUnpaired')
            .withArgs(2, 2, user2.address);
        });
        it('Should emit AftermarketDeviceNodeBurned event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeBurned')
            .withArgs(1, manufacturer1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeBurned')
            .withArgs(2, manufacturer1.address);
        });
        it('Should emit AftermarketDeviceNodeMinted event with correct params', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 3, adAddress1.address, manufacturer1.address)
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceNodeMinted')
            .withArgs(1, 4, adAddress2.address, manufacturer1.address);
        });
        it('Should emit AftermarketDeviceAttributeSet event with correct params for the old Aftermakert Device', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].attribute,
              '',
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              1,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].attribute,
              '',
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].attribute,
              '',
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              2,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].attribute,
              '',
            );
        });
        it('Should emit AftermarketDeviceAttributeSet event with correct params for the new Aftermakert Device', async () => {
          await expect(
            aftermarketDeviceInstance
              .connect(manufacturerPrivileged1)
              .reprovisionAftermarketDeviceByManufacturerBatch(mockAftermarketDeviceIdList)
          )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              3,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              3,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[0].attrInfoPairs[1].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              4,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[0].info,
            )
            .to.emit(aftermarketDeviceInstance, 'AftermarketDeviceAttributeSet')
            .withArgs(
              4,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].attribute,
              mockAftermarketDeviceInfosList[1].attrInfoPairs[1].info,
            );
        });
      });
    });
  });

  describe('getAftermarketDeviceIdByAddress', () => {
    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    it('Should return 0 if the queried address is not associated with any minted device', async () => {
      const tokenId =
        await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
          notMintedAd.address,
        );

      expect(tokenId).to.equal(0);
    });
    it('Should return the correct token Id', async () => {
      const tokenId =
        await aftermarketDeviceInstance.getAftermarketDeviceIdByAddress(
          adAddress1.address,
        );

      expect(tokenId).to.equal(1);
    });
  });

  describe('getAftermarketDeviceAddressById', () => {
    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    it('Should return 0x00 address if the queried node ID is not associated with any minted device', async () => {
      const address =
        await aftermarketDeviceInstance.getAftermarketDeviceAddressById(99);

      expect(address).to.equal(C.ZERO_ADDRESS);
    });
    it('Should return the correct address', async () => {
      const address =
        await aftermarketDeviceInstance.getAftermarketDeviceAddressById(1);

      expect(address).to.equal(adAddress1.address);
    });
  });

  describe('isAftermarketDeviceClaimed', () => {
    beforeEach(async () => {
      await adIdInstance
        .connect(manufacturer1)
        .setApprovalForAll(DIMO_REGISTRY_ADDRESS, true);
      await aftermarketDeviceInstance
        .connect(manufacturer1)
        .mintAftermarketDeviceByManufacturerBatch(
          1,
          mockAftermarketDeviceInfosList,
        );
    });

    it('Should return false if the queried AD is not claimed', async () => {
      const isClaimed =
        await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1);

      // eslint-disable-next-line no-unused-expressions
      expect(isClaimed).to.be.false;
    });
    it('Should return true if the queried AD is claimed', async () => {
      const ownerSig = await signMessage({
        _signer: user1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });
      const adSig = await signMessage({
        _signer: adAddress1,
        _primaryType: 'ClaimAftermarketDeviceSign',
        _verifyingContract: DIMO_REGISTRY_ADDRESS,
        message: {
          aftermarketDeviceNode: '1',
          owner: user1.address,
        },
      });

      await aftermarketDeviceInstance
        .connect(admin)
        .claimAftermarketDeviceSign(1, user1.address, ownerSig, adSig);

      const isClaimed =
        await aftermarketDeviceInstance.isAftermarketDeviceClaimed(1);

      // eslint-disable-next-line no-unused-expressions
      expect(isClaimed).to.be.true;
    });
  });
});
