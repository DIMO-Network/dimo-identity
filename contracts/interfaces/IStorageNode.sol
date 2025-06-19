// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

// TODO Documentation
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

    function nodes(uint256 tokenId) external view returns (NodeInfo memory);

    function nodeAddressToNodeId(
        address nodeAddress
    ) external view returns (uint256);
}
