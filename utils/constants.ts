import { ethers } from 'hardhat';

// Roles
export const DEFAULT_ADMIN_ROLE =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
export const MOCK_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('MOCK')
);
export const MINTER_ROLE = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('Minter')
);

// Metadata
export const name = 'DIMO web3 identity';
export const symbol = 'DIMO';
export const baseURI = 'https://dimo.zone/';
export const mockTokenURI = 'mockTokenURI';

// Node types
export const manufacturerNodeType = ethers.utils.toUtf8Bytes('Manufacturer');
export const vehicleNodeType = ethers.utils.toUtf8Bytes('Vehicle');
export const aftermarketDeviceNodeType =
  ethers.utils.toUtf8Bytes('AftermarketDevice');
export const manufacturerNodeTypeId =
  ethers.utils.keccak256(manufacturerNodeType);
export const vehicleNodeTypeId = ethers.utils.keccak256(vehicleNodeType);
export const aftermarketDeviceNodeTypeId = ethers.utils.keccak256(
  aftermarketDeviceNodeType
);

// Mock Manufacturer attributes
export const mockManufacturerAttributeName = 'Name';
export const mockManufacturerAttribute1 = 'mockManufacturerAttribute1';
export const mockManufacturerAttribute2 = 'mockManufacturerAttribute2';
export const mockManufacturerAttribute3 = 'mockManufacturerAttribute3';
export const mockManufacturerAttributes = [
  mockManufacturerAttribute1,
  mockManufacturerAttribute2
];
export const manufacturerAttributesNotWhitelisted = [
  mockManufacturerAttribute1,
  mockManufacturerAttribute3
];

// Mock Vehicle attributes
export const mockVehicleAttribute1 = 'mockVehicleAttribute1';
export const mockVehicleAttribute2 = 'mockVehicleAttribute2';
export const mockVehicleAttribute3 = 'mockVehicleAttribute3';
export const mockVehicleAttributes = [
  mockVehicleAttribute1,
  mockVehicleAttribute2
];
export const vehicleAttributesNotWhitelisted = [
  mockVehicleAttribute1,
  mockVehicleAttribute3
];

// Mock AftermarketDevice attributes
export const mockAftermarketDeviceAttribute1 =
  'mockAftermarketDeviceAttribute1';
export const mockAftermarketDeviceAttribute2 =
  'mockAftermarketDeviceAttribute2';
export const mockAftermarketDeviceAttribute3 =
  'mockAftermarketDeviceAttribute3';
export const mockAftermarketDeviceAttributes = [
  mockAftermarketDeviceAttribute1,
  mockAftermarketDeviceAttribute2
];
export const aftermarketDeviceAttributesNotWhitelisted = [
  mockAftermarketDeviceAttribute1,
  mockAftermarketDeviceAttribute3
];

// Manufacturer Infos associated with attributes
export const mockManufacturerNames = [
  'Manufacturer1',
  'Manufacturer2',
  'Manufacturer3'
];
export const mockManufacturerInfo1 = 'mockManufacturerInfo1';
export const mockManufacturerInfo2 = 'mockManufacturerInfo2';
export const mockManufacturerInfos = [
  mockManufacturerInfo1,
  mockManufacturerInfo2
];
export const mockManufacturerInfosWrongSize = [mockManufacturerInfo1];

// Vehicle Infos associated with attributes
export const mockVehicleInfo1 = 'mockVehicleInfo1';
export const mockVehicleInfo2 = 'mockVehicleInfo2';
export const mockVehicleInfos = [mockVehicleInfo1, mockVehicleInfo2];
export const mockVehicleInfosWrongSize = [mockVehicleInfo1];

// AftermarketDevice Infos associated with attributes
export const mockAftermarketDeviceInfo1 = 'mockAftermarketDeviceInfo1';
export const mockAftermarketDeviceInfo2 = 'mockAftermarketDeviceInfo2';
export const mockAftermarketDeviceInfos = [
  mockAftermarketDeviceInfo1,
  mockAftermarketDeviceInfo2
];
export const mockAftermarketDeviceMultipleInfos = [
  mockAftermarketDeviceInfos,
  mockAftermarketDeviceInfos
];
export const mockAftermarketDeviceInfosWrongSize = [mockAftermarketDeviceInfo1];
export const mockAftermarketDeviceMultipleInfosWrongSize = [
  mockAftermarketDeviceInfosWrongSize
];
