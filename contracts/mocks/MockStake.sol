// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title MockStake
 * @dev Mocks the Stake contract to be used in tests
 */
contract MockStake is ERC721, AccessControl {
    mapping(address => uint256) private userToBalance;

    constructor() ERC721("Mock Dimo License", "MDL") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setLicenseBalance(address user, uint256 balance) external {
        userToBalance[user] = balance;
    }

    function balanceOf(address owner) public view override returns (uint256) {
        return userToBalance[owner];
    }

    function stake(uint256 _amount) external {
        userToBalance[msg.sender] = _amount;
    }

    function unstake(address user, uint256 _amount) external {
        userToBalance[user] -= _amount;
    }

    function mint(address to) external {
        userToBalance[to] = userToBalance[to];
    }

    function revoke(uint256 _tokenId) external {
        super._burn(_tokenId);
    }

    function checkUserStakedBalance(
        address user
    ) external view returns (uint256) {
        return userToBalance[user];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
