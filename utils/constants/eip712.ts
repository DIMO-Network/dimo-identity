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
      { name: 'vehicleNode', type: 'uint256' }
    ],
    UnPairAftermarketDeviceSign: [
      { name: 'aftermarketDeviceNode', type: 'uint256' },
      { name: 'vehicleNode', type: 'uint256' }
    ],
    MintSyntheticDeviceSign: [
      { name: 'integrationNode', type: 'uint256' },
      { name: 'vehicleNode', type: 'uint256' }
    ],
    MintVehicleAndSdSign: [{ name: 'integrationNode', type: 'uint256' }],
    BurnSyntheticDeviceSign: [
      { name: 'vehicleNode', type: 'uint256' },
      { name: 'syntheticDeviceNode', type: 'uint256' }
    ],
    BurnVehicleSign: [{ name: 'vehicleNode', type: 'uint256' }]
  },
  primaryType: '',
  domain: {},
  message: {}
};
