//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilege.sol";
import "./Base/ERC2771ContextUpgradeable.sol";

contract IntegrationId is
    Initializable,
    ERC2771ContextUpgradeable,
    MultiPrivilege
{
    IDimoRegistry public dimoRegistry;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_,
        address dimoRegistry_,
        address trustedForwarder_
    ) external initializer {
        _erc2771Init(trustedForwarder_);
        _multiPrivilegeInit(name_, symbol_, baseUri_);

        dimoRegistry = IDimoRegistry(dimoRegistry_);
    }

    /// @notice Sets the DIMO Registry address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param dimoRegistry_ The address to be set
    function setDimoRegistryAddress(address dimoRegistry_)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(dimoRegistry_ != address(0), "Non zero address");
        dimoRegistry = IDimoRegistry(dimoRegistry_);
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

    /// @notice Internal function to transfer a token
    /// @dev Caller must have the transferer role
    /// @dev The new owner must bet allowed to own an Integration node
    /// @param from Old owner
    /// @param to New owner
    /// @param tokenId Token Id to be transferred
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        dimoRegistry.updateIntegrationMinted(from, to);
        super._transfer(from, to, tokenId);
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
