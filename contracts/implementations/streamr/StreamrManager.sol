//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../shared/Roles.sol";
import "../../libraries/streamr/StreamrStorage.sol";

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
        StreamrStorage.getStorage().streamrRegistry = streamrRegistry;
        emit StreamrRegistrySet(streamrRegistry);
    }

    // TODO Documentation
    function setDimoBaseStreamId(
        string calldata dimoBaseStreamId
    ) external onlyRole(ADMIN_ROLE) {
        StreamrStorage.getStorage().dimoBaseStreamId = dimoBaseStreamId;
        emit DimoBaseStreamIdSet(dimoBaseStreamId);
    }
}
