// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockDimoToken
 * @dev Mocks the DIMO token to be used in tests
 */
contract MockDimoToken is ERC20 {
    constructor(uint256 _totalSupply) ERC20("Mock DIMO", "MD") {
        _mint(msg.sender, _totalSupply);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
