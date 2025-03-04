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
     * @notice Charges the sender for a specified operation
     * @dev Burns an amount of DCX tokens calculated as the operation's cost multiplied by the given multiplier
     *      Ensure this contract is approved to spend the sender's tokens beforehand
     * @param sender The address initiating the charge
     * @param operation The identifier of the operation to determine the base cost
     * @param amount The multiplier applied to the base operation cost
     */
    function _chargeDcx(
        address sender,
        bytes32 operation,
        uint256 amount
    ) internal {
        address dimoCredit = SharedStorage.getStorage().dimoCredit;
        uint256 cost = ChargingStorage.getStorage().dcxOperationCost[operation];

        IERC20Burnable(dimoCredit).burn(sender, cost * amount);
    }

    /**
     * @notice Charges the sender for a specified operation
     * @dev Burns an amount of DCX tokens calculated as the operation's cost
     *      Ensure this contract is approved to spend the sender's tokens beforehand
     * @param sender The address initiating the charge
     * @param operation The identifier of the operation to determine the base cost
     */
    function _chargeDcx(address sender, bytes32 operation) internal {
        address dimoCredit = SharedStorage.getStorage().dimoCredit;
        uint256 cost = ChargingStorage.getStorage().dcxOperationCost[operation];

        IERC20Burnable(dimoCredit).burn(sender, cost);
    }
}
