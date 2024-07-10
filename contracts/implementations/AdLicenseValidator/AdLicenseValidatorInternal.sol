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
     * @param manufacturer The address of the manufacturer
     */
    function _validateMintRequest(address manufacturer) internal view {
        if (
            AdLicenseValidatorStorage.getStorage().license.balanceOf(
                manufacturer
            ) == 0
        ) revert InvalidLicense();
    }
}
