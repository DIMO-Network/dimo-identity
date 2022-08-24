//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library ResolverStorage {
    bytes32 internal constant RESOLVER_STORAGE_SLOT =
        keccak256("DIMORegistry.resolver.storage");

    struct Storage {
        mapping(uint256 => uint256) childs;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = RESOLVER_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
