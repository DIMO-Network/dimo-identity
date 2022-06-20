//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/DIMOStorage.sol";
import "../libraries/VehicleStorage.sol";
import "@solidstate/contracts/token/ERC721/base/ERC721BaseInternal.sol";

contract Vehicle is ERC721BaseInternal {
    event AttributeAdded(string attribute);

    modifier onlyAdmin() {
        require(
            DIMOStorage.getStorage().admin == msg.sender,
            "Caller is not an admin"
        );
        _;
    }

    // ***** Owner management *****//

    /// @notice Adds an attribute to the whielist
    /// @dev Only the owner can set new controllers
    /// @param attribute The attribute to be added
    function addVehicleAttribute(string calldata attribute) external onlyAdmin {
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        AttributeSet.add(s.whitelistedAttributes, attribute);

        emit AttributeAdded(attribute);
    }

    // ***** Interaction with nodes *****//

    /// @notice Mints a vehicle
    /// @dev Caller must be an admin
    /// @param rootNode Parent root node
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintVehicle(
        uint256 rootNode,
        address _owner,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyAdmin {
        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();

        require(ds.records[rootNode].parentNode == 0, "Invalid node");

        ds.currentIndex++;
        uint256 newNodeId = ds.currentIndex;

        ds.records[newNodeId].parentNode = rootNode;

        _safeMint(_owner, newNodeId);
        _setInfo(newNodeId, attributes, infos);
    }

    /// @notice Add infos to node
    /// @dev Only node owner can call this function
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param node Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setVehicleInfo(
        uint256 node,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyAdmin {
        _setInfo(node, attributes, infos);
    }

    // ***** PRIVATE FUNCTIONS *****//

    /// @dev Internal function to add infos to node
    /// @dev Only node owner can call this function
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param node Node where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function _setInfo(
        uint256 node,
        string[] calldata attributes,
        string[] calldata infos
    ) private {
        require(attributes.length == infos.length, "Same length");

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                AttributeSet.exists(s.whitelistedAttributes, attributes[i]),
                "Not whitelisted"
            );
            ds.records[node].info[attributes[i]] = infos[i];
        }
    }
}
