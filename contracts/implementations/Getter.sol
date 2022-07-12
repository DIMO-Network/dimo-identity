//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/DIMOStorage.sol";
import "@solidstate/contracts/utils/UintUtils.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataStorage.sol";
import "@solidstate/contracts/token/ERC721/base/ERC721BaseStorage.sol";

contract Getter is ERC721MetadataInternal {
    using ERC721BaseStorage for ERC721BaseStorage.Layout;
    using UintUtils for uint256;

    /// @notice NFT name
    function name() external view returns (string memory) {
        return ERC721MetadataStorage.layout().name;
    }

    /// @notice NFT symbol
    function symbol() external view returns (string memory) {
        return ERC721MetadataStorage.layout().symbol;
    }

    /// @notice NFT baseURI
    function baseURI() external view returns (string memory) {
        return ERC721MetadataStorage.layout().baseURI;
    }

    /// @notice Returns the token URI associated with the tokenId
    /// @param tokenId id of the token
    function tokenURI(uint256 tokenId)
        external
        view
        returns (string memory _tokenURI)
    {
        require(
            ERC721BaseStorage.layout().exists(tokenId),
            "NFT does not exist"
        );

        ERC721MetadataStorage.Layout storage s = ERC721MetadataStorage.layout();

        string memory _tokenIdURI = s.tokenURIs[tokenId];
        string memory _baseURI = s.baseURI;

        // If there is no base URI, return the token URI.
        if (bytes(_baseURI).length == 0) {
            _tokenURI = _tokenIdURI;
        } else if (bytes(_tokenIdURI).length > 0) {
            // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
            _tokenURI = string(abi.encodePacked(_baseURI, _tokenIdURI));
        } else {
            // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
            _tokenURI = string(abi.encodePacked(_baseURI, tokenId.toString()));
        }
    }

    /// @notice Gets the node type of a node
    /// @param tokenId the id associated to the node
    function getNodeType(uint256 tokenId)
        external
        view
        returns (uint256 nodeType)
    {
        nodeType = DIMOStorage.getStorage().nodes[tokenId].nodeType;
    }

    /// @notice Gets the parent node of a node
    /// @param tokenId the id associated to the node
    function getParentNode(uint256 tokenId)
        external
        view
        returns (uint256 parentNode)
    {
        parentNode = DIMOStorage.getStorage().nodes[tokenId].parentNode;
    }

    /// @notice Gets information stored in an attribute of a given node
    /// @dev Returns empty string if does or attribute does not exists
    /// @param nodeId Node id from which info will be obtained
    /// @param attribute Key attribute
    /// @return info Info obtained
    function getInfo(uint256 nodeId, string calldata attribute)
        external
        view
        returns (string memory info)
    {
        info = DIMOStorage.getStorage().nodes[nodeId].info[attribute];
    }

    /// @notice Gets the owner of a node
    /// @param tokenId the id associated to the node
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _ownerOf(tokenId);
    }
}
