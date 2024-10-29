import * as fs from 'fs';
import * as path from 'path';
import { task } from 'hardhat/config';
import { EventLog } from 'ethers';

import { Vehicle } from '../typechain-types';
import { AddressesByNetwork } from '../utils';

const VALID_NETWORKS = ['localhost', 'polygon', 'amoy']

function getAddresses(): AddressesByNetwork {
    const addressesPath = path.resolve(__dirname, 'data', 'addresses.json');

    return JSON.parse(
        fs.readFileSync(addressesPath, 'utf8'),
    );
}

function validateNetwork(currentNetwork: string) {
    if (!VALID_NETWORKS.includes(currentNetwork)) {
        throw new Error(`Invalid network <${currentNetwork}>\nMake sure to add the flag "--network [${VALID_NETWORKS}]"\n`)
    }
}

task('mint-vehicle', 'Mints a new Vehicle')
    .addOptionalParam('owner', 'The address to which the vehicle will be minted')
    .setAction(async (args: { owner: string | undefined }, hre) => {
        const currentNetwork = hre.network.name;
        validateNetwork(currentNetwork);

        const instances = getAddresses();
        const [signer] = await hre.ethers.getSigners();
        const owner = args.owner ?? signer.address;
        const vehicleInstance: Vehicle = await hre.ethers.getContractAt(
            'Vehicle',
            instances[currentNetwork].modules.DIMORegistry.address,
        );

        console.log(`Minting vehicle for ${owner}...`);

        const tx = await vehicleInstance
            .connect(signer)
        ['mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string))'](
            131,
            owner,
            'toyota_4runner_2024',
            [
                {
                    attribute: 'Make',
                    info: 'Toyota'
                },
                {
                    attribute: 'Model',
                    info: '4Runner'
                },
                {
                    attribute: 'Year',
                    info: '2024'
                }
            ],
            {
                grantee: signer.address,
                permissions: '16332',
                expiration: '2770227412',
                source: 'ipfs'
            }
        )
        const receipt = await tx.wait();
        const vehicleId = (receipt?.logs[1] as EventLog).args[1].toString();

        console.log(`Vehicle minted with ID: ${vehicleId}`);
    });
