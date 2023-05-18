//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilegeTransferable.sol";

contract AftermarketDeviceId is Initializable, MultiPrivilege {
    IDimoRegistry private _dimoRegistry;
    address public trustedForwarder;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string calldata name_,
        string calldata symbol_,
        string calldata baseUri_
    ) external initializer {
        _baseNftInit(name_, symbol_, baseUri_);
    }

    /// @notice Sets the DIMO Registry address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param addr The address to be set
    function setDimoRegistryAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        _dimoRegistry = IDimoRegistry(addr);
    }

    /// @notice Sets the Trusted Forwarder address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param trustedForwarder_ The address to be set
    function setTrustedForwarder(address trustedForwarder_)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(trustedForwarder_ != address(0), "Non zero address");
        trustedForwarder = trustedForwarder_;
    }

    /// @notice Internal function to transfer a token
    /// @dev Only the token owner can transfer (no approvals)
    /// @dev Clears all privileges and beneficiaries
    /// @param from Old owner
    /// @param to New owner
    /// @param tokenId Token Id to be transferred
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        // Approvals are not accepted for now
        require(
            _msgSender() == address(_dimoRegistry) || _msgSender() == from,
            "Caller is not authorized"
        );

        // Resets aftermarket device beneficiary
        _dimoRegistry.setAftermarketDeviceBeneficiary(tokenId, address(0));

        super._transfer(from, to, tokenId);
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgSender() internal view override returns (address sender) {
        if (msg.sender == trustedForwarder) {
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgData() internal view override returns (bytes calldata) {
        if (msg.sender == trustedForwarder) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }
}
