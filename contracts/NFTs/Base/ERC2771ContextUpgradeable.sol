// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (metatx/ERC2771Context.sol)

pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/**
 * @dev Context variant with ERC2771 support.
 */
abstract contract ERC2771ContextUpgradeable is
    Initializable,
    ContextUpgradeable
{
    address public trustedForwarder;

    /// @notice Sets the Trusted Forwarder address
    /// @param trustedForwarder_ The address to be set
    function setTrustedForwarder(address trustedForwarder_) public virtual {
        trustedForwarder = trustedForwarder_;
    }

    /// @notice Initialize function to be used by contracts that inherit from ERC2771ContextUpgradeable
    /// @param trustedForwarder_ The address to be set
    function _erc2771Init(address trustedForwarder_) internal onlyInitializing {
        trustedForwarder = trustedForwarder_;
    }

    /// @dev Based on the ERC-2771 to allow trusted relayers to call the contract
    function _msgSender()
        internal
        view
        virtual
        override
        returns (address sender)
    {
        if (trustedForwarder == msg.sender) {
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
        if (trustedForwarder == msg.sender) {
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
