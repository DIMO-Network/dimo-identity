import { EventLog, Log } from 'ethers';
import { ethers, network } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
  DevAdmin,
  AftermarketDevice,
  DimoAccessControl,
} from '../typechain-types';
import {
  AddressesByNetwork,
  AttributeInfoPair,
  AftermarketDeviceOwnerPair,
} from '../utils';
import addressesJSON from './data/addresses.json';

const contractAddresses: AddressesByNetwork = addressesJSON;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function unpair(
  deployer: HardhatEthersSigner,
  devices: string[],
  networkName: string,
) {
  const devAdminInstance: DevAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[networkName].modules.DIMORegistry.address,
  );

  console.log(`\n----- Unpairing ${devices} device -----\n`);
  await (
    await devAdminInstance
      .connect(deployer)
      .unpairAftermarketDeviceByDeviceNode(devices)
  ).wait();
  console.log(`----- Device ${devices} unpaired -----`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function claimByAdmin(
  deployer: HardhatEthersSigner,
  aftermarketDeviceOwnerPairs: AftermarketDeviceOwnerPair[],
  networkName: string,
) {
  const batchSize = 50;
  const adInstance: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[networkName].modules.DIMORegistry.address,
  );

  console.log('\n----- Claiming devices -----\n');

  for (let i = 0; i < aftermarketDeviceOwnerPairs.length; i += batchSize) {
    const batch = aftermarketDeviceOwnerPairs.slice(i, i + batchSize);

    const receipt = await (
      await adInstance.connect(deployer).claimAftermarketDeviceBatch(1, batch)
    ).wait();

    const ids = receipt?.logs
      ?.filter((log: EventLog | Log) => log instanceof EventLog)
      .map((eventLog: EventLog | Log) =>
        (eventLog as EventLog).args[0].toString(),
      );

    console.log(`Claimed ids: ${ids?.join(',')}`);
  }

  console.log('\n----- Devices claimed -----\n');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function setInfos(
  deployer: HardhatEthersSigner,
  tokenId: string,
  attributeInfoPairs: AttributeInfoPair[],
  networkName: string,
) {
  const adInstance: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[networkName].modules.DIMORegistry.address,
  );

  console.log(`\n----- Setting infos to device ${tokenId} -----\n`);

  await (
    await adInstance
      .connect(deployer)
      .setAftermarketDeviceInfo(tokenId, attributeInfoPairs, {
        gasPrice: process.env.GAS_PRICE,
      })
  ).wait();

  console.log('\n----- Infos set -----\n');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function revokeRole(
  deployer: HardhatEthersSigner,
  role: string,
  address: string,
  networkName: string,
) {
  const accessControlInstance: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    contractAddresses[networkName].modules.DIMORegistry.address,
  );

  console.log(`\n----- Revoking ${role} role to ${address} -----`);

  await (
    await accessControlInstance.connect(deployer).revokeRole(role, address)
  ).wait();

  console.log(`----- ${role} role revoked from ${address} -----\n`);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = network.name;

  await unpair(deployer, [], networkName);
  await claimByAdmin(deployer, [], networkName);
  await setInfos(deployer, '', [], networkName);

  process.exit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
