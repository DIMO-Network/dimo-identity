import * as fs from 'fs';
import * as path from 'path';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DIMORegistry } from '../typechain';
import { getSelectors, ContractAddressesByNetwork } from '../utils';
import * as C from './data/deployConstants';
import addressesJSON from './data/addresses.json';

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
  deployer: SignerWithAddress,
  contractNames: string[]
): Promise<ContractAddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const instances: ContractAddressesByNetwork = {
    [C.networkName]: {
      modules: {},
      nfts: {}
    }
  };

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    await contractImplementation.deployed();

    console.log(
      `Contract ${contractName} deployed to ${contractImplementation.address}`
    );

    instances[C.networkName].modules[contractName] =
      contractImplementation.address;
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

async function addModules(
  deployer: SignerWithAddress,
  contractNames: string[]
) {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[C.networkName].modules.DIMORegistry
  );

  const instances = Object.keys(contractAddresses[C.networkName].modules)
    .filter((contractName) => contractNames.includes(contractName))
    .map((contractName) => {
      return {
        name: contractName,
        implementation: contractAddresses[C.networkName].modules[contractName]
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

async function updateModule(
  deployer: SignerWithAddress,
  contractName: string,
  contractSelectorsOld: string[],
  contractAddressOld: string,
  contractAddressNew: string
) {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[C.networkName].modules.DIMORegistry
  );

  console.log('\n----- Updating module -----\n');

  const ContractFactory = await ethers.getContractFactory(contractName);

  const contractSelectorsNew = getSelectors(ContractFactory.interface);

  await (
    await dimoRegistryInstance
      .connect(deployer)
      .updateModule(
        contractAddressOld,
        contractAddressNew,
        contractSelectorsOld,
        contractSelectorsNew
      )
  ).wait();

  console.log(`Module ${contractName} updated`);
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const instances = await deployModules(deployer, [
    'Manufacturer',
    'Vehicle',
    'AftermarketDevice'
  ]);

  writeAddresses(instances, C.networkName);

  await addModules(deployer, ['DevAdmin']);
  await updateModule(
    deployer,
    'Manufacturer',
    [
      '0x50300a3f',
      '0xb429afeb',
      '0x456bf169',
      '0x17efba21',
      '0x9abb3000',
      '0x92eefe9b',
      '0x63545ffa',
      '0x9db2ed9b'
    ],
    '0x884d5809e44cCF47d2EBb87f808736649ABB7eD5',
    '0x7F7a5136db7Ba104B83EF9B8c17697575ee8F5E2'
  );
  await updateModule(
    deployer,
    'Vehicle',
    ['0xf0d1a557', '0x3da44e56', '0x1b1a82c8', '0xd9c3ae61', '0xda647058'],
    '0x5a91d9ED88237C3911D4C646CA0C30Cd89581410',
    '0xFa8E43148E725005aFc324CAF3d30E6d6b417440'
  );
  await updateModule(
    deployer,
    'AftermarketDevice',
    [
      '0x6111afa3',
      '0x89a841bb',
      '0x9796cf22',
      '0x7ba79a39',
      '0xcfe642dd',
      '0xa2160ba4',
      '0x4d13b709',
      '0x4e37122c',
      '0x3f65997a'
    ],
    '0xe40B17BdD7ed644300D724BcD2591cCEe709fE74',
    '0x9f8acFF8E4bf2B5230827C726EFdF88755eB568D'
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
