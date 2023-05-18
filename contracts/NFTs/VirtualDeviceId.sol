//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilege.sol";
import "./Base/ERC2771ContextUpgradeable.sol";

contract VirtualDeviceId is
    Initializable,
    ERC2771ContextUpgradeable,
    MultiPrivilege
{
    IDimoRegistry private _dimoRegistry;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_,
        address trustedForwarder_
    ) external initializer {
        _erc2771Init(trustedForwarder_);
        _multiPrivilegeInit(name_, symbol_, baseUri_);
    }

    /// @notice Sets the DIMO Registry address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param addr The address to be set
    function setDimoRegistryAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        _dimoRegistry = IDimoRegistry(addr);
    }

    /// @notice Sets the Trusted Forwarder address
    /// @param trustedForwarder_ The address to be set
    function setTrustedForwarder(address trustedForwarder_)
        public
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        super.setTrustedForwarder(trustedForwarder_);
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgSender()
        internal
        view
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (address sender)
    {
        return ERC2771ContextUpgradeable._msgSender();
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgData()
        internal
        view
        override(ContextUpgradeable, ERC2771ContextUpgradeable)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }
}
