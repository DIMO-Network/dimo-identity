//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./interfaces/IDIMORegistry.sol";


contract DIMORegistry is IDIMORegistry {
    struct Record {
        address owner;
        mapping(bytes32 => string) info;
    }

    mapping(bytes32 => Record) public records;
    mapping(address => mapping(address => bool)) public operators;

    // Permits modifications only by the owner or operator of the specified node
    modifier authorized(bytes32 node) {
        address _owner = records[node].owner;
        require(
            _owner == msg.sender || operators[_owner][msg.sender],
            "Not authorized"
        );
        _;
    }

    constructor() {
        records[0x0].owner = msg.sender;
    }

    function newRecord(
        bytes32 node,
        address _owner,
        bytes32 key,
        string calldata value
    ) external override {
        require(records[node].owner == address(0), "Node already exists");
        _setOwner(node, _owner);
        _setInfo(node, key, value);
    }

    /// @dev Sets the record for a node
    /// @param node The node to update
    /// @param _owner The address of the new owner
    function setRecord(
        bytes32 node,
        address _owner,
        bytes32 key,
        string calldata value
    ) external override {
        setOwner(node, _owner);
        _setInfo(node, key, value);
    }

    /// @dev Sets the record for a subnode
    /// @param node The parent node
    /// @param label The hash of the label specifying the subnode
    /// @param _owner The address of the new owner
    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address _owner
    ) external override authorized(node) {
        setSubnodeOwner(node, label, _owner);
    }

    /// @dev Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s records. Emits the ApprovalForAll event
    /// @param operator Address to add to the set of authorized operators
    /// @param approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address operator, bool approved)
        external
        override
    {
        operators[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /// @dev Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the records
    /// @param operator The address that acts on behalf of the owner
    /// @return True if `operator` is an approved operator for `owner`, false otherwise
    function isApprovedForAll(address _owner, address operator)
        external
        view
        override
        returns (bool)
    {
        return operators[_owner][operator];
    }

    /// @dev Transfers ownership of a node to a new address
    /// @param node The node to transfer ownership of
    /// @param _owner The address of the new owner
    function setOwner(bytes32 node, address _owner)
        public
        override
        authorized(node)
    {
        _setOwner(node, _owner);
    }

    /// @dev Transfers ownership of a subnode keccak256(node, label) to a new address
    /// @param node The parent node
    /// @param label The hash of the label specifying the subnode
    /// @param _owner The address of the new owner
    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address _owner
    ) public override authorized(node) returns (bytes32) {
        bytes32 subnode = keccak256(abi.encodePacked(node, label));
        _setOwner(subnode, _owner);

        return subnode;
    }

    /// @dev Returns the address that owns the specified node
    /// @param node The specified node
    /// @return address of the owner
    function owner(bytes32 node) public view override returns (address) {
        address addr = records[node].owner;

        // TODO Do we need this condition?
        if (addr == address(this)) {
            return address(0x0);
        }

        return addr;
    }

    /// @dev Returns the info of a key of a node
    /// @param node The specified node
    /// @return info of the key
    function info(bytes32 node, bytes32 key) public view override returns (string memory) {
        return records[node].info[key];
    }

    /// @dev Returns whether a record has been imported to the registry
    /// @param node The specified node
    /// @return Bool if record exist
    function recordExists(bytes32 node) public view override returns (bool) {
        return records[node].owner != address(0x0);
    }

    function _setOwner(bytes32 node, address _owner) internal {
        records[node].owner = _owner;
        emit Transfer(node, _owner);
    }

    function _setInfo(
        bytes32 node,
        bytes32 key,
        string memory value
    ) internal {
        records[node].info[key] = value;
        emit NewInfo(node, key, value);
    }
}
