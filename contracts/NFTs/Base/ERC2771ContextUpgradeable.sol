//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/**
 * @dev Context variant with ERC2771 support.
 */
abstract contract ERC2771ContextUpgradeable is
    Initializable,
    ContextUpgradeable
{
    mapping(address => bool) public trustedForwarders;

    /// @notice Sets trusted or not to an address
    /// @param addr The address to be set
    /// @param trusted Whether an address should be trusted or not
    function setTrustedForwarder(address addr, bool trusted) public virtual {
        trustedForwarders[addr] = trusted;
    }

    /// @notice Initialize function to be used by contracts that inherit from ERC2771ContextUpgradeable
    /// @param trustedForwarders_ The list of addresses to be set
    function _erc2771Init(address[] calldata trustedForwarders_)
        internal
        onlyInitializing
    {
        for (uint256 i = 0; i < trustedForwarders_.length; i++) {
            trustedForwarders[trustedForwarders_[i]] = true;
        }
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgSender()
        internal
        view
        virtual
        override
        returns (address sender)
    {
        if (trustedForwarders[msg.sender]) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            /// @solidity memory-safe-assembly
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgData()
        internal
        view
        virtual
        override
        returns (bytes calldata)
    {
        if (trustedForwarders[msg.sender]) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
