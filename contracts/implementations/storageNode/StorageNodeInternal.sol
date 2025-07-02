// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/IStorageNode.sol";
import "../../libraries/SharedStorage.sol";
import "../../shared/Errors.sol";

// TODO DOCUMENTATION
/**
 * @title StorageNodeInternal
 * @notice Library with internal functions to assist in charging for operations
 */
library StorageNodeInternal {
    // TODO DOCUMENTATION
    function _validateStorageNodeId(uint256 storageNodeId) internal view {
        // TODO Return default StorageNode
        if (storageNodeId == 0) return;

        SharedStorage.Storage storage ss = SharedStorage.getStorage();

        if (!IStorageNode(ss.storageNode).exists(storageNodeId)) {
            revert InvalidStorageNode(storageNodeId);
        }
    }
}
