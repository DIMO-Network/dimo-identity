//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/VirtualDeviceStorage.sol";
import "../../libraries/MapperStorage.sol";

import "../../shared/Roles.sol";
import "../../shared/Types.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title VirtualDevice
/// @notice Contract that represents the Virtual Device node
/// @dev It uses the Mapper contract to link Virtual Devices to Vehicles
contract VirtualDevice is AccessControlInternal {
    event VirtualDeviceIdProxySet(address indexed proxy);
    event VirtualDeviceAttributeAdded(string attribute);
    event VirtualDeviceAttributeSet(
        uint256 tokenId,
        string attribute,
        string info
    );
    event VirtualDeviceNodeMinted(
        uint256 tokenId,
        address indexed virtualDeviceAddress,
        address indexed owner
    );

    // ***** Admin management ***** //

    /// @notice Sets the NFT proxy associated with the Virtual Device node
    /// @dev Only an admin can set the address
    /// @param addr The address of the proxy
    function setVirtualDeviceIdProxyAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        VirtualDeviceStorage.getStorage().idProxyAddress = addr;

        emit VirtualDeviceIdProxySet(addr);
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addVirtualDeviceAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            AttributeSet.add(
                VirtualDeviceStorage.getStorage().whitelistedAttributes,
                attribute
            ),
            "Attribute already exists"
        );

        emit VirtualDeviceAttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    // /// @notice Mints aftermarket devices in batch
    // /// @dev Caller must have the manufacturer role
    // /// @param adInfos List of attribute-info pairs and addresses associated with the AD to be added
    // function mintAftermarketDeviceByManufacturerBatch(
    //     uint256 manufacturerNode,
    //     AftermarketDeviceInfos[] calldata adInfos
    // ) external onlyRole(MANUFACTURER_ROLE) {
    //     NodesStorage.Storage storage ns = NodesStorage.getStorage();
    //     AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
    //         .getStorage();
    //     uint256 devicesAmount = adInfos.length;
    //     address adIdProxyAddress = ads.idProxyAddress;
    //     INFT manufacturerIdProxy = INFT(
    //         ManufacturerStorage.getStorage().idProxyAddress
    //     );

    //     require(
    //         INFT(adIdProxyAddress).isApprovedForAll(msg.sender, address(this)),
    //         "Registry must be approved for all"
    //     );
    //     require(
    //         manufacturerIdProxy.exists(manufacturerNode),
    //         "Invalid parent node"
    //     );
    //     require(
    //         manufacturerIdProxy.ownerOf(manufacturerNode) == msg.sender,
    //         "Caller must be the parent node owner"
    //     );

    //     uint256 newTokenId;
    //     address deviceAddress;

    //     for (uint256 i = 0; i < devicesAmount; i++) {
    //         newTokenId = INFT(adIdProxyAddress).safeMint(msg.sender);

    //         ns
    //         .nodes[adIdProxyAddress][newTokenId].parentNode = manufacturerNode;

    //         deviceAddress = adInfos[i].addr;
    //         require(
    //             ads.deviceAddressToNodeId[deviceAddress] == 0,
    //             "Device address already registered"
    //         );

    //         ads.deviceAddressToNodeId[deviceAddress] = newTokenId;
    //         ads.nodeIdToDeviceAddress[newTokenId] = deviceAddress;

    //         _setInfos(newTokenId, adInfos[i].attrInfoPairs);

    //         emit VirtualDeviceNodeMinted(
    //             newTokenId,
    //             deviceAddress,
    //             msg.sender
    //         );
    //     }

    //     // Validate request and transfer funds to foundation
    //     // This transfer is at the end of the function to prevent reentrancy
    //     _validateMintRequest(msg.sender, devicesAmount);
    // }

    /// @notice Add infos to node
    /// @dev attributes must be whitelisted
    /// @param tokenId Node id where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function setVirtualDeviceInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            INFT(VirtualDeviceStorage.getStorage().idProxyAddress).exists(
                tokenId
            ),
            "Invalid AD node"
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
        VirtualDeviceStorage.Storage storage vds = VirtualDeviceStorage
            .getStorage();
        address idProxyAddress = vds.idProxyAddress;

        for (uint256 i = 0; i < attrInfo.length; i++) {
            require(
                AttributeSet.exists(
                    vds.whitelistedAttributes,
                    attrInfo[i].attribute
                ),
                "Not whitelisted"
            );

            ns.nodes[idProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;

            emit VirtualDeviceAttributeSet(
                tokenId,
                attrInfo[i].attribute,
                attrInfo[i].info
            );
        }
    }

    /// @dev Internal function to set a single attribute
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
        VirtualDeviceStorage.Storage storage vds = VirtualDeviceStorage
            .getStorage();
        require(
            AttributeSet.exists(vds.whitelistedAttributes, attribute),
            "Not whitelisted"
        );
        address idProxyAddress = vds.idProxyAddress;

        ns.nodes[idProxyAddress][tokenId].info[attribute] = info;

        emit VirtualDeviceAttributeSet(tokenId, attribute, info);
    }
}
