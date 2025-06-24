//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../interfaces/IStreamRegistry.sol";
import "../libraries/MapperStorage.sol";
import "../libraries/NodesStorage.sol";
import "../libraries/SharedStorage.sol";
import "../libraries/nodes/AftermarketDeviceStorage.sol";
import "../libraries/nodes/IntegrationStorage.sol";
import "../libraries/nodes/ManufacturerStorage.sol";
import "../libraries/nodes/SyntheticDeviceStorage.sol";
import "../libraries/nodes/VehicleStorage.sol";
import "../libraries/streamr/StreamrConfiguratorStorage.sol";

import "../shared/Roles.sol";
import "../shared/Errors.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title DevAdmin
 * @dev Admin module for development and testing
 */
contract DevAdmin is AccessControlInternal {
    struct IdManufacturerName {
        uint256 tokenId;
        string name;
    }
    struct VehicleIdDeviceDefinitionId {
        uint256 vehicleId;
        string deviceDefinitionId;
    }

    event AftermarketDeviceUnclaimed(uint256 indexed aftermarketDeviceNode);
    event AftermarketDeviceTransferred(
        uint256 indexed aftermarketDeviceNode,
        address indexed oldOwner,
        address indexed newOwner
    );
    event AftermarketDeviceUnpaired(
        uint256 indexed aftermarketDeviceNode,
        uint256 indexed vehicleNode,
        address indexed owner
    );
    event VehicleNodeBurned(uint256 indexed vehicleNode, address indexed owner);
    event AftermarketDeviceNodeBurned(
        uint256 indexed adNode,
        address indexed owner
    );
    event SyntheticDeviceNodeBurned(
        uint256 indexed syntheticDeviceNode,
        uint256 indexed vehicleNode,
        address indexed owner
    );
    event VehicleAttributeSet(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event AftermarketDeviceAttributeSet(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event SyntheticDeviceAttributeSet(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event AftermarketDevicePaired(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode,
        address indexed owner
    );
    event VehicleAttributeRemoved(string attribute);
    event DeviceDefinitionIdSet(uint256 indexed vehicleId, string ddId);

    error AdNotClaimed(uint256 id);
    error AdPaired(uint256 id);

    modifier authorized(bytes32 role) {
        if (!_hasRole(DEV_SUPER_ADMIN_ROLE, msg.sender)) {
            _checkRole(role, msg.sender);
        }
        _;
    }

    /**
     * @dev Transfers the ownership of an afermarket device
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_AD_TRANSFER_ROLE roles
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param newOwner The address of the new owner
     */
    function transferAftermarketDeviceOwnership(
        uint256 aftermarketDeviceNode,
        address newOwner
    ) external authorized(DEV_AD_TRANSFER_ROLE) {
        INFT adIdProxy = INFT(
            AftermarketDeviceStorage.getStorage().idProxyAddress
        );
        require(adIdProxy.exists(aftermarketDeviceNode), "Invalid AD node");

        address oldOwner = adIdProxy.ownerOf(aftermarketDeviceNode);

        adIdProxy.safeTransferFrom(oldOwner, newOwner, aftermarketDeviceNode);

        emit AftermarketDeviceTransferred(
            aftermarketDeviceNode,
            oldOwner,
            newOwner
        );
    }

    /**
     * @dev Sets deviceClaimed to false for each aftermarket device
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_AD_UNCLAIM_ROLE roles
     * @param aftermarketDeviceNodes Array of aftermarket device node ids
     */
    function unclaimAftermarketDeviceNode(
        uint256[] calldata aftermarketDeviceNodes
    ) external authorized(DEV_AD_UNCLAIM_ROLE) {
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

            emit AftermarketDeviceUnclaimed(_adNode);
        }
    }

    /**
     * @dev Unpairs a list of aftermarket device from their respective vehicles by the device node
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_AD_UNPAIR_ROLE roles
     * @param aftermarketDeviceNodes Array of aftermarket device node ids
     */
    function unpairAftermarketDeviceByDeviceNode(
        uint256[] calldata aftermarketDeviceNodes
    ) external authorized(DEV_AD_UNPAIR_ROLE) {
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

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                INFT(adIdProxyAddress).ownerOf(_adNode)
            );
        }
    }

    /**
     * @dev Unpairs a list of aftermarket devices from their respective vehicles by the vehicle node ids
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_AD_UNPAIR_ROLE roles
     * @param vehicleNodes Array of vehicle node id
     */
    function unpairAftermarketDeviceByVehicleNode(
        uint256[] calldata vehicleNodes
    ) external authorized(DEV_AD_UNPAIR_ROLE) {
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

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                INFT(vehicleIdProxyAddress).ownerOf(_vehicleNode)
            );
        }
    }

    /**
     * @notice Renames manufacturer name
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_RENAME_MANUFACTURERS_ROLE roles
     * @param idManufacturerNames pairs token id to manufactures to be renamed
     */
    function renameManufacturers(
        IdManufacturerName[] calldata idManufacturerNames
    ) external authorized(DEV_RENAME_MANUFACTURERS_ROLE) {
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
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_VEHICLE_BURN_ROLE roles
     * @dev This contract has the BURNER_ROLE in the VehicleId
     * @param tokenIds List of vehicle node ids
     */
    function adminBurnVehicles(
        uint256[] calldata tokenIds
    ) external authorized(DEV_VEHICLE_BURN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
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
            delete vs.vehicleIdToDeviceDefinitionId[tokenId];

            emit VehicleNodeBurned(tokenId, owner);

            INFT(vehicleIdProxyAddress).burn(tokenId);

            _resetVehicleInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of vehicles and reset all its attributes and links
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_VEHICLE_BURN_ROLE roles
     * @dev This contract has the BURNER_ROLE in the VehicleId and SyntheticDeviceId
     * @param tokenIds List of vehicle node ids
     */
    function adminBurnVehiclesAndDeletePairings(
        uint256[] calldata tokenIds
    ) external authorized(DEV_VEHICLE_BURN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;
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

                emit AftermarketDeviceUnpaired(
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

                emit SyntheticDeviceNodeBurned(
                    pairedDeviceNode,
                    tokenId,
                    owner
                );

                _resetSdInfos(pairedDeviceNode);
            }

            delete ns.nodes[vehicleIdProxyAddress][tokenId].parentNode;
            delete vs.vehicleIdToDeviceDefinitionId[tokenId];

            emit VehicleNodeBurned(tokenId, owner);

            INFT(vehicleIdProxyAddress).burn(tokenId);

            _resetVehicleInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of aftermarket devices and reset all its attributes
     * @dev It reverts if any aftermarket device doesn't exist or is paired
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_AD_BURN_ROLE
     * @dev This contract has the BURNER_ROLE in the AftermarketDeviceId
     * @param tokenIds List of aftermarket device node ids
     */
    function adminBurnAftermarketDevices(
        uint256[] calldata tokenIds
    ) external authorized(DEV_AD_BURN_ROLE) {
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

            emit AftermarketDeviceNodeBurned(tokenId, owner);

            INFT(adIdProxyAddress).burn(tokenId);

            _resetAdInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of aftermarket devices and reset all its attributes and links
     * @dev It reverts if any aftermarket device doesn't exist
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_AD_BURN_ROLE
     * @param tokenIds List of aftermarket device node ids
     */
    function adminBurnAftermarketDevicesAndDeletePairings(
        uint256[] calldata tokenIds
    ) external authorized(DEV_AD_BURN_ROLE) {
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

                emit AftermarketDeviceUnpaired(
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

            emit AftermarketDeviceNodeBurned(tokenId, owner);

            INFT(adIdProxyAddress).burn(tokenId);

            _resetAdInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to burn a list of synthetic devices and reset all its attributes and links is exist
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_SD_BURN_ROLE roles
     * @dev This contract has the BURNER_ROLE in the SyntheticDeviceId
     * @param tokenIds List of synthetic device ids
     */
    function adminBurnSyntheticDevicesAndDeletePairings(
        uint256[] calldata tokenIds
    ) external authorized(DEV_SD_BURN_ROLE) {
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

            emit SyntheticDeviceNodeBurned(tokenId, pairedVehicleNode, owner);

            _resetSdInfos(tokenId);
        }
    }

    /**
     * @notice Admin function to pair an aftermarket device with a vehicle
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_AD_PAIR roles
     * @param aftermarketDeviceNode Aftermarket device node id
     * @param vehicleNode Vehicle node id
     */
    function adminPairAftermarketDevice(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode
    ) external authorized(DEV_AD_PAIR_ROLE) {
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
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_CHANGE_PARENT_NODE roles
     * @param newParentNode The new parent node to be applied to all nodes
     * @param idProxyAddress The NFT proxy address of the nodes to be modified
     * @param nodeIdList The list of node IDs to be modified
     */
    function adminChangeParentNode(
        uint256 newParentNode,
        address idProxyAddress,
        uint256[] calldata nodeIdList
    ) external authorized(DEV_CHANGE_PARENT_NODE) {
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
     * @notice Admin function to create the base stream on Streamr network and populates their ENS cache
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_CACHE_ENS roles
     */
    function adminCacheDimoStreamrEns() external authorized(DEV_CACHE_ENS) {
        string memory dimoStreamrEns = StreamrConfiguratorStorage
            .getStorage()
            .dimoStreamrEns;
        IStreamRegistry streamRegistry = IStreamRegistry(
            StreamrConfiguratorStorage.getStorage().streamRegistry
        );

        streamRegistry.createStreamWithENS(dimoStreamrEns, "/vehicles/", "{}");
    }

    /**
     * @notice Admin function remove a vehicle node attribute
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_REMOVE_ATTR roles
     */
    function adminRemoveVehicleAttribute(
        string calldata attribute
    ) external authorized(DEV_REMOVE_ATTR) {
        if (
            AttributeSet.remove(
                VehicleStorage.getStorage().whitelistedAttributes,
                attribute
            )
        ) emit VehicleAttributeRemoved(attribute);
    }

    /**
     * @notice Admin function add device definition to existing vehicles
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_SET_DD roles
     */
    function adminSetVehicleDDs(
        VehicleIdDeviceDefinitionId[] calldata vehicleIdDdId
    ) external authorized(DEV_SET_DD) {
        VehicleStorage.Storage storage vs = VehicleStorage.getStorage();

        address vehicleIdProxyAddress = vs.idProxyAddress;

        uint256 vehicleId;
        string memory ddId;
        for (uint256 i = 0; i < vehicleIdDdId.length; i++) {
            vehicleId = vehicleIdDdId[i].vehicleId;
            ddId = vehicleIdDdId[i].deviceDefinitionId;

            if (!INFT(vehicleIdProxyAddress).exists(vehicleId))
                revert InvalidNode(vehicleIdProxyAddress, vehicleId);

            vs.vehicleIdToDeviceDefinitionId[vehicleId] = ddId;

            emit DeviceDefinitionIdSet(vehicleId, ddId);
        }
    }

    /**
     * @notice Admin function to migrate synthetic device parent nodes from integration to connection
     * @dev Caller must have the DEV_SUPER_ADMIN_ROLE or DEV_MIGRATE_SD_PARENTS role
     * @dev Migrates synthetic devices that currently have an integration parent to a connection parent
     * @dev Reverts if any synthetic device doesn't exist or doesn't have the specified integration parent
     * @param sdIds Array of synthetic device node ids to migrate
     * @param integrationIdParent The current integration parent node id that all synthetic devices must have
     * @param connectionIdParent The new connection parent node id to assign to all synthetic devices
     */
    function adminMigrateSdParents(
        uint256[] calldata sdIds,
        uint256 integrationIdParent,
        uint256 connectionIdParent
    ) external authorized(DEV_MIGRATE_SD_PARENTS) {
        IntegrationStorage.Storage
            storage integrationStorage = IntegrationStorage.getStorage();
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        SharedStorage.Storage storage sharedStorage = SharedStorage
            .getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();

        address connectionsManagerAddress = sharedStorage.connectionsManager;
        address integrationIdAddress = integrationStorage.idProxyAddress;
        address sdIdProxyAddress = sds.idProxyAddress;

        if (!INFT(integrationIdAddress).exists(integrationIdParent))
            revert InvalidNode(integrationIdAddress, integrationIdParent);
        if (!INFT(connectionsManagerAddress).exists(connectionIdParent))
            revert InvalidNode(connectionsManagerAddress, connectionIdParent);

        uint256 sdId;
        for (uint256 i = 0; i < sdIds.length; i++) {
            sdId = sdIds[i];

            if (!INFT(sdIdProxyAddress).exists(sdId))
                revert InvalidNode(sdIdProxyAddress, sdId);
            if (
                ns.nodes[sdIdProxyAddress][sdId].parentNode !=
                integrationIdParent
            ) {
                revert InvalidParentNode(
                    ns.nodes[sdIdProxyAddress][sdId].parentNode
                );
            }

            ns.nodes[sdIdProxyAddress][sdId].parentNode = connectionIdParent;
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

            emit VehicleAttributeSet(tokenId, attributes[i], "");
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

            emit AftermarketDeviceAttributeSet(tokenId, attributes[i], "");
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

            emit SyntheticDeviceAttributeSet(tokenId, attributes[i], "");
        }
    }
}
