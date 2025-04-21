// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title MockConnections
 * @dev Mocks the Connections contract (connection license) to be used in tests
 * Refers to https://github.com/DIMO-Network/connections-license
 */
contract MockConnections is ERC721 {
    error NameExceedsMaxLength(string _name);

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC721(name_, symbol_) {}

    function mint(address to, string calldata _name) external {
        if (bytes(_name).length > 32) {
            revert NameExceedsMaxLength(_name);
        }

        uint256 newLicenseId = uint256(bytes32(bytes(_name)));

        _safeMint(to, newLicenseId);
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
}
