//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @notice File to store shared structs

struct AttributeInfoPair {
    string attribute;
    string info;
}

struct AftermarketDeviceInfos {
    address addr;
    AttributeInfoPair[] attrInfoPairs;
}

struct AftermarketDeviceOwnerPair {
    uint256 aftermarketDeviceNodeId;
    address owner;
}

struct MintSyntheticDeviceBatchInput {
    uint256 vehicleNode;
    address syntheticDeviceAddr;
    AttributeInfoPair[] attrInfoPairs;
}

struct MintSyntheticDeviceInput {
    uint256 integrationNode;
    uint256 vehicleNode;
    bytes syntheticDeviceSig;
    bytes vehicleOwnerSig;
    address syntheticDeviceAddr;
    AttributeInfoPair[] attrInfoPairs;
}

struct MintVehicleAndSdInput {
    uint256 manufacturerNode;
    address owner;
    AttributeInfoPair[] attrInfoPairsVehicle;
    uint256 integrationNode;
    bytes vehicleOwnerSig;
    bytes syntheticDeviceSig;
    address syntheticDeviceAddr;
    AttributeInfoPair[] attrInfoPairsDevice;
}

struct DeviceDefinitionInput {
    string id;
    string model;
    uint256 year;
    string metadata;
}

struct ManufacturerInput {
    string id;
    string name;
    string slug;
}
