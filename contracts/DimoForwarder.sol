//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./interfaces/IDimoRegistry.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

error zeroAddress();
error notWhitelisted(string proxyName);
error invalidLink(
    address idProxySource,
    address idProxyTraget,
    uint256 sourceId,
    uint256 targetId
);
error transferFailed(address idProxy, uint256 id);

contract DimoForwarder is
    Initializable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    IDimoRegistry public dimoRegistry;
    address public vehicleIdProxyAddress;
    address public adIdProxyAddress;
    address public virtualDeviceIdProxyAddress;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address dimoRegistry_,
        address vehicleIdProxyAddress_,
        address adIdProxyAddress_,
        address virtualDeviceIdProxyAddress_
    ) external initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        dimoRegistry = IDimoRegistry(dimoRegistry_);
        vehicleIdProxyAddress = vehicleIdProxyAddress_;
        adIdProxyAddress = adIdProxyAddress_;
        virtualDeviceIdProxyAddress = virtualDeviceIdProxyAddress_;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    /// @notice Sets the DIMO Registry address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param dimoRegistry_ The address to be set
    function setDimoRegistryAddress(address dimoRegistry_)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (dimoRegistry_ == address(0)) revert zeroAddress();
        dimoRegistry = IDimoRegistry(dimoRegistry_);
    }

    /// TODO Documentation
    function setVehicleIdProxyAddress(address vehicleIdProxyAddress_)
        external
        onlyRole(ADMIN_ROLE)
    {
        vehicleIdProxyAddress = vehicleIdProxyAddress_;
    }

    /// TODO Documentation
    function setAftermarketDeviceIdProxyAddress(address adIdProxyAddress_)
        external
        onlyRole(ADMIN_ROLE)
    {
        adIdProxyAddress = adIdProxyAddress_;
    }

    /// TODO Documentation
    function setVirtualDeviceIdProxyAddress(
        address virtualDeviceIdProxyAddress_
    ) external onlyRole(ADMIN_ROLE) {
        virtualDeviceIdProxyAddress = virtualDeviceIdProxyAddress_;
    }

    /// @notice Tranfers both Vehicle and Aftermarket Device Ids
    /// @dev Vehicle Id and Aftermarket Device Id must be paired
    /// @dev For the purpose of this contract, all requests must succeed
    /// @param vehicleId Vehicle Id to be transferred
    /// @param aftermarketDeviceId Aftermarket Device Id to be transferred
    /// @param to New Ids owner
    function transferVehicleAndAftermarketDeviceIds(
        uint256 vehicleId,
        uint256 aftermarketDeviceId,
        address to
    ) external {
        if (
            dimoRegistry.getLink(vehicleIdProxyAddress, vehicleId) !=
            aftermarketDeviceId
        )
            revert invalidLink(
                vehicleIdProxyAddress,
                adIdProxyAddress,
                vehicleId,
                aftermarketDeviceId
            );

        _execTransfer(vehicleIdProxyAddress, to, vehicleId);
        _execTransfer(adIdProxyAddress, to, aftermarketDeviceId);
    }

    /// @notice Tranfers both Vehicle and Virtual Device Ids
    /// @dev Vehicle Id and Virtual Device Id must be paired
    /// @dev For the purpose of this contract, all requests must succeed
    /// @param vehicleId Vehicle Id to be transferred
    /// @param virtualDeviceId Virtual Device Id to be transferred
    /// @param to New Ids owner
    function transferVehicleAndVirtualDeviceIds(
        uint256 vehicleId,
        uint256 virtualDeviceId,
        address to
    ) external {
        if (
            dimoRegistry.getNodeLink(
                vehicleIdProxyAddress,
                virtualDeviceIdProxyAddress,
                vehicleId
            ) != virtualDeviceId
        )
            revert invalidLink(
                vehicleIdProxyAddress,
                virtualDeviceIdProxyAddress,
                vehicleId,
                virtualDeviceId
            );

        _execTransfer(vehicleIdProxyAddress, to, vehicleId);
        _execTransfer(virtualDeviceIdProxyAddress, to, virtualDeviceId);
    }

    /// @notice Internal function to authorize contract upgrade
    /// @dev Caller must have the upgrader role
    /// @param newImplementation New contract implementation address
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    /// TODO Documentation
    /// @dev 0x42842e0e is the selector of safeTransferFrom(address,address,uint256)
    function _execTransfer(
        address proxy,
        address to,
        uint256 id
    ) private {
        (bool success, ) = proxy.call(
            abi.encodePacked(
                abi.encodeWithSelector(0x42842e0e, msg.sender, to, id),
                msg.sender
            )
        );

        if (!success) revert transferFailed(proxy, id);
    }
}
