import { ethers } from 'hardhat';
import { AttributeInfoPair } from '../types';

// Node type
export const vehicleNodeType = ethers.utils.toUtf8Bytes('Vehicle');
export const vehicleNodeTypeId = ethers.utils.keccak256(vehicleNodeType);

// Mock Vehicle attributes
export const mockVehicleAttribute1 = 'mockVehicleAttribute1';
export const mockVehicleAttribute2 = 'mockVehicleAttribute2';
export const mockVehicleAttribute3 = 'mockVehicleAttribute3';
export const mockVehicleAttributes = [
  mockVehicleAttribute1,
  mockVehicleAttribute2
];

// Vehicle Infos associated with attributes
export const mockVehicleInfo1 = 'mockVehicleInfo1';
export const mockVehicleInfo2 = 'mockVehicleInfo2';
export const mockVehicleInfo3 = 'mockVehicleInfo3';
export const mockVehicleInfos = [mockVehicleInfo1, mockVehicleInfo2];
export const mockVehicleInfosWrongSize = [mockVehicleInfo1];

// TODO New stuff here. Remove unecessary constants above
export const mockVehicleAttributeInfoPairs: AttributeInfoPair[] = [
  { attribute: mockVehicleAttribute1, info: mockVehicleInfo1 },
  { attribute: mockVehicleAttribute2, info: mockVehicleInfo2 }
];
export const mockVehicleAttributeInfoPairsNotWhitelisted: AttributeInfoPair[] =
  [
    { attribute: mockVehicleAttribute1, info: mockVehicleInfo1 },
    { attribute: mockVehicleAttribute3, info: mockVehicleInfo3 }
  ];
