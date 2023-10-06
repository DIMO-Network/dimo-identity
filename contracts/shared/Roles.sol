//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

// Admin roles
bytes32 constant DEFAULT_ADMIN_ROLE = 0x00;
bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

// Aftermarket Device roles
bytes32 constant CLAIM_AD_ROLE = keccak256("CLAIM_AD_ROLE");
bytes32 constant PAIR_AD_ROLE = keccak256("PAIR_AD_ROLE");
bytes32 constant UNPAIR_AD_ROLE = keccak256("UNPAIR_AD_ROLE");
bytes32 constant SET_AD_INFO_ROLE = keccak256("SET_AD_INFO_ROLE");

// Integration roles
bytes32 constant MINT_INTEGRATION_ROLE = keccak256("MINT_INTEGRATION_ROLE");
bytes32 constant SET_INTEGRATION_INFO_ROLE = keccak256(
    "SET_INTEGRATION_INFO_ROLE"
);

// Manufacturer roles
bytes32 constant MINT_MANUFACTURER_ROLE = keccak256("MINT_MANUFACTURER_ROLE");
bytes32 constant SET_MANUFACTURER_INFO_ROLE = keccak256(
    "SET_MANUFACTURER_INFO_ROLE"
);

// Synthetic Device roles
bytes32 constant MINT_SD_ROLE = keccak256("MINT_SD_ROLE");
bytes32 constant BURN_SD_ROLE = keccak256("BURN_SD_ROLE");
bytes32 constant SET_SD_INFO_ROLE = keccak256("SET_SD_INFO_ROLE");

// Vehicle roles
bytes32 constant MINT_VEHICLE_ROLE = keccak256("MINT_VEHICLE_ROLE");
bytes32 constant BURN_VEHICLE_ROLE = keccak256("BURN_VEHICLE_ROLE");
bytes32 constant SET_VEHICLE_INFO_ROLE = keccak256("SET_VEHICLE_INFO_ROLE");

// Multiple Minter roles
bytes32 constant MINT_VEHICLE_SD_ROLE = keccak256("MINT_VEHICLE_SD_ROLE");

// Developer roles
bytes32 constant DEV_AD_TRANSFER_ROLE = keccak256("DEV_AD_TRANSFER_ROLE");
bytes32 constant DEV_AD_UNCLAIM_ROLE = keccak256("DEV_AD_UNCLAIM_ROLE");
bytes32 constant DEV_AD_UNPAIR_ROLE = keccak256("DEV_AD_UNPAIR_ROLE");
bytes32 constant DEV_RENAME_MANUFACTURERS_ROLE = keccak256(
    "DEV_RENAME_MANUFACTURERS_ROLE"
);
bytes32 constant DEV_AD_PAIR_ROLE = keccak256("DEV_AD_PAIR_ROLE");
bytes32 constant DEV_VEHICLE_BURN_ROLE = keccak256("DEV_VEHICLE_BURN_ROLE");
bytes32 constant DEV_CHANGE_PARENT_NODE = keccak256("DEV_CHANGE_PARENT_NODE");
