//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilege.sol";

contract IntegrationId is Initializable, MultiPrivilege {
    IDimoRegistry private _dimoRegistry;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_
    ) external initializer {
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
        _dimoRegistry.updateIntegrationMinted(from, to);
        super._transfer(from, to, tokenId);
    }
}