import { ethers } from 'hardhat';
import { AttributeInfoPair } from '../types';

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
export const mockManufacturerInfo3 = 'mockManufacturerInfo3';
export const mockManufacturerInfos = [
  mockManufacturerInfo1,
  mockManufacturerInfo2
];
export const mockManufacturerInfosWrongSize = [mockManufacturerInfo1];

// TODO New stuff here. Remove unecessary constants above
export const mockManufacturerAttributeInfoPairs: AttributeInfoPair[] = [
  { attribute: mockManufacturerAttribute1, info: mockManufacturerInfo1 },
  { attribute: mockManufacturerAttribute2, info: mockManufacturerInfo2 }
];
export const mockManufacturerAttributeInfoPairsNotWhitelisted: AttributeInfoPair[] =
  [
    { attribute: mockManufacturerAttribute1, info: mockManufacturerInfo1 },
    { attribute: mockManufacturerAttribute3, info: mockManufacturerInfo3 }
  ];
