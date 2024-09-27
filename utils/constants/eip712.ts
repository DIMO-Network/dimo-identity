import { TypedData } from '../types';
import * as Types from './Eip712Types.json';

export const defaultDomainName = 'DIMO';
export const defaultDomainVersion = '1';

export const schemaBase: TypedData = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    ...Types,
  },
  primaryType: '',
  domain: {},
  message: {}
};
