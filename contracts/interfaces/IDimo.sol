//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title IDimo
/// @notice Interface of the DIMO token
/// @dev DIMO token repository https://github.com/DIMO-Network/dimo-token
interface IDimo {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
