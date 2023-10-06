import { ethers, network, HardhatEthersSigner } from 'hardhat';

import addressesJSON from './data/addresses.json';
import { AddressesByNetwork, C } from '../utils';

const contractAddresses: AddressesByNetwork = addressesJSON;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function changeParentNode(
  caller: HardhatEthersSigner,
  newParentNode: number,
  idProxyAddress: string,
  nodeIds: number[],
  networkName: string
) {
  const devAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[networkName].modules.DIMORegistry.address,
  );

  console.log(`\n----- Setting new parent node ${newParentNode} to nodes ${nodeIds} -----\n`);

  await (await devAdmin
    .connect(caller)
    .changeParentNode(newParentNode, idProxyAddress, nodeIds)).wait();

  console.log(`----- Parent node ${newParentNode} set -----`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkParentNode(
  idProxyAddress: string,
  nodeIds: number[],
  networkName: string
) {
  const nodesInstance = await ethers.getContractAt(
    'Nodes',
    contractAddresses[networkName].modules.DIMORegistry.address,
  );

  const promises = [];
  for (const nodeId of nodeIds) {
    promises.push(nodesInstance.getParentNode(idProxyAddress, nodeId));
  }

  await Promise.all(promises).then((values) => {
    console.log(values);
  });
}

async function main() {
  const [caller] = await ethers.getSigners();
  const networkName = network.name;
  const arrayRange = (start: number, end: number) => Array.from({ length: (end - start + 1) }, (v, k) => k + start)

  console.log('Parent nodes before');
  await checkParentNode(
    contractAddresses[networkName].nfts.AftermarketDeviceId.proxy,
    arrayRange(41, 46),
    networkName);

  await changeParentNode(
    caller,
    145,
    contractAddresses[networkName].nfts.AftermarketDeviceId.proxy,
    arrayRange(41, 46),
    networkName
  );

  console.log('Parent nodes after');
  await checkParentNode(
    contractAddresses[networkName].nfts.AftermarketDeviceId.proxy,
    arrayRange(41, 46),
    networkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
});
