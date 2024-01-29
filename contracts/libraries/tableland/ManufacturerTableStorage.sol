//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title ManufacturerTableStorage
 * @notice Storage of the ManufacturerTable contract
 */
library ManufacturerTableStorage {
    bytes32 internal constant MANUFACTURER_TABLE_STORAGE_SLOT =
        keccak256("DIMORegistry.manufacturerTable.storage");

    struct Storage {
        // A mapping that holds `manufacturer slug` and its `tableId`
        mapping(string => uint256) tables;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = MANUFACTURER_TABLE_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
