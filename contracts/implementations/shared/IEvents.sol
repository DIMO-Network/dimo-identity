//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IEvents {
    event AttributeAdded(uint256 indexed nodeType, string indexed attribute);
    event NodeMinted(uint256 indexed nodeType, uint256 indexed nodeId);
}
