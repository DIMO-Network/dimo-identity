import { ethers, network } from 'hardhat';

import addressesJSON from './data/addresses.json';
import { ContractAddressesByNetwork } from '../utils';

const contractAddresses: ContractAddressesByNetwork = addressesJSON;

async function main() {
  const dimoRegistryInstance = await ethers.getContractAt(
    'VehicleId',
    contractAddresses[network.name].nfts.VehicleId
  );
  const eventFilter = dimoRegistryInstance.filters.RoleGranted();

  const events = await dimoRegistryInstance.queryFilter(
    eventFilter,
    34569053,
    36502214
  );

  const filtered = events.map((e) => {
    return { role: e.args.role, account: e.args.account };
  });

  console.log(filtered);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
