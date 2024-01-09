import { ethers } from 'hardhat';

import { GenericKeyAny } from '../../utils';

const _hashRole = (role: string) =>
  ethers.keccak256(ethers.toUtf8Bytes(role));

export const roles = {
  DEFAULT_ADMIN_ROLE:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ADMIN_ROLE: _hashRole('ADMIN_ROLE'),
  modules: {
    CLAIM_AD_ROLE: _hashRole('CLAIM_AD_ROLE'),
    PAIR_AD_ROLE: _hashRole('PAIR_AD_ROLE'),
    UNPAIR_AD_ROLE: _hashRole('UNPAIR_AD_ROLE'),
    SET_AD_INFO_ROLE: _hashRole('SET_AD_INFO_ROLE'),
    MINT_INTEGRATION_ROLE: _hashRole('MINT_INTEGRATION_ROLE'),
    SET_INTEGRATION_INFO_ROLE: _hashRole('SET_INTEGRATION_INFO_ROLE'),
    MINT_MANUFACTURER_ROLE: _hashRole('MINT_MANUFACTURER_ROLE'),
    SET_MANUFACTURER_INFO_ROLE: _hashRole('SET_MANUFACTURER_INFO_ROLE'),
    MINT_SD_ROLE: _hashRole('MINT_SD_ROLE'),
    BURN_SD_ROLE: _hashRole('BURN_SD_ROLE'),
    SET_SD_INFO_ROLE: _hashRole('SET_SD_INFO_ROLE'),
    MINT_VEHICLE_ROLE: _hashRole('MINT_VEHICLE_ROLE'),
    BURN_VEHICLE_ROLE: _hashRole('BURN_VEHICLE_ROLE'),
    SET_VEHICLE_INFO_ROLE: _hashRole('SET_VEHICLE_INFO_ROLE'),
    MINT_VEHICLE_SD_ROLE: _hashRole('MINT_VEHICLE_SD_ROLE'),
    DEV_AD_TRANSFER_ROLE: _hashRole('DEV_AD_TRANSFER_ROLE'),
    DEV_AD_UNCLAIM_ROLE: _hashRole('DEV_AD_UNCLAIM_ROLE'),
    DEV_AD_UNPAIR_ROLE: _hashRole('DEV_AD_UNPAIR_ROLE'),
    DEV_RENAME_MANUFACTURERS_ROLE: _hashRole('DEV_RENAME_MANUFACTURERS_ROLE'),
    DEV_VEHICLE_BURN_ROLE: _hashRole('DEV_VEHICLE_BURN_ROLE'),
    DEV_AD_BURN_ROLE: _hashRole('DEV_AD_BURN_ROLE'),
    DEV_SD_BURN_ROLE: _hashRole('DEV_SD_BURN_ROLE'),
    DEV_CHANGE_PARENT_NODE: _hashRole('DEV_CHANGE_PARENT_NODE')
  },
  nfts: {
    MINTER_ROLE: _hashRole('MINTER_ROLE'),
    TRANSFERER_ROLE: _hashRole('TRANSFERER_ROLE'),
    BURNER_ROLE: _hashRole('BURNER_ROLE'),
    UPGRADER_ROLE: _hashRole('UPGRADER_ROLE')
  }
};

export const dimoRegistryName = 'DIMORegistry';

export const eip712Name = 'DIMO';
export const eip712Version = '1';
export const adMintCost = ethers.parseEther('50');

export const MANUFACTURER_NFT_NAME = 'DIMO Manufacturer ID';
export const MANUFACTURER_NFT_SYMBOL = 'DIMO/MANUFACTURER';
export const MANUFACTURER_NFT_URI =
  'https://devices-api.dimo.zone/v1/manufacturer/';
export const INTEGRATION_NFT_NAME = 'DIMO Integration ID';
export const INTEGRATION_NFT_SYMBOL = 'DIMO/INTEGRATION';
export const INTEGRATION_NFT_URI =
  'https://devices-api.dimo.zone/v1/integration/';
export const VEHICLE_NFT_NAME = 'DIMO Vehicle ID';
export const VEHICLE_NFT_SYMBOL = 'DIMO/VEHICLE';
export const VEHICLE_NFT_URI = 'https://devices-api.dimo.zone/v1/vehicle/';
export const AD_NFT_NAME = 'DIMO Aftermarket Device ID';
export const AD_NFT_SYMBOL = 'DIMO/AFTERMARKET/DEVICE';
export const AD_NFT_URI =
  'https://devices-api.dimo.zone/v1/aftermarket/device/';
export const SD_NFT_NAME = 'DIMO Synthetic Device ID';
export const SD_NFT_SYMBOL = 'DIMO/SYNTHETIC/DEVICE';
export const SD_NFT_URI = 'https://devices-api.dimo.zone/v1/synthetic/device/';

export const BASE_DATA_URI = '';

export const vehicleAttributes = [
  'Make',
  'Model',
  'Year',
  'DataURI',
  'DefinitionURI'
];
export const adAttributes = ['Serial', 'IMEI', 'DefinitionURI'];
export const sdAttributes = [];

export const manufacturerIdArgs = {
  name: 'ManufacturerId',
  args: [MANUFACTURER_NFT_NAME, MANUFACTURER_NFT_SYMBOL, MANUFACTURER_NFT_URI]
};
export const integrationIdArgs = {
  name: 'IntegrationId',
  args: [INTEGRATION_NFT_NAME, INTEGRATION_NFT_SYMBOL, INTEGRATION_NFT_URI]
};
export const vehicleIdArgs = {
  name: 'VehicleId',
  args: [VEHICLE_NFT_NAME, VEHICLE_NFT_SYMBOL, VEHICLE_NFT_URI]
};
export const adIdArgs = {
  name: 'AftermarketDeviceId',
  args: [AD_NFT_NAME, AD_NFT_SYMBOL, AD_NFT_URI]
};
export const sdIdArgs = {
  name: 'SyntheticDeviceId',
  args: [SD_NFT_NAME, SD_NFT_SYMBOL, SD_NFT_URI]
};

export const dimoStreamrEns: GenericKeyAny = {
  polygon: 'streams.dimo.eth',
  mumbai: 'streams.dev.dimo.eth',
  hardhat: 'streams.hardhat.dimo.eth'
}