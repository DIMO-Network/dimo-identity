//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;


interface IDIMORegistry {
    // Logged when the owner of a node assigns a new owner to a subnode
    event NewOwner(bytes32 indexed node, bytes32 indexed label, address _owner);

    // Logged when the owner of a node transfers ownership to a new account
    event Transfer(bytes32 indexed node, address _owner);

    // Logged when an operator is added or removed
    event ApprovalForAll(
        address indexed _owner,
        address indexed operator,
        bool approved
    );

    // Logged when the owner or an operator adds a new info
    event NewInfo(bytes32 indexed node, bytes32 indexed key, string value);

    function newRecord(
        bytes32 node,
        address _owner,
        bytes32 key,
        string calldata value
    ) external;

    function setRecord(
        bytes32 node,
        address _owner,
        bytes32 key,
        string calldata value
    ) external;

    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address _owner
    ) external;

    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address _owner
    ) external returns (bytes32);

    function setOwner(bytes32 node, address _owner) external;

    function setApprovalForAll(address operator, bool approved) external;

    function owner(bytes32 node) external view returns (address);

    function info(bytes32 node, bytes32 key) external view returns (string memory);

    function recordExists(bytes32 node) external view returns (bool);

    function isApprovedForAll(address _owner, address operator)
        external
        view
        returns (bool);
}
