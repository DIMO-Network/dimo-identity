//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IMultiPrivilege {
    event PrivilegeAssigned(
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    );
    event PrivilegeTransfer(
        uint256 tokenId,
        uint256 privId,
        address from,
        address to
    );
    event PrivilegeTotalChanged(uint256 newTotal, uint256 oldTotal);

    function setPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    ) external;

    function privilegeExpires(uint256 tokenId, uint256 privId)
        external
        view
        returns (uint256);

    function hasPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (bool);
}
