//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title StorageNodeRegistryStorage
 * @notice Storage of StorageNodeRegistry contract
 */
library StorageNodeRegistryStorage {
    bytes32 internal constant STORAGE_NODE_REGISTRY_STORAGE_SLOT =
        keccak256("DIMORegistry.storageNodeRegistry.storage");

    struct Storage {
        // Address of the StorageNode contract
        address storageNode;
        // Default Storage Node ID to be set during vehicle mints
        uint256 defaultStorageNodeId;
        // Mapping from vehicle ID to its associated storage node ID
        mapping(uint256 => uint256) vehicleIdToStorageNodeId;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = STORAGE_NODE_REGISTRY_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
