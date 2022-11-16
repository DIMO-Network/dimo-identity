//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./IMultiPrivilege_old.sol";
import "../ERC721nftBase.sol";

import "hardhat/console.sol";

contract MultiPrivilegeOld is ERC721nftBase, IMultiPrivilegeOld {
    struct PrivilegeRecord {
        address user;
        uint256 expiresAt;
    }
    struct PrivilegeStorage {
        uint256 lastExpiresAt;
        // privId => PrivilegeRecord
        mapping(uint256 => PrivilegeRecord) privilegeEntry;
    }

    struct PrivilegeStorage2 {
        uint256 lastExpiresAt;
        // privId => PrivilegeRecord
        mapping(uint256 => mapping(address => uint256)) privilegeEntry;
    }

    struct CloneableRecord {
        // account => shared
        mapping(address => bool) shared;
        // account => refer
        mapping(address => address) referrer;
    }

    uint256 public privilegeTotal;
    // tokenId => PrivilegeStorage
    mapping(uint256 => PrivilegeStorage) public privilegeBook;

    // tokenId => user => expires at
    mapping(uint256 => mapping(address => uint256)) public privilegeEntry;

    // tokenId => privId => user => expires at
    mapping(uint256 => mapping(uint256 => mapping(address => uint256)))
        public privilegeEntry2;

    // privId => isCloneable
    mapping(uint256 => bool) public cloneable;
    // tokenId => privId => CloneableRecord
    mapping(uint256 => mapping(uint256 => CloneableRecord)) cloneableSetting;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 privilegeTotal_
    ) ERC721nftBase(name_, symbol_) {
        privilegeTotal = privilegeTotal_;
    }

    // TODO Documentation
    function setPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    ) external {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "Caller is not owner nor approved"
        );
        require(privId < privilegeTotal, "Invalid privilege id");

        PrivilegeStorage storage p = privilegeBook[tokenId];

        p.privilegeEntry[privId] = PrivilegeRecord(user, expires);

        if (p.lastExpiresAt < expires) {
            p.lastExpiresAt = expires;
        }

        emit PrivilegeAssigned(tokenId, privId, user, expires);
    }

    // TODO Documentation
    // function clonePrivilege(
    //     uint256 tokenId,
    //     uint256 privId,
    //     address referrer
    // ) external returns (bool) {
    //     require(
    //         privilegeBook[tokenId].privilegeEntry[privId].user == referrer ||
    //             cloneableSetting[tokenId][privId].shared[referrer],
    //         "referrer not exists"
    //     );

    //     if (
    //         cloneableSetting[tokenId][privId].referrer[msg.sender] == address(0)
    //     ) {
    //         cloneableSetting[tokenId][privId].shared[msg.sender] = true;
    //         cloneableSetting[tokenId][privId].referrer[msg.sender] = referrer;
    //         emit PrivilegeCloned(tokenId, privId, referrer, msg.sender);
    //         return true;
    //     }
    //     return false;
    // }

    // TODO Documentation
    // function revokePrivilege(
    //     uint256 tokenId,
    //     uint256 privId,
    //     address user
    // ) external {
    //     require(
    //         _isApprovedOrOwner(msg.sender, tokenId),
    //         "Caller is not owner nor approved"
    //     );

    //     require(hasPrivilege(tokenId, privId, user));

    //     PrivilegeStorage storage p = privilegeBook[tokenId];

    //     p.privilegeEntry[privId] = PrivilegeRecord(address(0), 0);

    //     emit PrivilegeRevoked(tokenId, privId, user);
    // }

    // TODO Documentation
    function setPrivilegeTotal(uint256 total)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        privilegeTotal = total;
        emit PrivilegeTotalChanged(total, privilegeTotal);
    }

    // TODO Documentation
    function hasPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (bool) {
        if (
            privilegeBook[tokenId].privilegeEntry[privId].expiresAt >=
            block.timestamp &&
            privilegeBook[tokenId].privilegeEntry[privId].user == user
        ) {
            return true;
        }
        return ownerOf(tokenId) == user;
    }

    // TODO Documentation
    function privilegeExpires(uint256 tokenId, uint256 privId)
        external
        view
        returns (uint256)
    {
        return privilegeBook[tokenId].privilegeEntry[privId].expiresAt;
    }

    // TODO Documentation
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
            interfaceId == type(IMultiPrivilegeOld).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
