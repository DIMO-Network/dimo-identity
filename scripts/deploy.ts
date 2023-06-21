import * as fs from 'fs';
import * as path from 'path';
import { ethers, network, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  DIMORegistry,
  DimoAccessControl,
  Eip712Checker,
  Manufacturer,
  Integration,
  Vehicle,
  VehicleId,
  AftermarketDevice,
  AftermarketDeviceId,
  AdLicenseValidator,
  SyntheticDevice,
  SyntheticDeviceId,
  DimoForwarder
} from '../typechain';
import { getSelectors, AddressesByNetwork, NftArgs } from '../utils';
import * as C from './data/deployArgs';
import { makes } from './data/Makes';
import { integrations } from './data/Integrations';

function getAddresses(): AddressesByNetwork {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'data', 'addresses.json'), 'utf8')
  );
}

function writeAddresses(addresses: AddressesByNetwork, networkName: string) {
  console.log('\n----- Writing addresses to file -----');

  const currentAddresses: AddressesByNetwork = addresses;
  currentAddresses[networkName] = addresses[networkName];

  fs.writeFileSync(
    path.resolve(__dirname, 'data', 'addresses.json'),
    JSON.stringify(currentAddresses, null, 4)
  );

  console.log('----- Addresses written to file -----\n');
}

function buildNftArgs(
  instances: AddressesByNetwork,
  networkName: string
): NftArgs[] {
  const currentManufacturerIdArgs: NftArgs = C.manufacturerIdArgs;
  const currentIntegrationIdArgs: NftArgs = C.integrationIdArgs;
  const currentVehicleIdArgs: NftArgs = C.vehicleIdArgs;
  const currentAdIdArgs: NftArgs = C.adIdArgs;
  const currentSdIdArgs: NftArgs = C.sdIdArgs;

  currentManufacturerIdArgs.args = [
    ...C.manufacturerIdArgs.args,
    instances[networkName].modules.DIMORegistry.address
  ];
  currentIntegrationIdArgs.args = [
    ...C.integrationIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    []
  ];
  currentVehicleIdArgs.args = [
    ...C.vehicleIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    ethers.constants.AddressZero,
    [instances[networkName].misc.DimoForwarder.proxy]
  ];
  currentAdIdArgs.args = [
    ...C.adIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy]
  ];
  currentSdIdArgs.args = [
    ...C.sdIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy]
  ];

  return [
    currentManufacturerIdArgs,
    currentIntegrationIdArgs,
    currentVehicleIdArgs,
    currentAdIdArgs,
    currentSdIdArgs
  ];
}

async function deployModules(
  deployer: SignerWithAddress,
  networkName: string
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const contractNameArgs = [
    { name: 'Eip712Checker', args: [] },
    { name: 'DimoAccessControl', args: [] },
    { name: 'Nodes', args: [] },
    { name: 'Manufacturer', args: [] },
    { name: 'Integration', args: [] },
    { name: 'Vehicle', args: [] },
    { name: 'AftermarketDevice', args: [] },
    { name: 'SyntheticDevice', args: [] },
    { name: 'AdLicenseValidator', args: [] },
    { name: 'Mapper', args: [] },
    { name: 'DevAdmin', args: [] },
    { name: 'Multicall', args: [] }
  ];

  const instances = getAddresses();

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory(C.dimoRegistryName);
  const dimoRegistryImplementation = await DIMORegistry.connect(
    deployer
  ).deploy();
  await dimoRegistryImplementation.deployed();

  console.log(
    `Contract ${C.dimoRegistryName} deployed to ${dimoRegistryImplementation.address}`
  );

  instances[networkName].modules[C.dimoRegistryName].address =
    dimoRegistryImplementation.address;

  for (const contractNameArg of contractNameArgs) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name
    );
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy(...contractNameArg.args);
    await contractImplementation.deployed();

    console.log(
      `Contract ${contractNameArg.name} deployed to ${contractImplementation.address}`
    );

    instances[networkName].modules[contractNameArg.name].address =
      contractImplementation.address;
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

async function deployNfts(
  deployer: SignerWithAddress,
  networkName: string
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying NFT contracts -----\n');

  const instances = getAddresses();

  for (const contractNameArg of buildNftArgs(instances, networkName)) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name,
      deployer
    );

    await upgrades.validateImplementation(ContractFactory, {
      kind: 'uups'
    });

    const contractProxy = await upgrades.deployProxy(
      ContractFactory,
      contractNameArg.args,
      {
        initializer: 'initialize',
        kind: 'uups'
      }
    );

    await contractProxy.deployed();

    console.log(
      `NFT contract ${contractNameArg.name} deployed to ${contractProxy.address}`
    );

    instances[networkName].nfts[contractNameArg.name].proxy =
      contractProxy.address;
    instances[networkName].nfts[contractNameArg.name].implementation =
      await upgrades.erc1967.getImplementationAddress(contractProxy.address);
  }

  console.log('\n----- NFT contracts deployed -----');

  return instances;
}

async function deployDimoForwarder(
  deployer: SignerWithAddress,
  networkName: string
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying Dimo Forwarder -----\n');

  const instances = getAddresses();

  const DimoForwarderFactory = await ethers.getContractFactory(
    'DimoForwarder',
    deployer
  );

  await upgrades.validateImplementation(DimoForwarderFactory, {
    kind: 'uups'
  });

  const contractProxy = await upgrades.deployProxy(
    DimoForwarderFactory,
    [
      instances[networkName].modules.DIMORegistry.address,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero
    ],
    {
      initializer: 'initialize',
      kind: 'uups'
    }
  );

  await contractProxy.deployed();

  instances[networkName].misc.DimoForwarder.proxy = contractProxy.address;
  instances[networkName].misc.DimoForwarder.implementation =
    await upgrades.erc1967.getImplementationAddress(contractProxy.address);

  console.log(`DimoForwarder deployed to ${contractProxy.address}`);

  return instances;
}

async function setupVehicleId(
  deployer: SignerWithAddress,
  networkName: string
) {
  const instances = getAddresses();

  const vehicleIdInstance: VehicleId = await ethers.getContractAt(
    'VehicleId',
    instances[networkName].nfts.VehicleId.proxy
  );

  console.log('\n----- Setting up Vehicle ID -----\n');

  await vehicleIdInstance
    .connect(deployer)
    .setSyntheticDeviceIdAddress(
      instances[networkName].nfts.SyntheticDeviceId.proxy
    );
  console.log(
    `Aftermarket Device ID ${instances[networkName].nfts.AftermarketDeviceId.proxy} set to Vehicle ID`
  );
  console.log('\n----- Vehicle ID setup -----\n');
}

async function setupDimoForwarder(
  deployer: SignerWithAddress,
  networkName: string
) {
  const instances = getAddresses();

  const dimoForwarderInstance: DimoForwarder = await ethers.getContractAt(
    'DimoForwarder',
    instances[networkName].misc.DimoForwarder.proxy
  );

  console.log('\n----- Setting up Dimo Forwader -----\n');

  await dimoForwarderInstance
    .connect(deployer)
    .setVehicleIdProxyAddress(instances[networkName].nfts.VehicleId.proxy);
  console.log(
    `Vehicle ID ${instances[networkName].nfts.VehicleId.proxy} set to Dimo Forwarder`
  );

  await dimoForwarderInstance
    .connect(deployer)
    .setAftermarketDeviceIdProxyAddress(
      instances[networkName].nfts.AftermarketDeviceId.proxy
    );
  console.log(
    `Aftermarket Device ID ${instances[networkName].nfts.AftermarketDeviceId.proxy} set to Dimo Forwarder`
  );

  console.log('\n----- Dimo Forwarder setup -----');
}

async function addModules(
  deployer: SignerWithAddress,
  networkName: string
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address
  );

  const contractsNameImpl = Object.keys(instances[networkName].modules).map(
    (contractName) => {
      return {
        name: contractName,
        implementation: instances[networkName].modules[contractName].address
      };
    }
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

async function setupRegistry(deployer: SignerWithAddress, networkName: string) {
  const instances = getAddresses();

  const eip712CheckerInstance: Eip712Checker = await ethers.getContractAt(
    'Eip712Checker',
    instances[networkName].modules.DIMORegistry.address
  );
  const adLicenseValidatorInstance: AdLicenseValidator =
    await ethers.getContractAt(
      'AdLicenseValidator',
      instances[networkName].modules.DIMORegistry.address
    );
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    instances[networkName].modules.DIMORegistry.address
  );
  const integrationInstance: Integration = await ethers.getContractAt(
    'Integration',
    instances[networkName].modules.DIMORegistry.address
  );
  const vehicleInstance: Vehicle = await ethers.getContractAt(
    'Vehicle',
    instances[networkName].modules.DIMORegistry.address
  );
  const aftermarketDeviceInstance: AftermarketDevice =
    await ethers.getContractAt(
      'AftermarketDevice',
      instances[networkName].modules.DIMORegistry.address
    );
  const aftermarketDeviceIdInstance: AftermarketDeviceId =
    await ethers.getContractAt(
      'AftermarketDeviceId',
      instances[networkName].nfts.AftermarketDeviceId.proxy
    );
  const syntheticDeviceInstance: SyntheticDevice = await ethers.getContractAt(
    'SyntheticDevice',
    instances[networkName].modules.DIMORegistry.address
  );

  console.log('\n----- Initializing EIP712 -----\n');
  await (
    await eip712CheckerInstance
      .connect(deployer)
      .initialize(C.eip712Name, C.eip712Version)
  ).wait();
  console.log(`${C.eip712Name} and ${C.eip712Version} set to EIP712Checker`);
  console.log('\n----- EIP712 initialized -----');

  console.log('\n----- Setting up AdLicenseValidator -----\n');
  await (
    await adLicenseValidatorInstance.setFoundationAddress(
      instances[networkName].misc.Foundation
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.Foundation} set as Foundation address`
  );
  await (
    await adLicenseValidatorInstance.setDimoToken(
      instances[networkName].misc.DimoToken.proxy
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.DimoToken.proxy} set as DIMO token address`
  );
  await (
    await adLicenseValidatorInstance.setLicense(
      instances[networkName].misc.Stake.proxy
    )
  ).wait();
  console.log(
    `${instances[networkName].misc.Stake.proxy} set as License contract address`
  );
  await (await adLicenseValidatorInstance.setAdMintCost(C.adMintCost)).wait();
  console.log(`${C.adMintCost} set as aftermarket device mint cost`);
  console.log('\n----- AdLicenseValidator setup -----');

  console.log('\n----- Setting NFT proxies -----\n');
  await (
    await manufacturerInstance
      .connect(deployer)
      .setManufacturerIdProxyAddress(
        instances[networkName].nfts.ManufacturerId.proxy
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.ManufacturerId.proxy} proxy address set to Manufacturer`
  );
  await (
    await integrationInstance
      .connect(deployer)
      .setIntegrationIdProxyAddress(
        instances[networkName].nfts.IntegrationId.proxy
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.IntegrationId.proxy} proxy address set to Integration`
  );
  await (
    await vehicleInstance
      .connect(deployer)
      .setVehicleIdProxyAddress(instances[networkName].nfts.VehicleId.proxy)
  ).wait();
  console.log(
    `${instances[networkName].nfts.VehicleId.proxy} proxy address set to Vehicle`
  );
  await (
    await aftermarketDeviceInstance
      .connect(deployer)
      .setAftermarketDeviceIdProxyAddress(
        instances[networkName].nfts.AftermarketDeviceId.proxy
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.AftermarketDeviceId.proxy} proxy address set to Aftermarket Device`
  );
  await (
    await syntheticDeviceInstance
      .connect(deployer)
      .setSyntheticDeviceIdProxyAddress(
        instances[networkName].nfts.SyntheticDeviceId.proxy
      )
  ).wait();
  console.log(
    `${instances[networkName].nfts.SyntheticDeviceId.proxy} proxy address set to Synthetic Device`
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
    '\n----- Aftermarket Device NFT setting approval for all to DIMO Registry -----'
  );
  await (
    await aftermarketDeviceIdInstance
      .connect(deployer)
      .setApprovalForAll(
        instances[networkName].modules.DIMORegistry.address,
        true
      )
  ).wait();
  console.log('----- Approval set -----\n');
}

async function grantNftRoles(deployer: SignerWithAddress, networkName: string) {
  const instances = getAddresses();

  const dimoRegistryAddress =
    instances[networkName].modules.DIMORegistry.address;

  for (const contractName of [
    'ManufacturerId',
    'IntegrationId',
    'VehicleId',
    'AftermarketDeviceId',
    'SyntheticDeviceId'
  ]) {
    const contractInstance = await ethers.getContractAt(
      contractName,
      instances[networkName].nfts[contractName].proxy
    );

    console.log(
      `\n----- Granting ${C.MINTER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the ${contractName} contract -----`
    );

    await (
      await contractInstance
        .connect(deployer)
        .grantRole(C.MINTER_ROLE, dimoRegistryAddress)
    ).wait();

    console.log(
      `----- ${C.MINTER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the ${contractName} contract -----\n`
    );
  }

  const aftermarketDeviceIdInstance: AftermarketDeviceId =
    await ethers.getContractAt(
      'AftermarketDeviceId',
      instances[networkName].nfts.AftermarketDeviceId.proxy
    );

  console.log(
    `\n----- Granting ${C.TRANSFERER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceId contract -----`
  );

  await (
    await aftermarketDeviceIdInstance
      .connect(deployer)
      .grantRole(C.TRANSFERER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `----- ${C.TRANSFERER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceId contract -----\n`
  );

  const syntheticDeviceIdInstance: SyntheticDeviceId =
    await ethers.getContractAt(
      'SyntheticDeviceId',
      instances[networkName].nfts.SyntheticDeviceId.proxy
    );

  console.log(
    `\n----- Granting ${C.BURNER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the SyntheticDeviceId contract -----`
  );

  await (
    await syntheticDeviceIdInstance
      .connect(deployer)
      .grantRole(C.BURNER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `----- ${C.BURNER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the SyntheticDeviceId contract -----\n`
  );
}

async function grantRole(
  deployer: SignerWithAddress,
  role: string,
  address: string,
  networkName: string
) {
  const instances = getAddresses();

  const accessControlInstance: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    instances[networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Granting ${role} role to ${address} -----`);

  await (
    await accessControlInstance.connect(deployer).grantRole(role, address)
  ).wait();

  console.log(`----- ${role} role granted to ${address} -----\n`);
}

async function mintBatchManufacturers(
  deployer: SignerWithAddress,
  owner: string,
  networkName: string
) {
  const instances = getAddresses();

  const batchSize = 50;
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    instances[networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Minting manufacturers -----\n`);

  for (let i = 0; i < makes.length; i += batchSize) {
    const batch = makes.slice(i, i + batchSize);

    const receipt = await (
      await manufacturerInstance
        .connect(deployer)
        .mintManufacturerBatch(owner, batch)
    ).wait();

    const ids = receipt.events
      ?.filter((e: any) => e.event === 'ManufacturerNodeMinted')
      .map((e: any) => e.args.tokenId);

    console.log(`Minted ids: ${ids?.join(',')}`);
  }

  console.log(`\n----- Manufacturers minted -----\n`);
}

async function mintBatchIntegrations(
  deployer: SignerWithAddress,
  owner: string,
  networkName: string
) {
  const instances = getAddresses();

  const batchSize = 50;
  const integrationInstance: Integration = await ethers.getContractAt(
    'Integration',
    instances[networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Minting integrations -----\n`);

  for (let i = 0; i < integrations.length; i += batchSize) {
    const batch = integrations.slice(i, i + batchSize);

    const receipt = await (
      await integrationInstance
        .connect(deployer)
        .mintIntegrationBatch(owner, batch)
    ).wait();

    const ids = receipt.events
      ?.filter((e: any) => e.event === 'IntegrationNodeMinted')
      .map((e: any) => e.args.tokenId);

    console.log(`Minted ids: ${ids?.join(',')}`);
  }

  console.log(`\n----- Integrations minted -----\n`);
}

async function buildMocks(
  deployer: SignerWithAddress,
  mockFoundation: SignerWithAddress,
  mockKms: SignerWithAddress,
  networkName: string
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  // Deploy MockDimoToken contract
  const MockDimoTokenFactory = await ethers.getContractFactory('MockDimoToken');
  const mockDimoTokenInstance = await MockDimoTokenFactory.connect(
    deployer
  ).deploy(ethers.utils.parseEther('1000000000'));
  await mockDimoTokenInstance.deployed();

  // Deploy MockStake contract
  const MockStakeFactory = await ethers.getContractFactory('MockStake');
  const mockStakeInstance = await MockStakeFactory.connect(deployer).deploy();
  await mockStakeInstance.deployed();

  instances[networkName].misc.DimoToken.proxy = mockDimoTokenInstance.address;
  instances[networkName].misc.Stake.proxy = mockStakeInstance.address;
  instances[networkName].misc.Foundation = mockFoundation.address;
  instances[networkName].misc.Kms = mockKms.address;

  return instances;
}

async function main() {
  const [deployer, mockFoundation, mockKms] = await ethers.getSigners();
  const networkName = network.name;

  const moduleInstances = await deployModules(deployer, networkName);
  writeAddresses(moduleInstances, networkName);
  const DimoForwarderInstance = await deployDimoForwarder(
    deployer,
    networkName
  );
  writeAddresses(DimoForwarderInstance, networkName);
  const nftInstances = await deployNfts(deployer, networkName);
  writeAddresses(nftInstances, networkName);

  await setupVehicleId(deployer, networkName);
  await setupDimoForwarder(deployer, networkName);

  const instancesWithSelectors = await addModules(deployer, networkName);
  writeAddresses(instancesWithSelectors, networkName);

  if (networkName === 'hardhat' || networkName === 'localhost') {
    const mockInstances = await buildMocks(
      deployer,
      mockFoundation,
      mockKms,
      networkName
    );
    writeAddresses(mockInstances, networkName);
  }

  const instances = getAddresses();

  await setupRegistry(deployer, networkName);
  await grantRole(
    deployer,
    C.DEFAULT_ADMIN_ROLE,
    instances[networkName].misc.Kms,
    networkName
  );
  await grantRole(
    deployer,
    C.DEFAULT_ADMIN_ROLE,
    instances[networkName].misc.Foundation,
    networkName
  );
  await grantNftRoles(deployer, networkName);
  await mintBatchManufacturers(
    deployer,
    instances[networkName].misc.Foundation,
    networkName
  );
  await mintBatchIntegrations(
    deployer,
    instances[networkName].misc.Foundation,
    networkName
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
