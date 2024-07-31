import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Database, Validator, helpers } from '@tableland/sdk';

import { Manufacturer, DeviceDefinitionTable } from '../../typechain-types';
import { AddressesByNetwork, DeviceDefinitionInput, StringNumber } from '../../utils';
import { makes } from '../data/Makes';

const VALID_NETWORKS = ['localhost', 'polygon', 'amoy']
const CHAIN_ID: StringNumber = {
    'localhost': 31337,
    'polygon': 137,
    'amoy': 80002
}

function getAddresses(currentNetwork: string): AddressesByNetwork {
    const addressesPath = currentNetwork === 'localhost'
        ? path.resolve(__dirname, 'addresses.json')
        : path.resolve(__dirname, '..', 'data', 'addresses.json');

    return JSON.parse(
        fs.readFileSync(addressesPath, 'utf8'),
    );
}

function validateNetwork(currentNetwork: string) {
    if (!VALID_NETWORKS.includes(currentNetwork)) {
        throw new Error(`Invalid network <${currentNetwork}>\nMake sure to add the flag "--network [${VALID_NETWORKS}]"\n`)
    }
}

function validateQueryType(queryType: string) {
    if (!['select', 'count'].includes(queryType)) {
        throw new Error(`Invalid query type <${queryType}>\nAvailable queries: select or count"\n`)
    }
}

function validateStringArrayInput(stringArray: string) {
    let array;

    try {
        array = stringArray.split(',').map(a => parseInt(a.trim()));
        const isValid = array.every(a => a && typeof a === 'number');
        if (!isValid) {
            throw new Error('Invalid array input. It must be in the format "1,2,3,4,5"');
        }
    } catch {
        throw new Error('Invalid array input. It must be in the format "1,2,3,4,5"');
    }

    return array;
}

async function getGasPrice(hre: HardhatRuntimeEnvironment, bump: bigint = 20n): Promise<string> {
    const price = (await hre.ethers.provider.getFeeData()).gasPrice as bigint;

    return (price * bump / 100n + price).toString();
}

async function getGasPriceWithSleep(
    hre: HardhatRuntimeEnvironment,
    bump: bigint = 20n,
    priceLimit: bigint,
    sleepInterval: number
): Promise<string> {
    let price = (await hre.ethers.provider.getFeeData()).gasPrice as bigint;
    let returnPrice = price * bump / 100n + price;

    if (priceLimit) {
        while (returnPrice > priceLimit) {
            process.stdout.write(`Gas price too high: ${returnPrice} Sleeping ${sleepInterval} ms...`);
            await sleep(sleepInterval);
            process.stdout.write('\r\x1b[K');

            price = (await hre.ethers.provider.getFeeData()).gasPrice as bigint;
            returnPrice = price * bump / 100n + price
        }
        console.log(`\nGas price ${returnPrice}`)
    }

    return returnPrice.toString();
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

task('mint-manufacturer', 'Mints a new Manufacturer')
    .addPositionalParam('name', 'The name of the manufacturer to be minted')
    .setAction(async (args: { name: string; }, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        const _gasPrice = await getGasPrice(hre);
        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();
        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        console.log(`Minting manufacturer ${args.name} for ${signer.address}...`);

        const tx = await manufacturerInstance
            .connect(signer)
            .mintManufacturerBatch(signer.address, [args.name], { gasPrice: _gasPrice });
        const receipt = await tx.wait();
        const manufacturerId = (receipt?.logs[1] as EventLog).args[1].toString();

        console.log(`Manufacturer ${args.name} minted with ID: ${manufacturerId}`);
    });


task('create-dd-table', 'Creates a Device Definition table related to a Manufacturer ID')
    .addPositionalParam('manufacturerId', 'The ID of the manufacturer')
    .addOptionalParam('tableOwner', 'The address to which the table will be transferred after creation')
    .setAction(async (args: { manufacturerId: string; tableOwner: string | undefined }, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        const _gasPrice = await getGasPrice(hre);
        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = args.tableOwner ?? signer.address;
        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        const db = new Database({
            baseUrl: helpers.getBaseUrl(CHAIN_ID[currentNetwork]),
        });
        const tablelandValidator = new Validator(db.config);

        console.log(`Creating Device Definition table for manufacturer ID ${args.manufacturerId}...`);

        const tx = await ddTableInstance
            .connect(signer)
            .createDeviceDefinitionTable(tableOwner, args.manufacturerId, { gasPrice: _gasPrice });

        await tablelandValidator.pollForReceiptByTransactionHash({
            chainId: CHAIN_ID[currentNetwork],
            transactionHash: (await tx.wait())?.hash as string,
        });

        const tableId = await ddTableInstance.getDeviceDefinitionTableId(args.manufacturerId);
        const tableName = await ddTableInstance.getDeviceDefinitionTableName(args.manufacturerId);

        console.log(`Device Definition table created\nTable ID: ${tableId}\nTable Name: ${tableName}\nTable Owner: ${tableOwner}`);
    });

task('create-dd-tables', 'Creates Device Definition tables related to s list of Manufacturer IDs')
    .addPositionalParam('manufacturerIds', 'The list of IDs of the manufacturers')
    .addOptionalParam('tableOwner', 'The address to which the table will be transferred after creation')
    .setAction(async (args: { manufacturerIds: string, tableOwner: string | undefined }, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = args.tableOwner ?? signer.address;
        const manufacturerIds = validateStringArrayInput(args.manufacturerIds);
        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );
        const db = new Database({
            baseUrl: helpers.getBaseUrl(CHAIN_ID[currentNetwork]),
        });
        const tablelandValidator = new Validator(db.config);

        for (const manufacturerId of manufacturerIds) {
            const _gasPrice = await getGasPrice(hre);

            console.log(`Creating Device Definition table for manufacturer ID ${manufacturerId}...`);

            const tx = await ddTableInstance
                .connect(signer)
                .createDeviceDefinitionTable(tableOwner, manufacturerId, { gasPrice: _gasPrice });

            await tablelandValidator.pollForReceiptByTransactionHash({
                chainId: CHAIN_ID[currentNetwork],
                transactionHash: (await tx.wait())?.hash as string,
            });

            const tableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);
            const tableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

            console.log(`Device Definition table created\nTable ID: ${tableId}\nTable Name: ${tableName}\nTable Owner: ${tableOwner}`);
        }
    });

task('migration-tableland', 'npx hardhat migration-tableland --network <networkName>')
    .setAction(async (args, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        let _gasPrice;
        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = await signer.getAddress();

        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        const db = new Database({
            baseUrl: helpers.getBaseUrl(CHAIN_ID[currentNetwork]),
        });
        const tablelandValidator = new Validator(db.config);

        console.log(`Total manufacturers ${makes.length}...`);

        console.log('Get device definitions...');
        const devices = (await getDeviceDefinitions()).data.device_definitions;
        console.log(`Total device definitions ${devices.length}...`);

        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        for (const make of makes) {
            const manufacturerId = await manufacturerInstance
                .connect(signer)
                .getManufacturerIdByName(make);

            let ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);

            if (ddTableId.toString() === '0') {
                console.log(`Creating Device Definition table for manufacturer ${make} with ID  ${manufacturerId}...`);

                _gasPrice = await getGasPrice(hre);
                const dTx = await ddTableInstance
                    .connect(signer)
                    .createDeviceDefinitionTable(tableOwner, manufacturerId, { gasPrice: _gasPrice });

                await tablelandValidator.pollForReceiptByTransactionHash({
                    chainId: CHAIN_ID[currentNetwork],
                    transactionHash: (await dTx.wait())?.hash as string,
                });

                const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

                console.log(`Device Definition table created\nTable ID: ${ddTableId}\nTable Name: ${ddTableName}`);
            }

            ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);

            const deviceDefinitionByManufacturers = devices.filter((c) => c.make.name === make && c.type.year > 2006);
            console.log(`Get Device Definition By Manufacturer [${make}] total => ${deviceDefinitionByManufacturers.length}`);

            const batchSize = 50;
            let items = 0;

            for (let i = 0; i < deviceDefinitionByManufacturers.length; i += batchSize) {
                // todo: query tableland by id (dd_slug), if not found, delete record from tableland (using delete contract?)

                const batch = deviceDefinitionByManufacturers.slice(i, i + batchSize).map(function (dd) {
                    const deviceDefinitionInput: DeviceDefinitionInput = {
                        id: generateSlug(`${dd.type.make_slug}_${dd.type.model_slug}_${dd.type.year}`),
                        ksuid: dd.device_definition_id,
                        model: dd.type.model,
                        year: dd.type.year,
                        metadata: JSON.stringify({
                            device_attributes: dd.device_attributes
                        }),
                        deviceType: dd.type.type,
                        imageURI: dd.imageUrl ?? ''
                    };
                    return deviceDefinitionInput;
                });

                items += batch.length;

                _gasPrice = await getGasPriceWithSleep(hre, 20n, 15000000000n, 5000); // 15 gwei
                console.log(`Creating [${items}/${deviceDefinitionByManufacturers.length}] ...`);
                const tx = await ddTableInstance.insertDeviceDefinitionBatch(manufacturerId, batch, { gasPrice: _gasPrice });

                await tablelandValidator.pollForReceiptByTransactionHash({
                    chainId: CHAIN_ID[currentNetwork],
                    transactionHash: (await tx.wait())?.hash as string,
                });
            }

            const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);
            const count = await db.prepare(
                `SELECT COUNT(*) AS total FROM ${ddTableName}`
            ).first<{ total: number }>('total');

            console.log(`${make} => ${ddTableName} total rows: ${count}`);
            console.log(`${make} => ${ddTableName} total upload: ${deviceDefinitionByManufacturers.length}\n`);
        }
    });

task('query-tableland', 'npx hardhat query-tableland <name> <type> --network <networkName>')
    .addPositionalParam('name', 'The name of the manufacturer table')
    .addPositionalParam('type', 'Type of quert <select|count>', 'select')
    .addOptionalParam('filter', 'The filter to query device definition table', '')
    .addOptionalParam('limit', 'The limit to query device definition table', '10')
    .setAction(async (args, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);
        validateQueryType(args.type);

        const instances = getAddresses(currentNetwork);
        const db = new Database({
            baseUrl: helpers.getBaseUrl(CHAIN_ID[currentNetwork]),
        });
        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );
        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        console.log(`ManufacturerId address ${instances[currentNetwork].modules.DIMORegistry.address}`);
        console.log(`Query to manufacturer table ${args.name}...`);

        const manufacturerId = await manufacturerInstance.getManufacturerIdByName(args.name);
        const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

        console.log(`Manufacturer ID => ${manufacturerId} with table name ${ddTableName}`);

        const where = args.filter ? `WHERE id='${args.filter}'` : '';

        let script = '';
        switch (args.type) {
            case 'select':
                script = `SELECT * FROM ${ddTableName}${where} LIMIT ${args.limit}`;
                break;
            case 'count':
                script = `SELECT COUNT(*) as total FROM ${ddTableName}${where} LIMIT ${args.limit}`;
                break;
        }
        console.log(script);

        const query = await db.prepare(
            script
        ).all();

        console.log(`Duration: ${query.meta.duration}`);
        console.log(`Total rows: ${query.results.length}`);
        console.table(query.results);
    });

task('count-dds', 'npx hardhat count-dds --network <networkName>')
    .setAction(async (args, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        console.log('Get device definitions...');
        const devices = (await getDeviceDefinitions()).data.device_definitions;
        console.log(`Total device definitions ${devices.length}...`);

        const output = [];
        let numDdTotal = 0;
        let numBatchesTotal = 0;
        for (const make of makes) {
            const deviceDefinitionByManufacturers = devices.filter((c) => c.make.name === make && c.type.year > 2006);
            const _numDdByManuf = deviceDefinitionByManufacturers.length as number;
            let _numBatchesByManuf = 0;

            if (_numDdByManuf > 50) {
                _numBatchesByManuf = Math.trunc(_numDdByManuf / 50) + 1;
            } else if (_numDdByManuf > 0) {
                _numBatchesByManuf = 1;
            }

            numDdTotal += _numDdByManuf;
            numBatchesTotal += _numBatchesByManuf;
            console.log(numBatchesTotal, _numBatchesByManuf)

            output.push({
                make: make,
                count: _numDdByManuf,
                numBatches: _numBatchesByManuf
            });
        }

        console.table(output);
        console.log(numDdTotal, numBatchesTotal)
    });

task('query-all-tableland', 'npx hardhat query-tableland <type> --network <networkName>')
    .addPositionalParam('type', 'Type of quert <select|count>', 'select')
    .addOptionalParam('filter', 'The filter to query device definition table', '')
    .addOptionalParam('limit', 'The limit to query device definition table', '10')
    .setAction(async (args, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);
        validateQueryType(args.type);

        const instances = getAddresses(currentNetwork);
        const db = new Database({
            baseUrl: helpers.getBaseUrl(CHAIN_ID[currentNetwork]),
        });
        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );
        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        console.log(`ManufacturerId address ${instances[currentNetwork].modules.DIMORegistry.address}`);

        for (const make of makes.reverse()) {
            const manufacturerId = await manufacturerInstance.getManufacturerIdByName(make);
            const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

            const where = args.filter ? `WHERE id='${args.filter}'` : '';

            let script = '';
            switch (args.type) {
                case 'select':
                    script = `SELECT * FROM ${ddTableName}${where} LIMIT ${args.limit}`;
                    break;
                case 'count':
                    script = `SELECT COUNT(*) AS total FROM ${ddTableName}${where} LIMIT ${args.limit}`;
                    break;
            }

            const query = await db.prepare(
                script
            ).all();

            console.log(`${manufacturerId} ${make}: ${query.results[0]['total']}`);
        }
    });

task('create-manufacturer-table-schema', 'npx hardhat create-manufacturer-table-schema --network <networkName>')
    .setAction(async (args, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        let _gasPrice;
        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = await signer.getAddress();

        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        const db = new Database({
            baseUrl: helpers.getBaseUrl(CHAIN_ID[currentNetwork]),
        });
        const tablelandValidator = new Validator(db.config);

        console.log(`Total manufacturers ${makes.length}...`);

        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        for await (const element of makes) {
            const manufacturerId = await manufacturerInstance
                .connect(signer)
                .getManufacturerIdByName(element);

            let ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);

            if (ddTableId.toString() !== '0') {
                const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

                console.log(`Device Definition table existing \nTable ID: ${ddTableId}\nTable Name: ${ddTableName}`);
            }

            if (ddTableId.toString() === '0') {
                console.log(`Creating Device Definition table for manufacturer ${element} with ID  ${manufacturerId}...`);

                _gasPrice = await getGasPrice(hre);
                const dTx = await ddTableInstance
                    .connect(signer)
                    .createDeviceDefinitionTable(tableOwner, manufacturerId, { gasPrice: _gasPrice });

                await tablelandValidator.pollForReceiptByTransactionHash({
                    chainId: CHAIN_ID[currentNetwork],
                    transactionHash: (await dTx.wait())?.hash as string,
                });

                ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);

                const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

                console.log(`Device Definition table created\nTable ID: ${ddTableId}\nTable Name: ${ddTableName}`);
            }

        }
    });

task('sync-tableland', 'npx hardhat sync-tableland --network <networkName>')
    .setAction(async (args, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        let _gasPrice;
        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = await signer.getAddress();

        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        const db = new Database({
            baseUrl: helpers.getBaseUrl(CHAIN_ID[currentNetwork]),
        });
        const tablelandValidator = new Validator(db.config);

        console.log(`Total manufacturers ${makes.length}...`);

        console.log('Get device definitions...');
        const devices = (await getDeviceDefinitions()).data.device_definitions;
        console.log(`Total device definitions ${devices.length}...`);

        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        for (const make of makes) {
            const manufacturerId = await manufacturerInstance
                .connect(signer)
                .getManufacturerIdByName(make);

            let ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);

            if (ddTableId.toString() === '0') {
                console.log(`Creating Device Definition table for manufacturer ${make} with ID  ${manufacturerId}...`);

                _gasPrice = await getGasPrice(hre);
                const dTx = await ddTableInstance
                    .connect(signer)
                    .createDeviceDefinitionTable(tableOwner, manufacturerId, { gasPrice: _gasPrice });

                await tablelandValidator.pollForReceiptByTransactionHash({
                    chainId: CHAIN_ID[currentNetwork],
                    transactionHash: (await dTx.wait())?.hash as string,
                });

                const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

                console.log(`Device Definition table created\nTable ID: ${ddTableId}\nTable Name: ${ddTableName}`);

                ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);
            }

            const deviceDefinitionByManufacturers = devices.filter((c) => c.make.name === make && c.type.year >= 2005);
            const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);
            const tablelandDeviceDefinitionByManufacturers = await getDeviceDefinitionsByTableName(db, ddTableName);

            console.log(`API Device Definition By Manufacturer [${make}] total => ${deviceDefinitionByManufacturers.length}`);
            console.log(`Tableland Device Definition By Manufacturer [${make}] total => ${tablelandDeviceDefinitionByManufacturers.length}`);

            // Clear empty attributes
            deviceDefinitionByManufacturers.forEach(dd => {
                if (dd.device_attributes) {
                    dd.device_attributes = dd.device_attributes.filter(({ value }) => value);
                }
            });

            // Insert new dd
            const newDeviceDefinitionByManufacturers: any[] = [];
            deviceDefinitionByManufacturers.forEach(element => {
                const dds = tablelandDeviceDefinitionByManufacturers.filter((c) => c.id === element.name_slug);
                if (dds !== undefined && dds.length === 0) {
                    newDeviceDefinitionByManufacturers.push(element);
                }
            });

            // Update dd when change attributes
            const updateDeviceDefinitionByManufacturers: any[] = [];
            deviceDefinitionByManufacturers.forEach(element => {
                const dds = tablelandDeviceDefinitionByManufacturers.filter((c) => c.id === element.name_slug);
                if (dds !== undefined && dds.length > 0) {

                    if (dds[0].metadata.device_attributes) {
                        const different = dds[0].metadata.device_attributes.filter(obj2 => {
                            const obj1 = element.device_attributes.find(item => item.name === obj2.name);
                            return obj1 && obj1.value !== obj2.value;
                        });

                        if (different.length > 0) {
                            updateDeviceDefinitionByManufacturers.push(element);
                        }

                        // If it has no different values, then validate if it has empty values.
                        if (different.length === 0) {
                            const hasEmptyValues = dds[0].metadata.device_attributes.some(({ value }) => !value);
                            if (hasEmptyValues) {
                                updateDeviceDefinitionByManufacturers.push(element);
                            }
                        }

                    }

                }
            });

            // delete dd
            const deleteDeviceDefinitionByManufacturers: any[] = [];
            tablelandDeviceDefinitionByManufacturers.forEach(element => {
                const dds = deviceDefinitionByManufacturers.filter((c) => c.name_slug === element.id);
                if ((dds?.length ?? 0) === 0) {
                    deleteDeviceDefinitionByManufacturers.push(element);
                }
            });

            const batchSize = 50;
            let items = 0;

            if (deleteDeviceDefinitionByManufacturers.length > 0) {
                console.log('\x1b[31m%s\x1b[0m', `Device Definition to delete ${deleteDeviceDefinitionByManufacturers.length} By Manufacturer [${make}]`);

                for (let i = 0; i < deleteDeviceDefinitionByManufacturers.length; i++) {
                    _gasPrice = await getGasPriceWithSleep(hre, 20n, 36500000000n, 5000); // 36.5 gwei
                    console.log(`Deleting [${deleteDeviceDefinitionByManufacturers[i].id}] ...`);
                    const tx = await ddTableInstance.deleteDeviceDefinition(manufacturerId, deleteDeviceDefinitionByManufacturers[i].id, { gasPrice: _gasPrice });

                    await tablelandValidator.pollForReceiptByTransactionHash({
                        chainId: CHAIN_ID[currentNetwork],
                        transactionHash: (await tx.wait())?.hash as string,
                    });
                }
            }

            if (updateDeviceDefinitionByManufacturers.length > 0) {
                const updateBatchSize = 10;
                console.log('\x1b[33m%s\x1b[0m', `Device Definition to update ${updateDeviceDefinitionByManufacturers.length} By Manufacturer [${make}]`);

                const devices = updateDeviceDefinitionByManufacturers.map(function (dd) {
                    const deviceDefinitionInput: DeviceDefinitionInput = {
                        id: dd.name_slug,
                        ksuid: dd.device_definition_id,
                        model: dd.type.model,
                        year: dd.type.year,
                        metadata: JSON.stringify({
                            device_attributes: dd.device_attributes
                        }),
                        deviceType: dd.type.type,
                        imageURI: dd.imageUrl ?? ''
                    };
                    return deviceDefinitionInput;
                });

                for (let i = 0; i < devices.length; i += updateBatchSize) {
                    const nonce = await signer.getNonce()
                    const batch = devices.slice(i, i + updateBatchSize);
                    const batchTxPromise = [];
                    _gasPrice = await getGasPriceWithSleep(hre, 20n, 37000000000n, 5000); // 37 gwei
                    console.log(`Updating ${batch.map(b => b.id)} ...`);

                    for (let j = 0; j < batch.length; j++) {
                        const txPromise = ddTableInstance.updateDeviceDefinition(manufacturerId, batch[j], { gasPrice: _gasPrice, nonce: nonce + j });
                        batchTxPromise.push(txPromise);
                    }

                    console.log('Txs sent. Awaiting response ...')
                    const batchTx = await Promise.all(batchTxPromise);
                    console.log('Awaiting receipts ...')
                    const receipts = await Promise.all(batchTx.map(b => b.wait()));

                    console.log('Receipts got. Awaiting tableland validator ...')
                    for (const receipt of receipts) {
                        await tablelandValidator.pollForReceiptByTransactionHash({
                            chainId: CHAIN_ID[currentNetwork],
                            transactionHash: receipt?.hash as string,
                        });
                    }
                    console.log('Batch updated')

                    await delay(2500); // To prevent tableland too many requests error
                }
            }

            if (newDeviceDefinitionByManufacturers.length > 0) {
                console.log('\x1b[36m%s\x1b[0m', `Device Definition to insert ${newDeviceDefinitionByManufacturers.length} By Manufacturer [${make}]`);

                for (let i = 0; i < newDeviceDefinitionByManufacturers.length; i += batchSize) {
                    const batch = newDeviceDefinitionByManufacturers.slice(i, i + batchSize).map(function (dd) {
                        const deviceDefinitionInput: DeviceDefinitionInput = {
                            id: dd.name_slug,
                            ksuid: dd.device_definition_id,
                            model: dd.type.model,
                            year: dd.type.year,
                            metadata: JSON.stringify({
                                device_attributes: dd.device_attributes
                            }),
                            deviceType: dd.type.type,
                            imageURI: dd.imageUrl ?? ''
                        };
                        return deviceDefinitionInput;
                    });

                    items += batch.length;

                    _gasPrice = await getGasPriceWithSleep(hre, 20n, 36500000000n, 5000); // 36.5 gwei
                    console.log(`Creating [${items}/${newDeviceDefinitionByManufacturers.length}] ...`);
                    const tx = await ddTableInstance.insertDeviceDefinitionBatch(manufacturerId, batch, { gasPrice: _gasPrice });

                    await tablelandValidator.pollForReceiptByTransactionHash({
                        chainId: CHAIN_ID[currentNetwork],
                        transactionHash: (await tx.wait())?.hash as string,
                    });
                }
            }

            if (newDeviceDefinitionByManufacturers.length > 0
                || updateDeviceDefinitionByManufacturers.length > 0
                || deleteDeviceDefinitionByManufacturers.length > 0) {
                const count = await db.prepare(
                    `SELECT COUNT(*) AS total FROM ${ddTableName}`
                ).first<{ total: number }>('total');

                console.log(`${make} => ${ddTableName} total rows: ${count}`);
                console.log(`${make} => ${ddTableName} total upload: ${deviceDefinitionByManufacturers.length}\n`);
            }

            await delay(1000);
        }
    });

async function getDeviceDefinitions() {
    return await axios.get('https://device-definitions-api.dimo.zone/device-definitions/all');
}

function generateSlug(str: string) {
    return str.replace(/\//g, '-');
}

async function getDeviceDefinitionsByTableName(db, ddTableName) {
    const script = `SELECT * FROM ${ddTableName}`;

    const query = await db.prepare(
        script
    ).all();

    return query.results;
}

function delay(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}