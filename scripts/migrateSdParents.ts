import { ethers, network } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import addressesJSON from './data/addresses.json';
import { connections } from './data/Connections';
import { AddressesByNetwork } from '../utils';
import { multicallDimoRegistry } from './multicall'
import { getAccounts } from './helpers';

const contractAddresses: AddressesByNetwork = addressesJSON;

/**
 * Retrieves parent nodes for a list of synthetic device IDs using multicall batching.
 * 
 * This function fetches the parent node information for each synthetic device ID by making
 * batched calls to the blockchain. It uses multicall to optimize network requests and
 * processes the results to return a standardized format.
 * 
 * @param sdIds - Array of synthetic device IDs as strings to fetch parent nodes for
 * @param networkName - The blockchain network name to connect to (e.g., 'polygon', 'amoy')
 * @param batchSize - Maximum number of IDs to process in a single multicall batch (default: 100)
 * @returns An array of objects containing each synthetic device ID and its corresponding parent node ID
 *          in the format: `{ id: string, parentNode: string }`
 */
async function getSdParents(sdIds: string[], networkName: string, batchSize: number = 100) {
    console.log(`\nGetting parent nodes for ${sdIds.length} synthetic device IDs on ${networkName}`);
    console.log(`Using batch size of ${batchSize}`);

    const sdIdProxyAddress = contractAddresses[networkName].nfts.SyntheticDeviceId.proxy
    console.log(`SyntheticDeviceId proxy address: ${sdIdProxyAddress}`);

    const results = []
    let ids;
    for (let i = 0; i < sdIds.length; i += batchSize) {
        ids = sdIds.slice(i, i + batchSize)
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sdIds.length / batchSize)}: IDs ${i + 1} to ${Math.min(i + batchSize, sdIds.length)}`);

        const calls = ids.map(id => {
            return {
                reference: 'parentNode',
                methodName: 'getParentNode',
                methodParameters: [sdIdProxyAddress, id],
            }
        })

        console.log(`Executing multicall for ${calls.length} IDs...`);
        const multicallResult = await multicallDimoRegistry(networkName, calls);

        // Create paired objects with methodParameters and returnValues
        const pairedResults = multicallResult.callsReturnContext.map((callReturn, index) => {
            // Convert hex to decimal string to handle large numbers properly
            const hexValue = callReturn.returnValues[0].hex;
            // Remove '0x' prefix and convert to decimal string
            const decimalString = hexValue.startsWith('0x') ?
                BigInt(hexValue).toString() :
                BigInt('0x' + hexValue).toString();

            return {
                id: multicallResult.originalContractCallContext.calls[index].methodParameters[1], // The ID parameter
                parentNode: decimalString, // The parent node value as decimal string
            };
        });

        results.push(...pairedResults);
    }

    console.log(`Completed fetching parent nodes. Total results: ${results.length}\n`);
    return results
}

/**
 * Identifies synthetic devices that need to be migrated by finding those with parent nodes.
 * 
 * This function generates a sequence of synthetic device IDs up to the specified maximum,
 * then fetches their parent node information. It filters the results to return only
 * devices that have valid parent nodes (non-zero values), which are the ones that
 * require migration.
 * 
 * @param maxId - The maximum synthetic device ID to check (will process IDs from 1 to maxId)
 * @param networkName - The blockchain network name to connect to (e.g., 'polygon', 'amoy')
 * @param batchSize - Maximum number of IDs to process in a single batch when fetching parent nodes (default: 100)
 * @returns An array of objects containing synthetic device IDs and their parent nodes
 *          in the format: `{ id: string, parentNode: string }`, filtered to include only
 *          devices with non-zero parent nodes
 */
async function getSdsToMigrate(maxId: number, networkName: string, batchSize: number = 100) {
    console.log(`\nStarting migration process on network ${networkName} for ${maxId} synthetic devices`);

    const sdIds = Array.from({ length: maxId }, (_, i) => (i + 1).toString());
    console.log(`Generated ${sdIds.length} IDs for processing`);

    console.log('Fetching parent nodes for all synthetic devices...');
    const results = await getSdParents(sdIds, networkName, batchSize);

    // Get devices with parents
    const devicesWithParents = results.filter(result =>
        result && result.parentNode !== '0'
    );

    console.log(`Found ${devicesWithParents.length} devices with parent nodes out of ${results.length} total devices\n`);

    return devicesWithParents;
}

/**
 * Migrates synthetic device parent nodes to the new connection-based structure.
 * 
 * This function identifies synthetic devices that need migration, groups them by
 * integration ID, and processes them in batches. For each batch, it calls the
 * adminMigrateSdParents function on the DevAdmin contract to update the parent
 * relationship from integration nodes to connection nodes.
 * 
 * @param signer - The Ethereum signer with admin permissions to execute the migration
 * @param maxId - The maximum synthetic device ID to check for migration (will process IDs from 1 to maxId)
 * @param networkName - The blockchain network name to connect to (e.g., 'polygon', 'amoy')
 * @param devAdminBatchSize - Maximum number of devices to include in a single contract call (default: 100)
 * @param multicallBatchSize - Maximum number of IDs to process in a single batch when fetching parent nodes (default: 500)
 * @returns A Promise that resolves when the migration is complete
 */
async function migrateSdParents(
    signer: HardhatEthersSigner,
    maxId: number,
    networkName: string,
    devAdminBatchSize: number = 100,
    multicallBatchSize: number = 500
) {
    console.log(`\nStarting SD parent migration with batch size ${devAdminBatchSize}`);
    const sdsToMigrate = await getSdsToMigrate(maxId, networkName, multicallBatchSize);

    if (sdsToMigrate.length === 0) {
        console.log('No synthetic devices need migration. Exiting.');
        return;
    }

    console.log(`Found ${sdsToMigrate.length} synthetic devices to migrate`);

    const devAdminInstance = await ethers.getContractAt(
        'DevAdmin',
        contractAddresses[networkName].modules.DIMORegistry.address,
        signer
    );

    // Integration ID to Connection ID mapping
    const integrationConnectionMap: Record<string, string> = {
        '1': connections['Smartcar'].connectionId,
        '2': connections['Tesla'].connectionId,
        '3': connections['CompassIoT'].connectionId,
        '4': connections['Motorq'].connectionId,
        '5': connections['Staex'].connectionId,
    };

    // Group SDs by parent node (integration ID)
    const sdsByIntegration: Record<string, string[]> = {};

    for (const sd of sdsToMigrate) {
        const integrationId = sd.parentNode;
        if (!sdsByIntegration[integrationId]) {
            sdsByIntegration[integrationId] = [];
        }
        sdsByIntegration[integrationId].push(sd.id);
    }

    console.log(`Grouped synthetic devices by ${Object.keys(sdsByIntegration).length} integration IDs`);

    // Process each integration group
    for (const [integrationId, sdIds] of Object.entries(sdsByIntegration)) {
        const connectionId = integrationConnectionMap[integrationId];

        if (!connectionId) {
            console.warn(`No connection ID mapping found for integration ID ${integrationId}. Skipping ${sdIds.length} devices.`);
            continue;
        }

        console.log(`\nProcessing integration ID ${integrationId} with connection ID ${connectionId}`);
        console.log(`Total devices for this integration: ${sdIds.length}`);

        // Process in batches
        for (let i = 0; i < sdIds.length; i += devAdminBatchSize) {
            const batchIds = sdIds.slice(i, i + devAdminBatchSize);
            console.log(`Processing batch ${Math.floor(i / devAdminBatchSize) + 1}/${Math.ceil(sdIds.length / devAdminBatchSize)}: ${batchIds.length} devices`);

            try {
                // Call adminMigrateSdParents with the batch
                const tx = await devAdminInstance.adminMigrateSdParents(
                    batchIds,
                    integrationId,
                    connectionId
                );

                console.log(`Transaction submitted: ${tx.hash}`);
                console.log('Waiting for confirmation...');

                const receipt = await tx.wait();
                console.log(`Transaction confirmed in block ${receipt?.blockNumber}`);
                console.log(`Gas used: ${receipt?.gasUsed.toString()}`);
            } catch (error) {
                console.error(`Error migrating batch starting at ID ${batchIds[0]}:`, error);
                // Continue with next batch despite errors
            }
        }
    }

    console.log('\nMigration completed!');
}

async function main() {
    console.log(`Starting migration script on network: ${network.name}`);

    try {
        const forkNetworkName = 'polygon'
        const [signer] = await getAccounts(network.name, forkNetworkName)

        console.log(`Using signer: ${signer.address}`);

        // 423 Amoy num
        // 166780 Polygon num
        const maxId = 500;
        const devAdminBatchSize = 500;
        const multicallBatchSize = 5000;

        await migrateSdParents(signer, maxId, forkNetworkName, devAdminBatchSize, multicallBatchSize);

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Error during migration:', error);
    }
}

main().catch((error) => {
    console.error('Fatal error in main execution:', error);
    process.exitCode = 1;
}).finally(() => {
    console.log('Script execution completed');
    process.exit();
})