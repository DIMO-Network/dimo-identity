// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ISacdListener
 * @dev Interface for reacting to calls to the Service Access Contract Definition (SACD)
 * ERC721 token contracts that implement the ISacdListener interface can execute custom logic when SACD permissions change
 */
interface ISacdListener {
    /**
     * @dev Handles the event when permissions are set for the ERC721 token
     * @param tokenId The ID of the token for which permissions are being set.
     * @param grantee The address to receive the permission
     * @param permissions The uint256 that represents the byte array of permissions
     * @param expiration Expiration of the permissions
     */
    function onSetPermissions(
        uint256 tokenId,
        address grantee,
        uint256 permissions,
        uint256 expiration
    ) external;
}
