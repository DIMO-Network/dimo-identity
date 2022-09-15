//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

library Roles {
    bytes32 internal constant MINTER_ROLE = keccak256("Minter");
    bytes32 internal constant MANUFACTURER_ROLE = keccak256("Manufacturer");
}
