//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../libraries/MapperStorage.sol";
import "../libraries/NodesStorage.sol";
import "../libraries/nodes/VehicleStorage.sol";
import "../libraries/nodes/AftermarketDeviceStorage.sol";

import {DEFAULT_ADMIN_ROLE} from "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

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
        // TODO check not tyep ?
        // require(
        //     NodesStorage.getStorage().nodes[aftermarketDeviceNode].nodeType ==
        //         AftermarketDeviceStorage.getStorage().nodeType,
        //     "Invalid AD node"
        // );
        INFT adNftProxy = INFT(
            AftermarketDeviceStorage.getStorage().nftProxyAddress
        );
        address oldOwner = adNftProxy.ownerOf(aftermarketDeviceNode);

        adNftProxy.safeTransferFrom(oldOwner, newOwner, aftermarketDeviceNode);

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

        uint256 _adNode;
        for (uint256 i = 0; i < aftermarketDeviceNodes.length; i++) {
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
        // NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        address vehicleNftProxyAddress = VehicleStorage
            .getStorage()
            .nftProxyAddress;
        address adNftProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .nftProxyAddress;

        uint256 _adNode;
        uint256 _vehicleNode;
        for (uint256 i = 0; i < aftermarketDeviceNodes.length; i++) {
            _adNode = aftermarketDeviceNodes[i];

            // TODO check node type ?
            // require(
            //     ns.nodes[_adNode].nodeType ==
            //         AftermarketDeviceStorage.getStorage().nodeType,
            //     "Invalid AD node"
            // );

            _vehicleNode = ms.links[adNftProxyAddress][_adNode];

            ms.links[vehicleNftProxyAddress][_vehicleNode] = 0;
            ms.links[adNftProxyAddress][_adNode] = 0;

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                INFT(adNftProxyAddress).ownerOf(_adNode)
            );
        }
    }

    /// @dev Unpairs a list of aftermarket devices from their respective vehicles by the vehicle node ids
    /// @dev Caller must have the admin role
    /// @param vehicleNodes Array of vehicle node id
    function unpairAftermarketDeviceByVehicleNode(
        uint256[] calldata vehicleNodes
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();
        address vehicleNftProxyAddress = VehicleStorage
            .getStorage()
            .nftProxyAddress;
        address adNftProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .nftProxyAddress;

        uint256 _adNode;
        uint256 _vehicleNode;
        for (uint256 i = 0; i < vehicleNodes.length; i++) {
            _vehicleNode = vehicleNodes[i];

            // TODO check node type ?
            // require(
            //     ns.nodes[_vehicleNode].nodeType ==
            //         VehicleStorage.getStorage().nodeType,
            //     "Invalid vehicle node"
            // );

            _adNode = ms.links[vehicleNftProxyAddress][_vehicleNode];

            ms.links[vehicleNftProxyAddress][_vehicleNode] = 0;
            ms.links[adNftProxyAddress][_adNode] = 0;

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                INFT(vehicleNftProxyAddress).ownerOf(_vehicleNode)
            );
        }
    }
}
