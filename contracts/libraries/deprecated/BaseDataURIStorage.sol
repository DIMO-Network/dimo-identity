//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @dev Deprecated storage
 */
library BaseDataURIStorage {
    // Do not use this slot
    bytes32 internal constant BASE_DATA_URI_STORAGE_SLOT =
        keccak256("DIMORegistry.baseDataURI.storage");

    // Deprecated layout
    struct Storage {
        mapping(address => string) baseDataURIs;
    }
}
