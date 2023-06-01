//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../Eip712/Eip712CheckerInternal.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/IntegrationStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/nodes/SyntheticDeviceStorage.sol";
import "../../libraries/MapperStorage.sol";

import "../../shared/Roles.sol" as Roles;
import "../../shared/Types.sol" as Types;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title SyntheticDevice
/// @notice Contract that represents the Synthetic Device node
/// @dev It uses the Mapper contract to link Synthetic Devices to Vehicles
contract SyntheticDevice is AccessControlInternal {
    bytes32 private constant MINT_TYPEHASH =
        keccak256(
            "MintSyntheticDeviceSign(uint256 integrationNode,uint256 vehicleNode)"
        );

    event SyntheticDeviceIdProxySet(address proxy);
    event SyntheticDeviceAttributeAdded(string attribute);
    event SyntheticDeviceAttributeSet(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event SyntheticDeviceNodeMinted(
        uint256 syntheticDeviceNode,
        uint256 indexed vehicleNode,
        address indexed syntheticDeviceAddress,
        address indexed owner
    );

    // ***** Admin management ***** //

    /// @notice Sets the NFT proxy associated with the Synthetic Device node
    /// @dev Only an admin can set the address
    /// @param addr The address of the proxy
    function setSyntheticDeviceIdProxyAddress(address addr)
        external
        onlyRole(Roles.DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        SyntheticDeviceStorage.getStorage().idProxyAddress = addr;

        emit SyntheticDeviceIdProxySet(addr);
    }

    /// @notice Adds an attribute to the whielist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addSyntheticDeviceAttribute(string calldata attribute)
        external
        onlyRole(Roles.DEFAULT_ADMIN_ROLE)
    {
        require(
            AttributeSet.add(
                SyntheticDeviceStorage.getStorage().whitelistedAttributes,
                attribute
            ),
            "Attribute already exists"
        );

        emit SyntheticDeviceAttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    /**
     * @notice Mints a synthetic device and pair it with a vehicle
     * @dev Caller must have the admin role
     * @param data input data with the following fields:
     *  integrationNode -> Parent integration node id
     *  vehicleNode -> Vehicle node id
     *  syntheticDeviceSig -> Synthetic Device's signature hash
     *  vehicleOwnerSig -> Vehicle owner signature hash
     *  syntheticDeviceAddr -> Address associated with the synthetic device
     *  attrInfoPairs -> List of attribute-info pairs to be added
     */
    function mintSyntheticDeviceSign(
        Types.MintSyntheticDeviceInput calldata data
    ) external onlyRole(Roles.DEFAULT_ADMIN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sDIdProxyAddress = sds.idProxyAddress;

        require(
            INFT(IntegrationStorage.getStorage().idProxyAddress).exists(
                data.integrationNode
            ),
            "Invalid parent node"
        );
        require(
            INFT(vehicleIdProxyAddress).exists(data.vehicleNode),
            "Invalid vehicle node"
        );
        require(
            sds.deviceAddressToNodeId[data.syntheticDeviceAddr] == 0,
            "Device address already registered"
        );
        require(
            ms.nodeLinks[vehicleIdProxyAddress][sDIdProxyAddress][
                data.vehicleNode
            ] == 0,
            "Vehicle already paired"
        );

        address owner = INFT(vehicleIdProxyAddress).ownerOf(data.vehicleNode);
        bytes32 message = keccak256(
            abi.encode(MINT_TYPEHASH, data.integrationNode, data.vehicleNode)
        );

        require(
            Eip712CheckerInternal._verifySignature(
                data.syntheticDeviceAddr,
                message,
                data.syntheticDeviceSig
            ),
            "Invalid synthetic device signature"
        );
        require(
            Eip712CheckerInternal._verifySignature(
                owner,
                message,
                data.vehicleOwnerSig
            ),
            "Invalid vehicle owner signature"
        );

        uint256 newTokenId = INFT(sDIdProxyAddress).safeMint(owner);

        ns.nodes[sDIdProxyAddress][newTokenId].parentNode = data
            .integrationNode;

        ms.nodeLinks[vehicleIdProxyAddress][sDIdProxyAddress][
            data.vehicleNode
        ] = newTokenId;
        ms.nodeLinks[sDIdProxyAddress][vehicleIdProxyAddress][newTokenId] = data
            .vehicleNode;

        sds.deviceAddressToNodeId[data.syntheticDeviceAddr] = newTokenId;
        sds.nodeIdToDeviceAddress[newTokenId] = data.syntheticDeviceAddr;

        _setInfos(newTokenId, data.attrInfoPairs);

        emit SyntheticDeviceNodeMinted(
            newTokenId,
            data.vehicleNode,
            data.syntheticDeviceAddr,
            owner
        );
    }

    /// @notice Add infos to node
    /// @dev attributes must be whitelisted
    /// @param tokenId Node id where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function setSyntheticDeviceInfo(
        uint256 tokenId,
        Types.AttributeInfoPair[] calldata attrInfo
    ) external onlyRole(Roles.DEFAULT_ADMIN_ROLE) {
        require(
            INFT(SyntheticDeviceStorage.getStorage().idProxyAddress).exists(
                tokenId
            ),
            "Invalid AD node"
        );
        _setInfos(tokenId, attrInfo);
    }

    /// @notice Gets the Synthetic Device Id by the device address
    /// @dev If the device is not minted it will return 0
    /// @param addr Address associated with the synthetic device
    function getSyntheticDeviceIdByAddress(address addr)
        external
        view
        returns (uint256 nodeId)
    {
        nodeId = SyntheticDeviceStorage.getStorage().deviceAddressToNodeId[
            addr
        ];
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /// @dev Internal function to add infos to node
    /// @dev attributes must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attrInfo List of attribute-info pairs to be added
    function _setInfos(
        uint256 tokenId,
        Types.AttributeInfoPair[] calldata attrInfo
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        address idProxyAddress = sds.idProxyAddress;

        for (uint256 i = 0; i < attrInfo.length; i++) {
            require(
                AttributeSet.exists(
                    sds.whitelistedAttributes,
                    attrInfo[i].attribute
                ),
                "Not whitelisted"
            );

            ns.nodes[idProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;

            emit SyntheticDeviceAttributeSet(
                tokenId,
                attrInfo[i].attribute,
                attrInfo[i].info
            );
        }
    }
}
