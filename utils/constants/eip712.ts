import { ethers } from 'hardhat';

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
      { name: 'infos', type: 'string[]' },
      { name: 'nonce', type: 'uint256' }
    ],
    OpenMintVehicleSign: [
      { name: 'manufacturerNode', type: 'uint256' },
      { name: 'attributes', type: 'string[]' },
      { name: 'infos', type: 'string[]' },
      { name: 'nonce', type: 'uint256' }
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
    MintVehicleWithDeviceDefinitionSign: [
      { name: 'manufacturerNode', type: 'uint256' },
      { name: 'owner', type: 'address' },
      { name: 'deviceDefinitionId', type: 'string' }
    ],
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

// ----- Vehicle -----
export const BURN_VEHICLE_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('BurnVehicleSign(uint256 vehicleNode)')
);
export const MINT_VEHICLE_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('MintVehicleSign(uint256 manufacturerNode,address owner,string[] attributes,string[] infos)')
);
export const OPEN_MINT_VEHICLE_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('OpenMintVehicleSign(uint256 manufacturerNode,string[] attributes,string[] infos,uint256 nonce)')
);
export const MINT_VEHICLE_WITH_DD_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('MintVehicleWithDeviceDefinitionSign(uint256 manufacturerNode,address owner,string deviceDefinitionId)')
);

// ----- Aftermarket Device -----
export const CLAIM_AD_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('ClaimAftermarketDeviceSign(uint256 aftermarketDeviceNode,address owner)')
);
export const PAIR_AD_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('PairAftermarketDeviceSign(uint256 aftermarketDeviceNode,uint256 vehicleNode)')
);
export const UNPAI_AD_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('UnPairAftermarketDeviceSign(uint256 aftermarketDeviceNode,uint256 vehicleNode)')
);

// ----- Synthetic Device -----
export const MINT_SD_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('MintSyntheticDeviceSign(uint256 integrationNode,uint256 vehicleNode)')
);
export const BURN_SD_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('BurnSyntheticDeviceSign(uint256 vehicleNode,uint256 syntheticDeviceNode)')
);

// ----- Multiple Minter -----
export const MINT_VEHICLE_SD_TYPEHASH = ethers.keccak256(
  ethers.toUtf8Bytes('MintVehicleAndSdSign(uint256 integrationNode)')
);