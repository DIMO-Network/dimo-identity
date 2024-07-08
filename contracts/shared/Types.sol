//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

/// @notice File to store shared structs

struct AttributeInfoPair {
    string attribute;
    string info;
}

struct AftermarketDeviceInfos {
    address addr; // AD address
    AttributeInfoPair[] attrInfoPairs; // pair { attribute: info }
}

struct AftermarketDeviceOwnerPair {
    uint256 aftermarketDeviceNodeId; // Token ID of the AD
    address owner; // Address to be the new AD owner
}

struct AftermarketDeviceIdAddressPair {
    uint256 aftermarketDeviceNodeId; // Aftermarket Device node Id
    address deviceAddress; // Aftermarket Device 0x address
}

struct MintSyntheticDeviceBatchInput {
    uint256 vehicleNode; // Vehicle node id
    address syntheticDeviceAddr; // Address associated with the synthetic device
    AttributeInfoPair[] attrInfoPairs; // List of attribute-info pairs to be added
}

struct MintSyntheticDeviceInput {
    uint256 integrationNode; // Parent integration node id
    uint256 vehicleNode; // Vehicle node id
    bytes syntheticDeviceSig; // Synthetic Device's signature hash
    bytes vehicleOwnerSig; // Vehicle owner signature hash
    address syntheticDeviceAddr; // Address associated with the synthetic device
    AttributeInfoPair[] attrInfoPairs; // List of attribute-info pairs to be added
}

struct MintVehicleInput {
    uint256 manufacturerNode; // Parent manufacturer node id of the vehicle
    address owner; // The new nodes owner
    AttributeInfoPair[] attrInfo; // List of attribute-info pairs to be added
    bytes signature; // User's signature hash
}

struct MintVehicleWithDdInput {
    uint256 manufacturerNode; // Parent manufacturer node id of the vehicle
    address owner; // The new nodes owner
    string deviceDefinitionId; // The Device Definition Id
    AttributeInfoPair[] attrInfo; // List of attribute-info pairs to be added
    bytes signature; // User's signature hash
}

struct MintVehicleAndSdInput {
    uint256 manufacturerNode; // Parent manufacturer node id of the vehicle
    address owner; // The new nodes owner
    AttributeInfoPair[] attrInfoPairsVehicle; // List of attribute-info pairs to be added of the vehicle
    uint256 integrationNode; // Parent integration node id of the synthetic device
    bytes vehicleOwnerSig; // Vehicle owner signature hash
    bytes syntheticDeviceSig; // Synthetic Device's signature hash
    address syntheticDeviceAddr; // Address associated with the synthetic device
    AttributeInfoPair[] attrInfoPairsDevice; // List of attribute-info pairs to be added of the synthetic device
}

struct MintVehicleAndSdWithDdInput {
    uint256 manufacturerNode; // Parent manufacturer node id of the vehicle
    address owner; // The new nodes owner
    string deviceDefinitionId; // The Device Definition Id
    AttributeInfoPair[] attrInfoPairsVehicle; // List of attribute-info pairs to be added of the vehicle
    uint256 integrationNode; // Parent integration node id of the synthetic device
    bytes vehicleOwnerSig; // Vehicle owner signature hash
    bytes syntheticDeviceSig; // Synthetic Device's signature hash
    address syntheticDeviceAddr; // Address associated with the synthetic device
    AttributeInfoPair[] attrInfoPairsDevice; // List of attribute-info pairs to be added of the synthetic device
}

struct DeviceDefinitionInput {
    string id; // The alphanumeric ID of the Device Definition
    string model; // The model of the Device Definition
    uint256 year; // The year of the Device Definition
    string metadata; // The metadata stringfied object of the Device Definition
    string ksuid; // K-Sortable Unique IDentifier
    string deviceType; // The deviceType of the Device Definition
    string imageURI; // The image uri of the Device Definition
}
