// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Forwarder is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    struct Request {
        address to;
        bytes data;
    }

    constructor() {
        _disableInitializers();
    }

    function initialize() external onlyInitializing {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    /// @notice Executes a list of calldata requests
    /// @dev For the purpose of this contract, all requests must succeed
    /// @param reqs list of requests
    function execute(Request[] calldata reqs) external {
        Request memory req;
        bool success;

        for (uint256 i = 0; i < reqs.length; i++) {
            req = reqs[i];

            (success, ) = req.to.call(abi.encodePacked(req.data, msg.sender));
            require(success, "");
        }
    }

    /// @notice Internal function to authorize contract upgrade
    /// @dev Caller must have the upgrader role
    /// @param newImplementation New contract implementation address
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
