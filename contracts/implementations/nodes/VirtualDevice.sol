//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/IntegrationStorage.sol";
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
    bytes32 private constant PAIR_TYPEHASH =
        keccak256(
            "MintVirtualDeviceSign(uint256 integrationNode,uint256 vehicleNode,address virtualDeviceAddress)"
        );

    event VirtualDeviceIdProxySet(address indexed proxy);
    event VirtualDeviceAttributeAdded(string attribute);
    event VirtualDeviceAttributeSet(
        uint256 tokenId,
        string attribute,
        string info
    );
    event VirtualDeviceNodeMinted(
        uint256 virtualDeviceNode,
        uint256 vehicleNode,
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

    /// TODO Documentation
    function mintVirtualDeviceSign(
        uint256 integrationNode,
        uint256 vehicleNode,
        bytes calldata vehicleOwnerSig,
        VirtualDeviceInfos calldata virtualDeviceInfos
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        VirtualDeviceStorage.Storage storage vds = VirtualDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address virtualDeviceIdProxyAddress = vds.idProxyAddress;

        require(
            INFT(IntegrationStorage.getStorage().idProxyAddress).exists(
                integrationNode
            ),
            "Invalid parent node"
        );
        require(
            INFT(vehicleIdProxyAddress).exists(vehicleNode),
            "Invalid vehicle node"
        );

        address owner = INFT(vehicleIdProxyAddress).ownerOf(vehicleNode);
        uint256 newTokenId = INFT(virtualDeviceIdProxyAddress).safeMint(owner);
        bytes32 message = keccak256(
            abi.encode(
                PAIR_TYPEHASH,
                integrationNode,
                vehicleNode,
                virtualDeviceInfos.addr
            )
        );

        require(
            ms.vehicleVirtualDeviceLinks[vehicleIdProxyAddress][
                virtualDeviceIdProxyAddress
            ][vehicleNode] == 0,
            "Vehicle already paired"
        );
        require(
            Eip712CheckerInternal._verifySignature(
                owner,
                message,
                vehicleOwnerSig
            ),
            "Invalid signature"
        );

        ms.vehicleVirtualDeviceLinks[vehicleIdProxyAddress][
            virtualDeviceIdProxyAddress
        ][vehicleNode] = newTokenId;
        ms.vehicleVirtualDeviceLinks[virtualDeviceIdProxyAddress][
            vehicleIdProxyAddress
        ][newTokenId] = vehicleNode;

        vds.deviceAddressToNodeId[virtualDeviceInfos.addr] = newTokenId;
        vds.nodeIdToDeviceAddress[newTokenId] = virtualDeviceInfos.addr;

        _setInfos(newTokenId, virtualDeviceInfos.attrInfoPairs);

        emit VirtualDeviceNodeMinted(
            newTokenId,
            vehicleNode,
            virtualDeviceInfos.addr,
            owner
        );
    }

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

    /// @notice Gets the Virtual Device Id by the device address
    /// @dev If the device is not minted it will return 0
    /// @param addr Address associated with the virtual device
    function getVirtualDeviceIdByAddress(address addr)
        external
        view
        returns (uint256 nodeId)
    {
        nodeId = VirtualDeviceStorage.getStorage().deviceAddressToNodeId[addr];
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
