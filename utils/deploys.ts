import { Wallet } from 'ethers';
import { ethers, upgrades } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { getSelectors, ContractNameArgs } from '.';

export async function initialize(
  deployer: Wallet | SignerWithAddress,
  ...contracts: string[]
): Promise<any[]> {
  const instances: any[] = [];

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

  instances.push(dimoRegistry);

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

    instances.push(
      await ethers.getContractAt(contractName, dimoRegistry.address)
    );
  }

  return instances;
}

export async function deployUpgradeableContracts(
  deployer: Wallet | SignerWithAddress,
  contractNameArgs: ContractNameArgs[]
): Promise<any[]> {
  const instances: any[] = [];

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

    instances.push(contractProxy);
  }

  return instances;
}
