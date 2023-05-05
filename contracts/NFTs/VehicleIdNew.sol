//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../interfaces/IDimoRegistry.sol";
import "./Base/MultiPrivilege/MultiPrivilegeTransferable.sol";

import "hardhat/console.sol";

contract VehicleIdNew is Initializable, MultiPrivilege {
    IDimoRegistry private _dimoRegistry;
    address private _virtualDeviceId;

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

    function setVirtualDeviceAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        _virtualDeviceId = addr;
    }

    /// @notice Internal function to transfer a token
    /// @dev Only the token owner can transfer (no approvals)
    /// @dev Pairings are maintained
    /// @dev Clears all privileges
    /// @param from Old owner
    /// @param to New owner
    /// @param tokenId Token Id to be transferred
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        // Approvals are not accepted for now
        require(msg.sender == from, "Caller is not authorized");

        console.log(msg.sender);
        INFT(_virtualDeviceId).safeTransferFrom(from, to, tokenId);
        // (bool success, ) = _virtualDeviceId.call(
        //     abi.encodeWithSignature(
        //         "safeTransferFrom(address,address,uint256)",
        //         from,
        //         to,
        //         tokenId
        //     )
        // );
        // require(success, "Did not work");

        super._transfer(from, to, tokenId);
    }
}
