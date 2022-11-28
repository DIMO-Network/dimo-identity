//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../libraries/MapperStorage.sol";

/// @title Mapper
/// @notice Contract to map relationships between nodes
contract Mapper {
    /// @notice Gets the link between two nodes
    /// @param idProxyAddress The address of the NFT proxy
    /// @param sourceNode The node Id to be queried
    function getLink(address idProxyAddress, uint256 sourceNode)
        external
        view
        returns (uint256 targetNode)
    {
        targetNode = MapperStorage.getStorage().links[idProxyAddress][
            sourceNode
        ];
    }
}
