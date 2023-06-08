// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title MockStake
/// @dev Mocks the Stake contract to be used in tests
contract MockStake {
    mapping(address => uint256) private userToBalance;

    function setLicenseBalance(address user, uint256 balance) external {
        userToBalance[user] = balance;
    }

    function balanceOf(address owner) external view returns (uint256) {
        return userToBalance[owner];
    }
}
