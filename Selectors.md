## DIMORegistry
| Selector | Signature |
|-|-|
| 0x0df5b997 | addModule(address,bytes4[]) |
| 0x9748a762 | removeModule(address,bytes4[]) |
| 0x06d1d2a1 | updateModule(address,address,bytes4[],bytes4[]) |

## DevAdmin
| Selector | Signature |
|-|-|
| 0x282eb387 | adminBurnVehicles(uint256[]) |
| 0x11d679c9 | adminBurnVehiclesAndDeletePairings(uint256[]) |
| 0x3febacab | adminPairAftermarketDevice(uint256,uint256) |
| 0x17caeddb | changeParentNode(uint256,address,uint256[]) |
| 0xf73a8f04 | renameManufacturers((uint256,string)[]) |
| 0xff96b761 | transferAftermarketDeviceOwnership(uint256,address) |
| 0x5c129493 | unclaimAftermarketDeviceNode(uint256[]) |
| 0x71193956 | unpairAftermarketDeviceByDeviceNode(uint256[]) |
| 0x8c2ee9bb | unpairAftermarketDeviceByVehicleNode(uint256[]) |

## DimoAccessControl
| Selector | Signature |
|-|-|
| 0x248a9ca3 | getRoleAdmin(bytes32) |
| 0x2f2ff15d | grantRole(bytes32,address) |
| 0x91d14854 | hasRole(bytes32,address) |
| 0x8bb9c5bf | renounceRole(bytes32) |
| 0xd547741f | revokeRole(bytes32,address) |

## Eip712Checker
| Selector | Signature |
|-|-|
| 0x4cd88b76 | initialize(string,string) |

## Multicall
| Selector | Signature |
|-|-|
| 0x415c2d96 | multiDelegateCall(bytes[]) |
| 0x1c0c6e51 | multiStaticCall(bytes[]) |

## AdLicenseValidator
| Selector | Signature |
|-|-|
| 0x46946743 | getAdMintCost() |
| 0x2390baa8 | setAdMintCost(uint256) |
| 0x5b6c1979 | setDimoToken(address) |
| 0xf41377ca | setFoundationAddress(address) |
| 0x0fd21c17 | setLicense(address) |

## AftermarketDevice
| Selector | Signature |
|-|-|
| 0x6111afa3 | addAftermarketDeviceAttribute(string) |
| 0x60deec60 | claimAftermarketDeviceBatch(uint256,(uint256,address)[]) |
| 0x89a841bb | claimAftermarketDeviceSign(uint256,address,bytes,bytes) |
| 0x682a25e3 | getAftermarketDeviceAddressById(uint256) |
| 0x9796cf22 | getAftermarketDeviceIdByAddress(address) |
| 0xc6b36f2a | isAftermarketDeviceClaimed(uint256) |
| 0x7ba79a39 | mintAftermarketDeviceByManufacturerBatch(uint256,(address,(string,string)[])[]) |
| 0xb50df2f7 | pairAftermarketDeviceSign(uint256,uint256,bytes,bytes) |
| 0xcfe642dd | pairAftermarketDeviceSign(uint256,uint256,bytes) |
| 0x4d49d82a | setAftermarketDeviceIdProxyAddress(address) |
| 0x4d13b709 | setAftermarketDeviceInfo(uint256,(string,string)[]) |
| 0xee4d9596 | unpairAftermarketDevice(uint256,uint256) |
| 0x3f65997a | unpairAftermarketDeviceSign(uint256,uint256,bytes) |

## Manufacturer
| Selector | Signature |
|-|-|
| 0x50300a3f | addManufacturerAttribute(string) |
| 0xce55aab0 | getManufacturerIdByName(string) |
| 0x9109b30b | getManufacturerNameById(uint256) |
| 0xd9c27c40 | isAllowedToOwnManufacturerNode(address) |
| 0xb429afeb | isController(address) |
| 0x456bf169 | isManufacturerMinted(address) |
| 0x5f36da6b | mintManufacturer(address,string,(string,string)[]) |
| 0x9abb3000 | mintManufacturerBatch(address,string[]) |
| 0x92eefe9b | setController(address) |
| 0xd159f49a | setManufacturerIdProxyAddress(address) |
| 0x63545ffa | setManufacturerInfo(uint256,(string,string)[]) |
| 0x20d60248 | updateManufacturerMinted(address,address) |

## Integration
| Selector | Signature |
|-|-|
| 0x044d2498 | addIntegrationAttribute(string) |
| 0x714b7cfb | getIntegrationIdByName(string) |
| 0x123141bd | getIntegrationNameById(uint256) |
| 0xbc8002f0 | isAllowedToOwnIntegrationNode(address) |
| 0xe21f68b7 | isIntegrationController(address) |
| 0x603dd1db | isIntegrationMinted(address) |
| 0xd6739004 | mintIntegration(address,string,(string,string)[]) |
| 0x653af271 | mintIntegrationBatch(address,string[]) |
| 0x106129aa | setIntegrationController(address) |
| 0x636c1d1b | setIntegrationIdProxyAddress(address) |
| 0x8d7e6001 | setIntegrationInfo(uint256,(string,string)[]) |
| 0x440707b5 | updateIntegrationMinted(address,address) |

## SyntheticDevice
| Selector | Signature |
|-|-|
| 0xe1f371df | addSyntheticDeviceAttribute(string) |
| 0x7c7c9978 | burnSyntheticDeviceSign(uint256,uint256,bytes) |
| 0x795b910a | getSyntheticDeviceIdByAddress(address) |
| 0x261d982a | mintSyntheticDeviceBatch(uint256,(uint256,address,(string,string)[])[]) |
| 0xc624e8a1 | mintSyntheticDeviceSign((uint256,uint256,bytes,bytes,address,(string,string)[])) |
| 0xecf452d7 | setSyntheticDeviceIdProxyAddress(address) |
| 0x80430e0d | setSyntheticDeviceInfo(uint256,(string,string)[]) |

## Vehicle
| Selector | Signature |
|-|-|
| 0xf0d1a557 | addVehicleAttribute(string) |
| 0xd0b61156 | burnVehicleSign(uint256,bytes) |
| 0x3da44e56 | mintVehicle(uint256,address,(string,string)[]) |
| 0x1b1a82c8 | mintVehicleSign(uint256,address,(string,string)[],bytes) |
| 0x9bfae6da | setVehicleIdProxyAddress(address) |
| 0xd9c3ae61 | setVehicleInfo(uint256,(string,string)[]) |
| 0xea0e7d3a | validateBurnAndResetNode(uint256) |

## Nodes
| Selector | Signature |
|-|-|
| 0xbc60a6ba | getDataURI(address,uint256) |
| 0xdce2f860 | getInfo(address,uint256,string) |
| 0x82087d24 | getParentNode(address,uint256) |

## Mapper
| Selector | Signature |
|-|-|
| 0x0a6cef46 | getBeneficiary(address,uint256) |
| 0x112e62a2 | getLink(address,uint256) |
| 0xbd2b5568 | getNodeLink(address,address,uint256) |
| 0xbebc0bfc | setAftermarketDeviceBeneficiary(uint256,address) |

## MultipleMinter
| Selector | Signature |
|-|-|
| 0xfb1a28e8 | mintVehicleAndSdSign((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[])) |

## BaseDataURI
| Selector | Signature |
|-|-|
| 0xe324093f | setBaseDataURI(address,string) |

