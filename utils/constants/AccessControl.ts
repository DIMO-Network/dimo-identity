import { ethers } from 'hardhat';

export const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
export const ADMIN_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('ADMIN_ROLE')
);
export const MOCK_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('MOCK')
);

// Aftermarket Device roles
export const CLAIM_AD_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('CLAIM_AD_ROLE')
);
export const PAIR_AD_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('PAIR_AD_ROLE')
);
export const UNPAIR_AD_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('UNPAIR_AD_ROLE')
);
export const SET_AD_INFO_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('SET_AD_INFO_ROLE')
);

// Integration roles
export const MINT_INTEGRATION_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('MINT_INTEGRATION_ROLE')
);
export const SET_INTEGRATION_INFO_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('SET_INTEGRATION_INFO_ROLE')
);

// Manufacturer roles
export const MINT_MANUFACTURER_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('MINT_MANUFACTURER_ROLE')
);
export const SET_MANUFACTURER_INFO_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('SET_MANUFACTURER_INFO_ROLE')
);

// Synthetic Device roles
export const MINT_SD_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('MINT_SD_ROLE')
);
export const BURN_SD_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('BURN_SD_ROLE')
);
export const SET_SD_INFO_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('SET_SD_INFO_ROLE')
);

// Vehicle roles
export const MINT_VEHICLE_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('MINT_VEHICLE_ROLE')
);
export const BURN_VEHICLE_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('BURN_VEHICLE_ROLE')
);
export const SET_VEHICLE_INFO_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('SET_VEHICLE_INFO_ROLE')
);

// Multiple Minter roles
export const MINT_VEHICLE_SD_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('MINT_VEHICLE_SD_ROLE')
);

// Developer roles
export const DEV_AD_TRANSFER_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_AD_TRANSFER_ROLE')
);
export const DEV_AD_UNCLAIM_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_AD_UNCLAIM_ROLE')
);
export const DEV_AD_UNPAIR_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_AD_UNPAIR_ROLE')
);
export const DEV_RENAME_MANUFACTURERS_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_RENAME_MANUFACTURERS_ROLE')
);
export const DEV_VEHICLE_BURN_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_VEHICLE_BURN_ROLE')
);
export const DEV_AD_PAIR_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_AD_PAIR_ROLE')
);
export const DEV_AD_BURN_ROLE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_AD_BURN_ROLE')
);
export const DEV_CHANGE_PARENT_NODE = ethers.keccak256(
  ethers.toUtf8Bytes('DEV_CHANGE_PARENT_NODE')
);
