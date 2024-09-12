import * as fs from 'fs';
import * as path from 'path';
import { ethers, network, upgrades } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import { DIMORegistry, DimoAccessControl } from '../typechain-types';
import * as C from './data/deployArgs';
import { getSelectors, AddressesByNetwork, NftArgs } from '../utils';

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
async function upgradeNft(
  deployer: HardhatEthersSigner,
  nftName: string,
  networkName: string,
  forceImport?: boolean
): Promise<AddressesByNetwork> {
  const NftFactory = await ethers.getContractFactory(nftName, deployer);

  const instances = getAddresses();

  const oldProxyAddress = instances[networkName].nfts[nftName].proxy;

  console.log(`\n----- Upgrading ${nftName} NFT -----\n`);

  if (forceImport) {
    const NftFactoryOld = await ethers.getContractFactory(
      `${nftName}Old`,
      deployer,
    );

    await upgrades.forceImport(oldProxyAddress, NftFactoryOld, {
      kind: 'uups',
    });
  }

  await upgrades.validateImplementation(NftFactory, {
    kind: 'uups',
  });
  await upgrades.validateUpgrade(oldProxyAddress, NftFactory, {
    kind: 'uups',
  });

  const upgradedProxy = await upgrades.upgradeProxy(
    oldProxyAddress,
    NftFactory,
    {
      kind: 'uups',
    },
  );

  console.log(`----- NFT ${nftName} upgraded -----`);

  instances[networkName].nfts[nftName].implementation =
    await upgrades.erc1967.getImplementationAddress(
      await upgradedProxy.getAddress(),
    );

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

async function main() {
  // eslint-disable-next-line prefer-const
  let [deployer, user1, nodeOwner] = await ethers.getSigners();
  let networkName = network.name;

  if (
    network.name === 'hardhat' ||
    network.name === 'localhost' ||
    network.name === 'tenderly'
  ) {
    networkName = 'amoy';
    // console.log(deployer.address);

    // 0xCED3c922200559128930180d3f0bfFd4d9f4F123 -> polygon
    // 0x1741eC2915Ab71Fc03492715b5640133dA69420B -> deployer
    // 0x8E58b98d569B0679713273c5105499C249e9bC84 -> amoy

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0x8E58b98d569B0679713273c5105499C249e9bC84'],
    });
    // await network.provider.request({
    //   method: 'hardhat_impersonateAccount',
    //   params: ['0xc0f28da7ae009711026c648913eb17962fd96dd7']
    // });

    deployer = await ethers.getSigner(
      '0x8E58b98d569B0679713273c5105499C249e9bC84',
    );
    nodeOwner = await ethers.getSigner(
      '0xc0f28da7ae009711026c648913eb17962fd96dd7',
    );

    await user1.sendTransaction({
      to: deployer.address,
      value: ethers.parseEther('100'),
    });
    await user1.sendTransaction({
      to: nodeOwner.address,
      value: ethers.parseEther('100'),
    });
  }

  // let instances = getAddresses();

  const instances1 = await updateModule(deployer, 'DevAdmin', networkName);
  writeAddresses(instances1, networkName);

  const instances2 = await updateModule(deployer, 'Manufacturer', networkName);
  writeAddresses(instances2, networkName);

  const nftInstances = await upgradeNft(
    deployer,
    'ManufacturerId',
    networkName,
    true
  );
  writeAddresses(nftInstances, networkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
});
