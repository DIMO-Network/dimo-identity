//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../interfaces/IDimo.sol";
import "../interfaces/ILicense.sol";

library AMLicenseValidatorStorage {
    bytes32 internal constant AM_LICENSE_VALIDATOR_STORAGE_SLOT =
        keccak256("DIMORegistry.amLincenseValidator.storage");

    struct Storage {
        address foundation;
        IDimo dimoToken;
        ILicense license;
        uint256 amDeviceMintCost;
    }

    /* solhint-disable no-inline-assembly */
    function getStorage() internal pure returns (Storage storage s) {
        bytes32 slot = AM_LICENSE_VALIDATOR_STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }
    /* solhint-enable no-inline-assembly */
}
