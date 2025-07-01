// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title MockStorageNode
 * @dev Mocks the StorageNode contract to be used in tests
 * Refers to https://github.com/DIMO-Network/storage-node
 */
contract MockStorageNode is ERC721 {
    error LabelInvalidLength(string label);

    address dimoRegistry;
    mapping(uint256 => uint256) public vehicleIdToNodeId;

    constructor(address _dimoRegistry) ERC721("DIMO Storage Node", "DSN") {
        dimoRegistry = _dimoRegistry;
    }

    function mint(address to, string calldata label) external {
        bytes memory labelBytes = bytes(label);
        if (labelBytes.length == 0) {
            revert LabelInvalidLength(label);
        }

        uint256 newNodeId = uint256(keccak256(labelBytes));

        _safeMint(to, newNodeId);
    }

    function setNodeForVehicle(uint256 vehicleId, uint256 nodeId) external {
        vehicleIdToNodeId[vehicleId] = nodeId;
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
}
