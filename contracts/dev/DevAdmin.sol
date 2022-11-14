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

    /// @dev Unpairs a list of aftermarket device from their respective vehicles by the device node
    /// @dev Caller must have the admin role
    /// @param aftermarketDeviceNodes Array of aftermarket device node ids
    function unpairAftermarketDeviceByDeviceNode(
        uint256[] calldata aftermarketDeviceNodes
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        uint256 _adNode;
        uint256 _vehicleNode;
        for (uint256 i = 0; i < aftermarketDeviceNodes.length; i++) {
            _adNode = aftermarketDeviceNodes[i];

            require(
                ns.nodes[_adNode].nodeType ==
                    AftermarketDeviceStorage.getStorage().nodeType,
                "Invalid AD node"
            );

            _vehicleNode = ms.links[_adNode];

            ms.links[_vehicleNode] = 0;
            ms.links[_adNode] = 0;

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                _ownerOf(_adNode)
            );
        }
    }

    /// @dev Unpairs a list of aftermarket devices from their respective vehicles by the vehicle node ids
    /// @dev Caller must have the admin role
    /// @param vehicleNodes Array of vehicle node id
    function unpairAftermarketDeviceByVehicleNode(
        uint256[] calldata vehicleNodes
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        MapperStorage.Storage storage ms = MapperStorage.getStorage();

        uint256 _adNode;
        uint256 _vehicleNode;
        for (uint256 i = 0; i < vehicleNodes.length; i++) {
            _vehicleNode = vehicleNodes[i];

            require(
                ns.nodes[_vehicleNode].nodeType ==
                    VehicleStorage.getStorage().nodeType,
                "Invalid vehicle node"
            );

            _adNode = ms.links[_vehicleNode];

            ms.links[_vehicleNode] = 0;
            ms.links[_adNode] = 0;

            emit AftermarketDeviceUnpaired(
                _adNode,
                _vehicleNode,
                _ownerOf(_vehicleNode)
            );
        }
    }
}
