//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../libraries/MapperStorage.sol";
import "../libraries/nodes/AftermarketDeviceStorage.sol";

/// @title Mapper
/// @notice Contract to map relationships between nodes and other contracts
contract Mapper {
    event BeneficiarySet(
        address indexed idProxyAddress,
        uint256 indexed nodeId,
        address indexed beneficiary
    );

    /// @notice Sets the beneficiary associated with the aftermarket device
    /// @dev Only the nodeId owner can set a beneficiary
    /// @dev To clear the beneficiary, users can pass the zero address
    /// @param nodeId The node Id to be associated with the beneficiary
    /// @param beneficiary The address to be a beneficiary
    function setAftermarketDeviceBeneficiary(
        uint256 nodeId,
        address beneficiary
    ) external {
        address adProxyAddress = AftermarketDeviceStorage
            .getStorage()
            .idProxyAddress;
        address nodeOwner = INFT(adProxyAddress).ownerOf(nodeId);

        require(
            nodeOwner == msg.sender || adProxyAddress == msg.sender,
            "Only owner or proxy"
        );
        require(nodeOwner != beneficiary, "Beneficiary cannot be the owner");

        MapperStorage.getStorage().beneficiaries[adProxyAddress][
            nodeId
        ] = beneficiary;

        emit BeneficiarySet(adProxyAddress, nodeId, beneficiary);
    }

    /// @notice Gets the link between vehicle and aftermarket device nodes
    /// @param idProxyAddress The address of the NFT proxy
    /// @param sourceNode The source node id to be queried
    function getLink(address idProxyAddress, uint256 sourceNode)
        external
        view
        returns (uint256 targetNode)
    {
        targetNode = MapperStorage.getStorage().links[idProxyAddress][
            sourceNode
        ];
    }

    /// @notice Gets the link between two nodes (source -> target)
    /// @param idProxyAddressSource The address of the NFT proxy source
    /// @param idProxyAddressTarget The address of the NFT proxy target
    /// @param sourceNode The source node id to be queried
    function getNodeLink(
        address idProxyAddressSource,
        address idProxyAddressTarget,
        uint256 sourceNode
    ) external view returns (uint256 targetNode) {
        targetNode = MapperStorage.getStorage().nodeLinks[idProxyAddressSource][
            idProxyAddressTarget
        ][sourceNode];
    }

    /// @notice Gets the beneficiary associated with the pair idProxy/nodeId.
    /// @notice If the beneficiary is not explicitly set, it defaults to the owner
    /// @param idProxyAddress The address of the NFT proxy
    /// @param nodeId The node Id to be queried
    function getBeneficiary(address idProxyAddress, uint256 nodeId)
        external
        view
        returns (address beneficiary)
    {
        beneficiary = MapperStorage.getStorage().beneficiaries[idProxyAddress][
            nodeId
        ];

        if (beneficiary == address(0)) {
            beneficiary = INFT(idProxyAddress).ownerOf(nodeId);
        }
    }
}
