//SPDX-License-Identifier: BUSL-1.1
/* solhint-disable */
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/INFTMultiPrivilege.sol";
import "../../shared/Roles.sol";
import "../../shared/Types.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/tableland/ManufacturerTableStorage.sol";

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error TableAlreadyExists(string manufacturerId);
error TableDoesNotExist(uint256 tableId);
error Unauthorized(address caller);
error InvalidManufacturerId(uint256 id);

/**
 * @title ManufacturerTable
 * @notice Contract for interacting with Manufacturer tables via Tableland
 */
contract ManufacturerTable is AccessControlInternal {
    uint256 private constant MANUFACTURER_INSERT_DD_PRIVILEGE = 3;

    event ManufacturerTableCreated(
        address indexed tableOwner,
        string indexed manufacturerId,
        uint256 indexed tableId
    );
    event ManufacturerTableSet(
        uint256 indexed manufacturerId,
        uint256 indexed tableId
    );
    event ManufacturerInserted(
        uint256 indexed tableId,
        string id,
        string name,
        string slug
    );

    /**
     * @notice Creates a new manufacturer table
     * @dev This function can only be called by an address with the ADMIN_ROLE
     * @dev The Tableland table NFT is minted to this contract
     * @param tableOwner The owner of the table to be minted
     * @param manufacturerId The manufacturer ID
     */
    function createManufacturerTable(
        address tableOwner,
        string memory manufacturerId
    ) external {
        ManufacturerTableStorage.Storage
            storage dds = ManufacturerTableStorage.getStorage();
        
        if (dds.tables[manufacturerId] != 0) {
            revert TableAlreadyExists(manufacturerId);
        }

        TablelandTables tablelandTables = TablelandDeployments.get();

        string memory statement = string(
            abi.encodePacked(
                "CREATE TABLE _",
                Strings.toString(block.chainid),
                "(id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL)"
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

        emit ManufacturerTableCreated(tableOwner, manufacturerId, tableId);
    }

    /**
     * @notice Insert a Manufacturer in an existing table
     * @dev The caller must be the owner of the manufacturer ID
     * @param data Input data with the following fields:
     *  id -> The alphanumeric ID of the Manufacturer
     *  name -> The name of the Manufacturer
     */
    function insertManufacturer(
        string memory manufacturerId,
        ManufacturerInput calldata data
    ) external {
        TablelandTables tablelandTables = TablelandDeployments.get();
        ManufacturerTableStorage.Storage
            storage dds = ManufacturerTableStorage.getStorage();
        uint256 tableId = dds.tables[manufacturerId];

        try INFT(address(tablelandTables)).ownerOf(tableId) {
            INFTMultiPrivilege manufacturerIdProxy = INFTMultiPrivilege(
                ManufacturerStorage.getStorage().idProxyAddress
            );

            if (
                !manufacturerIdProxy.hasPrivilege(
                    dds.tables[manufacturerId],
                    MANUFACTURER_INSERT_DD_PRIVILEGE,
                    msg.sender
                )
            ) {
                revert Unauthorized(msg.sender);
            }
        } catch {
            revert TableDoesNotExist(tableId);
        }

        tablelandTables.mutate(
            address(this),
            tableId,
            SQLHelpers.toInsert(
                "",
                tableId,
                "id,name,slug",
                string.concat(
                    string(abi.encodePacked("'", data.id, "'")),
                    ",",
                    string(abi.encodePacked("'", data.name, "'")),
                    ",",
                    string(abi.encodePacked("'", data.slug, "'"))
                )
            )
        );

        emit ManufacturerInserted(tableId, data.id, data.name, data.slug);
    }

    /**
     * @dev Retrieve the name of the Manufacturer table name associated with a specific manufacturer
     * @param manufacturerId The unique identifier of the manufacturer
     * @dev If a matching table does not exist, the function returns an empty string
     * @return tableName The name of the manufacturer's Manufacturer table
     */
    function getManufacturerTableName(
        string memory manufacturerId
    ) external view returns (string memory tableName) {
        ManufacturerTableStorage.Storage
            storage dds = ManufacturerTableStorage.getStorage();

        uint256 tableId = dds.tables[manufacturerId];

        if (tableId != 0) tableName = SQLHelpers.toNameFromId("", tableId);
    }

    /**
     * @dev Retrieve the Manufacturer table ID associated with a specific manufacturer
     * @param manufacturerId The unique identifier of the manufacturer
     * @dev If a matching table does not exist, the function returns zero
     * @return tableId The ID of the manufacturer's Manufacturer table
     */
    function getManufacturerTableId(
        string memory manufacturerId
    ) external view returns (uint256 tableId) {
        tableId = ManufacturerTableStorage.getStorage().tables[
            manufacturerId
        ];
    }
}
