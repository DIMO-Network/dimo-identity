//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title BaseDataURIStorage
 * @notice Storage of the Base Data URI contract
 */
library BaseDataURIStorage {
    bytes32 internal constant BASE_DATA_URI_STORAGE_SLOT =
        keccak256("DIMORegistry.baseDataURI.storage");

    struct Storage {
        mapping(address => string) baseDataURIs;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = BASE_DATA_URI_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
