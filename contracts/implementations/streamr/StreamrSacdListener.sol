// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "../../interfaces/ISacdListener.sol";
import "./VehicleStream.sol";

contract StreamrSacdListener is ISacdListener {

    uint256 private constant VEHICLE_SUBSCRIBE_LIVE_DATA_PERMISSION_BITMASK = 1 << 6;

    VehicleStream public _dimoRegistry;

    constructor(address dimoRegistryAddress) {
        _dimoRegistry = VehicleStream(dimoRegistryAddress);
    }

    function onSetPermissions(uint256 tokenId, address grantee, uint256 permissions, uint256 expiration) external override {
        bool shouldHaveLiveDataPermission = permissions & VEHICLE_SUBSCRIBE_LIVE_DATA_PERMISSION_BITMASK > 0;
        _dimoRegistry.onSetSubscribePrivilege(
            tokenId,
            grantee,
            shouldHaveLiveDataPermission ? expiration : 0
        );
    }
}
