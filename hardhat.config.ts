import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import * as tdly from '@tenderly/hardhat-tenderly';

import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-solhint';
import '@openzeppelin/hardhat-upgrades';
import '@tableland/hardhat';
import 'hardhat-contract-sizer';
import 'hardhat-tracer';
import 'hardhat-abi-exporter';

import './scripts/tasks';
import './scripts/linearization';
import './scripts/tableland/tasks';

tdly.setup();
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.13',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      url: process.env.POLYGON_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    amoy: {
      url: process.env.AMOY_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    tenderly: {
      url: process.env.TENDERLY_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  localTableland: {
    silent: false,
    verbose: false,
  },
  tenderly: {
    username: process.env.TENDERLY_USERNAME || '', // tenderly username (or organization name)
    project: process.env.TENDERLY_PROJECT_NAME || '', // project name
    privateVerification: false, // if true, contracts will be verified privately, if false, contracts will be verified publicly
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: process.env.CONTRACT_SIZER !== undefined,
    disambiguatePaths: false,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    coinmarketcap: process.env.COIN_MARKETCAP_API_KEY || '',
    token: 'MATIC',
    showTimeSpent: true,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || '',
    },
    customChains: [
      {
        network: 'polygonAmoy',
        chainId: 80002,
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com/',
        },
      },
    ],
  },
  abiExporter: {
    path: './abis',
    runOnCompile: true,
    only: [
      'contracts/charging/*',
      'contracts/implementations/nodes/*',
      'contracts/streamr/*',
      'contracts/tableland/*',
      ':DevAdmin$',
      ':Mapper$',
      ':MultipleMinter$',
      ':Nodes$',
      ':Shared$',
      ':ManufacturerId$',
      ':AftermarketDeviceId$',
      ':VehicleId$',
      ':IntegrationId$',
      ':SyntheticDeviceId$',
      ':DimoForwarder$',
    ],
    format: 'json',
  },
};

export default config;
