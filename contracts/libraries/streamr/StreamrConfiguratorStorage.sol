//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title StreamrConfiguratorStorage
 * @notice Storage of the StreamrConfigurator contract
 */
library StreamrConfiguratorStorage {
    bytes32 internal constant STREAMR_CONFIGURATOR_STORAGE_SLOT =
        keccak256("DIMORegistry.streamrConfigurator.storage");

    struct Storage {
        address streamRegistry;
        address dimoStreamrNode;
        string dimoStreamrEns;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = STREAMR_CONFIGURATOR_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
