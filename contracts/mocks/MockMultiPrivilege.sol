//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../NFTs/Base/MultiPrivilege/MultiPrivilege.sol";

/// @title MockMultiPrivilege
/// @dev Mocks the MultiPrivilege token to be used in tests
contract MockMultiPrivilege is Initializable, MultiPrivilege {
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
}
