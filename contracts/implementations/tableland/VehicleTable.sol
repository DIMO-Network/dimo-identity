//SPDX-License-Identifier: BUSL-1.1
/* solhint-disable */
pragma solidity ^0.8.13;

import "../../shared/Roles.sol";
import "../../libraries/tableland/VehicleTableStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

import "hardhat/console.sol";

error InvalidManufacturerId(uint256 id);
error TableAlreadyExists(uint256 manufacturerId);

/**
 * @title VehicleTable
 * @notice Contract for interacting with Vehicle tables via Tableland
 */
contract VehicleTable is AccessControlInternal {
    event VehicleTableCreated(uint256 manufacturerId, uint256 tableId);

    /**
     * @notice Creates a new vehicle table associated with a specific manufacturer
     * @dev This function can only be called by an address with the ADMIN_ROLE
     * @param owner The address of the table's owner
     * @param manufacturerId The unique identifier of the manufacturer
     */
    function createVehicleTable(
        address owner,
        uint256 manufacturerId
    ) external onlyRole(ADMIN_ROLE) {
        VehicleTableStorage.Storage storage vs = VehicleTableStorage
            .getStorage();

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
            "id integer primary key, model text not null, year integer not null",
            prefix
        );
        uint256 tableId = TablelandDeployments.get().create(owner, statement);

        vs.tables[manufacturerId] = tableId;

        emit VehicleTableCreated(manufacturerId, tableId);
    }

    /**
     * @dev Retrieve the name of the vehicle table name associated with a specific manufacturer
     * @param manufacturerId The unique identifier of the manufacturer
     * @dev If a matching table does not exist, the function returns an empty string
     * @return tableName The name of the manufacturer's vehicle table
     */
    function getVehicleTableName(
        uint256 manufacturerId
    ) external view returns (string memory tableName) {
        uint256 tableId = VehicleTableStorage.getStorage().tables[
            manufacturerId
        ];
        string memory prefix = ManufacturerStorage
            .getStorage()
            .nodeIdToManufacturerName[manufacturerId];

        if (bytes(prefix).length != 0)
            tableName = SQLHelpers.toNameFromId(prefix, tableId);
    }

    /**
     * @dev Retrieve the vehicle table ID associated with a specific manufacturer
     * @param manufacturerId The unique identifier of the manufacturer
     * @dev If a matching table does not exist, the function returns zero
     * @return tableId The ID of the manufacturer's vehicle table
     */
    function getVehicleTableId(
        uint256 manufacturerId
    ) external view returns (uint256 tableId) {
        tableId = VehicleTableStorage.getStorage().tables[manufacturerId];
    }
}
