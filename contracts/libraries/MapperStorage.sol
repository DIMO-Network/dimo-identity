//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title MapperStorage
/// @notice Storage of the Mapper contract
library MapperStorage {
    bytes32 internal constant MAPPER_STORAGE_SLOT =
        keccak256("DIMORegistry.mapper.storage");

    struct Storage {
        // Links between Vehicles and ADs
        // idProxyAddress -> vehicleId/adId -> adId/vehicleId
        mapping(address => mapping(uint256 => uint256)) links;
        // Stores beneficiary addresses for a given nodeId of an idProxy
        // idProxyAddress -> nodeId -> beneficiary
        mapping(address => mapping(uint256 => address)) beneficiaries;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = MAPPER_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
