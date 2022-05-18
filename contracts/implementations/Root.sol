//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import {DIMOStorage} from "../libraries/DIMOStorage.sol";
import {RootStorage} from "../libraries/RootStorage.sol";
import {ERC721BaseInternal} from "@solidstate/contracts/token/ERC721/base/ERC721BaseInternal.sol";

contract Root is ERC721BaseInternal {
    // using EnumerableSet for EnumerableSet.Bytes32Set;

    // EnumerableSet.Bytes32Set private _whitelistedAttributes; // Allowed node attributes

    modifier onlyOwner() {
        require(
            DIMOStorage.getStorage().admin == msg.sender,
            "Caller is not the owner"
        );
        _;
    }

    // //***** Owner management *****//

    // /// @notice Adds an attribute to the whielist
    // /// @dev Only the owner can set new controllers
    // /// @param attribute The attribute to be added
    // function addAttribute(bytes32 attribute) external onlyOwner {
    //     _whitelistedAttributes.add(attribute);
    // }

    // /// @notice Sets a address controller
    // /// @dev Only the owner can set new controllers
    // /// @param _controller The address of the controller
    // function setController(address _controller) external onlyOwner {
    //     controllers[_controller].isController = true;
    // }

    // //***** Interaction with nodes *****//

    /// @notice Mints a root
    /// @dev Caller must be the owner
    /// @dev Owner cannot mint more than one root
    /// @param label The label specifying the root
    /// @param _owner The address of the new owner
    function mintRootByOwner(string calldata label, address _owner)
        external
        onlyOwner
    {
        RootStorage.Storage storage s = RootStorage.getStorage();
        require(!s.controllers[_owner].rootMinted, "Invalid request");
        s.controllers[_owner].isController = true;

        _mintRoot(label, _owner);
    }

    // /// @notice Mints a root
    // /// @dev Caller must be a controller
    // /// @dev Owner cannot mint more than one root
    // /// @param label The label specifying the root
    // function mintRoot(string calldata label) external {
    //     require(
    //         controllers[msg.sender].isController &&
    //             !controllers[msg.sender].rootMinted,
    //         "Invalid request"
    //     );

    //     _mintRoot(label, msg.sender);
    // }

    // /// @notice Add infos to node
    // /// @dev Only node owner can call this function
    // /// @dev attributes and infos arrays length must match
    // /// @dev attributes must be whitelisted
    // /// @param node Node where the info will be added
    // /// @param attributes List of attributes to be added
    // /// @param infos List of infos matching the attributes param
    // function setInfo(
    //     uint256 node,
    //     bytes32[] calldata attributes,
    //     string[] calldata infos
    // ) external {
    //     _setInfo(node, attributes, infos);
    // }

    // /// @notice Gets information stored in an attribute of a given node
    // /// @dev Returns empty string if does or attribute does not exists
    // /// @param node Node from which info will be obtained
    // /// @param attribute Key attribute
    // /// @return info Info obtained
    // function getInfo(uint256 node, bytes32 attribute)
    //     external
    //     view
    //     returns (string memory info)
    // {
    //     info = records[node].info[attribute];
    // }

    // //***** INTERNAL FUNCTIONS *****//

    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId
    // ) internal override {
    //     if (records[tokenId].root) {
    //         require(
    //             controllers[to].isController && !controllers[to].rootMinted,
    //             "Invalid transfer"
    //         );
    //         controllers[from].rootMinted = false;
    //         controllers[to].rootMinted = true;
    //     }
    // }

    // //***** PRIVATE FUNCTIONS *****//

    /// @dev Internal function to mint a root
    /// @param label The label specifying the root
    /// @param _owner The address of the new owner
    function _mintRoot(string memory label, address _owner) private {
        uint256 root = _verifyNewNode(0, label);

        _safeMint(_owner, root);

        DIMOStorage.Storage storage s = DIMOStorage.getStorage();

        s.records[root].originNode = root;
        RootStorage.getStorage().controllers[_owner].rootMinted = true;
    }

    /// @dev Calculates and verifies if the new node already exists
    /// @param parentNode The corresponding parent node
    /// @param label The label specifying the node
    /// @return The new hashed node
    function _verifyNewNode(uint256 parentNode, string memory label)
        private
        view
        returns (uint256)
    {
        uint256 newNode = uint256(
            keccak256(
                abi.encodePacked(parentNode, keccak256(abi.encodePacked(label)))
            )
        );

        require(
            DIMOStorage.getStorage().records[newNode].originNode == 0,
            "Node already exists"
        );

        return newNode;
    }

    // /// @dev Internal function to add infos to node
    // /// @dev Only node owner can call this function
    // /// @dev attributes and infos arrays length must match
    // /// @dev attributes must be whitelisted
    // /// @param node Node where the info will be added
    // /// @param attributes List of attributes to be added
    // /// @param infos List of infos matching the attributes param
    // function _setInfo(
    //     uint256 node,
    //     bytes32[] calldata attributes,
    //     string[] calldata infos
    // ) private {
    //     require(
    //         ownerOf(records[node].originNode) == msg.sender,
    //         "Only node owner"
    //     );
    //     require(attributes.length == infos.length, "Same length");

    //     for (uint256 i = 0; i < attributes.length; i++) {
    //         require(
    //             _whitelistedAttributes.contains(attributes[i]),
    //             "Not whitelisted"
    //         );
    //         records[node].info[attributes[i]] = infos[i];
    //     }
    // }
}
