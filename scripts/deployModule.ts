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
  contractSelectorsOld: string[],
  contractAddressOld: string,
  contractAddressNew: string
) {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[C.networkName].modules.DIMORegistry
  );

  console.log('\n----- Updating modules -----\n');

  const ContractFactory = await ethers.getContractFactory('AdLicenseValidator');

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

  console.log(`Module AdLicenseValidator updated`);

  console.log('\n----- Modules Added -----');
}

async function main() {
  const [deployer] = await ethers.getSigners();

  const instances = await deployModules(deployer, ['DevAdmin']);

  writeAddresses(instances, C.networkName);

  await addModules(deployer, ['DevAdmin']);
  await updateModule(deployer, [], '', '');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
