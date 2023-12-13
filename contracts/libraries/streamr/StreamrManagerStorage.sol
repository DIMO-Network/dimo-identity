//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title StreamrManagerStorage
 * @notice Storage of the StreamrManager contract
 */
library StreamrManagerStorage {
    bytes32 internal constant STREAMR_MANAGER_STORAGE_SLOT =
        keccak256("DIMORegistry.streamrManager.storage");

    struct Storage {
        address streamRegistry;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = STREAMR_MANAGER_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
