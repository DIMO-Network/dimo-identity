//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/AftermarketDeviceStorage.sol";
import "../../libraries/MapperStorage.sol";
import "../AdLicenseValidator/AdLicenseValidatorInternal.sol";

import "../../shared/Roles.sol";
import "../../shared/Types.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * TODO Documentation
 * It uses the Mapper contract to link Aftermarket Devices to Vehicles
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

    event AftermarketDeviceNftProxySet(address indexed proxy);
    event AftermarketDeviceAttributeAdded(string attribute);
    event AftermarketDeviceNodeMinted(
        uint256 indexed tokenId,
        address indexed aftermarketDeviceAddress
    );
    event AftermarketDeviceClaimed(
        uint256 indexed aftermarketDeviceNode,
        address indexed owner
    );
    event AftermarketDevicePaired(
        uint256 indexed aftermarketDeviceNode,
        uint256 indexed vehicleNode,
        address indexed owner
    );

    // ***** Admin management ***** //

    // TODO Documentation
    function setAftermarketDeviceNftProxyAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        AftermarketDeviceStorage.getStorage().nftProxyAddress = addr;

        emit AftermarketDeviceNftProxySet(addr);
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addAftermarketDeviceAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            AttributeSet.add(
                AftermarketDeviceStorage.getStorage().whitelistedAttributes,
                attribute
            ),
            "Attribute already exists"
        );

        emit AftermarketDeviceAttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    /// @notice Mints aftermarket devices in batch
    /// @dev Caller must have the manufacturer role
    /// @param adInfos List of attribute-info pairs and addresses associated with the AD to be added
    function mintAftermarketDeviceByManufacturerBatch(
        uint256 manufacturerNode,
        AftermarketDeviceInfos[] calldata adInfos
    ) external onlyRole(MANUFACTURER_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        uint256 devicesAmount = adInfos.length;
        address adNftProxyAddress = ads.nftProxyAddress;

        require(
            INFT(adNftProxyAddress).isApprovedForAll(msg.sender, address(this)),
            "Registry must be approved for all"
        );

        // TODO Check if manufacturerNode is a manufacturer ?
        // require(
        //     ns.nodes[manufacturerNode].nodeType == ms.nodeType,
        //     "Invalid parent node"
        // );

        uint256 newTokenId;
        address deviceAddress;

        for (uint256 i = 0; i < devicesAmount; i++) {
            newTokenId = INFT(adNftProxyAddress).safeMint(msg.sender);

            ns
            .nodes[adNftProxyAddress][newTokenId].parentNode = manufacturerNode;

            deviceAddress = adInfos[i].addr;
            require(
                ads.deviceAddressToNodeId[deviceAddress] == 0,
                "Device address already registered"
            );

            ads.deviceAddressToNodeId[deviceAddress] = newTokenId;
            ads.nodeIdToDeviceAddress[newTokenId] = deviceAddress;

            _setInfo(newTokenId, adInfos[i].attrInfoPairs);

            emit AftermarketDeviceNodeMinted(newTokenId, deviceAddress);
        }

        // Validate request and transfer funds to foundation
        // This transfer is at the end of the function to prevent reentrancy
        _validateMintRequest(msg.sender, devicesAmount);
    }

    /// @notice Claims the ownership of an aftermarket device through a metatransaction
    /// The aftermarket device owner signs a typed structured (EIP-712) message in advance and submits to be verified
    /// @dev Caller must have the admin role
    /// @dev This contract must be approved to spend the tokens in advance
    /// @param aftermarketDeviceNode Aftermarket device node id
    /// @param owner The address of the new owner
    /// @param ownerSig User's signature hash
    /// @param aftermarketDeviceSig Aftermarket Device's signature hash
    function claimAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        address owner,
        bytes calldata ownerSig,
        bytes calldata aftermarketDeviceSig
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        bytes32 message = keccak256(
            abi.encode(CLAIM_TYPEHASH, aftermarketDeviceNode, owner)
        );
        address aftermarketDeviceAddress = ads.nodeIdToDeviceAddress[
            aftermarketDeviceNode
        ];
        INFT adNftProxy = INFT(ads.nftProxyAddress);

        // TODO Check if aftermarketDeviceNode is valid ?
        // require(
        //     NodesStorage.getStorage().nodes[aftermarketDeviceNode].nodeType ==
        //         AftermarketDeviceStorage.getStorage().nodeType,
        //     "Invalid AD node"
        // );
        require(
            MapperStorage.getStorage().links[ads.nftProxyAddress][
                aftermarketDeviceNode
            ] == 0,
            "Device already paired"
        );
        require(
            Eip712CheckerInternal._verifySignature(owner, message, ownerSig),
            "Invalid signature"
        );
        require(
            Eip712CheckerInternal._verifySignature(
                aftermarketDeviceAddress,
                message,
                aftermarketDeviceSig
            ),
            "Invalid signature"
        );

        adNftProxy.safeTransferFrom(
            adNftProxy.ownerOf(aftermarketDeviceNode),
            owner,
            aftermarketDeviceNode
        );

        emit AftermarketDeviceClaimed(aftermarketDeviceNode, owner);
    }

    /// @notice Pairs an aftermarket device with a vehicle through a metatransaction
    /// The aftermarket device owner signs a typed structured (EIP-712) message in advance and submits to be verified
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNode Aftermarket device node id
    /// @param vehicleNode Vehicle node id
    /// @param signature User's signature hash
    function pairAftermarketDeviceSign(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        bytes calldata signature
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        bytes32 message = keccak256(
            abi.encode(PAIR_TYPEHASH, aftermarketDeviceNode, vehicleNode)
        );
        address vehicleNftProxyAddress = VehicleStorage
            .getStorage()
            .nftProxyAddress;
        address adNftProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .nftProxyAddress;

        // TODO Check node type?
        // require(
        //     ns.nodes[aftermarketDeviceNode].nodeType ==
        //         AftermarketDeviceStorage.getStorage().nodeType,
        //     "Invalid AD node"
        // );
        // require(
        //     ns.nodes[vehicleNode].nodeType ==
        //         VehicleStorage.getStorage().nodeType,
        //     "Invalid vehicle node"
        // );

        address owner = INFT(vehicleNftProxyAddress).ownerOf(vehicleNode);

        require(
            owner == INFT(adNftProxyAddress).ownerOf(aftermarketDeviceNode),
            "Owner of the nodes does not match"
        );
        require(
            ms.links[vehicleNftProxyAddress][vehicleNode] == 0,
            "Vehicle already paired"
        );
        require(
            ms.links[adNftProxyAddress][aftermarketDeviceNode] == 0,
            "AD already paired"
        );
        require(
            Eip712CheckerInternal._verifySignature(owner, message, signature),
            "Invalid signature"
        );

        ms.links[vehicleNftProxyAddress][vehicleNode] = aftermarketDeviceNode;
        ms.links[adNftProxyAddress][aftermarketDeviceNode] = vehicleNode;

        emit AftermarketDevicePaired(aftermarketDeviceNode, vehicleNode, owner);
    }

    /// @notice Add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param tokenId Node id where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function setAftermarketDeviceInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // TODO Check nft id ?
        _setInfo(tokenId, attrInfo);
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

    /// @dev Internal function to add infos to node
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function _setInfo(uint256 tokenId, AttributeInfoPair[] calldata attrInfo)
        private
    {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        address nftProxyAddress = ads.nftProxyAddress;

        for (uint256 i = 0; i < attrInfo.length; i++) {
            require(
                AttributeSet.exists(
                    ads.whitelistedAttributes,
                    attrInfo[i].attribute
                ),
                "Not whitelisted"
            );

            ns.nodes[nftProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;
        }
    }
}
