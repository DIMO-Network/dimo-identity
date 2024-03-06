//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/VehicleStorage.sol";

import "../../shared/Types.sol";
import "../../shared/Errors.sol";

/**
 * @title VehicleInternal
 * @notice Contract with internal Vehicle related functions used in multiple contracts
 */
contract VehicleInternal {
    bytes32 internal constant MINT_VEHICLE_TYPEHASH =
        keccak256(
            "MintVehicleSign(uint256 manufacturerNode,address owner,string[] attributes,string[] infos)"
        );

    event VehicleAttributeSet(uint256 tokenId, string attribute, string info);
    event VehicleNodeMinted(
        uint256 manufacturerNode,
        uint256 tokenId,
        address owner
    );
    event VehicleNodeMintedWithDeviceDefinition(
        uint256 indexed manufacturerId,
        uint256 indexed vehicleId,
        address indexed owner,
        string deviceDefinitionId
    );

    /**
     * @dev Internal function to add infos to node and calculate attribute and info hashes
     * @dev attributes must be whitelisted
     * @param tokenId Node where the info will be added
     * @param attrInfo List of attribute-info pairs to be added
     * @return keccak256 of the list of attributes and infos
     */
    function _setInfosHash(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfo
    ) internal returns (bytes32, bytes32) {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        VehicleStorage.Storage storage s = VehicleStorage.getStorage();
        address idProxyAddress = s.idProxyAddress;

        bytes32[] memory attributeHashes = new bytes32[](attrInfo.length);
        bytes32[] memory infoHashes = new bytes32[](attrInfo.length);

        for (uint256 i = 0; i < attrInfo.length; i++) {
            if (
                !AttributeSet.exists(
                    s.whitelistedAttributes,
                    attrInfo[i].attribute
                )
            ) revert AttributeNotWhitelisted(attrInfo[i].attribute);

            attributeHashes[i] = keccak256(bytes(attrInfo[i].attribute));
            infoHashes[i] = keccak256(bytes(attrInfo[i].info));

            ns.nodes[idProxyAddress][tokenId].info[
                attrInfo[i].attribute
            ] = attrInfo[i].info;

            emit VehicleAttributeSet(
                tokenId,
                attrInfo[i].attribute,
                attrInfo[i].info
            );
        }

        return (
            keccak256(abi.encodePacked(attributeHashes)),
            keccak256(abi.encodePacked(infoHashes))
        );
    }
}
