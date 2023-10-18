//SPDX-License-Identifier: BUSL-1.1
/* solhint-disable */
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../shared/Roles.sol";
import "../../shared/Types.sol";
import "./DeviceDefinitionTableInternal.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error TableDoesNotExist(uint256 tableId);
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
        uint256 year
    );
    event ManufacturerTableSet(
        uint256 indexed manufacturerId,
        uint256 indexed tableId
    );

    /**
     * @notice Creates a new definition table associated with a specific manufacturer
     * @dev This function can only be called by an address with the ADMIN_ROLE
     * @dev The Tableland table NFT is minted to this contract
     * @param tableOwner The owner of the table to be minted
     * @param manufacturerId The unique identifier of the manufacturer
     */
    function createDeviceDefinitionTable(
        address tableOwner,
        uint256 manufacturerId
    ) external onlyRole(ADMIN_ROLE) {
        // TODO check if the caller is a manufacturer, if so, check it if has a table set and if the manufacturerId matches
        // TODO Also check if ADMIN_ROLE
        _createDeviceDefinitionTable(tableOwner, manufacturerId);
    }

    /**
     * @notice Set the Device Definition Table for a manufacturer
     * @dev The caller must be the owner of the manufacturer ID
     * @dev The specified Device Definition Table must exist
     * @param manufacturerId The unique identifier of the manufacturer
     * @param tableId The unique identifier of the Device Definition Table to be associated
     */
    function setDeviceDefinitionTable(
        uint256 manufacturerId,
        uint256 tableId
    ) external {
        INFT tablelandTables = INFT(address(TablelandDeployments.get()));

        try tablelandTables.ownerOf(tableId) {
            INFT manufacturerIdProxy = INFT(
                ManufacturerStorage.getStorage().idProxyAddress
            );

            if (msg.sender != manufacturerIdProxy.ownerOf(manufacturerId)) {
                revert Unauthorized(tableId, msg.sender);
            }

            DeviceDefinitionTableStorage.getStorage().tables[
                manufacturerId
            ] = tableId;

            emit ManufacturerTableSet(manufacturerId, tableId);
        } catch {
            revert TableDoesNotExist(tableId);
        }
    }

    // TODO Documentation
    function insertDeviceDefinition(
        uint256 manufacturerId,
        string calldata model,
        uint256 year
    ) external {
        DeviceDefinitionTableStorage.Storage
            storage dds = DeviceDefinitionTableStorage.getStorage();
        INFT manufacturerIdProxy = INFT(
            ManufacturerStorage.getStorage().idProxyAddress
        );

        ITablelandTables tablelandTables = TablelandDeployments.get();
        uint256 tableId = dds.tables[manufacturerId];
        string memory prefix = ManufacturerStorage
            .getStorage()
            .nodeIdToManufacturerName[manufacturerId];

        if (tableId == 0) {
            // TODO replace manufacturerId by tableId
            revert TableDoesNotExist(manufacturerId);
        }
        // TODO Remove INSERT_DEVICE_DEFINITION_ROLE
        if (
            msg.sender != manufacturerIdProxy.ownerOf(manufacturerId) &&
            !_hasRole(INSERT_DEVICE_DEFINITION_ROLE, msg.sender)
        ) {
            revert Unauthorized(tableId, msg.sender);
        }

        tablelandTables.mutate(
            address(this),
            tableId,
            SQLHelpers.toInsert(
                prefix,
                tableId,
                "model,year,metadata",
                string.concat(
                    string(abi.encodePacked("'", model, "'")),
                    ",",
                    Strings.toString(year)
                )
            )
        );

        dds.ddIds++;

        emit DeviceDefinitionInserted(dds.ddIds, manufacturerId, model, year);
    }

    // TODO Documentation
    function insertDeviceDefinitionBatch(
        uint256 manufacturerId,
        DeviceDefinitionInput[] calldata data
    ) external {
        DeviceDefinitionTableStorage.Storage
            storage dds = DeviceDefinitionTableStorage.getStorage();
        INFT manufacturerIdProxy = INFT(
            ManufacturerStorage.getStorage().idProxyAddress
        );

        ITablelandTables tablelandTables = TablelandDeployments.get();
        uint256 tableId = dds.tables[manufacturerId];
        string memory prefix = ManufacturerStorage
            .getStorage()
            .nodeIdToManufacturerName[manufacturerId];

        if (tableId == 0) {
            // TODO replace manufacturerId by tableId
            revert TableDoesNotExist(manufacturerId);
        }
        // TODO Remove INSERT_DEVICE_DEFINITION_ROLE
        if (
            msg.sender != manufacturerIdProxy.ownerOf(manufacturerId) &&
            !_hasRole(INSERT_DEVICE_DEFINITION_ROLE, msg.sender)
        ) {
            revert Unauthorized(tableId, msg.sender);
        }

        uint256 len = data.length;
        uint256 currentDdId = dds.ddIds + 1;
        string[] memory vals = new string[](len);
        for (uint256 i; i < len; i++) {
            vals[i] = string.concat(
                string(abi.encodePacked("'", data[i].model, "'")),
                ",",
                Strings.toString(data[i].year)
            );

            emit DeviceDefinitionInserted(
                currentDdId + i,
                manufacturerId,
                data[i].model,
                data[i].year
            );
        }

        string memory stmt = SQLHelpers.toBatchInsert(
            prefix,
            tableId,
            "model,year,metadata",
            vals
        );

        tablelandTables.mutate(address(this), tableId, stmt);

        dds.ddIds += len;
    }

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
