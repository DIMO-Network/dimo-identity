// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title MockConnectionLicense
 * @dev Mocks the Connections contract (connection license) to be used in tests
 * Refers to https://github.com/DIMO-Network/dimo-staking-contract-license-nft
 */
contract MockConnections {
    mapping(address => uint256) private userToBalance;

    function setLicenseBalance(address user, uint256 balance) external {
        userToBalance[user] = balance;
    }

    function balanceOf(address owner) external view returns (uint256) {
        return userToBalance[owner];
    }
}
