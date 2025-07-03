//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../libraries/StorageNodeRegistryStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";

import {ADMIN_ROLE} from "../../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

// TODO Documentation
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

    // TODO Documentation
    function setDefaultStorageNodeId(
        uint256 storageNodeId
    ) external onlyRole(ADMIN_ROLE) {
        StorageNodeRegistryStorage
            .getStorage()
            .defaultStorageNodeId = storageNodeId;
    }

    /**
     * @notice Gets the StorageNode address
     */
    function getStorageNode() external view returns (address storageNode) {
        storageNode = StorageNodeRegistryStorage.getStorage().storageNode;
    }

    /**
     * @notice Retrieves the storate node ID associated with a specific vehicle ID
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
