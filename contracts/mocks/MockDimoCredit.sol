// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MockDimoCredit
 * @dev Mocks the DIMO Credit token to be used in tests
 */
contract MockDimoCredit is ERC20, AccessControl {
    bytes32 constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor() ERC20("Mock DIMO Credit", "MDCX") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amountIn) external {
        _mint(to, amountIn);
    }

    function burn(address from, uint256 amount) external onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }
}
