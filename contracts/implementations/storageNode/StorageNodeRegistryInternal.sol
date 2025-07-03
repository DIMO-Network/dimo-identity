// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/IStorageNode.sol";
import "../../libraries/StorageNodeRegistryStorage.sol";
import "../../shared/Errors.sol";

// TODO DOCUMENTATION
/**
 * @title StorageNodeRegistryInternal
 */
library StorageNodeRegistryInternal {
    // TODO DOCUMENTATION
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
