//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract DIMORegistry is Ownable, ERC721 {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    EnumerableSet.Bytes32Set private _whitelistedAttributes; // Allowed node attributes

    struct Record {
        uint256 originNode;
        bool root;
        mapping(bytes32 => string) info;
    }

    struct Controller {
        bool isController;
        bool rootMinted;
    }

    mapping(uint256 => Record) public records; // [Node id] => Node info
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
        require(!controllers[_owner].rootMinted, "Invalid request");

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
    function mintDevice(uint256 parentNode, string calldata label) external {
        require(records[parentNode].root, "Invalid node");

        uint256 node = _verifyNewNode(parentNode, label);

        records[node].originNode = node;

        _safeMint(msg.sender, uint256(node));
    }

    /// @notice Sets a node under a vehicle or other node
    /// @dev Caller must be parent node owner
    /// @dev Cannot be set under roots
    /// @param parentNode The corresponding vehicle or node
    /// @param label The label specifying the node
    function setNode(uint256 parentNode, string calldata label) external {
        require(
            ownerOf(records[parentNode].originNode) == msg.sender &&
                !records[parentNode].root,
            "Invalid node"
        );

        uint256 node = _verifyNewNode(parentNode, label);

        records[node].originNode = records[parentNode].originNode;
    }

    /// @notice Add infos to node
    /// @dev Only node owner can call this function
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param node Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setInfo(
        uint256 node,
        bytes32[] calldata attributes,
        string[] calldata infos
    ) external {
        require(
            ownerOf(records[node].originNode) == msg.sender,
            "Only node owner"
        );
        require(attributes.length == infos.length, "Same length");

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                _whitelistedAttributes.contains(attributes[i]),
                "Not whitelisted"
            );
            records[node].info[attributes[i]] = infos[i];
        }
    }

    //***** INTERNAL FUNCTIONS *****//

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        if (records[tokenId].root) {
            require(
                controllers[to].isController && !controllers[to].rootMinted,
                "Invalid transfer"
            );
            controllers[from].rootMinted = false;
            controllers[to].rootMinted = true;
        }
    }

    //***** PRIVATE FUNCTIONS *****//

    /// @dev Internal function to mint a root
    /// @param label The label specifying the root
    /// @param _owner The address of the new owner
    function _mintRoot(string memory label, address _owner) private {
        uint256 root = _verifyNewNode(0, label);

        _safeMint(_owner, root);

        records[root].root = true;
        records[root].originNode = root;
        controllers[_owner].rootMinted = true;
    }

    /// @dev Calculates and verifies if the new node already exists
    /// @param parentNode The corresponding parent node
    /// @param label The label specifying the node
    /// @return The new hashed node
    function _verifyNewNode(uint256 parentNode, string memory label)
        private
        view
        returns (uint256)
    {
        uint256 newNode = uint256(
            keccak256(
                abi.encodePacked(parentNode, keccak256(abi.encodePacked(label)))
            )
        );

        require(records[newNode].originNode == 0, "Node already exists");

        return newNode;
    }
}
