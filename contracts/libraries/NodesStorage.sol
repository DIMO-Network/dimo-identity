//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library NodesStorage {
    bytes32 internal constant NODES_STORAGE_SLOT =
        keccak256("DIMORegistry.nodes.storage");

    struct Node {
        uint256 nodeType;
        uint256 parentNode;
        mapping(string => string) info;
    }

    struct Storage {
        // [Node id] => Node info
        mapping(uint256 => Node) nodes;
        uint256 currentIndex;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = NODES_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
