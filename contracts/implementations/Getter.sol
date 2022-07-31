//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/DIMOStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataStorage.sol";
import "@solidstate/contracts/token/ERC721/base/ERC721BaseStorage.sol";

contract Getter is ERC721MetadataInternal {
    using ERC721BaseStorage for ERC721BaseStorage.Layout;

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
}
