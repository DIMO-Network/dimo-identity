//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFTMultiPrivilege.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/AftermarketDeviceStorage.sol";
import "../../libraries/MapperStorage.sol";
import "../AdLicenseValidator/AdLicenseValidatorInternal.sol";

import "../../shared/Roles.sol" as Roles;
import "../../shared/Types.sol" as Types;
import "../../shared/Errors.sol" as Errors;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error RegistryNotApproved();
error DeviceAlreadyRegistered(address addr);
error DeviceAlreadyClaimed(uint256 id);
error InvalidAdSignature();
error AdNotClaimed(uint256 id);
error AdPaired(uint256 id);
error VehicleNotPaired(uint256 id);
error AdNotPaired(uint256 id);
error OwnersDoesNotMatch();

/**
 * @title AftermarketDevice
 * @notice Contract that represents the Aftermarket Device node
 * @dev It uses the Mapper contract to link Aftermarket Devices to Vehicles
 */
contract AftermarketDevice is
    AccessControlInternal,
    AdLicenseValidatorInternal
{
    bytes32 private constant CLAIM_TYPEHASH =
        keccak256(
            "ClaimAftermarketDeviceSign(uint256 aftermarketDeviceNode,address owner)"
        );
    bytes32 private constant PAIR_TYPEHASH =
        keccak256(
            "PairAftermarketDeviceSign(uint256 aftermarketDeviceNode,uint256 vehicleNode)"
        );

    bytes32 private constant UNPAIR_TYPEHASH =
        keccak256(
            "UnPairAftermarketDeviceSign(uint256 aftermarketDeviceNode,uint256 vehicleNode)"
        );
    uint256 private constant MANUFACTURER_MINTER_PRIVILEGE = 1;
    uint256 private constant MANUFACTURER_CLAIMER_PRIVILEGE = 2;

    event AftermarketDeviceIdProxySet(address indexed proxy);
    event AftermarketDeviceAttributeAdded(string attribute);
    event AftermarketDeviceAttributeSet(
        uint256 tokenId,
        string attribute,
        string info
    );
    event AftermarketDeviceNodeMinted(
        uint256 tokenId,
        address indexed aftermarketDeviceAddress,
        address indexed owner
    );
    event AftermarketDeviceClaimed(
        uint256 aftermarketDeviceNode,
        address indexed owner
    );

    event AftermarketDevicePaired(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        address indexed owner
    );

    event AftermarketDeviceUnpaired(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        address indexed owner
    );

    // ***** Admin management ***** //

    /**
     * @notice Sets the NFT proxy associated with the Aftermarket Device node
     * @dev Only an admin can set the address
     * @param addr The address of the proxy
     */
    function setAftermarketDeviceIdProxyAddress(address addr)
        external
        onlyRole(Roles.DEFAULT_ADMIN_ROLE)
    {
        if (addr == address(0)) revert Errors.ZeroAddress();
        AftermarketDeviceStorage.getStorage().idProxyAddress = addr;

        emit AftermarketDeviceIdProxySet(addr);
    }

    /**
     * @notice Adds an attribute to the whielist
     * @dev Only an admin can add a new attribute
     * @param attribute The attribute to be added
     */
    function addAftermarketDeviceAttribute(string calldata attribute)
        external
        onlyRole(Roles.DEFAULT_ADMIN_ROLE)
    {
        if (
            !AttributeSet.add(
                AftermarketDeviceStorage.getStorage().whitelistedAttributes,
                attribute
            )
        ) revert Errors.AttributeExists(attribute);

        emit AftermarketDeviceAttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    /**
     * @notice Mints aftermarket devices in batch
     * Caller must be the manufacturer node owner or an authorized address
     * The manufacturer node owner must grant the minter privilege to the authorized address
     * @param manufacturerNode Parent manufacturer node id
     * @param adInfos List of attribute-info pairs and addresses associated with the AD to be added
     *  addr -> AD address
     *  attrInfoPairs[] / attribute
     *                  \ info
     */
    function mintAftermarketDeviceByManufacturerBatch(
        uint256 manufacturerNode,
        Types.AftermarketDeviceInfos[] calldata adInfos
    ) external {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        uint256 devicesAmount = adInfos.length;
        address adIdProxyAddress = ads.idProxyAddress;
        INFTMultiPrivilege manufacturerIdProxy = INFTMultiPrivilege(
            ManufacturerStorage.getStorage().idProxyAddress
        );

        if (!INFT(adIdProxyAddress).isApprovedForAll(msg.sender, address(this)))
            revert RegistryNotApproved();
        if (!manufacturerIdProxy.exists(manufacturerNode))
            revert Errors.InvalidParentNode(manufacturerNode);
        if (
            !manufacturerIdProxy.hasPrivilege(
                manufacturerNode,
                MANUFACTURER_MINTER_PRIVILEGE,
                msg.sender
            )
        ) revert Errors.Unauthorized(msg.sender);

        uint256 newTokenId;
        address deviceAddress;
        address manufacturerNodeOwner = manufacturerIdProxy.ownerOf(
            manufacturerNode
        );

        for (uint256 i = 0; i < devicesAmount; i++) {
            newTokenId = INFT(adIdProxyAddress).safeMint(manufacturerNodeOwner);

            ns
            .nodes[adIdProxyAddress][newTokenId].parentNode = manufacturerNode;

            deviceAddress = adInfos[i].addr;
            if (ads.deviceAddressToNodeId[deviceAddress] != 0)
                revert DeviceAlreadyRegistered(deviceAddress);

            ads.deviceAddressToNodeId[deviceAddress] = newTokenId;
            ads.nodeIdToDeviceAddress[newTokenId] = deviceAddress;

            _setInfos(newTokenId, adInfos[i].attrInfoPairs);

            emit AftermarketDeviceNodeMinted(
                newTokenId,
                deviceAddress,
                manufacturerNodeOwner
            );
        }

        // Validate license and transfer funds to foundation
        _validateMintRequest(manufacturerNodeOwner, msg.sender, devicesAmount);
    }

    /**
     * @notice Claims the ownership of a list of aftermarket devices to a list of owners
     * Caller must have the admin role or the manufacturer node owner must grant the claimer privilege to the caller
     * @dev This contract must be approved to spend the tokens in advance
     * @param adOwnerPair List of pairs AD-owner
     *  aftermarketDeviceNodeId -> Token ID of the AD
     *  owner -> Address to be the new AD owner
     */
    function claimAftermarketDeviceBatch(
        uint256 manufacturerNode,
        Types.AftermarketDeviceOwnerPair[] calldata adOwnerPair
    ) external {
        INFTMultiPrivilege manufacturerIdProxy = INFTMultiPrivilege(
            ManufacturerStorage.getStorage().idProxyAddress
        );

        if (
            !_hasRole(Roles.DEFAULT_ADMIN_ROLE, msg.sender) &&
            !manufacturerIdProxy.hasPrivilege(
                manufacturerNode,
                MANUFACTURER_CLAIMER_PRIVILEGE,
                msg.sender
            )
        ) revert Errors.Unauthorized(msg.sender);

        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        INFT adIdProxy = INFT(ads.idProxyAddress);

        uint256 aftermarketDeviceNode;
        address owner;
        for (uint256 i = 0; i < adOwnerPair.length; i++) {
            aftermarketDeviceNode = adOwnerPair[i].aftermarketDeviceNodeId;
            owner = adOwnerPair[i].owner;

            if (ads.deviceClaimed[aftermarketDeviceNode])
                revert DeviceAlreadyClaimed(aftermarketDeviceNode);

            ads.deviceClaimed[aftermarketDeviceNode] = true;
            adIdProxy.safeTransferFrom(
                adIdProxy.ownerOf(aftermarketDeviceNode),
                owner,
                aftermarketDeviceNode
            );

            emit AftermarketDeviceClaimed(aftermarketDeviceNode, owner);
        }
    }

    /**
     * @notice Claims the ownership of an aftermarket device through a metatransaction
     * The aftermarket device owner signs a typed structured (EIP-712) message in advance and submits to be verified
     * @dev Caller must have the admin role
     * @dev This contract must be approved to spend the tokens in advance
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param owner The address of the new owner
     * @param ownerSig User's signature hash
     * @param aftermarketDeviceSig Aftermarket Device's signature hash
     */
    function claimAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        address owner,
        bytes calldata ownerSig,
        bytes calldata aftermarketDeviceSig
    ) external onlyRole(Roles.DEFAULT_ADMIN_ROLE) {
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        bytes32 message = keccak256(
            abi.encode(CLAIM_TYPEHASH, aftermarketDeviceNode, owner)
        );
        address aftermarketDeviceAddress = ads.nodeIdToDeviceAddress[
            aftermarketDeviceNode
        ];
        address adIdProxy = ads.idProxyAddress;

        if (!INFT(adIdProxy).exists(aftermarketDeviceNode))
            revert Errors.InvalidNode(adIdProxy, aftermarketDeviceNode);
        if (ads.deviceClaimed[aftermarketDeviceNode])
            revert DeviceAlreadyClaimed(aftermarketDeviceNode);
        if (!Eip712CheckerInternal._verifySignature(owner, message, ownerSig))
            revert Errors.InvalidOwnerSignature();
        if (
            !Eip712CheckerInternal._verifySignature(
                aftermarketDeviceAddress,
                message,
                aftermarketDeviceSig
            )
        ) revert InvalidAdSignature();

        ads.deviceClaimed[aftermarketDeviceNode] = true;
        INFT(adIdProxy).safeTransferFrom(
            INFT(adIdProxy).ownerOf(aftermarketDeviceNode),
            owner,
            aftermarketDeviceNode
        );

        emit AftermarketDeviceClaimed(aftermarketDeviceNode, owner);
    }

    /**
     * @notice Pairs an aftermarket device with a vehicle through a metatransaction.
     * The vehicle owner and AD sign a typed structured (EIP-712) message in advance and submits to be verified
     * @dev Caller must have the admin role
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param vehicleNode Vehicle node id
     * @param aftermarketDeviceSig Aftermarket Device's signature hash
     * @param vehicleOwnerSig Vehicle owner signature hash
     */
    function pairAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        bytes calldata aftermarketDeviceSig,
        bytes calldata vehicleOwnerSig
    ) external onlyRole(Roles.DEFAULT_ADMIN_ROLE) {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        bytes32 message = keccak256(
            abi.encode(PAIR_TYPEHASH, aftermarketDeviceNode, vehicleNode)
        );
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;

        if (!INFT(vehicleIdProxyAddress).exists(vehicleNode))
            revert Errors.InvalidNode(vehicleIdProxyAddress, vehicleNode);
        if (!INFT(adIdProxyAddress).exists(aftermarketDeviceNode))
            revert Errors.InvalidNode(adIdProxyAddress, aftermarketDeviceNode);
        if (
            !AftermarketDeviceStorage.getStorage().deviceClaimed[
                aftermarketDeviceNode
            ]
        ) revert AdNotClaimed(aftermarketDeviceNode);
        if (ms.links[vehicleIdProxyAddress][vehicleNode] != 0)
            revert Errors.VehiclePaired(vehicleNode);
        if (ms.links[adIdProxyAddress][aftermarketDeviceNode] != 0)
            revert AdPaired(aftermarketDeviceNode);
        if (
            !Eip712CheckerInternal._verifySignature(
                AftermarketDeviceStorage.getStorage().nodeIdToDeviceAddress[
                    aftermarketDeviceNode
                ],
                message,
                aftermarketDeviceSig
            )
        ) revert InvalidAdSignature();

        if (
            !Eip712CheckerInternal._verifySignature(
                INFT(vehicleIdProxyAddress).ownerOf(vehicleNode),
                message,
                vehicleOwnerSig
            )
        ) revert Errors.InvalidOwnerSignature();

        ms.links[vehicleIdProxyAddress][vehicleNode] = aftermarketDeviceNode;
        ms.links[adIdProxyAddress][aftermarketDeviceNode] = vehicleNode;

        emit AftermarketDevicePaired(
            aftermarketDeviceNode,
            vehicleNode,
            INFT(adIdProxyAddress).ownerOf(aftermarketDeviceNode)
        );
    }

    /**
     * @notice Pairs an aftermarket device with a vehicle through a metatransaction
     * The aftermarket device owner signs a typed structured (EIP-712) message in advance and submits to be verified
     * @dev Caller must have the admin role
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param vehicleNode Vehicle node id
     * @param signature User's signature hash
     */
    function pairAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        bytes calldata signature
    ) external onlyRole(Roles.DEFAULT_ADMIN_ROLE) {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        bytes32 message = keccak256(
            abi.encode(PAIR_TYPEHASH, aftermarketDeviceNode, vehicleNode)
        );
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;

        if (!INFT(vehicleIdProxyAddress).exists(vehicleNode))
            revert Errors.InvalidNode(vehicleIdProxyAddress, vehicleNode);

        address owner = INFT(vehicleIdProxyAddress).ownerOf(vehicleNode);

        if (!INFT(adIdProxyAddress).exists(aftermarketDeviceNode))
            revert Errors.InvalidNode(adIdProxyAddress, aftermarketDeviceNode);
        if (
            !AftermarketDeviceStorage.getStorage().deviceClaimed[
                aftermarketDeviceNode
            ]
        ) revert AdNotClaimed(aftermarketDeviceNode);
        if (owner != INFT(adIdProxyAddress).ownerOf(aftermarketDeviceNode))
            revert OwnersDoesNotMatch();
        if (ms.links[vehicleIdProxyAddress][vehicleNode] != 0)
            revert Errors.VehiclePaired(vehicleNode);
        if (ms.links[adIdProxyAddress][aftermarketDeviceNode] != 0)
            revert AdPaired(aftermarketDeviceNode);
        if (!Eip712CheckerInternal._verifySignature(owner, message, signature))
            revert Errors.InvalidOwnerSignature();

        ms.links[vehicleIdProxyAddress][vehicleNode] = aftermarketDeviceNode;
        ms.links[adIdProxyAddress][aftermarketDeviceNode] = vehicleNode;

        emit AftermarketDevicePaired(aftermarketDeviceNode, vehicleNode, owner);
    }

    /**
     * @dev Unpairs an aftermarket device from a vehicles through a metatransaction
     * Both vehicle and AD owners can unpair.
     * The aftermarket device owner signs a typed structured (EIP-712) message in advance and submits to be verified
     * @dev Caller must have the admin role
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param vehicleNode Vehicle node id
     * @param signature User's signature hash
     */
    function unpairAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        bytes calldata signature
    ) external onlyRole(Roles.DEFAULT_ADMIN_ROLE) {
        bytes32 message = keccak256(
            abi.encode(UNPAIR_TYPEHASH, aftermarketDeviceNode, vehicleNode)
        );
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;

        if (!INFT(vehicleIdProxyAddress).exists(vehicleNode))
            revert Errors.InvalidNode(vehicleIdProxyAddress, vehicleNode);
        if (!INFT(adIdProxyAddress).exists(aftermarketDeviceNode))
            revert Errors.InvalidNode(adIdProxyAddress, aftermarketDeviceNode);
        if (
            ms.links[vehicleIdProxyAddress][vehicleNode] !=
            aftermarketDeviceNode
        ) revert VehicleNotPaired(vehicleNode);
        if (ms.links[adIdProxyAddress][aftermarketDeviceNode] != vehicleNode)
            revert AdNotPaired(aftermarketDeviceNode);

        address signer = Eip712CheckerInternal._recover(message, signature);
        address adOwner = INFT(adIdProxyAddress).ownerOf(aftermarketDeviceNode);

        if (
            signer != adOwner &&
            signer != INFT(vehicleIdProxyAddress).ownerOf(vehicleNode)
        ) revert Errors.InvalidSigner();

        ms.links[vehicleIdProxyAddress][vehicleNode] = 0;
        ms.links[adIdProxyAddress][aftermarketDeviceNode] = 0;

        emit AftermarketDeviceUnpaired(
            aftermarketDeviceNode,
            vehicleNode,
            adOwner
        );
    }

    /**
     * @notice Add infos to node
     * @dev attributes must be whitelisted
     * @param tokenId Node id where the info will be added
     * @param attrInfo List of attribute-info pairs to be added
     */
    function setAftermarketDeviceInfo(
        uint256 tokenId,
        Types.AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(Roles.DEFAULT_ADMIN_ROLE) {
        address adIdProxy = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;
        if (!INFT(adIdProxy).exists(tokenId))
            revert Errors.InvalidNode(adIdProxy, tokenId);
        _setInfos(tokenId, attrInfo);
    }

    /// @notice Gets the AD Id by the device address
    /// @dev If the device is not minted it will return 0
    /// @param addr Address associated with the aftermarket device
    function getAftermarketDeviceIdByAddress(address addr)
        external
        view
        returns (uint256 nodeId)
    {
        nodeId = AftermarketDeviceStorage.getStorage().deviceAddressToNodeId[
            addr
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
        Types.AttributeInfoPair[] calldata attrInfo
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        address idProxyAddress = ads.idProxyAddress;

        for (uint256 i = 0; i < attrInfo.length; i++) {
            if (
                !AttributeSet.exists(
                    ads.whitelistedAttributes,
                    attrInfo[i].attribute
                )
            ) revert Errors.AttributeNotWhitelisted(attrInfo[i].attribute);

            ns.nodes[idProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;

            emit AftermarketDeviceAttributeSet(
                tokenId,
                attrInfo[i].attribute,
                attrInfo[i].info
            );
        }
    }
}
