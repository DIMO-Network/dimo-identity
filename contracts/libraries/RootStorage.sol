//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library RootStorage {
    bytes32 private constant ROOT_STORAGE_SLOT =
        keccak256("DIMORegistry.root.storage");

    struct Controller {
        bool isController;
        bool rootMinted;
    }

    struct Storage {
        // [Controller address] => is controller, has minted root
        mapping(address => Controller) controllers;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = ROOT_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
