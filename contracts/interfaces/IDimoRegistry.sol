//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title IDimoRegistry
/// @notice Interface to interact with external functions of DIMORegistry modules
interface IDimoRegistry {
    function setManufacturerMinted(address addr) external;

    function setAftermarketDeviceBeneficiary(
        uint256 nodeId,
        address beneficiary
    ) external;

    function isController(address addr)
        external
        view
        returns (bool _isController);

    function isManufacturerMinted(address addr)
        external
        view
        returns (bool _isManufacturerMinted);

    function isAllowedToOwnManufacturerNode(address addr)
        external
        view
        returns (bool _isAllowed);

    function verifyAftermarketDeviceTransfer(uint256 aftermarketDeviceNode)
        external
        view;
}
