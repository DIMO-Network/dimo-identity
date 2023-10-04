//SPDX-License-Identifier: BUSL-1.1
/* solhint-disable */
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../shared/Roles.sol";
import "./DeviceDefinitionTableInternal.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error TableDoesNotExist(uint256 manufacturerId);
error Unauthorized(uint256 tableId, address caller);

/**
 * @title DeviceDefinitionTable
 * @notice Contract for interacting with Device Definition tables via Tableland
 */
contract DeviceDefinitionTable is
    AccessControlInternal,
    DeviceDefinitionTableInternal
{
    event DeviceDefinitionInserted(
        uint256 indexed ddId,
        uint256 indexed manufacturerId,
        string model,
        string year
    );

    /**
     * @notice Creates a new definition table associated with a specific manufacturer
     * @dev This function can only be called by an address with the ADMIN_ROLE
     * @param owner The address of the table's owner
     * @param manufacturerId The unique identifier of the manufacturer
     */
    function createDeviceDefinitionTable(
        address owner,
        uint256 manufacturerId
    ) external onlyRole(ADMIN_ROLE) {
        _createDeviceDefinitionTable(owner, manufacturerId);
    }

    // TODO Documentation
    function createDeviceDefinition(
        uint256 manufacturerId,
        string calldata model,
        string calldata year
    ) external {
        DeviceDefinitionTableStorage.Storage
            storage dds = DeviceDefinitionTableStorage.getStorage();
        uint256 tableId = dds.tables[manufacturerId];
        string memory prefix = ManufacturerStorage
            .getStorage()
            .nodeIdToManufacturerName[manufacturerId];

        if (bytes(prefix).length == 0) {
            revert InvalidManufacturerId(manufacturerId);
        }
        if (tableId == 0) {
            revert TableDoesNotExist(manufacturerId);
        }

        ITablelandTables tablelandTables = TablelandDeployments.get();

        if (INFT(address(tablelandTables)).ownerOf(tableId) != msg.sender) {
            revert Unauthorized(tableId, msg.sender);
        }

        tablelandTables.mutate(
            address(this),
            tableId,
            SQLHelpers.toInsert(
                prefix,
                tableId,
                "model,year",
                string.concat(
                    string(abi.encodePacked("'", model, "'")),
                    ",",
                    string(abi.encodePacked("'", year, "'"))
                )
            )
        );

        dds.ddIds++;

        emit DeviceDefinitionInserted(dds.ddIds, manufacturerId, model, year);
    }

    // TODO Documentation
    // TODO Batch insertion
    // function createDeviceDefinitionBatch(
    //     uint256 manufacturerId,
    //     string calldata model,
    //     string calldata year
    // ) external {

    // }

    /**
     * @dev Retrieve the name of the device definition table name associated with a specific manufacturer
     * @param manufacturerId The unique identifier of the manufacturer
     * @dev If a matching table does not exist, the function returns an empty string
     * @return tableName The name of the manufacturer's device definition table
     */
    function getDeviceDefinitionTableName(
        uint256 manufacturerId
    ) external view returns (string memory tableName) {
        uint256 tableId = DeviceDefinitionTableStorage.getStorage().tables[
            manufacturerId
        ];
        string memory prefix = ManufacturerStorage
            .getStorage()
            .nodeIdToManufacturerName[manufacturerId];

        if (bytes(prefix).length != 0)
            tableName = SQLHelpers.toNameFromId(prefix, tableId);
    }

    /**
     * @dev Retrieve the device definition table ID associated with a specific manufacturer
     * @param manufacturerId The unique identifier of the manufacturer
     * @dev If a matching table does not exist, the function returns zero
     * @return tableId The ID of the manufacturer's device definition table
     */
    function getDeviceDefinitionTableId(
        uint256 manufacturerId
    ) external view returns (uint256 tableId) {
        tableId = DeviceDefinitionTableStorage.getStorage().tables[
            manufacturerId
        ];
    }
}
