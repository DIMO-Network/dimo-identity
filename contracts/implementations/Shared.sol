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
    event ManufacturerLicenseSet(address indexed manufacturerLicense);
    event ConnectionsManagerSet(address indexed connectionsManager);
    event SacdSet(address indexed sacd);
    event StorageNodeSet(address indexed storageNode);

    /**
     * @notice Sets the foundation address
     * @dev Only an admin can set the address
     * @param foundation The foundation address
     */
    function setFoundation(address foundation) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().foundation = foundation;

        emit FoundationSet(foundation);
    }

    /**
     * @notice Sets the DIMO token address
     * @dev Only an admin can set the address
     * @param dimoToken The DIMO token address
     */
    function setDimoToken(address dimoToken) external onlyRole(ADMIN_ROLE) {
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
     * @notice Sets the Manufacturer License contract address
     * @dev Only an admin can set the Manufacturer License contract address
     * @param manufacturerLicense The Manufacturer License contract address
     */
    function setManufacturerLicense(
        address manufacturerLicense
    ) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().manufacturerLicense = manufacturerLicense;

        emit ManufacturerLicenseSet(manufacturerLicense);
    }

    /**
     * @notice Sets the Connections Manager contract address
     * @dev Only an admin can set the Connections Manager contract address
     * @param connectionsManager The Connections Manager contract address
     */
    function setConnectionsManager(
        address connectionsManager
    ) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().connectionsManager = connectionsManager;

        emit ConnectionsManagerSet(connectionsManager);
    }

    /**
     * @notice Sets the SACD contract address
     * @dev Only an admin can set the SACD contract address
     * @param sacd The SACD contract address
     */
    function setSacd(address sacd) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().sacd = sacd;

        emit SacdSet(sacd);
    }

    /**
     * @notice Sets the StorageNode contract address
     * @dev Only an admin can set the StorageNode contract address
     * @param storageNode The StorageNode contract address
     */
    function setStorageNode(address storageNode) external onlyRole(ADMIN_ROLE) {
        SharedStorage.getStorage().storageNode = storageNode;

        emit StorageNodeSet(storageNode);
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

    /**
     * @notice Gets the Manufacturer License address
     */
    function getManufacturerLicense()
        external
        view
        returns (address manufacturerLicense)
    {
        manufacturerLicense = SharedStorage.getStorage().manufacturerLicense;
    }

    /**
     * @notice Gets the ConnectionsManager address
     */
    function getConnectionsManager()
        external
        view
        returns (address connectionsManager)
    {
        connectionsManager = SharedStorage.getStorage().connectionsManager;
    }

    /**
     * @notice Gets the SACD address
     */
    function getSacd() external view returns (address sacd) {
        sacd = SharedStorage.getStorage().sacd;
    }

    /**
     * @notice Gets the StorageNode address
     */
    function getStorageNode() external view returns (address storageNode) {
        storageNode = SharedStorage.getStorage().storageNode;
    }
}
