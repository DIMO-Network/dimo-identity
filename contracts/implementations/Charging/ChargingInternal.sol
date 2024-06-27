// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/SharedStorage.sol";
import "../../libraries/ChargingStorage.sol";

import "@openzeppelin/contracts/interfaces/IERC20.sol";

/**
 * @title ChargingInternal
 * @notice Library with internal functions to assist in charging for operations
 */
library ChargingInternal {
    /**
     * @notice Charges the sender for the operation
     * The sender transfers the DCX operation cost amount to the foundation
     * @dev This contract must be approved to spend the tokens in advance
     * @param sender The address of the sender
     * @param operation The operation to get the cost from
     */
    function _chargeDcx(address sender, bytes32 operation) internal {
        SharedStorage.Storage storage s = SharedStorage.getStorage();

        uint256 cost = ChargingStorage.getStorage().dcxOperationCost[operation];

        IERC20(s.dimoCredit).transferFrom(sender, s.foundation, cost);
    }
}
