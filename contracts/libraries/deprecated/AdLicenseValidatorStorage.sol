//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/IDimo.sol";
import "../../interfaces/ILicense.sol";

/**
 * @dev Deprecated storage
 */
library AdLicenseValidatorStorage {
    // Do not use this slot
    bytes32 internal constant AD_LICENSE_VALIDATOR_STORAGE_SLOT =
        keccak256("DIMORegistry.adLicenseValidator.storage");

    // Deprecated layout
    struct Storage {
        address foundation;
        IDimo dimoToken;
        ILicense license;
        uint256 adMintCost;
    }
}
