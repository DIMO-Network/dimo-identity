import { ethers, network } from 'hardhat';
import { NetworkValue, C } from '../../utils';

export const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

export const networkName = network.name;
export const KmsAddress: NetworkValue = {
  mumbai: '0x74cb2b8ed0c1789d84ef701921d1152e592c330c',
  polygon: '0xcce4ef41a67e28c3cf3dbc51a6cd3d004f53acbd',
  hardhat: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
};
export const dimoTokenAddress: NetworkValue = {
  mumbai: '0xffffffffffffffffffffffffffffffffffffffff',
  polygon: '0xffffffffffffffffffffffffffffffffffffffff',
  hardhat: '0xffffffffffffffffffffffffffffffffffffffff'
};
export const licenseAddress: NetworkValue = {
  mumbai: '0xffffffffffffffffffffffffffffffffffffffff',
  polygon: '0xffffffffffffffffffffffffffffffffffffffff',
  hardhat: '0xffffffffffffffffffffffffffffffffffffffff'
};
export const foundationAddress: NetworkValue = {
  mumbai: '0xffffffffffffffffffffffffffffffffffffffff',
  polygon: '0xffffffffffffffffffffffffffffffffffffffff',
  hardhat: '0xffffffffffffffffffffffffffffffffffffffff'
};

export const dimoRegistryName = 'DIMORegistry';

export const eip712Name = 'DIMO';
export const eip712Version = '1';
export const adMintCost = ethers.utils.parseEther('50');

export const name = 'DIMO identity Beta V1';
export const symbol = 'DIMO';
export const baseUri: NetworkValue = {
  mumbai: 'https://devices-api.dev.dimo.zone/v1/nfts/',
  polygon: 'https://devices-api.dimo.zone/v1/nfts/',
  hardhat: C.baseURI
};

export const manufacturerNodeType = ethers.utils.toUtf8Bytes('Manufacturer');
export const vehicleNodeType = ethers.utils.toUtf8Bytes('Vehicle');
export const adNodeType = ethers.utils.toUtf8Bytes('AftermarketDevice');

export const manufacturerAttribute1 = 'Name';
export const vehicleAttributes = ['Make', 'Model', 'Year'];
export const adAttributes = ['attr1', 'attr2'];
