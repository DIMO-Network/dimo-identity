//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library Eip712CheckerStorage {
    bytes32 internal constant EIP712_CHECKER_STORAGE_SLOT =
        keccak256("DIMORegistry.eip712Checker.storage");

    struct Storage {
        bytes32 name;
        bytes32 version;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = EIP712_CHECKER_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
