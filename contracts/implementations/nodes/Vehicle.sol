//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./VehicleInternal.sol";
import "../charging/ChargingInternal.sol";
import "../storageNode/StorageNodeRegistryInternal.sol";
import "../../interfaces/INFT.sol";
import "../../interfaces/IStorageNode.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/MapperStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/SyntheticDeviceStorage.sol";

import {MINT_VEHICLE_OPERATION} from "../../shared/Operations.sol";
import {ADMIN_ROLE, MINT_VEHICLE_ROLE, BURN_VEHICLE_ROLE} from "../../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title Vehicle
 * @notice Contract that represents the Vehicle node
 */
contract Vehicle is
    AccessControlInternal,
    VehicleInternal,
    StorageNodeRegistryInternal
{
    bytes32 private constant BURN_TYPEHASH =
        keccak256("BurnVehicleSign(uint256 vehicleNode)");

    event VehicleIdProxySet(address indexed proxy);
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

    // ***** Interaction with nodes *****//

    /**
     * @notice Mints a vehicle
     * @dev Device definitions and vehicle attributes are tracked off-chain via per-vehicle documents
     * @param manufacturerNode Parent manufacturer node id
     * @param owner The address of the new owner
     */
    function mintVehicle(uint256 manufacturerNode, address owner) external {
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

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
    }

    /**
     * @notice Mints a vehicle and associates it with a Storage Node Id
     * @dev Device definitions and vehicle attributes are tracked off-chain via per-vehicle documents
     * @param manufacturerNode The ID of the parent manufacturer node
     * @param owner The address that will own the newly minted vehicle
     * @param storageNodeId The ID of the storage node to associate with this vehicle
     */
    function mintVehicle(
        uint256 manufacturerNode,
        address owner,
        uint256 storageNodeId
    ) external {
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

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
        _setStorageNodeIdForVehicleId(newTokenId, storageNodeId);
    }

    /**
     * @notice Mints a vehicle and sets permissions with SACD
     * @dev Device definitions and vehicle attributes are tracked off-chain via per-vehicle documents
     * @param manufacturerNode Parent manufacturer node id
     * @param owner The address of the new owner
     * @param sacdInput SACD input args
     *  grantee -> The address to receive the permissions
     *  permissions -> The uint256 that represents the byte array of permissions
     *  expiration -> Expiration of the permissions
     *  source -> The URI source associated with the permissions
     */
    function mintVehicle(
        uint256 manufacturerNode,
        address owner,
        SacdInput calldata sacdInput
    ) external {
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

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);

        INFT(vehicleIdProxyAddress).setSacd(newTokenId, sacdInput);
    }

    /**
     * @notice Mints a vehicle, associates it with a Storage Node Id, and sets permissions with SACD
     * @dev Device definitions and vehicle attributes are tracked off-chain via per-vehicle documents
     * @param manufacturerNode The ID of the parent manufacturer node
     * @param owner The address that will own the newly minted vehicle
     * @param storageNodeId The ID of the storage node to associate with this vehicle
     * @param sacdInput SACD input args containing:
     *        - grantee: The address to receive the permissions
     *        - permissions: The uint256 that represents the byte array of permissions
     *        - expiration: Expiration of the permissions
     *        - source: The URI source associated with the permissions
     */
    function mintVehicle(
        uint256 manufacturerNode,
        address owner,
        uint256 storageNodeId,
        SacdInput calldata sacdInput
    ) external {
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

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);

        INFT(vehicleIdProxyAddress).setSacd(newTokenId, sacdInput);
        _setStorageNodeIdForVehicleId(newTokenId, storageNodeId);
    }

    /**
     * @notice Mint a vehicle through a metatransaction
     * @dev Device definitions and vehicle attributes are tracked off-chain via per-vehicle documents
     * @dev Caller must have the mint vehicle role
     * @param manufacturerNode Parent manufacturer node id
     * @param owner The address of the new owner
     * @param signature User's signature hash
     */
    function mintVehicleSign(
        uint256 manufacturerNode,
        address owner,
        bytes calldata signature
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

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_TYPEHASH, manufacturerNode, owner)
        );

        if (!Eip712CheckerInternal._verifySignature(owner, message, signature))
            revert InvalidOwnerSignature();

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
    }

    /**
     * @notice Mints a vehicle through a metatransaction and associates it with a Storage Node Id
     * @dev Device definitions and vehicle attributes are tracked off-chain via per-vehicle documents
     * @dev Caller must have the MINT_VEHICLE_ROLE
     * @param manufacturerNode The ID of the parent manufacturer node
     * @param owner The address that will own the newly minted vehicle
     * @param storageNodeId The ID of the storage node to associate with this vehicle
     * @param signature The owner's EIP-712 signature authorizing the mint operation
     */
    function mintVehicleSign(
        uint256 manufacturerNode,
        address owner,
        uint256 storageNodeId,
        bytes calldata signature
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

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_TYPEHASH, manufacturerNode, owner)
        );

        if (!Eip712CheckerInternal._verifySignature(owner, message, signature))
            revert InvalidOwnerSignature();

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
        _setStorageNodeIdForVehicleId(newTokenId, storageNodeId);
    }

    /**
     * @notice Burns a vehicle
     * @dev Caller must have the burn vehicle role
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
        delete vs._deprecated_vehicleIdToDeviceDefinitionId[tokenId];

        emit VehicleNodeBurned(tokenId, owner);

        INFT(vehicleIdProxyAddress).burn(tokenId);
    }

    /**
     * @notice Validates burning of a vehicle
     * @dev Can only be called by the VehicleId Proxy when a token owner calls the `burn` function
     * @dev The actual burn takes place on the VehicleId contract
     * @param tokenId Vehicle node id
     */
    function validateBurnAndResetNode(uint256 tokenId) external onlyNftProxy {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        StorageNodeRegistryStorage.Storage
            storage sn = StorageNodeRegistryStorage.getStorage();

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
        delete vs._deprecated_vehicleIdToDeviceDefinitionId[tokenId];
        delete sn.vehicleIdToStorageNodeId[tokenId];

        emit VehicleNodeBurned(tokenId, owner);
    }

    /**
     * @notice Gets the legacy on-chain Device Definition Id associated with a Vehicle Id
     * @dev Device definitions are tracked off-chain for vehicles minted through `mintVehicle*`.
     *      This getter only returns data for vehicles minted before the off-chain migration;
     *      it returns an empty string for vehicles minted after.
     * @param vehicleId Vehicle Id
     */
    function getDeviceDefinitionIdByVehicleId(
        uint256 vehicleId
    ) external view returns (string memory ddId) {
        ddId = VehicleStorage
            .getStorage()
            ._deprecated_vehicleIdToDeviceDefinitionId[vehicleId];
    }
}
