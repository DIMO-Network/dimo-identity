// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

contract MockLicense {
    mapping(address => uint256) private userToBalance;

    function setLicenseBalance(address user, uint256 balance) external {
        userToBalance[user] = balance;
    }

    function balanceOf(address owner) external view returns (uint256) {
        return userToBalance[owner];
    }
}
