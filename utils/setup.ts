import { Wallet } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import * as C from './constants';
import { initialize, deployUpgradeableContracts } from './deploys';

type ContractsSetup = {
  modules: string[],
  nfts: string[]
};

export async function setup(
  deployer: Wallet | SignerWithAddress,
  contracts: ContractsSetup
): Promise<any[]> {
  const deployedRegistryContracts = await initialize(
    deployer,
    ...contracts.modules
  );

  const deployedNfts = await deployUpgradeableContracts(
    deployer,
    contracts.nfts.map((nftName) => C.nftArgs[nftName])
  );

  return [...deployedRegistryContracts, ...deployedNfts];
}
