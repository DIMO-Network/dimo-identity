//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../interfaces/INFT.sol";
import "../libraries/MapperStorage.sol";

/// @title Mapper
/// @notice Contract to map relationships between nodes
contract Mapper {
    event BeneficiarySet(
        address indexed idProxyAddress,
        uint256 nodeId,
        address indexed beneficiary
    );

    /// TODO Documentation
    function setBeneficiary(
        address idProxyAddress,
        uint256 nodeId,
        address beneficiary
    ) external {
        require(
            INFT(idProxyAddress).ownerOf(nodeId) == msg.sender,
            "Only owner"
        );

        MapperStorage.getStorage().beneficiaries[idProxyAddress][
            nodeId
        ] = beneficiary;
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

    /// TODO Documentation
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
