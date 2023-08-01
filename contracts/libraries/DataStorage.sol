//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title DataStorage
/// @notice Storage of the Data contract
library DataStorage {
    bytes32 internal constant Data_STORAGE_SLOT =
        keccak256("DIMORegistry.data.storage");

    struct Storage {
        string dataUri;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = Data_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
