import * as fs from 'fs';
import * as path from 'path';
import { Log, EventLog, ContractTransactionReceipt } from 'ethers';
import { ethers, network, upgrades } from 'hardhat';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import {
    DIMORegistry,
    DimoAccessControl,
    Eip712Checker,
    Manufacturer,
    ManufacturerId
} from '../../typechain-types';
import { getSelectors, AddressesByNetwork, NftArgs } from '../../utils';
import * as C from '../data/deployArgs';
import { makes } from '../data/Makes';

function getAddresses(): AddressesByNetwork {
    return JSON.parse(
        fs.readFileSync(path.resolve(__dirname, 'addresses.json'), 'utf8'),
    );
}

function writeAddresses(addresses: AddressesByNetwork, networkName: string) {
    console.log('\n----- Writing addresses to file -----');

    const currentAddresses: AddressesByNetwork = addresses;
    currentAddresses[networkName] = addresses[networkName];

    fs.writeFileSync(
        path.resolve(__dirname, 'addresses.json'),
        JSON.stringify(currentAddresses, null, 4),
    );

    console.log('----- Addresses written to file -----\n');
}

function buildNftArgs(
    instances: AddressesByNetwork,
    networkName: string,
): NftArgs[] {
    const currentManufacturerIdArgs: NftArgs = C.manufacturerIdArgs;

    currentManufacturerIdArgs.args = [
        ...C.manufacturerIdArgs.args,
        instances[networkName].modules.DIMORegistry.address,
    ];

    return [
        currentManufacturerIdArgs,
    ];
}

async function deployModules(
    deployer: HardhatEthersSigner,
    networkName: string,
): Promise<AddressesByNetwork> {
    console.log('\n----- Deploying contracts -----\n');

    const contractNameArgs = [
        { name: 'Eip712Checker', args: [] },
        { name: 'DimoAccessControl', args: [] },
        { name: 'Nodes', args: [] },
        { name: 'Manufacturer', args: [] },
        { name: 'Mapper', args: [] },
        { name: 'DevAdmin', args: [] },
        { name: 'DeviceDefinitionTable', args: [] },
        { name: 'ERC721Holder', args: [] },
        { name: 'DeviceDefinitionController', args: [] }
    ];

    const instances = getAddresses();

    // Deploy DIMORegistry Implementation
    const DIMORegistry = await ethers.getContractFactory(C.dimoRegistryName);
    const dimoRegistryImplementation =
        await DIMORegistry.connect(deployer).deploy();

    console.log(
        `Contract ${C.dimoRegistryName
        } deployed to ${await dimoRegistryImplementation.getAddress()}`,
    );

    instances[networkName].modules[C.dimoRegistryName].address =
        await dimoRegistryImplementation.getAddress();

    for (const contractNameArg of contractNameArgs) {
        const ContractFactory = await ethers.getContractFactory(
            contractNameArg.name,
        );
        const contractImplementation = await ContractFactory.connect(
            deployer,
        ).deploy(...contractNameArg.args);

        console.log(
            `Contract ${contractNameArg.name
            } deployed to ${await contractImplementation.getAddress()}`,
        );

        instances[networkName].modules[contractNameArg.name].address =
            await contractImplementation.getAddress();
    }

    console.log('\n----- Contracts deployed -----');

    return instances;
}

async function deployNfts(
    deployer: HardhatEthersSigner,
    networkName: string,
): Promise<AddressesByNetwork> {
    console.log('\n----- Deploying NFT contracts -----\n');

    const instances = getAddresses();

    for (const contractNameArg of buildNftArgs(instances, networkName)) {
        const ContractFactory = await ethers.getContractFactory(
            contractNameArg.name,
            deployer,
        );

        await upgrades.validateImplementation(ContractFactory, {
            kind: 'uups',
        });

        const contractProxy = await upgrades.deployProxy(
            ContractFactory,
            contractNameArg.args,
            {
                initializer: 'initialize',
                kind: 'uups',
            },
        );

        console.log(
            `NFT contract ${contractNameArg.name
            } deployed to ${await contractProxy.getAddress()}`,
        );

        instances[networkName].nfts[contractNameArg.name].proxy =
            await contractProxy.getAddress();
        instances[networkName].nfts[contractNameArg.name].implementation =
            await upgrades.erc1967.getImplementationAddress(
                await contractProxy.getAddress(),
            );
    }

    console.log('\n----- NFT contracts deployed -----');

    return instances;
}

async function addModules(
    deployer: HardhatEthersSigner,
    networkName: string,
): Promise<AddressesByNetwork> {
    const instances = getAddresses();

    const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
        'DIMORegistry',
        instances[networkName].modules.DIMORegistry.address,
    );

    const contractsNameImpl = Object.keys(instances[networkName].modules).map(
        (contractName) => {
            return {
                name: contractName,
                implementation: instances[networkName].modules[contractName].address,
            };
        },
    );

    console.log('\n----- Adding modules -----\n');

    for (const contract of contractsNameImpl) {
        const ContractFactory = await ethers.getContractFactory(contract.name);

        const contractSelectors = getSelectors(ContractFactory.interface);

        await dimoRegistryInstance
            .connect(deployer)
            .addModule(contract.implementation, contractSelectors);

        instances[networkName].modules[contract.name].selectors = contractSelectors;

        console.log(`Module ${contract.name} added`);
    }

    console.log('\n----- Modules Added -----');

    return instances;
}

async function setupRegistry(
    deployer: HardhatEthersSigner,
    networkName: string,
) {
    const instances = getAddresses();

    const eip712CheckerInstance: Eip712Checker = await ethers.getContractAt(
        'Eip712Checker',
        instances[networkName].modules.DIMORegistry.address,
    );
    const manufacturerInstance: Manufacturer = await ethers.getContractAt(
        'Manufacturer',
        instances[networkName].modules.DIMORegistry.address,
    );

    console.log('\n----- Initializing EIP712 -----\n');
    await eip712CheckerInstance
        .connect(deployer)
        .initialize(C.eip712Name, C.eip712Version);
    console.log(`${C.eip712Name} and ${C.eip712Version} set to EIP712Checker`);
    console.log('\n----- EIP712 initialized -----');

    console.log('\n----- Setting NFT proxies -----\n');
    await manufacturerInstance
        .connect(deployer)
        .setManufacturerIdProxyAddress(
            instances[networkName].nfts.ManufacturerId.proxy,
        );
    console.log(
        `${instances[networkName].nfts.ManufacturerId.proxy} proxy address set to Manufacturer`,
    );
    console.log('\n----- NFT proxies set -----');
}

async function grantNftRoles(
    deployer: HardhatEthersSigner,
    networkName: string,
) {
    const instances = getAddresses();

    const dimoRegistryAddress =
        instances[networkName].modules.DIMORegistry.address;

    const manufacturerIdInstance = (await ethers.getContractAt(
        'ManufacturerId',
        instances[networkName].nfts.ManufacturerId.proxy,
    )) as ManufacturerId;

    console.log(
        `\n----- Granting ${C.roles.nfts.MINTER_ROLE} role to DIMO Registry ${dimoRegistryAddress} in the ManufacturerId contract -----`,
    );

    await manufacturerIdInstance
        .connect(deployer)
        .grantRole(C.roles.nfts.MINTER_ROLE, dimoRegistryAddress);

    console.log(
        `----- ${C.roles.nfts.MINTER_ROLE} role granted to DIMO Registry ${dimoRegistryAddress} in the ManufacturerId contract -----\n`,
    );
}

async function grantRole(
    deployer: HardhatEthersSigner,
    role: string,
    address: string,
    networkName: string,
) {
    const instances = getAddresses();

    const accessControlInstance: DimoAccessControl = await ethers.getContractAt(
        'DimoAccessControl',
        instances[networkName].modules.DIMORegistry.address,
    );

    console.log(`\n----- Granting ${role} role to ${address} -----`);

    await accessControlInstance.connect(deployer).grantRole(role, address);

    console.log(`----- ${role} role granted to ${address} -----\n`);
}

async function mintBatchManufacturers(
    deployer: HardhatEthersSigner,
    owner: string,
    networkName: string,
) {
    const instances = getAddresses();

    const batchSize = 50;
    const manufacturerInstance: Manufacturer = await ethers.getContractAt(
        'Manufacturer',
        instances[networkName].modules.DIMORegistry.address,
    );

    console.log('\n----- Minting manufacturers -----\n');

    for (let i = 0; i < makes.length; i += batchSize) {
        const batch = makes.slice(i, i + batchSize);

        const tx = await manufacturerInstance
            .connect(deployer)
            .mintManufacturerBatch(owner, batch);
        const receipt = await tx.wait() as ContractTransactionReceipt;

        const ids = receipt?.logs
            ?.filter((log: EventLog | Log) => log instanceof EventLog)
            .map((eventLog: EventLog | Log) =>
                (eventLog as EventLog).args[1].toString(),
            );

        console.log(`Minted ids: ${ids?.join(',')}`);
    }

    console.log('\n----- Manufacturers minted -----\n');
}

async function main() {
    const [deployer] = await ethers.getSigners();
    const networkName = network.name;

    const moduleInstances = await deployModules(deployer, networkName);
    writeAddresses(moduleInstances, networkName);
    const nftInstances = await deployNfts(deployer, networkName);
    writeAddresses(nftInstances, networkName);

    const instancesWithSelectors = await addModules(deployer, networkName);
    writeAddresses(instancesWithSelectors, networkName);

    const instances = getAddresses();

    await grantRole(deployer, C.roles.ADMIN_ROLE, deployer.address, networkName);
    await grantRole(
        deployer,
        C.roles.modules.MINT_MANUFACTURER_ROLE,
        deployer.address,
        networkName,
    );
    // await grantRole(
    //     deployer,
    //     C.roles.DEFAULT_ADMIN_ROLE,
    //     instances[networkName].misc.Kms,
    //     networkName,
    // );
    // await grantRole(
    //     deployer,
    //     C.roles.DEFAULT_ADMIN_ROLE,
    //     instances[networkName].misc.Foundation,
    //     networkName,
    // );
    // await grantRole(
    //     deployer,
    //     C.roles.ADMIN_ROLE,
    //     instances[networkName].misc.Foundation,
    //     networkName,
    // );
    await setupRegistry(deployer, networkName);
    await grantNftRoles(deployer, networkName);
    await mintBatchManufacturers(
        deployer,
        deployer.address,
        networkName,
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}).finally(() => {
    process.exit();
});
