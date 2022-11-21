// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "./Eip712CheckerStorage.sol";

import {DEFAULT_ADMIN_ROLE} from "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

contract Eip712Checker is AccessControlInternal {
    function initialize(string calldata name, string calldata version)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        Eip712CheckerStorage.Storage storage s = Eip712CheckerStorage
            .getStorage();

        s.name = keccak256(abi.encodePacked(name));
        s.version = keccak256(abi.encodePacked(version));
    }
}
