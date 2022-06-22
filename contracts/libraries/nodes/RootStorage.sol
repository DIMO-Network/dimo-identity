//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

library RootStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant ROOT_STORAGE_SLOT =
        keccak256("DIMORegistry.root.storage");

    struct Controller {
        bool isController;
        bool rootMinted;
    }

    struct Storage {
        // [Controller address] => is controller, has minted root
        mapping(address => Controller) controllers;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
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
