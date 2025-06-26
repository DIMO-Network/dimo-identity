// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title MockStorageNode
 * @dev Mocks the StorageNode contract to be used in tests
 * Refers to https://github.com/DIMO-Network/storage-node
 */
contract MockStorageNode is ERC721 {
    error LabelInvalidLength(string label);

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    function mint(address to, string calldata label) external {
        if (bytes(label).length > 32) {
            revert LabelInvalidLength(label);
        }

        uint256 newNodeId = uint256(bytes32(bytes(label)));

        _safeMint(to, newNodeId);
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
}
