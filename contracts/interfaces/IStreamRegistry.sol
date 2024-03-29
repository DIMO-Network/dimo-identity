//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title IStreamRegistry
 * @notice Interface to interact with external functions of StreamRegistry contract
 * @dev https://github.com/streamr-dev/network-contracts/tree/master/packages/network-contracts/contracts/StreamRegistry
 */
interface IStreamRegistry {
    enum PermissionType {
        Edit,
        Delete,
        Publish,
        Subscribe,
        Grant
    }

    function createStreamWithENS(
        string calldata ensName,
        string calldata streamIdPath,
        string calldata metadataJsonString
    ) external;

    function exists(string calldata streamId) external returns (bool);

    function deleteStream(string calldata streamId) external;

    function hasPermission(
        string calldata streamId,
        address user,
        PermissionType permissionType
    ) external returns (bool);

    function grantPermission(
        string calldata streamId,
        address user,
        PermissionType permissionType
    ) external;

    function revokePermission(
        string calldata streamId,
        address user,
        PermissionType permissionType
    ) external;

    function setExpirationTime(
        string calldata streamId,
        address user,
        PermissionType permissionType,
        uint256 expirationTime
    ) external;
}
