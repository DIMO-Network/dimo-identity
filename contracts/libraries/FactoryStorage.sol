//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library FactoryStorage {
    bytes32 internal constant FACTORY_STORAGE_SLOT =
        keccak256("DIMORegistry.factory.storage");

    struct Storage {
        mapping(string => address) implementations;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = FACTORY_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
