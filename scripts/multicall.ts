import * as fs from 'fs';
import * as path from 'path';
import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { CallContext } from 'ethereum-multicall/dist/esm/models';
import { network } from 'hardhat';
import { ethers } from 'ethers-v5';

import addressesJSON from './data/addresses.json';
import { AddressesByNetwork, GenericKeyAny } from '../utils/types';

const contractAddresses: AddressesByNetwork = addressesJSON;

const providerMapping: GenericKeyAny = {
    'amoy': process.env.AMOY_URL,
    'polygon': process.env.POLYGON_URL
}

function getDimoRegistryAbi() {
    // Load the DimoRegistry ABI from the JSON file
    const abiPath = path.join(__dirname, '../abis/DIMORegistry.json');
    console.log(`\nLoading ABI from: ${abiPath}\n`);

    let dimoRegistryAbi;
    try {
        const abiFile = fs.readFileSync(abiPath, 'utf8');
        dimoRegistryAbi = JSON.parse(abiFile);
    } catch (error) {
        console.error(`Error loading ABI file: ${error}`);
        throw error;
    }

    return dimoRegistryAbi;
}

export async function multicallDimoRegistry(networkName: string, calls: CallContext[]) {
    const provider = new ethers.providers.JsonRpcProvider(providerMapping[networkName]);
    const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

    const contractCallContext: ContractCallContext[] = [
        {
            reference: 'DimoRegistry',
            contractAddress: contractAddresses[networkName].modules.DIMORegistry.address,
            abi: getDimoRegistryAbi(),
            calls: calls
        },
    ];

    try {
        console.log('\nExecuting multicall...');
        const results: ContractCallResults = await multicall.call(contractCallContext);
        console.log('Multicall executed!\n');
        return results.results['DimoRegistry'].callsReturnContext.map(callReturn => callReturn.returnValues)
    } catch (error) {
        console.error('Error executing multicall:');
        console.error(error);
        throw error;
    }
}

// async function main() {
//     try {
//         const callReturns = await multicallDimoRegistry(
//             network.name,
//             [
//                 { reference: 'getParent1', methodName: 'getParentNode', methodParameters: ['0x4804e8D1661cd1a1e5dDdE1ff458A7f878c0aC6D', 1] },
//                 { reference: 'getParent2', methodName: 'getParentNode', methodParameters: ['0x4804e8D1661cd1a1e5dDdE1ff458A7f878c0aC6D', 2] },
//                 { reference: 'getParent3', methodName: 'getParentNode', methodParameters: ['0x4804e8D1661cd1a1e5dDdE1ff458A7f878c0aC6D', 3] },
//                 { reference: 'getParent424', methodName: 'getParentNode', methodParameters: ['0x4804e8D1661cd1a1e5dDdE1ff458A7f878c0aC6D', 153645] },
//             ]
//         );
//         console.log(callReturns)
//     } catch (error) {
//         console.error('Error in main function:', error);
//     }
// }

// main().catch((error) => {
//     console.error('Unhandled error:', error);
//     process.exitCode = 1;
// }).finally(() => {
//     process.exit();
// })