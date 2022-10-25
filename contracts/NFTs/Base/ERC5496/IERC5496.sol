//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface IERC5496 {
    /// @notice Emitted when `owner` changes the `privilege holder` of a NFT.
    event PrivilegeAssigned(
        uint256 tokenId,
        uint256 privilegeId,
        address user,
        uint256 expires
    );

    /// @notice Emitted when `privilege holder` changes the `holder` of a privilege
    event PrivilegeTransfered(
        uint256 tokenId,
        uint256 privilegeId,
        address from,
        address to
    );

    /// @notice Emitted when `contract owner` changes the `total privilege` of the collection
    event PrivilegeTotalChanged(uint256 newTotal, uint256 oldTotal);

    /// @notice set the privilege holder of a NFT.
    /// @dev expires should better be less than 30 days
    /// Throws if `msg.sender` is not approved or owner of the tokenId.
    /// @param tokenId The NFT to set privilege for
    /// @param privilegeId The privilege to set
    /// @param user The privilege holder to set
    /// @param expires For how long the privilege holder can have
    function setPrivilege(
        uint256 tokenId,
        uint256 privilegeId,
        address user,
        uint256 expires
    ) external;

    /// @notice Check if a privilege has expired
    /// @param tokenId The identifier of the queried NFT
    /// @param privilegeId The identifier of the queried privilege
    /// @return Whether a user has a certain privilege
    function privilegeExpires(uint256 tokenId, uint256 privilegeId)
        external
        view
        returns (uint256);

    /// @notice Check if a user has a certain privilege
    /// @param tokenId The identifier of the queried NFT
    /// @param privilegeId The identifier of the queried privilege
    /// @param user The address of the queried user
    /// @return Whether a user has a certain privilege
    function hasPrivilege(
        uint256 tokenId,
        uint256 privilegeId,
        address user
    ) external view returns (bool);
}
