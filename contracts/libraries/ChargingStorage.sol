//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimo.sol";
import "../interfaces/ILicense.sol";

/**
 * @title ChargingStorage
 * @notice Storage of the Charging contract
 */
library ChargingStorage {
    bytes32 internal constant CHARGING_STORAGE_SLOT =
        keccak256("DIMORegistry.charging.storage");

    struct Storage {
        // operation => DCX cost
        mapping(bytes32 => uint256) dcxOperationCost;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = CHARGING_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
