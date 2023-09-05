//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../AttributeSet.sol";

/**
 * @title IntegrationStorage
 * @notice Storage of the Integration contract
 */
library IntegrationStorage {
    using AttributeSet for AttributeSet.Set;

    bytes32 private constant INTEGRATION_STORAGE_SLOT =
        keccak256("DIMORegistry.Integration.storage");

    struct Controller {
        bool isController;
        bool integrationMinted;
    }

    struct Storage {
        address idProxyAddress;
        // [Controller address] => is controller, has minted integration node
        mapping(address => Controller) controllers;
        // Allowed node attribute
        AttributeSet.Set whitelistedAttributes;
        // Integration name => Integration Id
        mapping(string => uint256) integrationNameToNodeId;
        // Integration Id => Integration name
        mapping(uint256 => string) nodeIdToIntegrationName;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = INTEGRATION_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
