// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title MockSacd
 * @dev Mocks the SACD contract to be used in tests
 * Refers to https://github.com/DIMO-Network/sacd
 */
contract MockSacd {
    struct PermissionRecord {
        uint256 permissions;
        uint256 expiration;
        string source;
    }

    mapping(address => mapping(uint256 => uint256)) public tokenIdToVersion;
    mapping(address => mapping(uint256 => mapping(uint256 => mapping(address => PermissionRecord))))
        public permissionRecords;

    function setPermissions(
        address asset,
        uint256 tokenId,
        address grantee,
        uint256 permissions,
        uint256 expiration,
        string calldata source
    ) external {
        uint256 tokenIdVersion = tokenIdToVersion[asset][tokenId];
        permissionRecords[asset][tokenId][tokenIdVersion][
            grantee
        ] = PermissionRecord(permissions, expiration, source);
    }

    function onTransfer(address asset, uint256 tokenId) external {
        tokenIdToVersion[asset][tokenId]++;
    }
}
