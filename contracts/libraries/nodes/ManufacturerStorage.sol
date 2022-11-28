//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

/// @title ManufacturerStorage
/// @notice Storage of the Manufacturer contract
library ManufacturerStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant MANUFACTURER_STORAGE_SLOT =
        keccak256("DIMORegistry.Manufacturer.storage");

    struct Controller {
        bool isController;
        bool manufacturerMinted;
    }

    struct Storage {
        address idProxyAddress;
        // [Controller address] => is controller, has minted manufacturer
        mapping(address => Controller) controllers;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
        // Manufacturer name => Manufacturer Id
        mapping(string => uint256) manufacturerNameToNodeId;
        // Manufacturer Id => Manufacturer name
        mapping(uint256 => string) nodeIdToManufacturerName;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = MANUFACTURER_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
