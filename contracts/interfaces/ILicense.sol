//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @title ILicense
/// @notice Interface of the Stake contract that is used to issuing Liceses to manufacturers
/// @dev Stake contract repository https://github.com/DIMO-Network/dimo-staking-contract-license-nft
interface ILicense {
    function balanceOf(address owner) external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);
}
