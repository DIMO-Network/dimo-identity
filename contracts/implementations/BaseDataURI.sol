//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../libraries/BaseDataURIStorage.sol";
import "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title BaseDataURI
/// @notice Contract to store data URI related to the nodes
contract BaseDataURI is AccessControlInternal {
    event BaseDataURISet(address idProxyAddress, string dataUri);

    /**
     * @notice Sets the base data URI
     * @dev Only an admin can set the base data URI
     * @param idProxyAddress The address of the NFT proxy
     * @param _baseDataURI The base data URI string
     */
    function setBaseDataURI(
        address idProxyAddress,
        string calldata _baseDataURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        BaseDataURIStorage.getStorage().baseDataURIs[
            idProxyAddress
        ] = _baseDataURI;
        emit BaseDataURISet(idProxyAddress, _baseDataURI);
    }
}
