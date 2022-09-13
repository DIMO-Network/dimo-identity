//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../../access/AccessControlInternal.sol";
import "../../libraries/AdLicenseValidatorStorage.sol";

// TODO Documentation
contract AdLicenseValidator is AccessControlInternal {
    /// @notice Sets the foundation address
    /// @dev Only an admin can set the address
    /// @param _foundation The foundation address
    function setFoundationAddress(address _foundation)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AdLicenseValidatorStorage.getStorage().foundation = _foundation;
    }

    /// @notice Sets the DIMO token address
    /// @dev Only an admin can set the token address
    /// @param _dimoToken The DIMO token address
    function setDimoToken(address _dimoToken)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AdLicenseValidatorStorage.getStorage().dimoToken = IDimo(_dimoToken);
    }

    /// @notice Sets the License contract address
    /// @dev Only an admin can set the license contract address
    /// @param _license The License contract address
    function setLicense(address _license)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AdLicenseValidatorStorage.getStorage().license = ILicense(_license);
    }

    /// @notice Sets the Aftermarket Device mint cost
    /// @dev Only an admin can set the license contract address
    /// @param _adMintCost The new cost per mint
    function setAdMintCost(uint256 _adMintCost)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        AdLicenseValidatorStorage.getStorage().adMintCost = _adMintCost;
    }
}
