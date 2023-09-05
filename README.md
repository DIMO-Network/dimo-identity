# DIMO Identity

## Documentation

- [Dimo documentation](https://docs.dimo.zone/docs)

## How to run

You can execute the following commands to build the project and run additional scripts:

```sh
# Installs dependencies
npm i

# Clears cache, compiles contracts, generates typechain files and NFT ABIs
npm run build

# Outputs contract sizes
npm run contract-sizer

# Commands to check and fix linting errors in typescript and solidity files
npm run lint
npm run lint:ts
npm run lint:ts:fix
npm run lint:sol
npm run lint:sol:fix
```

You can deploy the whole system running the following script, where `network_name` is one of the networks available in [hardhat.config.ts](./hardhat.config.ts). Deployed contract addresses will be written in [scripts/data/addresses.json](./scripts/data/addresses.json):

```sh
npx hardhat run scripts/deploy.ts --network '<network_name>'
```

You can more easily add/remove/update modules and update NFTs using the following script. Just make sure to update the `main` function accordingly:

```sh
npx hardhat run scripts/deployModule.ts --network '<network_name>'
```

You can also verify contracts in etherscan/polygonscan/etc running the following command. Remove `<constructor_arguments>` if there isn't any.

```sh
npx hardhat verify '<deployed_contract_address>' '<constructor_arguments>' --network '<network_name>'

# Use this flag to specify the contract implementation if needed
npx hardhat verify '<deployed_contract_address>' '<constructor_arguments>' --network '<network_name>' --contract '<contract_path>:<contract_name>'
```

## Testing

The test suite is organized in different files according to the contract name `<ContractName>.test.ts`. Each file groups the tests by function name, covering, respectively, reverts, state modification and events. You can run the test suite with the following commands:

```sh
# Runs test suite
npm run test

# Runs solidity coverage
npm run coverage
```

## ABI generator

The DIMO identity architecture uses the `DIMORegistry` contract as an entry point to any module of the system. To interact with DIMO identity, then, a massive ABI containing all available functions is needed. You can generated this ABI running the follwing command:

```sh
npx hardhat run scripts/abiGenerator.ts
```

The output file will be saved in `./abis/DimoRegistry.json`.

### Go ABI

To regenerate the Go bindings for, e.g., [the devices API](https://github.com/DIMO-Network/devices-api/blob/main/internal/contracts/registry.go), you would run

```sh
abigen --abi abis/DimoRegistry.json --out registry.go --pkg contracts --type Registry
```

and copy over that file.
