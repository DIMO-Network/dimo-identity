import * as fs from 'fs';
import * as path from 'path';
import { ethers, network, upgrades, HardhatEthersSigner } from 'hardhat';

import {
  DIMORegistry,
  DimoAccessControl,
  Integration,
  SyntheticDevice,
  ManufacturerId,
  VehicleId,
  AftermarketDeviceId,
  IntegrationId,
  SyntheticDeviceId
} from '../typechain-types';
import * as C from './data/deployArgs';
import { integrations } from './data/Integrations';
import { getSelectors, AddressesByNetwork, NftArgs } from '../utils';

function getAddresses(): AddressesByNetwork {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'data', 'addresses.json'), 'utf8')
  );
}

// eslint-disable-next-line no-unused-vars
function writeAddresses(addresses: AddressesByNetwork, networkName: string) {
  console.log('\n----- Writing addresses to file -----\n');

  const currentAddresses: AddressesByNetwork = addresses;
  currentAddresses[networkName] = addresses[networkName];

  fs.writeFileSync(
    path.resolve(__dirname, 'data', 'addresses.json'),
    JSON.stringify(currentAddresses, null, 4)
  );
}

// eslint-disable-next-line no-unused-vars
async function deployModules(
  deployer: HardhatEthersSigner,
  contractNames: string[],
  networkName: string
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying contracts -----\n');

  const instances = getAddresses();

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    await contractImplementation.deployed();

    console.log(
      `Contract ${contractName} deployed to ${await contractImplementation.getAddress()}`
    );

    instances[networkName].modules[contractName].address =
      await contractImplementation.getAddress();
  }

  console.log('\n----- Contracts deployed -----');

  return instances;
}

// eslint-disable-next-line no-unused-vars
async function deployNfts(
  deployer: HardhatEthersSigner,
  networkName: string
): Promise<AddressesByNetwork> {
  console.log('\n----- Deploying NFT contracts -----\n');

  const currentIntegrationIdArgs: NftArgs = C.integrationIdArgs;
  const currentSdIdArgs: NftArgs = C.sdIdArgs;

  const instances = getAddresses();

  currentIntegrationIdArgs.args = [
    ...C.integrationIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy]
  ];
  currentSdIdArgs.args = [
    ...C.sdIdArgs.args,
    instances[networkName].modules.DIMORegistry.address,
    [instances[networkName].misc.DimoForwarder.proxy]
  ];
  console.log(currentIntegrationIdArgs);
  console.log(currentSdIdArgs);

  for (const contractNameArg of [currentIntegrationIdArgs, currentSdIdArgs]) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name,
      deployer
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
      `NFT contract ${contractNameArg.name} deployed to ${await contractProxy.getAddress()}`
    );

    instances[networkName].nfts[contractNameArg.name].proxy =
      await contractProxy.getAddress();
    instances[networkName].nfts[contractNameArg.name].implementation =
      await upgrades.erc1967.getImplementationAddress(await contractProxy.getAddress());
  }

  console.log('\n----- NFT contracts deployed -----');

  return instances;
}

// eslint-disable-next-line no-unused-vars
async function addModules(
  deployer: HardhatEthersSigner,
  contractNames: string[],
  networkName: string
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address
  );

  const contractsNameImpl = Object.keys(instances[networkName].modules)
    .filter((contractName) => contractNames.includes(contractName))
    .map((contractName) => {
      return {
        name: contractName,
        implementation: instances[networkName].modules[contractName].address
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
  deployer: HardhatEthersSigner,
  contractNames: string[],
  networkName: string
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address
  );

  const contractsNameImpl = Object.keys(instances[networkName].modules)
    .filter((contractName) => contractNames.includes(contractName))
    .map((contractName) => {
      return {
        name: contractName,
        implementation: instances[networkName].modules[contractName].address
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
  deployer: HardhatEthersSigner,
  contractName: string,
  networkName: string
): Promise<AddressesByNetwork> {
  const instances = getAddresses();

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    instances[networkName].modules.DIMORegistry.address
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

  console.log(
    `Contract ${contractName} deployed to ${await contractImplementation.getAddress()}`
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
        contractSelectorsNew
      )
  ).wait();

  console.log(`----- Module ${contractName} updated -----`);

  instances[networkName].modules[contractName].address =
    await contractImplementation.getAddress();
  instances[networkName].modules[contractName].selectors = contractSelectorsNew;

  return instances;
}

// eslint-disable-next-line no-unused-vars
async function updateModules2(contractNames: string[], networkName: string) {
  const instances = getAddresses();

  for (const contractName of contractNames) {
    const ContractFactory = await ethers.getContractFactory(contractName);

    console.log(contractName);
    console.log(
      `Old address ${instances[networkName].modules[contractName].address}`
    );
    console.log(
      `Old selectors ${JSON.stringify(
        instances[networkName].modules[contractName].selectors
      )}`
    );
    console.log(
      `New selectors ${JSON.stringify(
        getSelectors(ContractFactory.interface)
      )}\n`
    );
  }
}

// eslint-disable-next-line no-unused-vars
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
      deployer
    );

    await upgrades.forceImport(oldProxyAddress, NftFactoryOld, {
      kind: 'uups'
    });
  }

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
    await upgrades.erc1967.getImplementationAddress(await upgradedProxy.getAddress());

  return instances;
}

// eslint-disable-next-line no-unused-vars
async function grantNewRoles(deployer: HardhatEthersSigner, networkName: string) {
  const instances = getAddresses();

  const dimoAccessControl: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    instances[networkName].modules.DIMORegistry.address
  );

  console.log(
    `----- Granting ADMIN_ROLE, MINT_MANUFACTURER_ROLE, SET_MANUFACTURER_INFO_ROLE, SET_AD_INFO_ROLE, MINT_INTEGRATION_ROLE, SET_INTEGRATION_INFO_ROLE, MINT_SD_ROLE, SET_SD_INFO_ROLE, MINT_VEHICLE_ROLE, SET_VEHICLE_INFO_ROLE to Foundation ${instances[networkName].misc.Foundation} -----\n`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.ADMIN_ROLE, instances[networkName].misc.Foundation);
  console.log(
    `ADMIN_ROLE -> ${C.roles.ADMIN_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_MANUFACTURER_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `MINT_MANUFACTURER_ROLE -> ${C.roles.modules.MINT_MANUFACTURER_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_MANUFACTURER_INFO_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `SET_MANUFACTURER_INFO_ROLE -> ${C.roles.modules.SET_MANUFACTURER_INFO_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_INTEGRATION_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `MINT_INTEGRATION_ROLE -> ${C.roles.modules.MINT_INTEGRATION_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_INTEGRATION_INFO_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `SET_INTEGRATION_INFO_ROLE -> ${C.roles.modules.SET_INTEGRATION_INFO_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_AD_INFO_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `SET_AD_INFO_ROLE -> ${C.roles.modules.SET_AD_INFO_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_SD_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `MINT_SD_ROLE -> ${C.roles.modules.MINT_SD_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_SD_INFO_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `SET_SD_INFO_ROLE -> ${C.roles.modules.SET_SD_INFO_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_VEHICLE_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `MINT_VEHICLE_ROLE -> ${C.roles.modules.MINT_VEHICLE_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.SET_VEHICLE_INFO_ROLE,
      instances[networkName].misc.Foundation
    );
  console.log(
    `SET_VEHICLE_INFO_ROLE -> ${C.roles.modules.SET_VEHICLE_INFO_ROLE} : ${instances[networkName].misc.Foundation}`
  );
  console.log(
    `\n----- Roles granted to Foundation ${instances[networkName].misc.Foundation} -----`
  );

  console.log(
    `----- Granting MINT_VEHICLE_SD_ROLE, CLAIM_AD_ROLE, PAIR_AD_ROLE, UNPAIR_AD_ROLE, MINT_SD_ROLE, BURN_SD_ROLE, MINT_VEHICLE_ROLE, BURN_VEHICLE_ROLE to Kms ${instances[networkName].misc.Kms} -----\n`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_VEHICLE_SD_ROLE,
      instances[networkName].misc.Kms
    );
  console.log(
    `MINT_VEHICLE_SD_ROLE -> ${C.roles.modules.MINT_VEHICLE_SD_ROLE} : ${instances[networkName].misc.Kms}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.CLAIM_AD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `CLAIM_AD_ROLE -> ${C.roles.modules.CLAIM_AD_ROLE} : ${instances[networkName].misc.Kms}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.PAIR_AD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `PAIR_AD_ROLE -> ${C.roles.modules.PAIR_AD_ROLE} : ${instances[networkName].misc.Kms}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.UNPAIR_AD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `UNPAIR_AD_ROLE -> ${C.roles.modules.UNPAIR_AD_ROLE} : ${instances[networkName].misc.Kms}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.MINT_SD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `MINT_SD_ROLE -> ${C.roles.modules.MINT_SD_ROLE} : ${instances[networkName].misc.Kms}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(C.roles.modules.BURN_SD_ROLE, instances[networkName].misc.Kms);
  console.log(
    `BURN_SD_ROLE -> ${C.roles.modules.BURN_SD_ROLE} : ${instances[networkName].misc.Kms}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.MINT_VEHICLE_ROLE,
      instances[networkName].misc.Kms
    );
  console.log(
    `MINT_VEHICLE_ROLE -> ${C.roles.modules.MINT_VEHICLE_ROLE} : ${instances[networkName].misc.Kms}`
  );
  await dimoAccessControl
    .connect(deployer)
    .grantRole(
      C.roles.modules.BURN_VEHICLE_ROLE,
      instances[networkName].misc.Kms
    );
  console.log(
    `BURN_VEHICLE_ROLE -> ${C.roles.modules.BURN_VEHICLE_ROLE} : ${instances[networkName].misc.Kms}`
  );
  console.log(
    `\n----- Roles granted to Kms ${instances[networkName].misc.Kms} -----`
  );
}

async function grantAllRoles(
  deployer: HardhatEthersSigner,
  account: string,
  networkName: string
) {
  const instances = getAddresses();

  const dimoAccessControl: DimoAccessControl = await ethers.getContractAt(
    'DimoAccessControl',
    instances[networkName].modules.DIMORegistry.address
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
  let [deployer, user1, nodeOwner] = await ethers.getSigners();
  let networkName = network.name;

  if (
    network.name === 'hardhat' ||
    network.name === 'localhost' ||
    network.name === 'tenderly'
  ) {
    networkName = 'polygon';
    // console.log(deployer.address);

    // 0xCED3c922200559128930180d3f0bfFd4d9f4F123
    // 0x1741eC2915Ab71Fc03492715b5640133dA69420B
    // deployer = await ethers.getImpersonatedSigner(
    //   '0xCED3c922200559128930180d3f0bfFd4d9f4F123'
    // );

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0xCED3c922200559128930180d3f0bfFd4d9f4F123']
    });
    // await network.provider.request({
    //   method: 'hardhat_impersonateAccount',
    //   params: ['0xc0f28da7ae009711026c648913eb17962fd96dd7']
    // });

    deployer = await ethers.getSigner(
      '0xCED3c922200559128930180d3f0bfFd4d9f4F123'
    );
    nodeOwner = await ethers.getSigner(
      '0xc0f28da7ae009711026c648913eb17962fd96dd7'
    );

    await user1.sendTransaction({
      to: deployer.address,
      value: ethers.parseEther('100')
    });
    await user1.sendTransaction({
      to: nodeOwner.address,
      value: ethers.parseEther('100')
    });
  }

  let instances = getAddresses();

  const dimoRegistryAddress =
    instances[networkName].modules.DIMORegistry.address;

  /// ----- START REAL DEPLOYMENT --------

  // console.log('To be added');

  // await updateModules2(
  //   ['Integration', 'SyntheticDevice', 'BaseDataURI', 'MultipleMinter'],
  //   networkName
  // );

  // console.log('To be updated');

  // await updateModules2(
  //   [
  //     'Eip712Checker',
  //     'Nodes',
  //     'Manufacturer',
  //     'Vehicle',
  //     'AftermarketDevice',
  //     'AdLicenseValidator',
  //     'Mapper'
  //   ],
  //   networkName
  // );

  /// ----- END REAL DEPLOYMENT --------

  // await grantNewRoles(deployer, networkName);

  // let manufacturerIdInstance: ManufacturerId = await ethers.getContractAt(
  //   'ManufacturerId',
  //   instances[networkName].nfts.ManufacturerId.proxy
  // );

  // console.log(await manufacturerIdInstance.privilegeRecord(1));
  // console.log(await manufacturerIdInstance.privilegeRecord(2));

  // /// ----- START of modules update

  // const eip712CheckerUpdated = await updateModule(
  //   deployer,
  //   'Eip712Checker',
  //   networkName
  // );
  // writeAddresses(eip712CheckerUpdated, networkName);

  // const nodesUpdated = await updateModule(deployer, 'Nodes', networkName);
  // writeAddresses(nodesUpdated, networkName);

  // const manufacturerUpdated = await updateModule(
  //   deployer,
  //   'Manufacturer',
  //   networkName
  // );
  // writeAddresses(manufacturerUpdated, networkName);

  // const vehicleUpdated = await updateModule(deployer, 'Vehicle', networkName);
  // writeAddresses(vehicleUpdated, networkName);

  // const adUpdated = await updateModule(
  //   deployer,
  //   'AftermarketDevice',
  //   networkName
  // );
  // writeAddresses(adUpdated, networkName);

  // const adLicenseValidatorUpdated = await updateModule(
  //   deployer,
  //   'AdLicenseValidator',
  //   networkName
  // );
  // writeAddresses(adLicenseValidatorUpdated, networkName);

  // const mapperUpdated = await updateModule(deployer, 'Mapper', networkName);
  // writeAddresses(mapperUpdated, networkName);

  // /// ----- END of modules update

  // const instancesDeployed = await deployModules(
  //   deployer,
  //   ['Nodes'],
  //   networkName
  // );
  // writeAddresses(instancesDeployed, networkName);

  // const instancesAdded = await addModules(
  //   deployer,
  //   ['Integration', 'SyntheticDevice', 'BaseDataURI', 'MultipleMinter'],
  //   networkName
  // );
  // writeAddresses(instancesAdded, networkName);

  // const deployedNfts = await deployNfts(deployer, networkName);
  // writeAddresses(deployedNfts, networkName);

  instances = getAddresses();

  const integrationInstance: Integration = await ethers.getContractAt(
    'Integration',
    instances[networkName].modules.DIMORegistry.address
  );
  const sdInstance: SyntheticDevice = await ethers.getContractAt(
    'SyntheticDevice',
    instances[networkName].modules.DIMORegistry.address
  );
  const integrationIdInstance: IntegrationId = await ethers.getContractAt(
    'IntegrationId',
    instances[networkName].nfts.IntegrationId.proxy
  );
  const sdIdInstance: SyntheticDeviceId = await ethers.getContractAt(
    'SyntheticDeviceId',
    instances[networkName].nfts.SyntheticDeviceId.proxy
  );

  // console.log('Setting Integration ID proxy address');
  // await integrationInstance
  //   .connect(deployer)
  //   .setIntegrationIdProxyAddress(
  //     instances[networkName].nfts.IntegrationId.proxy
  //   );
  // console.log('Integration ID proxy address set\n');

  // console.log('Setting Synthetic Device ID proxy address');
  // await sdInstance
  //   .connect(deployer)
  //   .setSyntheticDeviceIdProxyAddress(
  //     instances[networkName].nfts.SyntheticDeviceId.proxy
  //   );
  // console.log('Synthetic Device ID proxy address set\n');

  // console.log('Granting Integration ID DEFAULT_ADMIN_ROLE to Foundation');
  // await (
  //   await integrationIdInstance
  //     .connect(deployer)
  //     .grantRole(
  //       C.roles.DEFAULT_ADMIN_ROLE,
  //       instances[networkName].misc.Foundation
  //     )
  // ).wait();
  // console.log('Integration ID DEFAULT_ADMIN_ROLE granted');
  // console.log('Granting Synthetic Device ID DEFAULT_ADMIN_ROLE to Foundation');
  // await (
  //   await sdIdInstance
  //     .connect(deployer)
  //     .grantRole(
  //       C.roles.DEFAULT_ADMIN_ROLE,
  //       instances[networkName].misc.Foundation
  //     )
  // ).wait();
  // console.log('Synthetic Device ID DEFAULT_ADMIN_ROLE granted');

  // console.log('Granting Integration ID UPGRADER_ROLE to Foundation');
  // await (
  //   await integrationIdInstance
  //     .connect(deployer)
  //     .grantRole(
  //       C.roles.nfts.UPGRADER_ROLE,
  //       instances[networkName].misc.Foundation
  //     )
  // ).wait();
  // console.log('Integration ID UPGRADER_ROLE granted');
  // console.log('Granting Synthetic Device ID UPGRADER_ROLE to Foundation');
  // await (
  //   await sdIdInstance
  //     .connect(deployer)
  //     .grantRole(
  //       C.roles.nfts.UPGRADER_ROLE,
  //       instances[networkName].misc.Foundation
  //     )
  // ).wait();
  // console.log('Synthetic Device ID UPGRADER_ROLE granted');

  // console.log('Granting Integration ID ADMIN_ROLE to Foundation');
  // await (
  //   await integrationIdInstance
  //     .connect(deployer)
  //     .grantRole(C.roles.ADMIN_ROLE, instances[networkName].misc.Foundation)
  // ).wait();
  // console.log('Integration ID ADMIN_ROLE granted');
  // console.log('Granting Synthetic Device ID ADMIN_ROLE to Foundation');
  // await (
  //   await sdIdInstance
  //     .connect(deployer)
  //     .grantRole(C.roles.ADMIN_ROLE, instances[networkName].misc.Foundation)
  // ).wait();
  // console.log('Synthetic Device ID ADMIN_ROLE granted');

  // console.log('Granting Integration ID minter role to DIMORegistry');
  // await (
  //   await integrationIdInstance
  //     .connect(deployer)
  //     .grantRole(C.roles.nfts.MINTER_ROLE, dimoRegistryAddress)
  // ).wait();
  // console.log('Integration ID minter role granted');
  // console.log('Granting Synthetic Device ID minter role to DIMORegistry');
  // await (
  //   await sdIdInstance
  //     .connect(deployer)
  //     .grantRole(C.roles.nfts.MINTER_ROLE, dimoRegistryAddress)
  // ).wait();
  // console.log('Synthetic Device ID minter role granted');
  // console.log('Granting Synthetic Device ID burner role to DIMORegistry');
  // await (
  //   await sdIdInstance
  //     .connect(deployer)
  //     .grantRole(C.roles.nfts.BURNER_ROLE, dimoRegistryAddress)
  // ).wait();
  // console.log('Synthetic Device ID burner role granted');

  // console.log(`\n----- Minting integrations -----\n`);
  // const receipt = await (
  //   await integrationInstance
  //     .connect(deployer)
  //     .mintIntegrationBatch(deployer.address, integrations)
  // ).wait();

  // const ids = receipt.events
  //   ?.filter((e: any) => e.event === 'IntegrationNodeMinted')
  //   .map((e: any) => e.args.tokenId);

  // console.log(`Minted ids: ${ids?.join(',')}`);
  // console.log(`\n----- Integrations minted -----\n`);

  const manufacturerIdInstance = await ethers.getContractAt(
    'ManufacturerId',
    instances[networkName].nfts.ManufacturerId.proxy
  );
  const vehicleIdInstance = await ethers.getContractAt(
    'VehicleId',
    instances[networkName].nfts.VehicleId.proxy
  );
  const adIdInstance = await ethers.getContractAt(
    'AftermarketDeviceId',
    instances[networkName].nfts.AftermarketDeviceId.proxy
  );

  console.log(await manufacturerIdInstance.name());
  console.log(await vehicleIdInstance.name());
  console.log(await adIdInstance.name());

  const vehicleInstance = await ethers.getContractAt(
    'Vehicle',
    instances[networkName].modules.DIMORegistry.address
  );
  const adInstance = await ethers.getContractAt(
    'AftermarketDevice',
    instances[networkName].modules.DIMORegistry.address
  );

  await vehicleInstance.connect(deployer).addVehicleAttribute('DataURI');
  await vehicleInstance.connect(deployer).addVehicleAttribute('DefinitionURI');
  await adInstance
    .connect(deployer)
    .addAftermarketDeviceAttribute('DefinitionURI');

  // const manufacturerIdUpgraded = await upgradeNft(
  //   deployer,
  //   'ManufacturerId',
  //   networkName,
  //   true
  // );
  // writeAddresses(manufacturerIdUpgraded, networkName);
  // const vehicleIdUpgraded = await upgradeNft(
  //   deployer,
  //   'VehicleId',
  //   networkName,
  //   true
  // );
  // writeAddresses(vehicleIdUpgraded, networkName);
  // const adIdUpgraded = await upgradeNft(
  //   deployer,
  //   'AftermarketDeviceId',
  //   networkName,
  //   true
  // );
  // writeAddresses(adIdUpgraded, networkName);

  // await manufacturerIdInstance.setName('DIMO Manufacturer ID');
  // await vehicleIdInstance.setName('DIMO Vehicle ID');
  // await adIdInstance.setName('DIMO Aftermarket Device ID');

  // console.log(await manufacturerIdInstance.name());
  // console.log(await vehicleIdInstance.name());
  // console.log(await adIdInstance.name());

  // // MUMBAI
  // await manufacturerIdInstance
  //   .connect(deployer)
  //   .upgradeTo('0xE792a7bfF15FF6E5c1169Ef1253f338a4915dcEc');
  // await vehicleIdInstance
  //   .connect(deployer)
  //   .upgradeTo('0x42645A114330fac1f29444BAEC30EB1c33AdC9d3');
  // await adIdInstance
  //   .connect(deployer)
  //   .upgradeTo('0x56E82e4F58dF50E55364cE77c4CDa48b23c56AB6');

  // // POLYGON
  // await manufacturerIdInstance
  //   .connect(deployer)
  //   .upgradeTo('0x9dAbfAB72049809C2b702892edbe8eF6Ad59d1f9');
  // await vehicleIdInstance
  //   .connect(deployer)
  //   .upgradeTo('0x96198B0969ae01D5E8E6A2950772D92a5799635F');
  // await adIdInstance
  //   .connect(deployer)
  //   .upgradeTo('0x0793530DC7c5018388AcEf0A359C51138e7ff5A7');

  // await manufacturerIdInstance.setName('DIMO Manufacturer ID');
  // await vehicleIdInstance.setName('DIMO Vehicle ID');
  // await adIdInstance.setName('DIMO Aftermarket Device ID');

  // const manufacturerIdInstance = await ethers.getContractAt(
  //   'ManufacturerId',
  //   instances[networkName].nfts.ManufacturerId.proxy
  // );

  // console.log(await manufacturerIdInstance.privilegeRecord(1));
  // console.log(await manufacturerIdInstance.privilegeRecord(2));
  // console.log(
  //   await manufacturerIdInstance.privilegeExpiresAt(
  //     137,
  //     2,
  //     '0x1FEf0Af90412993e9eBce447F32D6c4Ca46D1331'
  //   )
  // );

  // await (
  //   await manufacturerIdInstance
  //     .connect(nodeOwner)
  //     .setPrivilege(
  //       137,
  //       2,
  //       '0x1FEf0Af90412993e9eBce447F32D6c4Ca46D1331',
  //       '1719755725'
  //     )
  // ).wait();

  // console.log(
  //   await manufacturerIdInstance.privilegeExpiresAt(
  //     137,
  //     2,
  //     '0x1FEf0Af90412993e9eBce447F32D6c4Ca46D1331'
  //   )
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
