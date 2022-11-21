//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";

import {DEFAULT_ADMIN_ROLE} from "../../shared/Roles.sol";
import {AttributeInfoPair} from "../../shared/Types.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

// TODO Documentation
contract Vehicle is AccessControlInternal {
    bytes32 private constant MINT_TYPEHASH =
        keccak256(
            "MintVehicleSign(uint256 manufacturerNode,address owner,string[] attributes,string[] infos)"
        );

    event VehicleNftProxySet(address indexed proxy);
    event VehicleAttributeAdded(string attribute);
    event VehicleAttributeSet(
        uint256 indexed tokenId,
        string indexed attribute,
        string indexed info
    );
    event VehicleNodeMinted(uint256 tokenId, address owner);

    // ***** Admin management ***** //

    // TODO Documentation
    function setVehicleNftProxyAddress(
        address addr
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(addr != address(0), "Non zero address");
        VehicleStorage.getStorage().nftProxyAddress = addr;

        emit VehicleNftProxySet(addr);
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addVehicleAttribute(
        string calldata attribute
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            AttributeSet.add(
                VehicleStorage.getStorage().whitelistedAttributes,
                attribute
            ),
            "Attribute already exists"
        );

        emit VehicleAttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    /// @notice Mints a vehicle
    /// @dev Caller must have the admin role
    /// @param manufacturerNode Parent manufacturer node id
    /// @param owner The address of the new owner
    /// @param attrInfo List of attribute-info pairs to be added
    function mintVehicle(
        uint256 manufacturerNode,
        address owner,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // NodesStorage.Storage storage ns = NodesStorage.getStorage();
        // ManufacturerStorage.Storage storage ms = ManufacturerStorage
        //     .getStorage();
        // VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        address vehicleNftProxyAddress = VehicleStorage
            .getStorage()
            .nftProxyAddress;

        // TODO Check if manufacturerNode is a manufacturer ?
        // require(
        //     ns.nodes[manufacturerNode].nodeType == ms.nodeType,
        //     "Invalid parent node"
        // );

        uint256 newTokenId = INFT(vehicleNftProxyAddress).safeMint(owner);

        NodesStorage
        .getStorage()
        .nodes[vehicleNftProxyAddress][newTokenId]
            .parentNode = manufacturerNode;

        _setInfo(newTokenId, attrInfo);

        emit VehicleNodeMinted(newTokenId, owner);
    }

    /// @notice Mints a vehicle through a metatransaction
    /// The vehicle owner signs a typed structured (EIP-712) message in advance and submits to be verified
    /// @dev Caller must have the admin role
    /// @param manufacturerNode Parent manufacturer node id
    /// @param owner The address of the new owner
    /// @param attrInfo List of attribute-info pairs to be added
    /// @param signature User's signature hash
    function mintVehicleSign(
        uint256 manufacturerNode,
        address owner,
        AttributeInfoPair[] calldata attrInfo,
        bytes calldata signature
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        // VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        address vehicleNftProxyAddress = VehicleStorage
            .getStorage()
            .nftProxyAddress;

        // TODO Check if manufacturerNode is a manufacturer ?
        // require(
        //     ns.nodes[manufacturerNode].nodeType ==
        //         ManufacturerStorage.getStorage().nodeType,
        //     "Invalid parent node"
        // );

        uint256 newTokenId = INFT(vehicleNftProxyAddress).safeMint(owner);

        ns
        .nodes[vehicleNftProxyAddress][newTokenId]
            .parentNode = manufacturerNode;

        (bytes32 attributesHash, bytes32 infosHash) = _setInfoHash(
            newTokenId,
            attrInfo
        );

        bytes32 message = keccak256(
            abi.encode(
                MINT_TYPEHASH,
                manufacturerNode,
                owner,
                attributesHash,
                infosHash
            )
        );

        require(
            Eip712CheckerInternal._verifySignature(owner, message, signature),
            "Invalid signature"
        );

        emit VehicleNodeMinted(newTokenId, owner);
    }

    /// @notice Add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @dev Caller must have the admin role
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function setVehicleInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // TODO Check nft id ?
        _setInfo(tokenId, attrInfo);
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /// @dev Internal function to add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function _setInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        address nftProxyAddress = s.nftProxyAddress;

        for (uint256 i = 0; i < attrInfo.length; i++) {
            require(
                AttributeSet.exists(
                    s.whitelistedAttributes,
                    attrInfo[i].attribute
                ),
                "Not whitelisted"
            );
            ns.nodes[nftProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;
            emit VehicleAttributeSet(
                tokenId,
                attrInfo[i].attribute,
                attrInfo[i].info
            );
        }
    }

    /// @dev Internal function to update a single attribute
    /// @dev attribute must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attribute Attribute to be updated
    /// @param info Info to be set
    function _updateAttributeInfo(
        uint256 tokenId,
        string calldata attribute,
        string calldata info
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();

        require(
            AttributeSet.exists(s.whitelistedAttributes, attribute),
            "Not whitelisted"
        );

        address nftProxyAddress = s.nftProxyAddress;

        ns.nodes[nftProxyAddress][tokenId].info[attribute] = info;

        emit VehicleAttributeSet(tokenId, attribute, info);
    }

    /// @dev Internal function to add infos to node and calculate attribute and info hashes
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    /// @return keccak256 of the list of attributes and infos
    function _setInfoHash(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) private returns (bytes32, bytes32) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        address nftProxyAddress = s.nftProxyAddress;

        bytes32[] memory attributeHashes = new bytes32[](attrInfo.length);
        bytes32[] memory infoHashes = new bytes32[](attrInfo.length);

        for (uint256 i = 0; i < attrInfo.length; i++) {
            require(
                AttributeSet.exists(
                    s.whitelistedAttributes,
                    attrInfo[i].attribute
                ),
                "Not whitelisted"
            );

            attributeHashes[i] = keccak256(bytes(attrInfo[i].attribute));
            infoHashes[i] = keccak256(bytes(attrInfo[i].info));

            ns.nodes[nftProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;

            emit VehicleAttributeSet(
                tokenId,
                attrInfo[i].attribute,
                attrInfo[i].info
            );
        }

        return (
            keccak256(abi.encodePacked(attributeHashes)),
            keccak256(abi.encodePacked(infoHashes))
        );
    }
}
