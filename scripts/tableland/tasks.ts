import * as fs from 'fs';
import * as path from 'path';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';
import { getAccounts, getDatabase, getValidator } from '@tableland/local';

import { Manufacturer, DeviceDefinitionTable } from '../../typechain-types';
import { AddressesByNetwork, C } from '../../utils';

function getAddresses(): AddressesByNetwork {
    return JSON.parse(
        fs.readFileSync(path.resolve(__dirname, 'addresses.json'), 'utf8'),
    );
}

task('mint-manufacturer', 'Mints a new Manufacturer')
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

        console.log(`Minting manufacturer ${args.name} for ${signer.address}...`);

        const tx = await manufacturerInstance
            .connect(signer)
            .mintManufacturerBatch(signer.address, [args.name]);
        const receipt = await tx.wait();
        const manufacturerId = (receipt?.logs[1] as EventLog).args[1].toString();

        console.log(`Manufacturer ${args.name} minted with ID: ${manufacturerId}`);
    });

task('create-dd-table', 'Creates a Device Definition table related to a Manufacturer ID')
    .addPositionalParam('manufacturerId', 'The ID of the manufacturer')
    .addOptionalParam('tableOwner', 'The address to which the table will be transferred after creation')
    .setAction(async (args: { manufacturerId: string; tableOwner: string | undefined }, hre) => {
        if (hre.network.name !== 'localhost') {
            throw new Error(`Invalid network <${hre.network.name}>\nMake sure to add the flag "--network localhost"\n`)
        }
        const instances = getAddresses();
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = args.tableOwner ?? signer.address;
        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances.localhost.modules.DIMORegistry.address,
        );

        const tablelandDb = getDatabase(getAccounts()[0]);
        const tablelandValidator = getValidator(tablelandDb.config.baseUrl);

        console.log(`Creating Device Definition table for manufacturer ID ${args.manufacturerId}...`);

        const tx = await ddTableInstance
            .connect(signer)
            .createDeviceDefinitionTable(tableOwner, args.manufacturerId);

        await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: 31337,
            transactionHash: (await tx.wait())?.hash as string,
        });

        const tableId = await ddTableInstance.getDeviceDefinitionTableId(args.manufacturerId);
        const tableName = await ddTableInstance.getDeviceDefinitionTableName(args.manufacturerId);

        console.log(`Device Definition table created\nTable ID: ${tableId}\nTable Name: ${tableName}\nTable Owner: ${tableOwner}`);
    });
