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
        uint256 year
    );

    /**
     * @notice Creates a new definition table associated with a specific manufacturer
     * @dev This function can only be called by an address with the ADMIN_ROLE
     * @dev The Tableland table NFT is minted to this contract
     * @param manufacturerId The unique identifier of the manufacturer
     */
    function createDeviceDefinitionTable(
        uint256 manufacturerId
    ) external onlyRole(ADMIN_ROLE) {
        _createDeviceDefinitionTable(manufacturerId);
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
            revert TableDoesNotExist(manufacturerId);
        }
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
                "model,year",
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
            revert TableDoesNotExist(manufacturerId);
        }
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
            "model,year",
            vals
        );

        tablelandTables.mutate(address(this), tableId, stmt);

        dds.ddIds += len;
    }

    // TODO Move it to a better place (maybe a separate ERC721Holder module)
    /// @dev Allows the DIMORegistry to own a Tableland table NFT
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public pure returns (bytes4) {
        return this.onERC721Received.selector;
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
