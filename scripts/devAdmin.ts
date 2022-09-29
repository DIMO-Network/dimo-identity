import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DevAdmin } from '../typechain';
import { ContractAddressesByNetwork } from '../utils';
import * as C from './data/deployConstants';
import addressesJSON from './data/addresses.json';

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

async function unpair(deployer: SignerWithAddress, device: string) {
  const devAdminInstance: DevAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[C.networkName].DIMORegistry
  );

  console.log(`\n----- Unpairing ${device} device -----\n`);
  await (
    await devAdminInstance
      .connect(deployer)
      .unpairAftermarketDeviceByDeviceNode(device)
  ).wait();
  console.log(`----- Device ${device} unpaired -----`);
}

async function main() {
  const [deployer] = await ethers.getSigners();

  await unpair(deployer, '197');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
