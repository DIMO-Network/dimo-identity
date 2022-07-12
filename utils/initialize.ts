import { Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { getSelectors } from '.';

async function initialize(
  deployer: Wallet | SignerWithAddress,
  constructorArgs: [string, string, string],
  ...contracts: string[]
): Promise<any[]> {
  const instances: any[] = [];

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory('DIMORegistryBetaV1');
  const dimoRegistryImplementation = await DIMORegistry.connect(
    deployer
  ).deploy(...constructorArgs);
  await dimoRegistryImplementation.deployed();

  const dimoRegistry = await ethers.getContractAt(
    'DIMORegistryBetaV1',
    dimoRegistryImplementation.address
  );

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

export { initialize };
