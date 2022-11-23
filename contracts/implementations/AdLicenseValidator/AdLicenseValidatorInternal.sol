//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "../../libraries/AdLicenseValidatorStorage.sol";

/// @title AdLicenseValidatorInternal
/// @notice Contract with internal functions to assist in aftermarket device minting
/// @dev Stake contract repository https://github.com/DIMO-Network/dimo-staking-contract-license-nft
contract AdLicenseValidatorInternal {
    /// @notice Validates if the manufacturer has a License
    /// Calculates the total cost to mint the desired amount of aftermarket devices
    /// Transfers the calculated amount to the foundation
    /// @dev This contract must be approved to spend the tokens in advance
    /// @param manufacturer The address of the manufacturer
    /// @param amount The amount of devices to be minted
    function _validateMintRequest(address manufacturer, uint256 amount)
        internal
    {
        require(
            AdLicenseValidatorStorage.getStorage().license.balanceOf(
                manufacturer
            ) == 1,
            "Invalid license"
        );

        AdLicenseValidatorStorage.Storage storage s = AdLicenseValidatorStorage
            .getStorage();

        s.dimoToken.transferFrom(
            manufacturer,
            s.foundation,
            s.adMintCost * amount
        );
    }
}
