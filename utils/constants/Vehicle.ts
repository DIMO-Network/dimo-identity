import { ethers } from 'hardhat';

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
export const mockVehicleAttributesWrongSize = [mockVehicleAttribute1];
export const vehicleAttributesNotWhitelisted = [
  mockVehicleAttribute1,
  mockVehicleAttribute3
];

// Vehicle Infos associated with attributes
export const mockVehicleInfo1 = 'mockVehicleInfo1';
export const mockVehicleInfo2 = 'mockVehicleInfo2';
export const mockVehicleInfos = [mockVehicleInfo1, mockVehicleInfo2];
export const mockVehicleInfosWrongSize = [mockVehicleInfo1];
