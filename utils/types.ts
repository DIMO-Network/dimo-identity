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
