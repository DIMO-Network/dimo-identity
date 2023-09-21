//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// @title NftBaseUpgradeable
abstract contract NftBaseUpgradeable is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant TRANSFERER_ROLE = keccak256("TRANSFERER_ROLE");

    string private baseURI;

    /// @notice Sets the base URI
    /// @dev Caller must have the admin role
    /// @param baseURI_ Base URI to be set
    function setBaseURI(
        string calldata baseURI_
    ) external virtual onlyRole(ADMIN_ROLE) {
        baseURI = baseURI_;
    }

    /// @notice Mints a new token
    /// @dev Caller must have the minter role
    /// @dev Token Id auto increments
    /// @param to Token owner
    /// @return tokenId Minted token Id
    function safeMint(
        address to
    ) external virtual onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        _tokenIdCounter.increment();
        tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
    }

    /// @notice Mints a new token
    /// @dev Caller must have the minter role
    /// @dev Token Id auto increments
    /// @param to Token owner
    /// @param uri Individual token URI
    /// @return tokenId Minted token Id
    function safeMint(
        address to,
        string calldata uri
    ) external virtual onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        _tokenIdCounter.increment();
        tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// @notice Checks if a token was minted
    /// @param tokenId Token Id to be checked
    /// @return boolean
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /// @notice Gets the token URI associated to a token
    /// @param tokenId Token Id to be checked
    /// @return string
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice Initialize function to be used by contracts that inherit from NftBaseUpgradeable
    /// @param name_ Token name
    /// @param symbol_ Token symbol
    /// @param baseUri_ Token base URI
    function _baseNftInit(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_
    ) internal onlyInitializing {
        __ERC721_init(name_, symbol_);
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        baseURI = baseUri_;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(TRANSFERER_ROLE, msg.sender);
    }

    /// @notice Gets the base URI
    /// @return string
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /// @notice Internal function to authorize contract upgrade
    /// @dev Caller must have the upgrader role
    /// @param newImplementation New contract implementation address
    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override onlyRole(UPGRADER_ROLE) {}

    /// @notice Internal function to burn a token
    /// @dev Caller must have the burner role
    /// @param tokenId Token Id to be burned
    function _burn(
        uint256 tokenId
    )
        internal
        virtual
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        onlyRole(BURNER_ROLE)
    {
        super._burn(tokenId);
    }
}
