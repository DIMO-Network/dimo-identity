// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/SharedStorage.sol";
import "../../libraries/ChargingStorage.sol";

import "@openzeppelin/contracts/interfaces/IERC20.sol";

/**
 * @title ChargingInternal
 * @notice TODO Documentation
 */
library ChargingInternal {
    // TODO Documentation
    function _chargeDcx(address sender, bytes32 operation) internal {
        SharedStorage.Storage storage s = SharedStorage.getStorage();

        uint256 cost = ChargingStorage.getStorage().operationCost[operation];

        IERC20(s.dimoCredit).transferFrom(sender, s.foundation, cost);
    }
}
