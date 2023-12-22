//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../shared/Roles.sol";
import "../../libraries/streamr/StreamrConfiguratorStorage.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title StreamrConfigurator
 * @notice Contract to manage information related to Streamr
 */
contract StreamrConfigurator is AccessControlInternal {
    event StreamRegistrySet(address streamRegistry);

    /**
     * @notice Sets the StreamRegistry contract address
     * @dev Caller must have the ADMIN_ROLE
     * @param streamRegistry The StreamRegistry contract address
     */
    function setStreamRegistry(
        address streamRegistry
    ) external onlyRole(ADMIN_ROLE) {
        StreamrConfiguratorStorage.getStorage().streamRegistry = streamRegistry;
        emit StreamRegistrySet(streamRegistry);
    }
}
