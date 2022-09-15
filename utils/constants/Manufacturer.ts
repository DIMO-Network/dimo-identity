import { ethers } from 'hardhat';

// Node type
export const manufacturerNodeType = ethers.utils.toUtf8Bytes('Manufacturer');
export const manufacturerNodeTypeId =
  ethers.utils.keccak256(manufacturerNodeType);

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
