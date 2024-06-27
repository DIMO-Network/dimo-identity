// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockDimoCredit
 * @dev Mocks the DIMO Credit token to be used in tests
 */
contract MockDimoCredit is ERC20 {
    constructor() ERC20("Mock DIMO Credit", "MDCX") {}

    function mint(address to, uint256 amountIn) external {
        _mint(to, amountIn);
    }
}
