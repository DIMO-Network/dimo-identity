//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./Base/ERC721nftBase.sol";

contract AftermarketDeviceNft is ERC721nftBase {
    constructor(string memory name_, string memory symbol_)
        ERC721nftBase(name_, symbol_)
    {}
}
