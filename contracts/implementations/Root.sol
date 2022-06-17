//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "../libraries/DIMOStorage.sol";
import "../libraries/RootStorage.sol";
import "@solidstate/contracts/token/ERC721/base/ERC721BaseInternal.sol";

contract Root is ERC721BaseInternal {
    modifier onlyAdmin() {
        require(
            DIMOStorage.getStorage().admin == msg.sender,
            "Caller is not an admin"
        );
        _;
    }

    // ***** Owner management *****//

    /// @notice Adds an attribute to the whitelist
    /// @dev Only the owner can set new controllers
    /// @param attribute The attribute to be added
    function addAttribute(string calldata attribute) external onlyAdmin {
        RootStorage.Storage storage s = RootStorage.getStorage();
        AttributeSet.add(s.whitelistedAttributes, attribute);
    }

    /// @notice Sets a address controller
    /// @dev Only the owner can set new controllers
    /// @param _controller The address of the controller
    function setController(address _controller) external onlyAdmin {
        RootStorage.getStorage().controllers[_controller].isController = true;
    }

    // ***** Interaction with nodes *****//

    /// @notice Mints a root
    /// @dev Caller must be an admin
    /// @dev Owner cannot mint more than one root
    /// @param _owner The address of the new owner
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function mintRoot(
        address _owner,
        string[] calldata attributes,
        string[] calldata infos
    ) external onlyAdmin {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(!s.controllers[_owner].rootMinted, "Invalid request");
        s.controllers[_owner].isController = true;

        uint256 newNodeId = _mintRoot(_owner);
        _setInfo(newNodeId, attributes, infos);
    }

    /// @notice Add infos to node
    /// @dev Only node owner can call this function
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node id where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function setInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) external {
        _setInfo(nodeId, attributes, infos);
    }

    /// @notice Gets information stored in an attribute of a given node
    /// @dev Returns empty string if does or attribute does not exists
    /// @param nodeId Node id from which info will be obtained
    /// @param attribute Key attribute
    /// @return info Info obtained
    function getInfo(uint256 nodeId, string calldata attribute)
        external
        view
        returns (string memory info)
    {
        info = DIMOStorage.getStorage().records[nodeId].info[attribute];
    }

    /// @notice Gets the owner of a root node
    /// @param tokenId the id associated to the root node
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _ownerOf(tokenId);
    }

    /// @notice Verify if an address is a controller
    /// @param addr the address to be verified
    function isController(address addr)
        external
        view
        returns (bool _isController)
    {
        _isController = RootStorage.getStorage().controllers[addr].isController;
    }

    /// @notice Verify if an address has minted a root
    /// @param addr the address to be verified
    function isRootMinted(address addr)
        external
        view
        returns (bool _isRootMinted)
    {
        _isRootMinted = RootStorage.getStorage().controllers[addr].rootMinted;
    }

    // ***** PRIVATE FUNCTIONS *****//

    /// @dev Internal function to mint a root
    /// @param _owner The address of the new owner
    /// @return newNodeId The new node id generated
    function _mintRoot(address _owner) private returns (uint256 newNodeId) {
        DIMOStorage.Storage storage s = DIMOStorage.getStorage();
        s.currentIndex++;
        newNodeId = s.currentIndex;

        _safeMint(_owner, newNodeId);

        RootStorage.getStorage().controllers[_owner].rootMinted = true;
    }

    // /// @dev Calculates and verifies if the new node already exists
    // /// @param parentNode The corresponding parent node
    // /// @param label The label specifying the node
    // /// @return The new hashed node
    // function _verifyNewNode(uint256 parentNode, string memory label)
    //     private
    //     view
    //     returns (uint256)
    // {
    //     uint256 newNode = uint256(
    //         keccak256(
    //             abi.encodePacked(parentNode, keccak256(abi.encodePacked(label)))
    //         )
    //     );

    //     require(
    //         DIMOStorage.getStorage().records[newNode].originNode == 0,
    //         "Node already exists"
    //     );

    //     return newNode;
    // }

    /// @dev Internal function to add infos to node
    /// @dev Only node owner can call this function
    /// @dev attributes and infos arrays length must match
    /// @dev attributes must be whitelisted
    /// @param nodeId Node id where the info will be added
    /// @param attributes List of attributes to be added
    /// @param infos List of infos matching the attributes param
    function _setInfo(
        uint256 nodeId,
        string[] calldata attributes,
        string[] calldata infos
    ) private {
        // TODO Needed?
        // require(
        //     ownerOf(node) == msg.sender,
        //     "Only node owner"
        // );
        require(attributes.length == infos.length, "Same length");

        DIMOStorage.Storage storage ds = DIMOStorage.getStorage();
        RootStorage.Storage storage s = RootStorage.getStorage();

        for (uint256 i = 0; i < attributes.length; i++) {
            require(
                AttributeSet.exists(s.whitelistedAttributes, attributes[i]),
                "Not whitelisted"
            );
            ds.records[nodeId].info[attributes[i]] = infos[i];
        }
    }
}
