//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Base/NftBaseUpgradeable.sol";

contract VehicleNft is Initializable, NftBaseUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_
    ) public initializer {
        _baseNftInit(name_, symbol_, baseUri_);
    }
}
