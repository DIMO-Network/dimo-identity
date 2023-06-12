import { Wallet } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { getSelectors, ContractNameArgs, GenericKeyAny } from '.';

export async function initialize(
  deployer: Wallet | SignerWithAddress,
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
  await dimoRegistryImplementation.deployed();

  const dimoRegistry = await ethers.getContractAt(
    'DIMORegistry',
    dimoRegistryImplementation.address
  );

  const contractSelectors = getSelectors(DIMORegistry.interface);

  await dimoRegistry
    .connect(deployer)
    .addModule(dimoRegistryImplementation.address, contractSelectors);

  instances.DIMORegistry = dimoRegistry;

  for (const contractName of contracts) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      deployer
    ).deploy();
    await contractImplementation.deployed();

    const contractSelectors = getSelectors(ContractFactory.interface);

    await dimoRegistry
      .connect(deployer)
      .addModule(contractImplementation.address, contractSelectors);

    instances[contractName] = await ethers.getContractAt(
      contractName,
      dimoRegistry.address
    );
  }

  return instances;
}

export async function deployUpgradeableContracts(
  deployer: Wallet | SignerWithAddress,
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

    await contractProxy.deployed();

    instances[contractNameArg.name] = contractProxy;
  }

  return instances;
}
