import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DevAdmin, AftermarketDevice, DimoAccessControl } from '../typechain';
import {
  AddressesByNetwork,
  AttributeInfoPair,
  AftermarketDeviceOwnerPair
} from '../utils';
import addressesJSON from './data/addresses.json';

const contractAddresses: AddressesByNetwork = addressesJSON;

// eslint-disable-next-line no-unused-vars
async function unpair(
  deployer: SignerWithAddress,
  devices: string[],
  networkName: string
) {
  const devAdminInstance: DevAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[networkName].modules.DIMORegistry.address
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
  aftermarketDeviceOwnerPairs: AftermarketDeviceOwnerPair[],
  networkName: string
) {
  const batchSize = 50;
  const adInstance: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Claiming devices -----\n`);

  for (let i = 0; i < aftermarketDeviceOwnerPairs.length; i += batchSize) {
    const batch = aftermarketDeviceOwnerPairs.slice(i, i + batchSize);

    const receipt = await (
      await adInstance.connect(deployer).claimAftermarketDeviceBatch(1, batch, {
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
  attributeInfoPairs: AttributeInfoPair[],
  networkName: string
) {
  const adInstance: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[networkName].modules.DIMORegistry.address
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

// eslint-disable-next-line no-unused-vars
async function revokeRole(
  deployer: SignerWithAddress,
  role: string,
  address: string,
  networkName: string
) {
  const accessControlInstance: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    contractAddresses[networkName].modules.DIMORegistry.address
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
