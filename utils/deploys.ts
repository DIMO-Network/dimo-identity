import { Wallet } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import type { DIMORegistry } from '../typechain-types';
import { getSelectors, ContractNameArgs, GenericKeyAny } from '.';

export async function initialize(
  deployer: Wallet | HardhatEthersSigner,
  ...contracts: string[]
): Promise<GenericKeyAny> {
  const instances: GenericKeyAny = {};

  if (contracts.length === 0) {
    return instances;
  }

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory('DIMORegistry');
  const dimoRegistryImplementation = await DIMORegistry.connect(
    deployer
  ).deploy();
  // await dimoRegistryImplementation.deployed();

  const dimoRegistry = await ethers.getContractAt(
    'DIMORegistry',
    await dimoRegistryImplementation.getAddress()
  ) as DIMORegistry;
  
  const contractSelectors = getSelectors(dimoRegistry.interface);

  await dimoRegistry
    .connect(deployer)
    .addModule(dimoRegistryImplementation.getAddress(), contractSelectors);

  instances.DIMORegistry = dimoRegistry;

  for (const contractName of contracts) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    // await contractImplementation.deployed();

    const contractSelectors = getSelectors(ContractFactory.interface);

    await dimoRegistry
      .connect(deployer)
      .addModule(contractImplementation.getAddress(), contractSelectors);

    instances[contractName] = await ethers.getContractAt(
      contractName,
      await dimoRegistry.getAddress()
    );
  }

  return instances;
}

export async function deployUpgradeableContracts(
  deployer: Wallet | HardhatEthersSigner,
  contractNameArgs: ContractNameArgs[]
): Promise<GenericKeyAny> {
  const instances: GenericKeyAny = {};

  for (const contractNameArg of contractNameArgs) {
    const ContractFactory = await ethers.getContractFactory(
      contractNameArg.name,
      deployer
    );

    await upgrades.validateImplementation(ContractFactory, {
      kind: contractNameArg.opts.kind
    });

    const contractProxy = await upgrades.deployProxy(
      ContractFactory,
      contractNameArg.args,
      contractNameArg.opts
    );

    instances[contractNameArg.name] = contractProxy;
  }

  return instances;
}
