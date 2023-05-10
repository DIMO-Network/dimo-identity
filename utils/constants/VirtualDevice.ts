import { AttributeInfoPair, VirtualDeviceInfos } from '../types';

// Mock VirtualDevice attributes
export const mockVirtualDeviceAttribute1 = 'mockVirtualDeviceAttribute1';
export const mockVirtualDeviceAttribute2 = 'mockVirtualDeviceAttribute2';
export const mockVirtualDeviceAttribute3 = 'mockVirtualDeviceAttribute3';

// VirtualDevice Infos associated with attributes
export const mockVirtualDeviceInfo1 = 'mockVirtualDeviceInfo1';
export const mockVirtualDeviceInfo2 = 'mockVirtualDeviceInfo2';
export const mockVirtualDeviceInfo3 = 'mockVirtualDeviceInfo3';

export const mockVirtualDeviceAttributeInfoPairs: AttributeInfoPair[] = [
  {
    attribute: mockVirtualDeviceAttribute1,
    info: mockVirtualDeviceInfo1
  },
  {
    attribute: mockVirtualDeviceAttribute2,
    info: mockVirtualDeviceInfo2
  }
];
export const mockVirtualDeviceAttributeInfoPairsNotWhitelisted: AttributeInfoPair[] =
  [
    {
      attribute: mockVirtualDeviceAttribute1,
      info: mockVirtualDeviceInfo1
    },
    {
      attribute: mockVirtualDeviceAttribute3,
      info: mockVirtualDeviceInfo3
    }
  ];

export const mockVirtualDeviceInfosList: VirtualDeviceInfos[] = [
  {
    addr: '',
    attrInfoPairs: mockVirtualDeviceAttributeInfoPairs
  },
  {
    addr: '',
    attrInfoPairs: mockVirtualDeviceAttributeInfoPairs
  }
];
export const mockVirtualDeviceInfosListNotWhitelisted: VirtualDeviceInfos[] = [
  {
    addr: '',
    attrInfoPairs: mockVirtualDeviceAttributeInfoPairs
  },
  {
    addr: '',
    attrInfoPairs: mockVirtualDeviceAttributeInfoPairsNotWhitelisted
  }
];
