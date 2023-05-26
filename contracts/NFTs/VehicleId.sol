//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilegeTransferable.sol";

error ZeroAddress();
error Unauthorized();
error TransferFailed(address idProxy, uint256 id, string errorMessage);

contract VehicleId is Initializable, MultiPrivilege {
    IDimoRegistry public _dimoRegistry;
    address public virtualDeviceId;
    mapping(address => bool) public trustedForwarders;

    // 0x42842e0e is the selector of safeTransferFrom(address,address,uint256)
    bytes4 public constant SAFE_TRANSFER_FROM = 0x42842e0e;
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

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

        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /// @notice Sets the DIMO Registry address
    /// @dev Only an admin can set the DIMO Registry address
    /// @param addr The address to be set
    function setDimoRegistryAddress(address addr)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (addr == address(0)) revert ZeroAddress();
        _dimoRegistry = IDimoRegistry(addr);
    }

    /// @notice Sets the Virtual Device Id address
    /// @dev Only an admin can set the Virtual Device Id address
    /// @param addr The address to be set
    function setVirtualDeviceIdAddress(address addr)
        external
        onlyRole(ADMIN_ROLE)
    {
        if (addr == address(0)) revert ZeroAddress();
        virtualDeviceId = addr;
    }

    /// @notice Sets trusted or not to an address
    /// @dev Only an admin can set a trusted forwarder
    /// @param addr The address to be set
    /// @param trusted Whether an address should be trusted or not
    function setTrustedForwarder(address addr, bool trusted)
        external
        onlyRole(ADMIN_ROLE)
    {
        trustedForwarders[addr] = trusted;
    }

    /**
     * @notice Internal function to transfer a token. If the vehicle is
     * paired to a virtual device, the corresponding token is also transferred.
     * @dev Only the token owner can transfer (no approvals)
     * @dev Pairings are maintained
     * @dev Clears all privileges
     * @dev 0x42842e0e is the selector of safeTransferFrom(address,address,uint256)
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

        uint256 pairedVirtualDeviceId = _dimoRegistry.getNodeLink(
            address(this),
            virtualDeviceId,
            tokenId
        );

        if (pairedVirtualDeviceId != 0) {
            (bool success, bytes memory data) = virtualDeviceId.call(
                abi.encodePacked(
                    abi.encodeWithSelector(
                        SAFE_TRANSFER_FROM,
                        _msgSender(),
                        to,
                        pairedVirtualDeviceId
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
                    virtualDeviceId,
                    pairedVirtualDeviceId,
                    abi.decode(data, (string))
                );
            }
        }

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
