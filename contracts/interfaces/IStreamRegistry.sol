//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

interface IStreamRegistry {
    enum PermissionType {
        Edit,
        Delete,
        Publish,
        Subscribe,
        Grant
    }

    function exists(string calldata streamId) external view returns (bool);

    function createStream(
        string calldata streamIdPath,
        string calldata metadataJsonString
    ) external;

    function createStreamWithENS(
        string calldata ensName,
        string calldata streamIdPath,
        string calldata metadataJsonString
    ) external;

    function getStreamMetadata(
        string calldata streamId
    ) external view returns (string memory des);

    function updateStreamMetadata(
        string calldata streamId,
        string calldata metadata
    ) external;

    function grantPublicPermission(
        string calldata streamId,
        PermissionType permissionType
    ) external;

    function grantPermission(
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

    function revokePermission(
        string calldata streamId,
        address user,
        PermissionType permissionType
    ) external;
}
