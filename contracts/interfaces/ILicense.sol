//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

// TODO Documentation
interface ILicense {
    function balanceOf(address owner) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);
}
