//SPDX-License-Identifier: BUSL-1.1
/* solhint-disable */
pragma solidity ^0.8.13;

import "../../libraries/tableland/DeviceDefinitionTableStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";

error InvalidManufacturerId(uint256 id);
error TableAlreadyExists(uint256 manufacturerId);

/**
 * @title DeviceDefinitionTable
 * @notice Contract with internal Device Definition Table related functions used in multiple contracts
 */
contract DeviceDefinitionTableInternal {
    event DeviceDefinitionTableCreated(
        address indexed tableOwner,
        uint256 indexed manufacturerId,
        uint256 indexed tableId
    );

    /**
     * @notice Internal function to create a new definition table associated with a specific manufacturer
     * @param tableOwner The owner of the table to be minted
     * @param manufacturerId The unique identifier of the manufacturer
     */
    function _createDeviceDefinitionTable(
        address tableOwner,
        uint256 manufacturerId
    ) internal {
        DeviceDefinitionTableStorage.Storage
            storage vs = DeviceDefinitionTableStorage.getStorage();

        string memory prefix = ManufacturerStorage
            .getStorage()
            .nodeIdToManufacturerName[manufacturerId];

        if (bytes(prefix).length == 0) {
            revert InvalidManufacturerId(manufacturerId);
        }
        if (vs.tables[manufacturerId] != 0) {
            revert TableAlreadyExists(manufacturerId);
        }

        string memory statement = SQLHelpers.toCreateFromSchema(
            "id integer primary key, model text not null, year integer not null, metadata text",
            prefix
        );
        uint256 tableId = TablelandDeployments.get().create(
            tableOwner,
            statement
        );

        vs.tables[manufacturerId] = tableId;

        emit DeviceDefinitionTableCreated(tableOwner, manufacturerId, tableId);
    }
}
