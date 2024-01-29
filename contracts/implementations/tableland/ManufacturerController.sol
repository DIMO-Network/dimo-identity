//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@tableland/evm/contracts/TablelandPolicy.sol";

/**
 * @title ManufacturerController
 * @notice Contract that implements a Tableland Controller to manage access control policy
 */
contract ManufacturerController {
    /**
     * @dev Always returns complete access to any table when the caller is the DIMORegistry, otherwise restricted access
     * @param caller Who is calling the mutate function in TablelandTables
     */
    function getPolicy(
        address caller,
        uint256
    ) external payable returns (TablelandPolicy memory policy) {
        if (caller == address(this)) {
            policy = TablelandPolicy({
                allowInsert: true,
                allowUpdate: true,
                allowDelete: true,
                whereClause: "",
                withCheck: "",
                updatableColumns: new string[](0)
            });
        }
    }
}
