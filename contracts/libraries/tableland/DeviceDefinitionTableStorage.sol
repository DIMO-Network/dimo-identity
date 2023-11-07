//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title DeviceDefinitionTableStorage
 * @notice Storage of the DeviceDefinitionTable contract
 */
library DeviceDefinitionTableStorage {
    bytes32 internal constant DEVICE_DEFINITION_TABLE_STORAGE_SLOT =
        keccak256("DIMORegistry.deviceDefinitionTable.storage");

    struct Storage {
        // A mapping that holds `manufacturer ID` and its `tableId`
        mapping(uint256 => uint256) tables;
        // A mapping that holds `tableId` and its prefix (prefix_chainId_tableId)
        mapping(uint256 => string) prefixes;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = DEVICE_DEFINITION_TABLE_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
