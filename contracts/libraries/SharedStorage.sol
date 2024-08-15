//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title SharedStorage
 * @notice Storage of Shared contract
 */
library SharedStorage {
    bytes32 internal constant SHARED_STORAGE_SLOT =
        keccak256("DIMORegistry.shared.storage");

    struct Storage {
        address foundation;
        address dimoCredit;
        address dimoToken;
        address manufacturerLicense;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = SHARED_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
