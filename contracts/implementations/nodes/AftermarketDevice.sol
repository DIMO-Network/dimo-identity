//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../access/AccessControlInternal.sol";
import "../AMLicenseValidator/AMLicenseValidatorInternal.sol";
import "../shared/IEvents.sol";
import "../shared/Roles.sol";
import "../../libraries/DIMOStorage.sol";
import "../../libraries/ResolverStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/AftermarketDeviceStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";

contract AftermarketDevice is
    ERC721MetadataInternal,
    IEvents,
    AccessControlInternal,
    AMLicenseValidatorInternal
{
    // ***** Admin management ***** //

    /// @notice Sets contract node type
    /// @dev Only an admin can set the node type
    /// @dev The node type can only be set once
    /// @param label The label of the node type
    function setAftermarketDeviceNodeType(bytes calldata label)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        require(ads.nodeType == 0, "Node type already set");

        ads.nodeType = uint256(keccak256(label));
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addAftermarketDeviceAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        AttributeSet.add(ads.whitelistedAttributes, attribute);

        emit AttributeAdded(ads.nodeType, attribute);
    }

    // ***** Interaction with nodes *****//

    /// @notice Mints aftermarket devices in batch
    /// @dev Caller must have the manufacturer role
    /// @dev The number of devices is defined by the size of 'infos'
    /// @param manufacturerNode Parent manufacturer node
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintAftermarketDeviceByManufacturerBatch(
        uint256 manufacturerNode,
        string[] calldata attributes,
        string[][] calldata infos
    ) external onlyRole(Roles.MANUFACTURER_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        ManufacturerStorage.Storage storage ms = ManufacturerStorage
            .getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();

        require(
            ds.nodes[manufacturerNode].nodeType == ms.nodeType,
            "Invalid parent node"
        );
        require(attributes.length == infos.length, "Same length");
        _validateMintRequest(msg.sender, infos.length);

        uint256 newNodeId;
        uint256 nodeType;

        for (uint256 i = 0; i < infos.length; i++) {
            newNodeId = ++ds.currentIndex;
            nodeType = ads.nodeType;

            ds.nodes[newNodeId].parentNode = manufacturerNode;
            ds.nodes[newNodeId].nodeType = nodeType;

            _safeMint(msg.sender, newNodeId);
            _setInfo(newNodeId, attributes, infos[i]);

            emit NodeMinted(nodeType, newNodeId);
        }
    }

    /// @notice Add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node id where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setAftermarketDeviceInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        AftermarketDeviceStorage.Storage storage s = AftermarketDeviceStorage
            .getStorage();
        require(
            ds.nodes[nodeId].nodeType == s.nodeType,
            "Node must be an Aftermarket Device"
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
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                AttributeSet.exists(ads.whitelistedAttributes, attributes[i]),
                "Not whitelisted"
            );
            ds.nodes[node].info[attributes[i]] = infos[i];
        }
    }
}
