//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/MapperStorage.sol";

// TODO Documentation
contract Mapper {
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
