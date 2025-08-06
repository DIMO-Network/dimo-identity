import * as fs from 'fs';
import * as path from 'path';
import { ethers, network } from 'hardhat';

import {
  DIMORegistry,
  Manufacturer,
  AftermarketDevice,
  DimoAccessControl,
  Mapper,
  StorageNodeRegistry,
  ManufacturerId,
  VehicleId,
  AftermarketDeviceId,
  SyntheticDeviceId,
  DimoForwarder,
  StreamrConfigurator,
  VehicleStream,
  DevAdmin,
  DeviceDefinitionTable,
  Nodes,
  MockDimoToken,
  MockSacd
} from '../typechain-types';
import { AddressesByNetwork } from '../utils';
import * as C from './data/deployArgs';
import addressesJSON from './data/addresses.json';
import { getAccounts } from './helpers'

const contractAddresses: AddressesByNetwork = addressesJSON;

async function main() {
  const forkNetworkName = 'amoy'
  const currentNetwork = forkNetworkName || network.name
  const [signer] = await getAccounts(network.name, forkNetworkName)

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const mapperInstance: Mapper = await ethers.getContractAt(
    'Mapper',
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
  const sdIdInstance: SyntheticDeviceId = await ethers.getContractAt(
    'SyntheticDeviceId',
    contractAddresses[currentNetwork].nfts.SyntheticDeviceId.proxy
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
  const ddInstance: DeviceDefinitionTable = await ethers.getContractAt(
    'DeviceDefinitionTable',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const nodesInstance: Nodes = await ethers.getContractAt(
    'Nodes',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const mockDimoToken: MockDimoToken = await ethers.getContractAt(
    'MockDimoToken',
    contractAddresses[currentNetwork].misc.DimoToken.proxy
  );
  const mockSacdInstance: MockSacd = await ethers.getContractAt(
    'MockSacd',
    contractAddresses[currentNetwork].misc.Sacd
  );
  const storageNodeRegistry: StorageNodeRegistry = await ethers.getContractAt(
    'StorageNodeRegistry',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
})
