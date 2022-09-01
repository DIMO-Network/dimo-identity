//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../access/AccessControlInternal.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../AMLicenseValidator/AMLicenseValidatorInternal.sol";
import "../shared/IEvents.sol";
import "../shared/Roles.sol";
import "../../libraries/DIMOStorage.sol";
import "../../libraries/ResolverStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/AftermarketDeviceStorage.sol";
import "../../libraries/ResolverStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";

contract AftermarketDevice is
    ERC721MetadataInternal,
    IEvents,
    AccessControlInternal,
    AMLicenseValidatorInternal
{
    bytes32 private constant CLAIM_TYPEHASH =
        keccak256(
            "ClaimAftermarketDeviceSign(uint256 aftermarketDeviceNode,address _owner)"
        );
    bytes32 private constant PAIR_TYPEHASH =
        keccak256(
            "PairAftermarketDeviceSign(uint256 aftermarketDeviceNode,uint256 vehicleNode,address _owner)"
        );

    event AftermarketDeviceClaimed(
        uint256 indexed aftermarketDeviceNode,
        address indexed _owner
    );
    event AftermarketDevicePaired(
        uint256 indexed aftermarketDeviceNode,
        uint256 indexed vehicleNode,
        address indexed _owner
    );

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

    /// @notice Claims the ownership of an aftermarket device through a metatransaction
    /// The aftermarket device owner signs a typed structured (EIP-712) message in advance and submits to be verified
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNode Aftermarket device node id
    /// @param _owner The address of the new owner
    /// @param signature User's signature hash
    function claimAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        address _owner,
        bytes calldata signature
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();

        require(
            ds.nodes[aftermarketDeviceNode].nodeType ==
                AftermarketDeviceStorage.getStorage().nodeType,
            "Invalid aftermarket device node"
        );

        bytes32 message = keccak256(
            abi.encode(CLAIM_TYPEHASH, aftermarketDeviceNode, _owner)
        );

        require(
            Eip712CheckerInternal._verifySignature(_owner, message, signature),
            "Invalid signature"
        );

        _safeTransfer(
            _ownerOf(aftermarketDeviceNode),
            _owner,
            aftermarketDeviceNode,
            ""
        );

        emit AftermarketDeviceClaimed(aftermarketDeviceNode, _owner);
    }

    /// @notice Pairs an aftermarket device with a vehicle through a metatransaction
    /// The aftermarket device owner signs a typed structured (EIP-712) message in advance and submits to be verified
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNode Aftermarket device node id
    /// @param vehicleNode Vehicle node id
    /// @param _owner The address of the new owner
    /// @param signature User's signature hash
    function pairAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        address _owner,
        bytes calldata signature
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();

        require(
            ds.nodes[aftermarketDeviceNode].nodeType ==
                AftermarketDeviceStorage.getStorage().nodeType,
            "Invalid aftermarket device node"
        );
        require(
            ds.nodes[vehicleNode].nodeType ==
                VehicleStorage.getStorage().nodeType,
            "Invalid vehicle node"
        );
        require(_ownerOf(vehicleNode) == _owner, "Invalid vehicleNode owner");

        bytes32 message = keccak256(
            abi.encode(
                PAIR_TYPEHASH,
                aftermarketDeviceNode,
                vehicleNode,
                _owner
            )
        );

        require(
            Eip712CheckerInternal._verifySignature(_owner, message, signature),
            "Invalid signature"
        );

        ResolverStorage.getStorage().childs[
            vehicleNode
        ] = aftermarketDeviceNode;

        emit AftermarketDevicePaired(
            aftermarketDeviceNode,
            vehicleNode,
            _owner
        );
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
