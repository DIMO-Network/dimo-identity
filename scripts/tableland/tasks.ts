import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { getAccounts, getDatabase, getValidator } from '@tableland/local';

import { Manufacturer, DeviceDefinitionTable } from '../../typechain-types';
import { AddressesByNetwork, DeviceDefinitionInput, StringNumber } from '../../utils';
import { makes } from '../data/Makes';

const VALID_NETWORKS = ['localhost', 'mumbai']
const CHAIN_ID: StringNumber = {
    'localhost': 31337,
    'mumbai': 80001
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

async function getGasPrice(hre: HardhatRuntimeEnvironment, bump: bigint = 20n): Promise<string> {
    const price = (await hre.ethers.provider.getFeeData()).gasPrice as bigint;

    return (price * bump / 100n + price).toString();
}

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

        const tablelandDb = getDatabase(getAccounts()[0]);
        const tablelandValidator = getValidator(tablelandDb.config.baseUrl);

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


task('migration-tableland', 'npx hardhat migration-tableland --network localhost')
    .setAction(async (args, hre) => {
        const currentNetwork = hre.network.name;
        hre.ethers.provider
        validateNetwork(currentNetwork);

        let _gasPrice;
        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();
        const tableOwner = await signer.getAddress();

        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        const tablelandDb = getDatabase(getAccounts()[0]);
        const tablelandValidator = getValidator(tablelandDb.config.baseUrl);

        console.log(`Total manufacturers ${makes.length}...`);

        console.log('Get device definitions...');
        const devices = (await getDeviceDefinitions()).data.device_definitions;
        console.log(`Total device definitions ${devices.length}...`);

        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        for await (const element of makes) {
            const manufacturerId = await manufacturerInstance
                .connect(signer)
                .getManufacturerIdByName(element);

            let ddTableId = await ddTableInstance.getDeviceDefinitionTableId(manufacturerId);

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
            }

            const ddTableName = await ddTableInstance.getDeviceDefinitionTableName(manufacturerId);

            console.log(`Device Definition table created\nTable ID: ${ddTableId}\nTable Name: ${ddTableName}`);

            const deviceDefinitionByManufacturers = devices.filter((c) => c.make.name === element && c.type.year > 2006);
            console.log(`Get Device Definition By Manufacturer [${element}] total => ${deviceDefinitionByManufacturers.length}`);

            const batchSize = 50;
            let items = 0;
            for (let i = 0; i < deviceDefinitionByManufacturers.length; i += batchSize) {
                const batch = deviceDefinitionByManufacturers.slice(i, i + batchSize).map(function (dd) {
                    const deviceDefinitionInput: DeviceDefinitionInput = {
                        id: `${dd.type.model_slug}_${dd.type.year}`,
                        ksuid: dd.device_definition_id,
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

                _gasPrice = await getGasPrice(hre);
                console.log(`Creating [${deviceDefinitionByManufacturers.length}/${items}] ...`);
                await ddTableInstance.insertDeviceDefinitionBatch(manufacturerId, batch, { gasPrice: _gasPrice });
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
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        const instances = getAddresses(currentNetwork);
        const [signer] = await hre.ethers.getSigners();

        const manufacturerInstance: Manufacturer = await hre.ethers.getContractAt(
            'Manufacturer',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        const tablelandDb = getDatabase(getAccounts()[0]);

        console.log(`Query to manufacturer table [${args.name}] for ${signer.address}...`);

        const ddTableInstance: DeviceDefinitionTable = await hre.ethers.getContractAt(
            'DeviceDefinitionTable',
            instances[currentNetwork].modules.DIMORegistry.address,
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