//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721Holder is IERC721Receiver {
    /**
     * @dev Allows the DIMORegistry to receive NFTs.
     * Necessary to allow DIMORegistry to receive Tableland tokens during table creation,
     * set itself as controller and then transfer it to the manufacturer
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
