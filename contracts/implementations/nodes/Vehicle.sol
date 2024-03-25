//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./VehicleInternal.sol";
import "../../nonces/NoncesInternal.sol";
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
contract Vehicle is AccessControlInternal, VehicleInternal, NoncesInternal {
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
     * @notice Public funtion to mint a vehicle with a Device Definition Id
     * @param manufacturerNode Parent manufacturer node id
     * @param owner The address of the new owner
     * @param deviceDefinitionId The Device Definition Id
     */
    function mintVehicleWithDeviceDefinition(
        uint256 manufacturerNode,
        address owner,
        string calldata deviceDefinitionId
    ) external {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        address vehicleIdProxyAddress = vs.idProxyAddress;

        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                manufacturerNode
            )
        ) revert InvalidParentNode(manufacturerNode);

        uint256 newTokenId = INFT(vehicleIdProxyAddress).safeMint(owner);

        ns
        .nodes[vehicleIdProxyAddress][newTokenId].parentNode = manufacturerNode;
        // TODO Maybe just set it after verifying the DD
        vs.vehicleIdToDeviceDefinitionId[newTokenId] = deviceDefinitionId;

        emit VehicleNodeMintedWithDeviceDefinition(
            manufacturerNode,
            newTokenId,
            owner,
            deviceDefinitionId
        );
    }

    /**
     * @notice Mint a vehicle with a Device Definition Id through a metatransaction
     * @dev Caller must have the minter role
     * @param manufacturerNode Parent manufacturer node id
     * @param owner The address of the new owner
     * @param deviceDefinitionId The Device Definition Id
     * @param signature User's signature hash
     */
    function mintVehicleWithDeviceDefinitionSign(
        uint256 manufacturerNode,
        address owner,
        string calldata deviceDefinitionId,
        bytes calldata signature
    ) external onlyRole(MINT_VEHICLE_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        address vehicleIdProxyAddress = vs.idProxyAddress;

        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                manufacturerNode
            )
        ) revert InvalidParentNode(manufacturerNode);

        bytes32 message = keccak256(
            abi.encode(
                MINT_VEHICLE_WITH_DD_TYPEHASH,
                manufacturerNode,
                owner,
                keccak256(bytes(deviceDefinitionId))
            )
        );

        if (!Eip712CheckerInternal._verifySignature(owner, message, signature))
            revert InvalidOwnerSignature();

        uint256 newTokenId = INFT(vehicleIdProxyAddress).safeMint(owner);

        ns
        .nodes[vehicleIdProxyAddress][newTokenId].parentNode = manufacturerNode;
        // TODO Maybe just set it after verifying the DD
        vs.vehicleIdToDeviceDefinitionId[newTokenId] = deviceDefinitionId;

        emit VehicleNodeMintedWithDeviceDefinition(
            manufacturerNode,
            newTokenId,
            owner,
            deviceDefinitionId
        );
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

    /// TODO Documentation
    function openMintVehicleSign(
        uint256 manufacturerNode,
        AttributeInfoPair[] calldata attrInfo,
        uint256 nonce,
        bytes calldata signature
    ) external {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;

        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                manufacturerNode
            )
        ) revert InvalidParentNode(manufacturerNode);

        uint256 newTokenId = INFT(vehicleIdProxyAddress).safeMint(msg.sender);

        emit VehicleNodeMinted(manufacturerNode, newTokenId, msg.sender);

        ns
        .nodes[vehicleIdProxyAddress][newTokenId].parentNode = manufacturerNode;

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenId,
            attrInfo
        );

        bytes32 message = keccak256(
            abi.encode(
                OPEN_MINT_VEHICLE_TYPEHASH,
                manufacturerNode,
                attributesHash,
                infosHash,
                _useCheckedNonce(OPEN_MINT_VEHICLE_TYPEHASH, msg.sender, nonce)
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                msg.sender,
                message,
                signature
            )
        ) revert InvalidOwnerSignature();
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
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
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
        delete vs.vehicleIdToDeviceDefinitionId[tokenId];

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
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
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
        delete vs.vehicleIdToDeviceDefinitionId[tokenId];

        _resetInfos(tokenId);

        emit VehicleNodeBurned(tokenId, owner);
    }

    /**
     * @notice Gets the Device Definition Id associated to a Vehicle Id
     * @dev If there is no ddId associated, it returns an empty string
     * @param vehicleId Vehicle Id
     */
    function getDeviceDefinitionIdByVehicleId(
        uint256 vehicleId
    ) external view returns (string memory ddId) {
        ddId = VehicleStorage.getStorage().vehicleIdToDeviceDefinitionId[
            vehicleId
        ];
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
