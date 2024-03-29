import { AttributeInfoPair } from '../types';

// Mock Manufacturer attributes
export const mockManufacturerAttribute1 = 'mockManufacturerAttribute1';
export const mockManufacturerAttribute2 = 'mockManufacturerAttribute2';
export const mockManufacturerAttribute3 = 'mockManufacturerAttribute3';

// Manufacturer Infos associated with attributes
export const mockManufacturerNames = [
  'Manufacturer1',
  'Manufacturer2',
  'Manufacturer3'
];
export const mockManufacturerInfo1 = 'mockManufacturerInfo1';
export const mockManufacturerInfo2 = 'mockManufacturerInfo2';
export const mockManufacturerInfo3 = 'mockManufacturerInfo3';

export const mockManufacturerAttributeInfoPairs: AttributeInfoPair[] = [
  { attribute: mockManufacturerAttribute1, info: mockManufacturerInfo1 },
  { attribute: mockManufacturerAttribute2, info: mockManufacturerInfo2 }
];
export const mockManufacturerAttributeInfoPairsNotWhitelisted: AttributeInfoPair[] =
  [
    { attribute: mockManufacturerAttribute1, info: mockManufacturerInfo1 },
    { attribute: mockManufacturerAttribute3, info: mockManufacturerInfo3 }
  ];
