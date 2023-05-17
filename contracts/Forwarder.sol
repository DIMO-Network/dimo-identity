// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Forwarder {
    constructor() {}

    struct Request {
        address to;
        bytes data;
    }

    function execute(Request[] calldata reqs) external {
        Request memory req;
        for (uint256 i = 0; i < reqs.length; i++) {
            req = reqs[i];

            (bool success, bytes memory _data) = req.to.call(
                abi.encodePacked(req.data, msg.sender)
            );
            console.logBytes(_data);
            require(success);
        }
    }
}
