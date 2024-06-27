//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IERC20Burnable
 * @notice Interface of a standard ERC20 with burning
 */
interface IERC20Burnable is IERC20 {
    function burn(address from, uint256 amount) external;
}
