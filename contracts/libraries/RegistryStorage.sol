//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title RegistryStorage
/// @notice Storage of the DIMORegistry contract
library RegistryStorage {
    bytes32 internal constant DIMO_REGISTRY_STORAGE_SLOT =
        keccak256("DIMORegistry.storage");

    struct Storage {
        // Maps function selectors to the implementations that execute the functions
        mapping(bytes4 => address) implementations;
        // Maps the implementation to the hash of all its selectors
        // implementation => keccak256(abi.encode(selectors))
        mapping(address => bytes32) selectorsHash;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = DIMO_REGISTRY_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
