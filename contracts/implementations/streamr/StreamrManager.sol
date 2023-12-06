//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../shared/Roles.sol";
import "../../libraries/streamr/StreamrManagerStorage.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

// TODO Documentation
/**
 * @title StreamrManager
 */
contract StreamrManager is AccessControlInternal {
    event StreamrRegistrySet(address streamrRegistry);
    event DimoBaseStreamIdSet(string baseStreamId);

    // TODO Documentation
    function setStreamrRegistry(
        address streamrRegistry
    ) external onlyRole(ADMIN_ROLE) {
        StreamrManagerStorage.getStorage().streamrRegistry = streamrRegistry;
        emit StreamrRegistrySet(streamrRegistry);
    }
}
