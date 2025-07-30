import * as fs from 'fs';
import * as path from 'path';
import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { CallContext, ContractCallReturnContext } from 'ethereum-multicall/dist/esm/models';
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

export async function multicallDimoRegistry(networkName: string, calls: CallContext[]): Promise<ContractCallReturnContext> {
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
        
        return results.results['DimoRegistry']
    } catch (error) {
        console.error('Error executing multicall:');
        console.error(error);
        throw error;
    }
}