// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/ChargingStorage.sol";

import {ADMIN_ROLE} from "../../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title Charging
 * @notice TODO Documentation
 */
contract Charging is AccessControlInternal {
    event OperationCostSet(bytes32 operation, uint256 cost);

    /**
     * @notice Sets the cost for an operation
     * @dev Only an admin can set the cost
     * @param operation The operation to have the cost set
     * @param cost The cost of the operation
     */
    // TODO Rename to setOperationDcxCost
    function setOperationCost(
        bytes32 operation,
        uint256 cost
    ) external onlyRole(ADMIN_ROLE) {
        ChargingStorage.getStorage().operationCost[operation] = cost;

        emit OperationCostSet(operation, cost);
    }

    /**
     * @notice Gets the cost of an operation
     * @param operation The operation to get the cost from
     */
    function getOperationCost(
        bytes32 operation
    ) external view returns (uint256 cost) {
        cost = ChargingStorage.getStorage().operationCost[operation];
    }
}
