// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import { ERC721BaseStorage } from "@solidstate/contracts/token/ERC721/base/ERC721BaseStorage.sol";
import { ERC721BaseInternal } from "@solidstate/contracts/token/ERC721/base/ERC721BaseInternal.sol";

/**
 * @title Base ERC721 implementation, excluding optional extensions
 */
contract ERC721Base is ERC721BaseInternal {
    using ERC721BaseStorage for ERC721BaseStorage.Layout;

    function totalSupply() public view returns (uint256) {
        return ERC721BaseStorage.layout().totalSupply();
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balanceOf(account);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _ownerOf(tokenId);
    }
}
