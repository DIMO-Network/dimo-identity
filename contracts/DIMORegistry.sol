//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "./libraries/DIMOStorage.sol";

contract DIMORegistry {
    event AdminRoleTransferred(
        address indexed previousAdmin,
        address indexed newAdmin
    );
    event ModuleAdded(address indexed moduleAddr, bytes4[] selectors);
    event ModuleRemoved(address indexed moduleAddr, bytes4[] selectors);
    event ModuleUpdated(
        address indexed newImplementation,
        address indexed oldImplementation,
        bytes4[] newSelectors,
        bytes4[] oldSelectors
    );

    constructor() {
        _setAdmin(msg.sender);
    }

    modifier onlyOwner() {
        require(
            DIMOStorage.getStorage().admin == msg.sender,
            "Caller is not the owner"
        );
        _;
    }

    /// @notice pass a call to a module
    /* solhint-disable no-complex-fallback, payable-fallback, no-inline-assembly */
    fallback() external {
        address implementation = DIMOStorage.getStorage().implementations[
            msg.sig
        ];
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(
                gas(),
                implementation,
                0,
                calldatasize(),
                0,
                0
            )
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    /* solhint-enable no-complex-fallback, payable-fallback, no-inline-assembly */

    /// @notice Transfers admin role of the contract to a new account (`newAdmin`)
    /// @param newAdmin new admin
    function transferAdminRole(address newAdmin) external onlyOwner {
        require(newAdmin != address(0), "newAdmin cannot be zero address");
        _setAdmin(newAdmin);
    }

    /// @notice update module
    /// @dev oldImplementation should be registered
    /// @param newImplementation address of the module to register
    /// @param oldImplementation address of the module to remove
    /// @param newSelectors new function signatures list
    /// @param oldSelectors old function signatures list
    function updateModule(
        address newImplementation,
        address oldImplementation,
        bytes4[] calldata newSelectors,
        bytes4[] calldata oldSelectors
    ) external onlyOwner {
        removeModule(oldImplementation, oldSelectors);
        addModule(newImplementation, newSelectors);
        emit ModuleUpdated(
            newImplementation,
            oldImplementation,
            newSelectors,
            oldSelectors
        );
    }

    /// @notice Adds a new module
    /// @dev function selector should not have been registered.
    /// @param implementation address of the implementation
    /// @param selectors selectors of the implementation contract
    function addModule(address implementation, bytes4[] calldata selectors)
        public
        onlyOwner
    {
        DIMOStorage.Storage storage s = DIMOStorage.getStorage();
        for (uint256 i = 0; i < selectors.length; i++) {
            require(
                s.implementations[selectors[i]] == address(0),
                "Selector already registered"
            );
            s.implementations[selectors[i]] = implementation;
        }
        bytes32 hash = keccak256(abi.encode(selectors));
        s.selectorsHash[implementation] = hash;
        emit ModuleAdded(implementation, selectors);
    }

    /// @notice Adds a new module and supported functions
    /// @dev function selector should not exist.
    /// @param implementation implementation address
    /// @param selectors function signatures
    function removeModule(address implementation, bytes4[] calldata selectors)
        public
        onlyOwner
    {
        DIMOStorage.Storage storage s = DIMOStorage.getStorage();
        bytes32 hash = keccak256(abi.encode(selectors));
        require(
            s.selectorsHash[implementation] == hash,
            "Invalid selector list"
        );

        for (uint256 i = 0; i < selectors.length; i++) {
            require(
                s.implementations[selectors[i]] == implementation,
                "Unregistered selector"
            );
            s.implementations[selectors[i]] = address(0);
        }
        emit ModuleRemoved(implementation, selectors);
    }

    /// @notice sets a new admin
    /// @param newAdmin new admin
    function _setAdmin(address newAdmin) private {
        DIMOStorage.getStorage().admin = newAdmin;
        emit AdminRoleTransferred(address(0), newAdmin);
    }
}
