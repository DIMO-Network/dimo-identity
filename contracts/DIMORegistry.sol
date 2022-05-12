//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

// import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

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

    // Metadata Stuff
    string private _baseURIextended;
    string private _contractMetadataURI;
    mapping(uint256 => string) private _tokenURIs;
    // End Metadata Stuff

    mapping(uint256 => Record) public records; // [Node id] => Node info
    mapping(address => Controller) public controllers; // [Controller address] => is controller, has minted root

    constructor() ERC721("DIMO Node", "DN") {
        controllers[msg.sender].isController = true;
    }

    //***** Owner management *****//

    /// @notice Sets contract metadata URI
    /// @dev Only the owner can set the contract metadata URI
    /// @param contractURI_ The base URI to be set
    function setContractMetadataURI(string memory contractURI_)
        external
        onlyOwner
    {
        _contractMetadataURI = contractURI_;
    }

    /// @notice Sets base token URI
    /// @dev Only the owner can set the base token URI
    /// @param baseURI_ The base URI to be set
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIextended = baseURI_;
    }

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
        controllers[_owner].isController = true;

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

    /// @notice Mints a device
    /// @dev Device owner will be msg.sender
    /// @dev Parent node must exist and must be a root
    /// @param parentNode The corresponding root
    /// @param label The label specifying the device
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintDevice(
        uint256 parentNode,
        string calldata label,
        bytes32[] calldata attributes,
        string[] calldata infos,
        string memory tokenURI_
    ) external {
        require(records[parentNode].root, "Invalid node");

        uint256 node = _verifyNewNode(parentNode, label);

        records[node].originNode = node;

        _safeMint(msg.sender, node);
        _setInfo(node, attributes, infos);
        _setTokenURI(node, tokenURI_);
    }

    /// @notice Sets a node under a device or other node
    /// @dev Caller must be parent node owner
    /// @dev Cannot be set under roots
    /// @param parentNode The corresponding device or node
    /// @param label The label specifying the node
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setNode(
        uint256 parentNode,
        string calldata label,
        bytes32[] calldata attributes,
        string[] calldata infos
    ) external {
        require(
            ownerOf(records[parentNode].originNode) == msg.sender &&
                !records[parentNode].root,
            "Invalid node"
        );

        uint256 node = _verifyNewNode(parentNode, label);

        records[node].originNode = records[parentNode].originNode;
        _setInfo(node, attributes, infos);
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
        _setInfo(node, attributes, infos);
    }

    /// @notice Gets information stored in an attribute of a given node
    /// @dev Returns empty string if does or attribute does not exists
    /// @param node Node from which info will be obtained
    /// @param attribute Key attribute
    /// @return info Info obtained
    function getInfo(uint256 node, bytes32 attribute)
        external
        view
        returns (string memory info)
    {
        info = records[node].info[attribute];
    }

    /// @dev Public function to get NFT metadata URL
    /// @param node Which node to get the URL from
    function tokenURI(uint256 node)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(node), "NFT does not exist");

        string memory _tokenURI = _tokenURIs[node];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, node));
    }

    /// @dev Public function to get contract metadata URL
    function contractURI() public view returns (string memory) {
        return _contractMetadataURI;
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

    /// @dev Internal function to set NFT token URI
    /// @dev Only node owner can call this function
    /// @param node Node where the info will be added
    /// @param _tokenURI String to use as token URI
    function _setTokenURI(uint256 node, string memory _tokenURI)
        internal
        virtual
    {
        require(_exists(node), "NFT does not exist");
        require(
            ownerOf(records[node].originNode) == msg.sender,
            "Only node owner"
        );
        _tokenURIs[node] = _tokenURI;
    }

    /// @dev Internal function to get baseURI for metadata
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
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

    /// @dev Internal function to add infos to node
    /// @dev Only node owner can call this function
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param node Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function _setInfo(
        uint256 node,
        bytes32[] calldata attributes,
        string[] calldata infos
    ) private {
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
}
