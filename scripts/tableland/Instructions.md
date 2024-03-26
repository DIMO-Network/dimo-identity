## :file_cabinet: Running Tableland locally

Make sure you have the node lts version. The current version is not caompatible with Tableland. This is a nice [Node version manager](https://www.npmjs.com/package/n).
```bash
npm --version
```

Install the dependencies.
```bash
npm install
```

#### :slightly_smiling_face: Making sure everything is fine

Build the project to generate the artifacts. You should be able to see over 100 Solidity files compiled.
```
npm run build
```

Run tests to make sure everything is working fine. You should see over <span style="color:#67e480; font-weight:bold">600 tests passed successully</span>.
```bash
npm run test
```

#### :runner: Running local Tableland

This will run setup everything tableland needs locally. The following command starts two services:
- `Registry`
    - Will be running on http://127.0.0.1:8545/
    - A `hardhat` instance will be created here and all existing Tableland contracts will be mocked. The main is `TablelandTables` that is responsible for emitting CRUD events to be listened by the `Validator` and mutate the SQL tables.
- `Validator`: 
    - Will be running on http://127.0.0.1:8080/
    - This is the web2 service that is going to listen to the smart contract events and manage de SQL tables.

```bash
npx local-tableland
```

You will see some <span style="color:#a4ffff; font-weight:bold">Registry</span> and <span style="color:#e7de79; font-weight:bold">Validator</span> outputs and everything must be ready when you see:
```
******  Tableland is running!  ******
             _________
         ___/         \
        /              \
       /                \
______/                  \______
```

Now, in a second terminal, you can run the deploy script to setup everything you need from `DIMO Registry`:

```bash
npx hardhat run scripts/tableland/deployLocalTableland.ts --network localhost
```

It will deploy a couple of contracts, grant some roles and mint several manufacturers. You should see some outputs both in the tableland terminal and the on you ran the command. All deployed contracts addresses and selectors will written in `/scripts/tableland/addresses.json`, **please don't modify this file**. 

#### :pick: Running tasks

With eveything running and needed contracts deployed, you will able to interact with it in local environment. There are two available tasks that you can run in your terminal.

You can mint as many manufacturers you want

```bash
npx hardhat mint-manufacturers --help # To output some help infos
npx hardhat --network localhost mint-manufacturer manufacturerNameExample
```

You should see an output similar to the following:

```
Minting manufacturer manufacturerNameExample for 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266...
Manufacturer manufacturerNameExample minted with ID: 142
```

Then, you can create a Device Definition table for any minted manufacturer using its NFT ID as parameter. Note that is not possible to have more than one Device Definition Table per manufacturer, it will throw an error if you try to create another table for the same manufacturer. So, feel free to mint as many manufacturers you need with the previous command, or use any of the minted manufacturers during the deploying script.

```bash
npx hardhat create-dd-table --help # To output some help infos
npx hardhat --network localhost create-dd-table 142 # The table owner will be the caller
npx hardhat --network localhost create-dd-table 142 --table-owner 0xffffffffffffffffffffffffffffffffffffffff # Specify table owner
```

You should see an output similar to the following:

```
Creating Device Definition table for manufacturer ID 142...
Device Definition table created
Table ID: 2
Table Name: _31337_2
Table Owner: 0xffffffffffffffffffffffffffffffffffffffff
```

### :tipping_hand_person: Help links
- [Node version manager](https://www.npmjs.com/package/n)
- [Local Tableland Docs](https://docs.tableland.xyz/local-tableland/)
- [Tableland SDK](https://docs.tableland.xyz/sdk/)