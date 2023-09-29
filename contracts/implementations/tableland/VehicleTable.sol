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
error TableAlreadyExists(uint256 tableId);

/// TODO Documentation
contract VehicleTable is AccessControlInternal {
    event VehicleTableCreated(uint256 manufacturerId, uint256 tableId);

    /// TODO Documentation
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
            revert TableAlreadyExists(vs.tables[manufacturerId]);
        }

        string memory statement = SQLHelpers.toCreateFromSchema(
            "id integer primary key, model text not null, year integer not null",
            prefix
        );
        uint256 tableId = TablelandDeployments.get().create(owner, statement);

        vs.tables[manufacturerId] = tableId;

        emit VehicleTableCreated(manufacturerId, tableId);
    }

    // TODO Documentation
    function createVehicleDefinition(
        uint256 manufacturerId,
        string calldata id,
        string calldata model,
        string calldata year
    ) external {
        uint256 tableId = VehicleTableStorage.getStorage().tables[
            manufacturerId
        ];
        string memory prefix = ManufacturerStorage
            .getStorage()
            .nodeIdToManufacturerName[manufacturerId];

        // Insert table values upon minting
        TablelandDeployments.get().mutate(
            address(this),
            tableId,
            SQLHelpers.toInsert(
                prefix,
                tableId,
                "id,model,year",
                string.concat(
                    id,
                    ",",
                    string(abi.encodePacked("'", model, "'")),
                    ",",
                    string(abi.encodePacked("'", year, "'"))
                )
            )
        );
    }

    // TODO Documentation
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

    // TODO Documentation
    function getVehicleTableId(
        uint256 manufacturerId
    ) external view returns (uint256 tableId) {
        tableId = VehicleTableStorage.getStorage().tables[manufacturerId];
    }
}
