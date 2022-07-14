//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

library AutoPiStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant AUTOPI_STORAGE_SLOT =
        keccak256("DIMORegistry.autopi.storage");

    struct Storage {
        uint256 nodeType;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = AUTOPI_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
