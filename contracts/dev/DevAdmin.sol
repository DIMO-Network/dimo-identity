//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../libraries/MapperStorage.sol";
import "../libraries/NodesStorage.sol";
import "../libraries/nodes/ManufacturerStorage.sol";
import "../libraries/nodes/VehicleStorage.sol";
import "../libraries/nodes/AftermarketDeviceStorage.sol";
import "../libraries/nodes/SyntheticDeviceStorage.sol";

import "../shared/Roles.sol";
import "../shared/Errors.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error AdNotClaimed(uint256 id);
error AdPaired(uint256 id);

/**
 * @title DevAdmin
 * @dev Admin module for development and testing
 */
contract DevAdmin is AccessControlInternal {
    event AftermarketDeviceUnclaimedDevAdmin(
        uint256 indexed aftermarketDeviceNode
    );
    event AftermarketDeviceTransferredDevAdmin(
        uint256 indexed aftermarketDeviceNode,
        address indexed oldOwner,
        address indexed newOwner
    );
    event AftermarketDeviceUnpairedDevAdmin(
        uint256 indexed aftermarketDeviceNode,
        uint256 indexed vehicleNode,
        address indexed owner
    );
    event VehicleNodeBurnedDevAdmin(
        uint256 indexed vehicleNode,
        address indexed owner
    );
    event AftermarketDeviceNodeBurnedDevAdmin(
        uint256 indexed adNode,
        address indexed owner
    );
    event SyntheticDeviceNodeBurnedDevAdmin(
        uint256 indexed syntheticDeviceNode,
        uint256 indexed vehicleNode,
        address indexed owner
    );
    event VehicleAttributeSetDevAdmin(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event AftermarketDeviceAttributeSetDevAdmin(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event SyntheticDeviceAttributeSetDevAdmin(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event AftermarketDevicePaired(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        address indexed owner
    );

    struct IdManufacturerName {
        uint256 tokenId;
        string name;
    }

    /**
     * @dev Transfers the ownership of an afermarket device
     * @dev Caller must have the DEV_AD_TRANSFER_ROLE role
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param newOwner The address of the new owner
     */
    function transferAftermarketDeviceOwnership(
        uint256 aftermarketDeviceNode,
        address newOwner
    ) external onlyRole(DEV_AD_TRANSFER_ROLE) {
        INFT adIdProxy = INFT(
            AftermarketDeviceStorage.getStorage().idProxyAddress
        );
        require(adIdProxy.exists(aftermarketDeviceNode), "Invalid AD node");

        address oldOwner = adIdProxy.ownerOf(aftermarketDeviceNode);

        adIdProxy.safeTransferFrom(oldOwner, newOwner, aftermarketDeviceNode);

        emit AftermarketDeviceTransferredDevAdmin(
            aftermarketDeviceNode,
            oldOwner,
            newOwner
        );
    }

    /**
     * @dev Sets deviceClaimed to false for each aftermarket device
     * @dev Caller must have the DEV_AD_UNCLAIM_ROLE role
     * @param aftermarketDeviceNodes Array of aftermarket device node ids
     */
    function unclaimAftermarketDeviceNode(
        uint256[] calldata aftermarketDeviceNodes
    ) external onlyRole(DEV_AD_UNCLAIM_ROLE) {
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        INFT adIdProxy = INFT(ads.idProxyAddress);

        uint256 _adNode;
        for (uint256 i = 0; i < aftermarketDeviceNodes.length; i++) {
            require(
                adIdProxy.exists(aftermarketDeviceNodes[i]),
                "Invalid AD node"
            );

            _adNode = aftermarketDeviceNodes[i];

            ads.deviceClaimed[_adNode] = false;

            emit AftermarketDeviceUnclaimedDevAdmin(_adNode);
        }
    }

    /**
     * @dev Unpairs a list of aftermarket device from their respective vehicles by the device node
     * @dev Caller must have the DEV_AD_UNPAIR_ROLE role
     * @param aftermarketDeviceNodes Array of aftermarket device node ids
     */
    function unpairAftermarketDeviceByDeviceNode(
        uint256[] calldata aftermarketDeviceNodes
    ) external onlyRole(DEV_AD_UNPAIR_ROLE) {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;

        uint256 _adNode;
        uint256 _vehicleNode;
        for (uint256 i = 0; i < aftermarketDeviceNodes.length; i++) {
            _adNode = aftermarketDeviceNodes[i];

            require(
                INFT(adIdProxyAddress).exists(aftermarketDeviceNodes[i]),
                "Invalid AD node"
            );

            // Check AD pairing
            _vehicleNode = ms.links[adIdProxyAddress][_adNode];

            delete ms.links[vehicleIdProxyAddress][_vehicleNode];
            delete ms.links[adIdProxyAddress][_adNode];

            emit AftermarketDeviceUnpairedDevAdmin(
                _adNode,
                _vehicleNode,
                INFT(adIdProxyAddress).ownerOf(_adNode)
            );
        }
    }

    /**
     * @dev Unpairs a list of aftermarket devices from their respective vehicles by the vehicle node ids
     * @dev Caller must have the DEV_AD_UNPAIR_ROLE role
     * @param vehicleNodes Array of vehicle node id
     */
    function unpairAftermarketDeviceByVehicleNode(
        uint256[] calldata vehicleNodes
    ) external onlyRole(DEV_AD_UNPAIR_ROLE) {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;

        uint256 _adNode;
        uint256 _vehicleNode;
        for (uint256 i = 0; i < vehicleNodes.length; i++) {
            _vehicleNode = vehicleNodes[i];

            require(
                INFT(vehicleIdProxyAddress).exists(vehicleNodes[i]),
                "Invalid vehicle node"
            );

            // Check AD pairing
            _adNode = ms.links[vehicleIdProxyAddress][_vehicleNode];

            delete ms.links[vehicleIdProxyAddress][_vehicleNode];
            delete ms.links[adIdProxyAddress][_adNode];

            emit AftermarketDeviceUnpairedDevAdmin(
                _adNode,
                _vehicleNode,
                INFT(vehicleIdProxyAddress).ownerOf(_vehicleNode)
            );
        }
    }

    /**
     * @notice Renames manufacturer name
     * @param idManufacturerNames pairs token id to manufactures to be renamed
     */
    function renameManufacturers(
        IdManufacturerName[] calldata idManufacturerNames
    ) external onlyRole(DEV_RENAME_MANUFACTURERS_ROLE) {
        ManufacturerStorage.Storage storage ms = ManufacturerStorage
            .getStorage();

        uint256 tokenId;
        string memory name;
        for (uint256 i = 0; i < idManufacturerNames.length; i++) {
            tokenId = idManufacturerNames[i].tokenId;
            name = idManufacturerNames[i].name;

            require(
                INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                    tokenId
                ),
                "Invalid manufacturer node"
            );

            ms.manufacturerNameToNodeId[name] = tokenId;
            ms.nodeIdToManufacturerName[tokenId] = name;
        }
    }

    /**
     * @notice Admin function to burn a list of vehicles and reset all its attributes
     * @dev It reverts if any vehicle doesn't exist or is paired
     * @dev Caller must have the DEV_VEHICLE_BURN_ROLE role
     * @dev This contract has the BURNER_ROLE in the VehicleId
     * @param tokenIds List of vehicle node ids
     */
    function adminBurnVehicles(
        uint256[] calldata tokenIds
    ) external onlyRole(DEV_VEHICLE_BURN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = SyntheticDeviceStorage
            .getStorage()
            .idProxyAddress;

        uint256 tokenId;
        address owner;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];

            if (!INFT(vehicleIdProxyAddress).exists(tokenId))
                revert InvalidNode(vehicleIdProxyAddress, tokenId);
            // Check AD pairing
            if (ms.links[vehicleIdProxyAddress][tokenId] != 0)
                revert VehiclePaired(tokenId);
            // Check SD pairing
            if (
                ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
                    tokenId
                ] != 0
            ) revert VehiclePaired(tokenId);

            owner = INFT(vehicleIdProxyAddress).ownerOf(tokenId);

            delete ns.nodes[vehicleIdProxyAddress][tokenId].parentNode;

            emit VehicleNodeBurnedDevAdmin(tokenId, owner);

            INFT(vehicleIdProxyAddress).burn(tokenId);

            _resetVehicleInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of vehicles and reset all its attributes and links
     * @dev Caller must have the DEV_VEHICLE_BURN_ROLE role
     * @dev This contract has the BURNER_ROLE in the VehicleId and SyntheticDeviceId
     * @param tokenIds List of vehicle node ids
     */
    function adminBurnVehiclesAndDeletePairings(
        uint256[] calldata tokenIds
    ) external onlyRole(DEV_VEHICLE_BURN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = SyntheticDeviceStorage
            .getStorage()
            .idProxyAddress;

        uint256 tokenId;
        uint256 pairedDeviceNode;
        address owner;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];

            if (!INFT(vehicleIdProxyAddress).exists(tokenId))
                revert InvalidNode(vehicleIdProxyAddress, tokenId);

            owner = INFT(vehicleIdProxyAddress).ownerOf(tokenId);

            // Check AD pairing
            pairedDeviceNode = ms.links[vehicleIdProxyAddress][tokenId];
            if (pairedDeviceNode != 0) {
                delete ms.links[vehicleIdProxyAddress][tokenId];
                delete ms.links[adIdProxyAddress][pairedDeviceNode];

                emit AftermarketDeviceUnpairedDevAdmin(
                    pairedDeviceNode,
                    tokenId,
                    owner
                );
            }

            // Check SD pairing
            pairedDeviceNode = ms.nodeLinks[vehicleIdProxyAddress][
                sdIdProxyAddress
            ][tokenId];
            if (pairedDeviceNode != 0) {
                delete ns.nodes[sdIdProxyAddress][pairedDeviceNode].parentNode;

                delete ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
                    tokenId
                ];
                delete ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
                    pairedDeviceNode
                ];

                delete sds.deviceAddressToNodeId[
                    sds.nodeIdToDeviceAddress[pairedDeviceNode]
                ];
                delete sds.nodeIdToDeviceAddress[pairedDeviceNode];

                INFT(sdIdProxyAddress).burn(pairedDeviceNode);

                emit SyntheticDeviceNodeBurnedDevAdmin(
                    pairedDeviceNode,
                    tokenId,
                    owner
                );

                _resetSdInfos(pairedDeviceNode);
            }

            delete ns.nodes[vehicleIdProxyAddress][tokenId].parentNode;

            emit VehicleNodeBurnedDevAdmin(tokenId, owner);

            INFT(vehicleIdProxyAddress).burn(tokenId);

            _resetVehicleInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of aftermarket devices and reset all its attributes
     * @dev It reverts if any aftermarket device doesn't exist or is paired
     * @dev Caller must have the DEV_AD_BURN_ROLE
     * @dev This contract has the BURNER_ROLE in the AftermarketDeviceId
     * @param tokenIds List of aftermarket device node ids
     */
    function adminBurnAftermarketDevices(
        uint256[] calldata tokenIds
    ) external onlyRole(DEV_AD_BURN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();

        address adIdProxyAddress = ads.idProxyAddress;

        uint256 tokenId;
        address owner;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];

            if (!INFT(adIdProxyAddress).exists(tokenId))
                revert InvalidNode(adIdProxyAddress, tokenId);
            // Check AD pairing
            if (ms.links[adIdProxyAddress][tokenId] != 0)
                revert AdPaired(tokenId);

            owner = INFT(adIdProxyAddress).ownerOf(tokenId);

            delete ns.nodes[adIdProxyAddress][tokenId].parentNode;
            delete ads.deviceClaimed[tokenId];
            delete ads.deviceAddressToNodeId[
                ads.nodeIdToDeviceAddress[tokenId]
            ];
            delete ads.nodeIdToDeviceAddress[tokenId];

            emit AftermarketDeviceNodeBurnedDevAdmin(tokenId, owner);

            INFT(adIdProxyAddress).burn(tokenId);

            _resetAdInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of aftermarket devices and reset all its attributes and links
     * @dev It reverts if any aftermarket device doesn't exist
     * @dev Caller must have the DEV_AD_BURN_ROLE
     * @param tokenIds List of aftermarket device node ids
     */
    function adminBurnAftermarketDevicesAndDeletePairings(
        uint256[] calldata tokenIds
    ) external onlyRole(DEV_AD_BURN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = ads.idProxyAddress;

        uint256 tokenId;
        uint256 pairedVehicleNode;
        address owner;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];

            if (!INFT(adIdProxyAddress).exists(tokenId))
                revert InvalidNode(adIdProxyAddress, tokenId);

            owner = INFT(adIdProxyAddress).ownerOf(tokenId);

            // Check Vehicle pairing
            pairedVehicleNode = ms.links[adIdProxyAddress][tokenId];
            if (pairedVehicleNode != 0) {
                delete ms.links[vehicleIdProxyAddress][pairedVehicleNode];
                delete ms.links[adIdProxyAddress][tokenId];

                emit AftermarketDeviceUnpairedDevAdmin(
                    tokenId,
                    pairedVehicleNode,
                    owner
                );
            }

            delete ns.nodes[adIdProxyAddress][tokenId].parentNode;
            delete ads.deviceClaimed[tokenId];
            delete ads.deviceAddressToNodeId[
                ads.nodeIdToDeviceAddress[tokenId]
            ];
            delete ads.nodeIdToDeviceAddress[tokenId];

            emit AftermarketDeviceNodeBurnedDevAdmin(tokenId, owner);

            INFT(adIdProxyAddress).burn(tokenId);

            _resetAdInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of synthetic devices and reset all its attributes and links is exist
     * @dev Caller must have the DEV_SD_BURN_ROLE role
     * @dev This contract has the BURNER_ROLE in the SyntheticDeviceId
     * @param tokenIds List of synthetic device ids
     */
    function adminBurnSyntheticDevicesAndDeletePairings(
        uint256[] calldata tokenIds
    ) external onlyRole(DEV_SD_BURN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address sdIdProxyAddress = SyntheticDeviceStorage
            .getStorage()
            .idProxyAddress;

        uint256 tokenId;
        uint256 pairedVehicleNode;
        address owner;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenId = tokenIds[i];

            if (!INFT(sdIdProxyAddress).exists(tokenId))
                revert InvalidNode(sdIdProxyAddress, tokenId);

            owner = INFT(sdIdProxyAddress).ownerOf(tokenId);

            // Check Vehicle pairing
            pairedVehicleNode = ms.nodeLinks[sdIdProxyAddress][
                vehicleIdProxyAddress
            ][tokenId];
            if (pairedVehicleNode != 0) {
                delete ms.nodeLinks[vehicleIdProxyAddress][sdIdProxyAddress][
                    pairedVehicleNode
                ];
                delete ms.nodeLinks[sdIdProxyAddress][vehicleIdProxyAddress][
                    tokenId
                ];
            }

            delete ns.nodes[sdIdProxyAddress][tokenId].parentNode;

            delete sds.deviceAddressToNodeId[
                sds.nodeIdToDeviceAddress[tokenId]
            ];
            delete sds.nodeIdToDeviceAddress[tokenId];

            INFT(sdIdProxyAddress).burn(tokenId);

            emit SyntheticDeviceNodeBurnedDevAdmin(
                tokenId,
                pairedVehicleNode,
                owner
            );

            _resetSdInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to pair an aftermarket device with a vehicle
     * @dev Caller must have the DEV_AD_PAIR role
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param vehicleNode Vehicle node id
     */
    function adminPairAftermarketDevice(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode
    ) external onlyRole(DEV_AD_PAIR_ROLE) {
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        address adIdProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;

        if (!INFT(vehicleIdProxyAddress).exists(vehicleNode))
            revert InvalidNode(vehicleIdProxyAddress, vehicleNode);
        if (!INFT(adIdProxyAddress).exists(aftermarketDeviceNode))
            revert InvalidNode(adIdProxyAddress, aftermarketDeviceNode);
        if (
            !AftermarketDeviceStorage.getStorage().deviceClaimed[
                aftermarketDeviceNode
            ]
        ) revert AdNotClaimed(aftermarketDeviceNode);

        if (ms.links[vehicleIdProxyAddress][vehicleNode] != 0)
            revert VehiclePaired(vehicleNode);
        if (ms.links[adIdProxyAddress][aftermarketDeviceNode] != 0)
            revert AdPaired(aftermarketDeviceNode);

        ms.links[vehicleIdProxyAddress][vehicleNode] = aftermarketDeviceNode;
        ms.links[adIdProxyAddress][aftermarketDeviceNode] = vehicleNode;

        emit AftermarketDevicePaired(
            aftermarketDeviceNode,
            vehicleNode,
            INFT(vehicleIdProxyAddress).ownerOf(vehicleNode)
        );
    }

    /**
     * @notice Admin function change the parent node of nodes
     * @dev Caller must have the DEV_CHANGE_PARENT_NODE role
     * @param newParentNode The new parent node to be applied to all nodes
     * @param idProxyAddress The NFT proxy address of the nodes to be modified
     * @param nodeIdList The list of node IDs to be modified
     */
    function adminChangeParentNode(
        uint256 newParentNode,
        address idProxyAddress,
        uint256[] calldata nodeIdList
    ) external onlyRole(DEV_CHANGE_PARENT_NODE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        INFT manufacturerIdInstance = INFT(
            ManufacturerStorage.getStorage().idProxyAddress
        );
        INFT adIdInstance = INFT(
            AftermarketDeviceStorage.getStorage().idProxyAddress
        );

        if (!manufacturerIdInstance.exists(newParentNode)) {
            revert InvalidNode(address(manufacturerIdInstance), newParentNode);
        }

        for (uint256 i = 0; i < nodeIdList.length; i++) {
            if (!adIdInstance.exists(nodeIdList[i]))
                revert InvalidNode(address(adIdInstance), nodeIdList[i]);

            ns.nodes[idProxyAddress][nodeIdList[i]].parentNode = newParentNode;
        }
    }

    /**
     * @dev Internal function to reset vehicle node infos
     * It iterates over all whitelisted attributes to reset each info
     * @param tokenId Node which will have the infos reset
     */
    function _resetVehicleInfos(uint256 tokenId) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage vds = VehicleStorage.getStorage();
        address idProxyAddress = vds.idProxyAddress;
        string[] memory attributes = AttributeSet.values(
            vds.whitelistedAttributes
        );

        for (
            uint256 i = 0;
            i < AttributeSet.count(vds.whitelistedAttributes);
            i++
        ) {
            delete ns.nodes[idProxyAddress][tokenId].info[attributes[i]];

            emit VehicleAttributeSetDevAdmin(tokenId, attributes[i], "");
        }
    }

    /**
     * @dev Internal function to reset AD node infos
     * It iterates over all whitelisted attributes to reset each info
     * @param tokenId Node which will have the infos reset
     */
    function _resetAdInfos(uint256 tokenId) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        AftermarketDeviceStorage.Storage storage ads = AftermarketDeviceStorage
            .getStorage();
        address idProxyAddress = ads.idProxyAddress;
        string[] memory attributes = AttributeSet.values(
            ads.whitelistedAttributes
        );

        for (
            uint256 i = 0;
            i < AttributeSet.count(ads.whitelistedAttributes);
            i++
        ) {
            delete ns.nodes[idProxyAddress][tokenId].info[attributes[i]];

            emit AftermarketDeviceAttributeSetDevAdmin(
                tokenId,
                attributes[i],
                ""
            );
        }
    }

    /**
     * @dev Internal function to reset SD node infos
     * It iterates over all whitelisted attributes to reset each info
     * @param tokenId Node which will have the infos reset
     */
    function _resetSdInfos(uint256 tokenId) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        address idProxyAddress = sds.idProxyAddress;
        string[] memory attributes = AttributeSet.values(
            sds.whitelistedAttributes
        );

        for (uint256 i = 0; i < attributes.length; i++) {
            delete ns.nodes[idProxyAddress][tokenId].info[attributes[i]];

            emit SyntheticDeviceAttributeSetDevAdmin(
                tokenId,
                attributes[i],
                ""
            );
        }
    }
}
