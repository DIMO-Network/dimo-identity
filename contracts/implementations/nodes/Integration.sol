//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/IntegrationStorage.sol";

import "../../shared/Roles.sol" as Roles;
import "../../shared/Types.sol" as Types;
import "../../shared/Errors.sol" as Errors;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

error OnlyNftProxy();
error MustBeAdmin(address addr);
error IntegrationNameRegisterd(string name);
error NotAllowed(address addr);

/**
 * @title Integration
 * @notice Contract that represents the Integration node
 */
contract Integration is AccessControlInternal {
    event IntegrationIdProxySet(address proxy);
    event IntegrationAttributeAdded(string attribute);
    event IntegrationAttributeSet(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event ControllerSet(address indexed controller);
    event IntegrationNodeMinted(uint256 indexed tokenId, address indexed owner);

    modifier onlyNftProxy() {
        if (msg.sender != IntegrationStorage.getStorage().idProxyAddress)
            revert OnlyNftProxy();
        _;
    }

    // ***** Admin management ***** //

    /**
     * @notice Sets the NFT proxy associated with the Integration node
     * @dev Only an admin can set the address
     * @param addr The address of the proxy
     */
    function setIntegrationIdProxyAddress(address addr)
        external
        onlyRole(Roles.ADMIN_ROLE)
    {
        if (addr == address(0)) revert Errors.ZeroAddress();
        IntegrationStorage.getStorage().idProxyAddress = addr;

        emit IntegrationIdProxySet(addr);
    }

    /**
     * @notice Adds an attribute to the whitelist
     * @dev Only an admin can add a new attribute
     * @param attribute The attribute to be added
     */
    function addIntegrationAttribute(string calldata attribute)
        external
        onlyRole(Roles.ADMIN_ROLE)
    {
        if (
            !AttributeSet.add(
                IntegrationStorage.getStorage().whitelistedAttributes,
                attribute
            )
        ) revert Errors.AttributeExists(attribute);

        emit IntegrationAttributeAdded(attribute);
    }

    /**
     * @notice Sets an address controller
     * @dev Only an admin can set new controllers
     * @param _controller The address of the controller
     */
    function setIntegrationController(address _controller)
        external
        onlyRole(Roles.ADMIN_ROLE)
    {
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
        if (_controller == address(0)) revert Errors.ZeroAddress();
        if (s.controllers[_controller].isController)
            revert Errors.AlreadyController(_controller);

        s.controllers[_controller].isController = true;

        emit ControllerSet(_controller);
    }

    // ***** Interaction with nodes ***** //

    /**
     * @notice Mints integrations in batch
     * @dev Caller must be an admin
     * @dev It is assumed the 'Name' attribute is whitelisted in advance
     * @param owner The address of the new owner
     * @param names List of integration names
     */
    function mintIntegrationBatch(address owner, string[] calldata names)
        external
        onlyRole(Roles.MINT_INTEGRATION_ROLE)
    {
        if (!_hasRole(Roles.ADMIN_ROLE, owner)) revert MustBeAdmin(owner);

        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();

        uint256 newTokenId;
        string memory name;
        for (uint256 i = 0; i < names.length; i++) {
            name = names[i];

            if (s.integrationNameToNodeId[name] != 0)
                revert IntegrationNameRegisterd(name);

            newTokenId = INFT(s.idProxyAddress).safeMint(owner);

            s.integrationNameToNodeId[name] = newTokenId;
            s.nodeIdToIntegrationName[newTokenId] = name;

            emit IntegrationNodeMinted(newTokenId, owner);
        }
    }

    /**
     * @notice Mints an integration
     * @dev Caller must be an admin
     * @param owner The address of the new owner
     * @param name Name of the integration
     * @param attrInfoPairList List of attribute-info pairs to be added
     */
    function mintIntegration(
        address owner,
        string calldata name,
        Types.AttributeInfoPair[] calldata attrInfoPairList
    ) external onlyRole(Roles.MINT_INTEGRATION_ROLE) {
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
        if (s.controllers[owner].integrationMinted)
            revert Errors.Unauthorized(owner);
        if (s.integrationNameToNodeId[name] != 0)
            revert IntegrationNameRegisterd(name);

        address idProxyAddress = s.idProxyAddress;

        s.controllers[owner].isController = true;
        s.controllers[owner].integrationMinted = true;

        uint256 newTokenId = INFT(idProxyAddress).safeMint(owner);

        s.integrationNameToNodeId[name] = newTokenId;
        s.nodeIdToIntegrationName[newTokenId] = name;

        emit IntegrationNodeMinted(newTokenId, msg.sender);

        if (attrInfoPairList.length > 0)
            _setInfos(newTokenId, attrInfoPairList);
    }

    /**
     * @notice Add infos to node
     * @dev attributes must be whitelisted
     * @param tokenId Node id where the info will be added
     * @param attrInfoList List of attribute-info pairs to be added
     */
    function setIntegrationInfo(
        uint256 tokenId,
        Types.AttributeInfoPair[] calldata attrInfoList
    ) external onlyRole(Roles.SET_INTEGRATION_INFO_ROLE) {
        address integrationIdProxy = IntegrationStorage
            .getStorage()
            .idProxyAddress;
        if (!INFT(integrationIdProxy).exists(tokenId))
            revert Errors.InvalidNode(integrationIdProxy, tokenId);
        _setInfos(tokenId, attrInfoList);
    }

    /**
     * @notice Verify if an address is allowed to own an integration node and set as minted
     * The former owner of the node is set as not minted, as it will not be the owner of a node after the transfer
     * @dev Can only be called by the IntegrationId Proxy
     * @dev The address must be a controller and not yet minted a node
     * @param from the address to be verified and set
     * @param to the address to be verified
     */
    function updateIntegrationMinted(address from, address to)
        external
        onlyNftProxy
    {
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
        if (
            !s.controllers[to].isController ||
            s.controllers[to].integrationMinted
        ) revert NotAllowed(to);

        s.controllers[from].integrationMinted = false;
        s.controllers[to].integrationMinted = true;
    }

    /**
     * @notice Verify if an address is a controller
     * @param addr the address to be verified
     */
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

    /**
     * @notice Verify if an address has minted an integration
     * @param addr the address to be verified
     */
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

    /**
     * @notice Verify if an address is allowed to own an integration node
     * @dev The address must be a controller and not yet minted a node
     * @param addr the address to be verified
     */
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

    /**
     * @notice Gets the Integration Id by name
     * @dev If the integration is not minted it will return 0
     * @param name Name associated with the integration
     */
    function getIntegrationIdByName(string calldata name)
        external
        view
        returns (uint256 nodeId)
    {
        nodeId = IntegrationStorage.getStorage().integrationNameToNodeId[name];
    }

    /**
     * @notice Gets the Integration name by id
     * @dev If the integration is not minted it will return an empty string
     * @param tokenId Token id to get the associated name
     */
    function getIntegrationNameById(uint256 tokenId)
        external
        view
        returns (string memory name)
    {
        name = IntegrationStorage.getStorage().nodeIdToIntegrationName[tokenId];
    }

    // ***** PRIVATE FUNCTIONS ***** //

    /**
     * @dev Internal function to add infos to node
     * @dev attributes must be whitelisted
     * @param tokenId Node id where the info will be added
     * @param attrInfoPairList List of attribute-info pairs to be added
     */
    function _setInfos(
        uint256 tokenId,
        Types.AttributeInfoPair[] calldata attrInfoPairList
    ) private {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        IntegrationStorage.Storage storage s = IntegrationStorage.getStorage();
        address idProxyAddress = s.idProxyAddress;

        for (uint256 i = 0; i < attrInfoPairList.length; i++) {
            if (
                !AttributeSet.exists(
                    s.whitelistedAttributes,
                    attrInfoPairList[i].attribute
                )
            )
                revert Errors.AttributeNotWhitelisted(
                    attrInfoPairList[i].attribute
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
}
