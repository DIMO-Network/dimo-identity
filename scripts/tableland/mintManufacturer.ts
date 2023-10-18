import * as fs from 'fs';
import * as path from 'path';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';

import { Manufacturer } from '../../typechain-types';
import { AddressesByNetwork } from '../../utils';

function getAddresses(): AddressesByNetwork {
    return JSON.parse(
        fs.readFileSync(path.resolve(__dirname, 'addresses.json'), 'utf8'),
    );
}

task('mintManufacturer', 'npx hardhat mintManufacturer <name> --network localhost')
    .addPositionalParam('name', 'The name of the manufacturer to be minted')
    .setAction(async (args: { name: string; }, hre) => {
        if (hre.network.name !== 'localhost') {
            throw new Error(`Invalid network <${hre.network.name}>\nMake sure to add the flag "--network localhost"\n`)
        }
        const instances = getAddresses();
        const [signer] = await hre.ethers.getSigners();
        console.log(args);
        console.log(hre.network.name)
        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances.localhost.modules.DIMORegistry.address,
        );

        console.log(`Minting manufacturer ${args.name} to ${signer.address}...`);

        const receipt = await (await manufacturerInstance
            .connect(signer)
            .mintManufacturerBatch(signer.address, [args.name])).wait();
        console.log(receipt);
        const manufacturerId = (receipt?.logs[0] as EventLog).args[2].toString();

        console.log(`Manufacturer ${args.name} minted with ID : ${manufacturerId}`);
    });
