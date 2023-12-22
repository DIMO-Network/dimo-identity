//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title VechielStreamStorage
 * @notice Storage of the VechielStream contract
 */
library VehicleStreamStorage {
    bytes32 internal constant VEHICLE_STREAM_STORAGE_SLOT =
        keccak256("DIMORegistry.vehicleStream.storage");

    struct Storage {
        mapping(uint256 => string) streams;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = VEHICLE_STREAM_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
