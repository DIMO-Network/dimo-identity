//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../access/AccessControlInternal.sol";
import "../shared/IEvents.sol";
import "../../libraries/DIMOStorage.sol";
import "../../libraries/nodes/RootStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";

contract Root is ERC721MetadataInternal, IEvents, AccessControlInternal {
    event ControllerSet(address indexed controller);

    // ***** Admin management ***** //

    /// @notice Sets contract node type
    /// @dev Only an admin can set the node type
    /// @dev The node type can only be set once
    /// @param label The label of the node type
    function setRootNodeType(bytes calldata label)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(s.nodeType == 0, "Node type already set");

        s.nodeType = uint256(keccak256(label));
    }

    /// @notice Adds an attribute to the whitelist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addRootAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        RootStorage.Storage storage s = RootStorage.getStorage();
        bool success = AttributeSet.add(s.whitelistedAttributes, attribute);

        require(success, "Attribute already exists");

        emit AttributeAdded(s.nodeType, attribute);
    }

    /// @notice Sets a address controller
    /// @dev Only an admin can set new controllers
    /// @param _controller The address of the controller
    function setController(address _controller)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(
            !s.controllers[_controller].isController,
            "Already a controller"
        );

        s.controllers[_controller].isController = true;

        emit ControllerSet(_controller);
    }

    // ***** Interaction with nodes ***** //

    /// @notice Mints roots in batch
    /// @dev Caller must be an admin
    /// @dev It is assumed the 'name' attribute is whitelisted in advance
    /// @param _owner The address of the new owner
    /// @param names List of root names
    function mintRootBatch(address _owner, string[] calldata names)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_hasRole(DEFAULT_ADMIN_ROLE, _owner), "Owner must be an admin");

        RootStorage.Storage storage s = RootStorage.getStorage();
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        uint256 nodeType = s.nodeType;
        uint256 newNodeId;

        for (uint256 i = 0; i < names.length; i++) {
            ds.currentIndex++;
            newNodeId = ds.currentIndex;

            _safeMint(_owner, newNodeId);

            ds.nodes[newNodeId].nodeType = nodeType;
            ds.nodes[newNodeId].info["Name"] = names[i];

            emit NodeMinted(nodeType, newNodeId);
        }
    }

    /// @notice Mints a root
    /// @dev Caller must be an admin
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintRoot(
        address _owner,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(!s.controllers[_owner].rootMinted, "Invalid request");
        s.controllers[_owner].isController = true;

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        ds.currentIndex++;
        uint256 newNodeId = ds.currentIndex;
        uint256 nodeType = s.nodeType;

        _safeMint(_owner, newNodeId);

        s.controllers[_owner].rootMinted = true;
        ds.nodes[newNodeId].nodeType = nodeType;

        _setInfo(newNodeId, attributes, infos);

        emit NodeMinted(nodeType, newNodeId);
    }

    /// @notice Add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node id where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setRootInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(ds.nodes[nodeId].nodeType == s.nodeType, "Node must be a root");

        _setInfo(nodeId, attributes, infos);
    }

    /// @notice Verify if an address is a controller
    /// @param addr the address to be verified
    function isController(address addr)
        external
        view
        returns (bool _isController)
    {
        _isController = RootStorage.getStorage().controllers[addr].isController;
    }

    /// @notice Verify if an address has minted a root
    /// @param addr the address to be verified
    function isRootMinted(address addr)
        external
        view
        returns (bool _isRootMinted)
    {
        _isRootMinted = RootStorage.getStorage().controllers[addr].rootMinted;
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /// @dev Internal function to add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node id where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function _setInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) private {
        require(attributes.length == infos.length, "Same length");

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        RootStorage.Storage storage s = RootStorage.getStorage();

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                AttributeSet.exists(s.whitelistedAttributes, attributes[i]),
                "Not whitelisted"
            );
            ds.nodes[nodeId].info[attributes[i]] = infos[i];
        }
    }
}
