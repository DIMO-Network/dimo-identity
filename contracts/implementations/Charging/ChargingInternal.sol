// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/IERC20Burnable.sol";
import "../../libraries/SharedStorage.sol";
import "../../libraries/ChargingStorage.sol";

/**
 * @title ChargingInternal
 * @notice Library with internal functions to assist in charging for operations
 */
library ChargingInternal {
    /**
     * @notice Charges the sender for the operation
     * The sender's DCX tokens will be burned.
     * @dev This contract must be approved to spend the tokens in advance
     * @param sender The address of the sender
     * @param operation The operation to get the cost from
     */
    function _chargeDcx(address sender, bytes32 operation) internal {
        address dimoCredit = SharedStorage.getStorage().dimoCredit;
        uint256 cost = ChargingStorage.getStorage().dcxOperationCost[operation];

        IERC20Burnable(dimoCredit).burn(sender, cost);
    }
}
