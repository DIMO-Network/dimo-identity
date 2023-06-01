import { AttributeInfoPair } from '../types';

// Mock SyntheticDevice attributes
export const mockSyntheticDeviceAttribute1 = 'mockSyntheticDeviceAttribute1';
export const mockSyntheticDeviceAttribute2 = 'mockSyntheticDeviceAttribute2';
export const mockSyntheticDeviceAttribute3 = 'mockSyntheticDeviceAttribute3';

// SyntheticDevice Infos associated with attributes
export const mockSyntheticDeviceInfo1 = 'mockSyntheticDeviceInfo1';
export const mockSyntheticDeviceInfo2 = 'mockSyntheticDeviceInfo2';
export const mockSyntheticDeviceInfo3 = 'mockSyntheticDeviceInfo3';

export const mockSyntheticDeviceAttributeInfoPairs: AttributeInfoPair[] = [
  {
    attribute: mockSyntheticDeviceAttribute1,
    info: mockSyntheticDeviceInfo1
  },
  {
    attribute: mockSyntheticDeviceAttribute2,
    info: mockSyntheticDeviceInfo2
  }
];
export const mockSyntheticDeviceAttributeInfoPairsNotWhitelisted: AttributeInfoPair[] =
  [
    {
      attribute: mockSyntheticDeviceAttribute1,
      info: mockSyntheticDeviceInfo1
    },
    {
      attribute: mockSyntheticDeviceAttribute3,
      info: mockSyntheticDeviceInfo3
    }
  ];
