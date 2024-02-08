import * as fs from 'fs';
import * as path from 'path';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';
import { getAccounts, getDatabase, getValidator } from '@tableland/local';

import { Manufacturer, DeviceDefinitionTable } from '../../typechain-types';
import { AddressesByNetwork } from '../../utils';
import axios from 'axios';
import { makes } from '../data/Makes';

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

        console.log(`Total manufacturers ${makes.length}...`);

        console.log('Get device definitions...');
        const devices = (await getDeviceDefinitions()).data.device_definitions;
        console.log(`Total device definitions ${devices.length}...`);

        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances.localhost.modules.DIMORegistry.address,
        );

        for await (const element of makes) {
            const manufacturerId = await manufacturerInstance
                .connect(signer)
                .getManufacturerIdByName(element);

            let ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);

            if (ddTableId == 0) {
                console.log(`Creating Device Definition table for manufacturer ${element} with ID  ${manufacturerId}...`);

                const dTx = await ddTableInstance
                    .connect(signer)
                    .createDeviceDefinitionTable(tableOwner, manufacturerId);
    
                await tablelandValidator.pollForReceiptByTransactionHash({
                    chainId: 31337,
                    transactionHash: (await dTx.wait())?.hash as string,
                });
    
                ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);
            }
            
            const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

            console.log(`Device Definition table created\nTable ID: ${ddTableId}\nTable Name: ${ddTableName}`);

            const deviceDefinitionByManufacturers = devices.filter((c)=> c.make.name === element && c.type.year > 2006);
            console.log(`Get Device Definition By Manufacturer [${element}] total => ${deviceDefinitionByManufacturers.length}`);

            const batchSize = 50;
            let items = 0;
            for (let i = 0; i < deviceDefinitionByManufacturers.length; i += batchSize) {
                const batch = deviceDefinitionByManufacturers.slice(i, i + batchSize).map(function(dd) {
                    const deviceDefinitionInput : DeviceDefinitionInput = {
                        id: `${dd.type.model_slug}_${dd.type.year}`,
                        legacyId: dd.device_definition_id,
                        model: dd.type.model,
                        year: dd.type.year,
                        metadata: JSON.stringify({
                            device_attributes: dd.device_attributes
                        })
                    };
                    return deviceDefinitionInput;
                });

                items += batch.length;

                console.log(batch);

                console.log(`Creating [${deviceDefinitionByManufacturers.length}/${items}] ...`);
                await ddTableInstance.insertDeviceDefinitionBatch(manufacturerId, batch);
            }

            const count = await tablelandDb.prepare(
                `SELECT COUNT(*) AS total FROM ${ddTableName}`
              ).first<{ total: number }>('total');

            console.log(`${element} => ${ddTableName} total rows: ${count}`);
            console.log(`${element} => ${ddTableName} total upload: ${deviceDefinitionByManufacturers.length}`);

        }
        
});


task('query-tableland', 'npx hardhat query-tableland <name> --network localhost')
    .addPositionalParam('name', 'The name of the manufacturer table')
    .addPositionalParam('filter', 'The filter to query device definition table', '')
    .addOptionalParam('limit', 'The limit to query device definition table', 'LIMIT 10')
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
        
        console.log(`Query to manufacturer table [${args.name}] for ${signer.address}...`);

        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances.localhost.modules.DIMORegistry.address,
        );

        const manufacturerId = await manufacturerInstance
                .connect(signer)
                .getManufacturerIdByName(args.name);

        const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);
                
        const where = args.filter ? `WHERE id='${args.filter}'` : '';
        const script = `SELECT * FROM ${ddTableName} ${where} ${args.limit}`;
        console.log(script);

        const query = await tablelandDb.prepare(
            script
          ).all();

        console.log(`Duration: ${query.meta.duration}`);
        console.log(`Total rows: ${query.results.length}`);
        console.table(query.results);

});

async function getDeviceMakes() {
    return await axios.get('https://device-definitions-api.dimo.zone/device-makes');
}

async function getDeviceDefinitions() {
    return await axios.get('https://device-definitions-api.dimo.zone/device-definitions/all');
}

function delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}