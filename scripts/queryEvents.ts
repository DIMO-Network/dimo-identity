import { ethers, network } from 'hardhat';

import addressesJSON from './data/addresses.json';
import { AddressesByNetwork } from '../utils';

const contractAddresses: AddressesByNetwork = addressesJSON;

async function main() {
  const dimoRegistryInstance = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[network.name].modules.DIMORegistry.address,
  );
  const eventFilter = dimoRegistryInstance.filters['AftermarketDeviceAttributeSet(uint256,string,string)']();

  const startBlock = 60303484;
  const endBlock = 71713484;
  const chunkSize = 100000; // Adjust this value based on your RPC provider's limitations

  let allEvents: any[] = [];

  console.log(`Querying events from block ${startBlock} to ${endBlock} in chunks of ${chunkSize}...`);

  for (let fromBlock = startBlock; fromBlock <= endBlock; fromBlock += chunkSize) {
    const toBlock = Math.min(fromBlock + chunkSize - 1, endBlock);
    console.log(`Querying chunk: ${fromBlock} to ${toBlock}`);

    try {
      const eventsChunk = await dimoRegistryInstance.queryFilter(
        eventFilter,
        fromBlock,
        toBlock
      );

      console.log(`Found ${eventsChunk.length} events in this chunk`);
      allEvents = allEvents.concat(eventsChunk);
    } catch (error) {
      console.error(`Error querying blocks ${fromBlock} to ${toBlock}:`, error);
    }
  }

  console.log(`Total events found: ${allEvents.length}`);
    
  for (const event of allEvents) {
    console.log(event.args);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
})
