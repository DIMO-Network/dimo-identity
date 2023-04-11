//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../libraries/MapperStorage.sol";

/// @title Mapper
/// @notice Contract to map relationships between nodes and other contracts
contract Mapper {
    event BeneficiarySet(
        address indexed idProxyAddress,
        uint256 nodeId,
        address indexed beneficiary
    );

    /// @notice Sets the beneficiary associated with the pair idProxy/nodeId
    /// @dev Only the nodeId owner can set a beneficiary
    /// @param idProxyAddress The address of the NFT proxy
    /// @param nodeId The node Id to be associated with the beneficiary
    /// @param beneficiary The address to be a beneficiary
    function setBeneficiary(
        address idProxyAddress,
        uint256 nodeId,
        address beneficiary
    ) external {
        address nodeOwner = INFT(idProxyAddress).ownerOf(nodeId);

        require(nodeOwner == msg.sender, "Only owner");
        require(nodeOwner != beneficiary, "Beneficiary cannot be the owner");

        MapperStorage.getStorage().beneficiaries[idProxyAddress][
            nodeId
        ] = beneficiary;

        emit BeneficiarySet(idProxyAddress, nodeId, beneficiary);
    }

    /// @notice Gets the link between two nodes
    /// @param idProxyAddress The address of the NFT proxy
    /// @param sourceNode The node Id to be queried
    function getLink(address idProxyAddress, uint256 sourceNode)
        external
        view
        returns (uint256 targetNode)
    {
        targetNode = MapperStorage.getStorage().links[idProxyAddress][
            sourceNode
        ];
    }

    /// @notice Gets the beneficiary associated with the pair idProxy/nodeId
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
