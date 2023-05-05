import * as fs from 'fs';
import * as path from 'path';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DIMORegistry } from '../typechain';
import { getSelectors, ContractAddressesByNetwork } from '../utils';
import * as C from './data/deployArgs';
import addressesJSON from './data/addresses.json';

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
async function deployModules(
  deployer: SignerWithAddress,
  contractNames: string[],
  networkName: string
): Promise<ContractAddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const instances: ContractAddressesByNetwork = JSON.parse(
    JSON.stringify(contractAddresses)
  );

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    await contractImplementation.deployed();

    console.log(
      `Contract ${contractName} deployed to ${contractImplementation.address}`
    );

    instances[networkName].modules[contractName].address =
      contractImplementation.address;
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

// eslint-disable-next-line no-unused-vars
async function addModules(
  deployer: SignerWithAddress,
  contractNames: string[],
  networkName: string
): Promise<ContractAddressesByNetwork> {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  const instances: ContractAddressesByNetwork = JSON.parse(
    JSON.stringify(contractAddresses)
  );

  const contractsNameImpl = Object.keys(contractAddresses[networkName].modules)
    .filter((contractName) => contractNames.includes(contractName))
    .map((contractName) => {
      return {
        name: contractName,
        implementation:
          contractAddresses[networkName].modules[contractName].address
      };
    });

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

// eslint-disable-next-line no-unused-vars
async function removeModule(
  deployer: SignerWithAddress,
  contractNames: string[],
  networkName: string
): Promise<ContractAddressesByNetwork> {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  const instances: ContractAddressesByNetwork = JSON.parse(
    JSON.stringify(contractAddresses)
  );

  const contractsNameImpl = Object.keys(contractAddresses[networkName].modules)
    .filter((contractName) => contractNames.includes(contractName))
    .map((contractName) => {
      return {
        name: contractName,
        implementation:
          contractAddresses[networkName].modules[contractName].address
      };
    });

  console.log('\n----- Removing modules -----\n');

  for (const contract of contractsNameImpl) {
    const ContractFactory = await ethers.getContractFactory(contract.name);

    const contractSelectors = getSelectors(ContractFactory.interface);

    await (
      await dimoRegistryInstance
        .connect(deployer)
        .removeModule(contract.implementation, contractSelectors)
    ).wait();

    instances[networkName].modules[contract.name].selectors = contractSelectors;

    console.log(`Module ${contract.name} removed`);
  }

  console.log('\n----- Modules Removed -----');

  return instances;
}

// eslint-disable-next-line no-unused-vars
async function updateModule(
  deployer: SignerWithAddress,
  contractName: string,
  networkName: string
): Promise<ContractAddressesByNetwork> {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  const instances: ContractAddressesByNetwork = JSON.parse(
    JSON.stringify(contractAddresses)
  );

  const contractAddressOld =
    instances[networkName].modules[contractName].address;
  const contractSelectorsOld =
    instances[networkName].modules[contractName].selectors;

  console.log(`\n----- Deploying ${contractName} module -----\n`);

  const ContractFactory = await ethers.getContractFactory(contractName);
  const contractImplementation = await ContractFactory.connect(
    deployer
  ).deploy();
  await contractImplementation.deployed();

  console.log(
    `Contract ${contractName} deployed to ${contractImplementation.address}`
  );

  console.log(`\n----- Updating ${contractName} module -----\n`);

  const contractSelectorsNew = getSelectors(ContractFactory.interface);

  await (
    await dimoRegistryInstance
      .connect(deployer)
      .updateModule(
        contractAddressOld,
        contractImplementation.address,
        contractSelectorsOld,
        contractSelectorsNew
      )
  ).wait();

  console.log(`----- Module ${contractName} updated -----`);

  instances[networkName].modules[contractName].address =
    contractImplementation.address;
  instances[networkName].modules[contractName].selectors = contractSelectorsNew;

  return instances;
}

// eslint-disable-next-line no-unused-vars
async function upgradeNft(
  deployer: SignerWithAddress,
  nftName: string,
  networkName: string
): Promise<ContractAddressesByNetwork> {
  const NftFactory = await ethers.getContractFactory(nftName, deployer);

  const instances: ContractAddressesByNetwork = JSON.parse(
    JSON.stringify(contractAddresses)
  );

  const oldProxyAddress = instances[networkName].nfts[nftName].proxy;

  console.log('\n----- Upgrading NFT -----\n');

  await upgrades.validateImplementation(NftFactory, {
    kind: 'uups'
  });
  await upgrades.validateUpgrade(oldProxyAddress, NftFactory, {
    kind: 'uups'
  });

  const upgradedProxy = await upgrades.upgradeProxy(
    oldProxyAddress,
    NftFactory,
    {
      kind: 'uups'
    }
  );
  await upgradedProxy.deployed();

  console.log(`----- NFT ${nftName} upgraded -----`);

  instances[networkName].nfts[nftName].implementation =
    await upgrades.erc1967.getImplementationAddress(upgradedProxy.address);

  return instances;
}

async function main() {
  const [deployer] = await ethers.getSigners();

  // const deployer = await ethers.getImpersonatedSigner(
  //   '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  // );

  const instances1 = await updateModule(deployer, 'DevAdmin', C.networkName);
  writeAddresses(instances1, C.networkName);

  const instances2 = await updateModule(
    deployer,
    'Manufacturer',
    C.networkName
  );
  writeAddresses(instances2, C.networkName);

  const nftInstances = await upgradeNft(
    deployer,
    'ManufacturerId',
    C.networkName
  );
  writeAddresses(nftInstances, C.networkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
