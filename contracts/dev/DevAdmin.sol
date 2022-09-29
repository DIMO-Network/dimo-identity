//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../access/AccessControlInternal.sol";
import "../libraries/MapperStorage.sol";
import "../libraries/NodesStorage.sol";
import "../libraries/nodes/VehicleStorage.sol";
import "../libraries/nodes/AftermarketDeviceStorage.sol";
import "@solidstate/contracts/token/ERC721/metadata/ERC721MetadataInternal.sol";

/// @dev Admin module for development and testing
contract DevAdmin is AccessControlInternal, ERC721MetadataInternal {
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
        require(
            NodesStorage.getStorage().nodes[aftermarketDeviceNode].nodeType ==
                AftermarketDeviceStorage.getStorage().nodeType,
            "Invalid AD node"
        );

        address oldOwner = _ownerOf(aftermarketDeviceNode);

        _safeTransfer(oldOwner, newOwner, aftermarketDeviceNode, "");

        emit AftermarketDeviceTransferred(
            aftermarketDeviceNode,
            oldOwner,
            newOwner
        );
    }

    /// @dev Unpairs an aftermarket device from a vehicle
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNode Aftermarket device node id
    /// @param vehicleNode Vehicle node id
    function unpairAftermarketDevice(
        uint256 aftermarketDeviceNode,
        uint256 vehicleNode
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        require(
            ns.nodes[aftermarketDeviceNode].nodeType ==
                AftermarketDeviceStorage.getStorage().nodeType,
            "Invalid AD node"
        );
        require(
            ns.nodes[vehicleNode].nodeType ==
                VehicleStorage.getStorage().nodeType,
            "Invalid vehicle node"
        );

        ms.links[vehicleNode] = 0;
        ms.links[aftermarketDeviceNode] = 0;

        address owner = _ownerOf(vehicleNode);

        emit AftermarketDeviceUnpaired(
            aftermarketDeviceNode,
            vehicleNode,
            owner
        );
    }

    /// @dev Unpairs an aftermarket device from a vehicle by the device node
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNode Aftermarket device node id
    function unpairAftermarketDeviceByDeviceNode(uint256 aftermarketDeviceNode)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        require(
            ns.nodes[aftermarketDeviceNode].nodeType ==
                AftermarketDeviceStorage.getStorage().nodeType,
            "Invalid AD node"
        );

        uint256 vehicleNode = ms.links[aftermarketDeviceNode];

        ms.links[vehicleNode] = 0;
        ms.links[aftermarketDeviceNode] = 0;

        address owner = _ownerOf(aftermarketDeviceNode);

        emit AftermarketDeviceUnpaired(
            aftermarketDeviceNode,
            vehicleNode,
            owner
        );
    }

    /// @dev Unpairs an aftermarket device from a vehicle by the vehicle node
    /// @dev Caller must have the admin role
    /// @param vehicleNode Vehicle node id
    function unpairAftermarketDeviceByVehicleNode(uint256 vehicleNode)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        require(
            ns.nodes[vehicleNode].nodeType ==
                VehicleStorage.getStorage().nodeType,
            "Invalid vehicle node"
        );

        uint256 aftermarketDeviceNode = ms.links[vehicleNode];

        ms.links[vehicleNode] = 0;
        ms.links[aftermarketDeviceNode] = 0;

        address owner = _ownerOf(vehicleNode);

        emit AftermarketDeviceUnpaired(
            aftermarketDeviceNode,
            vehicleNode,
            owner
        );
    }
}
