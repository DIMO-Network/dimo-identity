//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

interface IMultiPrivilege {
    event PrivilegeCreated(
        uint256 indexed privilegeId,
        bool enabled,
        string description
    );
    event PrivilegeEnabled(uint256 indexed privilegeId);
    event PrivilegeDisabled(uint256 indexed privilegeId);
    event PrivilegeSet(
        uint256 indexed tokenId,
        uint256 version,
        uint256 indexed privId,
        address indexed user,
        uint256 expires
    );

    function setPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    ) external;

    function hasPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (bool);

    function privilegeExpiresAt(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (uint256);
}
