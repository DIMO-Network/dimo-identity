pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

contract NFTBundle {
    IERC721Upgradeable public token1;
    IERC721Upgradeable public token2;

    constructor(IERC721Upgradeable _token1, IERC721Upgradeable _token2) {
        token1 = _token1;
        token2 = _token2;
    }

    function transfer1(
        uint256 id1,
        uint256 id2,
        address to
    ) public {
        // token1.transferFrom(msg.sender, to, id1);
        // token2.transferFrom(msg.sender, to, id2);

        (bool success, ) = address(token1).delegatecall(
            abi.encodeWithSignature(
                "safeTransferFrom(address,address,uint256)",
                msg.sender,
                to,
                id1
            )
        );
        require(success, "Did not work");

        (success, ) = address(token2).delegatecall(
            abi.encodeWithSignature(
                "safeTransferFrom(address,address,uint256)",
                msg.sender,
                to,
                id2
            )
        );
        require(success, "Did not work");
    }

    function transfer2(
        uint256 operation,
        address to,
        bytes memory data
    ) public returns (bool success) {
        if (operation == 1) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                success := delegatecall(
                    gas(),
                    to,
                    add(data, 0x20),
                    mload(data),
                    0,
                    0
                )
            }
        } else {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                success := call(
                    gas(),
                    to,
                    0,
                    add(data, 0x20),
                    mload(data),
                    0,
                    0
                )
            }
        }
        require(success, "Did not work");
    }
}
