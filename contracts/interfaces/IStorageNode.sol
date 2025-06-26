// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title IStorageNode Interface
 * @dev Interface for the StorageNode contract
 * Refers to https://github.com/DIMO-Network/storage-node
 */
interface IStorageNode {
    struct NodeInfo {
        address nodeAddress;
        string nodeUri;
    }

    event StorageLicenseMinted(
        address indexed account,
        uint256 indexed licenseId,
        address indexed licenseAddr,
        string licenseLabel,
        string nodeUri
    );

    function setNodeForVehicle(uint256 vehicleId, uint256 nodeId) external;

    function exists(uint256 tokenId) external view returns (bool);

    function nodes(uint256 tokenId) external view returns (NodeInfo memory);

    function nodeAddressToNodeId(
        address nodeAddress
    ) external view returns (uint256);
}
