import { Wallet } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import * as C from './constants';
import { GenericKeyAny, ContractsSetup } from './types';
import { initialize, deployUpgradeableContracts } from './deploys';

export async function setup(
  deployer: Wallet | SignerWithAddress,
  contracts: ContractsSetup
): Promise<GenericKeyAny> {
  const deployedRegistryContracts = await initialize(
    deployer,
    ...contracts.modules
  );

  const deployedNfts = await deployUpgradeableContracts(
    deployer,
    contracts.nfts.map((nftName) => C.nftArgs[nftName])
  );

  const deployedUpradeableContracts = await deployUpgradeableContracts(
    deployer,
    contracts.upgradeableContracts.map(
      (contractName) => C.upgradeableContractArgs[contractName]
    )
  );

  return {
    ...deployedRegistryContracts,
    ...deployedNfts,
    ...deployedUpradeableContracts
  };
}
