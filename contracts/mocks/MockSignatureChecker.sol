// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

/// @title Eip712CheckerInternal
/// @notice Contract with internal functions to assist in verifying signatures
/// @dev Based on the EIP-712 https://eips.ethereum.org/EIPS/eip-712
contract MockSignatureChecker {
    /// @dev Recovers message signer and verifies if metches signatory
    /// @param signatory The signer to be verified
    /// @param digest Hashed data payload
    /// @param signature Signed data payload
    function verifySignature(
        address signatory,
        bytes32 digest,
        bytes calldata signature
    ) external view returns (bool success) {
        return
            SignatureChecker.isValidSignatureNow(signatory, digest, signature);
    }
}
