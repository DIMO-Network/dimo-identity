import { ethers, network } from 'hardhat';

import { streamRegistryABI, streamRegistryBytecode, ensRegistryABI, ensRegistryBytecode, ENSCacheV2ABI, ENSCacheV2Bytecode } from '@streamr/network-contracts'
import type { StreamRegistry, ENSCacheV2 } from '@streamr/network-contracts'

import {
  DIMORegistry,
  Manufacturer,
  Vehicle,
  AftermarketDevice,
  DimoAccessControl,
  Mapper,
  ManufacturerId,
  VehicleId,
  AftermarketDeviceId,
  DimoForwarder,
  StreamrConfigurator,
  VehicleStream,
  DevAdmin
} from '../typechain-types';
import { AddressesByNetwork } from '../utils';
import * as C from './data/deployArgs';
import addressesJSON from './data/addresses.json';

const contractAddresses: AddressesByNetwork = addressesJSON;

async function main() {
  // eslint-disable-next-line prefer-const
  let [deployer, shaolin, user1, user, shared] = await ethers.getSigners();
  let currentNetwork = network.name;

  if (
    network.name === 'hardhat' ||
    network.name === 'localhost' ||
    network.name === 'tenderly' 
  ) {
    currentNetwork = 'amoy';

    // 0xCED3c922200559128930180d3f0bfFd4d9f4F123 gnosis
    // 0x1741eC2915Ab71Fc03492715b5640133dA69420B DIMO deployer
    // 0x07B584f6a7125491C991ca2a45ab9e641B1CeE1b Shared
    // 0xC0F28DA7Ae009711026C648913eB17962fd96dD7 Malte's gnosis
    deployer = await ethers.getImpersonatedSigner(
      '0x07B584f6a7125491C991ca2a45ab9e641B1CeE1b'
    );
    shaolin = await ethers.getImpersonatedSigner(
      '0xa9395ebb1fd55825023934e683cefd6f3f279137'
    );
    user = await ethers.getImpersonatedSigner(
      '0xB8E514da5E7b2918AebC139ae7CbEFc3727f05D3'
    );
    shared = await ethers.getImpersonatedSigner(
      '0x07B584f6a7125491C991ca2a45ab9e641B1CeE1b'
    );

    await user1.sendTransaction({
      to: deployer.address,
      value: ethers.parseEther('10')
    });
    await user1.sendTransaction({
      to: shaolin.address,
      value: ethers.parseEther('10')
    });
    await user1.sendTransaction({
      to: user.address,
      value: ethers.parseEther('10')
    });
    await user1.sendTransaction({
      to: shared.address,
      value: ethers.parseEther('10')
    });
  }

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const dimoAccessControlInstance: DimoAccessControl =
    await ethers.getContractAt(
      'DimoAccessControl',
      contractAddresses[currentNetwork].modules.DIMORegistry.address
    );
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const manufacturerIdInstance: ManufacturerId = await ethers.getContractAt(
    'ManufacturerId',
    contractAddresses[currentNetwork].nfts.ManufacturerId.proxy
  );
  const aftermarketDevice: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const aftermarketDeviceIdInstance: AftermarketDeviceId =
    await ethers.getContractAt(
      'AftermarketDeviceId',
      contractAddresses[currentNetwork].nfts.AftermarketDeviceId.proxy
    );
  const vehicleIdInstance: VehicleId = await ethers.getContractAt(
    'VehicleId',
    contractAddresses[currentNetwork].nfts.VehicleId.proxy
  );
  const dimoForwarder: DimoForwarder = await ethers.getContractAt(
    'DimoForwarder',
    contractAddresses[currentNetwork].misc.DimoForwarder.proxy
  );
  const streamrConfiguratorInstance: StreamrConfigurator = await ethers.getContractAt(
    'StreamrConfigurator',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const devAdminInstance: DevAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const vehicleStreamInstance: VehicleStream = await ethers.getContractAt(
    'VehicleStream',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
})
