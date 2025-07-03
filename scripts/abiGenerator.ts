import fs from 'fs';
import path from 'path';
import hre from 'hardhat';

async function main(paths: string[]) {
  console.log('Generating DIMORegistry ABI file...');
  
  // Create abis directory if it doesn't exist
  const abiDir = path.join(__dirname, '..', 'abis');
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
    console.log('Created abis directory');
  }

  const abis: any[] = await Promise.all(
    paths.map(async (p) => {
      const { abi } = await hre.artifacts.readArtifact(p);
      return abi;
    }),
  );

  const merged = abis
    .reduce((arr, item) => {
      arr.push(...item);
      return arr;
    }, [])
    .map((a: any) => JSON.stringify(a));

  const set: Set<string> = new Set(merged);
  const setParsed = Array.from(set).map((a) => JSON.parse(a));

  const processedAbi = removeDuplicateDefinitions(setParsed);

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'abis', 'DimoRegistry.json'),
    `${JSON.stringify(processedAbi, null, 4)}\n`,
    {
      flag: 'w',
    },
  );

  console.log('ABI generation completed');

  process.exit();
}

/**
 * Removes duplicate definitions from an ABI array based on their names
 * @param abi The original ABI array
 * @returns A new ABI array with duplicates removed
 */
function removeDuplicateDefinitions(abi: any[]): any[] {
  console.log('Removing duplicate definitions...');
  
  // Track seen definitions by name
  const seenDefinitions = new Map<string, number>();
  const result: any[] = [];
  let duplicatesRemoved = 0;

  for (const item of abi) {
    // Create a unique key based on the definition type and name
    const key = `${item.type}_${item.name}`;
    
    if (!seenDefinitions.has(key) || item.type === 'function') {
      // First time seeing this definition, add it to the result
      seenDefinitions.set(key, result.length);
      result.push(item);
    } else {
      // This is a duplicate, log it
      duplicatesRemoved++;
      console.log(`Removed duplicate definition: ${key}`);
    }
  }

  console.log(`Removed ${duplicatesRemoved} duplicate definitions`);
  return result;
}

main([
  'contracts/DIMORegistry.sol:DIMORegistry',
  'contracts/dev/DevAdmin.sol:DevAdmin',
  'contracts/access/DimoAccessControl.sol:DimoAccessControl',
  'contracts/Eip712/Eip712Checker.sol:Eip712Checker',
  'contracts/shared/Multicall.sol:Multicall',
  'contracts/utils/ERC721Holder.sol:ERC721Holder',
  'contracts/implementations/nodes/AftermarketDevice.sol:AftermarketDevice',
  'contracts/implementations/nodes/Manufacturer.sol:Manufacturer',
  'contracts/implementations/nodes/Integration.sol:Integration',
  'contracts/implementations/nodes/SyntheticDevice.sol:SyntheticDevice',
  'contracts/implementations/nodes/Vehicle.sol:Vehicle',
  'contracts/implementations/Nodes.sol:Nodes',
  'contracts/implementations/Mapper.sol:Mapper',
  'contracts/implementations/MultipleMinter.sol:MultipleMinter',
  'contracts/implementations/Shared.sol:Shared',
  'contracts/implementations/streamr/StreamrConfigurator.sol:StreamrConfigurator',
  'contracts/implementations/streamr/VehicleStream.sol:VehicleStream',
  'contracts/implementations/tableland/DeviceDefinitionTable.sol:DeviceDefinitionTable',
  'contracts/implementations/tableland/DeviceDefinitionController.sol:DeviceDefinitionController',
  'contracts/implementations/charging/Charging.sol:Charging',
  'contracts/implementations/storageNode/StorageNodeRegistry.sol:StorageNodeRegistry',
]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
