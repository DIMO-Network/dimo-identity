import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DevAdmin, AftermarketDevice } from '../typechain';
import {
  ContractAddressesByNetwork,
  AttributeInfoPair,
  AftermarketDeviceOwnerPair
} from '../utils';
import * as C from './data/deployConstants';
import addressesJSON from './data/addresses.json';

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

// eslint-disable-next-line no-unused-vars
async function unpair(deployer: SignerWithAddress, devices: string[]) {
  const devAdminInstance: DevAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[C.networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Unpairing ${devices} device -----\n`);
  await (
    await devAdminInstance
      .connect(deployer)
      .unpairAftermarketDeviceByDeviceNode(devices)
  ).wait();
  console.log(`----- Device ${devices} unpaired -----`);
}

// eslint-disable-next-line no-unused-vars
async function claimByAdmin(
  deployer: SignerWithAddress,
  aftermarketDeviceOwnerPairs: AftermarketDeviceOwnerPair[]
) {
  const batchSize = 50;
  const adInstance: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[C.networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Claiming devices -----\n`);

  for (let i = 0; i < aftermarketDeviceOwnerPairs.length; i += batchSize) {
    const batch = aftermarketDeviceOwnerPairs.slice(i, i + batchSize);

    const receipt = await (
      await adInstance.connect(deployer).claimAftermarketDeviceBatch(batch, {
        gasPrice: process.env.GAS_PRICE
      })
    ).wait();

    const ids = receipt.events
      ?.filter((e: any) => e.event === 'AftermarketDeviceClaimed')
      .map((e: any) => e.args.aftermarketDeviceNode);

    console.log(`Claimed ids: ${ids?.join(',')}`);
  }

  console.log(`\n----- Devices claimed -----\n`);
}

// eslint-disable-next-line no-unused-vars
async function setInfos(
  deployer: SignerWithAddress,
  tokenId: string,
  attributeInfoPairs: AttributeInfoPair[]
) {
  const adInstance: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[C.networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Setting infos to device ${tokenId} -----\n`);

  await (
    await adInstance
      .connect(deployer)
      .setAftermarketDeviceInfo(tokenId, attributeInfoPairs, {
        gasPrice: process.env.GAS_PRICE
      })
  ).wait();

  console.log(`\n----- Infos set -----\n`);
}
async function main() {
  const [deployer] = await ethers.getSigners();
  await unpair(deployer, []);
  await claimByAdmin(deployer, []);
  await setInfos(deployer, '', []);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
