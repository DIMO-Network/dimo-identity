//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/ResolverStorage.sol";

contract Resolver {
    function getChild(uint256 parentNode)
        external
        view
        returns (uint256 childNode)
    {
        childNode = ResolverStorage.getStorage().childs[parentNode];
    }
}
