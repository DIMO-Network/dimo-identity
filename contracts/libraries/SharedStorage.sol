//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

// TODO Documentation
/**
 * @title SharedStorage
 * @notice Storage of shared variables
 */
library SharedStorage {
    bytes32 internal constant SHARED_STORAGE_SLOT =
        keccak256("DIMORegistry.shared.storage");

    struct Storage {
        address foundation; // TODO Maybe a better name
        address dimoCredit;
        address dimoToken;
        address manufacturerLicense; // TODO to deprecate AdLicenseValidator
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
