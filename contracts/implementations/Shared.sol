//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../libraries/SharedStorage.sol";

import {ADMIN_ROLE} from "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title Shared
 * @notice TODO Documentation
 */
contract Shared is AccessControlInternal {
    event FoundationSet(address indexed foundation);
    event DimoTokenSet(address indexed dimoToken);
    event DimoCreditSet(address indexed dimoCredit);

    /**
     * @notice Sets the foundation address
     * @dev Only an admin can set the address
     * @param foundation The foundation address
     */
    function setFoundation(address foundation) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().foundation = foundation;

        emit FoundationSet(foundation);
    }

    // TODO Documentation
    // TODO Rename to setDimoTokenAddress after deprecating AdLicenseValidator
    function setDimoTokenAddress(
        address dimoToken
    ) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().dimoToken = dimoToken;

        emit DimoTokenSet(dimoToken);
    }

    // TODO Documentation
    function setDimoCredit(address dimoCredit) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().dimoCredit = dimoCredit;

        emit DimoCreditSet(dimoCredit);
    }

    // TODO Documentation
    function getFoundation() external view returns (address foundation) {
        foundation = SharedStorage.getStorage().foundation;
    }

    // TODO Documentation
    function getDimoToken() external view returns (address dimoToken) {
        dimoToken = SharedStorage.getStorage().dimoToken;
    }

    // TODO Documentation
    function getDimoCredit() external view returns (address dimoCredit) {
        dimoCredit = SharedStorage.getStorage().dimoCredit;
    }
}
