import { ethers } from 'hardhat';

// Node type
export const aftermarketDeviceNodeType =
  ethers.utils.toUtf8Bytes('AftermarketDevice');
export const aftermarketDeviceNodeTypeId = ethers.utils.keccak256(
  aftermarketDeviceNodeType
);

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

// AftermarketDevice Infos associated with attributes
export const mockAftermarketDeviceInfo1 = 'mockAftermarketDeviceInfo1';
export const mockAftermarketDeviceInfo2 = 'mockAftermarketDeviceInfo2';
export const mockAftermarketDeviceInfos = [
  mockAftermarketDeviceInfo1,
  mockAftermarketDeviceInfo2
];
export const mockAftermarketDeviceMultipleInfos = [
  [mockAftermarketDeviceInfo1, mockAftermarketDeviceInfo2],
  [mockAftermarketDeviceInfo1, mockAftermarketDeviceInfo2]
];
export const mockAftermarketDeviceInfosWrongSize = [mockAftermarketDeviceInfo1];
export const mockAftermarketDeviceMultipleInfosWrongSize = [
  mockAftermarketDeviceInfosWrongSize
];
