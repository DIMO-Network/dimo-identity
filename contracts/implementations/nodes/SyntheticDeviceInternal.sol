//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../libraries/NodesStorage.sol";
import "../../libraries/nodes/SyntheticDeviceStorage.sol";

import "../../shared/Types.sol";
import "../../shared/Errors.sol";

/**
 * @title SyntheticDeviceInternal
 * @notice Contract with internal Synthetic Device related functions used in multiple contracts
 */
contract SyntheticDeviceInternal {
    event SyntheticDeviceAttributeSet(
        uint256 indexed tokenId,
        string attribute,
        string info
    );
    event SyntheticDeviceNodeMinted(
        uint256 integrationNode,
        uint256 syntheticDeviceNode,
        uint256 indexed vehicleNode,
        address indexed syntheticDeviceAddress,
        address indexed owner
    );

    /**
     * @dev Internal function to add infos to node
     * @dev attributes must be whitelisted
     * @param tokenId Node where the info will be added
     * @param attrInfoPairList List of attribute-info pairs to be added
     */
    function _setInfos(
        uint256 tokenId,
        AttributeInfoPair[] calldata attrInfoPairList
    ) internal {
        NodesStorage.Storage storage ns = NodesStorage.getStorage();
        SyntheticDeviceStorage.Storage storage sds = SyntheticDeviceStorage
            .getStorage();
        address idProxyAddress = sds.idProxyAddress;

        for (uint256 i = 0; i < attrInfoPairList.length; i++) {
            if (
                !AttributeSet.exists(
                    sds.whitelistedAttributes,
                    attrInfoPairList[i].attribute
                )
            ) revert AttributeNotWhitelisted(attrInfoPairList[i].attribute);

            ns.nodes[idProxyAddress][tokenId].info[
                attrInfoPairList[i].attribute
            ] = attrInfoPairList[i].info;

            emit SyntheticDeviceAttributeSet(
                tokenId,
                attrInfoPairList[i].attribute,
                attrInfoPairList[i].info
            );
        }
    }
}
