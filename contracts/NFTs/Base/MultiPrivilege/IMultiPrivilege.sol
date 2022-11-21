//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IMultiPrivilege {
    event PrivilegeCreated(
        uint256 privilegeId,
        bool enabled,
        string decription
    );
    event PrivilegeEnabled(uint256 privilegeId);
    event PrivilegeDisabled(uint256 privilegeId);
    event PrivilegeSet(
        uint256 tokenId,
        uint256 version,
        uint256 privId,
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
