//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "./Base/NftBaseUpgradeable.sol";
import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/IMultiPrivilege.sol";

error ZeroAddress();

contract ManufacturerId is Initializable, NftBaseUpgradeable, IMultiPrivilege {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    struct PrivilegeData {
        bool enabled;
        string description;
    }

    struct SetPrivilegeData {
        uint256 tokenId;
        uint256 privId;
        address user;
        uint256 expires;
    }

    IDimoRegistry public _dimoRegistry;

    CountersUpgradeable.Counter private _privilegeCounter;

    // privId => privilegeData
    mapping(uint256 => PrivilegeData) public privilegeRecord;

    // tokenId => version
    mapping(uint256 => uint256) public tokenIdToVersion;

    // tokenId => version => privId => user => expires at
    mapping(uint256 => mapping(uint256 => mapping(uint256 => mapping(address => uint256))))
        public privilegeEntry;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_,
        address dimoRegistry_
    ) external initializer {
        _baseNftInit(name_, symbol_, baseUri_);

        _dimoRegistry = IDimoRegistry(dimoRegistry_);

        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Sets the DIMO Registry address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param addr The address to be set
    function setDimoRegistryAddress(
        address addr
    ) external onlyRole(ADMIN_ROLE) {
        if (addr == address(0)) revert ZeroAddress();
        _dimoRegistry = IDimoRegistry(addr);
    }

    /// @notice Creates a new privilege
    /// @dev The caller must have the admin role
    /// @dev The privilege Id auto increments
    /// @param enabled Sets new privilege enabled or not
    /// @param description Description of the new privilege
    function createPrivilege(
        bool enabled,
        string calldata description
    ) external onlyRole(ADMIN_ROLE) {
        _privilegeCounter.increment();
        uint256 privilegeId = _privilegeCounter.current();

        privilegeRecord[privilegeId] = PrivilegeData(enabled, description);

        emit PrivilegeCreated(privilegeId, enabled, description);
    }

    /// @notice Enables existing privilege
    /// @dev The caller must have the admin role
    /// @param privId Privilege Id to be enabled
    function enablePrivilege(uint256 privId) external onlyRole(ADMIN_ROLE) {
        require(privId <= _privilegeCounter.current(), "Invalid privilege id");
        require(!privilegeRecord[privId].enabled, "Privilege is enabled");

        privilegeRecord[privId].enabled = true;

        emit PrivilegeEnabled(privId);
    }

    /// @notice Disables existing privilege
    /// @dev The caller must have the admin role
    /// @param privId Privilege Id to be disabled
    function disablePrivilege(uint256 privId) external onlyRole(ADMIN_ROLE) {
        require(privId <= _privilegeCounter.current(), "Invalid privilege id");
        require(privilegeRecord[privId].enabled, "Privilege is disabled");

        privilegeRecord[privId].enabled = false;

        emit PrivilegeDisabled(privId);
    }

    /// @notice Sets a privilege to a user with expiration
    /// It is possible to set the expiration to 0 to revoke the privilege
    /// @dev The caller must be the owner of the token or approved
    /// @param tokenId Token Id associated with the privilege
    /// @param privId Privilege Id to be set
    /// @param user User address that will receive the privilege
    /// @param expires Expiration of the privilege
    function setPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    ) external {
        _setPrivilege(_msgSender(), tokenId, privId, user, expires);
    }

    /// @notice Sets multiple privileges to a user with expiration
    /// It is possible to set the expiration to 0 to revoke the privilege
    /// @dev The caller must be the owner of the token or approved
    /// @param privData description
    function setPrivileges(SetPrivilegeData[] calldata privData) external {
        uint256 tokenId;
        uint256 privId;
        address user;
        uint256 expires;

        for (uint256 i = 0; i < privData.length; i++) {
            tokenId = privData[i].tokenId;
            privId = privData[i].privId;
            user = privData[i].user;
            expires = privData[i].expires;

            _setPrivilege(_msgSender(), tokenId, privId, user, expires);
        }
    }

    /// @notice Checks if a user has or not a valid privilege
    /// The owner of the token will always have the privilege
    /// @param tokenId Token Id associated with the privilege
    /// @param privId Privilege Id to be checked
    /// @param user User address to be checked
    /// @return boolean
    function hasPrivilege(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (bool) {
        return
            (privilegeRecord[privId].enabled &&
                (privilegeEntry[tokenId][tokenIdToVersion[tokenId]][privId][
                    user
                ] >= block.timestamp)) || ownerOf(tokenId) == user;
    }

    /// @notice Checks the expiration of a certain user privilege
    /// @param tokenId Token Id associated with the privilege
    /// @param privId Privilege Id to be checked
    /// @param user User address to be checked
    /// @return uint256
    function privilegeExpiresAt(
        uint256 tokenId,
        uint256 privId,
        address user
    ) external view returns (uint256) {
        return privilegeEntry[tokenId][tokenIdToVersion[tokenId]][privId][user];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override returns (bool) {
        return
            interfaceId == type(IMultiPrivilege).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice Internal function to transfer a token
    /// @dev Caller must have the transferer role
    /// @dev The new owner must bet allowed to own a Manufacturer node
    /// @param from Old owner
    /// @param to New owner
    /// @param tokenId Token Id to be transferred
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        _dimoRegistry.updateManufacturerMinted(from, to);
        tokenIdToVersion[tokenId]++;
        super._transfer(from, to, tokenId);
    }

    /// @notice Internal function to set a privilege to a user with expiration
    /// @dev The caller must be the owner of the token or approved
    /// @param owner The token owner
    /// @param tokenId Token Id associated with the privilege
    /// @param privId Privilege Id to be set
    /// @param user User address that will receive the privilege
    /// @param expires Expiration of the privilege
    function _setPrivilege(
        address owner,
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    ) private {
        require(
            _isApprovedOrOwner(owner, tokenId),
            "Caller is not owner nor approved"
        );
        require(privId <= _privilegeCounter.current(), "Invalid privilege id");
        require(privilegeRecord[privId].enabled, "Privilege not enabled");

        privilegeEntry[tokenId][tokenIdToVersion[tokenId]][privId][
            user
        ] = expires;

        emit PrivilegeSet(
            tokenId,
            tokenIdToVersion[tokenId],
            privId,
            user,
            expires
        );
    }
}
