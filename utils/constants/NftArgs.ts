import { ZERO_ADDRESS } from './Misc';
import { ContractNameArgsByNetwork } from '../types';

export const MANUFACTURER_NFT_NAME = 'Manufacturer NFT';
export const MANUFACTURER_NFT_SYMBOL = 'MNFT';
export const MANUFACTURER_NFT_BASE_URI = 'https://dimo.zone/manufacturer/';
export const MANUFACTURER_MINTER_PRIVILEGE = '1';
export const MANUFACTURER_CLAIMER_PRIVILEGE = '2';

export const VEHICLE_NFT_NAME = 'Vehicle NFT';
export const VEHICLE_NFT_SYMBOL = 'VNFT';
export const VEHICLE_NFT_BASE_URI = 'https://dimo.zone/vehicle/';

export const AD_NFT_NAME = 'Aftermarket Device NFT';
export const AD_NFT_SYMBOL = 'ADNFT';
export const AD_NFT_BASE_URI = 'https://dimo.zone/aftermarketDevice/';

export const nftArgs: ContractNameArgsByNetwork = {
  ManufacturerId: {
    name: 'ManufacturerId',
    args: [
      MANUFACTURER_NFT_NAME,
      MANUFACTURER_NFT_SYMBOL,
      MANUFACTURER_NFT_BASE_URI,
      ZERO_ADDRESS
    ],
    opts: {
      initializer: 'initialize',
      // eslint-disable-next-line prettier/prettier
      kind: 'uups' as const
    }
  },
  VehicleId: {
    name: 'VehicleId',
    args: [
      VEHICLE_NFT_NAME,
      VEHICLE_NFT_SYMBOL,
      VEHICLE_NFT_BASE_URI,
      ZERO_ADDRESS,
      []
    ],
    opts: {
      initializer: 'initialize',
      // eslint-disable-next-line prettier/prettier
      kind: 'uups' as const
    }
  },
  AftermarketDeviceId: {
    name: 'AftermarketDeviceId',
    args: [
      AD_NFT_NAME,
      AD_NFT_SYMBOL,
      AD_NFT_BASE_URI,
      ZERO_ADDRESS,
      []
    ],
    opts: {
      initializer: 'initialize',
      // eslint-disable-next-line prettier/prettier
      kind: 'uups' as const
    }
  }
};
