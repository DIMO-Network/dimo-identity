import * as fs from 'fs';
import * as path from 'path';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  DIMORegistry,
  AccessControl,
  Eip712Checker,
  Manufacturer,
  Vehicle,
  AftermarketDevice,
  AdLicenseValidator
} from '../typechain';
import { getSelectors, ContractAddressesByNetwork } from '../utils';
import * as C from './data/deployConstants';
import addressesJSON from './data/addresses.json';
import { makes } from './data/Makes';

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

function writeAddresses(
  addresses: ContractAddressesByNetwork,
  networkName: string
) {
  console.log('\n----- Writing addresses to file -----\n');

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
    'Eip712Checker',
    'AccessControl',
    'Nodes',
    'Metadata',
    'Manufacturer',
    'Vehicle',
    'AftermarketDevice',
    'AdLicenseValidator',
    'Mapper'
  ];

  const instances: ContractAddressesByNetwork = {
    [C.networkName]: {}
  };

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory(C.dimoRegistryName);
  const dimoRegistryImplementation = await DIMORegistry.connect(
    deployer
  ).deploy(C.name, C.symbol, C.baseUri[C.networkName]);
  await dimoRegistryImplementation.deployed();

  console.log(
    `Contract ${C.dimoRegistryName} deployed to ${dimoRegistryImplementation.address}`
  );

  instances[C.networkName][C.dimoRegistryName] =
    dimoRegistryImplementation.address;

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    await contractImplementation.deployed();

    console.log(
      `Contract ${contractName} deployed to ${contractImplementation.address}`
    );

    instances[C.networkName][contractName] = contractImplementation.address;
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

async function addModules(deployer: SignerWithAddress) {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[C.networkName].DIMORegistry
  );

  const instances = Object.keys(contractAddresses[C.networkName])
    .filter((contractName) => contractName !== 'DIMORegistry')
    .map((contractName) => {
      return {
        name: contractName,
        implementation: contractAddresses[C.networkName][contractName]
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
    contractAddresses[C.networkName].DIMORegistry
  );
  const adLicenseValidatorInstance: AdLicenseValidator =
    await ethers.getContractAt(
      'AdLicenseValidator',
      contractAddresses[C.networkName].DIMORegistry
    );
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    contractAddresses[C.networkName].DIMORegistry
  );
  const vehicleInstance: Vehicle = await ethers.getContractAt(
    'Vehicle',
    contractAddresses[C.networkName].DIMORegistry
  );
  const aftermarketDeviceInstance: AftermarketDevice =
    await ethers.getContractAt(
      'AftermarketDevice',
      contractAddresses[C.networkName].DIMORegistry
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
      C.foundationAddress[C.networkName]
    )
  ).wait();
  console.log(
    `${C.foundationAddress[C.networkName]} set as Foundation address`
  );
  await (
    await adLicenseValidatorInstance.setDimoToken(
      C.dimoTokenAddress[C.networkName]
    )
  ).wait();
  console.log(`${C.dimoTokenAddress[C.networkName]} set as DIMO token address`);
  await (
    await adLicenseValidatorInstance.setLicense(C.licenseAddress[C.networkName])
  ).wait();
  console.log(
    `${C.licenseAddress[C.networkName]} set as License contract address`
  );
  await (await adLicenseValidatorInstance.setAdMintCost(C.adMintCost)).wait();
  console.log(`${C.adMintCost} set as aftermarket device mint cost`);
  console.log('\n----- AdLicenseValidator setup -----');

  console.log('\n----- Setting node types -----\n');
  await (
    await manufacturerInstance
      .connect(deployer)
      .setManufacturerNodeType(C.manufacturerNodeType)
  ).wait();
  console.log(
    `${ethers.BigNumber.from(
      ethers.utils.keccak256(C.manufacturerNodeType)
    )} set to Manufacturer`
  );
  await (
    await vehicleInstance
      .connect(deployer)
      .setVehicleNodeType(C.vehicleNodeType)
  ).wait();
  console.log(
    `${ethers.BigNumber.from(
      ethers.utils.keccak256(C.vehicleNodeType)
    )} set to Vehicle`
  );
  await (
    await aftermarketDeviceInstance
      .connect(deployer)
      .setAftermarketDeviceNodeType(C.adNodeType)
  ).wait();
  console.log(
    `${ethers.BigNumber.from(
      ethers.utils.keccak256(C.adNodeType)
    )} set to Aftermarket Device`
  );
  console.log('\n----- Node types set -----');

  // Whitelist Manufacturer attributes
  console.log('\n----- Adding Manufacturer Attributes -----\n');
  await (
    await manufacturerInstance
      .connect(deployer)
      .addManufacturerAttribute(C.manufacturerAttribute1)
  ).wait();
  console.log(`${C.manufacturerAttribute1} attribute set to Manufacturer`);
  console.log('\n----- Attributes added -----');

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
}

async function grant(deployer: SignerWithAddress) {
  const kms: string = C.KmsAddress[C.networkName];

  const accessControlInstance: AccessControl = await ethers.getContractAt(
    'AccessControl',
    contractAddresses[C.networkName].DIMORegistry
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
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    contractAddresses[C.networkName].DIMORegistry
  );

  console.log(`\n----- Minting manufacturers -----\n`);

  const receipt = await (
    await manufacturerInstance
      .connect(deployer)
      .mintManufacturerBatch(deployer.address, makes.slice(0))
  ).wait();

  receipt.events
    ?.filter((e: any) => e.event === 'NodeMinted')
    .map((e: any) => e.args.nodeId)
    .forEach((e: any) => {
      console.log(e.toString());
    });

  console.log(`\n----- Manufacturers Minted -----\n`);
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const instances = await deploy(deployer);

  writeAddresses(instances, C.networkName);

  await addModules(deployer);
  await setup(deployer);
  await grant(deployer);
  await mintBatch(deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
