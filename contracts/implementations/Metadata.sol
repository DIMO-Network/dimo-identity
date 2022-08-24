//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../access/AccessControlInternal.sol";
import "@solidstate/contracts/token/ERC721/base/ERC721BaseStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataStorage.sol";

contract Metadata is AccessControlInternal {
    using ERC721BaseStorage for ERC721BaseStorage.Layout;

    /// @notice Sets the base URI
    /// @param _baseURI The new base URI to be set
    function setBaseURI(string calldata _baseURI)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        ERC721MetadataStorage.layout().baseURI = _baseURI;
    }

    /// @notice Sets a token URI for a specific token
    /// @param tokenId The token id associated with the token URI
    /// @param _tokenURI The token URI to be set
    function setTokenURI(uint256 tokenId, string calldata _tokenURI)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            ERC721BaseStorage.layout().exists(tokenId),
            "NFT does not exist"
        );
        ERC721MetadataStorage.layout().tokenURIs[tokenId] = _tokenURI;
    }

    /// @notice NFT baseURI
    function baseURI() external view returns (string memory) {
        return ERC721MetadataStorage.layout().baseURI;
    }
}
