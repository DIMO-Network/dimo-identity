//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/IntegrationStorage.sol";

import {DEFAULT_ADMIN_ROLE} from "../../shared/Roles.sol";
import {AttributeInfoPair} from "../../shared/Types.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// @title Integration
/// @notice Contract that represents the Integration node
contract Integration is AccessControlInternal {
    event IntegrationIdProxySet(address indexed proxy);
    event IntegrationAttributeAdded(string attribute);
    event IntegrationAttributeSet(
        uint256 tokenId,
        string attribute,
        string info
    );
    event ControllerSet(address indexed controller);
    event IntegrationNodeMinted(uint256 tokenId, address indexed owner);

    modifier onlyNftProxy() {
        require(
            msg.sender == IntegrationStorage.getStorage().idProxyAddress,
            "Only NFT Proxy"
        );
        _;
    }

    // ***** Admin management ***** //

    /// @notice Sets the NFT proxy associated with the Integration node
    /// @dev Only an admin can set the address
    /// @param addr The address of the proxy
    function setIntegrationIdProxyAddress(address addr)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(addr != address(0), "Non zero address");
        IntegrationStorage.getStorage().idProxyAddress = addr;

        emit IntegrationIdProxySet(addr);
    }

    /// @notice Adds an attribute to the whitelist
    /// @dev Only an admin can add a new attribute
    /// @param attribute The attribute to be added
    function addIntegrationAttribute(string calldata attribute)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            AttributeSet.add(
                IntegrationStorage.getStorage().whitelistedAttributes,
                attribute
            ),
            "Attribute already exists"
        );

        emit IntegrationAttributeAdded(attribute);
    }

    /// @notice Sets a address controller
    /// @dev Only an admin can set new controllers
    /// @param _controller The address of the controller
    function setIntegrationController(address _controller)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
        require(_controller != address(0), "Non zero address");
        require(
            !s.controllers[_controller].isController,
            "Already a controller"
        );

        s.controllers[_controller].isController = true;

        emit ControllerSet(_controller);
    }

    // ***** Interaction with nodes ***** //

    /// @notice Mints an integration
    /// @dev Caller must be an admin
    /// @param owner The address of the new owner
    /// @param name Name of the integration
    /// @param attrInfoPairList List of attribute-info pairs to be added
    function mintIntegration(
        address owner,
        string calldata name,
        AttributeInfoPair[] calldata attrInfoPairList
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
        require(!s.controllers[owner].integrationMinted, "Invalid request");
        require(
            s.integrationNameToNodeId[name] == 0,
            "Integration name already registered"
        );

        address idProxyAddress = s.idProxyAddress;

        s.controllers[owner].isController = true;
        s.controllers[owner].integrationMinted = true;

        uint256 newTokenId = INFT(idProxyAddress).safeMint(owner);

        s.integrationNameToNodeId[name] = newTokenId;
        s.nodeIdToIntegrationName[newTokenId] = name;

        _setInfos(newTokenId, attrInfoPairList);

        emit IntegrationNodeMinted(newTokenId, msg.sender);
    }

    /// @notice Add infos to node
    /// @dev attributes must be whitelisted
    /// @param tokenId Node id where the info will be added
    /// @param attrInfoList List of attribute-info pairs to be added
    function setIntegrationInfo(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfoList
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            INFT(IntegrationStorage.getStorage().idProxyAddress).exists(
                tokenId
            ),
            "Invalid integration node"
        );
        _setInfos(tokenId, attrInfoList);
    }

    /// @notice Verify if an address is allowed to own an integration node and set as minted
    /// @dev Can only be called by the NFT Proxy
    /// @dev The address must be a controller and not yet minted a node
    /// @param addr the address to be verified and set
    function setIntegrationMinted(address addr) external onlyNftProxy {
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
        require(
            s.controllers[addr].isController &&
                !s.controllers[addr].integrationMinted,
            "Address is not allowed to own a new token"
        );

        s.controllers[addr].integrationMinted = true;
    }

    /// @notice Verify if an address is a controller
    /// @param addr the address to be verified
    function isIntegrationController(address addr)
        external
        view
        returns (bool _isController)
    {
        _isController = IntegrationStorage
            .getStorage()
            .controllers[addr]
            .isController;
    }

    /// @notice Verify if an address has minted an integration
    /// @param addr the address to be verified
    function isIntegrationMinted(address addr)
        external
        view
        returns (bool _isIntegrationMinted)
    {
        _isIntegrationMinted = IntegrationStorage
            .getStorage()
            .controllers[addr]
            .integrationMinted;
    }

    /// @notice Verify if an address is allowed to own an integration node
    /// @dev The address must be a controller and not yet minted a node
    /// @param addr the address to be verified
    function isAllowedToOwnIntegrationNode(address addr)
        external
        view
        returns (bool _isAllowed)
    {
        IntegrationStorage.Storage storage ms = IntegrationStorage.getStorage();
        _isAllowed =
            ms.controllers[addr].isController &&
            !ms.controllers[addr].integrationMinted;
    }

    /// @notice Gets the Integration Id by name
    /// @dev If the integration is not minted it will return 0
    /// @param name Name associated with the integration
    function getIntegrationIdByName(string calldata name)
        external
        view
        returns (uint256 nodeId)
    {
        nodeId = IntegrationStorage.getStorage().integrationNameToNodeId[name];
    }

    /// @notice Gets the Integration name by id
    /// @dev If the integration is not minted it will return an empty string
    /// @param tokenId Token id to get the associated name
    function getIntegrationNameById(uint256 tokenId)
        external
        view
        returns (string memory name)
    {
        name = IntegrationStorage.getStorage().nodeIdToIntegrationName[tokenId];
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
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
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

            emit IntegrationAttributeSet(
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
        IntegrationStorage.Storage storage m = IntegrationStorage.getStorage();
        require(
            AttributeSet.exists(m.whitelistedAttributes, attribute),
            "Not whitelisted"
        );
        address idProxyAddress = m.idProxyAddress;

        ns.nodes[idProxyAddress][tokenId].info[attribute] = info;
        emit IntegrationAttributeSet(tokenId, attribute, info);
    }
}
