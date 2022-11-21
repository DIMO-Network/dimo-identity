import chai from 'chai';
import { ethers, waffle, upgrades } from 'hardhat';

import {
  DIMORegistry,
  Eip712Checker,
  Nodes,
  Manufacturer,
  ManufacturerNft,
  Vehicle,
  VehicleNft
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

describe('Vehicle', function () {
  let snapshot: string;
  let dimoRegistryInstance: DIMORegistry;
  let eip712CheckerInstance: Eip712Checker;
  let nodesInstance: Nodes;
  let manufacturerInstance: Manufacturer;
  let vehicleInstance: Vehicle;
  let manufacturerNftInstance: ManufacturerNft;
  let vehicleNftInstance: VehicleNft;

  const [admin, nonAdmin, controller1, user1, user2] = provider.getWallets();

  before(async () => {
    [
      dimoRegistryInstance,
      eip712CheckerInstance,
      nodesInstance,
      manufacturerInstance,
      vehicleInstance
    ] = await initialize(
      admin,
      'Eip712Checker',
      'Nodes',
      'Manufacturer',
      'Vehicle'
    );

    const ManufacturerNftFactory = await ethers.getContractFactory(
      'ManufacturerNft'
    );
    const VehicleNftFactory = await ethers.getContractFactory('VehicleNft');

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

    const MANUFACTURER_MINTER_ROLE =
      await manufacturerNftInstance.MINTER_ROLE();
    await manufacturerNftInstance
      .connect(admin)
      .grantRole(MANUFACTURER_MINTER_ROLE, dimoRegistryInstance.address);

    const VEHICLE_MINTER_ROLE = await vehicleNftInstance.MINTER_ROLE();
    await vehicleNftInstance
      .connect(admin)
      .grantRole(VEHICLE_MINTER_ROLE, dimoRegistryInstance.address);

    // Set NFT Proxies
    await manufacturerInstance
      .connect(admin)
      .setManufacturerNftProxyAddress(manufacturerNftInstance.address);
    await vehicleInstance
      .connect(admin)
      .setVehicleNftProxyAddress(vehicleNftInstance.address);

    // Initialize EIP-712
    await eip712CheckerInstance.initialize(
      C.defaultDomainName,
      C.defaultDomainVersion
    );

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
  });

  beforeEach(async () => {
    snapshot = await createSnapshot();
  });

  afterEach(async () => {
    await revertToSnapshot(snapshot);
  });

  describe('setVehicleNftProxyAddress', () => {
    let localVehicleInstance: Vehicle;
    beforeEach(async () => {
      [, localVehicleInstance] = await initialize(admin, 'Vehicle');
    });

    context('Error handling', () => {
      it('Should revert if caller does not have admin role', async () => {
        await expect(
          localVehicleInstance
            .connect(nonAdmin)
            .setVehicleNftProxyAddress(localVehicleInstance.address)
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
            .setVehicleNftProxyAddress(C.ZERO_ADDRESS)
        ).to.be.revertedWith('Non zero address');
      });
    });

    context('Events', () => {
      it('Should emit VehicleNftProxySet event with correct params', async () => {
        await expect(
          localVehicleInstance
            .connect(admin)
            .setVehicleNftProxyAddress(localVehicleInstance.address)
        )
          .to.emit(localVehicleInstance, 'VehicleNftProxySet')
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
        ).to.be.revertedWith('Attribute already exists');
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
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          controller1.address,
          C.mockManufacturerAttributeInfoPairs
        );
    });

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
      // TODO Check manufacturer node type?
      it.skip('Should revert if parent node is not a manufacturer node', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicle(99, user1.address, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWith('Invalid parent node');
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
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State change', () => {
      // TODO Fix parent node type
      // it('Should correctly set parent node', async () => {
      //   await vehicleInstance
      //     .connect(admin)
      //     .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

      //   const parentNode = await nodesInstance.getParentNode(2);
      //   expect(parentNode).to.be.equal(1);
      // });
      it('Should correctly set node owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        expect(await vehicleNftInstance.ownerOf(1)).to.be.equal(user1.address);
      });
      it('Should correctly set infos', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicle(1, user1.address, C.mockVehicleAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            vehicleNftInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleNftInstance.address,
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
          .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, C.mockVehicleAttributeInfoPairs[0].info)
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, C.mockVehicleAttributeInfoPairs[1].info);
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

    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          controller1.address,
          C.mockManufacturerAttributeInfoPairs
        );
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
      // TODO investigate
      it.skip('Should revert if parent node is not a manufacturer node', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .mintVehicleSign(
              99,
              user1.address,
              C.mockVehicleAttributeInfoPairs,
              signature
            )
        ).to.be.revertedWith('Invalid parent node');
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
        ).to.be.revertedWith('Not whitelisted');
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
          ).to.be.revertedWith('Invalid signature');
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
          ).to.be.revertedWith('Invalid signature');
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
          ).to.be.revertedWith('Invalid signature');
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
          ).to.be.revertedWith('Invalid signature');
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
          ).to.be.revertedWith('Invalid signature');
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
          ).to.be.revertedWith('Invalid signature');
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
          ).to.be.revertedWith('Invalid signature');
        });
      });
    });

    context('State change', () => {
      // TODO Fix parent node type
      // it('Should correctly set parent node', async () => {
      //   await vehicleInstance
      //     .connect(admin)
      //     .mintVehicleSign(
      //       1,
      //       user1.address,
      //       C.mockVehicleAttributeInfoPairs,
      //       signature
      //     );

      //   const parentNode = await nodesInstance.getParentNode(
      //     vehicleNftInstance.address,
      //     2
      //   );
      //   expect(parentNode).to.be.equal(1);
      // });
      it('Should correctly set node owner', async () => {
        await vehicleInstance
          .connect(admin)
          .mintVehicleSign(
            1,
            user1.address,
            C.mockVehicleAttributeInfoPairs,
            signature
          );

        expect(await vehicleNftInstance.ownerOf(1)).to.be.equal(user1.address);
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
            vehicleNftInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleNftInstance.address,
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
          .withArgs(1, C.mockVehicleAttributeInfoPairs[0].attribute, C.mockVehicleAttributeInfoPairs[0].info)
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(1, C.mockVehicleAttributeInfoPairs[1].attribute, C.mockVehicleAttributeInfoPairs[1].info);
      });
    });
  });

  describe('setVehicleInfo', () => {
    beforeEach(async () => {
      await manufacturerInstance
        .connect(admin)
        .mintManufacturer(
          controller1.address,
          C.mockManufacturerAttributeInfoPairs
        );
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
      // TODO Fix
      it.skip('Should revert if node is not a vehicle', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(99, C.mockVehicleAttributeInfoPairs)
        ).to.be.revertedWith('Node must be a vehicle');
      });
      it('Should revert if attribute is not whitelisted', async () => {
        await expect(
          vehicleInstance
            .connect(admin)
            .setVehicleInfo(1, C.mockVehicleAttributeInfoPairsNotWhitelisted)
        ).to.be.revertedWith('Not whitelisted');
      });
    });

    context('State change', () => {
      it('Should correctly set infos', async () => {
        const localNewAttributeInfoPairs = JSON.parse(
          JSON.stringify(C.mockVehicleAttributeInfoPairs)
        );
        localNewAttributeInfoPairs[0].info = 'New Info 0';
        localNewAttributeInfoPairs[1].info = 'New Info 1';

        expect(
          await nodesInstance.getInfo(
            vehicleNftInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(C.mockVehicleInfo1);
        expect(
          await nodesInstance.getInfo(
            vehicleNftInstance.address,
            1,
            C.mockVehicleAttribute2
          )
        ).to.be.equal(C.mockVehicleInfo2);

        await vehicleInstance
          .connect(admin)
          .setVehicleInfo(1, localNewAttributeInfoPairs);

        expect(
          await nodesInstance.getInfo(
            vehicleNftInstance.address,
            1,
            C.mockVehicleAttribute1
          )
        ).to.be.equal(localNewAttributeInfoPairs[0].info);
        expect(
          await nodesInstance.getInfo(
            vehicleNftInstance.address,
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
          .withArgs(1, localNewAttributeInfoPairs[0].attribute, localNewAttributeInfoPairs[0].info)
          .to.emit(vehicleInstance, 'VehicleAttributeSet')
          .withArgs(1, localNewAttributeInfoPairs[1].attribute, localNewAttributeInfoPairs[1].info);
      });
    });
  });
});
