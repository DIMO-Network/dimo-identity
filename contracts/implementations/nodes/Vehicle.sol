//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../access/AccessControlInternal.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../shared/IEvents.sol";
import "../../libraries/DIMOStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";

contract Vehicle is ERC721MetadataInternal, IEvents, AccessControlInternal {
    bytes32 private constant MINT_TYPEHASH =
        keccak256(
            "MintVehicleSign(uint256 manufacturerNode,address _owner,string[] attributes,string[] infos)"
        );

    // ***** Admin management ***** //

    /// @notice Sets contract node type
    /// @dev Only an admin can set the node type
    /// @dev The node type can only be set once
    /// @param label The label of the node type
    function setVehicleNodeType(bytes calldata label)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        require(s.nodeType == 0, "Node type already set");

        s.nodeType = uint256(keccak256(label));
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addVehicleAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        AttributeSet.add(s.whitelistedAttributes, attribute);

        emit AttributeAdded(s.nodeType, attribute);
    }

    // ***** Interaction with nodes *****//

    /// @notice Mints a vehicle
    /// @dev Caller must be an admin
    /// @param manufacturerNode Parent manufacturer node
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintVehicle(
        uint256 manufacturerNode,
        address _owner,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        ManufacturerStorage.Storage storage ms = ManufacturerStorage
            .getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        require(
            ds.nodes[manufacturerNode].nodeType == ms.nodeType,
            "Invalid parent node"
        );

        uint256 newNodeId = ++ds.currentIndex;
        uint256 nodeType = vs.nodeType;

        ds.nodes[newNodeId].parentNode = manufacturerNode;
        ds.nodes[newNodeId].nodeType = nodeType;

        _safeMint(_owner, newNodeId);
        _setInfo(newNodeId, attributes, infos);

        emit NodeMinted(nodeType, newNodeId);
    }

    /// @notice Mints a vehicle through a metatransaction
    /// The vehicle owner signs a typed structured (EIP-712) message in advance and submits to be verified
    /// @dev Caller must be an admin
    /// @param manufacturerNode Parent manufacturer node
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    /// @param signature User's signature hash
    function mintVehicleSign(
        uint256 manufacturerNode,
        address _owner,
        string[] calldata attributes,
        string[] calldata infos,
        bytes calldata signature
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        require(
            ds.nodes[manufacturerNode].nodeType ==
                ManufacturerStorage.getStorage().nodeType,
            "Invalid parent node"
        );

        uint256 newNodeId = ++ds.currentIndex;

        ds.nodes[newNodeId].parentNode = manufacturerNode;
        ds.nodes[newNodeId].nodeType = vs.nodeType;

        (bytes32 attributesHash, bytes32 infosHash) = _setInfoHash(
            newNodeId,
            attributes,
            infos
        );

        bytes32 message = keccak256(
            abi.encode(
                MINT_TYPEHASH,
                manufacturerNode,
                _owner,
                attributesHash,
                infosHash
            )
        );

        require(
            Eip712CheckerInternal._verifySignature(_owner, message, signature),
            "Invalid signature"
        );

        _safeMint(_owner, newNodeId);

        emit NodeMinted(vs.nodeType, newNodeId);
    }

    /// @notice Add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setVehicleInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        require(
            ds.nodes[nodeId].nodeType == s.nodeType,
            "Node must be a vehicle"
        );

        _setInfo(nodeId, attributes, infos);
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /// @dev Internal function to add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function _setInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) private {
        require(attributes.length == infos.length, "Same length");

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                AttributeSet.exists(s.whitelistedAttributes, attributes[i]),
                "Not whitelisted"
            );
            ds.nodes[nodeId].info[attributes[i]] = infos[i];
        }
    }

    /// @dev Internal function to add infos to node and calculate attribute and info hashes
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    /// @return keccak256 of the list of attributes and infos
    function _setInfoHash(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) private returns (bytes32, bytes32) {
        require(attributes.length == infos.length, "Same length");

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();

        bytes32[] memory attributeHashes = new bytes32[](attributes.length);
        bytes32[] memory infoHashes = new bytes32[](attributes.length);

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                AttributeSet.exists(s.whitelistedAttributes, attributes[i]),
                "Not whitelisted"
            );

            attributeHashes[i] = keccak256(bytes(attributes[i]));
            infoHashes[i] = keccak256(bytes(infos[i]));

            ds.nodes[nodeId].info[attributes[i]] = infos[i];
        }

        return (
            keccak256(abi.encodePacked(attributeHashes)),
            keccak256(abi.encodePacked(infoHashes))
        );
    }
}
