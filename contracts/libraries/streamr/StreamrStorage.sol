//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title StreamrStorage
 * @notice Storage of the StreamrStorage contract
 */
library StreamrStorage {
    bytes32 internal constant STREAMR_STORAGE_SLOT =
        keccak256("DIMORegistry.streamr.storage");

    struct Storage {
        address streamrRegistry;
        string dimoBaseStreamId;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = STREAMR_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
