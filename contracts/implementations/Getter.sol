//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/DIMOStorage.sol";
import "@solidstate/contracts/token/ERC721/base/ERC721BaseInternal.sol";

contract Getter is ERC721BaseInternal {
    /// @notice Gets the parent node of a node
    /// @param tokenId the id associated to the node
    function getParentNode(uint256 tokenId)
        external
        view
        returns (uint256 parentNode)
    {
        parentNode = DIMOStorage.getStorage().records[tokenId].parentNode;
    }

    /// @notice Gets information stored in an attribute of a given node
    /// @dev Returns empty string if does or attribute does not exists
    /// @param nodeId Node id from which info will be obtained
    /// @param attribute Key attribute
    /// @return info Info obtained
    function getInfo(uint256 nodeId, string calldata attribute)
        external
        view
        returns (string memory info)
    {
        info = DIMOStorage.getStorage().records[nodeId].info[attribute];
    }

    /// @notice Gets the owner of a node
    /// @param tokenId the id associated to the node
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _ownerOf(tokenId);
    }
}
