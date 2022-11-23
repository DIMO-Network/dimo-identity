//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

/// @title VehicleStorage
/// @notice Storage of the Vehicle contract
library VehicleStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant VEHICLE_STORAGE_SLOT =
        keccak256("DIMORegistry.vehicle.storage");

    struct Storage {
        address nftProxyAddress;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
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
