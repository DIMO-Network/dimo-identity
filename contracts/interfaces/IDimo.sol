//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

// TODO Documentation
interface IDimo {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
