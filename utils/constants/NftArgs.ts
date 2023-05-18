import { ZERO_ADDRESS } from './Misc';
import { ContractNameArgsByNetwork } from '../types';

export const MANUFACTURER_NFT_NAME = 'Manufacturer NFT';
export const MANUFACTURER_NFT_SYMBOL = 'MNFT';
export const MANUFACTURER_NFT_BASE_URI = 'https://dimo.zone/manufacturer/';

export const INTEGRATION_NFT_NAME = 'Integration NFT';
export const INTEGRATION_NFT_SYMBOL = 'INFT';
export const INTEGRATION_NFT_BASE_URI = 'https://dimo.zone/integration/';

export const VEHICLE_NFT_NAME = 'Vehicle NFT';
export const VEHICLE_NFT_SYMBOL = 'VNFT';
export const VEHICLE_NFT_BASE_URI = 'https://dimo.zone/vehicle/';

export const AD_NFT_NAME = 'Aftermarket Device NFT';
export const AD_NFT_SYMBOL = 'ADNFT';
export const AD_NFT_BASE_URI = 'https://dimo.zone/aftermarketDevice/';

export const VIRTUAL_DEVICE_NFT_NAME = 'Virtual Device NFT';
export const VIRTUAL_DEVICE_NFT_SYMBOL = 'VDNFT';
export const VIRTUAL_DEVICE_NFT_BASE_URI = 'https://dimo.zone/virtualDevice/';

export const nftArgs: ContractNameArgsByNetwork = {
  ManufacturerId: {
    name: 'ManufacturerId',
    args: [
      MANUFACTURER_NFT_NAME,
      MANUFACTURER_NFT_SYMBOL,
      MANUFACTURER_NFT_BASE_URI
    ],
    opts: {
      initializer: 'initialize',
      // eslint-disable-next-line prettier/prettier
      kind: 'uups' as const
    }
  },
  IntegrationId: {
    name: 'IntegrationId',
    args: [
      INTEGRATION_NFT_NAME,
      INTEGRATION_NFT_SYMBOL,
      INTEGRATION_NFT_BASE_URI,
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
    args: [VEHICLE_NFT_NAME, VEHICLE_NFT_SYMBOL, VEHICLE_NFT_BASE_URI],
    opts: {
      initializer: 'initialize',
      // eslint-disable-next-line prettier/prettier
      kind: 'uups' as const
    }
  },
  AftermarketDeviceId: {
    name: 'AftermarketDeviceId',
    args: [AD_NFT_NAME, AD_NFT_SYMBOL, AD_NFT_BASE_URI],
    opts: {
      initializer: 'initialize',
      // eslint-disable-next-line prettier/prettier
      kind: 'uups' as const
    }
  },
  VirtualDeviceId: {
    name: 'VirtualDeviceId',
    args: [VIRTUAL_DEVICE_NFT_NAME, VIRTUAL_DEVICE_NFT_SYMBOL, VIRTUAL_DEVICE_NFT_BASE_URI, ZERO_ADDRESS],
    opts: {
      initializer: 'initialize',
      // eslint-disable-next-line prettier/prettier
      kind: 'uups' as const
    }
  }
};
