//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/**
 * @title VehicleInternal
 * @notice Contract with internal Vehicle related functions used in multiple contracts
 */
contract VehicleInternal {
    bytes32 internal constant MINT_VEHICLE_TYPEHASH =
        keccak256("MintVehicleSign(uint256 manufacturerNode,address owner)");

    event VehicleNodeMinted(
        uint256 manufacturerNode,
        uint256 tokenId,
        address owner
    );
}
