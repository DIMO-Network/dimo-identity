//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/MapperStorage.sol";

contract Mapper {
    // TODO Documentation
    function getLink(uint256 sourceNode)
        external
        view
        returns (uint256 targetNode)
    {
        targetNode = MapperStorage.getStorage().links[sourceNode];
    }
}
