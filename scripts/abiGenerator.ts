import fs from 'fs';
import path from 'path';
import hre from 'hardhat';

async function main(paths: string[]) {
  const abis: any[] = await Promise.all(
    paths.map(async (p) => {
      const { abi } = await hre.artifacts.readArtifact(p);
      return abi;
    })
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
    path.resolve(__dirname, 'data', 'fullAbi.json'),
    `${JSON.stringify(setParsed, null, 4)}\n`,
    {
      flag: 'w'
    }
  );
}

main([
  'contracts/DIMORegistry.sol:DIMORegistry',
  'contracts/access/AccessControl.sol:AccessControl',
  'contracts/Eip712/Eip712Checker.sol:Eip712Checker',
  'contracts/implementations/AdLicenseValidator/AdLicenseValidator.sol:AdLicenseValidator',
  'contracts/implementations/nodes/AftermarketDevice.sol:AftermarketDevice',
  'contracts/implementations/nodes/Manufacturer.sol:Manufacturer',
  'contracts/implementations/nodes/Vehicle.sol:Vehicle',
  'contracts/implementations/Getter.sol:Getter',
  'contracts/implementations/Mapper.sol:Mapper',
  'contracts/implementations/Metadata.sol:Metadata'
]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
