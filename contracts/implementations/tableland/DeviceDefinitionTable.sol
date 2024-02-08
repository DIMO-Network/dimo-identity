//SPDX-License-Identifier: BUSL-1.1
/* solhint-disable */
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/INFTMultiPrivilege.sol";
import "../../shared/Roles.sol";
import "../../shared/Types.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/tableland/DeviceDefinitionTableStorage.sol";

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error TableAlreadyExists(uint256 manufacturerId);
error TableDoesNotExist(uint256 tableId);
error Unauthorized(address caller);
error InvalidManufacturerId(uint256 id);

/**
 * @title DeviceDefinitionTable
 * @notice Contract for interacting with Device Definition tables via Tableland
 */
contract DeviceDefinitionTable is AccessControlInternal {
    uint256 private constant MANUFACTURER_INSERT_DD_PRIVILEGE = 3;

    event DeviceDefinitionTableCreated(
        address indexed tableOwner,
        uint256 indexed manufacturerId,
        uint256 indexed tableId
    );
    event ManufacturerTableSet(
        uint256 indexed manufacturerId,
        uint256 indexed tableId
    );
    event DeviceDefinitionInserted(
        uint256 indexed tableId,
        string ddId,
        string model,
        uint256 year
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
    ) external {
        INFT manufacturerIdProxy = INFT(
            ManufacturerStorage.getStorage().idProxyAddress
        );

        if (!manufacturerIdProxy.exists(manufacturerId)) {
            revert InvalidManufacturerId(manufacturerId);
        }
        if (
            !_hasRole(ADMIN_ROLE, msg.sender) &&
            msg.sender != manufacturerIdProxy.ownerOf(manufacturerId)
        ) revert Unauthorized(msg.sender);

        DeviceDefinitionTableStorage.Storage
            storage dds = DeviceDefinitionTableStorage.getStorage();
        TablelandTables tablelandTables = TablelandDeployments.get();

        if (dds.tables[manufacturerId] != 0) {
            revert TableAlreadyExists(manufacturerId);
        }

        string memory statement = string(
            abi.encodePacked(
                "CREATE TABLE _",
                Strings.toString(block.chainid),
                "(id TEXT PRIMARY KEY, model TEXT NOT NULL, year INTEGER NOT NULL, metadata TEXT, legacy_id TEXT, UNIQUE(model,year))"
            )
        );
        uint256 tableId = tablelandTables.create(address(this), statement);

        tablelandTables.setController(address(this), tableId, address(this));
        INFT(address(tablelandTables)).safeTransferFrom(
            address(this),
            tableOwner,
            tableId
        );

        dds.tables[manufacturerId] = tableId;

        emit DeviceDefinitionTableCreated(tableOwner, manufacturerId, tableId);
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

            if (!manufacturerIdProxy.exists(manufacturerId)) {
                revert InvalidManufacturerId(manufacturerId);
            }
            if (msg.sender != manufacturerIdProxy.ownerOf(manufacturerId)) {
                revert Unauthorized(msg.sender);
            }

            DeviceDefinitionTableStorage.getStorage().tables[
                manufacturerId
            ] = tableId;

            emit ManufacturerTableSet(manufacturerId, tableId);
        } catch {
            revert TableDoesNotExist(tableId);
        }
    }

    /**
     * @notice Insert a Device Definition in an existing table
     * @dev The caller must be the owner of the manufacturer ID
     * @dev The specified Device Definition Table must exist
     * @dev The pair (model,year) must be unique
     * @param manufacturerId The unique identifier of the manufacturer
     * @param data Input data with the following fields:
     *  id -> The alphanumeric ID of the Device Definition
     *  model -> The model of the Device Definition
     *  year -> The year of the Device Definition
     *  metadata -> The metadata stringfied object of the Device Definition
     */
    function insertDeviceDefinition(
        uint256 manufacturerId,
        DeviceDefinitionInput calldata data
    ) external {
        TablelandTables tablelandTables = TablelandDeployments.get();
        DeviceDefinitionTableStorage.Storage
            storage dds = DeviceDefinitionTableStorage.getStorage();
        uint256 tableId = dds.tables[manufacturerId];

        try INFT(address(tablelandTables)).ownerOf(tableId) {
            INFTMultiPrivilege manufacturerIdProxy = INFTMultiPrivilege(
                ManufacturerStorage.getStorage().idProxyAddress
            );

            if (
                !manufacturerIdProxy.hasPrivilege(
                    manufacturerId,
                    MANUFACTURER_INSERT_DD_PRIVILEGE,
                    msg.sender
                )
            ) {
                revert Unauthorized(msg.sender);
            }
        } catch {
            revert TableDoesNotExist(manufacturerId);
        }

        emit DeviceDefinitionInserted(tableId, data.id, data.model, data.year);

        tablelandTables.mutate(
            address(this),
            tableId,
            SQLHelpers.toInsert(
                "",
                tableId,
                "id,model,year,metadata,legacy_id",
                string.concat(
                    string(abi.encodePacked("'", data.id, "'")),
                    ",",
                    string(abi.encodePacked("'", data.model, "'")),
                    ",",
                    Strings.toString(data.year),
                    ",",
                    string(abi.encodePacked("'", data.metadata, "'")),
                    ",",
                    string(abi.encodePacked("'", data.legacyId, "'"))
                )
            )
        );
    }

    /**
     * @notice Insert a list of Device Definition in an existing table
     * @dev The caller must be the owner of the manufacturer ID
     * @dev The specified Device Definition Table must exist
     * @dev The pair (model,year) must be unique
     * @param manufacturerId The unique identifier of the manufacturer
     * @param data Input data list with the following fields:
     *  id -> The alphanumeric ID of the Device Definition
     *  model -> The model of the Device Definition
     *  year -> The year of the Device Definition
     *  metadata -> The metadata stringfied object of the Device Definition
     */
    function insertDeviceDefinitionBatch(
        uint256 manufacturerId,
        DeviceDefinitionInput[] calldata data
    ) external {
        TablelandTables tablelandTables = TablelandDeployments.get();
        DeviceDefinitionTableStorage.Storage
            storage dds = DeviceDefinitionTableStorage.getStorage();
        uint256 tableId = dds.tables[manufacturerId];

        try INFT(address(tablelandTables)).ownerOf(tableId) {
            INFTMultiPrivilege manufacturerIdProxy = INFTMultiPrivilege(
                ManufacturerStorage.getStorage().idProxyAddress
            );

            if (
                !manufacturerIdProxy.hasPrivilege(
                    manufacturerId,
                    MANUFACTURER_INSERT_DD_PRIVILEGE,
                    msg.sender
                )
            ) {
                revert Unauthorized(msg.sender);
            }
        } catch {
            revert TableDoesNotExist(manufacturerId);
        }

        uint256 len = data.length;
        string[] memory vals = new string[](len);
        for (uint256 i; i < len; i++) {
            vals[i] = string.concat(
                string(abi.encodePacked("'", data[i].id, "'")),
                ",",
                string(abi.encodePacked("'", data[i].model, "'")),
                ",",
                Strings.toString(data[i].year),
                ",",
                string(abi.encodePacked("'", data[i].metadata, "'")),
                ",",
                string(abi.encodePacked("'", data[i].legacyId, "'"))
            );

            emit DeviceDefinitionInserted(
                tableId,
                data[i].id,
                data[i].model,
                data[i].year
            );
        }

        string memory stmt = SQLHelpers.toBatchInsert(
            "",
            tableId,
            "id,model,year,metadata,legacy_id",
            vals
        );

        tablelandTables.mutate(address(this), tableId, stmt);
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
        DeviceDefinitionTableStorage.Storage
            storage dds = DeviceDefinitionTableStorage.getStorage();

        uint256 tableId = dds.tables[manufacturerId];

        if (tableId != 0)
            tableName = SQLHelpers.toNameFromId("", tableId);
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
