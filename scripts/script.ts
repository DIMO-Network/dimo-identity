import { ethers, network } from 'hardhat';

import {
  DIMORegistry,
  Manufacturer,
  Integration,
  AftermarketDevice,
  DimoAccessControl,
  Mapper,
  ManufacturerId,
  IntegrationId,
  VehicleId,
  AftermarketDeviceId,
  SyntheticDeviceId,
  DimoForwarder,
  StreamrConfigurator,
  VehicleStream,
  DevAdmin,
  DeviceDefinitionTable,
  Nodes,
  MockDimoToken
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
    // 0x8E58b98d569B0679713273c5105499C249e9bC84 Shared
    // 0xC0F28DA7Ae009711026C648913eB17962fd96dD7 Malte's gnosis
    deployer = await ethers.getImpersonatedSigner(
      '0x8E58b98d569B0679713273c5105499C249e9bC84'
    );
    shaolin = await ethers.getImpersonatedSigner(
      '0xa9395ebb1fd55825023934e683cefd6f3f279137'
    );
    user = await ethers.getImpersonatedSigner(
      '0x49291691f96c54220bf1de8efbbf00106d64cb8c'
    );
    shared = await ethers.getImpersonatedSigner(
      '0x8E58b98d569B0679713273c5105499C249e9bC84'
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
  const integrationInstance: Integration = await ethers.getContractAt(
    'Integration',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const integrationIdInstance: IntegrationId = await ethers.getContractAt(
    'IntegrationId',
    contractAddresses[currentNetwork].nfts.IntegrationId.proxy
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
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
})
