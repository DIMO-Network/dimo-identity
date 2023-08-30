import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';
import * as tdly from '@tenderly/hardhat-tenderly';
import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'hardhat-contract-sizer';
import 'hardhat-tracer';
import 'hardhat-abi-exporter';

// eslint-disable-next-line node/no-unpublished-import
import './scripts/linearization';

tdly.setup();
dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.13',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    polygon: {
      url: process.env.POLYGON_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    mumbai: {
      url: process.env.MUMBAI_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    tenderly: {
      url: process.env.TENDERLY_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  tenderly: {
    username: process.env.TENDERLY_USERNAME || '', // tenderly username (or organization name)
    project: process.env.TENDERLY_PROJECT_NAME || '', // project name
    privateVerification: true // if true, contracts will be verified privately, if false, contracts will be verified publicly
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: process.env.CONTRACT_SIZER !== undefined,
    disambiguatePaths: false
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    coinmarketcap: process.env.COIN_MARKETCAP_API_KEY || '',
    token: 'MATIC',
    showTimeSpent: true
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || ''
    }
  },
  abiExporter: {
    path: './abis',
    runOnCompile: true,
    only: [
      ':ManufacturerId$',
      ':AftermarketDeviceId$',
      ':VehicleId$',
      ':IntegrationId$',
      ':SyntheticDeviceId$',
      ':DimoForwarder$'
    ],
    format: 'json'
  }
};

export default config;
