export type TypedData = {
  domain: Record<string, unknown>,
  types: Record<
    string,
    {
      name: string,
      type: string
    }[]
  >,
  primaryType: string,
  message: Record<string, unknown>
};

export type AttributeInfoPair = {
  attribute: string,
  info: string
};

export type AftermarketDeviceInfos = {
  addr: string,
  attrInfoPairs: AttributeInfoPair[]
};

export type AftermarketDeviceOwnerPair = {
  aftermarketDeviceNodeId: string,
  owner: string
};

export type AftermarketDeviceIdAddressPair = {
  aftermarketDeviceNodeId: string,
  deviceAddress: string
};

export type MintSyntheticDeviceBatchInput = {
  vehicleNode: string,
  syntheticDeviceAddr: string,
  attrInfoPairs: AttributeInfoPair[]
};

export type MintSyntheticDeviceInput = {
  integrationNode: string,
  vehicleNode: string,
  vehicleOwnerSig: string,
  syntheticDeviceAddr: string,
  syntheticDeviceSig: string,
  attrInfoPairs: AttributeInfoPair[]
};

export type MintVehicleAndSdInput = {
  manufacturerNode: string,
  owner: string,
  attrInfoPairsVehicle: AttributeInfoPair[],
  integrationNode: string,
  vehicleOwnerSig: string,
  syntheticDeviceSig: string,
  syntheticDeviceAddr: string,
  attrInfoPairsDevice: AttributeInfoPair[]
};

export type DeviceDefinitionInput = {
  id: string,
  model: string,
  year: number,
  metadata: string,
  ksuid: string,
  deviceType: string;
  imageURI: string;
};

export type DeviceDefinitionUpdateInput = {
  id: string,
  metadata: string,
  ksuid: string,
  deviceType: string;
  imageURI: string;
};

export type MintVehicleAndSdWithDdInput = {
  manufacturerNode: string,
  owner: string,
  deviceDefinitionId: string,
  attrInfoPairsVehicle: AttributeInfoPair[],
  integrationNode: string,
  vehicleOwnerSig: string,
  syntheticDeviceSig: string,
  syntheticDeviceAddr: string,
  attrInfoPairsDevice: AttributeInfoPair[]
};

export type IdManufacturerName = {
  tokenId: string,
  name: string
};

export type VehicleIdDeviceDefinitionId = {
  vehicleId: string,
  deviceDefinitionId: string
}

export type SetPrivilegeData = {
  tokenId: string,
  privId: string,
  user: string,
  expires: string
};

export type ContractNameArgs = {
  name: string,
  args: (string | [])[],
  opts: {
    initializer: string | false,
    kind: 'uups' | 'transparent' | 'beacon'
  }
};

export type ContractNameArgsByNetwork = {
  [index: string]: ContractNameArgs
};

export type AddressesByNetwork = {
  [index: string]: {
    modules: {
      [index: string]: {
        address: string,
        selectors: string[]
      }
    },
    nfts: {
      [index: string]: {
        proxy: string,
        implementation: string
      }
    },
    misc: {
      [index: string]: any
    }
  }
};

export type NetworkValue = {
  [index: string]: string
};

export type GenericKeyAny = {
  [index: string]: any
};

export type StringNumber = {
  [index: string]: number
};

export type ContractsSetup = {
  modules: string[],
  nfts: string[],
  upgradeableContracts: string[]
};

export type NftArgs = {
  name: string,
  args: (string | string[])[]
};
