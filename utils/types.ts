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

export interface ContractAddressesByNetwork {
  [index: string]: {
    [index: string]: string
  };
}

export interface NetworkValue {
  [index: string]: string;
}
