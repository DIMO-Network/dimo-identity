//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/MapperStorage.sol";

// TODO Documentation
contract Mapper {
    // TODO To be removed when everything is working
    function getLink(uint256 sourceNode)
        external
        view
        returns (uint256 targetNode)
    {
        targetNode = MapperStorage.getStorage().links[sourceNode];
    }

    function getLink2(address nftProxyAddress, uint256 sourceNode)
        external
        view
        returns (uint256 targetNode)
    {
        targetNode = MapperStorage.getStorage().links2[nftProxyAddress][
            sourceNode
        ];
    }
}
