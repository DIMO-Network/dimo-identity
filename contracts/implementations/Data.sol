//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../libraries/DataStorage.sol";
import "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title Data
/// @notice Contract to store data related to the nodes
contract Data is AccessControlInternal {
    event DataUriSet(string dataUri);

    /// @notice Sets the data URI
    /// @dev Only an admin can set the data URI
    /// @param _dataUri The data URI string
    function setDataUri(string calldata _dataUri)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        DataStorage.getStorage().dataUri = _dataUri;
        emit DataUriSet(_dataUri);
    }
}
