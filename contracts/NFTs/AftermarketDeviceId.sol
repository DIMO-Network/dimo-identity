//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilegeTransferable.sol";

error ZeroAddress();
error Unauthorized();

contract AftermarketDeviceId is Initializable, MultiPrivilege {
    IDimoRegistry public _dimoRegistry;
    mapping(address => bool) public trustedForwarders;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_,
        address dimoRegistry_,
        address[] calldata trustedForwarders_
    ) external initializer {
        _multiPrivilegeInit(name_, symbol_, baseUri_);

        _dimoRegistry = IDimoRegistry(dimoRegistry_);
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
    function setDimoRegistryAddress(address addr)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (addr == address(0)) revert ZeroAddress();
        _dimoRegistry = IDimoRegistry(addr);
    }

    /**
     * @notice Sets trusted or not to an address
     * @dev Only an admin can set a trusted forwarder
     * @param addr The address to be set
     * @param trusted Whether an address should be trusted or not
     */
    function setTrustedForwarder(address addr, bool trusted)
        public
        onlyRole(ADMIN_ROLE)
    {
        trustedForwarders[addr] = trusted;
    }

    /**
     * @notice Gets the definition URI associated to a token
     * @param tokenId Token Id to be checked
     * @return definitionURI Definition URI
     */
    function getDefinitionURI(uint256 tokenId)
        external
        view
        returns (string memory definitionURI)
    {
        definitionURI = _dimoRegistry.getInfo(
            address(this),
            tokenId,
            "Definition URI"
        );
    }

    /**
     * @notice Internal function to transfer a token
     * @dev Only the token owner can transfer (no approvals)
     * @dev Clears all privileges and beneficiaries
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
        if (_msgSender() != address(_dimoRegistry) && _msgSender() != from)
            revert Unauthorized();

        // Resets aftermarket device beneficiary
        _dimoRegistry.setAftermarketDeviceBeneficiary(tokenId, address(0));

        super._transfer(from, to, tokenId);
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
