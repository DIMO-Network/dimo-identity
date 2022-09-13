import { TypedData } from '../types';

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
    MintVehicleSign: [
      { name: 'manufacturerNode', type: 'uint256' },
      { name: 'owner', type: 'address' },
      { name: 'attributes', type: 'string[]' },
      { name: 'infos', type: 'string[]' }
    ],
    ClaimAftermarketDeviceSign: [
      { name: 'aftermarketDeviceNode', type: 'uint256' },
      { name: 'owner', type: 'address' }
    ],
    PairAftermarketDeviceSign: [
      { name: 'aftermarketDeviceNode', type: 'uint256' },
      { name: 'vehicleNode', type: 'uint256' },
      { name: 'owner', type: 'address' }
    ]
  },
  primaryType: '',
  domain: {},
  message: {}
};
