//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// TODO Documentation
contract ERC721nftBase is ERC721, ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    Counters.Counter private _tokenIdCounter;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    function safeMint(address to) public virtual onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function burn(uint256 tokenId)
        public
        virtual
        override
        onlyRole(BURNER_ROLE)
    {
        super.burn(tokenId);
    }

    function approve(address to, uint256 tokenId)
        public
        virtual
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved)
        public
        virtual
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        super.setApprovalForAll(operator, approved);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
