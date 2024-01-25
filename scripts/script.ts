import { ethers, network } from 'hardhat';

import { streamRegistryABI, streamRegistryBytecode, ensRegistryABI, ensRegistryBytecode, ENSCacheV2ABI, ENSCacheV2Bytecode } from '@streamr/network-contracts'
import type { StreamRegistry, ENSCacheV2 } from '@streamr/network-contracts'

import {
  DIMORegistry,
  Manufacturer,
  Vehicle,
  AftermarketDevice,
  DimoAccessControl,
  Mapper,
  ManufacturerId,
  VehicleId,
  AftermarketDeviceId,
  DimoForwarder,
  StreamrConfigurator,
  VehicleStream,
  DevAdmin
} from '../typechain-types';
import { AddressesByNetwork } from '../utils';
import * as C from './data/deployArgs';
import addressesJSON from './data/addresses.json';

const contractAddresses: AddressesByNetwork = addressesJSON;

async function main() {
  // eslint-disable-next-line prefer-const
  let [deployer, shaolin, user1, user, shared] = await ethers.getSigners();
  let currentNetwork = network.name;

  if (
    network.name === 'hardhat' ||
    network.name === 'localhost' ||
    network.name === 'tenderly'
  ) {
    currentNetwork = 'mumbai';

    // 0xCED3c922200559128930180d3f0bfFd4d9f4F123 gnosis
    // 0x1741eC2915Ab71Fc03492715b5640133dA69420B DIMO deployer
    // 0xA363478EB480F1a311C777Abadc466b6190433D2 Shared
    // 0xC0F28DA7Ae009711026C648913eB17962fd96dD7 Malte's gnosis
    deployer = await ethers.getImpersonatedSigner(
      '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
    );
    shaolin = await ethers.getImpersonatedSigner(
      '0xa9395ebb1fd55825023934e683cefd6f3f279137'
    );
    user = await ethers.getImpersonatedSigner(
      '0xB8E514da5E7b2918AebC139ae7CbEFc3727f05D3'
    );
    shared = await ethers.getImpersonatedSigner(
      '0xA363478EB480F1a311C777Abadc466b6190433D2'
    );

    await user1.sendTransaction({
      to: deployer.address,
      value: ethers.parseEther('10')
    });
    await user1.sendTransaction({
      to: shaolin.address,
      value: ethers.parseEther('10')
    });
    await user1.sendTransaction({
      to: user.address,
      value: ethers.parseEther('10')
    });
    await user1.sendTransaction({
      to: shared.address,
      value: ethers.parseEther('10')
    });
  }

  const dimoRegistryInstance: DIMORegistry = await ethers.getContractAt(
    'DIMORegistry',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const dimoAccessControlInstance: DimoAccessControl =
    await ethers.getContractAt(
      'DimoAccessControl',
      contractAddresses[currentNetwork].modules.DIMORegistry.address
    );
  const manufacturerInstance: Manufacturer = await ethers.getContractAt(
    'Manufacturer',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  // const manufacturerIdInstance: ManufacturerId = await ethers.getContractAt(
  //   'ManufacturerId',
  //   contractAddresses[currentNetwork].nfts.ManufacturerId.proxy
  // );
  const aftermarketDevice: AftermarketDevice = await ethers.getContractAt(
    'AftermarketDevice',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  // const aftermarketDeviceIdInstance: AftermarketDeviceId =
  //   await ethers.getContractAt(
  //     'AftermarketDeviceId',
  //     contractAddresses[currentNetwork].nfts.AftermarketDeviceId.proxy
  //   );
  const vehicleIdInstance: VehicleId = await ethers.getContractAt(
    'VehicleId',
    contractAddresses[currentNetwork].nfts.VehicleId.proxy
  );
  const dimoForwarder: DimoForwarder = await ethers.getContractAt(
    'DimoForwarder',
    contractAddresses[currentNetwork].misc.DimoForwarder.proxy
  );
  const streamrConfiguratorInstance: StreamrConfigurator = await ethers.getContractAt(
    'StreamrConfigurator',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const devAdminInstance: DevAdmin = await ethers.getContractAt(
    'DevAdmin',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );
  const vehicleStreamInstance: VehicleStream = await ethers.getContractAt(
    'VehicleStream',
    contractAddresses[currentNetwork].modules.DIMORegistry.address
  );

  // const ensCacheFactory = new ethers.ContractFactory(ENSCacheV2ABI,ENSCacheV2Bytecode)
  // const ensCacheInstance = ensCacheFactory.attach('0x5eeb458843D4dE852f295ED8cb01BAd3b464bB67') as unknown as ENSCacheV2
  
  // console.log(await ensCacheInstance.functions.owners('streams.dev.dimo.eth'))


  // 0xA363478EB480F1a311C777Abadc466b6190433D2
  console.log(await vehicleStreamInstance.getVehicleStream(82))
  console.log(await vehicleStreamInstance.getVehicleStream(81))
  console.log(await vehicleStreamInstance.getVehicleStream(77))
  console.log(await vehicleStreamInstance.getVehicleStream(137))

  
  // await streamrConfiguratorInstance.connect(deployer).setDimoBaseStreamId('streams.dev.dimo.eth')
  // console.log(await streamrConfiguratorInstance.getStorage())
  // await streamrConfiguratorInstance.connect(deployer).setDimoStreamrNode('0x3F3ab5A20F704D6e7299EdEE84200fDA5d849BE7')
  // await streamrConfiguratorInstance.connect(deployer).setStreamRegistry('0x4F0779292bd0aB33B9EBC1DBE8e0868f3940E3F2')
  // await vehicleStreamInstance.connect(user).createVehicleStream(137);
  // console.log(await vehicleIdInstance.ownerOf(137))

  // await dimoAccessControlInstance.connect(deployer).grantRole(ethers.keccak256(ethers.toUtf8Bytes('DEV_CACHE_ENS')),deployer.address)

  console.log('here')
  const tx = await devAdminInstance.connect(deployer).adminCacheDimoStreamrEns();
  console.log('here')

  console.log((await tx.wait())?.logs)

  // await streamrConfiguratorInstance
  //   .connect(deployer)
  //   .setStreamRegistry(contractAddresses[currentNetwork].misc.StreamRegistry);

  // console.log(await dimoAccessControlInstance.hasRole('0x6d5d0ae5495b341d16352c2d77b29976a1e74ee59c853907f14c3a02c2f94caf'))

  // await vehicleIdInstance
  //   .connect(deployer)
  //   .setTrustedForwarder('0xA6D4a36CECAdd7b23C7B6DC2377746D08cf5a609', true);
  // console.log(
  //   await vehicleIdInstance.trustedForwarders(
  //     '0xA6D4a36CECAdd7b23C7B6DC2377746D08cf5a609'
  //   )
  // );
  // await vehicleIdInstance
  //   .connect(deployer)
  //   .setSyntheticDeviceIdAddress('0x4804e8D1661cd1a1e5dDdE1ff458A7f878c0aC6D');
  // await vehicleIdInstance
  //   .connect(deployer)
  //   .setDimoRegistryAddress('0xFA8beC73cebB9D88FF88a2f75E7D7312f2Fd39EC');
  // console.log(await vehicleIdInstance.ownerOf(7));

  // await vehicleIdInstance
  //   .connect(shaolin)
  //   .transferFrom(
  //     '0x627E17D6715357E7058AB5AD8d7A1CD1Ca99D3d7',
  //     '0x55F5257Ca1Fdc5d0079db7317122DF73857b2fFD',
  //     7
  //   );

  // console.log(await vehicleIdInstance.ownerOf(2372));
  // console.log(await aftermarketDeviceIdInstance.ownerOf(2726));

  // await dimoForwarder
  //   .connect(shaolin)
  //   .transferVehicleAndAftermarketDeviceIds(
  //     20497,
  //     1355,
  //     '0x26C80CC193B27d73D2C40943Acec77F4DA2c5bd8'
  //   );

  // console.log(await manufacturerIdInstance.privilegeRecord(1));
  // console.log(await manufacturerIdInstance.privilegeRecord(2));
  // console.log(await manufacturerIdInstance.privilegeRecord(3));
  // console.log(await manufacturerIdInstance.ownerOf(137));
  // console.log(
  //   await manufacturerIdInstance.privilegeEntry(
  //     137,
  //     1,
  //     2,
  //     '0x1FEf0Af90412993e9eBce447F32D6c4Ca46D1331'
  //   )
  // );
  // console.log(
  //   await manufacturerIdInstance.privilegeExpiresAt(
  //     137,
  //     2,
  //     '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  //   )
  // );

  // console.log(aftermarketDevice.address)
  // await aftermarketDevice.connect(deployer).addAftermarketDeviceAttribute('HardwareRevision');
  // await aftermarketDevice.connect(deployer).addAftermarketDeviceAttribute('DevEUI');

  // console.log(await manufacturerIdInstance.ownerOf(137));
  // console.log(await aftermarketDeviceIdInstance.exists(12538));
  // console.log(await aftermarketDevice.isAftermarketDeviceClaimed(12538));

  // console.log(
  //   await manufacturerIdInstance.hasRole(
  //     '0x0000000000000000000000000000000000000000000000000000000000000000',
  //     '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  //   )
  // );

  // console.log(await ethers.provider.getBlockNumber());

  // console.log(
  //   await manufacturerIdInstance.hasPrivilege(
  //     137,
  //     2,
  //     '0x1FEf0Af90412993e9eBce447F32D6c4Ca46D1331'
  //   )
  // );

  // await aftermarketDevice.connect(deployer).claimAftermarketDeviceBatch(137, [
  //   {
  //     aftermarketDeviceNodeId: 12538,
  //     owner: '0xba86b83996d5d5da8b91fbbc4b0f61776669b8ad'
  //   }
  // ]);

  // await tenderly.verify({
  //   address: '0x3b07e2a2abdd0a9b8f7878bde6487c502164b9dd',
  //   name: 'ManufacturerId'
  // });

  // console.log(
  //   await dimoAccessControlInstance.hasRole(
  //     '0x0f4c2e0ad598955b174104bff0c113d7290424c29bc20298b55fc37a5def0b89',
  //     '0x74cb2b8ed0c1789d84ef701921d1152e592c330c'
  //   )
  // );

  // await dimoAccessControlInstance.grantRole(
  //   '0x0f4c2e0ad598955b174104bff0c113d7290424c29bc20298b55fc37a5def0b89',
  //   '0x74cb2b8ed0c1789d84ef701921d1152e592c330c'
  // );

  // console.log(await manufacturerInstance.getManufacturerNameById(140));
  // console.log(await manufacturerInstance.getManufacturerNameById(141));
  // console.log(await manufacturerInstance.getManufacturerNameById(142));
  // console.log(await manufacturerInstance.getManufacturerNameById(144));
  // console.log(await manufacturerInstance.getManufacturerNameById(144));
  // console.log(await manufacturerInstance.getManufacturerNameById(145));
  // console.log(await manufacturerInstance.getManufacturerNameById(146));

  // console.log(await manufacturerIdInstance.ownerOf(135));
  // console.log(await manufacturerIdInstance.ownerOf(136));
  // console.log(await manufacturerIdInstance.ownerOf(137));
  // console.log(await manufacturerIdInstance.ownerOf(138));
  // console.log(await manufacturerIdInstance.ownerOf(139));
  // console.log(await manufacturerIdInstance.ownerOf(140));
  // console.log(await manufacturerIdInstance.ownerOf(141));
  // console.log(await manufacturerIdInstance.ownerOf(142));
  // console.log(await manufacturerIdInstance.ownerOf(143));
  // console.log(await manufacturerIdInstance.ownerOf(144));
  // console.log(await manufacturerIdInstance.ownerOf(145));
  // console.log(await manufacturerIdInstance.ownerOf(146));
  // console.log(await manufacturerIdInstance.ownerOf(147));

  // console.log(
  //   await dimoAccessControlInstance.hasRole(
  //     C.DEFAULT_ADMIN_ROLE,
  //     deployer.address
  //   )
  // );
  // console.log(
  //   await manufacturerIdInstance.hasPrivilege(137, 2, deployer.address)
  // );

  // console.log(
  //   await dimoAccessControlInstance.hasRole(
  //     C.DEFAULT_ADMIN_ROLE,
  //     shaolin.address
  //   )
  // );
  // console.log(
  //   await manufacturerIdInstance.hasPrivilege(137, 2, shaolin.address)
  // );

  // console.log(
  //   await aftermarketDeviceIdInstance.isApprovedForAll(
  //     deployer.address,
  //     shaolin.address
  //   )
  // );
  // await vehicleIdInstance.connect(deployer).disablePrivilege(6);
  // await vehicleIdInstance.connect(deployer).disablePrivilege(7);

  // await aftermarketDeviceIdInstance
  //   .connect(deployer)
  //   .setApprovalForAll(shaolin.address, true);

  // console.log(
  //   `9625 -> owner ${await aftermarketDeviceIdInstance.ownerOf(9625)}`
  // );

  // const tx = await aftermarketDevice
  //   .connect(shaolin)
  //   .claimAftermarketDeviceBatch(137, [
  //     {
  //       aftermarketDeviceNodeId: '9839',
  //       owner: '0xc834cFEA7a31b9De6C1F4559F269a6F1DB64BDc3'
  //     }
  //   ]);
  // console.log(tx);
  // console.log(await aftermarketDeviceIdInstance.ownerOf(9839));
  // console.log(await shaolin.getBalance());

  // console.log(await manufacturerIdInstance.ownerOf(137));
  // console.log(
  //   await dimoAccessControlInstance.hasRole(
  //     C.DEFAULT_ADMIN_ROLE,
  //     '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  //   )
  // );
  // console.log(
  //   await manufacturerInstance.isManufacturerMinted(
  //     '0xA363478EB480F1a311C777Abadc466b6190433D2'
  //   )
  // );

  // await manufacturerInstance
  //   .connect(deployer)
  //   .setController('0xA363478EB480F1a311C777Abadc466b6190433D2');

  // console.log(
  //   await manufacturerIdInstance.hasRole(
  //     C.TRANSFERER_ROLE,
  //     '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  //   )
  // );

  // console.log(await manufacturerIdInstance.ownerOf(139));

  // await aftermarketDevice.mintAftermarketDeviceByManufacturerBatch(138,)
  // await aftermarketDevice
  //   .connect(deployer)
  //   .mintAftermarketDeviceByManufacturerBatch(137, [
  //     {
  //       addr: '0x7f464deda7dabc1a96968fb233a181cfb5050d49',
  //       attrInfoPairs: [
  //         {
  //           attribute: 'IMEI',
  //           info: '353338970449440'
  //         },
  //         {
  //           attribute: 'Serial',
  //           info: '35fc8f23-e863-cbba-d1b9-f5468bff19a6'
  //         }
  //       ]
  //     }
  //   ]);

  // await user1.sendTransaction({
  //   to: deployer.address,
  //   value: ethers.utils.parseEther('100')
  // });

  // const mapperInstance: Mapper = await ethers.getContractAt(
  //   'Mapper',
  //   contractAddresses[currentNetwork].modules.DIMORegistry.address
  // );

  // await mapperInstance
  //   .connect(user)
  //   .setAftermarketDeviceBeneficiary(
  //     3108,
  //     '0x8707caA2b24445104B27Ac1b9CF7bB05EBB1bc19'
  //   );

  // console.log(
  //   await mapperInstance.getBeneficiary(
  //     '0x9c94C395cBcBDe662235E0A9d3bB87Ad708561BA',
  //     3108
  //   )
  // );

  // console.log(
  //   await mapperInstance.getLink(
  //     contractAddresses[currentUser].nfts.AftermarketDeviceId.proxy,
  //     6031
  //   )
  // );

  // const aftermarketDeviceIdInstance: AftermarketDeviceId =
  //   await ethers.getContractAt(
  //     'AftermarketDeviceId',
  //     contractAddresses[currentUser].nfts.AftermarketDeviceId.proxy
  //   );

  // await aftermarketDeviceIdInstance
  //   .connect(deployer)
  //   ['safeTransferFrom(address,address,uint256)'](
  //     '0x688c5da815Ae7542cE1d8C6338Be785397aeE3E3',
  //     user1.address,
  //     6031
  //   );

  // const dimoRegistryInterface = ethers.Contract.getInterface(
  //   dimoRegistryInstance.interface
  // );

  // console.log(
  //   await dimoAccessControlInstance.hasRole(
  //     '0x0000000000000000000000000000000000000000000000000000000000000000',
  //     '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  //   )
  // );

  // console.log(
  //   dimoRegistryInterface.decodeFunctionData(
  //     'updateModule(address,address,bytes4[],bytes4[])',
  //     '0x06d1d2a100000000000000000000000032bfd3bb7043fd7703ea7b9c29359f987f965ce000000000000000000000000022dc95682ab184d6051430f0e6afe587a64e6851000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000000096111afa300000000000000000000000000000000000000000000000000000000ab2ae2290000000000000000000000000000000000000000000000000000000089a841bb000000000000000000000000000000000000000000000000000000009796cf22000000000000000000000000000000000000000000000000000000007ba79a3900000000000000000000000000000000000000000000000000000000cfe642dd000000000000000000000000000000000000000000000000000000004d49d82a000000000000000000000000000000000000000000000000000000004d13b709000000000000000000000000000000000000000000000000000000003f65997a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000096111afa300000000000000000000000000000000000000000000000000000000ab2ae2290000000000000000000000000000000000000000000000000000000089a841bb000000000000000000000000000000000000000000000000000000009796cf22000000000000000000000000000000000000000000000000000000007ba79a3900000000000000000000000000000000000000000000000000000000cfe642dd000000000000000000000000000000000000000000000000000000004d49d82a000000000000000000000000000000000000000000000000000000004d13b709000000000000000000000000000000000000000000000000000000003f65997a00000000000000000000000000000000000000000000000000000000'
  //   )
  // );

  // const vehicleInstance: Vehicle = await ethers.getContractAt(
  //   'Vehicle',
  //   contractAddresses[C.networkName].modules.DIMORegistry.address
  // );

  // await vehicleInstance.mintVehicle(130, deployer.address, [
  //   { attribute: 'Make', info: 'make' },
  //   { attribute: 'Model', info: 'model' },
  //   { attribute: 'Year', info: 'year' }
  // ]);

  // const deployer = await ethers.getImpersonatedSigner(
  //   '0x1741eC2915Ab71Fc03492715b5640133dA69420B'
  // );

  // await deployModules(deployer, ['Multicall'], 'mumbai');
  // const instances = await addModules(deployer, ['Multicall'], 'mumbai');

  // const instances1 = await updateModule(deployer, 'DevAdmin', C.networkName);
  // writeAddresses(instances1, C.networkName);

  // const instances2 = await updateModule(
  //   deployer,
  //   'Manufacturer',
  //   C.networkName
  // );
  // writeAddresses(instances2, C.networkName);

  // const nftInstances = await upgradeNft(
  //   deployer,
  //   'ManufacturerId',
  //   C.networkName
  // );
  // writeAddresses(nftInstances, C.networkName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  process.exit();
})
