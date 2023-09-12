//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/tableland/VehicleTableStorage.sol";
import "../../shared/Roles.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// TODO Documentation
contract VehicleTable is AccessControlInternal {
    /// TODO Documentation
    function create(address manufacturer, string calldata prefix)
        external
        onlyRole(ADMIN_ROLE)
    {
        // TODO Check one table per manufacturer (bitmaps?)
        uint256 tableId = TablelandDeployments.get().create(
            manufacturer,
            string.concat(
                "CREATE TABLE ",
                prefix,
                "_",
                Strings.toString(block.chainid),
                " (id integer primary key, model text, year integer);"
            )
        );

        string memory tableName = string.concat(
            prefix,
            "_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(tableId)
        );

        VehicleTableStorage.getStorage().tables[tableName] = tableId;
    }
}
