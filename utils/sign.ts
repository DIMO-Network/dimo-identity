import { network } from 'hardhat';
import { Wallet } from 'ethers';

import { C } from './';

export async function signMessage({
  _signer,
  _domainName = C.defaultDomainName,
  _domainVersion = C.defaultDomainVersion,
  _chainId = network.config.chainId || 31337,
  _primaryType,
  _verifyingContract,
  message
}: {
  _signer: Wallet,
  _domainName?: string,
  _domainVersion?: string,
  _chainId?: number,
  _primaryType: string,
  _verifyingContract: string,
  message: Record<string, unknown>
}) {
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
