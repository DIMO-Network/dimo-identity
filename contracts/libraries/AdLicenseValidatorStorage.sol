//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "../interfaces/IDimo.sol";
import "../interfaces/ILicense.sol";

/// @title AdLicenseValidatorStorage
/// @notice Storage of the AdLicenseValidator contract
library AdLicenseValidatorStorage {
    bytes32 internal constant AD_LICENSE_VALIDATOR_STORAGE_SLOT =
        keccak256("DIMORegistry.adLicenseValidator.storage");

    struct Storage {
        address foundation;
        IDimo dimoToken;
        ILicense license;
        uint256 adMintCost;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = AD_LICENSE_VALIDATOR_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
