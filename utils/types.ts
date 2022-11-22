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

export interface ContractAddressesByNetwork {
  [index: string]: {
    modules: {
      [index: string]: {
        address: string,
        selectors: string[]
      }
    },
    nfts: {
      [index: string]: string
    }
  };
}

export interface NetworkValue {
  [index: string]: string;
}
