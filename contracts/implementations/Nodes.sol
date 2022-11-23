//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../libraries/NodesStorage.sol";

/// @title Nodes
/// @notice Contract to store data related to the nodes
contract Nodes {
    /// @notice Gets the parent node of a node
    /// @dev Returns 0 if the node does no have a parent node
    /// @param idProxyAddress The address of the proxy associated with the node Id
    /// @param tokenId the id associated to the node
    function getParentNode(address idProxyAddress, uint256 tokenId)
        external
        view
        returns (uint256 parentNode)
    {
        parentNode = NodesStorage
        .getStorage()
        .nodes[idProxyAddress][tokenId].parentNode;
    }

    /// @notice Gets information stored in an attribute of a given node
    /// @dev Returns empty string if attribute does not exist
    /// @param idProxyAddress The address of the proxy associated with the token Id
    /// @param tokenId Node id from which info will be obtained
    /// @param attribute Key attribute
    /// @return info Info obtained
    function getInfo(
        address idProxyAddress,
        uint256 tokenId,
        string calldata attribute
    ) external view returns (string memory info) {
        info = NodesStorage.getStorage().nodes[idProxyAddress][tokenId].info[
            attribute
        ];
    }
}
