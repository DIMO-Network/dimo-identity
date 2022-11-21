//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

library ManufacturerStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant MANUFACTURER_STORAGE_SLOT =
        keccak256("DIMORegistry.Manufacturer.storage");

    struct Controller {
        bool isController;
        bool manufacturerMinted;
    }

    struct Storage {
        address nftProxyAddress;
        // [Controller address] => is controller, has minted manufacturer
        mapping(address => Controller) controllers;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
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
