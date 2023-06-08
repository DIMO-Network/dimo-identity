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
  AftermarketDevice,
  AftermarketDeviceId,
  SyntheticDevice,
  AdLicenseValidator
} from '../typechain';
import { getSelectors, AddressesByNetwork, NftArgs } from '../utils';
import * as C from './data/deployArgs';
import addressesJSON from './data/addresses.json';
import { makes } from './data/Makes';

const addresses: AddressesByNetwork = addressesJSON;

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

function buildNftArgs(networkName: string): NftArgs[] {
  const currentManufacturerIdArgs: NftArgs = C.manufacturerIdArgs;
  const currentIntegrationIdArgs: NftArgs = C.integrationIdArgs;
  const currentVehicleIdArgs: NftArgs = C.vehicleIdArgs;
  const currentAdIdArgs: NftArgs = C.adIdArgs;
  const currentSdIdArgs: NftArgs = C.sdIdArgs;

  currentManufacturerIdArgs.args = [
    ...C.manufacturerIdArgs.args,
    addresses[networkName].modules.DIMORegistry.address
  ];
  currentIntegrationIdArgs.args = [
    ...C.integrationIdArgs.args,
    addresses[networkName].modules.DIMORegistry.address,
    []
  ];
  currentVehicleIdArgs.args = [
    ...C.vehicleIdArgs.args,
    addresses[networkName].modules.DIMORegistry.address,
    addresses[networkName].nfts.SyntheticDeviceId.proxy,
    [addresses[networkName].misc.DimoForwarder.proxy]
  ];
  currentAdIdArgs.args = [
    ...C.adIdArgs.args,
    addresses[networkName].modules.DIMORegistry.address,
    [addresses[networkName].misc.DimoForwarder.proxy]
  ];
  currentSdIdArgs.args = [
    ...C.sdIdArgs.args,
    addresses[networkName].modules.DIMORegistry.address,
    [addresses[networkName].misc.DimoForwarder.proxy]
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

  const instances: AddressesByNetwork = JSON.parse(JSON.stringify(addresses));

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

  const instances: AddressesByNetwork = JSON.parse(JSON.stringify(addresses));

  for (const contractNameArg of buildNftArgs(networkName)) {
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

  const instances: AddressesByNetwork = JSON.parse(JSON.stringify(addresses));

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
      instances[networkName].nfts.VehicleId.proxy,
      instances[networkName].nfts.AftermarketDeviceId.proxy
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

async function addModules(
  deployer: SignerWithAddress,
  networkName: string
): Promise<AddressesByNetwork> {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    addresses[networkName].modules.DIMORegistry.address
  );

  const instances: AddressesByNetwork = JSON.parse(JSON.stringify(addresses));

  const contractsNameImpl = Object.keys(addresses[networkName].modules).map(
    (contractName) => {
      return {
        name: contractName,
        implementation: addresses[networkName].modules[contractName].address
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
  const eip712CheckerInstance: Eip712Checker = await ethers.getContractAt(
    'Eip712Checker',
    addresses[networkName].modules.DIMORegistry.address
  );
  const adLicenseValidatorInstance: AdLicenseValidator =
    await ethers.getContractAt(
      'AdLicenseValidator',
      addresses[networkName].modules.DIMORegistry.address
    );
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    addresses[networkName].modules.DIMORegistry.address
  );
  const integrationInstance: Integration = await ethers.getContractAt(
    'Integration',
    addresses[networkName].modules.DIMORegistry.address
  );
  const vehicleInstance: Vehicle = await ethers.getContractAt(
    'Vehicle',
    addresses[networkName].modules.DIMORegistry.address
  );
  const aftermarketDeviceInstance: AftermarketDevice =
    await ethers.getContractAt(
      'AftermarketDevice',
      addresses[networkName].modules.DIMORegistry.address
    );
  const aftermarketDeviceIdInstance: AftermarketDeviceId =
    await ethers.getContractAt(
      'AftermarketDeviceId',
      addresses[networkName].nfts.AftermarketDeviceId.proxy
    );
  const syntheticDeviceInstance: SyntheticDevice = await ethers.getContractAt(
    'SyntheticDevice',
    addresses[networkName].modules.DIMORegistry.address
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
      addresses[networkName].misc.Foundation
    )
  ).wait();
  console.log(
    `${addresses[networkName].misc.Foundation} set as Foundation address`
  );
  await (
    await adLicenseValidatorInstance.setDimoToken(
      addresses[networkName].misc.DimoToken.proxy
    )
  ).wait();
  console.log(
    `${addresses[networkName].misc.DimoToken.proxy} set as DIMO token address`
  );
  await (
    await adLicenseValidatorInstance.setLicense(
      addresses[networkName].misc.Stake.proxy
    )
  ).wait();
  console.log(
    `${addresses[networkName].misc.Stake.proxy} set as License contract address`
  );
  await (await adLicenseValidatorInstance.setAdMintCost(C.adMintCost)).wait();
  console.log(`${C.adMintCost} set as aftermarket device mint cost`);
  console.log('\n----- AdLicenseValidator setup -----');

  console.log('\n----- Setting NFT proxies -----\n');
  await (
    await manufacturerInstance
      .connect(deployer)
      .setManufacturerIdProxyAddress(
        addresses[networkName].nfts.ManufacturerId.proxy
      )
  ).wait();
  console.log(
    `${addresses[networkName].nfts.ManufacturerId.proxy} proxy address set to Manufacturer`
  );
  await (
    await integrationInstance
      .connect(deployer)
      .setIntegrationIdProxyAddress(
        addresses[networkName].nfts.IntegrationId.proxy
      )
  ).wait();
  console.log(
    `${addresses[networkName].nfts.IntegrationId.proxy} proxy address set to Integration`
  );
  await (
    await vehicleInstance
      .connect(deployer)
      .setVehicleIdProxyAddress(addresses[networkName].nfts.VehicleId.proxy)
  ).wait();
  console.log(
    `${addresses[networkName].nfts.VehicleId.proxy} proxy address set to Vehicle`
  );
  await (
    await aftermarketDeviceInstance
      .connect(deployer)
      .setAftermarketDeviceIdProxyAddress(
        addresses[networkName].nfts.AftermarketDeviceId.proxy
      )
  ).wait();
  console.log(
    `${addresses[networkName].nfts.AftermarketDeviceId.proxy} proxy address set to Aftermarket Device`
  );
  await (
    await syntheticDeviceInstance
      .connect(deployer)
      .setSyntheticDeviceIdProxyAddress(
        addresses[networkName].nfts.SyntheticDeviceId.proxy
      )
  ).wait();
  console.log(
    `${addresses[networkName].nfts.SyntheticDeviceId.proxy} proxy address set to Synthetic Device`
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
        addresses[networkName].modules.DIMORegistry.address,
        true
      )
  ).wait();
  console.log('----- Approval set -----\n');
}

async function grantNftRoles(deployer: SignerWithAddress, networkName: string) {
  const dimoRegistryAddress =
    addresses[networkName].modules.DIMORegistry.address;

  for (const contractName of [
    'ManufacturerId',
    'IntegrationId',
    'VehicleId',
    'AftermarketDeviceId',
    'SyntheticDeviceId'
  ]) {
    const contractInstance = await ethers.getContractAt(
      contractName,
      addresses[networkName].nfts[contractName].proxy
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
      addresses[networkName].nfts.AftermarketDeviceId.proxy
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
}

async function grantRole(
  deployer: SignerWithAddress,
  role: string,
  address: string,
  networkName: string
) {
  const accessControlInstance: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    addresses[networkName].modules.DIMORegistry.address
  );

  console.log(`\n----- Granting ${role} role to ${address} -----`);

  await (
    await accessControlInstance.connect(deployer).grantRole(role, address)
  ).wait();

  console.log(`----- ${role} role granted to ${address} -----\n`);
}

async function mintBatch(
  deployer: SignerWithAddress,
  owner: string,
  networkName: string
) {
  const batchSize = 50;
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    addresses[networkName].modules.DIMORegistry.address
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

async function buildMocks(
  deployer: SignerWithAddress,
  mockFoundation: SignerWithAddress,
  mockKms: SignerWithAddress,
  networkName: string
): Promise<AddressesByNetwork> {
  const instances: AddressesByNetwork = JSON.parse(JSON.stringify(addresses));

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

  const instances = await deployModules(deployer, networkName);
  writeAddresses(instances, networkName);
  const DimoForwarderInstance = await deployDimoForwarder(
    deployer,
    networkName
  );
  writeAddresses(DimoForwarderInstance, networkName);
  const nftInstances = await deployNfts(deployer, networkName);
  writeAddresses(nftInstances, networkName);

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

  await setupRegistry(deployer, networkName);
  await grantRole(
    deployer,
    C.DEFAULT_ADMIN_ROLE,
    addresses[networkName].misc.Kms,
    networkName
  );
  await grantRole(
    deployer,
    C.DEFAULT_ADMIN_ROLE,
    addresses[networkName].misc.Foundation,
    networkName
  );
  await grantNftRoles(deployer, networkName);
  await mintBatch(
    deployer,
    addresses[networkName].misc.Foundation,
    networkName
  );
}

// TODO --------------------- GET KMS FOUNDATION ADDRESSES FROM JSON ---------------------

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
