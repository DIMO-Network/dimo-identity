import { Wallet } from 'ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import * as C from './constants';
import { GenericKeyAny, ContractsSetup } from './types';
import { DimoAccessControl } from '../typechain-types';
import { initialize, deployUpgradeableContracts } from './deploys';

export async function setup(
  deployer: Wallet | HardhatEthersSigner,
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

export async function grantAdminRoles(
  admin: Wallet | HardhatEthersSigner,
  accessControlContract: DimoAccessControl
) {
  const roles = [
    C.ADMIN_ROLE,
    C.CLAIM_AD_ROLE,
    C.PAIR_AD_ROLE,
    C.UNPAIR_AD_ROLE,
    C.SET_AD_INFO_ROLE,
    C.MINT_INTEGRATION_ROLE,
    C.SET_INTEGRATION_INFO_ROLE,
    C.MINT_MANUFACTURER_ROLE,
    C.SET_MANUFACTURER_INFO_ROLE,
    C.MINT_SD_ROLE,
    C.BURN_SD_ROLE,
    C.SET_SD_INFO_ROLE,
    C.MINT_VEHICLE_ROLE,
    C.BURN_VEHICLE_ROLE,
    C.SET_VEHICLE_INFO_ROLE,
    C.MINT_VEHICLE_SD_ROLE,
    C.DEV_AD_TRANSFER_ROLE,
    C.DEV_AD_UNCLAIM_ROLE,
    C.DEV_AD_UNPAIR_ROLE,
    C.DEV_RENAME_MANUFACTURERS_ROLE,
    C.DEV_AD_PAIR_ROLE,
    C.DEV_VEHICLE_BURN_ROLE,
    C.DEV_AD_BURN_ROLE,
    C.DEV_SD_BURN_ROLE,
    C.DEV_CHANGE_PARENT_NODE,
    C.DEV_CACHE_ENS,
    C.DEV_REMOVE_ATTR,
    C.DEV_SET_DD
  ];

  for (const role of roles) {
    await accessControlContract.connect(admin).grantRole(role, admin.address);
  }
}
