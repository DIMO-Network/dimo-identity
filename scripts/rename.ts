import fs from 'fs';
import * as csv from 'fast-csv';
import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import addressesJSON from './data/addresses.json';
import { AddressesByNetwork, IdManufacturerName } from '../utils';

const contractAddresses: AddressesByNetwork = addressesJSON;

interface ManufacturerIdRow {
  tids: string;
  name: string;
}

// eslint-disable-next-line no-unused-vars
function parseCSV(tokenIdMakeNamePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const output: IdManufacturerName[] = [];
    fs.createReadStream(tokenIdMakeNamePath)
      .pipe(csv.parse({ headers: true }))
      .on('data', async (row: ManufacturerIdRow) => {
        if (!row.tids || !row.name) reject(Error('Empty input'));
        output.push({ tokenId: row.tids, name: row.name });
      })
      .on('end', () => {
        return resolve(output);
      });
  });
}

// eslint-disable-next-line no-unused-vars
async function matchVehicleParent(
  id: string,
  idManufacturerNames: IdManufacturerName[],
  networkName: string
) {
  const VEHICLE_ID_ADDR = contractAddresses[networkName].nfts.VehicleId.proxy;
  const nodes = await ethers.getContractAt(
    'Nodes',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  const parentNode = (
    await nodes.getParentNode(VEHICLE_ID_ADDR, id)
  ).toString();

  if (parentNode === '0') return false;

  const manufName = idManufacturerNames.filter(
    (x: IdManufacturerName) => x.tokenId === parentNode
  )[0].name;
  const vehicleMake = await nodes.getInfo(VEHICLE_ID_ADDR, id, 'Make');

  return manufName && vehicleMake && manufName === vehicleMake;
}

// eslint-disable-next-line no-unused-vars
async function matchChainWithDb(
  idManufacturerNames: IdManufacturerName[],
  networkName: string
) {
  const manuf = await ethers.getContractAt(
    'Manufacturer',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  for (const idManufacturerName of idManufacturerNames) {
    const id = idManufacturerName.tokenId;
    const name = idManufacturerName.name;
    const onChainId = (await manuf.getManufacturerIdByName(name)).toString();

    console.log(
      `${id}-${name} ${id === onChainId ? 'matched' : '----- NOT MATCHED'}`
    );
  }
}

// eslint-disable-next-line no-unused-vars
async function renameManufacturers(
  signer: SignerWithAddress,
  idManufacturerNames: IdManufacturerName[],
  networkName: string
) {
  const batchSize = 50;
  const numOfManufacturers = idManufacturerNames.length;
  const devAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[networkName].modules.DIMORegistry.address
  );

  console.log(
    `${numOfManufacturers} Manufacturers will be renamed in batches of ${batchSize}...`
  );

  for (let i = 0; i < idManufacturerNames.length; i += batchSize) {
    const batch = idManufacturerNames.slice(i, i + batchSize);

    await (await devAdmin.connect(signer).renameManufacturers(batch)).wait();

    console.log(
      `Batch ${i / batchSize + 1} of ${Math.ceil(
        numOfManufacturers / batchSize
      )} renamed`
    );
  }

  console.log('Manufacturers renamed successfully!');
}

async function main() {
  const [signer] = await ethers.getSigners();
  // const signer = await ethers.getImpersonatedSigner(
  //   '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  // );

  const idManufacturerNames = await parseCSV('./make_token.csv');
  await renameManufacturers(signer, idManufacturerNames, network.name);

  await matchChainWithDb(idManufacturerNames, network.name);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
