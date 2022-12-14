import { ethers, network } from 'hardhat';
import { NetworkValue } from '../../utils';

export const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
export const MANUFACTURER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('Manufacturer')
);
export const MINTER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('MINTER_ROLE')
);
export const TRANSFERER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('TRANSFERER_ROLE')
);

export const networkName = network.name;
export const KmsAddress: NetworkValue = {
  mumbai: '0x74cb2b8ed0c1789d84ef701921d1152e592c330c',
  polygon: '0xcce4eF41A67E28C3CF3dbc51a6CD3d004F53aCBd',
  hardhat: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  localhost: '0xffffffffffffffffffffffffffffffffffffffff'
};
export const dimoTokenAddress: NetworkValue = {
  mumbai: '0x80ee7ec4493a1d7975ab900f94db25ba7c688201',
  polygon: '0xe261d618a959afffd53168cd07d12e37b26761db',
  hardhat: '0xffffffffffffffffffffffffffffffffffffffff',
  localhost: '0xffffffffffffffffffffffffffffffffffffffff'
};
export const licenseAddress: NetworkValue = {
  mumbai: '0xB84d17B7b7BC9b3D03bfE8880AF0116B6d4EB5FC',
  polygon: '0xaa32a9e74486dd136ccedf17061fe4efc95a621e',
  hardhat: '0xffffffffffffffffffffffffffffffffffffffff',
  localhost: '0xffffffffffffffffffffffffffffffffffffffff'
};
export const foundationAddress: NetworkValue = {
  mumbai: '0x1741ec2915ab71fc03492715b5640133da69420b',
  polygon: '0xCED3c922200559128930180d3f0bfFd4d9f4F123',
  hardhat: '0xffffffffffffffffffffffffffffffffffffffff',
  localhost: '0xffffffffffffffffffffffffffffffffffffffff'
};

export const dimoRegistryName = 'DIMORegistry';

export const eip712Name = 'DIMO';
export const eip712Version = '1';
export const adMintCost = ethers.utils.parseEther('50');

export const MANUFACTURER_NFT_NAME = 'Dimo Manufacturer ID';
export const MANUFACTURER_NFT_SYMBOL = 'DIMO/MANUFACTURER';
export const MANUFACTURER_NFT_URI =
  'https://devices-api.dimo.zone/v1/manufacturer/';
export const VEHICLE_NFT_NAME = 'Dimo Vehicle ID';
export const VEHICLE_NFT_SYMBOL = 'DIMO/VEHICLE';
export const VEHICLE_NFT_URI = 'https://devices-api.dimo.zone/v1/vehicle/';
export const AD_NFT_NAME = 'Dimo Aftermarket Device ID';
export const AD_NFT_SYMBOL = 'DIMO/AFTERMARKET/DEVICE';
export const AD_NFT_URI =
  'https://devices-api.dimo.zone/v1/aftermarket/device/';

export const manufacturerNodeType = ethers.utils.toUtf8Bytes('Manufacturer');
export const vehicleNodeType = ethers.utils.toUtf8Bytes('Vehicle');
export const adNodeType = ethers.utils.toUtf8Bytes('AftermarketDevice');

export const vehicleAttributes = ['Make', 'Model', 'Year'];
export const adAttributes = ['Serial', 'IMEI'];
