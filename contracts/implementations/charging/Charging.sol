// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/ChargingStorage.sol";

import {ADMIN_ROLE} from "../../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title Charging
 * @notice Contract with functions to assist in charging for operations
 */
contract Charging is AccessControlInternal {
    event OperationCostSet(bytes32 operation, uint256 cost);

    /**
     * @notice Sets the DCX cost for an operation
     * @dev Only an admin can set the cost
     * @param operation The operation to have the cost set
     * @param cost The DCX cost of the operation
     */
    function setDcxOperationCost(
        bytes32 operation,
        uint256 cost
    ) external onlyRole(ADMIN_ROLE) {
        ChargingStorage.getStorage().dcxOperationCost[operation] = cost;

        emit OperationCostSet(operation, cost);
    }

    /**
     * @notice Gets the DCX cost of an operation
     * @param operation The operation to get the cost from
     */
    function getDcxOperationCost(
        bytes32 operation
    ) external view returns (uint256 cost) {
        cost = ChargingStorage.getStorage().dcxOperationCost[operation];
    }
}
