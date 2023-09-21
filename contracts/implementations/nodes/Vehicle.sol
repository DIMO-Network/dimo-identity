//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./VehicleInternal.sol";
import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/MapperStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/SyntheticDeviceStorage.sol";

import {ADMIN_ROLE, MINT_VEHICLE_ROLE, BURN_VEHICLE_ROLE, SET_VEHICLE_INFO_ROLE} from "../../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title Vehicle
 * @notice Contract that represents the Vehicle node
 */
contract Vehicle is AccessControlInternal, VehicleInternal {
    bytes32 private constant BURN_TYPEHASH =
        keccak256("BurnVehicleSign(uint256 vehicleNode)");

    event VehicleIdProxySet(address indexed proxy);
    event VehicleAttributeAdded(string attribute);
    event VehicleNodeBurned(uint256 indexed vehicleNode, address indexed owner);

    modifier onlyNftProxy() {
        if (msg.sender != VehicleStorage.getStorage().idProxyAddress)
            revert OnlyNftProxy();
        _;
    }

    // ***** Admin management ***** //

    /**
     * @notice Sets the NFT proxy associated with the Vehicle node
     * @dev Only an admin can set the address
     * @param addr The address of the proxy
     */
    function setVehicleIdProxyAddress(
        address addr
    ) external onlyRole(ADMIN_ROLE) {
        if (addr == address(0)) revert ZeroAddress();
        VehicleStorage.getStorage().idProxyAddress = addr;

        emit VehicleIdProxySet(addr);
    }

    /**
     * @notice Adds an attribute to the whielist
     * @dev Only an admin can add a new attribute
     * @param attribute The attribute to be added
     */
    function addVehicleAttribute(
        string calldata attribute
    ) external onlyRole(ADMIN_ROLE) {
        if (
            !AttributeSet.add(
                VehicleStorage.getStorage().whitelistedAttributes,
                attribute
            )
        ) revert AttributeExists(attribute);

        emit VehicleAttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    /**
     * @notice Mints a vehicle
     * @dev Caller must have the admin role
     * @param manufacturerNode Parent manufacturer node id
     * @param owner The address of the new owner
     * @param attrInfo List of attribute-info pairs to be added
     */
    function mintVehicle(
        uint256 manufacturerNode,
        address owner,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(MINT_VEHICLE_ROLE) {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;

        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                manufacturerNode
            )
        ) revert InvalidParentNode(manufacturerNode);

        uint256 newTokenId = INFT(vehicleIdProxyAddress).safeMint(owner);

        NodesStorage
        .getStorage()
        .nodes[vehicleIdProxyAddress][newTokenId].parentNode = manufacturerNode;

        emit VehicleNodeMinted(manufacturerNode, newTokenId, owner);

        if (attrInfo.length > 0) _setInfos(newTokenId, attrInfo);
    }

    /**
     * @notice Mints a vehicle through a metatransaction
     * The vehicle owner signs a typed structured (EIP-712) message in advance and submits to be verified
     * @dev Caller must have the admin role
     * @param manufacturerNode Parent manufacturer node id
     * @param owner The address of the new owner
     * @param attrInfo List of attribute-info pairs to be added
     * @param signature User's signature hash
     */
    function mintVehicleSign(
        uint256 manufacturerNode,
        address owner,
        AttributeInfoPair[] calldata attrInfo,
        bytes calldata signature
    ) external onlyRole(MINT_VEHICLE_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;

        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                manufacturerNode
            )
        ) revert InvalidParentNode(manufacturerNode);

        uint256 newTokenId = INFT(vehicleIdProxyAddress).safeMint(owner);

        emit VehicleNodeMinted(manufacturerNode, newTokenId, owner);

        ns
        .nodes[vehicleIdProxyAddress][newTokenId].parentNode = manufacturerNode;

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenId,
            attrInfo
        );

        bytes32 message = keccak256(
            abi.encode(
                MINT_VEHICLE_TYPEHASH,
                manufacturerNode,
                owner,
                attributesHash,
                infosHash
            )
        );

        if (!Eip712CheckerInternal._verifySignature(owner, message, signature))
            revert InvalidOwnerSignature();
    }

    /**
     * @notice Add infos to node
     * @dev attributes must be whitelisted
     * @dev Caller must have the admin role
     * @param tokenId Node where the info will be added
     * @param attrInfo List of attribute-info pairs to be added
     */
    function setVehicleInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(SET_VEHICLE_INFO_ROLE) {
        address vehicleIdProxy = VehicleStorage.getStorage().idProxyAddress;
        if (!INFT(vehicleIdProxy).exists(tokenId))
            revert InvalidNode(vehicleIdProxy, tokenId);

        _setInfos(tokenId, attrInfo);
    }

    /**
     * @notice Burns a vehicle and reset all its attributes
     * @dev Caller must have the admin role
     * @dev This contract has the BURNER_ROLE in the VehicleId
     * @param tokenId Vehicle node id
     * @param ownerSig Vehicle owner signature hash
     */
    function burnVehicleSign(
        uint256 tokenId,
        bytes calldata ownerSig
    ) external onlyRole(BURN_VEHICLE_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = SyntheticDeviceStorage
            .getStorage()
            .idProxyAddress;

        if (!INFT(vehicleIdProxyAddress).exists(tokenId))
            revert InvalidNode(vehicleIdProxyAddress, tokenId);
        if (ms.links[vehicleIdProxyAddress][tokenId] != 0)
            revert VehiclePaired(tokenId);
        if (ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][tokenId] != 0)
            revert VehiclePaired(tokenId);

        address owner = INFT(vehicleIdProxyAddress).ownerOf(tokenId);
        bytes32 message = keccak256(abi.encode(BURN_TYPEHASH, tokenId));

        if (!Eip712CheckerInternal._verifySignature(owner, message, ownerSig))
            revert InvalidOwnerSignature();

        delete ns.nodes[vehicleIdProxyAddress][tokenId].parentNode;

        emit VehicleNodeBurned(tokenId, owner);

        INFT(vehicleIdProxyAddress).burn(tokenId);

        _resetInfos(tokenId);
    }

    /**
     * @notice Validates burning of a vehicle and reset all its attributes
     * @dev Can only be called by the VehicleId Proxy when a token owner calls the `burn` function
     * @dev The actual burn takes place on the VehicleId contract
     * @param tokenId Vehicle node id
     */
    function validateBurnAndResetNode(uint256 tokenId) external onlyNftProxy {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = SyntheticDeviceStorage
            .getStorage()
            .idProxyAddress;

        if (!INFT(vehicleIdProxyAddress).exists(tokenId))
            revert InvalidNode(vehicleIdProxyAddress, tokenId);
        if (ms.links[vehicleIdProxyAddress][tokenId] != 0)
            revert VehiclePaired(tokenId);
        if (ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][tokenId] != 0)
            revert VehiclePaired(tokenId);

        address owner = INFT(vehicleIdProxyAddress).ownerOf(tokenId);

        delete ns.nodes[vehicleIdProxyAddress][tokenId].parentNode;

        _resetInfos(tokenId);

        emit VehicleNodeBurned(tokenId, owner);
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /**
     * @dev Internal function to add infos to node
     * @dev attributes must be whitelisted
     * @param tokenId Node where the info will be added
     * @param attrInfo List of attribute-info pairs to be added
     */
    function _setInfos(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        address idProxyAddress = s.idProxyAddress;

        for (uint256 i = 0; i < attrInfo.length; i++) {
            if (
                !AttributeSet.exists(
                    s.whitelistedAttributes,
                    attrInfo[i].attribute
                )
            ) revert AttributeNotWhitelisted(attrInfo[i].attribute);

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

    /**
     * @dev Internal function to reset node infos
     * It iterates over all whitelisted attributes to reset each info
     * @param tokenId Node which will have the infos reset
     */
    function _resetInfos(uint256 tokenId) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage sds = VehicleStorage.getStorage();
        address idProxyAddress = sds.idProxyAddress;
        string[] memory attributes = AttributeSet.values(
            sds.whitelistedAttributes
        );

        for (
            uint256 i = 0;
            i < AttributeSet.count(sds.whitelistedAttributes);
            i++
        ) {
            delete ns.nodes[idProxyAddress][tokenId].info[attributes[i]];

            emit VehicleAttributeSet(tokenId, attributes[i], "");
        }
    }
}
