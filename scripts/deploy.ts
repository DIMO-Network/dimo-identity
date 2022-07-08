import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  DIMORegistryBetaV1,
  AccessControlBetaV1,
  Eip712CheckerBetaV1,
  GetterBetaV1,
  MetadataBetaV1,
  RootBetaV1,
  VehicleBetaV1
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

type Contract = {
  name: string,
  implementation: string
};

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

const networkName = network.name;
const KmsAddress: KMSAddress = {
  mumbai: '0x74cb2b8ed0c1789d84ef701921d1152e592c330c',
  polygon: '0xcce4ef41a67e28c3cf3dbc51a6cd3d004f53acbd'
};

const dimoRegistryName = 'DIMORegistryBetaV1';

const eip712Name = 'DIMOBetaV1';
const eip712Version = '1';

const name = 'DIMO identity Beta V1';
const symbol = 'DIMOBetaV1';
const baseUri = 'https://devices-api.dimo.zone/v1/nfts/';

const rootNodeType = ethers.utils.toUtf8Bytes('Root');
const vehicleNodeType = ethers.utils.toUtf8Bytes('Vehicle');
const rootAttribute1 = 'Name';
const vehicleAttribute1 = 'Make';
const vehicleAttribute2 = 'Model';
const vehicleAttribute3 = 'Year';

async function deploy(deployer: SignerWithAddress): Promise<any[]> {
  console.log('\n----- Deploying contracts -----\n');

  const contractNames = [
    'AccessControlBetaV1',
    'Eip712CheckerBetaV1',
    'GetterBetaV1',
    'MetadataBetaV1',
    'RootBetaV1',
    'VehicleBetaV1'
  ];

  const instances: any[] = [];

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory(dimoRegistryName);
  const dimoRegistryImplementation = await DIMORegistry.connect(
    deployer
  ).deploy(name, symbol, baseUri);
  await dimoRegistryImplementation.deployed();

  console.log(
    `Contract ${dimoRegistryName} deployed to ${dimoRegistryImplementation.address}`
  );

  const dimoRegistry = await ethers.getContractAt(
    dimoRegistryName,
    dimoRegistryImplementation.address
  );

  instances.push(dimoRegistry);

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    await contractImplementation.deployed();

    console.log(
      `Contract ${contractName} deployed to ${contractImplementation.address}`
    );

    instances.push(
      await ethers.getContractAt(contractName, contractImplementation.address)
    );
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

async function addModules(
  dimoRegistry: DIMORegistryBetaV1,
  deployer: SignerWithAddress,
  ...contracts: Contract[]
) {
  for (const contract of contracts) {
    const ContractFactory = await ethers.getContractFactory(contract.name);

    const contractSelectors = getSelectors(ContractFactory.interface);

    await (
      await dimoRegistry
        .connect(deployer)
        .addModule(contract.implementation, contractSelectors)
    ).wait();

    console.log(`Module ${contract.name} added`);
  }
}

async function mainModules(deployer: SignerWithAddress) {
  const instances: Contract[] = [];
  const dimoRegistryInstance = await ethers.getContractAt(
    'DIMORegistryBetaV1',
    contractAddresses[networkName].DIMORegistryBetaV1
  );

  instances.push({
    name: 'AccessControlBetaV1',
    implementation: contractAddresses[networkName].AccessControlBetaV1
  });
  instances.push({
    name: 'Eip712CheckerBetaV1',
    implementation: contractAddresses[networkName].Eip712CheckerBetaV1
  });
  instances.push({
    name: 'GetterBetaV1',
    implementation: contractAddresses[networkName].GetterBetaV1
  });
  instances.push({
    name: 'MetadataBetaV1',
    implementation: contractAddresses[networkName].MetadataBetaV1
  });
  instances.push({
    name: 'RootBetaV1',
    implementation: contractAddresses[networkName].RootBetaV1
  });
  instances.push({
    name: 'VehicleBetaV1',
    implementation: contractAddresses[networkName].VehicleBetaV1
  });

  console.log('\n----- Adding modules -----\n');
  await addModules(dimoRegistryInstance, deployer, ...instances);
  console.log('\n----- Modules Added -----');
}

async function mainSetup(deployer: SignerWithAddress) {
  const eip712CheckerInstance = await ethers.getContractAt(
    'Eip712CheckerBetaV1',
    contractAddresses[networkName].DIMORegistryBetaV1
  );
  const rootInstance = await ethers.getContractAt(
    'RootBetaV1',
    contractAddresses[networkName].DIMORegistryBetaV1
  );
  const vehicleInstance = await ethers.getContractAt(
    'VehicleBetaV1',
    contractAddresses[networkName].DIMORegistryBetaV1
  );

  console.log('\n----- Initializing EIP712 -----\n');
  await (
    await eip712CheckerInstance
      .connect(deployer)
      .initialize(eip712Name, eip712Version)
  ).wait();
  console.log('\n----- EIP712 initialized -----');

  console.log('\n----- Setting node types -----\n');
  await (
    await rootInstance.connect(deployer).setRootNodeType(rootNodeType)
  ).wait();
  await (
    await vehicleInstance.connect(deployer).setVehicleNodeType(vehicleNodeType)
  ).wait();
  console.log('\n----- Node types set -----');

  // Whitelist Root attributes
  console.log('\n----- Adding Root Attributes -----\n');
  await (
    await rootInstance.connect(deployer).addRootAttribute(rootAttribute1)
  ).wait();
  console.log('\n----- Attributes added -----');

  console.log('\n----- Adding Vehicle Attributes -----\n');
  await (
    await vehicleInstance
      .connect(deployer)
      .addVehicleAttribute(vehicleAttribute1)
  ).wait();
  await (
    await vehicleInstance
      .connect(deployer)
      .addVehicleAttribute(vehicleAttribute2)
  ).wait();
  await (
    await vehicleInstance
      .connect(deployer)
      .addVehicleAttribute(vehicleAttribute3)
  ).wait();
  console.log('\n----- Attributes added -----');
}

async function mainMintBatch(deployer: SignerWithAddress) {
  const rootInstance = await ethers.getContractAt(
    'RootBetaV1',
    contractAddresses[networkName].DIMORegistryBetaV1
  );

  const receipt = await (
    await rootInstance
      .connect(deployer)
      .mintRootBatch(deployer.address, makes.slice(100))
  ).wait();

  receipt.events
    ?.filter((e: any) => e.event === 'NodeMinted')
    .map((e: any) => e.args.nodeId)
    .forEach((e: any) => {
      console.log(e);
    });
}

async function mainGrant(deployer: SignerWithAddress) {
  const kms: string = KmsAddress[networkName];

  const accessControlInstance = await ethers.getContractAt(
    'AccessControlBetaV1',
    contractAddresses[networkName].DIMORegistryBetaV1
  );

  await (
    await accessControlInstance
      .connect(deployer)
      .grantRole(C.DEFAULT_ADMIN_ROLE, kms)
  ).wait();

  console.log(await accessControlInstance.hasRole(C.DEFAULT_ADMIN_ROLE, kms));
}

async function main() {
  const [deployer] = await ethers.getSigners();

  await deploy(deployer);

  // Write the address in ./data/addresses.json

  await mainModules(deployer);
  await mainSetup(deployer);
  await mainGrant(deployer);
  await mainMintBatch(deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
