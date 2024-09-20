//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "../interfaces/ISacd.sol";
import "./Base/MultiPrivilege/MultiPrivilegeTransferableBurnable.sol";

error ZeroAddress();
error Unauthorized();
error TransferFailed(address idProxy, uint256 id, string errorMessage);

contract VehicleId is Initializable, MultiPrivilege {
    struct SacdInput {
        address grantee;
        uint256 permissions;
        uint256 expiration;
        string source;
    }

    uint256 private constant VEHICLE_SUBSCRIBE_LIVE_DATA_PRIVILEGE = 6;

    IDimoRegistry public _dimoRegistry;
    address public syntheticDeviceId;
    mapping(address => bool) public trustedForwarders;
    address public sacd;

    // 0x42842e0e is the selector of safeTransferFrom(address,address,uint256)
    bytes4 public constant SAFE_TRANSFER_FROM = 0x42842e0e;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_,
        address dimoRegistry_,
        address syntheticDeviceId_,
        address sacd_,
        address[] calldata trustedForwarders_
    ) external initializer {
        _multiPrivilegeInit(name_, symbol_, baseUri_);

        _dimoRegistry = IDimoRegistry(dimoRegistry_);
        syntheticDeviceId = syntheticDeviceId_;
        sacd = sacd_;
        for (uint256 i = 0; i < trustedForwarders_.length; i++) {
            trustedForwarders[trustedForwarders_[i]] = true;
        }

        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Sets the DIMO Registry address
     * @dev Only an admin can set the DIMO Registry address
     * @param addr The address to be set
     */
    function setDimoRegistryAddress(
        address addr
    ) external onlyRole(ADMIN_ROLE) {
        if (addr == address(0)) revert ZeroAddress();
        _dimoRegistry = IDimoRegistry(addr);
    }

    /**
     * @notice Sets the Synthetic Device Id address
     * @dev Only an admin can set the Synthetic Device Id address
     * @param addr The address to be set
     */
    function setSyntheticDeviceIdAddress(
        address addr
    ) external onlyRole(ADMIN_ROLE) {
        if (addr == address(0)) revert ZeroAddress();
        syntheticDeviceId = addr;
    }

    /**
     * @notice Sets the SACD address
     * @dev Only an admin can set the SACD address
     * @param addr The address to be set
     */
    function setSacdAddress(address addr) external onlyRole(ADMIN_ROLE) {
        if (addr == address(0)) revert ZeroAddress();
        sacd = addr;
    }

    /**
     * @notice Sets trusted or not to an address
     * @dev Only an admin can set a trusted forwarder
     * @param addr The address to be set
     * @param trusted Whether an address should be trusted or not
     */
    function setTrustedForwarder(
        address addr,
        bool trusted
    ) external onlyRole(ADMIN_ROLE) {
        trustedForwarders[addr] = trusted;
    }

    // TODO Documentation
    // Remind that super.safeMint has an onlyRole(MINTER_ROLE)
    function safeMintWithSacd(
        address to,
        SacdInput calldata sacdInput
    ) external returns (uint256 tokenId) {
        tokenId = super.safeMint(to);
        ISacd(sacd).setPermissions(
            address(this),
            tokenId,
            sacdInput.grantee,
            sacdInput.permissions,
            sacdInput.expiration,
            sacdInput.source
        );
    }

    /**
     * @notice Gets the data URI associated to a token
     * @param tokenId Token Id to be checked
     * @return dataURI Data URI
     */
    function getDataURI(
        uint256 tokenId
    ) external view returns (string memory dataURI) {
        dataURI = _dimoRegistry.getDataURI(address(this), tokenId);
    }

    /**
     * @notice Gets the definition URI associated to a token
     * @param tokenId Token Id to be checked
     * @return definitionURI Definition URI
     */
    function getDefinitionURI(
        uint256 tokenId
    ) external view returns (string memory definitionURI) {
        definitionURI = _dimoRegistry.getInfo(
            address(this),
            tokenId,
            "DefinitionURI"
        );
    }

    /**
     * @notice Function to burn a token
     * @dev To be called by DIMORegistry or a token owner
     *  - DIMORegistry calls this function in burnVehicleSign function
     *  - When a user calls it, burning is validated in the DIMORegistry
     * @param tokenId Token Id to be burned
     */
    function burn(uint256 tokenId) public override {
        _dimoRegistry.onBurnVehicleStream(tokenId);

        if (_msgSender() != address(_dimoRegistry)) {
            _dimoRegistry.validateBurnAndResetNode(tokenId);
            ERC721BurnableUpgradeable.burn(tokenId);
        } else {
            super._burn(tokenId);
        }
    }

    /**
     * @notice Internal function to transfer a token. If the vehicle is
     * paired to a synthetic device, the corresponding token is also transferred.
     * @dev Only the token owner can transfer (no approvals)
     *  - Pairings are maintained
     *  - Clears all privileges
     *  - 0x42842e0e is the selector of safeTransferFrom(address,address,uint256)
     * @param from Old owner
     * @param to New owner
     * @param tokenId Token Id to be transferred
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        // Approvals are not accepted for now
        if (_msgSender() != from) revert Unauthorized();

        uint256 pairedSdId = _dimoRegistry.getNodeLink(
            address(this),
            syntheticDeviceId,
            tokenId
        );

        if (pairedSdId != 0) {
            (bool success, bytes memory data) = syntheticDeviceId.call(
                abi.encodePacked(
                    abi.encodeWithSelector(
                        SAFE_TRANSFER_FROM,
                        _msgSender(),
                        to,
                        pairedSdId
                    ),
                    _msgSender()
                )
            );

            if (!success) {
                // Decodes the error message from bytes to string
                assembly {
                    data := add(data, 0x04)
                }
                revert TransferFailed(
                    syntheticDeviceId,
                    pairedSdId,
                    abi.decode(data, (string))
                );
            }
        }

        _dimoRegistry.onTransferVehicleStream(to, tokenId);
        ISacd(sacd).onTransfer(address(this), tokenId);

        super._transfer(from, to, tokenId);
    }

    /**
     * @notice If the privilege set is to subscribe to live data,
     * it subscribes the user to the vehicle Id data if the stream exists
     * @dev Override hook from MultiPrivilege parent contract
     * @param tokenId Token Id associated with the privilege
     * @param privId Privilege Id to be set
     * @param user User address that will receive the privilege
     * @param expires Expiration of the privilege
     */
    function _afterPrivilegeSet(
        uint256 tokenId,
        uint256 privId,
        address user,
        uint256 expires
    ) internal override {
        if (privId == VEHICLE_SUBSCRIBE_LIVE_DATA_PRIVILEGE) {
            _dimoRegistry.onSetSubscribePrivilege(tokenId, user, expires);
        }
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgSender() internal view override returns (address sender) {
        if (trustedForwarders[msg.sender]) {
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgData() internal view override returns (bytes calldata) {
        if (trustedForwarders[msg.sender]) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }
}
