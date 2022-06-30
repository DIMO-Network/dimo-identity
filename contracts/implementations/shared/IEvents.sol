//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract IEvents {
    event AttributeAdded(uint256 nodeType, string attribute);
    event NodeMinted(uint256 nodeType, uint256 nodeId);
}
