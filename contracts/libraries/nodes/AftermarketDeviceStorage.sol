//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

/**
 * @title AftermarketDeviceStorage
 * @notice Storage of the AftermarketDevice contract
 */
library AftermarketDeviceStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant AFTERMARKET_DEVICE_STORAGE_SLOT =
        keccak256("DIMORegistry.aftermarketDevice.storage");

    struct Storage {
        address idProxyAddress;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
        // AD Id => already claimed or not
        mapping(uint256 => bool) deviceClaimed;
        // AD address => AD Id
        mapping(address => uint256) deviceAddressToNodeId;
        // AD Id => AD address
        mapping(uint256 => address) nodeIdToDeviceAddress;
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
