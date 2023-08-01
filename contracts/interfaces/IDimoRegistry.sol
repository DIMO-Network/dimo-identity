//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title IDimoRegistry
/// @notice Interface to interact with external functions of DIMORegistry modules
interface IDimoRegistry {
    function updateManufacturerMinted(address from, address to) external;

    function updateIntegrationMinted(address from, address to) external;

    function validateBurnAndResetNode(uint256 tokenId) external;

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

    function getLink(address idProxyAddress, uint256 sourceNode)
        external
        view
        returns (uint256 targetNode);

    function getNodeLink(
        address idProxyAddressSource,
        address idProxyAddressTarget,
        uint256 sourceNode
    ) external view returns (uint256 targetNode);

    function getData(address idProxyAddress, uint256 tokenId)
        external
        view
        returns (string memory data);
}
