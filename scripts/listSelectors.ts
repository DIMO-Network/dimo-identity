import fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';

async function main(contracts: string[]) {
  let sighashOutputMarkdown: string = '';
  let functionsTable: string = '';
  let eventsTable: string = '';
  let errorsTable: string = '';
  let sighash: string;
  let selector: string;
  let contractFactory;

  for (const contract of contracts) {
    contractFactory = await ethers.getContractFactory(contract);
    sighashOutputMarkdown += `## ${contract}\n`;
    functionsTable = '';
    eventsTable = '';
    errorsTable = '';

    for (const fragment of contractFactory.interface.fragments) {
      if (fragment.type === 'function') {
        sighash = fragment.format('sighash');
        selector = ethers.id(sighash).substring(0, 10);

        functionsTable += `| ${selector} | ${sighash} |\n`;
      } else if (fragment.type === 'event') {
        sighash = fragment.format('sighash');
        selector = ethers.id(sighash).substring(0, 10);

        eventsTable += `| ${selector} | ${sighash} |\n`;
      } else if (fragment.type === 'error') {
        sighash = fragment.format('sighash');
        selector = ethers.id(sighash).substring(0, 10);

        errorsTable += `| ${selector} | ${sighash} |\n`;
      }
    }

    if (functionsTable.length > 0) {
      sighashOutputMarkdown += '#### Functions\n| Selector | Signature |\n|-|-|\n';
      sighashOutputMarkdown += functionsTable;
      sighashOutputMarkdown += '\n';
    }
    if (eventsTable.length > 0) {
      sighashOutputMarkdown += '#### Events\n| Selector | Signature |\n|-|-|\n';
      sighashOutputMarkdown += eventsTable;
      sighashOutputMarkdown += '\n';
    }
    if (errorsTable.length > 0) {
      sighashOutputMarkdown += '#### Errors\n| Selector | Signature |\n|-|-|\n';
      sighashOutputMarkdown += errorsTable;
      sighashOutputMarkdown += '\n';
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'Selectors.md'),
    sighashOutputMarkdown,
    {
      flag: 'w',
    },
  );
}

main([
  'DIMORegistry',
  'DevAdmin',
  'DimoAccessControl',
  'Eip712Checker',
  'Multicall',
  'AdLicenseValidator',
  'AftermarketDevice',
  'Manufacturer',
  'Integration',
  'SyntheticDevice',
  'Vehicle',
  'Nodes',
  'Mapper',
  'MultipleMinter',
  'BaseDataURI'
]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
});