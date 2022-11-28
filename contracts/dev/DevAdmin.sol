//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../libraries/MapperStorage.sol";
import "../libraries/NodesStorage.sol";
import "../libraries/nodes/VehicleStorage.sol";
import "../libraries/nodes/AftermarketDeviceStorage.sol";

import {DEFAULT_ADMIN_ROLE} from "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title DevAdmin
/// @dev Admin module for development and testing
contract DevAdmin is AccessControlInternal {
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

    /// @dev Transfers the ownership of an afermarket device
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNode Aftermarket device node id
    /// @param newOwner The address of the new owner
    function transferAftermarketDeviceOwnership(
        uint256 aftermarketDeviceNode,
        address newOwner
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
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

    /// @dev Sets deviceClaimed to false for each aftermarket device
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNodes Array of aftermarket device node ids
    function unclaimAftermarketDeviceNode(
        uint256[] calldata aftermarketDeviceNodes
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
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

    /// @dev Unpairs a list of aftermarket device from their respective vehicles by the device node
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNodes Array of aftermarket device node ids
    function unpairAftermarketDeviceByDeviceNode(
        uint256[] calldata aftermarketDeviceNodes
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
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

            _vehicleNode = ms.links[adIdProxyAddress][_adNode];

            ms.links[vehicleIdProxyAddress][_vehicleNode] = 0;
            ms.links[adIdProxyAddress][_adNode] = 0;

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                INFT(adIdProxyAddress).ownerOf(_adNode)
            );
        }
    }

    /// @dev Unpairs a list of aftermarket devices from their respective vehicles by the vehicle node ids
    /// @dev Caller must have the admin role
    /// @param vehicleNodes Array of vehicle node id
    function unpairAftermarketDeviceByVehicleNode(
        uint256[] calldata vehicleNodes
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
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

            _adNode = ms.links[vehicleIdProxyAddress][_vehicleNode];

            ms.links[vehicleIdProxyAddress][_vehicleNode] = 0;
            ms.links[adIdProxyAddress][_adNode] = 0;

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                INFT(vehicleIdProxyAddress).ownerOf(_vehicleNode)
            );
        }
    }
}
