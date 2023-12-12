//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @dev We don't need this storage yet
 * @title VehicleStream
 * @notice Storage of the VehicleStream contract
 */
library VehicleStreamStorage {
    bytes32 internal constant VEHICLE_STREAM_STORAGE_SLOT =
        keccak256("DIMORegistry.vehicleStream.storage");

    // struct Storage {
    //     uint256 test;
    // }

    // /* solhint-disable no-inline-assembly */
    // function getStorage() internal pure returns (Storage storage s) {
    //     bytes32 slot = VEHICLE_STREAM_STORAGE_SLOT;
    //     assembly {
    //         s.slot := slot
    //     }
    // }
    // /* solhint-enable no-inline-assembly */
}
