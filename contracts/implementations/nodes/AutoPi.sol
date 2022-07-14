//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../access/AccessControlInternal.sol";
import "../shared/IEvents.sol";
import "../../libraries/DIMOStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/AutoPiStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";

import "hardhat/console.sol";

contract AutoPi is ERC721MetadataInternal, IEvents, AccessControlInternal {
    // ***** Admin management ***** //

    /// @notice Sets contract node type
    /// @dev Only an admin can set the node type
    /// @dev The node type can only be set once
    /// @param label The label of the node type
    function setAutoPiNodeType(bytes calldata label)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AutoPiStorage.Storage storage aps = AutoPiStorage.getStorage();
        require(aps.nodeType == 0, "Node type already set");

        aps.nodeType = uint256(keccak256(label));
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addAutoPiAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AutoPiStorage.Storage storage aps = AutoPiStorage.getStorage();
        AttributeSet.add(aps.whitelistedAttributes, attribute);

        emit AttributeAdded(aps.nodeType, attribute);
    }

    // ***** Interaction with nodes *****//

    // TODO Documentation
    /// @notice Mints an AutoPi
    /// @dev Caller must be an admin
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintAutoPiByManufacturer(
        address _owner,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // TODO onlyRole(MANUFACTURER_ROLE)
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        AutoPiStorage.Storage storage aps = AutoPiStorage.getStorage();

        // TODO require(_hasRole(MANUFACTURER_ROLE, _owner), "Owner must be a manufacturer");

        ds.currentIndex++;
        uint256 newNodeId = ds.currentIndex;
        uint256 nodeType = aps.nodeType;

        ds.nodes[newNodeId].nodeType = nodeType;

        _safeMint(_owner, newNodeId);
        _setInfo(newNodeId, attributes, infos);

        emit NodeMinted(nodeType, newNodeId);
    }

    // TODO Documentation
    function mintAutoPiByManufacturerBatch(
        address _owner,
        string[] calldata attributes,
        string[][] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // TODO onlyRole(MANUFACTURER_ROLE)
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        AutoPiStorage.Storage storage aps = AutoPiStorage.getStorage();

        // TODO require(_hasRole(MANUFACTURER_ROLE, _owner), "Owner must be a manufacturer");

        uint256 newNodeId;
        uint256 nodeType;

        for (uint256 i = 0; i < infos.length; i++) {
            ds.currentIndex++;
            newNodeId = ds.currentIndex;
            nodeType = aps.nodeType;

            ds.nodes[newNodeId].nodeType = nodeType;

            _safeMint(_owner, newNodeId);
            _setInfo(newNodeId, attributes, infos[i]);

            emit NodeMinted(nodeType, newNodeId);
        }
    }

    /// @notice Mints an AutoPi
    /// @dev Caller must be an admin
    /// @param vehicleNode Parent vehicle node
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintAutoPi(
        uint256 vehicleNode,
        address _owner,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        AutoPiStorage.Storage storage aps = AutoPiStorage.getStorage();

        require(
            ds.nodes[vehicleNode].nodeType == vs.nodeType,
            "Invalid parent node"
        );

        ds.currentIndex++;
        uint256 newNodeId = ds.currentIndex;
        uint256 nodeType = aps.nodeType;

        ds.nodes[newNodeId].parentNode = vehicleNode;
        ds.nodes[newNodeId].nodeType = nodeType;

        _safeMint(_owner, newNodeId);
        _setInfo(newNodeId, attributes, infos);

        emit NodeMinted(nodeType, newNodeId);
    }

    // TODO Documentation
    function claimAutoPi(uint256 vehicleNode, uint256 autoPiNode) external {
        // TODO onlyRole or require by vehicle owner ?
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        require(ds.nodes[autoPiNode].parentNode == 0, "AutoPi already claimed");
        require(
            ds.nodes[vehicleNode].nodeType == vs.nodeType,
            "Invalid parent node"
        );

        ds.nodes[autoPiNode].parentNode = vehicleNode;

        _transfer(_ownerOf(autoPiNode), _ownerOf(vehicleNode), autoPiNode);
    }

    /// @notice Add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node id where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setAutoPiInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        AutoPiStorage.Storage storage s = AutoPiStorage.getStorage();
        require(
            ds.nodes[nodeId].nodeType == s.nodeType,
            "Node must be an AutoPi"
        );

        _setInfo(nodeId, attributes, infos);
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /// @dev Internal function to add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param node Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function _setInfo(
        uint256 node,
        string[] calldata attributes,
        string[] calldata infos
    ) private {
        require(attributes.length == infos.length, "Same length");

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        AutoPiStorage.Storage storage aps = AutoPiStorage.getStorage();

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                AttributeSet.exists(aps.whitelistedAttributes, attributes[i]),
                "Not whitelisted"
            );
            ds.nodes[node].info[attributes[i]] = infos[i];
        }
    }
}
