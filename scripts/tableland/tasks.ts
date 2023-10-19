import * as fs from 'fs';
import * as path from 'path';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';
import { getAccounts, getDatabase, getValidator, getRegistry } from '@tableland/local';

import { Manufacturer, DeviceDefinitionTable } from '../../typechain-types';
import { AddressesByNetwork } from '../../utils';

function getAddresses(): AddressesByNetwork {
    return JSON.parse(
        fs.readFileSync(path.resolve(__dirname, 'addresses.json'), 'utf8'),
    );
}

task('mint-manufacturer', 'npx hardhat mint-manufacturer <name> --network localhost')
    .addPositionalParam('name', 'The name of the manufacturer to be minted')
    .setAction(async (args: { name: string; }, hre) => {
        if (hre.network.name !== 'localhost') {
            throw new Error(`Invalid network <${hre.network.name}>\nMake sure to add the flag "--network localhost"\n`)
        }
        const instances = getAddresses();
        const [signer] = await hre.ethers.getSigners();
        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances.localhost.modules.DIMORegistry.address,
        );

        console.log(`Minting manufacturer ${args.name} to ${signer.address}...`);

        const tx = await manufacturerInstance
            .connect(signer)
            .mintManufacturerBatch(signer.address, [args.name]);
        const receipt = await tx.wait();
        const manufacturerId = (receipt?.logs[1] as EventLog).args[1].toString();

        console.log(`Manufacturer ${args.name} minted with ID: ${manufacturerId}`);
    });

task('create-dd-table', 'npx hardhat create-dd-table <manufacturerId> --network localhost')
    .addPositionalParam('manufacturerId', 'The ID of the manufacturer')
    .setAction(async (args: { manufacturerId: string; }, hre) => {
        if (hre.network.name !== 'localhost') {
            throw new Error(`Invalid network <${hre.network.name}>\nMake sure to add the flag "--network localhost"\n`)
        }
        const instances = getAddresses();
        const [signer] = await hre.ethers.getSigners();
        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances.localhost.modules.DIMORegistry.address,
        );

        const tablelandDb = getDatabase(getAccounts()[0]);
        const tablelandValidator = getValidator(tablelandDb.config.baseUrl);
        const tablelandRegistry = getRegistry(getAccounts()[0]);

        console.log(await tablelandRegistry.listTables(signer.address))

        console.log(`Creating Device Definition table for manufacturer ID ${args.manufacturerId} to ${signer.address}...`);

        const tx = await ddTableInstance
            .connect(signer)
            .createDeviceDefinitionTable(signer.address, args.manufacturerId);

        const receipt = await tx.wait();
        console.log(receipt);
        // TODO Failing here
        // [Validator] 12:42AM WRN non-200 status code response clientIP=::1 goversion=go1.19.12 severity=Warning statusCode=404 trace_id=5fe6a6d1-e591-46ed-a1dd-75c5e47b1e40 version=n/a
        console.log(await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: 31337,
            transactionHash: receipt?.hash as string,
        }));
        // const manufacturerId = (receipt?.logs[1] as EventLog).args[1].toString();

        // console.log(`Device Definition table ${args.manufacturerId} minted with ID: ${manufacturerId}`);
    });
