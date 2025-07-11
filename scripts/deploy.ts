import * as fs from 'fs';
import * as path from 'path';
import { Log, EventLog, ContractTransactionReceipt } from 'ethers';
import { ethers, network, upgrades } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
  DIMORegistry,
  DimoAccessControl,
  Eip712Checker,
  Charging,
  Shared,
  BaseDataURI,
  Manufacturer,
  Integration,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  SyntheticDevice,
  SyntheticDeviceId,
  StreamrConfigurator,
  DimoForwarder,
  NftBaseUpgradeable,
} from '../typechain-types';
import { getSelectors, AddressesByNetwork, NftArgs } from '../utils';
import * as C from './data/deployArgs';
import { makes } from './data/Makes';
import { integrations } from './data/Integrations';

function getAddresses(): AddressesByNetwork {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'data', 'addresses.json'), 'utf8'),
  );
}

function writeAddresses(addresses: AddressesByNetwork, networkName: string) {
  console.log('\n----- Writing addresses to file -----');

  const currentAddresses: AddressesByNetwork = addresses;
  currentAddresses[networkName] = addresses[networkName];

  fs.writeFileSync(
    path.resolve(__dirname, 'data', 'addresses.json'),
    JSON.stringify(currentAddresses, null, 4),
  );

  console.log('----- Addresses written to file -----\n');
}

function buildNftArgs(
  instances: AddressesByNetwork,
  networkName: string,
): NftArgs[] {
  const currentManufacturerIdArgs: NftArgs = C.manufacturerIdArgs;
  const currentIntegrationIdArgs: NftArgs = C.integrationIdArgs;
  const currentVehicleIdArgs: NftArgs = C.vehicleIdArgs;
  const currentAdIdArgs: NftArgs = C.adIdArgs;
  const currentSdIdArgs: NftArgs = C.sdIdArgs;

  currentManufacturerIdArgs.args = [
    ...C.manufacturerIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
  ];
  currentIntegrationIdArgs.args = [
    ...C.integrationIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy],
  ];
  currentVehicleIdArgs.args = [
    ...C.vehicleIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    ethers.ZeroAddress,
    ethers.ZeroAddress,
    [instances[networkName].misc.DimoForwarder.proxy],
  ];
  currentAdIdArgs.args = [
    ...C.adIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy],
  ];
  currentSdIdArgs.args = [
    ...C.sdIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy],
  ];

  return [
    currentManufacturerIdArgs,
    currentIntegrationIdArgs,
    currentVehicleIdArgs,
    currentAdIdArgs,
    currentSdIdArgs,
  ];
}

async function deployModules(
  deployer: HardhatEthersSigner,
  networkName: string,
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const contractNameArgs = [
    { name: 'Eip712Checker', args: [] },
    { name: 'DimoAccessControl', args: [] },
    { name: 'Nodes', args: [] },
    { name: 'BaseDataURI', args: [] },
    { name: 'Manufacturer', args: [] },
    { name: 'Integration', args: [] },
    { name: 'Vehicle', args: [] },
    { name: 'AftermarketDevice', args: [] },
    { name: 'SyntheticDevice', args: [] },
    { name: 'Mapper', args: [] },
    { name: 'MultipleMinter', args: [] },
    { name: 'StreamrConfigurator', args: [] },
    { name: 'VehicleStream', args: [] },
    { name: 'DevAdmin', args: [] },
    { name: 'Multicall', args: [] },
    { name: 'DeviceDefinitionTable', args: [] },
    { name: 'ERC721Holder', args: [] },
    { name: 'DeviceDefinitionController', args: [] },
    { name: 'Charging', args: [] },
    { name: 'Shared', args: [] },
  ];

  const instances = getAddresses();

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory(C.dimoRegistryName);
  const dimoRegistryImplementation =
    await DIMORegistry.connect(deployer).deploy();

  console.log(
    `Contract ${C.dimoRegistryName
    } deployed to ${await dimoRegistryImplementation.getAddress()}`,
  );

  instances[networkName].modules[C.dimoRegistryName].address =
    await dimoRegistryImplementation.getAddress();

  for (const contractNameArg of contractNameArgs) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name,
    );
    const contractImplementation = await ContractFactory.connect(
      deployer,
    ).deploy(...contractNameArg.args);

    console.log(
      `Contract ${contractNameArg.name
      } deployed to ${await contractImplementation.getAddress()}`,
    );

    instances[networkName].modules[contractNameArg.name].address =
      await contractImplementation.getAddress();
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

async function deployNfts(
  deployer: HardhatEthersSigner,
  networkName: string,
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying NFT contracts -----\n');

  const instances = getAddresses();

  for (const contractNameArg of buildNftArgs(instances, networkName)) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name,
      deployer,
    );

    await upgrades.validateImplementation(ContractFactory, {
      kind: 'uups',
    });

    const contractProxy = await upgrades.deployProxy(
      ContractFactory,
      contractNameArg.args,
      {
        initializer: 'initialize',
        kind: 'uups',
      },
    );
    await contractProxy.waitForDeployment();

    console.log(
      `NFT contract ${contractNameArg.name
      } deployed to ${await contractProxy.getAddress()}`,
    );

    instances[networkName].nfts[contractNameArg.name].proxy =
      await contractProxy.getAddress();
    instances[networkName].nfts[contractNameArg.name].implementation =
      await upgrades.erc1967.getImplementationAddress(
        await contractProxy.getAddress(),
      );
  }

  console.log('\n----- NFT contracts deployed -----');

  return instances;
}

async function deployDimoForwarder(
  deployer: HardhatEthersSigner,
  networkName: string,
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying Dimo Forwarder -----\n');

  const instances = getAddresses();

  const DimoForwarderFactory = await ethers.getContractFactory(
    'DimoForwarder',
    deployer,
  );

  await upgrades.validateImplementation(DimoForwarderFactory, {
    kind: 'uups',
  });

  const contractProxy = await upgrades.deployProxy(
    DimoForwarderFactory,
    [
      instances[networkName].modules.DIMORegistry.address,
      ethers.ZeroAddress,
      ethers.ZeroAddress,
    ],
    {
      initializer: 'initialize',
      kind: 'uups',
    },
  );
  await contractProxy.waitForDeployment();

  instances[networkName].misc.DimoForwarder.proxy =
    await contractProxy.getAddress();
  instances[networkName].misc.DimoForwarder.implementation =
    await upgrades.erc1967.getImplementationAddress(
      await contractProxy.getAddress(),
    );

  console.log(`DimoForwarder deployed to ${await contractProxy.getAddress()}`);

  return instances;
}

// Sets SyntheticDeviceId contract address after deployment NFTs deployment
async function setupVehicleId(
  deployer: HardhatEthersSigner,
  networkName: string,
) {
  const instances = getAddresses();

  const vehicleIdInstance: VehicleId = await ethers.getContractAt(
    'VehicleId',
    instances[networkName].nfts.VehicleId.proxy,
  );

  console.log('\n----- Setting up Vehicle ID -----\n');

  await vehicleIdInstance
    .connect(deployer)
    .setSyntheticDeviceIdAddress(
      instances[networkName].nfts.SyntheticDeviceId.proxy,
    );
  console.log(
    `Synthetic Device ID ${instances[networkName].nfts.SyntheticDeviceId.proxy} set to Vehicle ID`,
  );
  await vehicleIdInstance
    .connect(deployer)
    .setSacdAddress(instances[networkName].misc.Sacd);
  console.log(
    `SACD ${instances[networkName].misc.Sacd} set to Vehicle ID`,
  );
  console.log('\n----- Vehicle ID setup -----\n');
}

async function setupDimoForwarder(
  deployer: HardhatEthersSigner,
  networkName: string,
) {
  const instances = getAddresses();

  const dimoForwarderInstance: DimoForwarder = await ethers.getContractAt(
    'DimoForwarder',
    instances[networkName].misc.DimoForwarder.proxy,
  );

  console.log('\n----- Setting up Dimo Forwader -----\n');

  await dimoForwarderInstance
    .connect(deployer)
    .setVehicleIdProxyAddress(instances[networkName].nfts.VehicleId.proxy);
  console.log(
    `Vehicle ID ${instances[networkName].nfts.VehicleId.proxy} set to Dimo Forwarder`,
  );

  await dimoForwarderInstance
    .connect(deployer)
    .setAftermarketDeviceIdProxyAddress(
      instances[networkName].nfts.AftermarketDeviceId.proxy,
    );
  console.log(
    `Aftermarket Device ID ${instances[networkName].nfts.AftermarketDeviceId.proxy} set to Dimo Forwarder`,
  );

  console.log('\n----- Dimo Forwarder setup -----');
}

async function addModules(
  deployer: HardhatEthersSigner,
  networkName: string,
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address,
  );

  const contractsNameImpl = Object.keys(instances[networkName].modules).map(
    (contractName) => {
      return {
        name: contractName,
        implementation: instances[networkName].modules[contractName].address,
      };
    },
  );

  console.log('\n----- Adding modules -----\n');

  for (const contract of contractsNameImpl) {
    const ContractFactory = await ethers.getContractFactory(contract.name);

    const contractSelectors = getSelectors(ContractFactory.interface);

    await (
      await dimoRegistryInstance
        .connect(deployer)
        .addModule(contract.implementation, contractSelectors)
    ).wait();

    instances[networkName].modules[contract.name].selectors = contractSelectors;

    console.log(`Module ${contract.name} added`);
  }

  console.log('\n----- Modules Added -----');

  return instances;
}

async function setupRegistry(
  deployer: HardhatEthersSigner,
  networkName: string,
) {
  const instances = getAddresses();

  const eip712CheckerInstance: Eip712Checker = await ethers.getContractAt(
    'Eip712Checker',
    instances[networkName].modules.DIMORegistry.address,
  );
  const chargingInstance: Charging =
    await ethers.getContractAt(
      'Charging',
      instances[networkName].modules.DIMORegistry.address,
    );
  const sharedInstance: Shared =
    await ethers.getContractAt(
      'Shared',
      instances[networkName].modules.DIMORegistry.address,
    );
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    instances[networkName].modules.DIMORegistry.address,
  );
  const integrationInstance: Integration = await ethers.getContractAt(
    'Integration',
    instances[networkName].modules.DIMORegistry.address,
  );
  const vehicleInstance: Vehicle = await ethers.getContractAt(
    'Vehicle',
    instances[networkName].modules.DIMORegistry.address,
  );
  const aftermarketDeviceInstance: AftermarketDevice =
    await ethers.getContractAt(
      'AftermarketDevice',
      instances[networkName].modules.DIMORegistry.address,
    );
  const aftermarketDeviceIdInstance: AftermarketDeviceId =
    await ethers.getContractAt(
      'AftermarketDeviceId',
      instances[networkName].nfts.AftermarketDeviceId.proxy,
    );
  const syntheticDeviceInstance: SyntheticDevice = await ethers.getContractAt(
    'SyntheticDevice',
    instances[networkName].modules.DIMORegistry.address,
  );
  const baseDataUriInstance: BaseDataURI = await ethers.getContractAt(
    'BaseDataURI',
    instances[networkName].modules.DIMORegistry.address,
  );

  console.log('\n----- Initializing EIP712 -----\n');
  await (
    await eip712CheckerInstance
      .connect(deployer)
      .initialize(C.eip712Name, C.eip712Version)
  ).wait();
  console.log(`${C.eip712Name} and ${C.eip712Version} set to EIP712Checker`);
  console.log('\n----- EIP712 initialized -----');

  console.log('\n----- Setting up Charging -----\n');
  await (
    await chargingInstance.setDcxOperationCost(
      C.MINT_VEHICLE_OPERATION,
      C.MINT_VEHICLE_OPERATION_COST[networkName]
    )
  ).wait();
  await (
    await chargingInstance.setDcxOperationCost(
      C.MINT_AD_OPERATION,
      C.MINT_AD_OPERATION_COST[networkName]
    )
  ).wait();
  console.log('\n----- Charging setup -----');

  console.log('\n----- Setting up Shared -----\n');
  await (
    await sharedInstance.setFoundation(
      instances[networkName].misc.Foundation,
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.Foundation} set as Foundation address`,
  );
  await (
    await sharedInstance.setDimoToken(
      instances[networkName].misc.DimoToken.proxy,
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.DimoToken.proxy} set as DIMO token address`,
  );
  await (
    await sharedInstance.setDimoCredit(
      instances[networkName].misc.DimoCredit.proxy,
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.DimoCredit.proxy} set as DIMO Credit token address`,
  );
  await (
    await sharedInstance.setManufacturerLicense(
      instances[networkName].misc.Stake.proxy,
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.Stake.proxy} set as Manufacturer License contract address`,
  );
  await (
    await sharedInstance.setConnectionsManager(
      instances[networkName].misc.ConnectionsManager,
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.ConnectionsManager} set as Connections Manager contract address`,
  );
  await (
    await sharedInstance.setSacd(
      instances[networkName].misc.Sacd,
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.Sacd} set as Sacd contract address`,
  );
  console.log('\n----- Shared setup -----');

  console.log('\n----- Setting NFT proxies -----\n');
  await (
    await manufacturerInstance
      .connect(deployer)
      .setManufacturerIdProxyAddress(
        instances[networkName].nfts.ManufacturerId.proxy,
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.ManufacturerId.proxy} proxy address set to Manufacturer`,
  );
  await (
    await integrationInstance
      .connect(deployer)
      .setIntegrationIdProxyAddress(
        instances[networkName].nfts.IntegrationId.proxy,
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.IntegrationId.proxy} proxy address set to Integration`,
  );
  await (
    await vehicleInstance
      .connect(deployer)
      .setVehicleIdProxyAddress(instances[networkName].nfts.VehicleId.proxy)
  ).wait();
  console.log(
    `${instances[networkName].nfts.VehicleId.proxy} proxy address set to Vehicle`,
  );
  await (
    await aftermarketDeviceInstance
      .connect(deployer)
      .setAftermarketDeviceIdProxyAddress(
        instances[networkName].nfts.AftermarketDeviceId.proxy,
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.AftermarketDeviceId.proxy} proxy address set to Aftermarket Device`,
  );
  await (
    await syntheticDeviceInstance
      .connect(deployer)
      .setSyntheticDeviceIdProxyAddress(
        instances[networkName].nfts.SyntheticDeviceId.proxy,
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.SyntheticDeviceId.proxy} proxy address set to Synthetic Device`,
  );
  console.log('\n----- NFT proxies set -----');

  console.log('\n----- Adding Vehicle Attributes -----\n');
  for (const attribute of C.vehicleAttributes) {
    await (
      await vehicleInstance.connect(deployer).addVehicleAttribute(attribute)
    ).wait();
    console.log(`${attribute} attribute set to Vehicle`);
  }
  console.log('\n----- Attributes added -----');

  console.log('\n----- Adding Aftermarket Device Attributes -----\n');
  for (const attribute of C.adAttributes) {
    await (
      await aftermarketDeviceInstance
        .connect(deployer)
        .addAftermarketDeviceAttribute(attribute)
    ).wait();
    console.log(`${attribute} attribute set to Aftermarket Device`);
  }
  console.log('\n----- Attributes added -----');

  console.log(
    '\n----- Aftermarket Device NFT setting approval for all to DIMO Registry -----',
  );
  await (
    await aftermarketDeviceIdInstance
      .connect(deployer)
      .setApprovalForAll(
        instances[networkName].modules.DIMORegistry.address,
        true,
      )
  ).wait();
  console.log('----- Approval set -----');

  console.log('\n----- Setting Base Data URI -----');
  await (
    await baseDataUriInstance
      .connect(deployer)
      .setBaseDataURI(
        instances[networkName].nfts.VehicleId.proxy,
        C.BASE_DATA_URI,
      )
  ).wait();
  console.log('----- Base Data URI set -----');
}

async function grantNftRoles(
  deployer: HardhatEthersSigner,
  networkName: string,
) {
  const instances = getAddresses();

  const dimoRegistryAddress =
    instances[networkName].modules.DIMORegistry.address;

  for (const contractName of [
    'ManufacturerId',
    'IntegrationId',
    'VehicleId',
    'AftermarketDeviceId',
    'SyntheticDeviceId',
  ]) {
    const contractInstance = (await ethers.getContractAt(
      contractName,
      instances[networkName].nfts[contractName].proxy,
    )) as unknown as NftBaseUpgradeable;

    console.log(
      `\n----- Granting ${C.roles.nfts.MINTER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the ${contractName} contract -----`,
    );

    await (
      await contractInstance
        .connect(deployer)
        .grantRole(C.roles.nfts.MINTER_ROLE, dimoRegistryAddress)
    ).wait();

    console.log(
      `----- ${C.roles.nfts.MINTER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the ${contractName} contract -----\n`,
    );
  }

  const aftermarketDeviceIdInstance: AftermarketDeviceId =
    await ethers.getContractAt(
      'AftermarketDeviceId',
      instances[networkName].nfts.AftermarketDeviceId.proxy,
    );

  console.log(
    `\n----- Granting ${C.roles.nfts.TRANSFERER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceId contract -----`,
  );

  await (
    await aftermarketDeviceIdInstance
      .connect(deployer)
      .grantRole(C.roles.nfts.TRANSFERER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `----- ${C.roles.nfts.TRANSFERER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceId contract -----\n`,
  );

  const syntheticDeviceIdInstance: SyntheticDeviceId =
    await ethers.getContractAt(
      'SyntheticDeviceId',
      instances[networkName].nfts.SyntheticDeviceId.proxy,
    );

  console.log(
    `\n----- Granting ${C.roles.nfts.BURNER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the SyntheticDeviceId contract -----`,
  );

  await (
    await syntheticDeviceIdInstance
      .connect(deployer)
      .grantRole(C.roles.nfts.BURNER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `----- ${C.roles.nfts.BURNER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the SyntheticDeviceId contract -----\n`,
  );
}

async function grantRoles(
  deployer: HardhatEthersSigner,
  address: string,
  roles: object,
  networkName: string,
) {
  const instances = getAddresses();

  const accessControlInstance: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    instances[networkName].modules.DIMORegistry.address,
  );

  console.log(`\n----- Granting roles to ${address} -----\n`);

  for (const [roleName, role] of Object.entries(roles)) {
    await (
      await accessControlInstance.connect(deployer).grantRole(role, address)
    ).wait();

    console.log(`${roleName}: ${role} role granted to ${address}`);
  }

  console.log(`\n----- Roles granted to ${address} -----\n`);
}


async function mintBatchManufacturers(
  deployer: HardhatEthersSigner,
  owner: string,
  networkName: string,
) {
  const instances = getAddresses();

  const batchSize = 50;
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    instances[networkName].modules.DIMORegistry.address,
  );

  console.log('\n----- Minting manufacturers -----\n');

  for (let i = 0; i < makes.length; i += batchSize) {
    const batch = makes.slice(i, i + batchSize);

    const receipt = (await (
      await manufacturerInstance
        .connect(deployer)
        .mintManufacturerBatch(owner, batch)
    ).wait()) as ContractTransactionReceipt;

    const ids = receipt?.logs
      ?.filter((log: EventLog | Log) => log instanceof EventLog)
      .map((eventLog: EventLog | Log) =>
        (eventLog as EventLog).args[1].toString(),
      );

    console.log(`Minted ids: ${ids?.join(',')}`);
  }

  console.log('\n----- Manufacturers minted -----\n');
}

async function mintBatchIntegrations(
  deployer: HardhatEthersSigner,
  owner: string,
  networkName: string,
) {
  const instances = getAddresses();

  const batchSize = 50;
  const integrationInstance: Integration = await ethers.getContractAt(
    'Integration',
    instances[networkName].modules.DIMORegistry.address,
  );

  console.log('\n----- Minting integrations -----\n');

  for (let i = 0; i < integrations.length; i += batchSize) {
    const batch = integrations.slice(i, i + batchSize);

    const receipt = (await (
      await integrationInstance
        .connect(deployer)
        .mintIntegrationBatch(owner, batch)
    ).wait()) as ContractTransactionReceipt;

    const ids = receipt?.logs
      ?.filter((log: EventLog | Log) => log instanceof EventLog)
      .map((eventLog: EventLog | Log) =>
        (eventLog as EventLog).args[0].toString(),
      );

    console.log(`Minted ids: ${ids?.join(',')}`);
  }

  console.log('\n----- Integrations minted -----\n');
}

async function setupStreamr(
  deployer: HardhatEthersSigner,
  networkName: string,
) {
  const instances = getAddresses();

  const streamrConfiguratorInstance: StreamrConfigurator = await ethers.getContractAt(
    'StreamrConfigurator',
    instances[networkName].modules.DIMORegistry.address,
  );

  console.log(`\n----- Setting StreamRegistry ${instances[networkName].misc.StreamRegistry} -----\n`);

  await streamrConfiguratorInstance
    .connect(deployer)
    .setStreamRegistry(
      instances[networkName].misc.StreamRegistry
    );

  console.log('\n----- StreamRegistry set -----\n');

  console.log(`\n----- Setting DIMO Base StreamId (ENS) ${C.dimoStreamrEns[networkName]} -----\n`);

  await streamrConfiguratorInstance
    .connect(deployer)
    .setDimoBaseStreamId(
      C.dimoStreamrEns[networkName]
    );

  console.log('\n----- DIMO Base StreamId set -----\n');
}

async function buildMocks(
  deployer: HardhatEthersSigner,
  mockFoundation: HardhatEthersSigner,
  mockKms: HardhatEthersSigner,
  networkName: string
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  // Deploy MockDimoToken contract
  const MockDimoTokenFactory = await ethers.getContractFactory('MockDimoToken');
  const mockDimoTokenInstance = await MockDimoTokenFactory.connect(
    deployer,
  ).deploy(ethers.parseEther('1000000000'));

  // Deploy MockDimoCredit contract
  const MockDimoCreditFactory = await ethers.getContractFactory('MockDimoCredit');
  const mockDimoCreditInstance = await MockDimoCreditFactory.connect(deployer).deploy();

  // Deploy MockManufacturerLicense contract
  const MockManufacturerLicenseFactory = await ethers.getContractFactory('MockManufacturerLicense');
  const mockManufacturerLicenseInstance = await MockManufacturerLicenseFactory.connect(deployer).deploy();

  instances[networkName].misc.DimoToken.proxy =
    await mockDimoTokenInstance.getAddress();
  instances[networkName].misc.DimoCredit.proxy =
    await mockDimoCreditInstance.getAddress();
  instances[networkName].misc.Stake.proxy =
    await mockManufacturerLicenseInstance.getAddress();
  instances[networkName].misc.Foundation = mockFoundation.address;
  instances[networkName].misc.Kms = [mockKms.address];

  await mockDimoCreditInstance
    .connect(deployer)
    .grantRole(
      C.roles.nfts.BURNER_ROLE,
      instances[networkName].modules.DIMORegistry.address
    );

  return instances;
}

async function main() {
  const [deployer, mockFoundation, mockKms] = await ethers.getSigners();
  const networkName = network.name;

  const moduleInstances = await deployModules(deployer, networkName);
  writeAddresses(moduleInstances, networkName);
  const instancesWithSelectors = await addModules(deployer, networkName);
  writeAddresses(instancesWithSelectors, networkName);

  const DimoForwarderInstance = await deployDimoForwarder(
    deployer,
    networkName,
  );
  writeAddresses(DimoForwarderInstance, networkName);
  const nftInstances = await deployNfts(deployer, networkName);
  writeAddresses(nftInstances, networkName);

  await setupVehicleId(deployer, networkName);
  await setupDimoForwarder(deployer, networkName);
  await grantNftRoles(deployer, networkName);

  if (networkName === 'hardhat' || networkName === 'localhost') {
    const mockInstances = await buildMocks(
      deployer,
      mockFoundation,
      mockKms,
      networkName,
    );
    writeAddresses(mockInstances, networkName);
  }

  const instances = getAddresses();

  // Deployer roles
  await grantRoles(
    deployer,
    deployer.address,
    {
      DEFAULT_ADMIN_ROLE: C.roles.DEFAULT_ADMIN_ROLE,
      ADMIN_ROLE: C.roles.ADMIN_ROLE,
      ...C.roles.modules
    },
    networkName
  );
  // Foundation roles
  await grantRoles(
    deployer,
    instances[networkName].misc.Foundation,
    {
      DEFAULT_ADMIN_ROLE: C.roles.DEFAULT_ADMIN_ROLE,
      ADMIN_ROLE: C.roles.ADMIN_ROLE,
    },
    networkName
  );
  // KMS roles
  for (const kmsAddres of instances[networkName].misc.Kms) {
    await grantRoles(
      deployer,
      kmsAddres,
      {
        CLAIM_AD_ROLE: C.roles.modules.CLAIM_AD_ROLE,
        PAIR_AD_ROLE: C.roles.modules.PAIR_AD_ROLE,
        UNPAIR_AD_ROLE: C.roles.modules.UNPAIR_AD_ROLE,
        MINT_SD_ROLE: C.roles.modules.MINT_SD_ROLE,
        BURN_SD_ROLE: C.roles.modules.BURN_SD_ROLE,
        MINT_VEHICLE_ROLE: C.roles.modules.MINT_VEHICLE_ROLE,
        BURN_VEHICLE_ROLE: C.roles.modules.BURN_VEHICLE_ROLE,
        MINT_VEHICLE_SD_ROLE: C.roles.modules.MINT_VEHICLE_SD_ROLE
      },
      networkName
    );
  }

  await setupRegistry(deployer, networkName);
  await mintBatchManufacturers(
    deployer,
    instances[networkName].misc.Foundation,
    networkName,
  );
  await mintBatchIntegrations(
    deployer,
    instances[networkName].misc.Foundation,
    networkName,
  );

  await setupStreamr(deployer, networkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
});