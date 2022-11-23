//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";

import {DEFAULT_ADMIN_ROLE} from "../../shared/Roles.sol";
import {AttributeInfoPair} from "../../shared/Types.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title Vehicle
/// @notice Contract that represents the Vehicle node
contract Vehicle is AccessControlInternal {
    bytes32 private constant MINT_TYPEHASH =
        keccak256(
            "MintVehicleSign(uint256 manufacturerNode,address owner,string[] attributes,string[] infos)"
        );

    event VehicleIdProxySet(address indexed proxy);
    event VehicleAttributeAdded(string attribute);
    event VehicleAttributeSet(uint256 tokenId, string attribute, string info);
    event VehicleNodeMinted(uint256 tokenId, address owner);

    // ***** Admin management ***** //

    /// @notice Sets the NFT proxy associated with the Vehicle node
    /// @dev Only an admin can set the address
    /// @param addr The address of the proxy
    function setVehicleIdProxyAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        VehicleStorage.getStorage().idProxyAddress = addr;

        emit VehicleIdProxySet(addr);
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addVehicleAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
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
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;

        require(
            INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                manufacturerNode
            ),
            "Invalid parent node"
        );

        uint256 newTokenId = INFT(vehicleIdProxyAddress).safeMint(owner);

        NodesStorage
        .getStorage()
        .nodes[vehicleIdProxyAddress][newTokenId].parentNode = manufacturerNode;

        _setInfos(newTokenId, attrInfo);

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
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;

        require(
            INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                manufacturerNode
            ),
            "Invalid parent node"
        );

        uint256 newTokenId = INFT(vehicleIdProxyAddress).safeMint(owner);

        ns
        .nodes[vehicleIdProxyAddress][newTokenId].parentNode = manufacturerNode;

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
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
    /// @dev attributes must be whitelisted
    /// @dev Caller must have the admin role
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function setVehicleInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            INFT(VehicleStorage.getStorage().idProxyAddress).exists(tokenId),
            "Invalid vehicle node"
        );
        _setInfos(tokenId, attrInfo);
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /// @dev Internal function to add infos to node
    /// @dev attributes must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function _setInfos(uint256 tokenId, AttributeInfoPair[] calldata attrInfo)
        private
    {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        address idProxyAddress = s.idProxyAddress;

        for (uint256 i = 0; i < attrInfo.length; i++) {
            require(
                AttributeSet.exists(
                    s.whitelistedAttributes,
                    attrInfo[i].attribute
                ),
                "Not whitelisted"
            );
            ns.nodes[idProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;

            emit VehicleAttributeSet(
                tokenId,
                attrInfo[i].attribute,
                attrInfo[i].info
            );
        }
    }

    /// @dev Internal function to add infos to node and calculate attribute and info hashes
    /// @dev attributes must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    /// @return keccak256 of the list of attributes and infos
    function _setInfosHash(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) private returns (bytes32, bytes32) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        address idProxyAddress = s.idProxyAddress;

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

            ns.nodes[idProxyAddress][tokenId].info[
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

    /// @dev Internal function to update a single attribute
    /// @dev attribute must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attribute Attribute to be updated
    /// @param info Info to be set
    function _setAttributeInfo(
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

        address idProxyAddress = s.idProxyAddress;

        ns.nodes[idProxyAddress][tokenId].info[attribute] = info;

        emit VehicleAttributeSet(tokenId, attribute, info);
    }
}
