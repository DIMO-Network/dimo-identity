//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

/// @title VirtualDeviceStorage
/// @notice Storage of the VirtualDevice contract
library VirtualDeviceStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant VIRTUAL_DEVICE_STORAGE_SLOT =
        keccak256("DIMORegistry.virtualDevice.storage");

    struct Storage {
        address idProxyAddress;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = VIRTUAL_DEVICE_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
