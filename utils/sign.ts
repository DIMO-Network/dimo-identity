import { Wallet } from 'ethers';

import { C } from './';

export async function signMessage(
  _signer: Wallet,
  _domainName: string,
  _domainVersion: string,
  _chainId: number,
  _primaryType: string,
  _verifyingContract: string,
  message: Record<string, unknown>
) {
  const domain = {
    name: _domainName,
    version: _domainVersion,
    chainId: _chainId,
    verifyingContract: _verifyingContract
  };

  const types = {
    [_primaryType]: C.schemaBase.types[_primaryType]
  };

  return await _signer._signTypedData(domain, types, message);
}
