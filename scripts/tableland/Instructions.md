## Running Tableland locally

Make sure you have the node lts version. The current version is not caompatible with Tableland.
npm --version

Install the dependencies. We need to force here due to some compatibility issues with the @tableland/local ^2.1.0-pre.0 version
npm install --force

Build the project
npm run build

Run tests to make sure everything is working fine
npm run test-parallel // Replace by npm run test

This will run setup everything tableland needs locally. Registry and Validator
npx local-tableland

npx hardhat run scripts/deployLocalTableland.ts

#### Running tasks

npx hardhat mint-manufacturers --help

npx hardhat create-dd-table --help

### :tipping_hand_person: Help links
- [Node version manager](https://www.npmjs.com/package/n)
- [Local Tableland Docs](https://docs.tableland.xyz/local-tableland/)