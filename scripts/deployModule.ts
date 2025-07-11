import * as fs from 'fs';
import * as path from 'path';
import { ethers, network, upgrades } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import { DIMORegistry, DimoAccessControl } from '../typechain-types';
import * as C from './data/deployArgs';
import { getSelectors, AddressesByNetwork, NftArgs } from '../utils';
import { getAccounts } from './helpers';

function getAddresses(): AddressesByNetwork {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'data', 'addresses.json'), 'utf8'),
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function writeAddresses(addresses: AddressesByNetwork, networkName: string) {
  console.log('\n----- Writing addresses to file -----\n');

  const currentAddresses: AddressesByNetwork = addresses;
  currentAddresses[networkName] = addresses[networkName];

  fs.writeFileSync(
    path.resolve(__dirname, 'data', 'addresses.json'),
    JSON.stringify(currentAddresses, null, 4),
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deployModules(
  deployer: HardhatEthersSigner,
  contractNames: string[],
  networkName: string,
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const instances = getAddresses();

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation =
      await ContractFactory.connect(deployer).deploy();

    console.log(
      `Contract ${contractName} deployed to ${await contractImplementation.getAddress()}`,
    );

    instances[networkName].modules[contractName].address =
      await contractImplementation.getAddress();
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deployNfts(
  deployer: HardhatEthersSigner,
  networkName: string,
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying NFT contracts -----\n');

  const currentIntegrationIdArgs: NftArgs = C.integrationIdArgs;
  const currentSdIdArgs: NftArgs = C.sdIdArgs;

  const instances = getAddresses();

  currentIntegrationIdArgs.args = [
    ...C.integrationIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy],
  ];
  currentSdIdArgs.args = [
    ...C.sdIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy],
  ];
  console.log(currentIntegrationIdArgs);
  console.log(currentSdIdArgs);

  for (const contractNameArg of [currentIntegrationIdArgs, currentSdIdArgs]) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name,
      deployer,
    );

    await upgrades.validateImplementation(ContractFactory, {
      kind: 'uups',
    });

    const contractProxy = await upgrades.deployProxy(
      ContractFactory,
      contractNameArg.args,
      {
        initializer: 'initialize',
        kind: 'uups',
      },
    );

    console.log(
      `NFT contract ${contractNameArg.name
      } deployed to ${await contractProxy.getAddress()}`,
    );

    instances[networkName].nfts[contractNameArg.name].proxy =
      await contractProxy.getAddress();
    instances[networkName].nfts[contractNameArg.name].implementation =
      await upgrades.erc1967.getImplementationAddress(
        await contractProxy.getAddress(),
      );
  }

  console.log('\n----- NFT contracts deployed -----');

  return instances;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function addModules(
  deployer: HardhatEthersSigner,
  contractNames: string[],
  networkName: string,
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address,
  );

  const contractsNameImpl = Object.keys(instances[networkName].modules)
    .filter((contractName) => contractNames.includes(contractName))
    .map((contractName) => {
      return {
        name: contractName,
        implementation: instances[networkName].modules[contractName].address,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function removeModule(
  deployer: HardhatEthersSigner,
  contractNames: string[],
  networkName: string,
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address,
  );

  const contractsNameImpl = Object.keys(instances[networkName].modules)
    .filter((contractName) => contractNames.includes(contractName))
    .map((contractName) => {
      return {
        name: contractName,
        implementation: instances[networkName].modules[contractName].address,
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateModule(
  deployer: HardhatEthersSigner,
  contractName: string,
  networkName: string
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address,
  );

  const contractAddressOld =
    instances[networkName].modules[contractName].address;
  const contractSelectorsOld =
    instances[networkName].modules[contractName].selectors;

  console.log(`\n----- Deploying ${contractName} module -----\n`);

  const ContractFactory = await ethers.getContractFactory(contractName);
  const contractImplementation =
    await ContractFactory.connect(deployer).deploy();

  console.log(
    `Contract ${contractName} deployed to ${await contractImplementation.getAddress()}`,
  );

  console.log(`\n----- Updating ${contractName} module -----\n`);

  const contractSelectorsNew = getSelectors(ContractFactory.interface);

  await (
    await dimoRegistryInstance
      .connect(deployer)
      .updateModule(
        contractAddressOld,
        await contractImplementation.getAddress(),
        contractSelectorsOld,
        contractSelectorsNew,
      )
  ).wait();

  console.log(`----- Module ${contractName} updated -----`);

  instances[networkName].modules[contractName].address =
    await contractImplementation.getAddress();
  instances[networkName].modules[contractName].selectors = contractSelectorsNew;

  return instances;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function updateModules2(contractNames: string[], networkName: string) {
  const instances = getAddresses();

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);

    console.log(contractName);
    console.log(
      `Old address ${instances[networkName].modules[contractName].address}`,
    );
    console.log(
      `Old selectors ${JSON.stringify(
        instances[networkName].modules[contractName].selectors,
      )}`,
    );
    console.log(
      `New selectors ${JSON.stringify(
        getSelectors(ContractFactory.interface),
      )}\n`,
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function upgradeContract(
  deployer: HardhatEthersSigner,
  contractName: string,
  contractProxyAddress: string,
  forceImport?: boolean
): Promise<string> {
  const ContractFactory = await ethers.getContractFactory(contractName, deployer);

  console.log(`\n----- Upgrading ${contractName} contract -----\n`);

  if (forceImport) {
    const ContractFactoryOld = await ethers.getContractFactory(
      `${contractName}Old`,
      deployer,
    );

    await upgrades.forceImport(contractProxyAddress, ContractFactoryOld, {
      kind: 'uups',
    });
  }

  await upgrades.validateImplementation(ContractFactory, {
    kind: 'uups',
  });
  await upgrades.validateUpgrade(contractProxyAddress, ContractFactory, {
    kind: 'uups',
  });

  const upgradedProxy = await (await upgrades.upgradeProxy(
    contractProxyAddress,
    ContractFactory,
    {
      kind: 'uups',
    },
  )).waitForDeployment();

  const newImplementationAddress = await upgrades.erc1967.getImplementationAddress(await upgradedProxy.getAddress());
  console.log(`----- Contract ${contractName} upgraded with implementation ${newImplementationAddress} -----`);

  return newImplementationAddress;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function upgradeNft(
  deployer: HardhatEthersSigner,
  nftName: string,
  networkName: string,
  forceImport?: boolean
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const newImplementationAddress = await upgradeContract(
    deployer,
    nftName,
    instances[networkName].nfts[nftName].proxy,
    forceImport
  )

  instances[networkName].nfts[nftName].implementation = newImplementationAddress;

  return instances;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function upgradeDimoForwarder(
  deployer: HardhatEthersSigner,
  networkName: string,
  forceImport?: boolean
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const newImplementationAddress = await upgradeContract(
    deployer,
    'DimoForwarder',
    instances[networkName].misc['DimoForwarder'].proxy,
    forceImport
  )

  instances[networkName].misc['DimoForwarder'].implementation = newImplementationAddress;

  return instances;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function grantNewRoles(
  deployer: HardhatEthersSigner,
  networkName: string,
) {
  const instances = getAddresses();

  const dimoAccessControl: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    instances[networkName].modules.DIMORegistry.address,
  );

  console.log(
    `----- Granting ADMIN_ROLE, MINT_MANUFACTURER_ROLE, SET_MANUFACTURER_INFO_ROLE, SET_AD_INFO_ROLE, MINT_INTEGRATION_ROLE, SET_INTEGRATION_INFO_ROLE, MINT_SD_ROLE, SET_SD_INFO_ROLE, MINT_VEHICLE_ROLE, SET_VEHICLE_INFO_ROLE to Foundation ${instances[networkName].misc.Foundation} -----\n`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.ADMIN_ROLE, instances[networkName].misc.Foundation);
  console.log(
    `ADMIN_ROLE -> ${C.roles.ADMIN_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_MANUFACTURER_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `MINT_MANUFACTURER_ROLE -> ${C.roles.modules.MINT_MANUFACTURER_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_MANUFACTURER_INFO_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `SET_MANUFACTURER_INFO_ROLE -> ${C.roles.modules.SET_MANUFACTURER_INFO_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_INTEGRATION_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `MINT_INTEGRATION_ROLE -> ${C.roles.modules.MINT_INTEGRATION_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_INTEGRATION_INFO_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `SET_INTEGRATION_INFO_ROLE -> ${C.roles.modules.SET_INTEGRATION_INFO_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_AD_INFO_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `SET_AD_INFO_ROLE -> ${C.roles.modules.SET_AD_INFO_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_SD_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `MINT_SD_ROLE -> ${C.roles.modules.MINT_SD_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_SD_INFO_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `SET_SD_INFO_ROLE -> ${C.roles.modules.SET_SD_INFO_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_VEHICLE_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `MINT_VEHICLE_ROLE -> ${C.roles.modules.MINT_VEHICLE_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_VEHICLE_INFO_ROLE,
      instances[networkName].misc.Foundation,
    );
  console.log(
    `SET_VEHICLE_INFO_ROLE -> ${C.roles.modules.SET_VEHICLE_INFO_ROLE} : ${instances[networkName].misc.Foundation}`,
  );
  console.log(
    `\n----- Roles granted to Foundation ${instances[networkName].misc.Foundation} -----`,
  );

  console.log(
    `----- Granting MINT_VEHICLE_SD_ROLE, CLAIM_AD_ROLE, PAIR_AD_ROLE, UNPAIR_AD_ROLE, MINT_SD_ROLE, BURN_SD_ROLE, MINT_VEHICLE_ROLE, BURN_VEHICLE_ROLE to Kms ${instances[networkName].misc.Kms} -----\n`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_VEHICLE_SD_ROLE,
      instances[networkName].misc.Kms,
    );
  console.log(
    `MINT_VEHICLE_SD_ROLE -> ${C.roles.modules.MINT_VEHICLE_SD_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.CLAIM_AD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `CLAIM_AD_ROLE -> ${C.roles.modules.CLAIM_AD_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.PAIR_AD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `PAIR_AD_ROLE -> ${C.roles.modules.PAIR_AD_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.UNPAIR_AD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `UNPAIR_AD_ROLE -> ${C.roles.modules.UNPAIR_AD_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.MINT_SD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `MINT_SD_ROLE -> ${C.roles.modules.MINT_SD_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.BURN_SD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `BURN_SD_ROLE -> ${C.roles.modules.BURN_SD_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_VEHICLE_ROLE,
      instances[networkName].misc.Kms,
    );
  console.log(
    `MINT_VEHICLE_ROLE -> ${C.roles.modules.MINT_VEHICLE_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.BURN_VEHICLE_ROLE,
      instances[networkName].misc.Kms,
    );
  console.log(
    `BURN_VEHICLE_ROLE -> ${C.roles.modules.BURN_VEHICLE_ROLE} : ${instances[networkName].misc.Kms}`,
  );
  console.log(
    `\n----- Roles granted to Kms ${instances[networkName].misc.Kms} -----`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function grantAllRoles(
  deployer: HardhatEthersSigner,
  account: string,
  networkName: string,
) {
  const instances = getAddresses();

  const dimoAccessControl: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    instances[networkName].modules.DIMORegistry.address,
  );

  console.log(`Granting roles to ${account}`);

  console.log(`Granting role ADMIN_ROLE : ${C.roles.ADMIN_ROLE}`);
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.ADMIN_ROLE, account);

  for (const role of Object.entries(C.roles.modules)) {
    console.log(`Granting role ${role[0]} : ${role[1]}`);
    await dimoAccessControl.connect(deployer).grantRole(role[1], account);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deployContract(
  deployer: HardhatEthersSigner,
  contractName: string,
  networkName: string,
  contractType: 'nft' | 'module',
  args: any[] = []
): Promise<AddressesByNetwork> {
  console.log(`\n----- Deploying contract ${contractName} -----\n`);

  const instances = getAddresses();

  const ContractFactory = await ethers.getContractFactory(contractName);
  const contractImplementation = await ContractFactory.connect(deployer).deploy(...args);

  await contractImplementation.waitForDeployment();

  const implementationAddress = await contractImplementation.getAddress();

  console.log(
    `Contract ${contractName} deployed to ${implementationAddress}`
  );

  if (contractType === 'nft') {
    instances[networkName].nfts[contractName].implementation = implementationAddress;
  } else if (contractType === 'module') {
    instances[networkName].modules[contractName].address = implementationAddress;
  } else {
    throw new Error('Invalid contract type. Must be either "nft" or "module".');
  }

  console.log(`\n----- Contract ${contractName} deployed -----`);

  return instances;
}

async function main(networkFlag?: string) {
  const forkNetworkName = 'polygon'
  const [signer] = await getAccounts(network.name, forkNetworkName)
  
  const instances1 = await updateModule(signer, 'DevAdmin', forkNetworkName);
  writeAddresses(instances1, forkNetworkName);

  const instances2 = await updateModule(signer, 'Manufacturer', forkNetworkName);
  writeAddresses(instances2, forkNetworkName);

  const nftInstances = await upgradeNft(
    signer,
    'ManufacturerId',
    forkNetworkName,
    true
  );
  writeAddresses(nftInstances, forkNetworkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
});
