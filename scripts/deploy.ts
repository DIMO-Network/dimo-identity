import * as fs from 'fs';
import * as path from 'path';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  DIMORegistry,
  AccessControl,
  Eip712Checker,
  Root,
  Vehicle
} from '../typechain';
import { C, getSelectors } from '../utils';
import addressesJSON from './data/addresses.json';
import { makes } from './data/Makes';

interface ContractAddressesByNetwork {
  [index: string]: {
    [index: string]: string
  };
}

interface KMSAddress {
  [index: string]: string;
}

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

const networkName = network.name;
const KmsAddress: KMSAddress = {
  mumbai: '0x74cb2b8ed0c1789d84ef701921d1152e592c330c',
  polygon: '0xcce4ef41a67e28c3cf3dbc51a6cd3d004f53acbd',
  hardhat: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
};

const dimoRegistryName = 'DIMORegistry';

const eip712Name = 'DIMO';
const eip712Version = '1';

const name = 'DIMO identity Beta V1';
const symbol = 'DIMO';
const baseUriDev = 'https://devices-api.dev.dimo.zone/v1/nfts/';
const baseUri = 'https://devices-api.dimo.zone/v1/nfts/';

const rootNodeType = ethers.utils.toUtf8Bytes('Root');
const vehicleNodeType = ethers.utils.toUtf8Bytes('Vehicle');
const rootAttribute1 = 'Name';
const vehicleAttribute1 = 'Make';
const vehicleAttribute2 = 'Model';
const vehicleAttribute3 = 'Year';

function writeAddresses(
  addresses: ContractAddressesByNetwork,
  networkName: string
) {
  console.log('\n----- Writing addresses to file -----\n');
  console.log(addresses);

  const currentAddresses: ContractAddressesByNetwork = contractAddresses;
  currentAddresses[networkName] = addresses[networkName];

  fs.writeFileSync(
    path.resolve(__dirname, 'data', 'addresses.json'),
    JSON.stringify(currentAddresses, null, 4)
  );
}

async function deploy(
  deployer: SignerWithAddress
): Promise<ContractAddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const contractNames = [
    'AccessControl',
    'Eip712Checker',
    'Getter',
    'Metadata',
    'Root',
    'Vehicle'
  ];

  const instances: ContractAddressesByNetwork = { [networkName]: {} };

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory(dimoRegistryName);
  const dimoRegistryImplementation = await DIMORegistry.connect(
    deployer
  ).deploy(name, symbol, baseUri);
  await dimoRegistryImplementation.deployed();

  console.log(
    `Contract ${dimoRegistryName} deployed to ${dimoRegistryImplementation.address}`
  );

  instances[networkName][dimoRegistryName] = dimoRegistryImplementation.address;

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    await contractImplementation.deployed();

    console.log(
      `Contract ${contractName} deployed to ${contractImplementation.address}`
    );

    instances[networkName][contractName] = contractImplementation.address;
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

async function addModules(deployer: SignerWithAddress) {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[networkName].DIMORegistry
  );

  const instances = Object.keys(contractAddresses[networkName])
    .filter((contractName) => contractName !== 'DIMORegistry')
    .map((contractName) => {
      return {
        name: contractName,
        implementation: contractAddresses[networkName][contractName]
      };
    });

  console.log('\n----- Adding modules -----\n');

  for (const contract of instances) {
    const ContractFactory = await ethers.getContractFactory(contract.name);

    const contractSelectors = getSelectors(ContractFactory.interface);

    await (
      await dimoRegistryInstance
        .connect(deployer)
        .addModule(contract.implementation, contractSelectors)
    ).wait();

    console.log(`Module ${contract.name} added`);
  }

  console.log('\n----- Modules Added -----');
}

async function setup(deployer: SignerWithAddress) {
  const eip712CheckerInstance: Eip712Checker = await ethers.getContractAt(
    'Eip712Checker',
    contractAddresses[networkName].DIMORegistry
  );
  const rootInstance: Root = await ethers.getContractAt(
    'Root',
    contractAddresses[networkName].DIMORegistry
  );
  const vehicleInstance: Vehicle = await ethers.getContractAt(
    'Vehicle',
    contractAddresses[networkName].DIMORegistry
  );

  console.log('\n----- Initializing EIP712 -----\n');
  await (
    await eip712CheckerInstance
      .connect(deployer)
      .initialize(eip712Name, eip712Version)
  ).wait();
  console.log(`${eip712Name} and ${eip712Version} set to EIP712Checker`);
  console.log('\n----- EIP712 initialized -----');

  console.log('\n----- Setting node types -----\n');
  await (
    await rootInstance.connect(deployer).setRootNodeType(rootNodeType)
  ).wait();
  console.log(`${rootNodeType} set to Root`);
  await (
    await vehicleInstance.connect(deployer).setVehicleNodeType(vehicleNodeType)
  ).wait();
  console.log(`${vehicleNodeType} set to Vehicle`);
  console.log('\n----- Node types set -----');

  // Whitelist Root attributes
  console.log('\n----- Adding Root Attributes -----\n');
  await (
    await rootInstance.connect(deployer).addRootAttribute(rootAttribute1)
  ).wait();
  console.log(`${rootAttribute1} attribute set to Root`);
  console.log('\n----- Attributes added -----');

  console.log('\n----- Adding Vehicle Attributes -----\n');
  for (const attribute of [
    vehicleAttribute1,
    vehicleAttribute2,
    vehicleAttribute3
  ]) {
    await (
      await vehicleInstance.connect(deployer).addVehicleAttribute(attribute)
    ).wait();
    console.log(`${attribute} attribute set to Vehicle`);
  }
  console.log('\n----- Attributes added -----');
}

async function grant(deployer: SignerWithAddress) {
  const kms: string = KmsAddress[networkName];

  const accessControlInstance: AccessControl = await ethers.getContractAt(
    'AccessControl',
    contractAddresses[networkName].DIMORegistry
  );

  console.log(`\n----- Granting admin role to ${kms} -----\n`);

  await (
    await accessControlInstance
      .connect(deployer)
      .grantRole(C.DEFAULT_ADMIN_ROLE, kms)
  ).wait();

  console.log(`\n----- Admin role granted to ${kms} -----\n`);
}

async function mintBatch(deployer: SignerWithAddress) {
  const rootInstance: Root = await ethers.getContractAt(
    'Root',
    contractAddresses[networkName].DIMORegistry
  );

  console.log(`\n----- Minting roots -----\n`);

  const receipt = await (
    await rootInstance
      .connect(deployer)
      .mintRootBatch(deployer.address, makes.slice(0))
  ).wait();

  receipt.events
    ?.filter((e: any) => e.event === 'NodeMinted')
    .map((e: any) => e.args.nodeId)
    .forEach((e: any) => {
      console.log(e);
    });

  console.log(`\n----- Roots Minted -----\n`);
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const instances = await deploy(deployer);

  writeAddresses(instances, networkName);

  await addModules(deployer);
  await setup(deployer);
  await grant(deployer);
  await mintBatch(deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
