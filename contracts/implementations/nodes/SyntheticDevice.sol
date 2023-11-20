//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./VehicleInternal.sol";
import "./SyntheticDeviceInternal.sol";
import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/IntegrationStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/SyntheticDeviceStorage.sol";
import "../../libraries/MapperStorage.sol";

import {ADMIN_ROLE, MINT_SD_ROLE, BURN_SD_ROLE, SET_SD_INFO_ROLE} from "../../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error DeviceAlreadyRegistered(address addr);
error InvalidSdSignature();

/**
 * @title SyntheticDevice
 * @notice Contract that represents the Synthetic Device node
 * @dev It uses the Mapper contract to link Synthetic Devices to Vehicles
 */
contract SyntheticDevice is
    AccessControlInternal,
    VehicleInternal,
    SyntheticDeviceInternal
{
    bytes32 private constant MINT_TYPEHASH =
        keccak256(
            "MintSyntheticDeviceSign(uint256 integrationNode,uint256 vehicleNode)"
        );
    bytes32 private constant BURN_TYPEHASH =
        keccak256(
            "BurnSyntheticDeviceSign(uint256 vehicleNode,uint256 syntheticDeviceNode)"
        );

    event SyntheticDeviceIdProxySet(address proxy);
    event SyntheticDeviceAttributeAdded(string attribute);
    event SyntheticDeviceNodeBurned(
        uint256 indexed syntheticDeviceNode,
        uint256 indexed vehicleNode,
        address indexed owner
    );

    // ***** Admin management ***** //

    /**
     * @notice Sets the NFT proxy associated with the Synthetic Device node
     * @dev Only an admin can set the address
     * @param addr The address of the proxy
     */
    function setSyntheticDeviceIdProxyAddress(address addr)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (addr == address(0)) revert ZeroAddress();
        SyntheticDeviceStorage.getStorage().idProxyAddress = addr;

        emit SyntheticDeviceIdProxySet(addr);
    }

    /**
     * @notice Adds an attribute to the whielist
     * @dev Only an admin can add a new attribute
     * @param attribute The attribute to be added
     */
    function addSyntheticDeviceAttribute(string calldata attribute)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (
            !AttributeSet.add(
                SyntheticDeviceStorage.getStorage().whitelistedAttributes,
                attribute
            )
        ) revert AttributeExists(attribute);

        emit SyntheticDeviceAttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    /**
     * @notice Mints a list of synthetic devices and links them to vehicles
     * To be called for existing vehicles already connected
     * @dev Caller must have the admin role
     * @dev All devices will be minted under the same integration node
     * @param integrationNode Parent integration node id
     * @param data Input data with the following fields:
     *  vehicleNode -> Vehicle node id
     *  syntheticDeviceAddr -> Address associated with the synthetic device
     *  attrInfoPairs -> List of attribute-info pairs to be added
     */
    function mintSyntheticDeviceBatch(
        uint256 integrationNode,
        MintSyntheticDeviceBatchInput[] calldata data
    ) external onlyRole(MINT_SD_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(IntegrationStorage.getStorage().idProxyAddress).exists(
                integrationNode
            )
        ) revert InvalidParentNode(integrationNode);

        address owner;
        uint256 newTokenId;
        for (uint256 i = 0; i < data.length; i++) {
            if (!INFT(vehicleIdProxyAddress).exists(data[i].vehicleNode))
                revert InvalidNode(vehicleIdProxyAddress, data[i].vehicleNode);
            if (sds.deviceAddressToNodeId[data[i].syntheticDeviceAddr] != 0)
                revert DeviceAlreadyRegistered(data[i].syntheticDeviceAddr);
            if (
                ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
                    data[i].vehicleNode
                ] != 0
            ) revert VehiclePaired(data[i].vehicleNode);

            owner = INFT(vehicleIdProxyAddress).ownerOf(data[i].vehicleNode);
            newTokenId = INFT(sdIdProxyAddress).safeMint(owner);

            ns.nodes[sdIdProxyAddress][newTokenId].parentNode = integrationNode;

            ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
                data[i].vehicleNode
            ] = newTokenId;
            ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
                newTokenId
            ] = data[i].vehicleNode;

            sds.deviceAddressToNodeId[data[i].syntheticDeviceAddr] = newTokenId;
            sds.nodeIdToDeviceAddress[newTokenId] = data[i].syntheticDeviceAddr;

            emit SyntheticDeviceNodeMinted(
                integrationNode,
                newTokenId,
                data[i].vehicleNode,
                data[i].syntheticDeviceAddr,
                owner
            );

            if (data[i].attrInfoPairs.length > 0)
                _setInfos(newTokenId, data[i].attrInfoPairs);
        }
    }

    /**
     * @notice Mints a synthetic device and pair it with a vehicle
     * @dev Caller must have the admin role
     * @param data Input data with the following fields:
     *  integrationNode -> Parent integration node id
     *  vehicleNode -> Vehicle node id
     *  syntheticDeviceSig -> Synthetic Device's signature hash
     *  vehicleOwnerSig -> Vehicle owner signature hash
     *  syntheticDeviceAddr -> Address associated with the synthetic device
     *  attrInfoPairs -> List of attribute-info pairs to be added
     */
    function mintSyntheticDeviceSign(MintSyntheticDeviceInput calldata data)
        external
        onlyRole(MINT_SD_ROLE)
    {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (
            !INFT(IntegrationStorage.getStorage().idProxyAddress).exists(
                data.integrationNode
            )
        ) revert InvalidParentNode(data.integrationNode);
        if (!INFT(vehicleIdProxyAddress).exists(data.vehicleNode))
            revert InvalidNode(vehicleIdProxyAddress, data.vehicleNode);
        if (sds.deviceAddressToNodeId[data.syntheticDeviceAddr] != 0)
            revert DeviceAlreadyRegistered(data.syntheticDeviceAddr);
        if (
            ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
                data.vehicleNode
            ] != 0
        ) revert VehiclePaired(data.vehicleNode);

        address owner = INFT(vehicleIdProxyAddress).ownerOf(data.vehicleNode);
        bytes32 message = keccak256(
            abi.encode(MINT_TYPEHASH, data.integrationNode, data.vehicleNode)
        );

        if (
            !Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            )
        ) revert InvalidSdSignature();
        if (
            !Eip712CheckerInternal._verifySignature(
                owner,
                message,
                data.vehicleOwnerSig
            )
        ) revert InvalidOwnerSignature();

        uint256 newTokenId = INFT(sdIdProxyAddress).safeMint(owner);

        ns.nodes[sdIdProxyAddress][newTokenId].parentNode = data
            .integrationNode;

        ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
            data.vehicleNode
        ] = newTokenId;
        ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][newTokenId] = data
            .vehicleNode;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenId;
        sds.nodeIdToDeviceAddress[newTokenId] = data.syntheticDeviceAddr;

        emit SyntheticDeviceNodeMinted(
            data.integrationNode,
            newTokenId,
            data.vehicleNode,
            data.syntheticDeviceAddr,
            owner
        );

        if (data.attrInfoPairs.length > 0)
            _setInfos(newTokenId, data.attrInfoPairs);
    }

    /**
     * @notice Burns a synthetic device and reset all its attributes and links
     * @dev Caller must have the admin role
     * @dev This contract has the BURNER_ROLE in the SyntheticDeviceId
     * @param vehicleNode Vehicle node id
     * @param syntheticDeviceNode Synthetic Device node id
     * @param ownerSig Vehicle/Synthetic Device's owner signature hash
     */
    function burnSyntheticDeviceSign(
        uint256 vehicleNode,
        uint256 syntheticDeviceNode,
        bytes calldata ownerSig
    ) external onlyRole(BURN_SD_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (!INFT(vehicleIdProxyAddress).exists(vehicleNode))
            revert InvalidNode(vehicleIdProxyAddress, vehicleNode);
        if (!INFT(sdIdProxyAddress).exists(syntheticDeviceNode))
            revert InvalidNode(sdIdProxyAddress, syntheticDeviceNode);
        if (
            ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
                vehicleNode
            ] != syntheticDeviceNode
        ) revert VehicleNotPaired(vehicleNode);

        address owner = INFT(sdIdProxyAddress).ownerOf(syntheticDeviceNode);
        bytes32 message = keccak256(
            abi.encode(BURN_TYPEHASH, vehicleNode, syntheticDeviceNode)
        );

        if (!Eip712CheckerInternal._verifySignature(owner, message, ownerSig))
            revert InvalidOwnerSignature();

        delete ns.nodes[sdIdProxyAddress][syntheticDeviceNode].parentNode;

        delete ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
            vehicleNode
        ];
        delete ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
            syntheticDeviceNode
        ];

        delete sds.deviceAddressToNodeId[
            sds.nodeIdToDeviceAddress[syntheticDeviceNode]
        ];
        delete sds.nodeIdToDeviceAddress[syntheticDeviceNode];

        INFT(sdIdProxyAddress).burn(syntheticDeviceNode);

        emit SyntheticDeviceNodeBurned(syntheticDeviceNode, vehicleNode, owner);

        _resetInfos(syntheticDeviceNode);
    }

    /**
     * @notice Add infos to node
     * @dev attributes must be whitelisted
     * @param tokenId Node id where the info will be added
     * @param attrInfo List of attribute-info pairs to be added
     */
    function setSyntheticDeviceInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(SET_SD_INFO_ROLE) {
        address sdIdProxy = SyntheticDeviceStorage.getStorage().idProxyAddress;
        if (!INFT(sdIdProxy).exists(tokenId))
            revert InvalidNode(sdIdProxy, tokenId);
        _setInfos(tokenId, attrInfo);
    }

    /**
     * @notice Gets the Synthetic Device Id by the device address
     * @dev If the device is not minted it will return 0
     * @param addr Address associated with the synthetic device
     */
    function getSyntheticDeviceIdByAddress(address addr)
        external
        view
        returns (uint256 nodeId)
    {
        nodeId = SyntheticDeviceStorage.getStorage().deviceAddressToNodeId[
            addr
        ];
    }

    /**
     * @notice Gets the SD address by the node ID
     * @dev If the device is not minted it will return 0x00 address
     * @param nodeId Node ID associated with the synthetic device
     */
    function getSyntheticDeviceAddressById(uint256 nodeId)
        external
        view
        returns (address addr)
    {
        addr = SyntheticDeviceStorage.getStorage().nodeIdToDeviceAddress[
            nodeId
        ];
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /**
     * @dev Internal function to reset node infos
     * It iterates over all whitelisted attributes to reset each info
     * @param tokenId Node which will have the infos reset
     */
    function _resetInfos(uint256 tokenId) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
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

            emit SyntheticDeviceAttributeSet(tokenId, attributes[i], "");
        }
    }
}
