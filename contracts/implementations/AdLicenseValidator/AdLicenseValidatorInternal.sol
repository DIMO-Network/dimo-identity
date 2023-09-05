//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/AdLicenseValidatorStorage.sol";

error InvalidLicense();

/**
 * @title AdLicenseValidatorInternal
 * @notice Contract with internal functions to assist in aftermarket device minting
 * @dev Stake contract repository https://github.com/DIMO-Network/dimo-staking-contract-license-nft
 */
contract AdLicenseValidatorInternal {
    /**
     * @notice Validates if the manufacturer has a License
     * Calculates the total cost to mint the desired amount of aftermarket devices
     * The sender transfers the calculated amount to the foundation
     * @dev This contract must be approved to spend the tokens in advance
     * @param manufacturer The address of the manufacturer
     * @param sender The address of the sender
     * @param amount The amount of devices to be minted
     */
    function _validateMintRequest(
        address manufacturer,
        address sender,
        uint256 amount
    ) internal {
        AdLicenseValidatorStorage.Storage storage s = AdLicenseValidatorStorage
            .getStorage();

        if (s.license.balanceOf(manufacturer) == 0) revert InvalidLicense();

        s.dimoToken.transferFrom(sender, s.foundation, s.adMintCost * amount);
    }
}
