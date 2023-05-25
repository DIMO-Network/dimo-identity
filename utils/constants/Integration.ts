import { AttributeInfoPair } from '../types';

// Mock Integration attributes
export const mockIntegrationAttribute1 = 'mockIntegrationAttribute1';
export const mockIntegrationAttribute2 = 'mockIntegrationAttribute2';
export const mockIntegrationAttribute3 = 'mockIntegrationAttribute3';

// Integration Infos associated with attributes
export const mockIntegrationNames = [
  'Integration1',
  'Integration2',
  'Integration3'
];
export const mockIntegrationInfo1 = 'mockIntegrationInfo1';
export const mockIntegrationInfo2 = 'mockIntegrationInfo2';
export const mockIntegrationInfo3 = 'mockIntegrationInfo3';

export const mockIntegrationAttributeInfoPairs: AttributeInfoPair[] = [
  { attribute: mockIntegrationAttribute1, info: mockIntegrationInfo1 },
  { attribute: mockIntegrationAttribute2, info: mockIntegrationInfo2 }
];
export const mockIntegrationAttributeInfoPairsNotWhitelisted: AttributeInfoPair[] =
  [
    { attribute: mockIntegrationAttribute1, info: mockIntegrationInfo1 },
    { attribute: mockIntegrationAttribute3, info: mockIntegrationInfo3 }
  ];
