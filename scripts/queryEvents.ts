import { ethers, network } from "hardhat";

import addressesJSON from "./data/addresses.json";
import { AddressesByNetwork } from "../utils";

const contractAddresses: AddressesByNetwork = addressesJSON;

async function main() {
  const dimoRegistryInstance = await ethers.getContractAt(
    "DIMORegistry",
    contractAddresses[network.name].modules.DIMORegistry.address,
  );
  const eventFilter = dimoRegistryInstance.filters.ModuleUpdated();

  const events = await dimoRegistryInstance.queryFilter(
    eventFilter,
    25389115,
    35489115,
  );

  // const filtered = events.map((e) => {
  //   return { role: e.args.role, account: e.args.account };
  // });

  // console.log(events[2].args.oldSelectors);
  // console.log(events[2].args.newSelectors);
  console.log(events);

  process.exit();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
