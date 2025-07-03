//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./nodes/VehicleInternal.sol";
import "./nodes/SyntheticDeviceInternal.sol";
import "./charging/ChargingInternal.sol";
import "./storageNode/StorageNodeRegistryInternal.sol";
import "../interfaces/INFT.sol";
import "../interfaces/ISacd.sol";
import "../Eip712/Eip712CheckerInternal.sol";
import "../libraries/NodesStorage.sol";
import "../libraries/nodes/ManufacturerStorage.sol";
import "../libraries/nodes/VehicleStorage.sol";
import "../libraries/nodes/SyntheticDeviceStorage.sol";
import "../libraries/MapperStorage.sol";
import "../libraries/SharedStorage.sol";
import "../shared/Errors.sol" as Errors;

import {MINT_VEHICLE_OPERATION} from "../shared/Operations.sol";

error DeviceAlreadyRegistered(address addr);
error InvalidSdSignature();

contract MultipleMinter is VehicleInternal, SyntheticDeviceInternal {
    bytes32 private constant MINT_VEHICLE_SD_TYPEHASH =
        keccak256("MintVehicleAndSdSign(uint256 connectionId)");

    /**
     * @notice Mints and pairs a vehicle and a synthetic device through a metatransaction
     * @dev DEPRECATED: This function will be removed in a future release
     *      Please use the version with storageNodeId parameter instead
     * @dev The vehicle owner signs a typed structured (EIP-712) message in advance which is verified during execution.
     * Caller must have the CONNECTION_MINT_SD_PERMISSION for the specified connection or be the connection ID owner
     * @param data A MintVehicleAndSdInput struct containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     * Emits VehicleNodeMinted and SyntheticDeviceNodeMinted events on success.
     * Reverts if connection or manufacturer node doesn't exist, caller lacks permission,
     * device is already registered, or signatures are invalid.
     */
    function mintVehicleAndSdSign(
        MintVehicleAndSdInput calldata data
    ) external {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(SharedStorage.getStorage().connectionsManager).exists(
                data.connectionId
            )
        ) revert InvalidParentNode(data.connectionId);
        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNode
            )
        ) revert InvalidParentNode(data.manufacturerNode);
        if (
            !ISacd(sharedStorage.sacd).hasPermission(
                sharedStorage.connectionsManager,
                data.connectionId,
                msg.sender,
                CONNECTION_MINT_SD_PERMISSION
            )
        ) revert Errors.Unauthorized(msg.sender);
        if (sds.deviceAddressToNodeId[data.syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(data.syntheticDeviceAddr);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_SD_TYPEHASH, data.connectionId)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();

        // ----- START Vehicle mint and attributes -----
        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
            data.owner
        );

        emit VehicleNodeMinted(
            data.manufacturerNode,
            newTokenIdVehicle,
            data.owner
        );

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenIdVehicle,
            data.attrInfoPairsVehicle
        );

        message = keccak256(
            abi.encode(
                MINT_VEHICLE_TYPEHASH,
                data.manufacturerNode,
                data.owner,
                attributesHash,
                infosHash
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();
        // ----- END Vehicle mint and attributes -----

        // ----- START Synthetic Device mint and attributes -----
        uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(data.owner);

        emit SyntheticDeviceNodeMinted(
            data.connectionId,
            newTokenIdDevice,
            newTokenIdVehicle,
            data.syntheticDeviceAddr,
            data.owner
        );

        if (data.attrInfoPairsDevice.length > 0)
            _setInfos(newTokenIdDevice, data.attrInfoPairsDevice);
        // ----- END Synthetic Device mint and attributes -----

        // ----- Internal contract state change -----
        ns.nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNode;

        ns.nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data
            .connectionId;

        ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
            newTokenIdVehicle
        ] = newTokenIdDevice;
        ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
            newTokenIdDevice
        ] = newTokenIdVehicle;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenIdDevice;
        sds.nodeIdToDeviceAddress[newTokenIdDevice] = data.syntheticDeviceAddr;

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
    }

    /**
     * @notice Mints and pairs a vehicle and a synthetic device through a metatransaction
     * @dev The vehicle owner signs a typed structured (EIP-712) message in advance which is verified during execution.
     * Caller must have the CONNECTION_MINT_SD_PERMISSION for the specified connection or be the connection ID owner
     * @param data A MintVehicleAndSdInputWithSnId struct containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - storageNodeId: ID of the storage node to associate with the vehicle
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     * Reverts if connection or manufacturer node doesn't exist, caller lacks permission,
     * device is already registered, storage node is invalid, or signatures are invalid.
     */
    function mintVehicleAndSdSign(
        MintVehicleAndSdInputWithSnId calldata data
    ) external {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(SharedStorage.getStorage().connectionsManager).exists(
                data.connectionId
            )
        ) revert InvalidParentNode(data.connectionId);
        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNode
            )
        ) revert InvalidParentNode(data.manufacturerNode);
        if (
            !ISacd(sharedStorage.sacd).hasPermission(
                sharedStorage.connectionsManager,
                data.connectionId,
                msg.sender,
                CONNECTION_MINT_SD_PERMISSION
            )
        ) revert Errors.Unauthorized(msg.sender);
        if (sds.deviceAddressToNodeId[data.syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(data.syntheticDeviceAddr);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_SD_TYPEHASH, data.connectionId)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();

        // ----- START Vehicle mint and attributes -----
        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
            data.owner
        );

        emit VehicleNodeMinted(
            data.manufacturerNode,
            newTokenIdVehicle,
            data.owner
        );

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenIdVehicle,
            data.attrInfoPairsVehicle
        );

        message = keccak256(
            abi.encode(
                MINT_VEHICLE_TYPEHASH,
                data.manufacturerNode,
                data.owner,
                attributesHash,
                infosHash
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();
        // ----- END Vehicle mint and attributes -----

        // ----- START Synthetic Device mint and attributes -----
        uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(data.owner);

        emit SyntheticDeviceNodeMinted(
            data.connectionId,
            newTokenIdDevice,
            newTokenIdVehicle,
            data.syntheticDeviceAddr,
            data.owner
        );

        if (data.attrInfoPairsDevice.length > 0)
            _setInfos(newTokenIdDevice, data.attrInfoPairsDevice);
        // ----- END Synthetic Device mint and attributes -----

        // ----- Internal contract state change -----
        ns.nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNode;

        ns.nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data
            .connectionId;

        ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
            newTokenIdVehicle
        ] = newTokenIdDevice;
        ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
            newTokenIdDevice
        ] = newTokenIdVehicle;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenIdDevice;
        sds.nodeIdToDeviceAddress[newTokenIdDevice] = data.syntheticDeviceAddr;

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
        StorageNodeRegistryInternal._setNodeIdForVehicleId(
            newTokenIdVehicle,
            data.storageNodeId
        );
    }

    /**
     * @notice Mints and pairs a vehicle with a Device Definition ID and a synthetic device through a metatransaction
     * @dev DEPRECATED: This function will be removed in a future release
     *      Please use the version with storageNodeId parameter instead
     * @dev The vehicle owner signs a typed structured (EIP-712) message in advance which is verified during execution.
     * Caller must have the CONNECTION_MINT_SD_PERMISSION for the specified connection or be the connection ID owner.
     * @param data A MintVehicleAndSdWithDdInput struct containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - deviceDefinitionId: The Device Definition ID to associate with the vehicle
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     * Emits VehicleNodeMintedWithDeviceDefinition and SyntheticDeviceNodeMinted events on success.
     * Reverts if connection or manufacturer node doesn't exist, caller lacks permission,
     * device is already registered, or signatures are invalid.
     */
    function mintVehicleAndSdWithDeviceDefinitionSign(
        MintVehicleAndSdWithDdInput calldata data
    ) external {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(SharedStorage.getStorage().connectionsManager).exists(
                data.connectionId
            )
        ) revert InvalidParentNode(data.connectionId);
        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNode
            )
        ) revert InvalidParentNode(data.manufacturerNode);
        if (
            !ISacd(sharedStorage.sacd).hasPermission(
                sharedStorage.connectionsManager,
                data.connectionId,
                msg.sender,
                CONNECTION_MINT_SD_PERMISSION
            )
        ) revert Errors.Unauthorized(msg.sender);
        if (sds.deviceAddressToNodeId[data.syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(data.syntheticDeviceAddr);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_SD_TYPEHASH, data.connectionId)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();

        // ----- START Vehicle mint -----
        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
            data.owner
        );

        emit VehicleNodeMintedWithDeviceDefinition(
            data.manufacturerNode,
            newTokenIdVehicle,
            data.owner,
            data.deviceDefinitionId
        );

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenIdVehicle,
            data.attrInfoPairsVehicle
        );

        message = keccak256(
            abi.encode(
                MINT_VEHICLE_WITH_DD_TYPEHASH,
                data.manufacturerNode,
                data.owner,
                keccak256(bytes(data.deviceDefinitionId)),
                attributesHash,
                infosHash
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();
        // ----- END Vehicle mint -----

        // ----- START Synthetic Device mint and attributes -----
        uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(data.owner);

        emit SyntheticDeviceNodeMinted(
            data.connectionId,
            newTokenIdDevice,
            newTokenIdVehicle,
            data.syntheticDeviceAddr,
            data.owner
        );

        if (data.attrInfoPairsDevice.length > 0)
            _setInfos(newTokenIdDevice, data.attrInfoPairsDevice);
        // ----- END Synthetic Device mint and attributes -----

        // ----- Internal contract state change -----
        NodesStorage
        .getStorage()
        .nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNode;
        vs.vehicleIdToDeviceDefinitionId[newTokenIdVehicle] = data
            .deviceDefinitionId;

        NodesStorage
        .getStorage()
        .nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data
            .connectionId;

        ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
            newTokenIdVehicle
        ] = newTokenIdDevice;
        ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
            newTokenIdDevice
        ] = newTokenIdVehicle;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenIdDevice;
        sds.nodeIdToDeviceAddress[newTokenIdDevice] = data.syntheticDeviceAddr;

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
    }

    /**
     * @notice Mints and pairs a vehicle with a Device Definition ID and a synthetic device through a metatransaction
     * @dev The vehicle owner signs a typed structured (EIP-712) message in advance which is verified during execution.
     * Caller must have the CONNECTION_MINT_SD_PERMISSION for the specified connection or be the connection ID owner.
     * @param data A MintVehicleAndSdWithDdInputWithSnId struct containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - storageNodeId: ID of the storage node to associate with the vehicle
     *        - deviceDefinitionId: The Device Definition ID to associate with the vehicle
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     * Emits VehicleNodeMintedWithDeviceDefinition and SyntheticDeviceNodeMinted events on success.
     * Reverts if connection or manufacturer node doesn't exist, caller lacks permission,
     * device is already registered, storage node is invalid, or signatures are invalid.
     */
    function mintVehicleAndSdWithDeviceDefinitionSign(
        MintVehicleAndSdWithDdInputWithSnId calldata data
    ) external {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(SharedStorage.getStorage().connectionsManager).exists(
                data.connectionId
            )
        ) revert InvalidParentNode(data.connectionId);
        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNode
            )
        ) revert InvalidParentNode(data.manufacturerNode);
        if (
            !ISacd(sharedStorage.sacd).hasPermission(
                sharedStorage.connectionsManager,
                data.connectionId,
                msg.sender,
                CONNECTION_MINT_SD_PERMISSION
            )
        ) revert Errors.Unauthorized(msg.sender);
        if (sds.deviceAddressToNodeId[data.syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(data.syntheticDeviceAddr);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_SD_TYPEHASH, data.connectionId)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();

        // ----- START Vehicle mint -----
        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
            data.owner
        );

        emit VehicleNodeMintedWithDeviceDefinition(
            data.manufacturerNode,
            newTokenIdVehicle,
            data.owner,
            data.deviceDefinitionId
        );

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenIdVehicle,
            data.attrInfoPairsVehicle
        );

        message = keccak256(
            abi.encode(
                MINT_VEHICLE_WITH_DD_TYPEHASH,
                data.manufacturerNode,
                data.owner,
                keccak256(bytes(data.deviceDefinitionId)),
                attributesHash,
                infosHash
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();
        // ----- END Vehicle mint -----

        // ----- START Synthetic Device mint and attributes -----
        uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(data.owner);

        emit SyntheticDeviceNodeMinted(
            data.connectionId,
            newTokenIdDevice,
            newTokenIdVehicle,
            data.syntheticDeviceAddr,
            data.owner
        );

        if (data.attrInfoPairsDevice.length > 0)
            _setInfos(newTokenIdDevice, data.attrInfoPairsDevice);
        // ----- END Synthetic Device mint and attributes -----

        // ----- Internal contract state change -----
        NodesStorage
        .getStorage()
        .nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNode;
        vs.vehicleIdToDeviceDefinitionId[newTokenIdVehicle] = data
            .deviceDefinitionId;

        NodesStorage
        .getStorage()
        .nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data
            .connectionId;

        ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
            newTokenIdVehicle
        ] = newTokenIdDevice;
        ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
            newTokenIdDevice
        ] = newTokenIdVehicle;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenIdDevice;
        sds.nodeIdToDeviceAddress[newTokenIdDevice] = data.syntheticDeviceAddr;

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);
        StorageNodeRegistryInternal._setNodeIdForVehicleId(
            newTokenIdVehicle,
            data.storageNodeId
        );
    }

    /**
     * @notice Mints and pairs a vehicle (with a Device Definition Id) and a synthetic device, and sets permissions with SACD through a metatransaction
     * @dev DEPRECATED: This function will be removed in a future release
     *      Please use the version with storageNodeId parameter instead
     * @dev The vehicle owner signs a typed structured (EIP-712) message in advance which is verified during execution.
     * Caller must have the CONNECTION_MINT_SD_PERMISSION for the specified connection or be the connection ID owner.
     * @param data A MintVehicleAndSdWithDdInput struct containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - deviceDefinitionId: The Device Definition ID to associate with the vehicle
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     * @param sacdInput SACD input args for setting permissions:
     *        - grantee: The address to receive the permissions
     *        - permissions: The uint256 that represents the byte array of permissions
     *        - expiration: Expiration timestamp of the permissions
     *        - source: The URI source associated with the permissions
     * Emits VehicleNodeMintedWithDeviceDefinition and SyntheticDeviceNodeMinted events on success.
     * Reverts if connection or manufacturer node doesn't exist, caller lacks permission,
     * device is already registered, or signatures are invalid.
     */
    function mintVehicleAndSdWithDeviceDefinitionSignAndSacd(
        MintVehicleAndSdWithDdInput calldata data,
        SacdInput calldata sacdInput
    ) external {
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(SharedStorage.getStorage().connectionsManager).exists(
                data.connectionId
            )
        ) revert InvalidParentNode(data.connectionId);
        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNode
            )
        ) revert InvalidParentNode(data.manufacturerNode);
        if (
            !ISacd(sharedStorage.sacd).hasPermission(
                sharedStorage.connectionsManager,
                data.connectionId,
                msg.sender,
                CONNECTION_MINT_SD_PERMISSION
            )
        ) revert Errors.Unauthorized(msg.sender);
        if (sds.deviceAddressToNodeId[data.syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(data.syntheticDeviceAddr);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_SD_TYPEHASH, data.connectionId)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();

        // ----- START Vehicle mint -----
        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
            data.owner
        );

        emit VehicleNodeMintedWithDeviceDefinition(
            data.manufacturerNode,
            newTokenIdVehicle,
            data.owner,
            data.deviceDefinitionId
        );

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenIdVehicle,
            data.attrInfoPairsVehicle
        );

        message = keccak256(
            abi.encode(
                MINT_VEHICLE_WITH_DD_TYPEHASH,
                data.manufacturerNode,
                data.owner,
                keccak256(bytes(data.deviceDefinitionId)),
                attributesHash,
                infosHash
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();
        // ----- END Vehicle mint -----

        // ----- START Synthetic Device mint and attributes -----
        uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(data.owner);

        emit SyntheticDeviceNodeMinted(
            data.connectionId,
            newTokenIdDevice,
            newTokenIdVehicle,
            data.syntheticDeviceAddr,
            data.owner
        );

        if (data.attrInfoPairsDevice.length > 0)
            _setInfos(newTokenIdDevice, data.attrInfoPairsDevice);
        // ----- END Synthetic Device mint and attributes -----

        // ----- Internal contract state change -----
        NodesStorage
        .getStorage()
        .nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNode;
        vs.vehicleIdToDeviceDefinitionId[newTokenIdVehicle] = data
            .deviceDefinitionId;

        NodesStorage
        .getStorage()
        .nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data
            .connectionId;

        MapperStorage.getStorage().nodeLinks[vehicleIdProxyAddress][
            sdIdProxyAddress
        ][newTokenIdVehicle] = newTokenIdDevice;
        MapperStorage.getStorage().nodeLinks[sdIdProxyAddress][
            vehicleIdProxyAddress
        ][newTokenIdDevice] = newTokenIdVehicle;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenIdDevice;
        sds.nodeIdToDeviceAddress[newTokenIdDevice] = data.syntheticDeviceAddr;

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);

        INFT(vehicleIdProxyAddress).setSacd(newTokenIdVehicle, sacdInput);
    }

    /**
     * @notice Mints and pairs a vehicle (with a Device Definition Id) and a synthetic device, and sets permissions with SACD through a metatransaction
     * @dev The vehicle owner signs a typed structured (EIP-712) message in advance which is verified during execution.
     * Caller must have the CONNECTION_MINT_SD_PERMISSION for the specified connection or be the connection ID owner.
     * @param data A MintVehicleAndSdWithDdInputWithSnId struct containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - storageNodeId: ID of the storage node to associate with the vehicle
     *        - deviceDefinitionId: The Device Definition ID to associate with the vehicle
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     * @param sacdInput SACD input args for setting permissions:
     *        - grantee: The address to receive the permissions
     *        - permissions: The uint256 that represents the byte array of permissions
     *        - expiration: Expiration timestamp of the permissions
     *        - source: The URI source associated with the permissions
     * Emits VehicleNodeMintedWithDeviceDefinition and SyntheticDeviceNodeMinted events on success.
     * Reverts if connection or manufacturer node doesn't exist, caller lacks permission,
     * device is already registered, storage node is invalid, or signatures are invalid.
     */
    function mintVehicleAndSdWithDeviceDefinitionSignAndSacd(
        MintVehicleAndSdWithDdInputWithSnId calldata data,
        SacdInput calldata sacdInput
    ) external {
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(SharedStorage.getStorage().connectionsManager).exists(
                data.connectionId
            )
        ) revert InvalidParentNode(data.connectionId);
        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNode
            )
        ) revert InvalidParentNode(data.manufacturerNode);
        if (
            !ISacd(sharedStorage.sacd).hasPermission(
                sharedStorage.connectionsManager,
                data.connectionId,
                msg.sender,
                CONNECTION_MINT_SD_PERMISSION
            )
        ) revert Errors.Unauthorized(msg.sender);
        if (sds.deviceAddressToNodeId[data.syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(data.syntheticDeviceAddr);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_SD_TYPEHASH, data.connectionId)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();

        // ----- START Vehicle mint -----
        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
            data.owner
        );

        emit VehicleNodeMintedWithDeviceDefinition(
            data.manufacturerNode,
            newTokenIdVehicle,
            data.owner,
            data.deviceDefinitionId
        );

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenIdVehicle,
            data.attrInfoPairsVehicle
        );

        message = keccak256(
            abi.encode(
                MINT_VEHICLE_WITH_DD_TYPEHASH,
                data.manufacturerNode,
                data.owner,
                keccak256(bytes(data.deviceDefinitionId)),
                attributesHash,
                infosHash
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();
        // ----- END Vehicle mint -----

        // ----- START Synthetic Device mint and attributes -----
        uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(data.owner);

        emit SyntheticDeviceNodeMinted(
            data.connectionId,
            newTokenIdDevice,
            newTokenIdVehicle,
            data.syntheticDeviceAddr,
            data.owner
        );

        if (data.attrInfoPairsDevice.length > 0)
            _setInfos(newTokenIdDevice, data.attrInfoPairsDevice);
        // ----- END Synthetic Device mint and attributes -----

        // ----- Internal contract state change -----
        NodesStorage
        .getStorage()
        .nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNode;
        vs.vehicleIdToDeviceDefinitionId[newTokenIdVehicle] = data
            .deviceDefinitionId;

        NodesStorage
        .getStorage()
        .nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data
            .connectionId;

        MapperStorage.getStorage().nodeLinks[vehicleIdProxyAddress][
            sdIdProxyAddress
        ][newTokenIdVehicle] = newTokenIdDevice;
        MapperStorage.getStorage().nodeLinks[sdIdProxyAddress][
            vehicleIdProxyAddress
        ][newTokenIdDevice] = newTokenIdVehicle;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenIdDevice;
        sds.nodeIdToDeviceAddress[newTokenIdDevice] = data.syntheticDeviceAddr;

        ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);

        INFT(vehicleIdProxyAddress).setSacd(newTokenIdVehicle, sacdInput);
        StorageNodeRegistryInternal._setNodeIdForVehicleId(
            newTokenIdVehicle,
            data.storageNodeId
        );
    }

    /**
     * @notice Mints and pairs multiple vehicles (with Device Definition Ids) and synthetic devices in batch
     * @dev DEPRECATED: This function will be removed in a future release
     *      Please use the version with storageNodeId parameter instead
     * @dev Processes multiple vehicle and synthetic device pairs in a single transaction.
     * For each pair, verifies signatures, mints tokens, sets attributes, and establishes relationships.
     * Caller must have the CONNECTION_MINT_SD_PERMISSION for each specified connection or be the connection ID owner.
     * @param data An array of MintVehicleAndSdWithDdInputBatch structs, each containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - deviceDefinitionId: The Device Definition ID to associate with the vehicle
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     *        - sacdInput: SACD input args for setting permissions on the vehicle
     * Emits VehicleNodeMintedWithDeviceDefinition and SyntheticDeviceNodeMinted events for each pair.
     * Reverts if any connection or manufacturer node doesn't exist, caller lacks permission,
     * any device is already registered, or any signature is invalid.
     */
    function mintVehicleAndSdWithDeviceDefinitionSignBatch(
        MintVehicleAndSdWithDdInputBatch[] calldata data
    ) external {
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        for (uint256 i = 0; i < data.length; i++) {
            if (
                !INFT(SharedStorage.getStorage().connectionsManager).exists(
                    data[i].connectionId
                )
            ) revert InvalidParentNode(data[i].connectionId);
            if (
                !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                    data[i].manufacturerNode
                )
            ) revert InvalidParentNode(data[i].manufacturerNode);
            if (
                !ISacd(sharedStorage.sacd).hasPermission(
                    sharedStorage.connectionsManager,
                    data[i].connectionId,
                    msg.sender,
                    CONNECTION_MINT_SD_PERMISSION
                )
            ) revert Errors.Unauthorized(msg.sender);
            if (sds.deviceAddressToNodeId[data[i].syntheticDeviceAddr] != 0)
                revert DeviceAlreadyRegistered(data[i].syntheticDeviceAddr);

            bytes32 message = keccak256(
                abi.encode(MINT_VEHICLE_SD_TYPEHASH, data[i].connectionId)
            );

            if (
                !Eip712CheckerInternal._verifySignature(
                    data[i].syntheticDeviceAddr,
                    message,
                    data[i].syntheticDeviceSig
                )
            ) revert InvalidSdSignature();

            // ----- START Vehicle mint -----
            uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
                data[i].owner
            );

            emit VehicleNodeMintedWithDeviceDefinition(
                data[i].manufacturerNode,
                newTokenIdVehicle,
                data[i].owner,
                data[i].deviceDefinitionId
            );

            (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
                newTokenIdVehicle,
                data[i].attrInfoPairsVehicle
            );

            message = keccak256(
                abi.encode(
                    MINT_VEHICLE_WITH_DD_TYPEHASH,
                    data[i].manufacturerNode,
                    data[i].owner,
                    keccak256(bytes(data[i].deviceDefinitionId)),
                    attributesHash,
                    infosHash
                )
            );

            if (
                !Eip712CheckerInternal._verifySignature(
                    data[i].owner,
                    message,
                    data[i].vehicleOwnerSig
                )
            ) revert InvalidOwnerSignature();
            // ----- END Vehicle mint -----

            // ----- START Synthetic Device mint and attributes -----
            uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(
                data[i].owner
            );

            emit SyntheticDeviceNodeMinted(
                data[i].connectionId,
                newTokenIdDevice,
                newTokenIdVehicle,
                data[i].syntheticDeviceAddr,
                data[i].owner
            );

            if (data[i].attrInfoPairsDevice.length > 0)
                _setInfos(newTokenIdDevice, data[i].attrInfoPairsDevice);
            // ----- END Synthetic Device mint and attributes -----

            // ----- Internal contract state change -----
            NodesStorage
            .getStorage()
            .nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data[
                i
            ].manufacturerNode;
            VehicleStorage.getStorage().vehicleIdToDeviceDefinitionId[
                newTokenIdVehicle
            ] = data[i].deviceDefinitionId;

            NodesStorage
            .getStorage()
            .nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data[i]
                .connectionId;

            MapperStorage.getStorage().nodeLinks[vehicleIdProxyAddress][
                sdIdProxyAddress
            ][newTokenIdVehicle] = newTokenIdDevice;
            MapperStorage.getStorage().nodeLinks[sdIdProxyAddress][
                vehicleIdProxyAddress
            ][newTokenIdDevice] = newTokenIdVehicle;

            sds.deviceAddressToNodeId[
                data[i].syntheticDeviceAddr
            ] = newTokenIdDevice;
            sds.nodeIdToDeviceAddress[newTokenIdDevice] = data[i]
                .syntheticDeviceAddr;

            ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);

            INFT(vehicleIdProxyAddress).setSacd(
                newTokenIdVehicle,
                data[i].sacdInput
            );
        }
    }

    /**
     * @notice Mints and pairs multiple vehicles (with Device Definition Ids) and synthetic devices in batch
     * @dev Processes multiple vehicle and synthetic device pairs in a single transaction.
     *      For each pair, verifies signatures, mints tokens, sets attributes, and establishes relationships.
     *      Caller must have the CONNECTION_MINT_SD_PERMISSION for each specified connection or be the connection ID owner.
     * @param data An array of MintVehicleAndSdWithDdInputWithSnIdBatch structs, each containing:
     *        - manufacturerNode: Parent manufacturer node ID of the vehicle
     *        - owner: The new nodes owner address
     *        - storageNodeId: ID of the storage node to associate with the vehicle
     *        - deviceDefinitionId: The Device Definition ID to associate with the vehicle
     *        - attrInfoPairsVehicle: List of attribute-info pairs to be added to the vehicle
     *        - connectionId: Parent connection ID of the synthetic device
     *        - vehicleOwnerSig: Vehicle owner's EIP-712 signature
     *        - syntheticDeviceSig: Synthetic device's EIP-712 signature
     *        - syntheticDeviceAddr: Address associated with the synthetic device
     *        - attrInfoPairsDevice: List of attribute-info pairs to be added to the synthetic device
     *        - sacdInput: SACD input args for setting permissions on the vehicle
     * @dev Emits VehicleNodeMintedWithDeviceDefinition and SyntheticDeviceNodeMinted events for each pair.
     *      Reverts if any connection or manufacturer node doesn't exist, caller lacks permission,
     *      any device is already registered, any storage node is invalid, or any signature is invalid.
     */
    function mintVehicleAndSdWithDeviceDefinitionSignBatch(
        MintVehicleAndSdWithDdInputWithSnIdBatch[] calldata data
    ) external {
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        for (uint256 i = 0; i < data.length; i++) {
            if (
                !INFT(SharedStorage.getStorage().connectionsManager).exists(
                    data[i].connectionId
                )
            ) revert InvalidParentNode(data[i].connectionId);
            if (
                !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                    data[i].manufacturerNode
                )
            ) revert InvalidParentNode(data[i].manufacturerNode);
            if (
                !ISacd(sharedStorage.sacd).hasPermission(
                    sharedStorage.connectionsManager,
                    data[i].connectionId,
                    msg.sender,
                    CONNECTION_MINT_SD_PERMISSION
                )
            ) revert Errors.Unauthorized(msg.sender);
            if (sds.deviceAddressToNodeId[data[i].syntheticDeviceAddr] != 0)
                revert DeviceAlreadyRegistered(data[i].syntheticDeviceAddr);

            bytes32 message = keccak256(
                abi.encode(MINT_VEHICLE_SD_TYPEHASH, data[i].connectionId)
            );

            if (
                !Eip712CheckerInternal._verifySignature(
                    data[i].syntheticDeviceAddr,
                    message,
                    data[i].syntheticDeviceSig
                )
            ) revert InvalidSdSignature();

            // ----- START Vehicle mint -----
            uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
                data[i].owner
            );

            emit VehicleNodeMintedWithDeviceDefinition(
                data[i].manufacturerNode,
                newTokenIdVehicle,
                data[i].owner,
                data[i].deviceDefinitionId
            );

            (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
                newTokenIdVehicle,
                data[i].attrInfoPairsVehicle
            );

            message = keccak256(
                abi.encode(
                    MINT_VEHICLE_WITH_DD_TYPEHASH,
                    data[i].manufacturerNode,
                    data[i].owner,
                    keccak256(bytes(data[i].deviceDefinitionId)),
                    attributesHash,
                    infosHash
                )
            );

            if (
                !Eip712CheckerInternal._verifySignature(
                    data[i].owner,
                    message,
                    data[i].vehicleOwnerSig
                )
            ) revert InvalidOwnerSignature();
            // ----- END Vehicle mint -----

            // ----- START Synthetic Device mint and attributes -----
            uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(
                data[i].owner
            );

            emit SyntheticDeviceNodeMinted(
                data[i].connectionId,
                newTokenIdDevice,
                newTokenIdVehicle,
                data[i].syntheticDeviceAddr,
                data[i].owner
            );

            if (data[i].attrInfoPairsDevice.length > 0)
                _setInfos(newTokenIdDevice, data[i].attrInfoPairsDevice);
            // ----- END Synthetic Device mint and attributes -----

            // ----- Internal contract state change -----
            NodesStorage
            .getStorage()
            .nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data[
                i
            ].manufacturerNode;
            VehicleStorage.getStorage().vehicleIdToDeviceDefinitionId[
                newTokenIdVehicle
            ] = data[i].deviceDefinitionId;

            NodesStorage
            .getStorage()
            .nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data[i]
                .connectionId;

            MapperStorage.getStorage().nodeLinks[vehicleIdProxyAddress][
                sdIdProxyAddress
            ][newTokenIdVehicle] = newTokenIdDevice;
            MapperStorage.getStorage().nodeLinks[sdIdProxyAddress][
                vehicleIdProxyAddress
            ][newTokenIdDevice] = newTokenIdVehicle;

            sds.deviceAddressToNodeId[
                data[i].syntheticDeviceAddr
            ] = newTokenIdDevice;
            sds.nodeIdToDeviceAddress[newTokenIdDevice] = data[i]
                .syntheticDeviceAddr;

            ChargingInternal._chargeDcx(msg.sender, MINT_VEHICLE_OPERATION);

            INFT(vehicleIdProxyAddress).setSacd(
                newTokenIdVehicle,
                data[i].sacdInput
            );
            StorageNodeRegistryInternal._setNodeIdForVehicleId(
                newTokenIdVehicle,
                data[i].storageNodeId
            );
        }
    }
}
