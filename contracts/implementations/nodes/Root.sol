//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../shared/Events.sol";
import "../shared/Modifiers.sol";
import "../../libraries/DIMOStorage.sol";
import "../../libraries/nodes/RootStorage.sol";
import "@solidstate/contracts/token/ERC721/base/ERC721BaseInternal.sol";

contract Root is ERC721BaseInternal, Events, Modifiers {
    event ControllerSet(address indexed controller);

    // ***** Admin management ***** //

    /// @notice Sets contract node type
    /// @dev Only an admin can set the node type
    /// @dev The node type can only be set once
    /// @param label The label of the node type
    function setRootNodeType(bytes calldata label) external onlyAdmin {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(s.nodeType == 0, "Node type already set");

        s.nodeType = uint256(keccak256(label));
    }

    /// @notice Adds an attribute to the whitelist
    /// @dev Only an admin can set new controllers
    /// @param attribute The attribute to be added
    function addRootAttribute(string calldata attribute) external onlyAdmin {
        RootStorage.Storage storage s = RootStorage.getStorage();
        bool success = AttributeSet.add(s.whitelistedAttributes, attribute);

        require(success, "Attribute already exists");

        emit AttributeAdded(s.nodeType, attribute);
    }

    /// @notice Sets a address controller
    /// @dev Only an admin can set new controllers
    /// @param _controller The address of the controller
    function setController(address _controller) external onlyAdmin {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(
            !s.controllers[_controller].isController,
            "Already a controller"
        );

        s.controllers[_controller].isController = true;

        emit ControllerSet(_controller);
    }

    // ***** Interaction with nodes ***** //

    /// @notice Mints a root
    /// @dev Caller must be an admin
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintRoot(
        address _owner,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyAdmin {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(!s.controllers[_owner].rootMinted, "Invalid request");
        s.controllers[_owner].isController = true;

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        ds.currentIndex++;
        uint256 newNodeId = ds.currentIndex;

        _safeMint(_owner, newNodeId);

        s.controllers[_owner].rootMinted = true;
        ds.nodes[newNodeId].nodeType = s.nodeType;

        _setInfo(newNodeId, attributes, infos);

        emit NodeMinted(s.nodeType, newNodeId);
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
    ) external onlyAdmin {
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
