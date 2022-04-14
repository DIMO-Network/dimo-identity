//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract DIMORegistry is Ownable, ERC721 {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.Bytes32Set;

    Counters.Counter private _tokenIds; // Token id tracker
    EnumerableSet.Bytes32Set private _whitelistedAttributes; // Allowed node attributes

    struct Record {
        address owner;
        bool root;
        mapping(bytes32 => string) info;
    }

    struct Controller {
        bool isController;
        bool rootMinted;
    }

    mapping(bytes32 => Record) public records; // [Node hash] => Node info
    mapping(address => Controller) public controllers; // [Controller address] => is controller, has minted root

    constructor() ERC721("DIMO Node", "DN") {
        controllers[msg.sender].isController = true;
    }

    //***** Owner management *****//

    /// @notice Adds an attribute to the whielist
    /// @dev Only the owner can set new controllers
    /// @param attribute The attribute to be added
    function addAttribute(bytes32 attribute) external onlyOwner {
        _whitelistedAttributes.add(attribute);
    }

    /// @notice Sets a address controller
    /// @dev Only the owner can set new controllers
    /// @param _controller The address of the controller
    function setController(address _controller) external onlyOwner {
        controllers[_controller].isController = true;
    }

    //***** Interaction with nodes *****//

    /// @notice Mints a root
    /// @dev Caller must be the owner
    /// @dev Owner cannot mint more than one root
    /// @param label The label specifying the root
    /// @param _owner The address of the new owner
    function mintRootByOwner(string calldata label, address _owner)
        external
        onlyOwner
    {
        require(!controllers[_owner].rootMinted, "One root per owner");

        _mintRoot(label, _owner);
    }

    /// @notice Mints a root
    /// @dev Caller must be a controller
    /// @dev Owner cannot mint more than one root
    /// @param label The label specifying the root
    function mintRoot(string calldata label) external {
        require(
            controllers[msg.sender].isController &&
                !controllers[msg.sender].rootMinted,
            "Invalid request"
        );

        _mintRoot(label, msg.sender);
    }

    /// @notice Mints a vehicle
    /// @dev Vehicle owner will be msg.sender
    /// @dev Parent node must exist and must be a root
    /// @param parentNode The corresponding root
    /// @param label The label specifying the vehicle
    function mintDevice(bytes32 parentNode, string calldata label) external {
        require(
            records[parentNode].owner != address(0) && records[parentNode].root,
            "Invalid node"
        );

        bytes32 node = _verifyNewNode(parentNode, label);

        records[node].owner = msg.sender;

        _internalMint(msg.sender);
    }

    /// @notice Sets a node under a vehicle or other node
    /// @dev Caller must be parent node owner
    /// @dev Cannot be set under roots
    /// @param parentNode The corresponding vehicle or node
    /// @param label The label specifying the node
    function setNode(bytes32 parentNode, string calldata label) external {
        require(
            records[parentNode].owner == msg.sender &&
                !records[parentNode].root,
            "Invalid request"
        );

        bytes32 node = _verifyNewNode(parentNode, label);

        records[node].owner = msg.sender;
    }

    //***** PRIVATE FUNCTIONS *****//

    /// @dev Internal function to mint a root
    /// @param label The label specifying the root
    /// @param _owner The address of the new owner
    function _mintRoot(string memory label, address _owner) private {
        bytes32 root = _verifyNewNode(0x0, label);

        records[root].owner = _owner;
        records[root].root = true;
        controllers[_owner].rootMinted = true;

        _internalMint(_owner);
    }

    /// @dev Calculates and verifies if the new node already exists
    /// @param parentNode The corresponding parent node
    /// @param label The label specifying the node
    /// @return The new hashed node
    function _verifyNewNode(bytes32 parentNode, string memory label)
        private
        view
        returns (bytes32)
    {
        bytes32 newNode = keccak256(
            abi.encodePacked(parentNode, keccak256(abi.encodePacked(label)))
        );

        require(records[newNode].owner == address(0), "Node already exists");

        return newNode;
    }

    /// @dev Mints a token and increments token ID counter
    /// @param _owner The owner of the minted token
    function _internalMint(address _owner) private {
        _safeMint(_owner, _tokenIds.current());
        _tokenIds.increment();
    }
}
