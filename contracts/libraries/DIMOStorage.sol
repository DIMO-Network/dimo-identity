//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library DIMOStorage {
    bytes32 internal constant DIMO_REGISTRY_STORAGE_SLOT =
        keccak256("DIMORegistry.storage");

    struct Node {
        uint256 nodeType;
        uint256 parentNode;
        mapping(string => string) info;
    }

    struct Storage {
        // Maps function selectors to the implementations that execute the functions
        mapping(bytes4 => address) implementations;
        // Maps the implementation to the hash of all its selectors
        // implementation => keccak256(abi.encode(selectors))
        mapping(address => bytes32) selectorsHash;
        // [Node id] => Node info
        mapping(uint256 => Node) nodes;
        uint256 currentIndex;
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
