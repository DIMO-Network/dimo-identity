// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/IStorageNode.sol";
import "../../libraries/StorageNodeRegistryStorage.sol";
import "../../shared/Errors.sol";

/**
 * @title StorageNodeRegistryInternal
 * @notice Internal library for managing storage node associations with vehicles
 */
library StorageNodeRegistryInternal {
    /**
     * @notice Associates a storage node with a vehicle
     * @dev If storageNodeId is 0, the default storage node will be assigned.
     *      Reverts if the specified storage node does not exist.
     * @param vehicleId The ID of the vehicle to be associated with a storage node
     * @param storageNodeId The ID of the storage node to be associated with the vehicle.
     *                      If 0, the default storage node will be used.
     */
    function _setNodeIdForVehicleId(
        uint256 vehicleId,
        uint256 storageNodeId
    ) internal {
        StorageNodeRegistryStorage.Storage
            storage snr = StorageNodeRegistryStorage.getStorage();

        if (storageNodeId == 0) {
            storageNodeId = snr.defaultStorageNodeId;
        } else if (!IStorageNode(snr.storageNode).exists(storageNodeId)) {
            revert InvalidStorageNode(storageNodeId);
        }

        snr.vehicleIdToStorageNodeId[vehicleId] = storageNodeId;
    }
}
