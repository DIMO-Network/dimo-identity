//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "../libraries/MapperStorage.sol";

/// @title Mapper
/// @notice Contract to map relationships between nodes
contract Mapper {
    /// @notice Gets the link between two nodes
    /// @param nftProxyAddress The address of the NFT proxy
    /// @param sourceNode The node Id to be queried
    function getLink(address nftProxyAddress, uint256 sourceNode)
        external
        view
        returns (uint256 targetNode)
    {
        targetNode = MapperStorage.getStorage().links[nftProxyAddress][
            sourceNode
        ];
    }
}
