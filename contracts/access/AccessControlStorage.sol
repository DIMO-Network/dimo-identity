//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library AccessControlStorage {
    bytes32 internal constant ACCESS_CONTROL_STORAGE_SLOT =
        keccak256("DIMORegistry.accessControl.storage");

    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    struct Storage {
        mapping(bytes32 => RoleData) roles;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = ACCESS_CONTROL_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
