// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MockDimoToken
 * @dev Mocks the DIMO token to be used in tests
 * Refers to https://github.com/DIMO-Network/dimo-token
 */
contract MockDimoToken is ERC20, AccessControl {
    constructor(uint256 _totalSupply) ERC20("Mock DIMO", "MD") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, _totalSupply);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
