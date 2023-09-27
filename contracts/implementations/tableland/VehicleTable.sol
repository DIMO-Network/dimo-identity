//SPDX-License-Identifier: BUSL-1.1
/* solhint-disable */
pragma solidity ^0.8.13;

import "../../libraries/tableland/VehicleTableStorage.sol";
import "../../shared/Roles.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

import "hardhat/console.sol";

/// TODO Documentation
contract VehicleTable is AccessControlInternal {
    event TableCreated(string tableName, uint256 tableId, string statement);

    /// TODO Documentation
    function createVehicleTable(
        address manufacturer,
        string calldata prefix
    ) external onlyRole(ADMIN_ROLE) {
        VehicleTableStorage.Storage storage vs = VehicleTableStorage
            .getStorage();

        vs.metadataTableId = TablelandDeployments.get().create(
            manufacturer,
            SQLHelpers.toCreateFromSchema("id int, x int, y int", prefix)
        );
        vs.metadataTable = SQLHelpers.toNameFromId(prefix, vs.metadataTableId);

        console.log(vs.metadataTableId);
        console.log(vs.metadataTable);

        // VehicleTableStorage.getStorage().tables[tableName] = vs.metadataTableId;

        emit TableCreated(
            vs.metadataTable,
            vs.metadataTableId,
            string.concat(
                "CREATE TABLE ",
                prefix,
                "_",
                Strings.toString(block.chainid),
                " (id integer primary key, model text, year integer);"
            )
        );
    }

    function safeMint(
        string calldata prefix,
        address manufacturer,
        string calldata make,
        string calldata model,
        string calldata year
    ) external {
        VehicleTableStorage.Storage storage vs = VehicleTableStorage
            .getStorage();
        // Insert table values upon minting.
        TablelandDeployments.get().mutate(
            manufacturer,
            vs.metadataTableId,
            SQLHelpers.toInsert(
                prefix,
                vs.metadataTableId,
                "id,model,year",
                string.concat(make, ",", model, ",", year)
            )
        );
    }

    function getVehicleDefsTable(
        string calldata prefix
    ) external view returns (string memory) {
        return
            SQLHelpers.toNameFromId(
                prefix,
                VehicleTableStorage.getStorage().metadataTableId
            );
    }

    function metadataTableId() external view returns (uint256) {
        return VehicleTableStorage.getStorage().metadataTableId;
    }

    function metadataTable() external view returns (string memory) {
        return VehicleTableStorage.getStorage().metadataTable;
    }
}
