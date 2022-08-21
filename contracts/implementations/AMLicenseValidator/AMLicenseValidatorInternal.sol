//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../libraries/AMLicenseValidatorStorage.sol";

contract AMLicenseValidatorInternal {
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
            AMLicenseValidatorStorage.getStorage().license.balanceOf(
                manufacturer
            ) == 1,
            "Invalid license"
        );

        AMLicenseValidatorStorage.Storage storage s = AMLicenseValidatorStorage
            .getStorage();

        s.dimoToken.transferFrom(
            manufacturer,
            s.foundation,
            s.amDeviceMintCost * amount
        );
    }
}
