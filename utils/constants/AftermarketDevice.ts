import { ethers } from 'hardhat';
import { AttributeInfoPair, AftermarketDeviceInfos } from '../types';

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

// AftermarketDevice Infos associated with attributes
export const mockAftermarketDeviceInfo1 = 'mockAftermarketDeviceInfo1';
export const mockAftermarketDeviceInfo2 = 'mockAftermarketDeviceInfo2';
export const mockAftermarketDeviceInfo3 = 'mockAftermarketDeviceInfo3';

export const mockAdAttributeInfoPairs: AttributeInfoPair[] = [
  {
    attribute: mockAftermarketDeviceAttribute1,
    info: mockAftermarketDeviceInfo1
  },
  {
    attribute: mockAftermarketDeviceAttribute2,
    info: mockAftermarketDeviceInfo2
  }
];
export const mockAdAttributeInfoPairsNotWhitelisted: AttributeInfoPair[] = [
  {
    attribute: mockAftermarketDeviceAttribute1,
    info: mockAftermarketDeviceInfo1
  },
  {
    attribute: mockAftermarketDeviceAttribute3,
    info: mockAftermarketDeviceInfo3
  }
];

export const mockAftermarketDeviceInfosList: AftermarketDeviceInfos[] = [
  {
    addr: '',
    attrInfoPairs: mockAdAttributeInfoPairs
  },
  {
    addr: '',
    attrInfoPairs: mockAdAttributeInfoPairs
  }
];
export const mockAftermarketDeviceInfosListNotWhitelisted: AftermarketDeviceInfos[] =
  [
    {
      addr: '',
      attrInfoPairs: mockAdAttributeInfoPairs
    },
    {
      addr: '',
      attrInfoPairs: mockAdAttributeInfoPairsNotWhitelisted
    }
  ];
