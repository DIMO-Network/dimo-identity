import * as fs from 'fs';
import * as path from 'path';
import { ethers, network, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DIMORegistry } from '../typechain';
import { getSelectors, AddressesByNetwork } from '../utils';
import addressesJSON from './data/addresses.json';

const contractAddresses: AddressesByNetwork = addressesJSON;

// eslint-disable-next-line no-unused-vars
function writeAddresses(addresses: AddressesByNetwork, networkName: string) {
  console.log('\n----- Writing addresses to file -----\n');

  const currentAddresses: AddressesByNetwork = contractAddresses;
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
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const instances: AddressesByNetwork = JSON.parse(
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
): Promise<AddressesByNetwork> {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  const instances: AddressesByNetwork = JSON.parse(
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
): Promise<AddressesByNetwork> {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  const instances: AddressesByNetwork = JSON.parse(
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
): Promise<AddressesByNetwork> {
  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  const instances: AddressesByNetwork = JSON.parse(
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
): Promise<AddressesByNetwork> {
  const NftFactory = await ethers.getContractFactory(nftName, deployer);

  const instances: AddressesByNetwork = JSON.parse(
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
  let [deployer, user1] = await ethers.getSigners();
  let networkName = network.name;

  if (network.name === 'hardhat' || network.name === 'localhost') {
    networkName = 'mumbai';

    // 0xCED3c922200559128930180d3f0bfFd4d9f4F123
    // 0x1741eC2915Ab71Fc03492715b5640133dA69420B
    deployer = await ethers.getImpersonatedSigner(
      '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
    );

    await user1.sendTransaction({
      to: deployer.address,
      value: ethers.utils.parseEther('100')
    });
  }

  const instances1 = await updateModule(deployer, 'DevAdmin', networkName);
  writeAddresses(instances1, networkName);

  const instances2 = await updateModule(deployer, 'Manufacturer', networkName);
  writeAddresses(instances2, networkName);

  const nftInstances = await upgradeNft(
    deployer,
    'ManufacturerId',
    networkName
  );
  writeAddresses(nftInstances, networkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
