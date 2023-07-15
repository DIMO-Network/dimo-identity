//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ERC1271WalletMock is Ownable, IERC1271 {
    constructor(address originalOwner) {
        super.transferOwnership(originalOwner);
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        public
        view
        returns (bytes4 magicValue)
    {
        return
            ECDSA.recover(hash, signature) == owner()
                ? this.isValidSignature.selector
                : bytes4(0);
    }
}

contract ERC1271MaliciousMock is Ownable, IERC1271 {
    constructor(address originalOwner) {
        super.transferOwnership(originalOwner);
    }

    function isValidSignature(bytes32, bytes memory)
        public
        pure
        returns (bytes4)
    {
        assembly {
            mstore(
                0,
                0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
            )
            return(0, 32)
        }
    }
}
