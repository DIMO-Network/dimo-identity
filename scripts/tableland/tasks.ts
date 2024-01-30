import * as fs from 'fs';
import * as path from 'path';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';
import { getAccounts, getDatabase, getValidator, getRegistry } from '@tableland/local';

import { Manufacturer, DeviceDefinitionTable, ManufacturerTable } from '../../typechain-types';
import { AddressesByNetwork } from '../../utils';
import axios from 'axios';

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

        console.log(`Minting manufacturer ${args.name} for ${signer.address}...`);

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

        console.log(`Creating Device Definition table for manufacturer ID ${args.manufacturerId}...`);

        const tx = await ddTableInstance
            .connect(signer)
            .createDeviceDefinitionTable(args.manufacturerId);

        await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: 31337,
            transactionHash: (await tx.wait())?.hash as string,
        });

        const tableId = await ddTableInstance.getDeviceDefinitionTableId(args.manufacturerId);
        const tableName = await ddTableInstance.getDeviceDefinitionTableName(args.manufacturerId);

        console.log(`Device Definition table created\nTable ID: ${tableId}\nTable Name: ${tableName}`);
});


task('migration-tableland', 'npx hardhat migration-tableland --network localhost')
    .setAction(async (args, hre) => {
        
        if (hre.network.name !== 'localhost') {
            throw new Error(`Invalid network <${hre.network.name}>\nMake sure to add the flag "--network localhost"\n`)
        }
        const instances = getAddresses();
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = await signer.getAddress(); 

        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances.localhost.modules.DIMORegistry.address,
        );

        const tablelandDb = getDatabase(getAccounts()[0]);
        const tablelandValidator = getValidator(tablelandDb.config.baseUrl);

        console.log(`Minting manufacturers for ${signer.address}...`);

        console.log(`Get manufacturers...`);
        let manufacturers = (await getDeviceMakes()).data.device_makes;
        console.log(`Total manufacturers ${manufacturers.length}...`);

        console.log(`Get device definitions...`);
        let devices = (await getDeviceDefinitions()).data.device_definitions;
        console.log(`Total device definitions ${devices.length}...`);

        // manufacturers = manufacturers.slice(0, 5);
        for await (const element of manufacturers) {
            const name = `${element.name_slug}`;

            console.log(`Creating Manufacturer ${name} ...`);

            const tx = await manufacturerInstance
                .connect(signer)
                .mintManufacturerBatch(signer.address, [name]);

            const receipt = await tx.wait();
            const manufacturerId = (receipt?.logs[1] as EventLog).args[1].toString();

            console.log(`Manufacturer ${name} minted with ID: ${manufacturerId}`);

            const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
                'DeviceDefinitionTable',
                instances.localhost.modules.DIMORegistry.address,
            );

            console.log(`Creating Device Definition table for manufacturer ${name} with ID  ${manufacturerId}...`);

            const dTx = await ddTableInstance
                .connect(signer)
                .createDeviceDefinitionTable(tableOwner, manufacturerId, name);

            await tablelandValidator.pollForReceiptByTransactionHash({
                chainId: 31337,
                transactionHash: (await dTx.wait())?.hash as string,
            });

            const ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);
            const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId, name);

            console.log(`Device Definition table created\nTable ID: ${ddTableId}\nTable Name: ${ddTableName}`);

            let deviceDefinitionByManufacturers = devices.filter((c)=> c.make.name_slug == element.name_slug && c.type.year > 2006);
            console.log(`Get Device Definition By Manufacturer [${element.name}] total => ${deviceDefinitionByManufacturers.length}`);

            // deviceDefinitionByManufacturers = deviceDefinitionByManufacturers.slice(0, 5);
            for await (const dd of deviceDefinitionByManufacturers) {
                
                const deviceDefinitionInput : DeviceDefinitionInput = {
                    id: `${dd.make.name_slug}-${dd.type.model_slug}-${dd.type.year}`,
                    deviceDefinitionId: dd.device_definition_id,
                    model: dd.type.model,
                    year: dd.type.year,
                    metadata: JSON.stringify({
                        vehicle_data: dd.vehicle_data,
                        device_attributes: dd.device_attributes,
                        device_integrations: dd.device_integrations
                    })
                };

                await ddTableInstance.insertDeviceDefinition(manufacturerId, name, deviceDefinitionInput);
                // console.log(manufacturerId, deviceDefinitionInput);
                console.info(`insert [${ddTableName}] => ${dd.device_definition_id} - ${dd.name} - ${dd.make.name} ${dd.type.model} - ${dd.type.year}`);

            }

        }
        
});



async function getDeviceMakes() {
    return await axios.get('https://device-definitions-api.dimo.zone/device-makes');
}

async function getDeviceDefinitions() {
    return await axios.get('https://device-definitions-api.dimo.zone/device-definitions/all');
}