//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title VehicleStream
 * @notice Storage of the VehicleStream contract
 */
library VehicleStreamStorage {
    string internal constant VEHICLE_STREAM_STORAGE_SLOT =
        "DIMORegistry.vehicleStream.storage";

    struct Storage {
        string streamId;
        address[] subscribers;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage(
        uint vehicleId
    ) internal pure returns (Storage storage s) {
        bytes32 slot = keccak256(
            abi.encodePacked(VEHICLE_STREAM_STORAGE_SLOT, vehicleId)
        );
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
