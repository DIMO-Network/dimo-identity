import fs from 'fs';
import path from 'path';
import * as csv from 'fast-csv';
import { ethers, network } from 'hardhat';

import addressesJSON from './data/addresses.json';
import { ContractAddressesByNetwork, IdManufacturerName } from '../utils';

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

interface ManufacturerIdRow {
  tids: string;
  name: string;
}

// eslint-disable-next-line no-unused-vars
function parseCSV(): Promise<any> {
  return new Promise((resolve, reject) => {
    const output: IdManufacturerName[] = [];
    fs.createReadStream(path.resolve('scripts', 'data', 'make_tokens.csv'))
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
async function match(
  id: string,
  idManufacturerNames: IdManufacturerName[],
  networkName: string
) {
  const VEHICLE_ID_ADDR = contractAddresses[networkName].nfts.VehicleId;
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
async function renameManufacturers(
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

    await (await devAdmin.renameManufacturers(batch)).wait();

    console.log(
      `Batch ${i / batchSize + 1} of ${Math.ceil(
        numOfManufacturers / batchSize
      )} renamed`
    );
  }

  console.log('Manufacturers renamed successfully!');
}

async function main() {
  const idManufacturerNames = await parseCSV();
  await renameManufacturers(idManufacturerNames, network.name);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
