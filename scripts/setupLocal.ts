import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { DIMORegistry } from '../typechain';
import { attributes, rootLabels } from './data';

let dimoRegistry: DIMORegistry;

async function deploy(admin: SignerWithAddress) {
  console.log('\n----- Deploying DIMORegistry -----');
  const baseUri = 'https://tokenuri.dimo.ngrok.io/nft/';
  const contractMetadataUri =
    'https://tokenuri.dimo.ngrok.io/nft/metadata.json';
  const DimoRegistryFactory = await ethers.getContractFactory('DIMORegistry');
  dimoRegistry = await DimoRegistryFactory.connect(admin).deploy();

  await dimoRegistry.deployed();
  console.log('DIMORegistry deployed to:', dimoRegistry.address);

  console.log('\n----- Setting DIMORegistry Metadata URIs -----');
  await dimoRegistry.setBaseURI(baseUri);
  await dimoRegistry.setContractMetadataURI(contractMetadataUri);
  console.log('DIMORegistry base URI set to:', baseUri);
  console.log(
    'DIMORegistry contract metadata URI set to:',
    contractMetadataUri
  );
}

async function mintRoots(
  admin: SignerWithAddress,
  controllers: SignerWithAddress[]
) {
  console.log('\n----- Minting roots -----');
  for (let i = 0; i < controllers.length; i++) {
    await (
      await dimoRegistry
        .connect(admin)
        .mintRootByOwner(rootLabels[i], controllers[i].address)
    ).wait();

    console.log(
      `Root ${rootLabels[i]} minted with controller ${controllers[i].address}`
    );
  }
}

async function addAttributes(admin: SignerWithAddress) {
  console.log('\n----- Adding attributes -----');
  for (const attribute of attributes) {
    const attributeBytes32 = ethers.utils.formatBytes32String(attribute);
    await (
      await dimoRegistry.connect(admin).addAttribute(attributeBytes32)
    ).wait();

    console.log(`Attribute ${attribute} added`);
  }
}

async function main() {
  const signers = await ethers.getSigners();

  const admin = signers[0];
  const controllers = signers.slice(1, 4);

  await deploy(admin);
  await mintRoots(admin, controllers);
  await addAttributes(admin);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
