## DIMORegistry
#### Functions
| Selector | Signature |
|-|-|
| 0x0df5b997 | addModule(address,bytes4[]) |
| 0x9748a762 | removeModule(address,bytes4[]) |
| 0x06d1d2a1 | updateModule(address,address,bytes4[],bytes4[]) |

#### Events
| Selector | Signature |
|-|-|
| 0x02d0c334 | ModuleAdded(address,bytes4[]) |
| 0x7c3eb4f9 | ModuleRemoved(address,bytes4[]) |
| 0xa062c2c0 | ModuleUpdated(address,address,bytes4[],bytes4[]) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## DevAdmin
#### Functions
| Selector | Signature |
|-|-|
| 0xd7376bae | adminBurnAftermarketDevices(uint256[]) |
| 0x63dec203 | adminBurnAftermarketDevicesAndDeletePairings(uint256[]) |
| 0x52878b61 | adminBurnSyntheticDevicesAndDeletePairings(uint256[]) |
| 0x282eb387 | adminBurnVehicles(uint256[]) |
| 0x11d679c9 | adminBurnVehiclesAndDeletePairings(uint256[]) |
| 0xb17b974b | adminCacheDimoStreamrEns() |
| 0x56936962 | adminChangeParentNode(uint256,address,uint256[]) |
| 0x3febacab | adminPairAftermarketDevice(uint256,uint256) |
| 0x5f741f4d | adminRemoveVehicleAttribute(string) |
| 0xdd60fd1a | adminSetVehicleDDs((uint256,string)[]) |
| 0xf73a8f04 | renameManufacturers((uint256,string)[]) |
| 0xff96b761 | transferAftermarketDeviceOwnership(uint256,address) |
| 0x5c129493 | unclaimAftermarketDeviceNode(uint256[]) |
| 0x71193956 | unpairAftermarketDeviceByDeviceNode(uint256[]) |
| 0x8c2ee9bb | unpairAftermarketDeviceByVehicleNode(uint256[]) |

#### Events
| Selector | Signature |
|-|-|
| 0x977fe0dd | AftermarketDeviceAttributeSet(uint256,string,string) |
| 0xc4d38c0a | AftermarketDeviceNodeBurned(uint256,address) |
| 0x89ec1328 | AftermarketDevicePaired(uint256,uint256,address) |
| 0x1d2e8864 | AftermarketDeviceTransferred(uint256,address,address) |
| 0x9811dbce | AftermarketDeviceUnclaimed(uint256) |
| 0xd9135724 | AftermarketDeviceUnpaired(uint256,uint256,address) |
| 0x11880ae6 | DeviceDefinitionIdSet(uint256,string) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |
| 0xe89d3dc7 | SyntheticDeviceAttributeSet(uint256,string,string) |
| 0xe4edc3c1 | SyntheticDeviceNodeBurned(uint256,uint256,address) |
| 0x9b4bf377 | VehicleAttributeRemoved(string) |
| 0x3a259e5d | VehicleAttributeSet(uint256,string,string) |
| 0x7b36384f | VehicleNodeBurned(uint256,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0x15bdaac1 | AdNotClaimed(uint256) |
| 0x762116ae | AdPaired(uint256) |
| 0xe3ca9639 | InvalidNode(address,uint256) |
| 0xc9134785 | UintUtils__InsufficientHexLength() |
| 0xc46a5168 | VehiclePaired(uint256) |

## DimoAccessControl
#### Functions
| Selector | Signature |
|-|-|
| 0x248a9ca3 | getRoleAdmin(bytes32) |
| 0x2f2ff15d | grantRole(bytes32,address) |
| 0x91d14854 | hasRole(bytes32,address) |
| 0x8bb9c5bf | renounceRole(bytes32) |
| 0xd547741f | revokeRole(bytes32,address) |

#### Events
| Selector | Signature |
|-|-|
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## Eip712Checker
#### Functions
| Selector | Signature |
|-|-|
| 0x4cd88b76 | initialize(string,string) |

#### Events
| Selector | Signature |
|-|-|
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## Multicall
#### Functions
| Selector | Signature |
|-|-|
| 0x415c2d96 | multiDelegateCall(bytes[]) |
| 0x1c0c6e51 | multiStaticCall(bytes[]) |

## ERC721Holder
#### Functions
| Selector | Signature |
|-|-|
| 0x150b7a02 | onERC721Received(address,address,uint256,bytes) |

## AftermarketDevice
#### Functions
| Selector | Signature |
|-|-|
| 0x6111afa3 | addAftermarketDeviceAttribute(string) |
| 0x08d2c2f5 | claimAftermarketDevice(uint256,bytes) |
| 0xab2ae229 | claimAftermarketDeviceBatch((uint256,address)[]) |
| 0x89a841bb | claimAftermarketDeviceSign(uint256,address,bytes,bytes) |
| 0x682a25e3 | getAftermarketDeviceAddressById(uint256) |
| 0x9796cf22 | getAftermarketDeviceIdByAddress(address) |
| 0xc6b36f2a | isAftermarketDeviceClaimed(uint256) |
| 0x7ba79a39 | mintAftermarketDeviceByManufacturerBatch(uint256,(address,(string,string)[])[]) |
| 0x492ab283 | pairAftermarketDevice(uint256,uint256) |
| 0xb50df2f7 | pairAftermarketDeviceSign(uint256,uint256,bytes,bytes) |
| 0xcfe642dd | pairAftermarketDeviceSign(uint256,uint256,bytes) |
| 0x9b3abd48 | reprovisionAftermarketDeviceByManufacturerBatch(uint256[]) |
| 0x9d0b139b | resetAftermarketDeviceAddressByManufacturerBatch((uint256,address)[]) |
| 0x4d49d82a | setAftermarketDeviceIdProxyAddress(address) |
| 0x4d13b709 | setAftermarketDeviceInfo(uint256,(string,string)[]) |
| 0xee4d9596 | unpairAftermarketDevice(uint256,uint256) |
| 0x3f65997a | unpairAftermarketDeviceSign(uint256,uint256,bytes) |

#### Events
| Selector | Signature |
|-|-|
| 0x4993b53b | AftermarketDeviceAddressReset(uint256,uint256,address) |
| 0x3ef2473c | AftermarketDeviceAttributeAdded(string) |
| 0x977fe0dd | AftermarketDeviceAttributeSet(uint256,string,string) |
| 0x8468d811 | AftermarketDeviceClaimed(uint256,address) |
| 0xe2daa727 | AftermarketDeviceIdProxySet(address) |
| 0xc4d38c0a | AftermarketDeviceNodeBurned(uint256,address) |
| 0xd624fd4c | AftermarketDeviceNodeMinted(uint256,uint256,address,address) |
| 0x89ec1328 | AftermarketDevicePaired(uint256,uint256,address) |
| 0xd9135724 | AftermarketDeviceUnpaired(uint256,uint256,address) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0x15bdaac1 | AdNotClaimed(uint256) |
| 0xd11e35b4 | AdNotPaired(uint256) |
| 0x762116ae | AdPaired(uint256) |
| 0x130e2668 | AttributeExists(string) |
| 0x1c48d49e | AttributeNotWhitelisted(string) |
| 0x4dec88eb | DeviceAlreadyClaimed(uint256) |
| 0xcd76e845 | DeviceAlreadyRegistered(address) |
| 0xdbe5383b | InvalidAdSignature() |
| 0x5d608519 | InvalidLicense() |
| 0xe3ca9639 | InvalidNode(address,uint256) |
| 0x38a85a8d | InvalidOwnerSignature() |
| 0x5299bab7 | InvalidParentNode(uint256) |
| 0x815e1d64 | InvalidSigner() |
| 0x4fc280ab | OwnersDoNotMatch() |
| 0xc9134785 | UintUtils__InsufficientHexLength() |
| 0x8e4a23d6 | Unauthorized(address) |
| 0x2d91fcb5 | VehicleNotPaired(uint256) |
| 0xc46a5168 | VehiclePaired(uint256) |
| 0xd92e233d | ZeroAddress() |

## Manufacturer
#### Functions
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

#### Events
| Selector | Signature |
|-|-|
| 0x79f74fd5 | ControllerSet(address) |
| 0x47ff34ba | ManufacturerAttributeAdded(string) |
| 0xb81a4ce1 | ManufacturerAttributeSet(uint256,string,string) |
| 0xf9bca5f2 | ManufacturerIdProxySet(address) |
| 0xc1279f9a | ManufacturerNodeMinted(string,uint256,address) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## Integration
#### Functions
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

#### Events
| Selector | Signature |
|-|-|
| 0x79f74fd5 | ControllerSet(address) |
| 0x8a60d58f | IntegrationAttributeAdded(string) |
| 0x7ad258fa | IntegrationAttributeSet(uint256,string,string) |
| 0x25dd5f73 | IntegrationIdProxySet(address) |
| 0x98490372 | IntegrationNodeMinted(uint256,address) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xb9f36dab | AlreadyController(address) |
| 0x130e2668 | AttributeExists(string) |
| 0x1c48d49e | AttributeNotWhitelisted(string) |
| 0xb9cb244b | IntegrationNameRegisterd(string) |
| 0xe3ca9639 | InvalidNode(address,uint256) |
| 0x33c5677b | MustBeAdmin(address) |
| 0xfa5cd00f | NotAllowed(address) |
| 0x87e6ac10 | OnlyNftProxy() |
| 0xc9134785 | UintUtils__InsufficientHexLength() |
| 0x8e4a23d6 | Unauthorized(address) |
| 0xd92e233d | ZeroAddress() |

## SyntheticDevice
#### Functions
| Selector | Signature |
|-|-|
| 0xe1f371df | addSyntheticDeviceAttribute(string) |
| 0x7c7c9978 | burnSyntheticDeviceSign(uint256,uint256,bytes) |
| 0x493b27e1 | getSyntheticDeviceAddressById(uint256) |
| 0x795b910a | getSyntheticDeviceIdByAddress(address) |
| 0x261d982a | mintSyntheticDeviceBatch(uint256,(uint256,address,(string,string)[])[]) |
| 0xc624e8a1 | mintSyntheticDeviceSign((uint256,uint256,bytes,bytes,address,(string,string)[])) |
| 0xecf452d7 | setSyntheticDeviceIdProxyAddress(address) |
| 0x80430e0d | setSyntheticDeviceInfo(uint256,(string,string)[]) |
| 0x53c2aa33 | validateSdBurnAndResetNode(uint256) |

#### Events
| Selector | Signature |
|-|-|
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |
| 0x6e358be2 | SyntheticDeviceAttributeAdded(string) |
| 0xe89d3dc7 | SyntheticDeviceAttributeSet(uint256,string,string) |
| 0x03f4b74a | SyntheticDeviceIdProxySet(address) |
| 0xe4edc3c1 | SyntheticDeviceNodeBurned(uint256,uint256,address) |
| 0x5a560c1a | SyntheticDeviceNodeMinted(uint256,uint256,uint256,address,address) |
| 0x3a259e5d | VehicleAttributeSet(uint256,string,string) |
| 0xd471ae8a | VehicleNodeMinted(uint256,uint256,address) |
| 0xc7c7d9ac | VehicleNodeMintedWithDeviceDefinition(uint256,uint256,address,string) |

#### Errors
| Selector | Signature |
|-|-|
| 0x130e2668 | AttributeExists(string) |
| 0x1c48d49e | AttributeNotWhitelisted(string) |
| 0xcd76e845 | DeviceAlreadyRegistered(address) |
| 0xe3ca9639 | InvalidNode(address,uint256) |
| 0x38a85a8d | InvalidOwnerSignature() |
| 0x5299bab7 | InvalidParentNode(uint256) |
| 0xf8e95d55 | InvalidSdSignature() |
| 0x87e6ac10 | OnlyNftProxy() |
| 0xc9134785 | UintUtils__InsufficientHexLength() |
| 0x8e4a23d6 | Unauthorized(address) |
| 0x2d91fcb5 | VehicleNotPaired(uint256) |
| 0xc46a5168 | VehiclePaired(uint256) |
| 0xd92e233d | ZeroAddress() |

## Vehicle
#### Functions
| Selector | Signature |
|-|-|
| 0xf0d1a557 | addVehicleAttribute(string) |
| 0xd0b61156 | burnVehicleSign(uint256,bytes) |
| 0xb7bded95 | getDeviceDefinitionIdByVehicleId(uint256) |
| 0x97c95b2a | mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[],(address,uint256,uint256,string)) |
| 0xd84baff1 | mintVehicleWithDeviceDefinition(uint256,address,string,(string,string)[]) |
| 0x8dca2b8e | mintVehicleWithDeviceDefinitionSign(uint256,address,string,(string,string)[],bytes) |
| 0x9bfae6da | setVehicleIdProxyAddress(address) |
| 0xd9c3ae61 | setVehicleInfo(uint256,(string,string)[]) |
| 0xea0e7d3a | validateBurnAndResetNode(uint256) |

#### Events
| Selector | Signature |
|-|-|
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |
| 0x2b7d41dc | VehicleAttributeAdded(string) |
| 0x3a259e5d | VehicleAttributeSet(uint256,string,string) |
| 0x3e7484c4 | VehicleIdProxySet(address) |
| 0x7b36384f | VehicleNodeBurned(uint256,address) |
| 0xd471ae8a | VehicleNodeMinted(uint256,uint256,address) |
| 0xc7c7d9ac | VehicleNodeMintedWithDeviceDefinition(uint256,uint256,address,string) |

#### Errors
| Selector | Signature |
|-|-|
| 0x130e2668 | AttributeExists(string) |
| 0x1c48d49e | AttributeNotWhitelisted(string) |
| 0xe3ca9639 | InvalidNode(address,uint256) |
| 0x38a85a8d | InvalidOwnerSignature() |
| 0x5299bab7 | InvalidParentNode(uint256) |
| 0x87e6ac10 | OnlyNftProxy() |
| 0xc9134785 | UintUtils__InsufficientHexLength() |
| 0xc46a5168 | VehiclePaired(uint256) |
| 0xd92e233d | ZeroAddress() |

## Nodes
#### Functions
| Selector | Signature |
|-|-|
| 0xbc60a6ba | getDataURI(address,uint256) |
| 0xdce2f860 | getInfo(address,uint256,string) |
| 0x82087d24 | getParentNode(address,uint256) |

## Mapper
#### Functions
| Selector | Signature |
|-|-|
| 0x0a6cef46 | getBeneficiary(address,uint256) |
| 0x112e62a2 | getLink(address,uint256) |
| 0xbd2b5568 | getNodeLink(address,address,uint256) |
| 0xbebc0bfc | setAftermarketDeviceBeneficiary(uint256,address) |

#### Events
| Selector | Signature |
|-|-|
| 0xf6f6de47 | BeneficiarySet(address,uint256,address) |

## Charging
#### Functions
| Selector | Signature |
|-|-|
| 0xd25f5787 | getDcxOperationCost(bytes32) |
| 0xa2fe8c85 | setDcxOperationCost(bytes32,uint256) |

#### Events
| Selector | Signature |
|-|-|
| 0x2f2e341f | OperationCostSet(bytes32,uint256) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## Shared
#### Functions
| Selector | Signature |
|-|-|
| 0xb0c1d1df | getConnectionsManager() |
| 0xcfe55b7d | getDimoCredit() |
| 0x77898251 | getDimoToken() |
| 0xa2bc6cdf | getFoundation() |
| 0x170e4293 | getManufacturerLicense() |
| 0xc3d8478c | getSacd() |
| 0x2fee22f4 | setConnectionsManager(address) |
| 0x4fa9ff16 | setDimoCredit(address) |
| 0x5b6c1979 | setDimoToken(address) |
| 0xdb3543f5 | setFoundation(address) |
| 0xea9ae2f5 | setManufacturerLicense(address) |
| 0xc63f7dd2 | setSacd(address) |

#### Events
| Selector | Signature |
|-|-|
| 0x460e3b50 | ConnectionsManagerSet(address) |
| 0x6f17bce4 | DimoCreditSet(address) |
| 0x3c3a6813 | DimoTokenSet(address) |
| 0xfb3a4411 | FoundationSet(address) |
| 0x52ce7955 | ManufacturerLicenseSet(address) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |
| 0xc50082fb | SacdSet(address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## MultipleMinter
#### Functions
| Selector | Signature |
|-|-|
| 0xfb1a28e8 | mintVehicleAndSdSign((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[])) |
| 0xd23965e3 | mintVehicleAndSdWithDeviceDefinitionSign((uint256,address,string,(string,string)[],uint256,bytes,bytes,address,(string,string)[])) |
| 0x58657dcc | mintVehicleAndSdWithDeviceDefinitionSignAndSacd((uint256,address,string,(string,string)[],uint256,bytes,bytes,address,(string,string)[]),(address,uint256,uint256,string)) |
| 0x7ae7fe4e | mintVehicleAndSdWithDeviceDefinitionSignBatch((uint256,address,string,(string,string)[],uint256,bytes,bytes,address,(string,string)[],(address,uint256,uint256,string))[]) |

#### Events
| Selector | Signature |
|-|-|
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |
| 0xe89d3dc7 | SyntheticDeviceAttributeSet(uint256,string,string) |
| 0x5a560c1a | SyntheticDeviceNodeMinted(uint256,uint256,uint256,address,address) |
| 0x3a259e5d | VehicleAttributeSet(uint256,string,string) |
| 0xd471ae8a | VehicleNodeMinted(uint256,uint256,address) |
| 0xc7c7d9ac | VehicleNodeMintedWithDeviceDefinition(uint256,uint256,address,string) |

#### Errors
| Selector | Signature |
|-|-|
| 0x1c48d49e | AttributeNotWhitelisted(string) |
| 0xcd76e845 | DeviceAlreadyRegistered(address) |
| 0x38a85a8d | InvalidOwnerSignature() |
| 0x5299bab7 | InvalidParentNode(uint256) |
| 0xf8e95d55 | InvalidSdSignature() |
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## BaseDataURI
#### Functions
| Selector | Signature |
|-|-|
| 0xe324093f | setBaseDataURI(address,string) |

#### Events
| Selector | Signature |
|-|-|
| 0x9f53d8a6 | BaseDataURISet(address,string) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## DeviceDefinitionTable
#### Functions
| Selector | Signature |
|-|-|
| 0x20954d21 | createDeviceDefinitionTable(address,uint256) |
| 0x794c6790 | createDeviceDefinitionTableBatch(address,uint256[]) |
| 0x32b3f2d5 | deleteDeviceDefinition(uint256,string) |
| 0x396e5987 | getDeviceDefinitionTableId(uint256) |
| 0xa1d17941 | getDeviceDefinitionTableName(uint256) |
| 0x23536c5f | insertDeviceDefinition(uint256,(string,string,uint256,string,string,string,string)) |
| 0x80d50451 | insertDeviceDefinitionBatch(uint256,(string,string,uint256,string,string,string,string)[]) |
| 0x088fafdb | setDeviceDefinitionTable(uint256,uint256) |
| 0x182fef60 | updateDeviceDefinition(uint256,(string,string,string,string,string)) |

#### Events
| Selector | Signature |
|-|-|
| 0x29504454 | DeviceDefinitionDeleted(uint256,string) |
| 0x462ef08c | DeviceDefinitionInserted(uint256,string,string,uint256) |
| 0x34045c03 | DeviceDefinitionTableCreated(address,uint256,uint256) |
| 0x67c3ba00 | DeviceDefinitionUpdated(uint256,string) |
| 0x753affc1 | ManufacturerTableSet(uint256,uint256) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |

#### Errors
| Selector | Signature |
|-|-|
| 0x264e42cf | ChainNotSupported(uint256) |
| 0xa25b0cf9 | InvalidManufacturerId(uint256) |
| 0x3784d0a9 | TableAlreadyExists(uint256) |
| 0x45cbe5ec | TableDoesNotExist(uint256) |
| 0x8e4a23d6 | Unauthorized(address) |

## DeviceDefinitionController
#### Functions
| Selector | Signature |
|-|-|
| 0x66df322e | getPolicy(address,uint256) |

## StreamrConfigurator
#### Functions
| Selector | Signature |
|-|-|
| 0x9e594424 | setDimoBaseStreamId(string) |
| 0x5f450e29 | setDimoStreamrNode(address) |
| 0x0c3cac3b | setStreamRegistry(address) |

#### Events
| Selector | Signature |
|-|-|
| 0x5c6e4ce4 | DimoStreamrEnsSet(string) |
| 0x49a3b2d5 | DimoStreamrNodeSet(address) |
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |
| 0x42d068f4 | StreamRegistrySet(address) |

#### Errors
| Selector | Signature |
|-|-|
| 0xc9134785 | UintUtils__InsufficientHexLength() |

## VehicleStream
#### Functions
| Selector | Signature |
|-|-|
| 0x497323c8 | createVehicleStream(uint256) |
| 0x180e469a | getVehicleStream(uint256) |
| 0xa91ec798 | onBurnVehicleStream(uint256) |
| 0xc8f11a06 | onSetSubscribePrivilege(uint256,address,uint256) |
| 0x1882b263 | onTransferVehicleStream(address,uint256) |
| 0xbb44bb75 | setSubscriptionToVehicleStream(uint256,address,uint256) |
| 0x6f58f093 | setVehicleStream(uint256,string) |
| 0x37479f7e | subscribeToVehicleStream(uint256,uint256) |
| 0xcd90df7e | unsetVehicleStream(uint256) |

#### Events
| Selector | Signature |
|-|-|
| 0xbd79b86f | RoleAdminChanged(bytes32,bytes32,bytes32) |
| 0x2f878811 | RoleGranted(bytes32,address,address) |
| 0xf6391f5c | RoleRevoked(bytes32,address,address) |
| 0x316c9677 | SubscribedToVehicleStream(string,address,uint256) |
| 0x09d0a780 | VehicleStreamSet(uint256,string) |
| 0x14692607 | VehicleStreamUnset(uint256,string) |

#### Errors
| Selector | Signature |
|-|-|
| 0xe3ca9639 | InvalidNode(address,uint256) |
| 0xc8093930 | NoStreamrPermission(address,uint8) |
| 0xa3f1925a | StreamDoesNotExist(string) |
| 0x8e4a23d6 | Unauthorized(address) |
| 0xf7959f9e | VehicleStreamAlreadySet(uint256,string) |
| 0x42e5dbbe | VehicleStreamNotSet(uint256) |

