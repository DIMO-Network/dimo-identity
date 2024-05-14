import fs from 'fs';
import path from 'path';
import hre from 'hardhat';

async function main(paths: string[]) {
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

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'abis', 'DimoRegistry.json'),
    `${JSON.stringify(setParsed, null, 4)}\n`,
    {
      flag: 'w',
    },
  );

  process.exit();
}

main([
  'contracts/DIMORegistry.sol:DIMORegistry',
  'contracts/dev/DevAdmin.sol:DevAdmin',
  'contracts/access/DimoAccessControl.sol:DimoAccessControl',
  'contracts/Eip712/Eip712Checker.sol:Eip712Checker',
  'contracts/shared/Multicall.sol:Multicall',
  'contracts/utils/ERC721Holder.sol:ERC721Holder',
  'contracts/implementations/AdLicenseValidator/AdLicenseValidator.sol:AdLicenseValidator',
  'contracts/implementations/nodes/AftermarketDevice.sol:AftermarketDevice',
  'contracts/implementations/nodes/Manufacturer.sol:Manufacturer',
  'contracts/implementations/nodes/Integration.sol:Integration',
  'contracts/implementations/nodes/SyntheticDevice.sol:SyntheticDevice',
  'contracts/implementations/nodes/Vehicle.sol:Vehicle',
  'contracts/implementations/Nodes.sol:Nodes',
  'contracts/implementations/Mapper.sol:Mapper',
  'contracts/implementations/MultipleMinter.sol:MultipleMinter',
  'contracts/implementations/BaseDataURI.sol:BaseDataURI',
  'contracts/implementations/streamr/StreamrConfigurator.sol:StreamrConfigurator',
  'contracts/implementations/streamr/VehicleStream.sol:VehicleStream',
  'contracts/implementations/tableland/DeviceDefinitionTable.sol:DeviceDefinitionTable',
  'contracts/implementations/tableland/DeviceDefinitionController.sol:DeviceDefinitionController',
]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
