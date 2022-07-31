import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DIMORegistry } from '../typechain';
import { attributes, manufacturerLabels } from './data';

let dimoRegistry: DIMORegistry;

async function deploy(admin: SignerWithAddress) {
  console.log('\n----- Deploying DIMORegistry -----');
  const DimoRegistryFactory = await ethers.getContractFactory('DIMORegistry');
  dimoRegistry = await DimoRegistryFactory.connect(admin).deploy();

  await dimoRegistry.deployed();

  console.log('DIMORegistry deployed to:', dimoRegistry.address);
}

async function mintManufacturers(
  admin: SignerWithAddress,
  controllers: SignerWithAddress[]
) {
  console.log('\n----- Minting manufacturers -----');
  for (let i = 0; i < controllers.length; i++) {
    await (
      await dimoRegistry
        .connect(admin)
        .mintManufacturerByOwner(manufacturerLabels[i], controllers[i].address)
    ).wait();

    console.log(
      `Manufacturer ${manufacturerLabels[i]} minted with controller ${controllers[i].address}`
    );
  }
}

async function addAttributes(admin: SignerWithAddress) {
  console.log('\n----- Adding attributes -----');
  for (const attribute of attributes) {
    await (await dimoRegistry.connect(admin).addAttribute(attribute)).wait();

    console.log(`Attribute ${attribute} added`);
  }
}

async function main() {
  const signers = await ethers.getSigners();

  const admin = signers[0];
  const controllers = signers.slice(1, 4);

  await deploy(admin);
  await mintManufacturers(admin, controllers);
  await addAttributes(admin);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
