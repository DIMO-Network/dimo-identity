//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./INFT.sol";

/// @title INFTMultiPrivilege
/// @notice Interface of a MultiPrivilege NFT
interface INFTMultiPrivilege is INFT {
    function hasPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (bool);
}
