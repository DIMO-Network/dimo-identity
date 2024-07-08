// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/NoncesStorage.sol";

error InvalidAccountNonce(
    bytes32 typehash,
    address account,
    uint256 currentNonce
);

/**
 * @title NoncesInternal
 * @notice Library to track nonces for addresses. Nonces will only increment.
 */
library NoncesInternal {
    /**
     * @notice Returns the current value and increments nonce
     * @param typehash The operation typehash
     * @param account The account associated with the nonce
     */
    function _useNonce(
        bytes32 typehash,
        address account
    ) internal returns (uint256) {
        // For each account, the nonce has an initial value of 0, can only be incremented by one, and cannot be
        // decremented or reset. This guarantees that the nonce never overflows.
        unchecked {
            // It is important to do x++ and not ++x here.
            return
                NoncesStorage.getStorage().operationNonces[typehash][account]++;
        }
    }

    /**
     * @notice Increments nonce and checks if that `nonce` is the next valid for `account`
     * @param typehash The operation typehash
     * @param account The account associated with the nonce
     * @param nonce The nonce to be checked
     */
    function _useCheckedNonce(
        bytes32 typehash,
        address account,
        uint256 nonce
    ) internal returns (uint256 currentNonce) {
        currentNonce = _useNonce(typehash, account);
        if (nonce != currentNonce) {
            revert InvalidAccountNonce(typehash, account, currentNonce);
        }
    }
}
