// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "./Eip712CheckerStorage.sol";

import "@solidstate/contracts/cryptography/ECDSA.sol";

library Eip712CheckerInternal {
    bytes32 private constant EIP712_DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    function _eip712Domain() internal view returns (bytes32) {
        Eip712CheckerStorage.Storage storage s = Eip712CheckerStorage
            .getStorage();

        return
            keccak256(
                abi.encode(
                    EIP712_DOMAIN_TYPEHASH,
                    s.name,
                    s.version,
                    block.chainid,
                    address(this)
                )
            );
    }

    function _verifySignature(
        address signatory,
        bytes32 message,
        bytes calldata signature
    ) internal view returns (bool success) {
        require(signatory != address(0), "ECDSA: zero signatory address");

        bytes32 msgHash = keccak256(
            abi.encodePacked("\x19\x01", _eip712Domain(), message)
        );

        return signatory == ECDSA.recover(msgHash, signature);
    }

    function _verifySignature(
        address signatory,
        bytes32 message,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view returns (bool success) {
        require(signatory != address(0), "ECDSA: zero signatory address");

        bytes32 msgHash = keccak256(
            abi.encodePacked("\x19\x01", _eip712Domain(), message)
        );

        return signatory == ECDSA.recover(msgHash, v, r, s);
    }
}
