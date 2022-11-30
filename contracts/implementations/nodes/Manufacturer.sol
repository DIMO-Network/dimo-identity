//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/ManufacturerStorage.sol";

import {DEFAULT_ADMIN_ROLE} from "../../shared/Roles.sol";
import {AttributeInfoPair} from "../../shared/Types.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title Vehicle
/// @notice Contract that represents the Manufacturer node
contract Manufacturer is AccessControlInternal {
    event ManufacturerIdProxySet(address indexed proxy);
    event ManufacturerAttributeAdded(string attribute);
    event ManufacturerAttributeSet(
        uint256 tokenId,
        string attribute,
        string info
    );
    event ControllerSet(address indexed controller);
    event ManufacturerNodeMinted(uint256 tokenId, address indexed owner);

    // ***** Admin management ***** //

    /// @notice Sets the NFT proxy associated with the Manufacturer node
    /// @dev Only an admin can set the address
    /// @param addr The address of the proxy
    function setManufacturerIdProxyAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        ManufacturerStorage.getStorage().idProxyAddress = addr;

        emit ManufacturerIdProxySet(addr);
    }

    /// @notice Adds an attribute to the whitelist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addManufacturerAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            AttributeSet.add(
                ManufacturerStorage.getStorage().whitelistedAttributes,
                attribute
            ),
            "Attribute already exists"
        );

        emit ManufacturerAttributeAdded(attribute);
    }

    /// @notice Sets a address controller
    /// @dev Only an admin can set new controllers
    /// @param _controller The address of the controller
    function setController(address _controller)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        ManufacturerStorage.Storage storage s = ManufacturerStorage
            .getStorage();
        require(_controller != address(0), "Non zero address");
        require(
            !s.controllers[_controller].isController,
            "Already a controller"
        );

        s.controllers[_controller].isController = true;

        emit ControllerSet(_controller);
    }

    // ***** Interaction with nodes ***** //

    /// @notice Mints manufacturers in batch
    /// @dev Caller must be an admin
    /// @dev It is assumed the 'Name' attribute is whitelisted in advance
    /// @param owner The address of the new owner
    /// @param names List of manufacturer names
    function mintManufacturerBatch(address owner, string[] calldata names)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(_hasRole(DEFAULT_ADMIN_ROLE, owner), "Owner must be an admin");

        ManufacturerStorage.Storage storage s = ManufacturerStorage
            .getStorage();

        uint256 newTokenId;
        string memory name;
        for (uint256 i = 0; i < names.length; i++) {
            name = names[i];

            require(
                s.manufacturerNameToNodeId[name] == 0,
                "Manufacturer name already registered"
            );

            newTokenId = INFT(s.idProxyAddress).safeMint(owner);

            s.manufacturerNameToNodeId[name] = newTokenId;
            s.nodeIdToManufacturerName[newTokenId] = name;

            emit ManufacturerNodeMinted(newTokenId, owner);
        }
    }

    /// @notice Mints a manufacturer
    /// @dev Caller must be an admin
    /// @param owner The address of the new owner
    /// @param name Name of the manufacturer
    /// @param attrInfoPairList List of attribute-info pairs to be added
    function mintManufacturer(
        address owner,
        string calldata name,
        AttributeInfoPair[] calldata attrInfoPairList
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ManufacturerStorage.Storage storage s = ManufacturerStorage
            .getStorage();
        require(!s.controllers[owner].manufacturerMinted, "Invalid request");
        require(
            s.manufacturerNameToNodeId[name] == 0,
            "Manufacturer name already registered"
        );

        address idProxyAddress = s.idProxyAddress;

        s.controllers[owner].isController = true;
        s.controllers[owner].manufacturerMinted = true;

        uint256 newTokenId = INFT(idProxyAddress).safeMint(owner);

        s.manufacturerNameToNodeId[name] = newTokenId;
        s.nodeIdToManufacturerName[newTokenId] = name;

        _setInfos(newTokenId, attrInfoPairList);

        emit ManufacturerNodeMinted(newTokenId, msg.sender);
    }

    /// @notice Add infos to node
    /// @dev attributes must be whitelisted
    /// @param tokenId Node id where the info will be added
    /// @param attrInfoList List of attribute-info pairs to be added
    function setManufacturerInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfoList
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            INFT(ManufacturerStorage.getStorage().idProxyAddress).exists(
                tokenId
            ),
            "Invalid manufacturer node"
        );
        _setInfos(tokenId, attrInfoList);
    }

    /// @notice Verify if an address is a controller
    /// @param addr the address to be verified
    function isController(address addr)
        external
        view
        returns (bool _isController)
    {
        _isController = ManufacturerStorage
            .getStorage()
            .controllers[addr]
            .isController;
    }

    /// @notice Verify if an address has minted a manufacturer
    /// @param addr the address to be verified
    function isManufacturerMinted(address addr)
        external
        view
        returns (bool _isManufacturerMinted)
    {
        _isManufacturerMinted = ManufacturerStorage
            .getStorage()
            .controllers[addr]
            .manufacturerMinted;
    }

    /// @notice Verify if an address is allowed to own a manufacturer node
    /// @dev The address must be a controller and not yet minted a node
    /// @param addr the address to be verified
    function isAllowedToOwnManufacturerNode(address addr)
        external
        view
        returns (bool _isAllowed)
    {
        ManufacturerStorage.Storage storage ms = ManufacturerStorage
            .getStorage();
        _isAllowed =
            ms.controllers[addr].isController &&
            !ms.controllers[addr].manufacturerMinted;
    }

    /// @notice Gets the Manufacturer Id by name
    /// @dev If the manufacturer is not minted it will return 0
    /// @param name Name associated with the manufacturer
    function getManufacturerIdByName(string calldata name)
        external
        view
        returns (uint256 nodeId)
    {
        nodeId = ManufacturerStorage.getStorage().manufacturerNameToNodeId[
            name
        ];
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /// @dev Internal function to add infos to node
    /// @dev attributes must be whitelisted
    /// @param tokenId Node id where the info will be added
    /// @param attrInfoPairList List of attribute-info pairs to be added
    function _setInfos(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfoPairList
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        ManufacturerStorage.Storage storage s = ManufacturerStorage
            .getStorage();
        address idProxyAddress = s.idProxyAddress;

        for (uint256 i = 0; i < attrInfoPairList.length; i++) {
            require(
                AttributeSet.exists(
                    s.whitelistedAttributes,
                    attrInfoPairList[i].attribute
                ),
                "Not whitelisted"
            );
            ns.nodes[idProxyAddress][tokenId].info[
                attrInfoPairList[i].attribute
            ] = attrInfoPairList[i].info;

            emit ManufacturerAttributeSet(
                tokenId,
                attrInfoPairList[i].attribute,
                attrInfoPairList[i].info
            );
        }
    }

    /// @dev Internal function to update a single attribute
    /// @dev attribute must be whitelisted
    /// @param tokenId Node where the info will be added
    /// @param attribute Attribute to be updated
    /// @param info Info to be set
    function _setAttributeInfo(
        uint256 tokenId,
        string calldata attribute,
        string calldata info
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        ManufacturerStorage.Storage storage m = ManufacturerStorage
            .getStorage();
        require(
            AttributeSet.exists(m.whitelistedAttributes, attribute),
            "Not whitelisted"
        );
        address idProxyAddress = m.idProxyAddress;

        ns.nodes[idProxyAddress][tokenId].info[attribute] = info;
        emit ManufacturerAttributeSet(tokenId, attribute, info);
    }
}
