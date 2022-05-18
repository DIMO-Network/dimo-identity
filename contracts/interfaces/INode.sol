//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface INode {
    function addAttribute(bytes32 attribute) external;
    // function setController(address _controller) external;
    function mintRootByOwner(string calldata label, address _owner) external;
    function mintRoot(string calldata label) external;
    function mintDevice(
        uint256 parentNode,
        string calldata label,
        bytes32[] calldata attributes,
        string[] calldata infos
    ) external;
    function setNode(
        uint256 parentNode,
        string calldata label,
        bytes32[] calldata attributes,
        string[] calldata infos
    ) external;
    function setInfo(
        uint256 node,
        bytes32[] calldata attributes,
        string[] calldata infos
    ) external;
    function getInfo(uint256 node, bytes32 attribute) external;
}
