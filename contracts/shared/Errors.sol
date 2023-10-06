//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

// Misc
error ZeroAddress();
error Unauthorized(address addr);
error AttributeExists(string attr);
error AttributeNotWhitelisted(string attr);
error AlreadyController(address addr);
error OnlyNftProxy();

// Nodes
error InvalidParentNode(uint256 id);
error InvalidParentNodeOwner(uint256 id, address addr);
error InvalidNode(address proxy, uint256 id);
error VehiclePaired(uint256 id);
error VehicleNotPaired(uint256 id);

// Signature
error InvalidSigner();
error InvalidOwnerSignature();
