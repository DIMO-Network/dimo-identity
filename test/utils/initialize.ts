import { ethers, waffle } from 'hardhat';

import { C, getSelectors } from './';

const provider = waffle.provider;

const [admin] = provider.getWallets();

async function initialize(contracts: string[]): Promise<any[]> {
  const instances: any[] = [];

  // Deploy DIMORegistry Implementation
  const DIMORegistry = await ethers.getContractFactory('DIMORegistry');
  const dimoRegistryImplementation = await DIMORegistry.connect(admin).deploy(
    C.name,
    C.symbol,
    C.baseURI
  );
  await dimoRegistryImplementation.deployed();

  const dimoRegistry = await ethers.getContractAt(
    'DIMORegistry',
    dimoRegistryImplementation.address
  );

  instances.push(dimoRegistry);

  for (const contractName of contracts) {
    const ContractFactory = await ethers.getContractFactory(contractName);
    const contractImplementation = await ContractFactory.connect(
      admin
    ).deploy();
    await contractImplementation.deployed();

    const contractSelectors = getSelectors(ContractFactory.interface);

    await dimoRegistry
      .connect(admin)
      .addModule(contractImplementation.address, contractSelectors);

    instances.push(
      await ethers.getContractAt(contractName, dimoRegistry.address)
    );
  }

  return instances;
}

export { initialize };
