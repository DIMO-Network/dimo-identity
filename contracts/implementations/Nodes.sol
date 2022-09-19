//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/NodesStorage.sol";

contract Nodes {
    /// @notice Gets the node type of a node
    /// @param tokenId the id associated to the node
    function getNodeType(uint256 tokenId)
        external
        view
        returns (uint256 nodeType)
    {
        nodeType = NodesStorage.getStorage().nodes[tokenId].nodeType;
    }

    /// @notice Gets the parent node of a node
    /// @param tokenId the id associated to the node
    function getParentNode(uint256 tokenId)
        external
        view
        returns (uint256 parentNode)
    {
        parentNode = NodesStorage.getStorage().nodes[tokenId].parentNode;
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
        info = NodesStorage.getStorage().nodes[nodeId].info[attribute];
    }
}
