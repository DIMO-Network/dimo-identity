import fs from 'fs';
import path from 'path';
import { ethers } from 'hardhat';

async function main(contracts: string[]) {
  let sighashOutputMarkdown: string = '';
  let sighash: string;
  let selector: string;
  let contractFactory;

  for (const contract of contracts) {
    contractFactory = await ethers.getContractFactory(contract);
    sighashOutputMarkdown += `## ${contract}\n| Selector | Signature |\n|-|-|\n`;

    for (const fragment of contractFactory.interface.fragments) {
      if (fragment.type === 'function') {
        sighash = fragment.format('sighash');
        selector = ethers.id(sighash).substring(0, 10);

        sighashOutputMarkdown += `| ${selector} | ${sighash} |\n`;
      }
    }
    sighashOutputMarkdown += '\n';
  }

  fs.writeFileSync(
    path.resolve(__dirname, '..', 'Selectors.md'),
    sighashOutputMarkdown,
    {
      flag: 'w',
    },
  );

  process.exit();
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
  'BaseDataURI',
]).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
