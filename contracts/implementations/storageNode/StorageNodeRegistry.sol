//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../libraries/StorageNodeRegistryStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";

import {ADMIN_ROLE} from "../../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title Storage Node Registry Contract
 * @notice Manages the registration and assignment of storage nodes for vehicles
 */
contract StorageNodeRegistry is AccessControlInternal {
    event StorageNodeSet(address indexed storageNode);

    /**
     * @notice Sets the StorageNode contract address
     * @dev Only an admin can set the StorageNode contract address
     * @param storageNode The StorageNode contract address
     */
    function setStorageNode(address storageNode) external onlyRole(ADMIN_ROLE) {
        StorageNodeRegistryStorage.getStorage().storageNode = storageNode;

        emit StorageNodeSet(storageNode);
    }

    /**
     * @notice Sets the default storage node ID to be used when no specific node is assigned
     * @dev Only an admin can set the default storage node ID
     * @param storageNodeId The ID of the storage node to be set as default
     */
    function setDefaultStorageNodeId(
        uint256 storageNodeId
    ) external onlyRole(ADMIN_ROLE) {
        StorageNodeRegistryStorage
            .getStorage()
            .defaultStorageNodeId = storageNodeId;
    }

    /**
     * @notice Gets the StorageNode address
     * @return storageNode The address of the current storage node contract
     */
    function getStorageNode() external view returns (address storageNode) {
        storageNode = StorageNodeRegistryStorage.getStorage().storageNode;
    }

    /**
     * @notice Retrieves the storage node ID associated with a specific vehicle ID
     * @dev Verifies the vehicle ID exists before returning the associated node ID
     * @param vehicleId The ID of the vehicle to query
     * @return The ID of the storage node associated with the vehicle, or 0 if the vehicle ID doesn't exist or has no associated node
     */
    function vehicleIdToStorageNodeId(
        uint256 vehicleId
    ) public view returns (uint256) {
        StorageNodeRegistryStorage.Storage
            storage snr = StorageNodeRegistryStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        try INFT(vs.idProxyAddress).ownerOf(vehicleId) returns (address) {
            return snr.vehicleIdToStorageNodeId[vehicleId];
        } catch {
            return 0;
        }
    }
}
