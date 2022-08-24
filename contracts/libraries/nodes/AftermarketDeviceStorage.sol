//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

library AftermarketDeviceStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant AFTERMARKET_DEVICE_STORAGE_SLOT =
        keccak256("DIMORegistry.aftermarketDevice.storage");

    struct Storage {
        uint256 nodeType;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = AFTERMARKET_DEVICE_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
