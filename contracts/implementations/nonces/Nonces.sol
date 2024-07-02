// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/NoncesStorage.sol";

/**
 * @title Nonces
 * @notice Contract to track nonces for addresses. Nonces will only increment.
 */
contract Nonces {
    // TODO Documentation
    /// @notice Returns the next unused nonce for an address
    function nonces(
        bytes32 typehash,
        address account
    ) public view virtual returns (uint256) {
        return NoncesStorage.getStorage().operationNonces[typehash][account];
    }
}
