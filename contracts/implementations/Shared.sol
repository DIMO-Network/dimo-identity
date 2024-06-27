//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../libraries/SharedStorage.sol";

import {ADMIN_ROLE} from "../shared/Roles.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/**
 * @title Shared
 * @notice Contract to manage shared variables
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

    // TODO Rename to setDimoTokenAddress after deprecating AdLicenseValidator
    /**
     * @notice Sets the DIMO token address
     * @dev Only an admin can set the address
     * @param dimoToken The DIMO token address
     */
    function setDimoTokenAddress(
        address dimoToken
    ) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().dimoToken = dimoToken;

        emit DimoTokenSet(dimoToken);
    }

    /**
     * @notice Sets the DIMO Credit token address
     * @dev Only an admin can set the address
     * @param dimoCredit The DIMO Credit token address
     */
    function setDimoCredit(address dimoCredit) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().dimoCredit = dimoCredit;

        emit DimoCreditSet(dimoCredit);
    }

    /**
     * @notice Gets the Foundation address
     */
    function getFoundation() external view returns (address foundation) {
        foundation = SharedStorage.getStorage().foundation;
    }

    /**
     * @notice Gets the DIMO token address
     */
    function getDimoToken() external view returns (address dimoToken) {
        dimoToken = SharedStorage.getStorage().dimoToken;
    }

    /**
     * @notice Gets the DIMO Credit token address
     */
    function getDimoCredit() external view returns (address dimoCredit) {
        dimoCredit = SharedStorage.getStorage().dimoCredit;
    }
}
