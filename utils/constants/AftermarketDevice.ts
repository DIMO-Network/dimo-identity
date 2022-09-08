import { ethers } from 'hardhat';

// Node type
export const aftermarketDeviceNodeType =
  ethers.utils.toUtf8Bytes('AftermarketDevice');
export const aftermarketDeviceNodeTypeId = ethers.utils.keccak256(
  aftermarketDeviceNodeType
);

// Device wallets
export const adAddress1 = new ethers.Wallet(ethers.utils.hexZeroPad('0x01', 32))
  .address;
export const adAddress2 = new ethers.Wallet(ethers.utils.hexZeroPad('0x02', 32))
  .address;

// Mock AftermarketDevice attributes
export const mockAftermarketDeviceAttributeAddress = 'Address';
export const mockAftermarketDeviceAttribute1 =
  'mockAftermarketDeviceAttribute1';
export const mockAftermarketDeviceAttribute2 =
  'mockAftermarketDeviceAttribute2';
export const mockAftermarketDeviceAttribute3 =
  'mockAftermarketDeviceAttribute3';
export const mockAftermarketDeviceAttributes = [
  mockAftermarketDeviceAttributeAddress,
  mockAftermarketDeviceAttribute1,
  mockAftermarketDeviceAttribute2
];
export const aftermarketDeviceAttributesNotWhitelisted = [
  mockAftermarketDeviceAttributeAddress,
  mockAftermarketDeviceAttribute1,
  mockAftermarketDeviceAttribute3
];

// AftermarketDevice Infos associated with attributes
export const mockAftermarketDeviceInfo1 = 'mockAftermarketDeviceInfo1';
export const mockAftermarketDeviceInfo2 = 'mockAftermarketDeviceInfo2';
export const mockAftermarketDeviceInfos = [
  adAddress1,
  mockAftermarketDeviceInfo1,
  mockAftermarketDeviceInfo2
];
export const mockAftermarketDeviceMultipleInfos = [
  [adAddress1, mockAftermarketDeviceInfo1, mockAftermarketDeviceInfo2],
  [adAddress2, mockAftermarketDeviceInfo1, mockAftermarketDeviceInfo2]
];
export const mockAftermarketDeviceInfosWrongSize = [
  adAddress1,
  mockAftermarketDeviceInfo1
];
export const mockAftermarketDeviceMultipleInfosWrongSize = [
  mockAftermarketDeviceInfosWrongSize
];
