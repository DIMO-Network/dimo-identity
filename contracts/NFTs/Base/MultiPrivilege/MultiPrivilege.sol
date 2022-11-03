//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./IMultiPrivilege.sol";
import "../ERC721nftBase.sol";

contract MultiPrivilege is ERC721nftBase, IMultiPrivilege {
    struct PrivilegeRecord {
        address user;
        uint256 expiresAt;
    }
    struct PrivilegeStorage {
        uint256 lastExpiresAt;
        // privId => PrivilegeRecord
        mapping(uint256 => PrivilegeRecord) privilegeEntry;
    }

    uint256 public privilegeTotal;
    // tokenId => PrivilegeStorage
    mapping(uint256 => PrivilegeStorage) public privilegeBook;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 privilegeTotal_
    ) ERC721nftBase(name_, symbol_) {
        privilegeTotal = privilegeTotal_;
    }

    function setPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Caller is not owner nor approved"
        );
        require(privId < privilegeTotal, "Invalid privilege id");

        privilegeBook[tokenId].privilegeEntry[privId].user = user;

        privilegeBook[tokenId].privilegeEntry[privId].expiresAt = expires;
        if (privilegeBook[tokenId].lastExpiresAt < expires) {
            privilegeBook[tokenId].lastExpiresAt = expires;
        }

        emit PrivilegeAssigned(
            tokenId,
            privId,
            user,
            privilegeBook[tokenId].privilegeEntry[privId].expiresAt
        );
    }

    function setPrivilegeTotal(uint256 total)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        privilegeTotal = total;
        emit PrivilegeTotalChanged(total, privilegeTotal);
    }

    function hasPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (bool) {
        if (
            privilegeBook[tokenId].privilegeEntry[privId].expiresAt >=
            block.timestamp
        ) {
            return privilegeBook[tokenId].privilegeEntry[privId].user == user; // What if user is the owner?
        }
        return ownerOf(tokenId) == user;
    }

    function privilegeExpires(uint256 tokenId, uint256 privId)
        external
        view
        returns (uint256)
    {
        return privilegeBook[tokenId].privilegeEntry[privId].expiresAt;
    }

    function getPrivilegeInfo(uint256 tokenId, uint256 privId)
        external
        view
        returns (address user, uint256 expiresAt)
    {
        return (
            privilegeBook[tokenId].privilegeEntry[privId].user,
            privilegeBook[tokenId].privilegeEntry[privId].expiresAt
        );
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IMultiPrivilege).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
