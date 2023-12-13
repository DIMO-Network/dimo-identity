//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../shared/Roles.sol";
import "../../libraries/streamr/StreamrManagerStorage.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title StreamrManager
 * @notice Contract to manage information related to Streamr
 */
contract StreamrManager is AccessControlInternal {
    event StreamRegistrySet(address streamRegistry);

    /**
     * @notice Sets the StreamRegistry contract address
     * @dev Caller must have the ADMIN_ROLE
     * @param streamRegistry The StreamRegistry contract address
     */
    function setStreamRegistry(
        address streamRegistry
    ) external onlyRole(ADMIN_ROLE) {
        StreamrManagerStorage.getStorage().streamRegistry = streamRegistry;
        emit StreamRegistrySet(streamRegistry);
    }
}
