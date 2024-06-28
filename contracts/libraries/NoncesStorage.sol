//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title NoncesStorage
 * @notice Storage of the Nonces contract
 */
library NoncesStorage {
    bytes32 internal constant NONCES_STORAGE_SLOT =
        keccak256("DIMORegistry.nonces.storage");

    struct Storage {
        // typehash -> account -> nonce
        mapping(bytes32 => mapping(address => uint256)) operationNonces;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = NONCES_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
