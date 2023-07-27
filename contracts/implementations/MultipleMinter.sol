//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./nodes/VehicleInternal.sol";
import "./nodes/SyntheticDeviceInternal.sol";
import "../interfaces/INFT.sol";
import "../Eip712/Eip712CheckerInternal.sol";
import "../libraries/NodesStorage.sol";
import "../libraries/nodes/ManufacturerStorage.sol";
import "../libraries/nodes/IntegrationStorage.sol";
import "../libraries/nodes/VehicleStorage.sol";
import "../libraries/nodes/AftermarketDeviceStorage.sol";
import "../libraries/nodes/SyntheticDeviceStorage.sol";
import "../libraries/MapperStorage.sol";

import "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error DeviceAlreadyRegistered(address addr);
error InvalidSdSignature();

contract MultipleMinter is
    AccessControlInternal,
    VehicleInternal,
    SyntheticDeviceInternal
{
    bytes32 private constant MINT_VEHICLE_AD_TYPEHASH =
        keccak256("MintVehicleAndAdSign(uint256 aftermarketDeviceNode)");
    bytes32 private constant MINT_VEHICLE_SD_TYPEHASH =
        keccak256("MintVehicleAndSdSign(uint256 integrationNode)");

    event AftermarketDeviceClaimed(
        uint256 aftermarketDeviceNode,
        address indexed owner
    );
    event AftermarketDevicePaired(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        address indexed owner
    );

    /**
     * @notice Mints a vehicle, claim and pairs an aftermarket device through a metatransaction
     * The vehicle owner signs a typed structured (EIP-712) message in advance and submits to be verified
     * @dev Caller must have the admin role
     * @param data Input data with the following fields:
     *  manufacturerNodeVehicle -> Parent manufacturer node id of the vehicle
     *  owner -> The new nodes owner
     *  attrInfoPairsVehicle -> List of attribute-info pairs to be added of the vehicle
     *  aftermarketDeviceNode -> The aftermarket device node ID to be claimed and paired
     *  vehicleOwnerSig -> Vehicle owner signature hash
     *  aftermarketDeviceSig -> Aftermarket Device's signature hash
     */
    function mintVehicleAndAdSign(MintVehicleAndAdInput calldata data)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = ads.idProxyAddress;
        uint256 aftermarketDeviceNode = data.aftermarketDeviceNode;
        address owner = data.owner;

        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNodeVehicle
            )
        ) revert InvalidParentNode(data.manufacturerNodeVehicle);
        if (!INFT(adIdProxyAddress).exists(aftermarketDeviceNode))
            revert InvalidNode(adIdProxyAddress, aftermarketDeviceNode);
        if (ads.deviceClaimed[aftermarketDeviceNode])
            revert DeviceAlreadyClaimed(aftermarketDeviceNode);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_AD_TYPEHASH, aftermarketDeviceNode)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                ads.nodeIdToDeviceAddress[aftermarketDeviceNode],
                message,
                data.aftermarketDeviceSig
            )
        ) revert InvalidAdSignature();

        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(owner);

        emit VehicleNodeMinted(
            data.manufacturerNodeVehicle,
            newTokenIdVehicle,
            owner
        );

        (bytes32 attributesHash, bytes32 infosHash) = _setInfosHash(
            newTokenIdVehicle,
            data.attrInfoPairsVehicle
        );

        message = keccak256(
            abi.encode(
                MINT_VEHICLE_TYPEHASH,
                data.manufacturerNodeVehicle,
                owner,
                attributesHash,
                infosHash
            )
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();

        ads.deviceClaimed[aftermarketDeviceNode] = true;
        INFT(adIdProxyAddress).safeTransferFrom(
            INFT(adIdProxyAddress).ownerOf(aftermarketDeviceNode),
            owner,
            aftermarketDeviceNode
        );

        emit AftermarketDeviceClaimed(aftermarketDeviceNode, owner);

        ns.nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNodeVehicle;

        ms.links[vehicleIdProxyAddress][
            newTokenIdVehicle
        ] = aftermarketDeviceNode;
        ms.links[adIdProxyAddress][aftermarketDeviceNode] = newTokenIdVehicle;

        emit AftermarketDevicePaired(
            aftermarketDeviceNode,
            newTokenIdVehicle,
            owner
        );
    }

    /**
     * @notice Mints and pairs a vehicle and a synthetic device through a metatransaction
     * The vehicle owner signs a typed structured (EIP-712) message in advance and submits to be verified
     * @dev Caller must have the admin role
     * @param data Input data with the following fields:
     *  manufacturerNode -> Parent manufacturer node id of the vehicle
     *  owner -> The new nodes owner
     *  attrInfoPairsVehicle -> List of attribute-info pairs to be added of the vehicle
     *  integrationNode -> Parent integration node id of the synthetic device
     *  vehicleOwnerSig -> Vehicle owner signature hash
     *  syntheticDeviceSig -> Synthetic Device's signature hash
     *  syntheticDeviceAddr -> Address associated with the synthetic device
     *  attrInfoPairsDevice -> List of attribute-info pairs to be added of the synthetic device
     */
    function mintVehicleAndSdSign(MintVehicleAndSdInput calldata data)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;
        address syntheticDeviceAddr = data.syntheticDeviceAddr;

        if (
            !INFT(IntegrationStorage.getStorage().idProxyAddress).exists(
                data.integrationNode
            )
        ) revert InvalidParentNode(data.integrationNode);
        if (
            !INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                data.manufacturerNode
            )
        ) revert InvalidParentNode(data.manufacturerNode);
        if (sds.deviceAddressToNodeId[syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(syntheticDeviceAddr);

        bytes32 message = keccak256(
            abi.encode(MINT_VEHICLE_SD_TYPEHASH, data.integrationNode)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();

        uint256 newTokenIdVehicle = INFT(vehicleIdProxyAddress).safeMint(
            data.owner
        );
        uint256 newTokenIdDevice = INFT(sdIdProxyAddress).safeMint(data.owner);

        emit VehicleNodeMinted(
            data.manufacturerNode,
            newTokenIdVehicle,
            data.owner
        );

        emit SyntheticDeviceNodeMinted(
            data.integrationNode,
            newTokenIdDevice,
            newTokenIdVehicle,
            syntheticDeviceAddr,
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

        ns.nodes[vehicleIdProxyAddress][newTokenIdVehicle].parentNode = data
            .manufacturerNode;

        ns.nodes[sdIdProxyAddress][newTokenIdDevice].parentNode = data
            .integrationNode;

        ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
            newTokenIdVehicle
        ] = newTokenIdDevice;
        ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
            newTokenIdDevice
        ] = newTokenIdVehicle;

        sds.deviceAddressToNodeId[syntheticDeviceAddr] = newTokenIdDevice;
        sds.nodeIdToDeviceAddress[newTokenIdDevice] = syntheticDeviceAddr;

        if (data.attrInfoPairsDevice.length > 0)
            _setInfos(newTokenIdDevice, data.attrInfoPairsDevice);
    }
}
