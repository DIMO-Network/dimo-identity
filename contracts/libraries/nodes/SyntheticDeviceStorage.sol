//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

/**
 * @title SyntheticDeviceStorage
 * @notice Storage of the SyntheticDevice contract
 */
library SyntheticDeviceStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant SYNTHETIC_DEVICE_STORAGE_SLOT =
        keccak256("DIMORegistry.syntheticDevice.storage");

    struct Storage {
        address idProxyAddress;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
        // Synthetic Device address => Synthetic Device Id
        mapping(address => uint256) deviceAddressToNodeId;
        // Synthetic Device Id => Synthetic Device address
        mapping(uint256 => address) nodeIdToDeviceAddress;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = SYNTHETIC_DEVICE_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
