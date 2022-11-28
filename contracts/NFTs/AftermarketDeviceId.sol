//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./Base/NftBaseUpgradeable.sol";

contract AftermarketDeviceId is Initializable, NftBaseUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_
    ) external initializer {
        _baseNftInit(name_, symbol_, baseUri_);
    }
}