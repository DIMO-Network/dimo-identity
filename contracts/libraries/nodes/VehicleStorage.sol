//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

/**
 * @title VehicleStorage
 * @notice Storage of the Vehicle contract
 */
library VehicleStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant VEHICLE_STORAGE_SLOT =
        keccak256("DIMORegistry.vehicle.storage");

    struct Storage {
        address idProxyAddress;
        // DEPRECATED: vehicle attributes (Make/Model/Year) moved off-chain alongside
        // device definitions. Do not read, write, or reuse this slot — the inner
        // AttributeSet mappings still hold legacy whitelist data at slots derived
        // from this base position.
        AttributeSet.Set _deprecated_whitelistedAttributes;
        // DEPRECATED: device definitions moved off-chain. Do not read, write, or
        // reuse this slot for any new field — old entries still live at
        // keccak256(tokenId, baseSlot) and would alias any replacement
        // mapping(uint256 => *) declared in the same position.
        mapping(uint256 => string) _deprecated_vehicleIdToDeviceDefinitionId;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = VEHICLE_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
