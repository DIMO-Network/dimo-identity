import * as fs from 'fs';
import * as path from 'path';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import {
  DIMORegistry,
  DimoAccessControl,
  Eip712Checker,
  Manufacturer,
  ManufacturerNft,
  Vehicle,
  VehicleNft,
  AftermarketDevice,
  AftermarketDeviceNft,
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

async function deployModules(
  deployer: SignerWithAddress
): Promise<ContractAddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const contractNameArgs = [
    { name: 'Eip712Checker', args: [] },
    { name: 'DimoAccessControl', args: [] },
    { name: 'Nodes', args: [] },
    { name: 'Manufacturer', args: [] },
    { name: 'Vehicle', args: [] },
    { name: 'AftermarketDevice', args: [] },
    { name: 'AdLicenseValidator', args: [] },
    { name: 'Mapper', args: [] },
    { name: 'DevAdmin', args: [] }
  ];

  const instances: ContractAddressesByNetwork = {
    [C.networkName]: {
      modules: {},
      nfts: {}
    }
  };

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory(C.dimoRegistryName);
  const dimoRegistryImplementation = await DIMORegistry.connect(
    deployer
  ).deploy();
  await dimoRegistryImplementation.deployed();

  console.log(
    `Contract ${C.dimoRegistryName} deployed to ${dimoRegistryImplementation.address}`
  );

  instances[C.networkName].modules[C.dimoRegistryName] =
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

    instances[C.networkName].modules[contractNameArg.name] =
      contractImplementation.address;
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

async function deployNfts(): Promise<ContractAddressesByNetwork> {
  console.log('\n----- Deploying NFT contracts -----\n');

  const contractNameArgs = [
    {
      name: 'ManufacturerNft',
      args: [
        C.MANUFACTURER_NFT_NAME,
        C.MANUFACTURER_NFT_SYMBOL,
        C.MANUFACTURER_NFT_URI
      ]
    },
    {
      name: 'VehicleNft',
      args: [C.VEHICLE_NFT_NAME, C.VEHICLE_NFT_SYMBOL, C.VEHICLE_NFT_URI]
    },
    {
      name: 'AftermarketDeviceNft',
      args: [C.AD_NFT_NAME, C.AD_NFT_SYMBOL, C.AD_NFT_URI]
    }
  ];

  const instances: ContractAddressesByNetwork = JSON.parse(
    JSON.stringify(contractAddresses)
  );

  for (const contractNameArg of contractNameArgs) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name
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

    instances[C.networkName].nfts[contractNameArg.name] = contractProxy.address;
  }

  console.log('\n----- NFT contracts deployed -----');

  return instances;
}

async function addModules(deployer: SignerWithAddress) {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[C.networkName].modules.DIMORegistry
  );

  const instances = Object.keys(contractAddresses[C.networkName].modules).map(
    (contractName) => {
      return {
        name: contractName,
        implementation: contractAddresses[C.networkName].modules[contractName]
      };
    }
  );

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
    contractAddresses[C.networkName].modules.DIMORegistry
  );
  const adLicenseValidatorInstance: AdLicenseValidator =
    await ethers.getContractAt(
      'AdLicenseValidator',
      contractAddresses[C.networkName].modules.DIMORegistry
    );
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    contractAddresses[C.networkName].modules.DIMORegistry
  );
  const vehicleInstance: Vehicle = await ethers.getContractAt(
    'Vehicle',
    contractAddresses[C.networkName].modules.DIMORegistry
  );
  const aftermarketDeviceInstance: AftermarketDevice =
    await ethers.getContractAt(
      'AftermarketDevice',
      contractAddresses[C.networkName].modules.DIMORegistry
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

  console.log('\n----- Setting NFT proxies -----\n');
  await (
    await manufacturerInstance
      .connect(deployer)
      .setManufacturerNftProxyAddress(
        contractAddresses[C.networkName].nfts.ManufacturerNft
      )
  ).wait();
  console.log(
    `${
      contractAddresses[C.networkName].nfts.ManufacturerNft
    } proxy address set to Manufacturer`
  );
  await (
    await vehicleInstance
      .connect(deployer)
      .setVehicleNftProxyAddress(
        contractAddresses[C.networkName].nfts.VehicleNft
      )
  ).wait();
  console.log(
    `${
      contractAddresses[C.networkName].nfts.VehicleNft
    } proxy address set to Vehicle`
  );
  await (
    await aftermarketDeviceInstance
      .connect(deployer)
      .setAftermarketDeviceNftProxyAddress(
        contractAddresses[C.networkName].nfts.AftermarketDeviceNft
      )
  ).wait();
  console.log(
    `${
      contractAddresses[C.networkName].nfts.AftermarketDeviceNft
    } proxy address set to Aftermarket Device`
  );
  console.log('\n----- NFT proxies set -----');

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

async function grantNftRoles(deployer: SignerWithAddress) {
  const manufacturerNftInstance: ManufacturerNft = await ethers.getContractAt(
    'ManufacturerNft',
    contractAddresses[C.networkName].nfts.ManufacturerNft
  );
  const vehicleNftInstance: VehicleNft = await ethers.getContractAt(
    'VehicleNft',
    contractAddresses[C.networkName].nfts.VehicleNft
  );
  const aftermarketDeviceNftInstance: AftermarketDeviceNft =
    await ethers.getContractAt(
      'AftermarketDeviceNft',
      contractAddresses[C.networkName].nfts.AftermarketDeviceNft
    );
  const dimoRegistryAddress =
    contractAddresses[C.networkName].modules.DIMORegistry;

  console.log(
    `\n----- Granting ${C.MINTER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the ManufacturerNft contract -----\n`
  );

  await (
    await manufacturerNftInstance
      .connect(deployer)
      .grantRole(C.MINTER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `\n----- ${C.MINTER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the ManufacturerNft contract -----\n`
  );

  console.log(
    `\n----- Granting ${C.MINTER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the VehicleNft contract -----\n`
  );

  await (
    await vehicleNftInstance
      .connect(deployer)
      .grantRole(C.MINTER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `\n----- ${C.MINTER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the VehicleNft contract -----\n`
  );

  console.log(
    `\n----- Granting ${C.MINTER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceNft contract -----\n`
  );

  await (
    await aftermarketDeviceNftInstance
      .connect(deployer)
      .grantRole(C.MINTER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `\n----- ${C.MINTER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceNft contract -----\n`
  );

  console.log(
    `\n----- Granting ${C.TRANSFERER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceNft contract -----\n`
  );

  await (
    await aftermarketDeviceNftInstance
      .connect(deployer)
      .grantRole(C.TRANSFERER_ROLE, dimoRegistryAddress)
  ).wait();

  console.log(
    `\n----- ${C.TRANSFERER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the AftermarketDeviceNft contract -----\n`
  );
}

async function grantRole(
  deployer: SignerWithAddress,
  role: string,
  address: string
) {
  const accessControlInstance: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    contractAddresses[C.networkName].modules.DIMORegistry
  );

  console.log(`\n----- Granting ${role} role to ${address} -----\n`);

  await (
    await accessControlInstance.connect(deployer).grantRole(role, address)
  ).wait();

  console.log(`\n----- ${role} role granted to ${address} -----\n`);
}

async function mintBatch(deployer: SignerWithAddress) {
  const batchSize = 50;
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    contractAddresses[C.networkName].modules.DIMORegistry
  );

  console.log(`\n----- Minting manufacturers -----\n`);

  for (let i = 0; i < makes.length; i += batchSize) {
    const batch = makes.slice(i, i + batchSize);

    const receipt = await (
      await manufacturerInstance
        .connect(deployer)
        .mintManufacturerBatch(deployer.address, batch)
    ).wait();

    receipt.events
      ?.filter((e: any) => e.event === 'ManufacturerNodeMinted')
      .map((e: any) => e.args.tokenId)
      .forEach((e: any) => {
        console.log(e.toString());
      });
  }

  console.log(`\n----- Manufacturers Minted -----\n`);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const kms: string = C.KmsAddress[C.networkName];

  const instances = await deployModules(deployer);
  writeAddresses(instances, C.networkName);
  const nftInstances = await deployNfts();
  writeAddresses(nftInstances, C.networkName);

  await addModules(deployer);
  await setup(deployer);
  await grantRole(deployer, C.DEFAULT_ADMIN_ROLE, kms);
  await grantNftRoles(deployer);
  await mintBatch(deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
