//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilegeTransferable.sol";
import "./Base/ERC2771ContextUpgradeable.sol";

error ZeroAddress();
error Unauthorized();

contract SyntheticDeviceId is
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
        address[] calldata trustedForwarders_
    ) external initializer {
        _erc2771Init(trustedForwarders_);
        _multiPrivilegeInit(name_, symbol_, baseUri_);

        dimoRegistry = IDimoRegistry(dimoRegistry_);

        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Sets the DIMO Registry address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param dimoRegistry_ The address to be set
    function setDimoRegistryAddress(
        address dimoRegistry_
    ) external onlyRole(ADMIN_ROLE) {
        if (dimoRegistry_ == address(0)) revert ZeroAddress();
        dimoRegistry = IDimoRegistry(dimoRegistry_);
    }

    /// @notice Sets trusted or not to an address
    /// @dev Only an admin can set a trusted forwarder
    /// @param addr The address to be set
    /// @param trusted Whether an address should be trusted or not
    function setTrustedForwarder(
        address addr,
        bool trusted
    ) public override onlyRole(ADMIN_ROLE) {
        super.setTrustedForwarder(addr, trusted);
    }

    /// @notice Function to burn a token
    /// @dev Caller must have the burner role
    /// @dev To be called by DIMORegistry in burnSyntheticDeviceSign function
    /// @param tokenId Token Id to be burned
    function burn(uint256 tokenId) public override {
        super._burn(tokenId);
    }

    /// @notice Internal function to transfer a token
    /// @dev Only the token owner can transfer (no approvals)
    /// @dev Pairings are maintained
    /// @dev Clears all privileges
    /// @param from Old owner
    /// @param to New owner
    /// @param tokenId Token Id to be transferred
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        // Only trusted forwarder can transfer
        if (!trustedForwarders[msg.sender]) revert Unauthorized();
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
