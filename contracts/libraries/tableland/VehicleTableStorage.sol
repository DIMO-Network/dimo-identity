//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// TODO Documentation
library VehicleTableStorage {
    bytes32 internal constant VEHICLE_TABLE_STORAGE_SLOT =
        keccak256("DIMORegistry.vehicleTable.storage");

    struct Storage {
        // TODO Rename it?
        // TODO Can a manufacturer has more than one table?
        // A mapping that holds `manufacturer ID` and its `tableId`
        mapping(uint256 => uint256) tables;
        string metadataTable;
        uint256 metadataTableId;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = VEHICLE_TABLE_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
