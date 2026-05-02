// Code generated via abigen V2 - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package registry

import (
	"bytes"
	"errors"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind/v2"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = bytes.Equal
	_ = errors.New
	_ = big.NewInt
	_ = common.Big1
	_ = types.BloomLookup
	_ = abi.ConvertType
)

// AftermarketDeviceIdAddressPair is an auto generated low-level Go binding around an user-defined struct.
type AftermarketDeviceIdAddressPair struct {
	AftermarketDeviceNodeId *big.Int
	DeviceAddress           common.Address
}

// AftermarketDeviceInfos is an auto generated low-level Go binding around an user-defined struct.
type AftermarketDeviceInfos struct {
	Addr          common.Address
	AttrInfoPairs []AttributeInfoPair
}

// AftermarketDeviceOwnerPair is an auto generated low-level Go binding around an user-defined struct.
type AftermarketDeviceOwnerPair struct {
	AftermarketDeviceNodeId *big.Int
	Owner                   common.Address
}

// AttributeInfoPair is an auto generated low-level Go binding around an user-defined struct.
type AttributeInfoPair struct {
	Attribute string
	Info      string
}

// DevAdminIdManufacturerName is an auto generated low-level Go binding around an user-defined struct.
type DevAdminIdManufacturerName struct {
	TokenId *big.Int
	Name    string
}

// DevAdminVehicleIdDeviceDefinitionId is an auto generated low-level Go binding around an user-defined struct.
type DevAdminVehicleIdDeviceDefinitionId struct {
	VehicleId          *big.Int
	DeviceDefinitionId string
}

// DeviceDefinitionInput is an auto generated low-level Go binding around an user-defined struct.
type DeviceDefinitionInput struct {
	Id         string
	Model      string
	Year       *big.Int
	Metadata   string
	Ksuid      string
	DeviceType string
	ImageURI   string
}

// DeviceDefinitionUpdateInput is an auto generated low-level Go binding around an user-defined struct.
type DeviceDefinitionUpdateInput struct {
	Id         string
	Metadata   string
	Ksuid      string
	DeviceType string
	ImageURI   string
}

// MintSyntheticDeviceBatchInput is an auto generated low-level Go binding around an user-defined struct.
type MintSyntheticDeviceBatchInput struct {
	VehicleNode         *big.Int
	SyntheticDeviceAddr common.Address
	AttrInfoPairs       []AttributeInfoPair
}

// MintSyntheticDeviceInput is an auto generated low-level Go binding around an user-defined struct.
type MintSyntheticDeviceInput struct {
	ConnectionId        *big.Int
	VehicleNode         *big.Int
	SyntheticDeviceSig  []byte
	VehicleOwnerSig     []byte
	SyntheticDeviceAddr common.Address
	AttrInfoPairs       []AttributeInfoPair
}

// MintVehicleAndSdInput is an auto generated low-level Go binding around an user-defined struct.
type MintVehicleAndSdInput struct {
	ManufacturerNode     *big.Int
	Owner                common.Address
	AttrInfoPairsVehicle []AttributeInfoPair
	ConnectionId         *big.Int
	VehicleOwnerSig      []byte
	SyntheticDeviceSig   []byte
	SyntheticDeviceAddr  common.Address
	AttrInfoPairsDevice  []AttributeInfoPair
}

// MintVehicleAndSdInputBatch is an auto generated low-level Go binding around an user-defined struct.
type MintVehicleAndSdInputBatch struct {
	ManufacturerNode     *big.Int
	Owner                common.Address
	AttrInfoPairsVehicle []AttributeInfoPair
	ConnectionId         *big.Int
	VehicleOwnerSig      []byte
	SyntheticDeviceSig   []byte
	SyntheticDeviceAddr  common.Address
	AttrInfoPairsDevice  []AttributeInfoPair
	SacdInput            SacdInput
}

// MintVehicleAndSdInputWithSnId is an auto generated low-level Go binding around an user-defined struct.
type MintVehicleAndSdInputWithSnId struct {
	ManufacturerNode     *big.Int
	Owner                common.Address
	StorageNodeId        *big.Int
	AttrInfoPairsVehicle []AttributeInfoPair
	ConnectionId         *big.Int
	VehicleOwnerSig      []byte
	SyntheticDeviceSig   []byte
	SyntheticDeviceAddr  common.Address
	AttrInfoPairsDevice  []AttributeInfoPair
}

// MintVehicleAndSdInputWithSnIdBatch is an auto generated low-level Go binding around an user-defined struct.
type MintVehicleAndSdInputWithSnIdBatch struct {
	ManufacturerNode     *big.Int
	Owner                common.Address
	StorageNodeId        *big.Int
	AttrInfoPairsVehicle []AttributeInfoPair
	ConnectionId         *big.Int
	VehicleOwnerSig      []byte
	SyntheticDeviceSig   []byte
	SyntheticDeviceAddr  common.Address
	AttrInfoPairsDevice  []AttributeInfoPair
	SacdInput            SacdInput
}

// SacdInput is an auto generated low-level Go binding around an user-defined struct.
type SacdInput struct {
	Grantee     common.Address
	Permissions *big.Int
	Expiration  *big.Int
	Source      string
}

// TablelandPolicy is an auto generated low-level Go binding around an user-defined struct.
type TablelandPolicy struct {
	AllowInsert      bool
	AllowUpdate      bool
	AllowDelete      bool
	WhereClause      string
	WithCheck        string
	UpdatableColumns []string
}

// RegistryMetaData contains all meta data concerning the Registry contract.
var RegistryMetaData = bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"UintUtils__InsufficientHexLength\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"moduleAddr\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"ModuleAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"moduleAddr\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"ModuleRemoved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"oldImplementation\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"oldSelectors\",\"type\":\"bytes4[]\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"newSelectors\",\"type\":\"bytes4[]\"}],\"name\":\"ModuleUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"previousAdminRole\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"newAdminRole\",\"type\":\"bytes32\"}],\"name\":\"RoleAdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"stateMutability\":\"nonpayable\",\"type\":\"fallback\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"implementation\",\"type\":\"address\"},{\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"addModule\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"implementation\",\"type\":\"address\"},{\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"removeModule\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"oldImplementation\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"},{\"internalType\":\"bytes4[]\",\"name\":\"oldSelectors\",\"type\":\"bytes4[]\"},{\"internalType\":\"bytes4[]\",\"name\":\"newSelectors\",\"type\":\"bytes4[]\"}],\"name\":\"updateModule\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"AdNotClaimed\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"AdPaired\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"InvalidNode\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"}],\"name\":\"InvalidStorageNode\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"VehiclePaired\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"AftermarketDeviceAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceNodeBurned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDevicePaired\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"oldOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"}],\"name\":\"AftermarketDeviceUnclaimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceUnpaired\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"ddId\",\"type\":\"string\"}],\"name\":\"DeviceDefinitionIdSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"SyntheticDeviceAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"syntheticDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"SyntheticDeviceNodeBurned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"VehicleAttributeRemoved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"VehicleAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"VehicleNodeBurned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"}],\"name\":\"VehicleStorageNodeIdSet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnAftermarketDevices\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnAftermarketDevicesAndDeletePairings\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnSyntheticDevicesAndDeletePairings\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnVehicles\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnVehiclesAndDeletePairings\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"adminCacheDimoStreamrEns\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newParentNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"nodeIdList\",\"type\":\"uint256[]\"}],\"name\":\"adminChangeParentNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"}],\"name\":\"adminPairAftermarketDevice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"adminRemoveVehicleAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"vehicleIds\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"}],\"name\":\"adminSetStorageNodeIdForVehicleIds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"deviceDefinitionId\",\"type\":\"string\"}],\"internalType\":\"structDevAdmin.VehicleIdDeviceDefinitionId[]\",\"name\":\"vehicleIdDdId\",\"type\":\"tuple[]\"}],\"name\":\"adminSetVehicleDDs\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"internalType\":\"structDevAdmin.IdManufacturerName[]\",\"name\":\"idManufacturerNames\",\"type\":\"tuple[]\"}],\"name\":\"renameManufacturers\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferAftermarketDeviceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"aftermarketDeviceNodes\",\"type\":\"uint256[]\"}],\"name\":\"unclaimAftermarketDeviceNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"aftermarketDeviceNodes\",\"type\":\"uint256[]\"}],\"name\":\"unpairAftermarketDeviceByDeviceNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"vehicleNodes\",\"type\":\"uint256[]\"}],\"name\":\"unpairAftermarketDeviceByVehicleNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleAdmin\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"grantRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"revokeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"version\",\"type\":\"string\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes[]\",\"name\":\"data\",\"type\":\"bytes[]\"}],\"name\":\"multiDelegateCall\",\"outputs\":[{\"internalType\":\"bytes[]\",\"name\":\"results\",\"type\":\"bytes[]\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes[]\",\"name\":\"data\",\"type\":\"bytes[]\"}],\"name\":\"multiStaticCall\",\"outputs\":[{\"internalType\":\"bytes[]\",\"name\":\"results\",\"type\":\"bytes[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"name\":\"onERC721Received\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"\",\"type\":\"bytes4\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"AdNotPaired\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attr\",\"type\":\"string\"}],\"name\":\"AttributeExists\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attr\",\"type\":\"string\"}],\"name\":\"AttributeNotWhitelisted\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"DeviceAlreadyClaimed\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"DeviceAlreadyRegistered\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidAdSignature\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidLicense\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidOwnerSignature\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"InvalidParentNode\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidSigner\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"OwnersDoNotMatch\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"Unauthorized\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"VehicleNotPaired\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"aftermarketDeviceAddress\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceAddressReset\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"AftermarketDeviceAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceClaimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"aftermarketDeviceAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceNodeMinted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceUnclaimed\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addAftermarketDeviceAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"aftermarketDeviceSig\",\"type\":\"bytes\"}],\"name\":\"claimAftermarketDevice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNodeId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"internalType\":\"structAftermarketDeviceOwnerPair[]\",\"name\":\"adOwnerPair\",\"type\":\"tuple[]\"}],\"name\":\"claimAftermarketDeviceBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ownerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"aftermarketDeviceSig\",\"type\":\"bytes\"}],\"name\":\"claimAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"getAftermarketDeviceAddressById\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"getAftermarketDeviceIdByAddress\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"isAftermarketDeviceClaimed\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isClaimed\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairs\",\"type\":\"tuple[]\"}],\"internalType\":\"structAftermarketDeviceInfos[]\",\"name\":\"adInfos\",\"type\":\"tuple[]\"}],\"name\":\"mintAftermarketDeviceByManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"}],\"name\":\"pairAftermarketDevice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"aftermarketDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"}],\"name\":\"pairAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"pairAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"aftermarketDeviceSig\",\"type\":\"bytes\"}],\"name\":\"pairAftermarketDeviceWithAdSig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"aftermarketDeviceNodeList\",\"type\":\"uint256[]\"}],\"name\":\"reprovisionAftermarketDeviceByManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNodeId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"deviceAddress\",\"type\":\"address\"}],\"internalType\":\"structAftermarketDeviceIdAddressPair[]\",\"name\":\"adIdAddrs\",\"type\":\"tuple[]\"}],\"name\":\"resetAftermarketDeviceAddressByManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"}],\"name\":\"resetAftermarketDeviceForClaiming\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setAftermarketDeviceIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"setAftermarketDeviceInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"}],\"name\":\"unpairAftermarketDevice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"unpairAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"controller\",\"type\":\"address\"}],\"name\":\"ControllerSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"ManufacturerAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"ManufacturerAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"ManufacturerIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"ManufacturerNodeMinted\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addManufacturerAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"name\":\"getManufacturerIdByName\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getManufacturerNameById\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isAllowedToOwnManufacturerNode\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isAllowed\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isController\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isController\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isManufacturerMinted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isManufacturerMinted\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairList\",\"type\":\"tuple[]\"}],\"name\":\"mintManufacturer\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string[]\",\"name\":\"names\",\"type\":\"string[]\"}],\"name\":\"mintManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_controller\",\"type\":\"address\"}],\"name\":\"setController\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setManufacturerIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoList\",\"type\":\"tuple[]\"}],\"name\":\"setManufacturerInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"updateManufacturerMinted\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"InvalidSdSignature\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"OnlyNftProxy\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"SyntheticDeviceAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"SyntheticDeviceIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"syntheticDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"syntheticDeviceAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"SyntheticDeviceNodeMinted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"VehicleNodeMinted\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addSyntheticDeviceAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"syntheticDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"ownerSig\",\"type\":\"bytes\"}],\"name\":\"burnSyntheticDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"getSyntheticDeviceAddressById\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"getSyntheticDeviceIdByAddress\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairs\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintSyntheticDeviceBatchInput[]\",\"name\":\"data\",\"type\":\"tuple[]\"}],\"name\":\"mintSyntheticDeviceBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairs\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintSyntheticDeviceInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"mintSyntheticDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setSyntheticDeviceIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"setSyntheticDeviceInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"validateSdBurnAndResetNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"VehicleAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"VehicleIdProxySet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addVehicleAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"ownerSig\",\"type\":\"bytes\"}],\"name\":\"burnVehicleSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"getDeviceDefinitionIdByVehicleId\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"ddId\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"mintVehicle\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"grantee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"permissions\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"source\",\"type\":\"string\"}],\"internalType\":\"structSacdInput\",\"name\":\"sacdInput\",\"type\":\"tuple\"}],\"name\":\"mintVehicle\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"grantee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"permissions\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"source\",\"type\":\"string\"}],\"internalType\":\"structSacdInput\",\"name\":\"sacdInput\",\"type\":\"tuple\"}],\"name\":\"mintVehicle\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"mintVehicle\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"mintVehicleSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"mintVehicleSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setVehicleIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"setVehicleInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"validateBurnAndResetNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"getInfo\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getParentNode\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"parentNode\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"beneficiary\",\"type\":\"address\"}],\"name\":\"BeneficiarySet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"getBeneficiary\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"beneficiary\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"sourceNode\",\"type\":\"uint256\"}],\"name\":\"getLink\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"targetNode\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddressSource\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"idProxyAddressTarget\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"sourceNode\",\"type\":\"uint256\"}],\"name\":\"getNodeLink\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"targetNode\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"beneficiary\",\"type\":\"address\"}],\"name\":\"setAftermarketDeviceBeneficiary\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsVehicle\",\"type\":\"tuple[]\"},{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintVehicleAndSdInputWithSnId\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"mintVehicleAndSdSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsVehicle\",\"type\":\"tuple[]\"},{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintVehicleAndSdInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"mintVehicleAndSdSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsVehicle\",\"type\":\"tuple[]\"},{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintVehicleAndSdInputWithSnId\",\"name\":\"data\",\"type\":\"tuple\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"grantee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"permissions\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"source\",\"type\":\"string\"}],\"internalType\":\"structSacdInput\",\"name\":\"sacdInput\",\"type\":\"tuple\"}],\"name\":\"mintVehicleAndSdSignAndSacd\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsVehicle\",\"type\":\"tuple[]\"},{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintVehicleAndSdInput\",\"name\":\"data\",\"type\":\"tuple\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"grantee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"permissions\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"source\",\"type\":\"string\"}],\"internalType\":\"structSacdInput\",\"name\":\"sacdInput\",\"type\":\"tuple\"}],\"name\":\"mintVehicleAndSdSignAndSacd\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsVehicle\",\"type\":\"tuple[]\"},{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"grantee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"permissions\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"source\",\"type\":\"string\"}],\"internalType\":\"structSacdInput\",\"name\":\"sacdInput\",\"type\":\"tuple\"}],\"internalType\":\"structMintVehicleAndSdInputWithSnIdBatch[]\",\"name\":\"data\",\"type\":\"tuple[]\"}],\"name\":\"mintVehicleAndSdSignBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsVehicle\",\"type\":\"tuple[]\"},{\"internalType\":\"uint256\",\"name\":\"connectionId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"grantee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"permissions\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"source\",\"type\":\"string\"}],\"internalType\":\"structSacdInput\",\"name\":\"sacdInput\",\"type\":\"tuple\"}],\"internalType\":\"structMintVehicleAndSdInputBatch[]\",\"name\":\"data\",\"type\":\"tuple[]\"}],\"name\":\"mintVehicleAndSdSignBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"connectionsManager\",\"type\":\"address\"}],\"name\":\"ConnectionsManagerSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"dimoCredit\",\"type\":\"address\"}],\"name\":\"DimoCreditSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"dimoToken\",\"type\":\"address\"}],\"name\":\"DimoTokenSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"foundation\",\"type\":\"address\"}],\"name\":\"FoundationSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"manufacturerLicense\",\"type\":\"address\"}],\"name\":\"ManufacturerLicenseSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sacd\",\"type\":\"address\"}],\"name\":\"SacdSet\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"getConnectionsManager\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"connectionsManager\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getDimoCredit\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"dimoCredit\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getDimoToken\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"dimoToken\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getFoundation\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"foundation\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getManufacturerLicense\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"manufacturerLicense\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getSacd\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"sacd\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"connectionsManager\",\"type\":\"address\"}],\"name\":\"setConnectionsManager\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"dimoCredit\",\"type\":\"address\"}],\"name\":\"setDimoCredit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"dimoToken\",\"type\":\"address\"}],\"name\":\"setDimoToken\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"foundation\",\"type\":\"address\"}],\"name\":\"setFoundation\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"manufacturerLicense\",\"type\":\"address\"}],\"name\":\"setManufacturerLicense\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sacd\",\"type\":\"address\"}],\"name\":\"setSacd\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"dimoStreamrEns\",\"type\":\"string\"}],\"name\":\"DimoStreamrEnsSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"dimoStreamrNode\",\"type\":\"address\"}],\"name\":\"DimoStreamrNodeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"streamRegistry\",\"type\":\"address\"}],\"name\":\"StreamRegistrySet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"dimoStreamrEns\",\"type\":\"string\"}],\"name\":\"setDimoBaseStreamId\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"dimoStreamrNode\",\"type\":\"address\"}],\"name\":\"setDimoStreamrNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"streamRegistry\",\"type\":\"address\"}],\"name\":\"setStreamRegistry\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"enumIStreamRegistry.PermissionType\",\"name\":\"permissionType\",\"type\":\"uint8\"}],\"name\":\"NoStreamrPermission\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"StreamDoesNotExist\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"VehicleStreamAlreadySet\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"VehicleStreamNotSet\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"SubscribedToVehicleStream\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"VehicleStreamSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"VehicleStreamUnset\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"createVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"getVehicleStream\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"onBurnVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"onSetSubscribePrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"onTransferVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"setSubscriptionToVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"setVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"subscribeToVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"unsetVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"chainid\",\"type\":\"uint256\"}],\"name\":\"ChainNotSupported\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"InvalidManufacturerId\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"TableAlreadyExists\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"TableDoesNotExist\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"}],\"name\":\"Unauthorized\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"DeviceDefinitionDeleted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"model\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"year\",\"type\":\"uint256\"}],\"name\":\"DeviceDefinitionInserted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tableOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"DeviceDefinitionTableCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"DeviceDefinitionUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"ManufacturerTableSet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"tableOwner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"createDeviceDefinitionTable\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"tableOwner\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"manufacturerIds\",\"type\":\"uint256[]\"}],\"name\":\"createDeviceDefinitionTableBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"}],\"name\":\"deleteDeviceDefinition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"getDeviceDefinitionTableId\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"getDeviceDefinitionTableName\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"tableName\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"model\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"year\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ksuid\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"deviceType\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"imageURI\",\"type\":\"string\"}],\"internalType\":\"structDeviceDefinitionInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"insertDeviceDefinition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"model\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"year\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ksuid\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"deviceType\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"imageURI\",\"type\":\"string\"}],\"internalType\":\"structDeviceDefinitionInput[]\",\"name\":\"data\",\"type\":\"tuple[]\"}],\"name\":\"insertDeviceDefinitionBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"setDeviceDefinitionTable\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ksuid\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"deviceType\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"imageURI\",\"type\":\"string\"}],\"internalType\":\"structDeviceDefinitionUpdateInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"updateDeviceDefinition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"getPolicy\",\"outputs\":[{\"components\":[{\"internalType\":\"bool\",\"name\":\"allowInsert\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"allowUpdate\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"allowDelete\",\"type\":\"bool\"},{\"internalType\":\"string\",\"name\":\"whereClause\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"withCheck\",\"type\":\"string\"},{\"internalType\":\"string[]\",\"name\":\"updatableColumns\",\"type\":\"string[]\"}],\"internalType\":\"structTablelandPolicy\",\"name\":\"policy\",\"type\":\"tuple\"}],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"operation\",\"type\":\"bytes32\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"}],\"name\":\"OperationCostSet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"operation\",\"type\":\"bytes32\"}],\"name\":\"getDcxOperationCost\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"operation\",\"type\":\"bytes32\"},{\"internalType\":\"uint256\",\"name\":\"cost\",\"type\":\"uint256\"}],\"name\":\"setDcxOperationCost\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"storageNode\",\"type\":\"address\"}],\"name\":\"StorageNodeSet\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"getDefaultStorageNodeId\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"defaultStorageNodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getStorageNode\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"storageNode\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"}],\"name\":\"setDefaultStorageNodeId\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"storageNode\",\"type\":\"address\"}],\"name\":\"setStorageNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"storageNodeId\",\"type\":\"uint256\"}],\"name\":\"setStorageNodeIdForVehicle\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"vehicleIdToStorageNodeId\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
	ID:  "Registry",
}

// Registry is an auto generated Go binding around an Ethereum contract.
type Registry struct {
	abi abi.ABI
}

// NewRegistry creates a new instance of Registry.
func NewRegistry() *Registry {
	parsed, err := RegistryMetaData.ParseABI()
	if err != nil {
		panic(errors.New("invalid ABI: " + err.Error()))
	}
	return &Registry{abi: *parsed}
}

// Instance creates a wrapper for a deployed contract instance at the given address.
// Use this to create the instance object passed to abigen v2 library functions Call, Transact, etc.
func (c *Registry) Instance(backend bind.ContractBackend, addr common.Address) *bind.BoundContract {
	return bind.NewBoundContract(addr, c.abi, backend, backend, backend)
}

// PackAddAftermarketDeviceAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6111afa3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function addAftermarketDeviceAttribute(string attribute) returns()
func (registry *Registry) PackAddAftermarketDeviceAttribute(attribute string) []byte {
	enc, err := registry.abi.Pack("addAftermarketDeviceAttribute", attribute)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAddAftermarketDeviceAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6111afa3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function addAftermarketDeviceAttribute(string attribute) returns()
func (registry *Registry) TryPackAddAftermarketDeviceAttribute(attribute string) ([]byte, error) {
	return registry.abi.Pack("addAftermarketDeviceAttribute", attribute)
}

// PackAddManufacturerAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x50300a3f.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function addManufacturerAttribute(string attribute) returns()
func (registry *Registry) PackAddManufacturerAttribute(attribute string) []byte {
	enc, err := registry.abi.Pack("addManufacturerAttribute", attribute)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAddManufacturerAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x50300a3f.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function addManufacturerAttribute(string attribute) returns()
func (registry *Registry) TryPackAddManufacturerAttribute(attribute string) ([]byte, error) {
	return registry.abi.Pack("addManufacturerAttribute", attribute)
}

// PackAddModule is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0df5b997.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function addModule(address implementation, bytes4[] selectors) returns()
func (registry *Registry) PackAddModule(implementation common.Address, selectors [][4]byte) []byte {
	enc, err := registry.abi.Pack("addModule", implementation, selectors)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAddModule is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0df5b997.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function addModule(address implementation, bytes4[] selectors) returns()
func (registry *Registry) TryPackAddModule(implementation common.Address, selectors [][4]byte) ([]byte, error) {
	return registry.abi.Pack("addModule", implementation, selectors)
}

// PackAddSyntheticDeviceAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe1f371df.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function addSyntheticDeviceAttribute(string attribute) returns()
func (registry *Registry) PackAddSyntheticDeviceAttribute(attribute string) []byte {
	enc, err := registry.abi.Pack("addSyntheticDeviceAttribute", attribute)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAddSyntheticDeviceAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe1f371df.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function addSyntheticDeviceAttribute(string attribute) returns()
func (registry *Registry) TryPackAddSyntheticDeviceAttribute(attribute string) ([]byte, error) {
	return registry.abi.Pack("addSyntheticDeviceAttribute", attribute)
}

// PackAddVehicleAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf0d1a557.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function addVehicleAttribute(string attribute) returns()
func (registry *Registry) PackAddVehicleAttribute(attribute string) []byte {
	enc, err := registry.abi.Pack("addVehicleAttribute", attribute)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAddVehicleAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf0d1a557.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function addVehicleAttribute(string attribute) returns()
func (registry *Registry) TryPackAddVehicleAttribute(attribute string) ([]byte, error) {
	return registry.abi.Pack("addVehicleAttribute", attribute)
}

// PackAdminBurnAftermarketDevices is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd7376bae.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminBurnAftermarketDevices(uint256[] tokenIds) returns()
func (registry *Registry) PackAdminBurnAftermarketDevices(tokenIds []*big.Int) []byte {
	enc, err := registry.abi.Pack("adminBurnAftermarketDevices", tokenIds)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminBurnAftermarketDevices is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd7376bae.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminBurnAftermarketDevices(uint256[] tokenIds) returns()
func (registry *Registry) TryPackAdminBurnAftermarketDevices(tokenIds []*big.Int) ([]byte, error) {
	return registry.abi.Pack("adminBurnAftermarketDevices", tokenIds)
}

// PackAdminBurnAftermarketDevicesAndDeletePairings is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x63dec203.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminBurnAftermarketDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (registry *Registry) PackAdminBurnAftermarketDevicesAndDeletePairings(tokenIds []*big.Int) []byte {
	enc, err := registry.abi.Pack("adminBurnAftermarketDevicesAndDeletePairings", tokenIds)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminBurnAftermarketDevicesAndDeletePairings is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x63dec203.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminBurnAftermarketDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (registry *Registry) TryPackAdminBurnAftermarketDevicesAndDeletePairings(tokenIds []*big.Int) ([]byte, error) {
	return registry.abi.Pack("adminBurnAftermarketDevicesAndDeletePairings", tokenIds)
}

// PackAdminBurnSyntheticDevicesAndDeletePairings is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x52878b61.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminBurnSyntheticDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (registry *Registry) PackAdminBurnSyntheticDevicesAndDeletePairings(tokenIds []*big.Int) []byte {
	enc, err := registry.abi.Pack("adminBurnSyntheticDevicesAndDeletePairings", tokenIds)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminBurnSyntheticDevicesAndDeletePairings is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x52878b61.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminBurnSyntheticDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (registry *Registry) TryPackAdminBurnSyntheticDevicesAndDeletePairings(tokenIds []*big.Int) ([]byte, error) {
	return registry.abi.Pack("adminBurnSyntheticDevicesAndDeletePairings", tokenIds)
}

// PackAdminBurnVehicles is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x282eb387.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminBurnVehicles(uint256[] tokenIds) returns()
func (registry *Registry) PackAdminBurnVehicles(tokenIds []*big.Int) []byte {
	enc, err := registry.abi.Pack("adminBurnVehicles", tokenIds)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminBurnVehicles is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x282eb387.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminBurnVehicles(uint256[] tokenIds) returns()
func (registry *Registry) TryPackAdminBurnVehicles(tokenIds []*big.Int) ([]byte, error) {
	return registry.abi.Pack("adminBurnVehicles", tokenIds)
}

// PackAdminBurnVehiclesAndDeletePairings is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x11d679c9.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminBurnVehiclesAndDeletePairings(uint256[] tokenIds) returns()
func (registry *Registry) PackAdminBurnVehiclesAndDeletePairings(tokenIds []*big.Int) []byte {
	enc, err := registry.abi.Pack("adminBurnVehiclesAndDeletePairings", tokenIds)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminBurnVehiclesAndDeletePairings is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x11d679c9.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminBurnVehiclesAndDeletePairings(uint256[] tokenIds) returns()
func (registry *Registry) TryPackAdminBurnVehiclesAndDeletePairings(tokenIds []*big.Int) ([]byte, error) {
	return registry.abi.Pack("adminBurnVehiclesAndDeletePairings", tokenIds)
}

// PackAdminCacheDimoStreamrEns is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb17b974b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminCacheDimoStreamrEns() returns()
func (registry *Registry) PackAdminCacheDimoStreamrEns() []byte {
	enc, err := registry.abi.Pack("adminCacheDimoStreamrEns")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminCacheDimoStreamrEns is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb17b974b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminCacheDimoStreamrEns() returns()
func (registry *Registry) TryPackAdminCacheDimoStreamrEns() ([]byte, error) {
	return registry.abi.Pack("adminCacheDimoStreamrEns")
}

// PackAdminChangeParentNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x56936962.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminChangeParentNode(uint256 newParentNode, address idProxyAddress, uint256[] nodeIdList) returns()
func (registry *Registry) PackAdminChangeParentNode(newParentNode *big.Int, idProxyAddress common.Address, nodeIdList []*big.Int) []byte {
	enc, err := registry.abi.Pack("adminChangeParentNode", newParentNode, idProxyAddress, nodeIdList)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminChangeParentNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x56936962.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminChangeParentNode(uint256 newParentNode, address idProxyAddress, uint256[] nodeIdList) returns()
func (registry *Registry) TryPackAdminChangeParentNode(newParentNode *big.Int, idProxyAddress common.Address, nodeIdList []*big.Int) ([]byte, error) {
	return registry.abi.Pack("adminChangeParentNode", newParentNode, idProxyAddress, nodeIdList)
}

// PackAdminPairAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3febacab.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminPairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (registry *Registry) PackAdminPairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) []byte {
	enc, err := registry.abi.Pack("adminPairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminPairAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3febacab.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminPairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (registry *Registry) TryPackAdminPairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) ([]byte, error) {
	return registry.abi.Pack("adminPairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
}

// PackAdminRemoveVehicleAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5f741f4d.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminRemoveVehicleAttribute(string attribute) returns()
func (registry *Registry) PackAdminRemoveVehicleAttribute(attribute string) []byte {
	enc, err := registry.abi.Pack("adminRemoveVehicleAttribute", attribute)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminRemoveVehicleAttribute is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5f741f4d.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminRemoveVehicleAttribute(string attribute) returns()
func (registry *Registry) TryPackAdminRemoveVehicleAttribute(attribute string) ([]byte, error) {
	return registry.abi.Pack("adminRemoveVehicleAttribute", attribute)
}

// PackAdminSetStorageNodeIdForVehicleIds is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3d9cf004.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminSetStorageNodeIdForVehicleIds(uint256[] vehicleIds, uint256 storageNodeId) returns()
func (registry *Registry) PackAdminSetStorageNodeIdForVehicleIds(vehicleIds []*big.Int, storageNodeId *big.Int) []byte {
	enc, err := registry.abi.Pack("adminSetStorageNodeIdForVehicleIds", vehicleIds, storageNodeId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminSetStorageNodeIdForVehicleIds is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3d9cf004.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminSetStorageNodeIdForVehicleIds(uint256[] vehicleIds, uint256 storageNodeId) returns()
func (registry *Registry) TryPackAdminSetStorageNodeIdForVehicleIds(vehicleIds []*big.Int, storageNodeId *big.Int) ([]byte, error) {
	return registry.abi.Pack("adminSetStorageNodeIdForVehicleIds", vehicleIds, storageNodeId)
}

// PackAdminSetVehicleDDs is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xdd60fd1a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adminSetVehicleDDs((uint256,string)[] vehicleIdDdId) returns()
func (registry *Registry) PackAdminSetVehicleDDs(vehicleIdDdId []DevAdminVehicleIdDeviceDefinitionId) []byte {
	enc, err := registry.abi.Pack("adminSetVehicleDDs", vehicleIdDdId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdminSetVehicleDDs is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xdd60fd1a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adminSetVehicleDDs((uint256,string)[] vehicleIdDdId) returns()
func (registry *Registry) TryPackAdminSetVehicleDDs(vehicleIdDdId []DevAdminVehicleIdDeviceDefinitionId) ([]byte, error) {
	return registry.abi.Pack("adminSetVehicleDDs", vehicleIdDdId)
}

// PackBurnSyntheticDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7c7c9978.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function burnSyntheticDeviceSign(uint256 vehicleNode, uint256 syntheticDeviceNode, bytes ownerSig) returns()
func (registry *Registry) PackBurnSyntheticDeviceSign(vehicleNode *big.Int, syntheticDeviceNode *big.Int, ownerSig []byte) []byte {
	enc, err := registry.abi.Pack("burnSyntheticDeviceSign", vehicleNode, syntheticDeviceNode, ownerSig)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackBurnSyntheticDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7c7c9978.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function burnSyntheticDeviceSign(uint256 vehicleNode, uint256 syntheticDeviceNode, bytes ownerSig) returns()
func (registry *Registry) TryPackBurnSyntheticDeviceSign(vehicleNode *big.Int, syntheticDeviceNode *big.Int, ownerSig []byte) ([]byte, error) {
	return registry.abi.Pack("burnSyntheticDeviceSign", vehicleNode, syntheticDeviceNode, ownerSig)
}

// PackBurnVehicleSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd0b61156.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function burnVehicleSign(uint256 tokenId, bytes ownerSig) returns()
func (registry *Registry) PackBurnVehicleSign(tokenId *big.Int, ownerSig []byte) []byte {
	enc, err := registry.abi.Pack("burnVehicleSign", tokenId, ownerSig)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackBurnVehicleSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd0b61156.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function burnVehicleSign(uint256 tokenId, bytes ownerSig) returns()
func (registry *Registry) TryPackBurnVehicleSign(tokenId *big.Int, ownerSig []byte) ([]byte, error) {
	return registry.abi.Pack("burnVehicleSign", tokenId, ownerSig)
}

// PackClaimAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x08d2c2f5.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function claimAftermarketDevice(uint256 aftermarketDeviceNode, bytes aftermarketDeviceSig) returns()
func (registry *Registry) PackClaimAftermarketDevice(aftermarketDeviceNode *big.Int, aftermarketDeviceSig []byte) []byte {
	enc, err := registry.abi.Pack("claimAftermarketDevice", aftermarketDeviceNode, aftermarketDeviceSig)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackClaimAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x08d2c2f5.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function claimAftermarketDevice(uint256 aftermarketDeviceNode, bytes aftermarketDeviceSig) returns()
func (registry *Registry) TryPackClaimAftermarketDevice(aftermarketDeviceNode *big.Int, aftermarketDeviceSig []byte) ([]byte, error) {
	return registry.abi.Pack("claimAftermarketDevice", aftermarketDeviceNode, aftermarketDeviceSig)
}

// PackClaimAftermarketDeviceBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xab2ae229.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function claimAftermarketDeviceBatch((uint256,address)[] adOwnerPair) returns()
func (registry *Registry) PackClaimAftermarketDeviceBatch(adOwnerPair []AftermarketDeviceOwnerPair) []byte {
	enc, err := registry.abi.Pack("claimAftermarketDeviceBatch", adOwnerPair)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackClaimAftermarketDeviceBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xab2ae229.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function claimAftermarketDeviceBatch((uint256,address)[] adOwnerPair) returns()
func (registry *Registry) TryPackClaimAftermarketDeviceBatch(adOwnerPair []AftermarketDeviceOwnerPair) ([]byte, error) {
	return registry.abi.Pack("claimAftermarketDeviceBatch", adOwnerPair)
}

// PackClaimAftermarketDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x89a841bb.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function claimAftermarketDeviceSign(uint256 aftermarketDeviceNode, address owner, bytes ownerSig, bytes aftermarketDeviceSig) returns()
func (registry *Registry) PackClaimAftermarketDeviceSign(aftermarketDeviceNode *big.Int, owner common.Address, ownerSig []byte, aftermarketDeviceSig []byte) []byte {
	enc, err := registry.abi.Pack("claimAftermarketDeviceSign", aftermarketDeviceNode, owner, ownerSig, aftermarketDeviceSig)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackClaimAftermarketDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x89a841bb.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function claimAftermarketDeviceSign(uint256 aftermarketDeviceNode, address owner, bytes ownerSig, bytes aftermarketDeviceSig) returns()
func (registry *Registry) TryPackClaimAftermarketDeviceSign(aftermarketDeviceNode *big.Int, owner common.Address, ownerSig []byte, aftermarketDeviceSig []byte) ([]byte, error) {
	return registry.abi.Pack("claimAftermarketDeviceSign", aftermarketDeviceNode, owner, ownerSig, aftermarketDeviceSig)
}

// PackCreateDeviceDefinitionTable is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x20954d21.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function createDeviceDefinitionTable(address tableOwner, uint256 manufacturerId) returns()
func (registry *Registry) PackCreateDeviceDefinitionTable(tableOwner common.Address, manufacturerId *big.Int) []byte {
	enc, err := registry.abi.Pack("createDeviceDefinitionTable", tableOwner, manufacturerId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackCreateDeviceDefinitionTable is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x20954d21.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function createDeviceDefinitionTable(address tableOwner, uint256 manufacturerId) returns()
func (registry *Registry) TryPackCreateDeviceDefinitionTable(tableOwner common.Address, manufacturerId *big.Int) ([]byte, error) {
	return registry.abi.Pack("createDeviceDefinitionTable", tableOwner, manufacturerId)
}

// PackCreateDeviceDefinitionTableBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x794c6790.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function createDeviceDefinitionTableBatch(address tableOwner, uint256[] manufacturerIds) returns()
func (registry *Registry) PackCreateDeviceDefinitionTableBatch(tableOwner common.Address, manufacturerIds []*big.Int) []byte {
	enc, err := registry.abi.Pack("createDeviceDefinitionTableBatch", tableOwner, manufacturerIds)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackCreateDeviceDefinitionTableBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x794c6790.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function createDeviceDefinitionTableBatch(address tableOwner, uint256[] manufacturerIds) returns()
func (registry *Registry) TryPackCreateDeviceDefinitionTableBatch(tableOwner common.Address, manufacturerIds []*big.Int) ([]byte, error) {
	return registry.abi.Pack("createDeviceDefinitionTableBatch", tableOwner, manufacturerIds)
}

// PackCreateVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x497323c8.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function createVehicleStream(uint256 vehicleId) returns()
func (registry *Registry) PackCreateVehicleStream(vehicleId *big.Int) []byte {
	enc, err := registry.abi.Pack("createVehicleStream", vehicleId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackCreateVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x497323c8.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function createVehicleStream(uint256 vehicleId) returns()
func (registry *Registry) TryPackCreateVehicleStream(vehicleId *big.Int) ([]byte, error) {
	return registry.abi.Pack("createVehicleStream", vehicleId)
}

// PackDeleteDeviceDefinition is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x32b3f2d5.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function deleteDeviceDefinition(uint256 manufacturerId, string id) returns()
func (registry *Registry) PackDeleteDeviceDefinition(manufacturerId *big.Int, id string) []byte {
	enc, err := registry.abi.Pack("deleteDeviceDefinition", manufacturerId, id)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackDeleteDeviceDefinition is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x32b3f2d5.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function deleteDeviceDefinition(uint256 manufacturerId, string id) returns()
func (registry *Registry) TryPackDeleteDeviceDefinition(manufacturerId *big.Int, id string) ([]byte, error) {
	return registry.abi.Pack("deleteDeviceDefinition", manufacturerId, id)
}

// PackGetAftermarketDeviceAddressById is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x682a25e3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getAftermarketDeviceAddressById(uint256 nodeId) view returns(address addr)
func (registry *Registry) PackGetAftermarketDeviceAddressById(nodeId *big.Int) []byte {
	enc, err := registry.abi.Pack("getAftermarketDeviceAddressById", nodeId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetAftermarketDeviceAddressById is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x682a25e3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getAftermarketDeviceAddressById(uint256 nodeId) view returns(address addr)
func (registry *Registry) TryPackGetAftermarketDeviceAddressById(nodeId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getAftermarketDeviceAddressById", nodeId)
}

// UnpackGetAftermarketDeviceAddressById is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x682a25e3.
//
// Solidity: function getAftermarketDeviceAddressById(uint256 nodeId) view returns(address addr)
func (registry *Registry) UnpackGetAftermarketDeviceAddressById(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getAftermarketDeviceAddressById", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetAftermarketDeviceIdByAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9796cf22.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getAftermarketDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (registry *Registry) PackGetAftermarketDeviceIdByAddress(addr common.Address) []byte {
	enc, err := registry.abi.Pack("getAftermarketDeviceIdByAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetAftermarketDeviceIdByAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9796cf22.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getAftermarketDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (registry *Registry) TryPackGetAftermarketDeviceIdByAddress(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("getAftermarketDeviceIdByAddress", addr)
}

// UnpackGetAftermarketDeviceIdByAddress is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x9796cf22.
//
// Solidity: function getAftermarketDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (registry *Registry) UnpackGetAftermarketDeviceIdByAddress(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getAftermarketDeviceIdByAddress", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetBeneficiary is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0a6cef46.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getBeneficiary(address idProxyAddress, uint256 nodeId) view returns(address beneficiary)
func (registry *Registry) PackGetBeneficiary(idProxyAddress common.Address, nodeId *big.Int) []byte {
	enc, err := registry.abi.Pack("getBeneficiary", idProxyAddress, nodeId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetBeneficiary is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0a6cef46.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getBeneficiary(address idProxyAddress, uint256 nodeId) view returns(address beneficiary)
func (registry *Registry) TryPackGetBeneficiary(idProxyAddress common.Address, nodeId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getBeneficiary", idProxyAddress, nodeId)
}

// UnpackGetBeneficiary is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x0a6cef46.
//
// Solidity: function getBeneficiary(address idProxyAddress, uint256 nodeId) view returns(address beneficiary)
func (registry *Registry) UnpackGetBeneficiary(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getBeneficiary", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetConnectionsManager is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb0c1d1df.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getConnectionsManager() view returns(address connectionsManager)
func (registry *Registry) PackGetConnectionsManager() []byte {
	enc, err := registry.abi.Pack("getConnectionsManager")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetConnectionsManager is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb0c1d1df.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getConnectionsManager() view returns(address connectionsManager)
func (registry *Registry) TryPackGetConnectionsManager() ([]byte, error) {
	return registry.abi.Pack("getConnectionsManager")
}

// UnpackGetConnectionsManager is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xb0c1d1df.
//
// Solidity: function getConnectionsManager() view returns(address connectionsManager)
func (registry *Registry) UnpackGetConnectionsManager(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getConnectionsManager", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetDcxOperationCost is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd25f5787.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDcxOperationCost(bytes32 operation) view returns(uint256 cost)
func (registry *Registry) PackGetDcxOperationCost(operation [32]byte) []byte {
	enc, err := registry.abi.Pack("getDcxOperationCost", operation)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDcxOperationCost is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd25f5787.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDcxOperationCost(bytes32 operation) view returns(uint256 cost)
func (registry *Registry) TryPackGetDcxOperationCost(operation [32]byte) ([]byte, error) {
	return registry.abi.Pack("getDcxOperationCost", operation)
}

// UnpackGetDcxOperationCost is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd25f5787.
//
// Solidity: function getDcxOperationCost(bytes32 operation) view returns(uint256 cost)
func (registry *Registry) UnpackGetDcxOperationCost(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getDcxOperationCost", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetDefaultStorageNodeId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe75745e9.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDefaultStorageNodeId() view returns(uint256 defaultStorageNodeId)
func (registry *Registry) PackGetDefaultStorageNodeId() []byte {
	enc, err := registry.abi.Pack("getDefaultStorageNodeId")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDefaultStorageNodeId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe75745e9.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDefaultStorageNodeId() view returns(uint256 defaultStorageNodeId)
func (registry *Registry) TryPackGetDefaultStorageNodeId() ([]byte, error) {
	return registry.abi.Pack("getDefaultStorageNodeId")
}

// UnpackGetDefaultStorageNodeId is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xe75745e9.
//
// Solidity: function getDefaultStorageNodeId() view returns(uint256 defaultStorageNodeId)
func (registry *Registry) UnpackGetDefaultStorageNodeId(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getDefaultStorageNodeId", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetDeviceDefinitionIdByVehicleId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb7bded95.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDeviceDefinitionIdByVehicleId(uint256 vehicleId) view returns(string ddId)
func (registry *Registry) PackGetDeviceDefinitionIdByVehicleId(vehicleId *big.Int) []byte {
	enc, err := registry.abi.Pack("getDeviceDefinitionIdByVehicleId", vehicleId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDeviceDefinitionIdByVehicleId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb7bded95.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDeviceDefinitionIdByVehicleId(uint256 vehicleId) view returns(string ddId)
func (registry *Registry) TryPackGetDeviceDefinitionIdByVehicleId(vehicleId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getDeviceDefinitionIdByVehicleId", vehicleId)
}

// UnpackGetDeviceDefinitionIdByVehicleId is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xb7bded95.
//
// Solidity: function getDeviceDefinitionIdByVehicleId(uint256 vehicleId) view returns(string ddId)
func (registry *Registry) UnpackGetDeviceDefinitionIdByVehicleId(data []byte) (string, error) {
	out, err := registry.abi.Unpack("getDeviceDefinitionIdByVehicleId", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackGetDeviceDefinitionTableId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x396e5987.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDeviceDefinitionTableId(uint256 manufacturerId) view returns(uint256 tableId)
func (registry *Registry) PackGetDeviceDefinitionTableId(manufacturerId *big.Int) []byte {
	enc, err := registry.abi.Pack("getDeviceDefinitionTableId", manufacturerId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDeviceDefinitionTableId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x396e5987.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDeviceDefinitionTableId(uint256 manufacturerId) view returns(uint256 tableId)
func (registry *Registry) TryPackGetDeviceDefinitionTableId(manufacturerId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getDeviceDefinitionTableId", manufacturerId)
}

// UnpackGetDeviceDefinitionTableId is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x396e5987.
//
// Solidity: function getDeviceDefinitionTableId(uint256 manufacturerId) view returns(uint256 tableId)
func (registry *Registry) UnpackGetDeviceDefinitionTableId(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getDeviceDefinitionTableId", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetDeviceDefinitionTableName is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa1d17941.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDeviceDefinitionTableName(uint256 manufacturerId) view returns(string tableName)
func (registry *Registry) PackGetDeviceDefinitionTableName(manufacturerId *big.Int) []byte {
	enc, err := registry.abi.Pack("getDeviceDefinitionTableName", manufacturerId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDeviceDefinitionTableName is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa1d17941.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDeviceDefinitionTableName(uint256 manufacturerId) view returns(string tableName)
func (registry *Registry) TryPackGetDeviceDefinitionTableName(manufacturerId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getDeviceDefinitionTableName", manufacturerId)
}

// UnpackGetDeviceDefinitionTableName is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xa1d17941.
//
// Solidity: function getDeviceDefinitionTableName(uint256 manufacturerId) view returns(string tableName)
func (registry *Registry) UnpackGetDeviceDefinitionTableName(data []byte) (string, error) {
	out, err := registry.abi.Unpack("getDeviceDefinitionTableName", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackGetDimoCredit is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xcfe55b7d.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDimoCredit() view returns(address dimoCredit)
func (registry *Registry) PackGetDimoCredit() []byte {
	enc, err := registry.abi.Pack("getDimoCredit")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDimoCredit is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xcfe55b7d.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDimoCredit() view returns(address dimoCredit)
func (registry *Registry) TryPackGetDimoCredit() ([]byte, error) {
	return registry.abi.Pack("getDimoCredit")
}

// UnpackGetDimoCredit is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xcfe55b7d.
//
// Solidity: function getDimoCredit() view returns(address dimoCredit)
func (registry *Registry) UnpackGetDimoCredit(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getDimoCredit", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetDimoToken is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x77898251.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDimoToken() view returns(address dimoToken)
func (registry *Registry) PackGetDimoToken() []byte {
	enc, err := registry.abi.Pack("getDimoToken")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDimoToken is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x77898251.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDimoToken() view returns(address dimoToken)
func (registry *Registry) TryPackGetDimoToken() ([]byte, error) {
	return registry.abi.Pack("getDimoToken")
}

// UnpackGetDimoToken is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x77898251.
//
// Solidity: function getDimoToken() view returns(address dimoToken)
func (registry *Registry) UnpackGetDimoToken(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getDimoToken", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetFoundation is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa2bc6cdf.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getFoundation() view returns(address foundation)
func (registry *Registry) PackGetFoundation() []byte {
	enc, err := registry.abi.Pack("getFoundation")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetFoundation is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa2bc6cdf.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getFoundation() view returns(address foundation)
func (registry *Registry) TryPackGetFoundation() ([]byte, error) {
	return registry.abi.Pack("getFoundation")
}

// UnpackGetFoundation is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xa2bc6cdf.
//
// Solidity: function getFoundation() view returns(address foundation)
func (registry *Registry) UnpackGetFoundation(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getFoundation", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xdce2f860.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getInfo(address idProxyAddress, uint256 tokenId, string attribute) view returns(string info)
func (registry *Registry) PackGetInfo(idProxyAddress common.Address, tokenId *big.Int, attribute string) []byte {
	enc, err := registry.abi.Pack("getInfo", idProxyAddress, tokenId, attribute)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xdce2f860.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getInfo(address idProxyAddress, uint256 tokenId, string attribute) view returns(string info)
func (registry *Registry) TryPackGetInfo(idProxyAddress common.Address, tokenId *big.Int, attribute string) ([]byte, error) {
	return registry.abi.Pack("getInfo", idProxyAddress, tokenId, attribute)
}

// UnpackGetInfo is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xdce2f860.
//
// Solidity: function getInfo(address idProxyAddress, uint256 tokenId, string attribute) view returns(string info)
func (registry *Registry) UnpackGetInfo(data []byte) (string, error) {
	out, err := registry.abi.Unpack("getInfo", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackGetLink is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x112e62a2.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getLink(address idProxyAddress, uint256 sourceNode) view returns(uint256 targetNode)
func (registry *Registry) PackGetLink(idProxyAddress common.Address, sourceNode *big.Int) []byte {
	enc, err := registry.abi.Pack("getLink", idProxyAddress, sourceNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetLink is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x112e62a2.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getLink(address idProxyAddress, uint256 sourceNode) view returns(uint256 targetNode)
func (registry *Registry) TryPackGetLink(idProxyAddress common.Address, sourceNode *big.Int) ([]byte, error) {
	return registry.abi.Pack("getLink", idProxyAddress, sourceNode)
}

// UnpackGetLink is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x112e62a2.
//
// Solidity: function getLink(address idProxyAddress, uint256 sourceNode) view returns(uint256 targetNode)
func (registry *Registry) UnpackGetLink(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getLink", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetManufacturerIdByName is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xce55aab0.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getManufacturerIdByName(string name) view returns(uint256 nodeId)
func (registry *Registry) PackGetManufacturerIdByName(name string) []byte {
	enc, err := registry.abi.Pack("getManufacturerIdByName", name)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetManufacturerIdByName is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xce55aab0.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getManufacturerIdByName(string name) view returns(uint256 nodeId)
func (registry *Registry) TryPackGetManufacturerIdByName(name string) ([]byte, error) {
	return registry.abi.Pack("getManufacturerIdByName", name)
}

// UnpackGetManufacturerIdByName is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xce55aab0.
//
// Solidity: function getManufacturerIdByName(string name) view returns(uint256 nodeId)
func (registry *Registry) UnpackGetManufacturerIdByName(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getManufacturerIdByName", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetManufacturerLicense is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x170e4293.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getManufacturerLicense() view returns(address manufacturerLicense)
func (registry *Registry) PackGetManufacturerLicense() []byte {
	enc, err := registry.abi.Pack("getManufacturerLicense")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetManufacturerLicense is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x170e4293.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getManufacturerLicense() view returns(address manufacturerLicense)
func (registry *Registry) TryPackGetManufacturerLicense() ([]byte, error) {
	return registry.abi.Pack("getManufacturerLicense")
}

// UnpackGetManufacturerLicense is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x170e4293.
//
// Solidity: function getManufacturerLicense() view returns(address manufacturerLicense)
func (registry *Registry) UnpackGetManufacturerLicense(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getManufacturerLicense", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetManufacturerNameById is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9109b30b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getManufacturerNameById(uint256 tokenId) view returns(string name)
func (registry *Registry) PackGetManufacturerNameById(tokenId *big.Int) []byte {
	enc, err := registry.abi.Pack("getManufacturerNameById", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetManufacturerNameById is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9109b30b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getManufacturerNameById(uint256 tokenId) view returns(string name)
func (registry *Registry) TryPackGetManufacturerNameById(tokenId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getManufacturerNameById", tokenId)
}

// UnpackGetManufacturerNameById is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x9109b30b.
//
// Solidity: function getManufacturerNameById(uint256 tokenId) view returns(string name)
func (registry *Registry) UnpackGetManufacturerNameById(data []byte) (string, error) {
	out, err := registry.abi.Unpack("getManufacturerNameById", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackGetNodeLink is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xbd2b5568.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getNodeLink(address idProxyAddressSource, address idProxyAddressTarget, uint256 sourceNode) view returns(uint256 targetNode)
func (registry *Registry) PackGetNodeLink(idProxyAddressSource common.Address, idProxyAddressTarget common.Address, sourceNode *big.Int) []byte {
	enc, err := registry.abi.Pack("getNodeLink", idProxyAddressSource, idProxyAddressTarget, sourceNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetNodeLink is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xbd2b5568.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getNodeLink(address idProxyAddressSource, address idProxyAddressTarget, uint256 sourceNode) view returns(uint256 targetNode)
func (registry *Registry) TryPackGetNodeLink(idProxyAddressSource common.Address, idProxyAddressTarget common.Address, sourceNode *big.Int) ([]byte, error) {
	return registry.abi.Pack("getNodeLink", idProxyAddressSource, idProxyAddressTarget, sourceNode)
}

// UnpackGetNodeLink is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xbd2b5568.
//
// Solidity: function getNodeLink(address idProxyAddressSource, address idProxyAddressTarget, uint256 sourceNode) view returns(uint256 targetNode)
func (registry *Registry) UnpackGetNodeLink(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getNodeLink", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetParentNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x82087d24.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getParentNode(address idProxyAddress, uint256 tokenId) view returns(uint256 parentNode)
func (registry *Registry) PackGetParentNode(idProxyAddress common.Address, tokenId *big.Int) []byte {
	enc, err := registry.abi.Pack("getParentNode", idProxyAddress, tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetParentNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x82087d24.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getParentNode(address idProxyAddress, uint256 tokenId) view returns(uint256 parentNode)
func (registry *Registry) TryPackGetParentNode(idProxyAddress common.Address, tokenId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getParentNode", idProxyAddress, tokenId)
}

// UnpackGetParentNode is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x82087d24.
//
// Solidity: function getParentNode(address idProxyAddress, uint256 tokenId) view returns(uint256 parentNode)
func (registry *Registry) UnpackGetParentNode(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getParentNode", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetPolicy is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x66df322e.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getPolicy(address caller, uint256 ) payable returns((bool,bool,bool,string,string,string[]) policy)
func (registry *Registry) PackGetPolicy(caller common.Address, arg1 *big.Int) []byte {
	enc, err := registry.abi.Pack("getPolicy", caller, arg1)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetPolicy is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x66df322e.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getPolicy(address caller, uint256 ) payable returns((bool,bool,bool,string,string,string[]) policy)
func (registry *Registry) TryPackGetPolicy(caller common.Address, arg1 *big.Int) ([]byte, error) {
	return registry.abi.Pack("getPolicy", caller, arg1)
}

// UnpackGetPolicy is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x66df322e.
//
// Solidity: function getPolicy(address caller, uint256 ) payable returns((bool,bool,bool,string,string,string[]) policy)
func (registry *Registry) UnpackGetPolicy(data []byte) (TablelandPolicy, error) {
	out, err := registry.abi.Unpack("getPolicy", data)
	if err != nil {
		return *new(TablelandPolicy), err
	}
	out0 := *abi.ConvertType(out[0], new(TablelandPolicy)).(*TablelandPolicy)
	return out0, nil
}

// PackGetRoleAdmin is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x248a9ca3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (registry *Registry) PackGetRoleAdmin(role [32]byte) []byte {
	enc, err := registry.abi.Pack("getRoleAdmin", role)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetRoleAdmin is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x248a9ca3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (registry *Registry) TryPackGetRoleAdmin(role [32]byte) ([]byte, error) {
	return registry.abi.Pack("getRoleAdmin", role)
}

// UnpackGetRoleAdmin is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x248a9ca3.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (registry *Registry) UnpackGetRoleAdmin(data []byte) ([32]byte, error) {
	out, err := registry.abi.Unpack("getRoleAdmin", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackGetSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc3d8478c.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getSacd() view returns(address sacd)
func (registry *Registry) PackGetSacd() []byte {
	enc, err := registry.abi.Pack("getSacd")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc3d8478c.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getSacd() view returns(address sacd)
func (registry *Registry) TryPackGetSacd() ([]byte, error) {
	return registry.abi.Pack("getSacd")
}

// UnpackGetSacd is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xc3d8478c.
//
// Solidity: function getSacd() view returns(address sacd)
func (registry *Registry) UnpackGetSacd(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getSacd", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetStorageNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5cc867dc.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getStorageNode() view returns(address storageNode)
func (registry *Registry) PackGetStorageNode() []byte {
	enc, err := registry.abi.Pack("getStorageNode")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetStorageNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5cc867dc.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getStorageNode() view returns(address storageNode)
func (registry *Registry) TryPackGetStorageNode() ([]byte, error) {
	return registry.abi.Pack("getStorageNode")
}

// UnpackGetStorageNode is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x5cc867dc.
//
// Solidity: function getStorageNode() view returns(address storageNode)
func (registry *Registry) UnpackGetStorageNode(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getStorageNode", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetSyntheticDeviceAddressById is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x493b27e1.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getSyntheticDeviceAddressById(uint256 nodeId) view returns(address addr)
func (registry *Registry) PackGetSyntheticDeviceAddressById(nodeId *big.Int) []byte {
	enc, err := registry.abi.Pack("getSyntheticDeviceAddressById", nodeId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetSyntheticDeviceAddressById is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x493b27e1.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getSyntheticDeviceAddressById(uint256 nodeId) view returns(address addr)
func (registry *Registry) TryPackGetSyntheticDeviceAddressById(nodeId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getSyntheticDeviceAddressById", nodeId)
}

// UnpackGetSyntheticDeviceAddressById is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x493b27e1.
//
// Solidity: function getSyntheticDeviceAddressById(uint256 nodeId) view returns(address addr)
func (registry *Registry) UnpackGetSyntheticDeviceAddressById(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("getSyntheticDeviceAddressById", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetSyntheticDeviceIdByAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x795b910a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getSyntheticDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (registry *Registry) PackGetSyntheticDeviceIdByAddress(addr common.Address) []byte {
	enc, err := registry.abi.Pack("getSyntheticDeviceIdByAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetSyntheticDeviceIdByAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x795b910a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getSyntheticDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (registry *Registry) TryPackGetSyntheticDeviceIdByAddress(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("getSyntheticDeviceIdByAddress", addr)
}

// UnpackGetSyntheticDeviceIdByAddress is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x795b910a.
//
// Solidity: function getSyntheticDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (registry *Registry) UnpackGetSyntheticDeviceIdByAddress(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("getSyntheticDeviceIdByAddress", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackGetVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x180e469a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getVehicleStream(uint256 vehicleId) view returns(string streamId)
func (registry *Registry) PackGetVehicleStream(vehicleId *big.Int) []byte {
	enc, err := registry.abi.Pack("getVehicleStream", vehicleId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x180e469a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getVehicleStream(uint256 vehicleId) view returns(string streamId)
func (registry *Registry) TryPackGetVehicleStream(vehicleId *big.Int) ([]byte, error) {
	return registry.abi.Pack("getVehicleStream", vehicleId)
}

// UnpackGetVehicleStream is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x180e469a.
//
// Solidity: function getVehicleStream(uint256 vehicleId) view returns(string streamId)
func (registry *Registry) UnpackGetVehicleStream(data []byte) (string, error) {
	out, err := registry.abi.Unpack("getVehicleStream", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackGrantRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x2f2ff15d.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function grantRole(bytes32 role, address account) returns()
func (registry *Registry) PackGrantRole(role [32]byte, account common.Address) []byte {
	enc, err := registry.abi.Pack("grantRole", role, account)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGrantRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x2f2ff15d.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function grantRole(bytes32 role, address account) returns()
func (registry *Registry) TryPackGrantRole(role [32]byte, account common.Address) ([]byte, error) {
	return registry.abi.Pack("grantRole", role, account)
}

// PackHasRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x91d14854.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (registry *Registry) PackHasRole(role [32]byte, account common.Address) []byte {
	enc, err := registry.abi.Pack("hasRole", role, account)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackHasRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x91d14854.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (registry *Registry) TryPackHasRole(role [32]byte, account common.Address) ([]byte, error) {
	return registry.abi.Pack("hasRole", role, account)
}

// UnpackHasRole is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (registry *Registry) UnpackHasRole(data []byte) (bool, error) {
	out, err := registry.abi.Unpack("hasRole", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4cd88b76.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function initialize(string name, string version) returns()
func (registry *Registry) PackInitialize(name string, version string) []byte {
	enc, err := registry.abi.Pack("initialize", name, version)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4cd88b76.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function initialize(string name, string version) returns()
func (registry *Registry) TryPackInitialize(name string, version string) ([]byte, error) {
	return registry.abi.Pack("initialize", name, version)
}

// PackInsertDeviceDefinition is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x23536c5f.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function insertDeviceDefinition(uint256 manufacturerId, (string,string,uint256,string,string,string,string) data) returns()
func (registry *Registry) PackInsertDeviceDefinition(manufacturerId *big.Int, data DeviceDefinitionInput) []byte {
	enc, err := registry.abi.Pack("insertDeviceDefinition", manufacturerId, data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackInsertDeviceDefinition is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x23536c5f.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function insertDeviceDefinition(uint256 manufacturerId, (string,string,uint256,string,string,string,string) data) returns()
func (registry *Registry) TryPackInsertDeviceDefinition(manufacturerId *big.Int, data DeviceDefinitionInput) ([]byte, error) {
	return registry.abi.Pack("insertDeviceDefinition", manufacturerId, data)
}

// PackInsertDeviceDefinitionBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x80d50451.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function insertDeviceDefinitionBatch(uint256 manufacturerId, (string,string,uint256,string,string,string,string)[] data) returns()
func (registry *Registry) PackInsertDeviceDefinitionBatch(manufacturerId *big.Int, data []DeviceDefinitionInput) []byte {
	enc, err := registry.abi.Pack("insertDeviceDefinitionBatch", manufacturerId, data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackInsertDeviceDefinitionBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x80d50451.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function insertDeviceDefinitionBatch(uint256 manufacturerId, (string,string,uint256,string,string,string,string)[] data) returns()
func (registry *Registry) TryPackInsertDeviceDefinitionBatch(manufacturerId *big.Int, data []DeviceDefinitionInput) ([]byte, error) {
	return registry.abi.Pack("insertDeviceDefinitionBatch", manufacturerId, data)
}

// PackIsAftermarketDeviceClaimed is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc6b36f2a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function isAftermarketDeviceClaimed(uint256 nodeId) view returns(bool isClaimed)
func (registry *Registry) PackIsAftermarketDeviceClaimed(nodeId *big.Int) []byte {
	enc, err := registry.abi.Pack("isAftermarketDeviceClaimed", nodeId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackIsAftermarketDeviceClaimed is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc6b36f2a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function isAftermarketDeviceClaimed(uint256 nodeId) view returns(bool isClaimed)
func (registry *Registry) TryPackIsAftermarketDeviceClaimed(nodeId *big.Int) ([]byte, error) {
	return registry.abi.Pack("isAftermarketDeviceClaimed", nodeId)
}

// UnpackIsAftermarketDeviceClaimed is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xc6b36f2a.
//
// Solidity: function isAftermarketDeviceClaimed(uint256 nodeId) view returns(bool isClaimed)
func (registry *Registry) UnpackIsAftermarketDeviceClaimed(data []byte) (bool, error) {
	out, err := registry.abi.Unpack("isAftermarketDeviceClaimed", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackIsAllowedToOwnManufacturerNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd9c27c40.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function isAllowedToOwnManufacturerNode(address addr) view returns(bool _isAllowed)
func (registry *Registry) PackIsAllowedToOwnManufacturerNode(addr common.Address) []byte {
	enc, err := registry.abi.Pack("isAllowedToOwnManufacturerNode", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackIsAllowedToOwnManufacturerNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd9c27c40.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function isAllowedToOwnManufacturerNode(address addr) view returns(bool _isAllowed)
func (registry *Registry) TryPackIsAllowedToOwnManufacturerNode(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("isAllowedToOwnManufacturerNode", addr)
}

// UnpackIsAllowedToOwnManufacturerNode is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd9c27c40.
//
// Solidity: function isAllowedToOwnManufacturerNode(address addr) view returns(bool _isAllowed)
func (registry *Registry) UnpackIsAllowedToOwnManufacturerNode(data []byte) (bool, error) {
	out, err := registry.abi.Unpack("isAllowedToOwnManufacturerNode", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackIsController is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb429afeb.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function isController(address addr) view returns(bool _isController)
func (registry *Registry) PackIsController(addr common.Address) []byte {
	enc, err := registry.abi.Pack("isController", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackIsController is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb429afeb.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function isController(address addr) view returns(bool _isController)
func (registry *Registry) TryPackIsController(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("isController", addr)
}

// UnpackIsController is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xb429afeb.
//
// Solidity: function isController(address addr) view returns(bool _isController)
func (registry *Registry) UnpackIsController(data []byte) (bool, error) {
	out, err := registry.abi.Unpack("isController", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackIsManufacturerMinted is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x456bf169.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function isManufacturerMinted(address addr) view returns(bool _isManufacturerMinted)
func (registry *Registry) PackIsManufacturerMinted(addr common.Address) []byte {
	enc, err := registry.abi.Pack("isManufacturerMinted", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackIsManufacturerMinted is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x456bf169.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function isManufacturerMinted(address addr) view returns(bool _isManufacturerMinted)
func (registry *Registry) TryPackIsManufacturerMinted(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("isManufacturerMinted", addr)
}

// UnpackIsManufacturerMinted is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x456bf169.
//
// Solidity: function isManufacturerMinted(address addr) view returns(bool _isManufacturerMinted)
func (registry *Registry) UnpackIsManufacturerMinted(data []byte) (bool, error) {
	out, err := registry.abi.Unpack("isManufacturerMinted", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackMintAftermarketDeviceByManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7ba79a39.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintAftermarketDeviceByManufacturerBatch(uint256 manufacturerNode, (address,(string,string)[])[] adInfos) returns()
func (registry *Registry) PackMintAftermarketDeviceByManufacturerBatch(manufacturerNode *big.Int, adInfos []AftermarketDeviceInfos) []byte {
	enc, err := registry.abi.Pack("mintAftermarketDeviceByManufacturerBatch", manufacturerNode, adInfos)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintAftermarketDeviceByManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7ba79a39.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintAftermarketDeviceByManufacturerBatch(uint256 manufacturerNode, (address,(string,string)[])[] adInfos) returns()
func (registry *Registry) TryPackMintAftermarketDeviceByManufacturerBatch(manufacturerNode *big.Int, adInfos []AftermarketDeviceInfos) ([]byte, error) {
	return registry.abi.Pack("mintAftermarketDeviceByManufacturerBatch", manufacturerNode, adInfos)
}

// PackMintManufacturer is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5f36da6b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintManufacturer(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (registry *Registry) PackMintManufacturer(owner common.Address, name string, attrInfoPairList []AttributeInfoPair) []byte {
	enc, err := registry.abi.Pack("mintManufacturer", owner, name, attrInfoPairList)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintManufacturer is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5f36da6b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintManufacturer(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (registry *Registry) TryPackMintManufacturer(owner common.Address, name string, attrInfoPairList []AttributeInfoPair) ([]byte, error) {
	return registry.abi.Pack("mintManufacturer", owner, name, attrInfoPairList)
}

// PackMintManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9abb3000.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintManufacturerBatch(address owner, string[] names) returns()
func (registry *Registry) PackMintManufacturerBatch(owner common.Address, names []string) []byte {
	enc, err := registry.abi.Pack("mintManufacturerBatch", owner, names)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9abb3000.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintManufacturerBatch(address owner, string[] names) returns()
func (registry *Registry) TryPackMintManufacturerBatch(owner common.Address, names []string) ([]byte, error) {
	return registry.abi.Pack("mintManufacturerBatch", owner, names)
}

// PackMintSyntheticDeviceBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x261d982a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintSyntheticDeviceBatch(uint256 connectionId, (uint256,address,(string,string)[])[] data) returns()
func (registry *Registry) PackMintSyntheticDeviceBatch(connectionId *big.Int, data []MintSyntheticDeviceBatchInput) []byte {
	enc, err := registry.abi.Pack("mintSyntheticDeviceBatch", connectionId, data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintSyntheticDeviceBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x261d982a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintSyntheticDeviceBatch(uint256 connectionId, (uint256,address,(string,string)[])[] data) returns()
func (registry *Registry) TryPackMintSyntheticDeviceBatch(connectionId *big.Int, data []MintSyntheticDeviceBatchInput) ([]byte, error) {
	return registry.abi.Pack("mintSyntheticDeviceBatch", connectionId, data)
}

// PackMintSyntheticDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc624e8a1.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintSyntheticDeviceSign((uint256,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (registry *Registry) PackMintSyntheticDeviceSign(data MintSyntheticDeviceInput) []byte {
	enc, err := registry.abi.Pack("mintSyntheticDeviceSign", data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintSyntheticDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc624e8a1.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintSyntheticDeviceSign((uint256,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (registry *Registry) TryPackMintSyntheticDeviceSign(data MintSyntheticDeviceInput) ([]byte, error) {
	return registry.abi.Pack("mintSyntheticDeviceSign", data)
}

// PackMintVehicle is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3da44e56.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, (string,string)[] attrInfo) returns()
func (registry *Registry) PackMintVehicle(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair) []byte {
	enc, err := registry.abi.Pack("mintVehicle", manufacturerNode, owner, attrInfo)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicle is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3da44e56.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, (string,string)[] attrInfo) returns()
func (registry *Registry) TryPackMintVehicle(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair) ([]byte, error) {
	return registry.abi.Pack("mintVehicle", manufacturerNode, owner, attrInfo)
}

// PackMintVehicle0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5d9bc6a4.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, (string,string)[] attrInfo, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) PackMintVehicle0(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair, sacdInput SacdInput) []byte {
	enc, err := registry.abi.Pack("mintVehicle0", manufacturerNode, owner, attrInfo, sacdInput)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicle0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5d9bc6a4.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, (string,string)[] attrInfo, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) TryPackMintVehicle0(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair, sacdInput SacdInput) ([]byte, error) {
	return registry.abi.Pack("mintVehicle0", manufacturerNode, owner, attrInfo, sacdInput)
}

// PackMintVehicle1 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xab36bfb2.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, uint256 storageNodeId, (string,string)[] attrInfo, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) PackMintVehicle1(manufacturerNode *big.Int, owner common.Address, storageNodeId *big.Int, attrInfo []AttributeInfoPair, sacdInput SacdInput) []byte {
	enc, err := registry.abi.Pack("mintVehicle1", manufacturerNode, owner, storageNodeId, attrInfo, sacdInput)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicle1 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xab36bfb2.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, uint256 storageNodeId, (string,string)[] attrInfo, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) TryPackMintVehicle1(manufacturerNode *big.Int, owner common.Address, storageNodeId *big.Int, attrInfo []AttributeInfoPair, sacdInput SacdInput) ([]byte, error) {
	return registry.abi.Pack("mintVehicle1", manufacturerNode, owner, storageNodeId, attrInfo, sacdInput)
}

// PackMintVehicle2 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf50373f8.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, uint256 storageNodeId, (string,string)[] attrInfo) returns()
func (registry *Registry) PackMintVehicle2(manufacturerNode *big.Int, owner common.Address, storageNodeId *big.Int, attrInfo []AttributeInfoPair) []byte {
	enc, err := registry.abi.Pack("mintVehicle2", manufacturerNode, owner, storageNodeId, attrInfo)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicle2 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf50373f8.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, uint256 storageNodeId, (string,string)[] attrInfo) returns()
func (registry *Registry) TryPackMintVehicle2(manufacturerNode *big.Int, owner common.Address, storageNodeId *big.Int, attrInfo []AttributeInfoPair) ([]byte, error) {
	return registry.abi.Pack("mintVehicle2", manufacturerNode, owner, storageNodeId, attrInfo)
}

// PackMintVehicleAndSdSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x688ecea4.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleAndSdSign((uint256,address,uint256,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (registry *Registry) PackMintVehicleAndSdSign(data MintVehicleAndSdInputWithSnId) []byte {
	enc, err := registry.abi.Pack("mintVehicleAndSdSign", data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleAndSdSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x688ecea4.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleAndSdSign((uint256,address,uint256,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (registry *Registry) TryPackMintVehicleAndSdSign(data MintVehicleAndSdInputWithSnId) ([]byte, error) {
	return registry.abi.Pack("mintVehicleAndSdSign", data)
}

// PackMintVehicleAndSdSign0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xfb1a28e8.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleAndSdSign((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (registry *Registry) PackMintVehicleAndSdSign0(data MintVehicleAndSdInput) []byte {
	enc, err := registry.abi.Pack("mintVehicleAndSdSign0", data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleAndSdSign0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xfb1a28e8.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleAndSdSign((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (registry *Registry) TryPackMintVehicleAndSdSign0(data MintVehicleAndSdInput) ([]byte, error) {
	return registry.abi.Pack("mintVehicleAndSdSign0", data)
}

// PackMintVehicleAndSdSignAndSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x2caa687e.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleAndSdSignAndSacd((uint256,address,uint256,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) PackMintVehicleAndSdSignAndSacd(data MintVehicleAndSdInputWithSnId, sacdInput SacdInput) []byte {
	enc, err := registry.abi.Pack("mintVehicleAndSdSignAndSacd", data, sacdInput)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleAndSdSignAndSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x2caa687e.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleAndSdSignAndSacd((uint256,address,uint256,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) TryPackMintVehicleAndSdSignAndSacd(data MintVehicleAndSdInputWithSnId, sacdInput SacdInput) ([]byte, error) {
	return registry.abi.Pack("mintVehicleAndSdSignAndSacd", data, sacdInput)
}

// PackMintVehicleAndSdSignAndSacd0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8a55bfbe.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleAndSdSignAndSacd((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) PackMintVehicleAndSdSignAndSacd0(data MintVehicleAndSdInput, sacdInput SacdInput) []byte {
	enc, err := registry.abi.Pack("mintVehicleAndSdSignAndSacd0", data, sacdInput)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleAndSdSignAndSacd0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8a55bfbe.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleAndSdSignAndSacd((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data, (address,uint256,uint256,string) sacdInput) returns()
func (registry *Registry) TryPackMintVehicleAndSdSignAndSacd0(data MintVehicleAndSdInput, sacdInput SacdInput) ([]byte, error) {
	return registry.abi.Pack("mintVehicleAndSdSignAndSacd0", data, sacdInput)
}

// PackMintVehicleAndSdSignBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7b36d2d3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleAndSdSignBatch((uint256,address,uint256,(string,string)[],uint256,bytes,bytes,address,(string,string)[],(address,uint256,uint256,string))[] data) returns()
func (registry *Registry) PackMintVehicleAndSdSignBatch(data []MintVehicleAndSdInputWithSnIdBatch) []byte {
	enc, err := registry.abi.Pack("mintVehicleAndSdSignBatch", data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleAndSdSignBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7b36d2d3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleAndSdSignBatch((uint256,address,uint256,(string,string)[],uint256,bytes,bytes,address,(string,string)[],(address,uint256,uint256,string))[] data) returns()
func (registry *Registry) TryPackMintVehicleAndSdSignBatch(data []MintVehicleAndSdInputWithSnIdBatch) ([]byte, error) {
	return registry.abi.Pack("mintVehicleAndSdSignBatch", data)
}

// PackMintVehicleAndSdSignBatch0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd44a15ee.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleAndSdSignBatch((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[],(address,uint256,uint256,string))[] data) returns()
func (registry *Registry) PackMintVehicleAndSdSignBatch0(data []MintVehicleAndSdInputBatch) []byte {
	enc, err := registry.abi.Pack("mintVehicleAndSdSignBatch0", data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleAndSdSignBatch0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd44a15ee.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleAndSdSignBatch((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[],(address,uint256,uint256,string))[] data) returns()
func (registry *Registry) TryPackMintVehicleAndSdSignBatch0(data []MintVehicleAndSdInputBatch) ([]byte, error) {
	return registry.abi.Pack("mintVehicleAndSdSignBatch0", data)
}

// PackMintVehicleSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1b1a82c8.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleSign(uint256 manufacturerNode, address owner, (string,string)[] attrInfo, bytes signature) returns()
func (registry *Registry) PackMintVehicleSign(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair, signature []byte) []byte {
	enc, err := registry.abi.Pack("mintVehicleSign", manufacturerNode, owner, attrInfo, signature)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1b1a82c8.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleSign(uint256 manufacturerNode, address owner, (string,string)[] attrInfo, bytes signature) returns()
func (registry *Registry) TryPackMintVehicleSign(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair, signature []byte) ([]byte, error) {
	return registry.abi.Pack("mintVehicleSign", manufacturerNode, owner, attrInfo, signature)
}

// PackMintVehicleSign0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x561fa048.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function mintVehicleSign(uint256 manufacturerNode, address owner, uint256 storageNodeId, (string,string)[] attrInfo, bytes signature) returns()
func (registry *Registry) PackMintVehicleSign0(manufacturerNode *big.Int, owner common.Address, storageNodeId *big.Int, attrInfo []AttributeInfoPair, signature []byte) []byte {
	enc, err := registry.abi.Pack("mintVehicleSign0", manufacturerNode, owner, storageNodeId, attrInfo, signature)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMintVehicleSign0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x561fa048.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function mintVehicleSign(uint256 manufacturerNode, address owner, uint256 storageNodeId, (string,string)[] attrInfo, bytes signature) returns()
func (registry *Registry) TryPackMintVehicleSign0(manufacturerNode *big.Int, owner common.Address, storageNodeId *big.Int, attrInfo []AttributeInfoPair, signature []byte) ([]byte, error) {
	return registry.abi.Pack("mintVehicleSign0", manufacturerNode, owner, storageNodeId, attrInfo, signature)
}

// PackMultiDelegateCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x415c2d96.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function multiDelegateCall(bytes[] data) returns(bytes[] results)
func (registry *Registry) PackMultiDelegateCall(data [][]byte) []byte {
	enc, err := registry.abi.Pack("multiDelegateCall", data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMultiDelegateCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x415c2d96.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function multiDelegateCall(bytes[] data) returns(bytes[] results)
func (registry *Registry) TryPackMultiDelegateCall(data [][]byte) ([]byte, error) {
	return registry.abi.Pack("multiDelegateCall", data)
}

// UnpackMultiDelegateCall is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x415c2d96.
//
// Solidity: function multiDelegateCall(bytes[] data) returns(bytes[] results)
func (registry *Registry) UnpackMultiDelegateCall(data []byte) ([][]byte, error) {
	out, err := registry.abi.Unpack("multiDelegateCall", data)
	if err != nil {
		return *new([][]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([][]byte)).(*[][]byte)
	return out0, nil
}

// PackMultiStaticCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1c0c6e51.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function multiStaticCall(bytes[] data) view returns(bytes[] results)
func (registry *Registry) PackMultiStaticCall(data [][]byte) []byte {
	enc, err := registry.abi.Pack("multiStaticCall", data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMultiStaticCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1c0c6e51.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function multiStaticCall(bytes[] data) view returns(bytes[] results)
func (registry *Registry) TryPackMultiStaticCall(data [][]byte) ([]byte, error) {
	return registry.abi.Pack("multiStaticCall", data)
}

// UnpackMultiStaticCall is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x1c0c6e51.
//
// Solidity: function multiStaticCall(bytes[] data) view returns(bytes[] results)
func (registry *Registry) UnpackMultiStaticCall(data []byte) ([][]byte, error) {
	out, err := registry.abi.Unpack("multiStaticCall", data)
	if err != nil {
		return *new([][]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([][]byte)).(*[][]byte)
	return out0, nil
}

// PackOnBurnVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa91ec798.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function onBurnVehicleStream(uint256 vehicleId) returns()
func (registry *Registry) PackOnBurnVehicleStream(vehicleId *big.Int) []byte {
	enc, err := registry.abi.Pack("onBurnVehicleStream", vehicleId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackOnBurnVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa91ec798.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function onBurnVehicleStream(uint256 vehicleId) returns()
func (registry *Registry) TryPackOnBurnVehicleStream(vehicleId *big.Int) ([]byte, error) {
	return registry.abi.Pack("onBurnVehicleStream", vehicleId)
}

// PackOnERC721Received is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x150b7a02.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) pure returns(bytes4)
func (registry *Registry) PackOnERC721Received(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) []byte {
	enc, err := registry.abi.Pack("onERC721Received", arg0, arg1, arg2, arg3)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackOnERC721Received is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x150b7a02.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) pure returns(bytes4)
func (registry *Registry) TryPackOnERC721Received(arg0 common.Address, arg1 common.Address, arg2 *big.Int, arg3 []byte) ([]byte, error) {
	return registry.abi.Pack("onERC721Received", arg0, arg1, arg2, arg3)
}

// UnpackOnERC721Received is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x150b7a02.
//
// Solidity: function onERC721Received(address , address , uint256 , bytes ) pure returns(bytes4)
func (registry *Registry) UnpackOnERC721Received(data []byte) ([4]byte, error) {
	out, err := registry.abi.Unpack("onERC721Received", data)
	if err != nil {
		return *new([4]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([4]byte)).(*[4]byte)
	return out0, nil
}

// PackOnSetSubscribePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc8f11a06.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function onSetSubscribePrivilege(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (registry *Registry) PackOnSetSubscribePrivilege(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) []byte {
	enc, err := registry.abi.Pack("onSetSubscribePrivilege", vehicleId, subscriber, expirationTime)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackOnSetSubscribePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc8f11a06.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function onSetSubscribePrivilege(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (registry *Registry) TryPackOnSetSubscribePrivilege(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) ([]byte, error) {
	return registry.abi.Pack("onSetSubscribePrivilege", vehicleId, subscriber, expirationTime)
}

// PackOnTransferVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1882b263.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function onTransferVehicleStream(address to, uint256 vehicleId) returns()
func (registry *Registry) PackOnTransferVehicleStream(to common.Address, vehicleId *big.Int) []byte {
	enc, err := registry.abi.Pack("onTransferVehicleStream", to, vehicleId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackOnTransferVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1882b263.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function onTransferVehicleStream(address to, uint256 vehicleId) returns()
func (registry *Registry) TryPackOnTransferVehicleStream(to common.Address, vehicleId *big.Int) ([]byte, error) {
	return registry.abi.Pack("onTransferVehicleStream", to, vehicleId)
}

// PackPairAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x492ab283.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function pairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (registry *Registry) PackPairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) []byte {
	enc, err := registry.abi.Pack("pairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackPairAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x492ab283.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function pairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (registry *Registry) TryPackPairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) ([]byte, error) {
	return registry.abi.Pack("pairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
}

// PackPairAftermarketDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb50df2f7.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes aftermarketDeviceSig, bytes vehicleOwnerSig) returns()
func (registry *Registry) PackPairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, aftermarketDeviceSig []byte, vehicleOwnerSig []byte) []byte {
	enc, err := registry.abi.Pack("pairAftermarketDeviceSign", aftermarketDeviceNode, vehicleNode, aftermarketDeviceSig, vehicleOwnerSig)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackPairAftermarketDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb50df2f7.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes aftermarketDeviceSig, bytes vehicleOwnerSig) returns()
func (registry *Registry) TryPackPairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, aftermarketDeviceSig []byte, vehicleOwnerSig []byte) ([]byte, error) {
	return registry.abi.Pack("pairAftermarketDeviceSign", aftermarketDeviceNode, vehicleNode, aftermarketDeviceSig, vehicleOwnerSig)
}

// PackPairAftermarketDeviceSign0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xcfe642dd.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (registry *Registry) PackPairAftermarketDeviceSign0(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) []byte {
	enc, err := registry.abi.Pack("pairAftermarketDeviceSign0", aftermarketDeviceNode, vehicleNode, signature)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackPairAftermarketDeviceSign0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xcfe642dd.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (registry *Registry) TryPackPairAftermarketDeviceSign0(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) ([]byte, error) {
	return registry.abi.Pack("pairAftermarketDeviceSign0", aftermarketDeviceNode, vehicleNode, signature)
}

// PackPairAftermarketDeviceWithAdSig is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7ca22c7b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function pairAftermarketDeviceWithAdSig(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes aftermarketDeviceSig) returns()
func (registry *Registry) PackPairAftermarketDeviceWithAdSig(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, aftermarketDeviceSig []byte) []byte {
	enc, err := registry.abi.Pack("pairAftermarketDeviceWithAdSig", aftermarketDeviceNode, vehicleNode, aftermarketDeviceSig)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackPairAftermarketDeviceWithAdSig is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7ca22c7b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function pairAftermarketDeviceWithAdSig(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes aftermarketDeviceSig) returns()
func (registry *Registry) TryPackPairAftermarketDeviceWithAdSig(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, aftermarketDeviceSig []byte) ([]byte, error) {
	return registry.abi.Pack("pairAftermarketDeviceWithAdSig", aftermarketDeviceNode, vehicleNode, aftermarketDeviceSig)
}

// PackRemoveModule is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9748a762.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function removeModule(address implementation, bytes4[] selectors) returns()
func (registry *Registry) PackRemoveModule(implementation common.Address, selectors [][4]byte) []byte {
	enc, err := registry.abi.Pack("removeModule", implementation, selectors)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackRemoveModule is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9748a762.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function removeModule(address implementation, bytes4[] selectors) returns()
func (registry *Registry) TryPackRemoveModule(implementation common.Address, selectors [][4]byte) ([]byte, error) {
	return registry.abi.Pack("removeModule", implementation, selectors)
}

// PackRenameManufacturers is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf73a8f04.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function renameManufacturers((uint256,string)[] idManufacturerNames) returns()
func (registry *Registry) PackRenameManufacturers(idManufacturerNames []DevAdminIdManufacturerName) []byte {
	enc, err := registry.abi.Pack("renameManufacturers", idManufacturerNames)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackRenameManufacturers is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf73a8f04.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function renameManufacturers((uint256,string)[] idManufacturerNames) returns()
func (registry *Registry) TryPackRenameManufacturers(idManufacturerNames []DevAdminIdManufacturerName) ([]byte, error) {
	return registry.abi.Pack("renameManufacturers", idManufacturerNames)
}

// PackRenounceRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8bb9c5bf.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (registry *Registry) PackRenounceRole(role [32]byte) []byte {
	enc, err := registry.abi.Pack("renounceRole", role)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackRenounceRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8bb9c5bf.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (registry *Registry) TryPackRenounceRole(role [32]byte) ([]byte, error) {
	return registry.abi.Pack("renounceRole", role)
}

// PackReprovisionAftermarketDeviceByManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9b3abd48.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function reprovisionAftermarketDeviceByManufacturerBatch(uint256[] aftermarketDeviceNodeList) returns()
func (registry *Registry) PackReprovisionAftermarketDeviceByManufacturerBatch(aftermarketDeviceNodeList []*big.Int) []byte {
	enc, err := registry.abi.Pack("reprovisionAftermarketDeviceByManufacturerBatch", aftermarketDeviceNodeList)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackReprovisionAftermarketDeviceByManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9b3abd48.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function reprovisionAftermarketDeviceByManufacturerBatch(uint256[] aftermarketDeviceNodeList) returns()
func (registry *Registry) TryPackReprovisionAftermarketDeviceByManufacturerBatch(aftermarketDeviceNodeList []*big.Int) ([]byte, error) {
	return registry.abi.Pack("reprovisionAftermarketDeviceByManufacturerBatch", aftermarketDeviceNodeList)
}

// PackResetAftermarketDeviceAddressByManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9d0b139b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function resetAftermarketDeviceAddressByManufacturerBatch((uint256,address)[] adIdAddrs) returns()
func (registry *Registry) PackResetAftermarketDeviceAddressByManufacturerBatch(adIdAddrs []AftermarketDeviceIdAddressPair) []byte {
	enc, err := registry.abi.Pack("resetAftermarketDeviceAddressByManufacturerBatch", adIdAddrs)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackResetAftermarketDeviceAddressByManufacturerBatch is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9d0b139b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function resetAftermarketDeviceAddressByManufacturerBatch((uint256,address)[] adIdAddrs) returns()
func (registry *Registry) TryPackResetAftermarketDeviceAddressByManufacturerBatch(adIdAddrs []AftermarketDeviceIdAddressPair) ([]byte, error) {
	return registry.abi.Pack("resetAftermarketDeviceAddressByManufacturerBatch", adIdAddrs)
}

// PackResetAftermarketDeviceForClaiming is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4c92773c.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function resetAftermarketDeviceForClaiming(address from, uint256 aftermarketDeviceNode) returns(address)
func (registry *Registry) PackResetAftermarketDeviceForClaiming(from common.Address, aftermarketDeviceNode *big.Int) []byte {
	enc, err := registry.abi.Pack("resetAftermarketDeviceForClaiming", from, aftermarketDeviceNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackResetAftermarketDeviceForClaiming is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4c92773c.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function resetAftermarketDeviceForClaiming(address from, uint256 aftermarketDeviceNode) returns(address)
func (registry *Registry) TryPackResetAftermarketDeviceForClaiming(from common.Address, aftermarketDeviceNode *big.Int) ([]byte, error) {
	return registry.abi.Pack("resetAftermarketDeviceForClaiming", from, aftermarketDeviceNode)
}

// UnpackResetAftermarketDeviceForClaiming is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x4c92773c.
//
// Solidity: function resetAftermarketDeviceForClaiming(address from, uint256 aftermarketDeviceNode) returns(address)
func (registry *Registry) UnpackResetAftermarketDeviceForClaiming(data []byte) (common.Address, error) {
	out, err := registry.abi.Unpack("resetAftermarketDeviceForClaiming", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackRevokeRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd547741f.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (registry *Registry) PackRevokeRole(role [32]byte, account common.Address) []byte {
	enc, err := registry.abi.Pack("revokeRole", role, account)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackRevokeRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd547741f.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (registry *Registry) TryPackRevokeRole(role [32]byte, account common.Address) ([]byte, error) {
	return registry.abi.Pack("revokeRole", role, account)
}

// PackSetAftermarketDeviceBeneficiary is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xbebc0bfc.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setAftermarketDeviceBeneficiary(uint256 nodeId, address beneficiary) returns()
func (registry *Registry) PackSetAftermarketDeviceBeneficiary(nodeId *big.Int, beneficiary common.Address) []byte {
	enc, err := registry.abi.Pack("setAftermarketDeviceBeneficiary", nodeId, beneficiary)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetAftermarketDeviceBeneficiary is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xbebc0bfc.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setAftermarketDeviceBeneficiary(uint256 nodeId, address beneficiary) returns()
func (registry *Registry) TryPackSetAftermarketDeviceBeneficiary(nodeId *big.Int, beneficiary common.Address) ([]byte, error) {
	return registry.abi.Pack("setAftermarketDeviceBeneficiary", nodeId, beneficiary)
}

// PackSetAftermarketDeviceIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4d49d82a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setAftermarketDeviceIdProxyAddress(address addr) returns()
func (registry *Registry) PackSetAftermarketDeviceIdProxyAddress(addr common.Address) []byte {
	enc, err := registry.abi.Pack("setAftermarketDeviceIdProxyAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetAftermarketDeviceIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4d49d82a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setAftermarketDeviceIdProxyAddress(address addr) returns()
func (registry *Registry) TryPackSetAftermarketDeviceIdProxyAddress(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("setAftermarketDeviceIdProxyAddress", addr)
}

// PackSetAftermarketDeviceInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4d13b709.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setAftermarketDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (registry *Registry) PackSetAftermarketDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) []byte {
	enc, err := registry.abi.Pack("setAftermarketDeviceInfo", tokenId, attrInfo)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetAftermarketDeviceInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4d13b709.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setAftermarketDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (registry *Registry) TryPackSetAftermarketDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) ([]byte, error) {
	return registry.abi.Pack("setAftermarketDeviceInfo", tokenId, attrInfo)
}

// PackSetConnectionsManager is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x2fee22f4.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setConnectionsManager(address connectionsManager) returns()
func (registry *Registry) PackSetConnectionsManager(connectionsManager common.Address) []byte {
	enc, err := registry.abi.Pack("setConnectionsManager", connectionsManager)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetConnectionsManager is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x2fee22f4.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setConnectionsManager(address connectionsManager) returns()
func (registry *Registry) TryPackSetConnectionsManager(connectionsManager common.Address) ([]byte, error) {
	return registry.abi.Pack("setConnectionsManager", connectionsManager)
}

// PackSetController is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x92eefe9b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setController(address _controller) returns()
func (registry *Registry) PackSetController(controller common.Address) []byte {
	enc, err := registry.abi.Pack("setController", controller)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetController is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x92eefe9b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setController(address _controller) returns()
func (registry *Registry) TryPackSetController(controller common.Address) ([]byte, error) {
	return registry.abi.Pack("setController", controller)
}

// PackSetDcxOperationCost is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa2fe8c85.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDcxOperationCost(bytes32 operation, uint256 cost) returns()
func (registry *Registry) PackSetDcxOperationCost(operation [32]byte, cost *big.Int) []byte {
	enc, err := registry.abi.Pack("setDcxOperationCost", operation, cost)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDcxOperationCost is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa2fe8c85.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDcxOperationCost(bytes32 operation, uint256 cost) returns()
func (registry *Registry) TryPackSetDcxOperationCost(operation [32]byte, cost *big.Int) ([]byte, error) {
	return registry.abi.Pack("setDcxOperationCost", operation, cost)
}

// PackSetDefaultStorageNodeId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x856f3849.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDefaultStorageNodeId(uint256 storageNodeId) returns()
func (registry *Registry) PackSetDefaultStorageNodeId(storageNodeId *big.Int) []byte {
	enc, err := registry.abi.Pack("setDefaultStorageNodeId", storageNodeId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDefaultStorageNodeId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x856f3849.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDefaultStorageNodeId(uint256 storageNodeId) returns()
func (registry *Registry) TryPackSetDefaultStorageNodeId(storageNodeId *big.Int) ([]byte, error) {
	return registry.abi.Pack("setDefaultStorageNodeId", storageNodeId)
}

// PackSetDeviceDefinitionTable is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x088fafdb.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDeviceDefinitionTable(uint256 manufacturerId, uint256 tableId) returns()
func (registry *Registry) PackSetDeviceDefinitionTable(manufacturerId *big.Int, tableId *big.Int) []byte {
	enc, err := registry.abi.Pack("setDeviceDefinitionTable", manufacturerId, tableId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDeviceDefinitionTable is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x088fafdb.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDeviceDefinitionTable(uint256 manufacturerId, uint256 tableId) returns()
func (registry *Registry) TryPackSetDeviceDefinitionTable(manufacturerId *big.Int, tableId *big.Int) ([]byte, error) {
	return registry.abi.Pack("setDeviceDefinitionTable", manufacturerId, tableId)
}

// PackSetDimoBaseStreamId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9e594424.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDimoBaseStreamId(string dimoStreamrEns) returns()
func (registry *Registry) PackSetDimoBaseStreamId(dimoStreamrEns string) []byte {
	enc, err := registry.abi.Pack("setDimoBaseStreamId", dimoStreamrEns)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDimoBaseStreamId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9e594424.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDimoBaseStreamId(string dimoStreamrEns) returns()
func (registry *Registry) TryPackSetDimoBaseStreamId(dimoStreamrEns string) ([]byte, error) {
	return registry.abi.Pack("setDimoBaseStreamId", dimoStreamrEns)
}

// PackSetDimoCredit is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4fa9ff16.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDimoCredit(address dimoCredit) returns()
func (registry *Registry) PackSetDimoCredit(dimoCredit common.Address) []byte {
	enc, err := registry.abi.Pack("setDimoCredit", dimoCredit)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDimoCredit is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4fa9ff16.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDimoCredit(address dimoCredit) returns()
func (registry *Registry) TryPackSetDimoCredit(dimoCredit common.Address) ([]byte, error) {
	return registry.abi.Pack("setDimoCredit", dimoCredit)
}

// PackSetDimoStreamrNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5f450e29.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDimoStreamrNode(address dimoStreamrNode) returns()
func (registry *Registry) PackSetDimoStreamrNode(dimoStreamrNode common.Address) []byte {
	enc, err := registry.abi.Pack("setDimoStreamrNode", dimoStreamrNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDimoStreamrNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5f450e29.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDimoStreamrNode(address dimoStreamrNode) returns()
func (registry *Registry) TryPackSetDimoStreamrNode(dimoStreamrNode common.Address) ([]byte, error) {
	return registry.abi.Pack("setDimoStreamrNode", dimoStreamrNode)
}

// PackSetDimoToken is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5b6c1979.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDimoToken(address dimoToken) returns()
func (registry *Registry) PackSetDimoToken(dimoToken common.Address) []byte {
	enc, err := registry.abi.Pack("setDimoToken", dimoToken)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDimoToken is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5b6c1979.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDimoToken(address dimoToken) returns()
func (registry *Registry) TryPackSetDimoToken(dimoToken common.Address) ([]byte, error) {
	return registry.abi.Pack("setDimoToken", dimoToken)
}

// PackSetFoundation is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xdb3543f5.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setFoundation(address foundation) returns()
func (registry *Registry) PackSetFoundation(foundation common.Address) []byte {
	enc, err := registry.abi.Pack("setFoundation", foundation)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetFoundation is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xdb3543f5.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setFoundation(address foundation) returns()
func (registry *Registry) TryPackSetFoundation(foundation common.Address) ([]byte, error) {
	return registry.abi.Pack("setFoundation", foundation)
}

// PackSetManufacturerIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd159f49a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setManufacturerIdProxyAddress(address addr) returns()
func (registry *Registry) PackSetManufacturerIdProxyAddress(addr common.Address) []byte {
	enc, err := registry.abi.Pack("setManufacturerIdProxyAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetManufacturerIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd159f49a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setManufacturerIdProxyAddress(address addr) returns()
func (registry *Registry) TryPackSetManufacturerIdProxyAddress(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("setManufacturerIdProxyAddress", addr)
}

// PackSetManufacturerInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x63545ffa.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setManufacturerInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (registry *Registry) PackSetManufacturerInfo(tokenId *big.Int, attrInfoList []AttributeInfoPair) []byte {
	enc, err := registry.abi.Pack("setManufacturerInfo", tokenId, attrInfoList)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetManufacturerInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x63545ffa.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setManufacturerInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (registry *Registry) TryPackSetManufacturerInfo(tokenId *big.Int, attrInfoList []AttributeInfoPair) ([]byte, error) {
	return registry.abi.Pack("setManufacturerInfo", tokenId, attrInfoList)
}

// PackSetManufacturerLicense is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xea9ae2f5.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setManufacturerLicense(address manufacturerLicense) returns()
func (registry *Registry) PackSetManufacturerLicense(manufacturerLicense common.Address) []byte {
	enc, err := registry.abi.Pack("setManufacturerLicense", manufacturerLicense)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetManufacturerLicense is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xea9ae2f5.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setManufacturerLicense(address manufacturerLicense) returns()
func (registry *Registry) TryPackSetManufacturerLicense(manufacturerLicense common.Address) ([]byte, error) {
	return registry.abi.Pack("setManufacturerLicense", manufacturerLicense)
}

// PackSetSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc63f7dd2.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setSacd(address sacd) returns()
func (registry *Registry) PackSetSacd(sacd common.Address) []byte {
	enc, err := registry.abi.Pack("setSacd", sacd)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc63f7dd2.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setSacd(address sacd) returns()
func (registry *Registry) TryPackSetSacd(sacd common.Address) ([]byte, error) {
	return registry.abi.Pack("setSacd", sacd)
}

// PackSetStorageNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6ee4a611.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setStorageNode(address storageNode) returns()
func (registry *Registry) PackSetStorageNode(storageNode common.Address) []byte {
	enc, err := registry.abi.Pack("setStorageNode", storageNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetStorageNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6ee4a611.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setStorageNode(address storageNode) returns()
func (registry *Registry) TryPackSetStorageNode(storageNode common.Address) ([]byte, error) {
	return registry.abi.Pack("setStorageNode", storageNode)
}

// PackSetStorageNodeIdForVehicle is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xae3ed8dd.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setStorageNodeIdForVehicle(uint256 vehicleId, uint256 storageNodeId) returns()
func (registry *Registry) PackSetStorageNodeIdForVehicle(vehicleId *big.Int, storageNodeId *big.Int) []byte {
	enc, err := registry.abi.Pack("setStorageNodeIdForVehicle", vehicleId, storageNodeId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetStorageNodeIdForVehicle is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xae3ed8dd.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setStorageNodeIdForVehicle(uint256 vehicleId, uint256 storageNodeId) returns()
func (registry *Registry) TryPackSetStorageNodeIdForVehicle(vehicleId *big.Int, storageNodeId *big.Int) ([]byte, error) {
	return registry.abi.Pack("setStorageNodeIdForVehicle", vehicleId, storageNodeId)
}

// PackSetStreamRegistry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0c3cac3b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setStreamRegistry(address streamRegistry) returns()
func (registry *Registry) PackSetStreamRegistry(streamRegistry common.Address) []byte {
	enc, err := registry.abi.Pack("setStreamRegistry", streamRegistry)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetStreamRegistry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0c3cac3b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setStreamRegistry(address streamRegistry) returns()
func (registry *Registry) TryPackSetStreamRegistry(streamRegistry common.Address) ([]byte, error) {
	return registry.abi.Pack("setStreamRegistry", streamRegistry)
}

// PackSetSubscriptionToVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xbb44bb75.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setSubscriptionToVehicleStream(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (registry *Registry) PackSetSubscriptionToVehicleStream(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) []byte {
	enc, err := registry.abi.Pack("setSubscriptionToVehicleStream", vehicleId, subscriber, expirationTime)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetSubscriptionToVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xbb44bb75.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setSubscriptionToVehicleStream(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (registry *Registry) TryPackSetSubscriptionToVehicleStream(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) ([]byte, error) {
	return registry.abi.Pack("setSubscriptionToVehicleStream", vehicleId, subscriber, expirationTime)
}

// PackSetSyntheticDeviceIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xecf452d7.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setSyntheticDeviceIdProxyAddress(address addr) returns()
func (registry *Registry) PackSetSyntheticDeviceIdProxyAddress(addr common.Address) []byte {
	enc, err := registry.abi.Pack("setSyntheticDeviceIdProxyAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetSyntheticDeviceIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xecf452d7.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setSyntheticDeviceIdProxyAddress(address addr) returns()
func (registry *Registry) TryPackSetSyntheticDeviceIdProxyAddress(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("setSyntheticDeviceIdProxyAddress", addr)
}

// PackSetSyntheticDeviceInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x80430e0d.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setSyntheticDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (registry *Registry) PackSetSyntheticDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) []byte {
	enc, err := registry.abi.Pack("setSyntheticDeviceInfo", tokenId, attrInfo)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetSyntheticDeviceInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x80430e0d.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setSyntheticDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (registry *Registry) TryPackSetSyntheticDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) ([]byte, error) {
	return registry.abi.Pack("setSyntheticDeviceInfo", tokenId, attrInfo)
}

// PackSetVehicleIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9bfae6da.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setVehicleIdProxyAddress(address addr) returns()
func (registry *Registry) PackSetVehicleIdProxyAddress(addr common.Address) []byte {
	enc, err := registry.abi.Pack("setVehicleIdProxyAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetVehicleIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9bfae6da.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setVehicleIdProxyAddress(address addr) returns()
func (registry *Registry) TryPackSetVehicleIdProxyAddress(addr common.Address) ([]byte, error) {
	return registry.abi.Pack("setVehicleIdProxyAddress", addr)
}

// PackSetVehicleInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd9c3ae61.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setVehicleInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (registry *Registry) PackSetVehicleInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) []byte {
	enc, err := registry.abi.Pack("setVehicleInfo", tokenId, attrInfo)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetVehicleInfo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd9c3ae61.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setVehicleInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (registry *Registry) TryPackSetVehicleInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) ([]byte, error) {
	return registry.abi.Pack("setVehicleInfo", tokenId, attrInfo)
}

// PackSetVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6f58f093.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setVehicleStream(uint256 vehicleId, string streamId) returns()
func (registry *Registry) PackSetVehicleStream(vehicleId *big.Int, streamId string) []byte {
	enc, err := registry.abi.Pack("setVehicleStream", vehicleId, streamId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6f58f093.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setVehicleStream(uint256 vehicleId, string streamId) returns()
func (registry *Registry) TryPackSetVehicleStream(vehicleId *big.Int, streamId string) ([]byte, error) {
	return registry.abi.Pack("setVehicleStream", vehicleId, streamId)
}

// PackSubscribeToVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x37479f7e.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function subscribeToVehicleStream(uint256 vehicleId, uint256 expirationTime) returns()
func (registry *Registry) PackSubscribeToVehicleStream(vehicleId *big.Int, expirationTime *big.Int) []byte {
	enc, err := registry.abi.Pack("subscribeToVehicleStream", vehicleId, expirationTime)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSubscribeToVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x37479f7e.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function subscribeToVehicleStream(uint256 vehicleId, uint256 expirationTime) returns()
func (registry *Registry) TryPackSubscribeToVehicleStream(vehicleId *big.Int, expirationTime *big.Int) ([]byte, error) {
	return registry.abi.Pack("subscribeToVehicleStream", vehicleId, expirationTime)
}

// PackTransferAftermarketDeviceOwnership is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xff96b761.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function transferAftermarketDeviceOwnership(uint256 aftermarketDeviceNode, address newOwner) returns()
func (registry *Registry) PackTransferAftermarketDeviceOwnership(aftermarketDeviceNode *big.Int, newOwner common.Address) []byte {
	enc, err := registry.abi.Pack("transferAftermarketDeviceOwnership", aftermarketDeviceNode, newOwner)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTransferAftermarketDeviceOwnership is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xff96b761.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function transferAftermarketDeviceOwnership(uint256 aftermarketDeviceNode, address newOwner) returns()
func (registry *Registry) TryPackTransferAftermarketDeviceOwnership(aftermarketDeviceNode *big.Int, newOwner common.Address) ([]byte, error) {
	return registry.abi.Pack("transferAftermarketDeviceOwnership", aftermarketDeviceNode, newOwner)
}

// PackUnclaimAftermarketDeviceNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5c129493.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function unclaimAftermarketDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (registry *Registry) PackUnclaimAftermarketDeviceNode(aftermarketDeviceNodes []*big.Int) []byte {
	enc, err := registry.abi.Pack("unclaimAftermarketDeviceNode", aftermarketDeviceNodes)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUnclaimAftermarketDeviceNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5c129493.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function unclaimAftermarketDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (registry *Registry) TryPackUnclaimAftermarketDeviceNode(aftermarketDeviceNodes []*big.Int) ([]byte, error) {
	return registry.abi.Pack("unclaimAftermarketDeviceNode", aftermarketDeviceNodes)
}

// PackUnpairAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xee4d9596.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function unpairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (registry *Registry) PackUnpairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) []byte {
	enc, err := registry.abi.Pack("unpairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUnpairAftermarketDevice is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xee4d9596.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function unpairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (registry *Registry) TryPackUnpairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) ([]byte, error) {
	return registry.abi.Pack("unpairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
}

// PackUnpairAftermarketDeviceByDeviceNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x71193956.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function unpairAftermarketDeviceByDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (registry *Registry) PackUnpairAftermarketDeviceByDeviceNode(aftermarketDeviceNodes []*big.Int) []byte {
	enc, err := registry.abi.Pack("unpairAftermarketDeviceByDeviceNode", aftermarketDeviceNodes)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUnpairAftermarketDeviceByDeviceNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x71193956.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function unpairAftermarketDeviceByDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (registry *Registry) TryPackUnpairAftermarketDeviceByDeviceNode(aftermarketDeviceNodes []*big.Int) ([]byte, error) {
	return registry.abi.Pack("unpairAftermarketDeviceByDeviceNode", aftermarketDeviceNodes)
}

// PackUnpairAftermarketDeviceByVehicleNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8c2ee9bb.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function unpairAftermarketDeviceByVehicleNode(uint256[] vehicleNodes) returns()
func (registry *Registry) PackUnpairAftermarketDeviceByVehicleNode(vehicleNodes []*big.Int) []byte {
	enc, err := registry.abi.Pack("unpairAftermarketDeviceByVehicleNode", vehicleNodes)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUnpairAftermarketDeviceByVehicleNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8c2ee9bb.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function unpairAftermarketDeviceByVehicleNode(uint256[] vehicleNodes) returns()
func (registry *Registry) TryPackUnpairAftermarketDeviceByVehicleNode(vehicleNodes []*big.Int) ([]byte, error) {
	return registry.abi.Pack("unpairAftermarketDeviceByVehicleNode", vehicleNodes)
}

// PackUnpairAftermarketDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3f65997a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function unpairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (registry *Registry) PackUnpairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) []byte {
	enc, err := registry.abi.Pack("unpairAftermarketDeviceSign", aftermarketDeviceNode, vehicleNode, signature)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUnpairAftermarketDeviceSign is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3f65997a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function unpairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (registry *Registry) TryPackUnpairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) ([]byte, error) {
	return registry.abi.Pack("unpairAftermarketDeviceSign", aftermarketDeviceNode, vehicleNode, signature)
}

// PackUnsetVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xcd90df7e.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function unsetVehicleStream(uint256 vehicleId) returns()
func (registry *Registry) PackUnsetVehicleStream(vehicleId *big.Int) []byte {
	enc, err := registry.abi.Pack("unsetVehicleStream", vehicleId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUnsetVehicleStream is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xcd90df7e.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function unsetVehicleStream(uint256 vehicleId) returns()
func (registry *Registry) TryPackUnsetVehicleStream(vehicleId *big.Int) ([]byte, error) {
	return registry.abi.Pack("unsetVehicleStream", vehicleId)
}

// PackUpdateDeviceDefinition is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x182fef60.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function updateDeviceDefinition(uint256 manufacturerId, (string,string,string,string,string) data) returns()
func (registry *Registry) PackUpdateDeviceDefinition(manufacturerId *big.Int, data DeviceDefinitionUpdateInput) []byte {
	enc, err := registry.abi.Pack("updateDeviceDefinition", manufacturerId, data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUpdateDeviceDefinition is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x182fef60.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function updateDeviceDefinition(uint256 manufacturerId, (string,string,string,string,string) data) returns()
func (registry *Registry) TryPackUpdateDeviceDefinition(manufacturerId *big.Int, data DeviceDefinitionUpdateInput) ([]byte, error) {
	return registry.abi.Pack("updateDeviceDefinition", manufacturerId, data)
}

// PackUpdateManufacturerMinted is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x20d60248.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function updateManufacturerMinted(address from, address to) returns()
func (registry *Registry) PackUpdateManufacturerMinted(from common.Address, to common.Address) []byte {
	enc, err := registry.abi.Pack("updateManufacturerMinted", from, to)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUpdateManufacturerMinted is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x20d60248.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function updateManufacturerMinted(address from, address to) returns()
func (registry *Registry) TryPackUpdateManufacturerMinted(from common.Address, to common.Address) ([]byte, error) {
	return registry.abi.Pack("updateManufacturerMinted", from, to)
}

// PackUpdateModule is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x06d1d2a1.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function updateModule(address oldImplementation, address newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors) returns()
func (registry *Registry) PackUpdateModule(oldImplementation common.Address, newImplementation common.Address, oldSelectors [][4]byte, newSelectors [][4]byte) []byte {
	enc, err := registry.abi.Pack("updateModule", oldImplementation, newImplementation, oldSelectors, newSelectors)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUpdateModule is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x06d1d2a1.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function updateModule(address oldImplementation, address newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors) returns()
func (registry *Registry) TryPackUpdateModule(oldImplementation common.Address, newImplementation common.Address, oldSelectors [][4]byte, newSelectors [][4]byte) ([]byte, error) {
	return registry.abi.Pack("updateModule", oldImplementation, newImplementation, oldSelectors, newSelectors)
}

// PackValidateBurnAndResetNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xea0e7d3a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function validateBurnAndResetNode(uint256 tokenId) returns()
func (registry *Registry) PackValidateBurnAndResetNode(tokenId *big.Int) []byte {
	enc, err := registry.abi.Pack("validateBurnAndResetNode", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackValidateBurnAndResetNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xea0e7d3a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function validateBurnAndResetNode(uint256 tokenId) returns()
func (registry *Registry) TryPackValidateBurnAndResetNode(tokenId *big.Int) ([]byte, error) {
	return registry.abi.Pack("validateBurnAndResetNode", tokenId)
}

// PackValidateSdBurnAndResetNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x53c2aa33.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function validateSdBurnAndResetNode(uint256 tokenId) returns()
func (registry *Registry) PackValidateSdBurnAndResetNode(tokenId *big.Int) []byte {
	enc, err := registry.abi.Pack("validateSdBurnAndResetNode", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackValidateSdBurnAndResetNode is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x53c2aa33.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function validateSdBurnAndResetNode(uint256 tokenId) returns()
func (registry *Registry) TryPackValidateSdBurnAndResetNode(tokenId *big.Int) ([]byte, error) {
	return registry.abi.Pack("validateSdBurnAndResetNode", tokenId)
}

// PackVehicleIdToStorageNodeId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7a26a1ed.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function vehicleIdToStorageNodeId(uint256 vehicleId) view returns(uint256)
func (registry *Registry) PackVehicleIdToStorageNodeId(vehicleId *big.Int) []byte {
	enc, err := registry.abi.Pack("vehicleIdToStorageNodeId", vehicleId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackVehicleIdToStorageNodeId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7a26a1ed.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function vehicleIdToStorageNodeId(uint256 vehicleId) view returns(uint256)
func (registry *Registry) TryPackVehicleIdToStorageNodeId(vehicleId *big.Int) ([]byte, error) {
	return registry.abi.Pack("vehicleIdToStorageNodeId", vehicleId)
}

// UnpackVehicleIdToStorageNodeId is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x7a26a1ed.
//
// Solidity: function vehicleIdToStorageNodeId(uint256 vehicleId) view returns(uint256)
func (registry *Registry) UnpackVehicleIdToStorageNodeId(data []byte) (*big.Int, error) {
	out, err := registry.abi.Unpack("vehicleIdToStorageNodeId", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// RegistryAftermarketDeviceAddressReset represents a AftermarketDeviceAddressReset event raised by the Registry contract.
type RegistryAftermarketDeviceAddressReset struct {
	ManufacturerId           *big.Int
	TokenId                  *big.Int
	AftermarketDeviceAddress common.Address
	Raw                      *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceAddressResetEventName = "AftermarketDeviceAddressReset"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceAddressReset) ContractEventName() string {
	return RegistryAftermarketDeviceAddressResetEventName
}

// UnpackAftermarketDeviceAddressResetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceAddressReset(uint256 indexed manufacturerId, uint256 indexed tokenId, address indexed aftermarketDeviceAddress)
func (registry *Registry) UnpackAftermarketDeviceAddressResetEvent(log *types.Log) (*RegistryAftermarketDeviceAddressReset, error) {
	event := "AftermarketDeviceAddressReset"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceAddressReset)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceAttributeAdded represents a AftermarketDeviceAttributeAdded event raised by the Registry contract.
type RegistryAftermarketDeviceAttributeAdded struct {
	Attribute string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceAttributeAddedEventName = "AftermarketDeviceAttributeAdded"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceAttributeAdded) ContractEventName() string {
	return RegistryAftermarketDeviceAttributeAddedEventName
}

// UnpackAftermarketDeviceAttributeAddedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceAttributeAdded(string attribute)
func (registry *Registry) UnpackAftermarketDeviceAttributeAddedEvent(log *types.Log) (*RegistryAftermarketDeviceAttributeAdded, error) {
	event := "AftermarketDeviceAttributeAdded"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceAttributeAdded)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceAttributeSet represents a AftermarketDeviceAttributeSet event raised by the Registry contract.
type RegistryAftermarketDeviceAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceAttributeSetEventName = "AftermarketDeviceAttributeSet"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceAttributeSet) ContractEventName() string {
	return RegistryAftermarketDeviceAttributeSetEventName
}

// UnpackAftermarketDeviceAttributeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceAttributeSet(uint256 tokenId, string attribute, string info)
func (registry *Registry) UnpackAftermarketDeviceAttributeSetEvent(log *types.Log) (*RegistryAftermarketDeviceAttributeSet, error) {
	event := "AftermarketDeviceAttributeSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceAttributeSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceClaimed represents a AftermarketDeviceClaimed event raised by the Registry contract.
type RegistryAftermarketDeviceClaimed struct {
	AftermarketDeviceNode *big.Int
	Owner                 common.Address
	Raw                   *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceClaimedEventName = "AftermarketDeviceClaimed"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceClaimed) ContractEventName() string {
	return RegistryAftermarketDeviceClaimedEventName
}

// UnpackAftermarketDeviceClaimedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceClaimed(uint256 aftermarketDeviceNode, address indexed owner)
func (registry *Registry) UnpackAftermarketDeviceClaimedEvent(log *types.Log) (*RegistryAftermarketDeviceClaimed, error) {
	event := "AftermarketDeviceClaimed"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceClaimed)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceIdProxySet represents a AftermarketDeviceIdProxySet event raised by the Registry contract.
type RegistryAftermarketDeviceIdProxySet struct {
	Proxy common.Address
	Raw   *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceIdProxySetEventName = "AftermarketDeviceIdProxySet"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceIdProxySet) ContractEventName() string {
	return RegistryAftermarketDeviceIdProxySetEventName
}

// UnpackAftermarketDeviceIdProxySetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceIdProxySet(address indexed proxy)
func (registry *Registry) UnpackAftermarketDeviceIdProxySetEvent(log *types.Log) (*RegistryAftermarketDeviceIdProxySet, error) {
	event := "AftermarketDeviceIdProxySet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceIdProxySet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceNodeBurned represents a AftermarketDeviceNodeBurned event raised by the Registry contract.
type RegistryAftermarketDeviceNodeBurned struct {
	TokenId *big.Int
	Owner   common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceNodeBurnedEventName = "AftermarketDeviceNodeBurned"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceNodeBurned) ContractEventName() string {
	return RegistryAftermarketDeviceNodeBurnedEventName
}

// UnpackAftermarketDeviceNodeBurnedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceNodeBurned(uint256 indexed tokenId, address indexed owner)
func (registry *Registry) UnpackAftermarketDeviceNodeBurnedEvent(log *types.Log) (*RegistryAftermarketDeviceNodeBurned, error) {
	event := "AftermarketDeviceNodeBurned"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceNodeBurned)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceNodeMinted represents a AftermarketDeviceNodeMinted event raised by the Registry contract.
type RegistryAftermarketDeviceNodeMinted struct {
	ManufacturerId           *big.Int
	TokenId                  *big.Int
	AftermarketDeviceAddress common.Address
	Owner                    common.Address
	Raw                      *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceNodeMintedEventName = "AftermarketDeviceNodeMinted"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceNodeMinted) ContractEventName() string {
	return RegistryAftermarketDeviceNodeMintedEventName
}

// UnpackAftermarketDeviceNodeMintedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceNodeMinted(uint256 indexed manufacturerId, uint256 tokenId, address indexed aftermarketDeviceAddress, address indexed owner)
func (registry *Registry) UnpackAftermarketDeviceNodeMintedEvent(log *types.Log) (*RegistryAftermarketDeviceNodeMinted, error) {
	event := "AftermarketDeviceNodeMinted"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceNodeMinted)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDevicePaired represents a AftermarketDevicePaired event raised by the Registry contract.
type RegistryAftermarketDevicePaired struct {
	AftermarketDeviceNode *big.Int
	VehicleNode           *big.Int
	Owner                 common.Address
	Raw                   *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDevicePairedEventName = "AftermarketDevicePaired"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDevicePaired) ContractEventName() string {
	return RegistryAftermarketDevicePairedEventName
}

// UnpackAftermarketDevicePairedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDevicePaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (registry *Registry) UnpackAftermarketDevicePairedEvent(log *types.Log) (*RegistryAftermarketDevicePaired, error) {
	event := "AftermarketDevicePaired"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDevicePaired)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceTransferred represents a AftermarketDeviceTransferred event raised by the Registry contract.
type RegistryAftermarketDeviceTransferred struct {
	AftermarketDeviceNode *big.Int
	OldOwner              common.Address
	NewOwner              common.Address
	Raw                   *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceTransferredEventName = "AftermarketDeviceTransferred"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceTransferred) ContractEventName() string {
	return RegistryAftermarketDeviceTransferredEventName
}

// UnpackAftermarketDeviceTransferredEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceTransferred(uint256 indexed aftermarketDeviceNode, address indexed oldOwner, address indexed newOwner)
func (registry *Registry) UnpackAftermarketDeviceTransferredEvent(log *types.Log) (*RegistryAftermarketDeviceTransferred, error) {
	event := "AftermarketDeviceTransferred"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceTransferred)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceUnclaimed represents a AftermarketDeviceUnclaimed event raised by the Registry contract.
type RegistryAftermarketDeviceUnclaimed struct {
	AftermarketDeviceNode *big.Int
	Raw                   *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceUnclaimedEventName = "AftermarketDeviceUnclaimed"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceUnclaimed) ContractEventName() string {
	return RegistryAftermarketDeviceUnclaimedEventName
}

// UnpackAftermarketDeviceUnclaimedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceUnclaimed(uint256 indexed aftermarketDeviceNode)
func (registry *Registry) UnpackAftermarketDeviceUnclaimedEvent(log *types.Log) (*RegistryAftermarketDeviceUnclaimed, error) {
	event := "AftermarketDeviceUnclaimed"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceUnclaimed)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceUnclaimed0 represents a AftermarketDeviceUnclaimed0 event raised by the Registry contract.
type RegistryAftermarketDeviceUnclaimed0 struct {
	AftermarketDeviceNode *big.Int
	Owner                 common.Address
	Raw                   *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceUnclaimed0EventName = "AftermarketDeviceUnclaimed0"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceUnclaimed0) ContractEventName() string {
	return RegistryAftermarketDeviceUnclaimed0EventName
}

// UnpackAftermarketDeviceUnclaimed0Event is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceUnclaimed(uint256 indexed aftermarketDeviceNode, address indexed owner)
func (registry *Registry) UnpackAftermarketDeviceUnclaimed0Event(log *types.Log) (*RegistryAftermarketDeviceUnclaimed0, error) {
	event := "AftermarketDeviceUnclaimed0"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceUnclaimed0)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryAftermarketDeviceUnpaired represents a AftermarketDeviceUnpaired event raised by the Registry contract.
type RegistryAftermarketDeviceUnpaired struct {
	AftermarketDeviceNode *big.Int
	VehicleNode           *big.Int
	Owner                 common.Address
	Raw                   *types.Log // Blockchain specific contextual infos
}

const RegistryAftermarketDeviceUnpairedEventName = "AftermarketDeviceUnpaired"

// ContractEventName returns the user-defined event name.
func (RegistryAftermarketDeviceUnpaired) ContractEventName() string {
	return RegistryAftermarketDeviceUnpairedEventName
}

// UnpackAftermarketDeviceUnpairedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AftermarketDeviceUnpaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (registry *Registry) UnpackAftermarketDeviceUnpairedEvent(log *types.Log) (*RegistryAftermarketDeviceUnpaired, error) {
	event := "AftermarketDeviceUnpaired"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryAftermarketDeviceUnpaired)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryBeneficiarySet represents a BeneficiarySet event raised by the Registry contract.
type RegistryBeneficiarySet struct {
	IdProxyAddress common.Address
	NodeId         *big.Int
	Beneficiary    common.Address
	Raw            *types.Log // Blockchain specific contextual infos
}

const RegistryBeneficiarySetEventName = "BeneficiarySet"

// ContractEventName returns the user-defined event name.
func (RegistryBeneficiarySet) ContractEventName() string {
	return RegistryBeneficiarySetEventName
}

// UnpackBeneficiarySetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event BeneficiarySet(address indexed idProxyAddress, uint256 indexed nodeId, address indexed beneficiary)
func (registry *Registry) UnpackBeneficiarySetEvent(log *types.Log) (*RegistryBeneficiarySet, error) {
	event := "BeneficiarySet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryBeneficiarySet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryConnectionsManagerSet represents a ConnectionsManagerSet event raised by the Registry contract.
type RegistryConnectionsManagerSet struct {
	ConnectionsManager common.Address
	Raw                *types.Log // Blockchain specific contextual infos
}

const RegistryConnectionsManagerSetEventName = "ConnectionsManagerSet"

// ContractEventName returns the user-defined event name.
func (RegistryConnectionsManagerSet) ContractEventName() string {
	return RegistryConnectionsManagerSetEventName
}

// UnpackConnectionsManagerSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ConnectionsManagerSet(address indexed connectionsManager)
func (registry *Registry) UnpackConnectionsManagerSetEvent(log *types.Log) (*RegistryConnectionsManagerSet, error) {
	event := "ConnectionsManagerSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryConnectionsManagerSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryControllerSet represents a ControllerSet event raised by the Registry contract.
type RegistryControllerSet struct {
	Controller common.Address
	Raw        *types.Log // Blockchain specific contextual infos
}

const RegistryControllerSetEventName = "ControllerSet"

// ContractEventName returns the user-defined event name.
func (RegistryControllerSet) ContractEventName() string {
	return RegistryControllerSetEventName
}

// UnpackControllerSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ControllerSet(address indexed controller)
func (registry *Registry) UnpackControllerSetEvent(log *types.Log) (*RegistryControllerSet, error) {
	event := "ControllerSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryControllerSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDeviceDefinitionDeleted represents a DeviceDefinitionDeleted event raised by the Registry contract.
type RegistryDeviceDefinitionDeleted struct {
	TableId *big.Int
	Id      string
	Raw     *types.Log // Blockchain specific contextual infos
}

const RegistryDeviceDefinitionDeletedEventName = "DeviceDefinitionDeleted"

// ContractEventName returns the user-defined event name.
func (RegistryDeviceDefinitionDeleted) ContractEventName() string {
	return RegistryDeviceDefinitionDeletedEventName
}

// UnpackDeviceDefinitionDeletedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DeviceDefinitionDeleted(uint256 indexed tableId, string id)
func (registry *Registry) UnpackDeviceDefinitionDeletedEvent(log *types.Log) (*RegistryDeviceDefinitionDeleted, error) {
	event := "DeviceDefinitionDeleted"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDeviceDefinitionDeleted)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDeviceDefinitionIdSet represents a DeviceDefinitionIdSet event raised by the Registry contract.
type RegistryDeviceDefinitionIdSet struct {
	VehicleId *big.Int
	DdId      string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryDeviceDefinitionIdSetEventName = "DeviceDefinitionIdSet"

// ContractEventName returns the user-defined event name.
func (RegistryDeviceDefinitionIdSet) ContractEventName() string {
	return RegistryDeviceDefinitionIdSetEventName
}

// UnpackDeviceDefinitionIdSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DeviceDefinitionIdSet(uint256 indexed vehicleId, string ddId)
func (registry *Registry) UnpackDeviceDefinitionIdSetEvent(log *types.Log) (*RegistryDeviceDefinitionIdSet, error) {
	event := "DeviceDefinitionIdSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDeviceDefinitionIdSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDeviceDefinitionInserted represents a DeviceDefinitionInserted event raised by the Registry contract.
type RegistryDeviceDefinitionInserted struct {
	TableId *big.Int
	Id      string
	Model   string
	Year    *big.Int
	Raw     *types.Log // Blockchain specific contextual infos
}

const RegistryDeviceDefinitionInsertedEventName = "DeviceDefinitionInserted"

// ContractEventName returns the user-defined event name.
func (RegistryDeviceDefinitionInserted) ContractEventName() string {
	return RegistryDeviceDefinitionInsertedEventName
}

// UnpackDeviceDefinitionInsertedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DeviceDefinitionInserted(uint256 indexed tableId, string id, string model, uint256 year)
func (registry *Registry) UnpackDeviceDefinitionInsertedEvent(log *types.Log) (*RegistryDeviceDefinitionInserted, error) {
	event := "DeviceDefinitionInserted"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDeviceDefinitionInserted)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDeviceDefinitionTableCreated represents a DeviceDefinitionTableCreated event raised by the Registry contract.
type RegistryDeviceDefinitionTableCreated struct {
	TableOwner     common.Address
	ManufacturerId *big.Int
	TableId        *big.Int
	Raw            *types.Log // Blockchain specific contextual infos
}

const RegistryDeviceDefinitionTableCreatedEventName = "DeviceDefinitionTableCreated"

// ContractEventName returns the user-defined event name.
func (RegistryDeviceDefinitionTableCreated) ContractEventName() string {
	return RegistryDeviceDefinitionTableCreatedEventName
}

// UnpackDeviceDefinitionTableCreatedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DeviceDefinitionTableCreated(address indexed tableOwner, uint256 indexed manufacturerId, uint256 indexed tableId)
func (registry *Registry) UnpackDeviceDefinitionTableCreatedEvent(log *types.Log) (*RegistryDeviceDefinitionTableCreated, error) {
	event := "DeviceDefinitionTableCreated"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDeviceDefinitionTableCreated)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDeviceDefinitionUpdated represents a DeviceDefinitionUpdated event raised by the Registry contract.
type RegistryDeviceDefinitionUpdated struct {
	TableId *big.Int
	Id      string
	Raw     *types.Log // Blockchain specific contextual infos
}

const RegistryDeviceDefinitionUpdatedEventName = "DeviceDefinitionUpdated"

// ContractEventName returns the user-defined event name.
func (RegistryDeviceDefinitionUpdated) ContractEventName() string {
	return RegistryDeviceDefinitionUpdatedEventName
}

// UnpackDeviceDefinitionUpdatedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DeviceDefinitionUpdated(uint256 indexed tableId, string id)
func (registry *Registry) UnpackDeviceDefinitionUpdatedEvent(log *types.Log) (*RegistryDeviceDefinitionUpdated, error) {
	event := "DeviceDefinitionUpdated"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDeviceDefinitionUpdated)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDimoCreditSet represents a DimoCreditSet event raised by the Registry contract.
type RegistryDimoCreditSet struct {
	DimoCredit common.Address
	Raw        *types.Log // Blockchain specific contextual infos
}

const RegistryDimoCreditSetEventName = "DimoCreditSet"

// ContractEventName returns the user-defined event name.
func (RegistryDimoCreditSet) ContractEventName() string {
	return RegistryDimoCreditSetEventName
}

// UnpackDimoCreditSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DimoCreditSet(address indexed dimoCredit)
func (registry *Registry) UnpackDimoCreditSetEvent(log *types.Log) (*RegistryDimoCreditSet, error) {
	event := "DimoCreditSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDimoCreditSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDimoStreamrEnsSet represents a DimoStreamrEnsSet event raised by the Registry contract.
type RegistryDimoStreamrEnsSet struct {
	DimoStreamrEns string
	Raw            *types.Log // Blockchain specific contextual infos
}

const RegistryDimoStreamrEnsSetEventName = "DimoStreamrEnsSet"

// ContractEventName returns the user-defined event name.
func (RegistryDimoStreamrEnsSet) ContractEventName() string {
	return RegistryDimoStreamrEnsSetEventName
}

// UnpackDimoStreamrEnsSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DimoStreamrEnsSet(string dimoStreamrEns)
func (registry *Registry) UnpackDimoStreamrEnsSetEvent(log *types.Log) (*RegistryDimoStreamrEnsSet, error) {
	event := "DimoStreamrEnsSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDimoStreamrEnsSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDimoStreamrNodeSet represents a DimoStreamrNodeSet event raised by the Registry contract.
type RegistryDimoStreamrNodeSet struct {
	DimoStreamrNode common.Address
	Raw             *types.Log // Blockchain specific contextual infos
}

const RegistryDimoStreamrNodeSetEventName = "DimoStreamrNodeSet"

// ContractEventName returns the user-defined event name.
func (RegistryDimoStreamrNodeSet) ContractEventName() string {
	return RegistryDimoStreamrNodeSetEventName
}

// UnpackDimoStreamrNodeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DimoStreamrNodeSet(address dimoStreamrNode)
func (registry *Registry) UnpackDimoStreamrNodeSetEvent(log *types.Log) (*RegistryDimoStreamrNodeSet, error) {
	event := "DimoStreamrNodeSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDimoStreamrNodeSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryDimoTokenSet represents a DimoTokenSet event raised by the Registry contract.
type RegistryDimoTokenSet struct {
	DimoToken common.Address
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryDimoTokenSetEventName = "DimoTokenSet"

// ContractEventName returns the user-defined event name.
func (RegistryDimoTokenSet) ContractEventName() string {
	return RegistryDimoTokenSetEventName
}

// UnpackDimoTokenSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event DimoTokenSet(address indexed dimoToken)
func (registry *Registry) UnpackDimoTokenSetEvent(log *types.Log) (*RegistryDimoTokenSet, error) {
	event := "DimoTokenSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryDimoTokenSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryFoundationSet represents a FoundationSet event raised by the Registry contract.
type RegistryFoundationSet struct {
	Foundation common.Address
	Raw        *types.Log // Blockchain specific contextual infos
}

const RegistryFoundationSetEventName = "FoundationSet"

// ContractEventName returns the user-defined event name.
func (RegistryFoundationSet) ContractEventName() string {
	return RegistryFoundationSetEventName
}

// UnpackFoundationSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event FoundationSet(address indexed foundation)
func (registry *Registry) UnpackFoundationSetEvent(log *types.Log) (*RegistryFoundationSet, error) {
	event := "FoundationSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryFoundationSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryManufacturerAttributeAdded represents a ManufacturerAttributeAdded event raised by the Registry contract.
type RegistryManufacturerAttributeAdded struct {
	Attribute string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryManufacturerAttributeAddedEventName = "ManufacturerAttributeAdded"

// ContractEventName returns the user-defined event name.
func (RegistryManufacturerAttributeAdded) ContractEventName() string {
	return RegistryManufacturerAttributeAddedEventName
}

// UnpackManufacturerAttributeAddedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ManufacturerAttributeAdded(string attribute)
func (registry *Registry) UnpackManufacturerAttributeAddedEvent(log *types.Log) (*RegistryManufacturerAttributeAdded, error) {
	event := "ManufacturerAttributeAdded"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryManufacturerAttributeAdded)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryManufacturerAttributeSet represents a ManufacturerAttributeSet event raised by the Registry contract.
type RegistryManufacturerAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryManufacturerAttributeSetEventName = "ManufacturerAttributeSet"

// ContractEventName returns the user-defined event name.
func (RegistryManufacturerAttributeSet) ContractEventName() string {
	return RegistryManufacturerAttributeSetEventName
}

// UnpackManufacturerAttributeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ManufacturerAttributeSet(uint256 tokenId, string attribute, string info)
func (registry *Registry) UnpackManufacturerAttributeSetEvent(log *types.Log) (*RegistryManufacturerAttributeSet, error) {
	event := "ManufacturerAttributeSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryManufacturerAttributeSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryManufacturerIdProxySet represents a ManufacturerIdProxySet event raised by the Registry contract.
type RegistryManufacturerIdProxySet struct {
	Proxy common.Address
	Raw   *types.Log // Blockchain specific contextual infos
}

const RegistryManufacturerIdProxySetEventName = "ManufacturerIdProxySet"

// ContractEventName returns the user-defined event name.
func (RegistryManufacturerIdProxySet) ContractEventName() string {
	return RegistryManufacturerIdProxySetEventName
}

// UnpackManufacturerIdProxySetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ManufacturerIdProxySet(address indexed proxy)
func (registry *Registry) UnpackManufacturerIdProxySetEvent(log *types.Log) (*RegistryManufacturerIdProxySet, error) {
	event := "ManufacturerIdProxySet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryManufacturerIdProxySet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryManufacturerLicenseSet represents a ManufacturerLicenseSet event raised by the Registry contract.
type RegistryManufacturerLicenseSet struct {
	ManufacturerLicense common.Address
	Raw                 *types.Log // Blockchain specific contextual infos
}

const RegistryManufacturerLicenseSetEventName = "ManufacturerLicenseSet"

// ContractEventName returns the user-defined event name.
func (RegistryManufacturerLicenseSet) ContractEventName() string {
	return RegistryManufacturerLicenseSetEventName
}

// UnpackManufacturerLicenseSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ManufacturerLicenseSet(address indexed manufacturerLicense)
func (registry *Registry) UnpackManufacturerLicenseSetEvent(log *types.Log) (*RegistryManufacturerLicenseSet, error) {
	event := "ManufacturerLicenseSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryManufacturerLicenseSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryManufacturerNodeMinted represents a ManufacturerNodeMinted event raised by the Registry contract.
type RegistryManufacturerNodeMinted struct {
	Name    string
	TokenId *big.Int
	Owner   common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const RegistryManufacturerNodeMintedEventName = "ManufacturerNodeMinted"

// ContractEventName returns the user-defined event name.
func (RegistryManufacturerNodeMinted) ContractEventName() string {
	return RegistryManufacturerNodeMintedEventName
}

// UnpackManufacturerNodeMintedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ManufacturerNodeMinted(string name, uint256 tokenId, address indexed owner)
func (registry *Registry) UnpackManufacturerNodeMintedEvent(log *types.Log) (*RegistryManufacturerNodeMinted, error) {
	event := "ManufacturerNodeMinted"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryManufacturerNodeMinted)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryManufacturerTableSet represents a ManufacturerTableSet event raised by the Registry contract.
type RegistryManufacturerTableSet struct {
	ManufacturerId *big.Int
	TableId        *big.Int
	Raw            *types.Log // Blockchain specific contextual infos
}

const RegistryManufacturerTableSetEventName = "ManufacturerTableSet"

// ContractEventName returns the user-defined event name.
func (RegistryManufacturerTableSet) ContractEventName() string {
	return RegistryManufacturerTableSetEventName
}

// UnpackManufacturerTableSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ManufacturerTableSet(uint256 indexed manufacturerId, uint256 indexed tableId)
func (registry *Registry) UnpackManufacturerTableSetEvent(log *types.Log) (*RegistryManufacturerTableSet, error) {
	event := "ManufacturerTableSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryManufacturerTableSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryModuleAdded represents a ModuleAdded event raised by the Registry contract.
type RegistryModuleAdded struct {
	ModuleAddr common.Address
	Selectors  [][4]byte
	Raw        *types.Log // Blockchain specific contextual infos
}

const RegistryModuleAddedEventName = "ModuleAdded"

// ContractEventName returns the user-defined event name.
func (RegistryModuleAdded) ContractEventName() string {
	return RegistryModuleAddedEventName
}

// UnpackModuleAddedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ModuleAdded(address indexed moduleAddr, bytes4[] selectors)
func (registry *Registry) UnpackModuleAddedEvent(log *types.Log) (*RegistryModuleAdded, error) {
	event := "ModuleAdded"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryModuleAdded)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryModuleRemoved represents a ModuleRemoved event raised by the Registry contract.
type RegistryModuleRemoved struct {
	ModuleAddr common.Address
	Selectors  [][4]byte
	Raw        *types.Log // Blockchain specific contextual infos
}

const RegistryModuleRemovedEventName = "ModuleRemoved"

// ContractEventName returns the user-defined event name.
func (RegistryModuleRemoved) ContractEventName() string {
	return RegistryModuleRemovedEventName
}

// UnpackModuleRemovedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ModuleRemoved(address indexed moduleAddr, bytes4[] selectors)
func (registry *Registry) UnpackModuleRemovedEvent(log *types.Log) (*RegistryModuleRemoved, error) {
	event := "ModuleRemoved"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryModuleRemoved)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryModuleUpdated represents a ModuleUpdated event raised by the Registry contract.
type RegistryModuleUpdated struct {
	OldImplementation common.Address
	NewImplementation common.Address
	OldSelectors      [][4]byte
	NewSelectors      [][4]byte
	Raw               *types.Log // Blockchain specific contextual infos
}

const RegistryModuleUpdatedEventName = "ModuleUpdated"

// ContractEventName returns the user-defined event name.
func (RegistryModuleUpdated) ContractEventName() string {
	return RegistryModuleUpdatedEventName
}

// UnpackModuleUpdatedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ModuleUpdated(address indexed oldImplementation, address indexed newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors)
func (registry *Registry) UnpackModuleUpdatedEvent(log *types.Log) (*RegistryModuleUpdated, error) {
	event := "ModuleUpdated"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryModuleUpdated)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryOperationCostSet represents a OperationCostSet event raised by the Registry contract.
type RegistryOperationCostSet struct {
	Operation [32]byte
	Cost      *big.Int
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryOperationCostSetEventName = "OperationCostSet"

// ContractEventName returns the user-defined event name.
func (RegistryOperationCostSet) ContractEventName() string {
	return RegistryOperationCostSetEventName
}

// UnpackOperationCostSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event OperationCostSet(bytes32 operation, uint256 cost)
func (registry *Registry) UnpackOperationCostSetEvent(log *types.Log) (*RegistryOperationCostSet, error) {
	event := "OperationCostSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryOperationCostSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryRoleAdminChanged represents a RoleAdminChanged event raised by the Registry contract.
type RegistryRoleAdminChanged struct {
	Role              [32]byte
	PreviousAdminRole [32]byte
	NewAdminRole      [32]byte
	Raw               *types.Log // Blockchain specific contextual infos
}

const RegistryRoleAdminChangedEventName = "RoleAdminChanged"

// ContractEventName returns the user-defined event name.
func (RegistryRoleAdminChanged) ContractEventName() string {
	return RegistryRoleAdminChangedEventName
}

// UnpackRoleAdminChangedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
func (registry *Registry) UnpackRoleAdminChangedEvent(log *types.Log) (*RegistryRoleAdminChanged, error) {
	event := "RoleAdminChanged"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryRoleAdminChanged)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryRoleGranted represents a RoleGranted event raised by the Registry contract.
type RegistryRoleGranted struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const RegistryRoleGrantedEventName = "RoleGranted"

// ContractEventName returns the user-defined event name.
func (RegistryRoleGranted) ContractEventName() string {
	return RegistryRoleGrantedEventName
}

// UnpackRoleGrantedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (registry *Registry) UnpackRoleGrantedEvent(log *types.Log) (*RegistryRoleGranted, error) {
	event := "RoleGranted"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryRoleGranted)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryRoleRevoked represents a RoleRevoked event raised by the Registry contract.
type RegistryRoleRevoked struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const RegistryRoleRevokedEventName = "RoleRevoked"

// ContractEventName returns the user-defined event name.
func (RegistryRoleRevoked) ContractEventName() string {
	return RegistryRoleRevokedEventName
}

// UnpackRoleRevokedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (registry *Registry) UnpackRoleRevokedEvent(log *types.Log) (*RegistryRoleRevoked, error) {
	event := "RoleRevoked"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryRoleRevoked)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistrySacdSet represents a SacdSet event raised by the Registry contract.
type RegistrySacdSet struct {
	Sacd common.Address
	Raw  *types.Log // Blockchain specific contextual infos
}

const RegistrySacdSetEventName = "SacdSet"

// ContractEventName returns the user-defined event name.
func (RegistrySacdSet) ContractEventName() string {
	return RegistrySacdSetEventName
}

// UnpackSacdSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event SacdSet(address indexed sacd)
func (registry *Registry) UnpackSacdSetEvent(log *types.Log) (*RegistrySacdSet, error) {
	event := "SacdSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistrySacdSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryStorageNodeSet represents a StorageNodeSet event raised by the Registry contract.
type RegistryStorageNodeSet struct {
	StorageNode common.Address
	Raw         *types.Log // Blockchain specific contextual infos
}

const RegistryStorageNodeSetEventName = "StorageNodeSet"

// ContractEventName returns the user-defined event name.
func (RegistryStorageNodeSet) ContractEventName() string {
	return RegistryStorageNodeSetEventName
}

// UnpackStorageNodeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event StorageNodeSet(address indexed storageNode)
func (registry *Registry) UnpackStorageNodeSetEvent(log *types.Log) (*RegistryStorageNodeSet, error) {
	event := "StorageNodeSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryStorageNodeSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryStreamRegistrySet represents a StreamRegistrySet event raised by the Registry contract.
type RegistryStreamRegistrySet struct {
	StreamRegistry common.Address
	Raw            *types.Log // Blockchain specific contextual infos
}

const RegistryStreamRegistrySetEventName = "StreamRegistrySet"

// ContractEventName returns the user-defined event name.
func (RegistryStreamRegistrySet) ContractEventName() string {
	return RegistryStreamRegistrySetEventName
}

// UnpackStreamRegistrySetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event StreamRegistrySet(address streamRegistry)
func (registry *Registry) UnpackStreamRegistrySetEvent(log *types.Log) (*RegistryStreamRegistrySet, error) {
	event := "StreamRegistrySet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryStreamRegistrySet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistrySubscribedToVehicleStream represents a SubscribedToVehicleStream event raised by the Registry contract.
type RegistrySubscribedToVehicleStream struct {
	StreamId       string
	Subscriber     common.Address
	ExpirationTime *big.Int
	Raw            *types.Log // Blockchain specific contextual infos
}

const RegistrySubscribedToVehicleStreamEventName = "SubscribedToVehicleStream"

// ContractEventName returns the user-defined event name.
func (RegistrySubscribedToVehicleStream) ContractEventName() string {
	return RegistrySubscribedToVehicleStreamEventName
}

// UnpackSubscribedToVehicleStreamEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event SubscribedToVehicleStream(string streamId, address indexed subscriber, uint256 expirationTime)
func (registry *Registry) UnpackSubscribedToVehicleStreamEvent(log *types.Log) (*RegistrySubscribedToVehicleStream, error) {
	event := "SubscribedToVehicleStream"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistrySubscribedToVehicleStream)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistrySyntheticDeviceAttributeAdded represents a SyntheticDeviceAttributeAdded event raised by the Registry contract.
type RegistrySyntheticDeviceAttributeAdded struct {
	Attribute string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistrySyntheticDeviceAttributeAddedEventName = "SyntheticDeviceAttributeAdded"

// ContractEventName returns the user-defined event name.
func (RegistrySyntheticDeviceAttributeAdded) ContractEventName() string {
	return RegistrySyntheticDeviceAttributeAddedEventName
}

// UnpackSyntheticDeviceAttributeAddedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event SyntheticDeviceAttributeAdded(string attribute)
func (registry *Registry) UnpackSyntheticDeviceAttributeAddedEvent(log *types.Log) (*RegistrySyntheticDeviceAttributeAdded, error) {
	event := "SyntheticDeviceAttributeAdded"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistrySyntheticDeviceAttributeAdded)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistrySyntheticDeviceAttributeSet represents a SyntheticDeviceAttributeSet event raised by the Registry contract.
type RegistrySyntheticDeviceAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistrySyntheticDeviceAttributeSetEventName = "SyntheticDeviceAttributeSet"

// ContractEventName returns the user-defined event name.
func (RegistrySyntheticDeviceAttributeSet) ContractEventName() string {
	return RegistrySyntheticDeviceAttributeSetEventName
}

// UnpackSyntheticDeviceAttributeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event SyntheticDeviceAttributeSet(uint256 indexed tokenId, string attribute, string info)
func (registry *Registry) UnpackSyntheticDeviceAttributeSetEvent(log *types.Log) (*RegistrySyntheticDeviceAttributeSet, error) {
	event := "SyntheticDeviceAttributeSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistrySyntheticDeviceAttributeSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistrySyntheticDeviceIdProxySet represents a SyntheticDeviceIdProxySet event raised by the Registry contract.
type RegistrySyntheticDeviceIdProxySet struct {
	Proxy common.Address
	Raw   *types.Log // Blockchain specific contextual infos
}

const RegistrySyntheticDeviceIdProxySetEventName = "SyntheticDeviceIdProxySet"

// ContractEventName returns the user-defined event name.
func (RegistrySyntheticDeviceIdProxySet) ContractEventName() string {
	return RegistrySyntheticDeviceIdProxySetEventName
}

// UnpackSyntheticDeviceIdProxySetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event SyntheticDeviceIdProxySet(address proxy)
func (registry *Registry) UnpackSyntheticDeviceIdProxySetEvent(log *types.Log) (*RegistrySyntheticDeviceIdProxySet, error) {
	event := "SyntheticDeviceIdProxySet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistrySyntheticDeviceIdProxySet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistrySyntheticDeviceNodeBurned represents a SyntheticDeviceNodeBurned event raised by the Registry contract.
type RegistrySyntheticDeviceNodeBurned struct {
	SyntheticDeviceNode *big.Int
	VehicleNode         *big.Int
	Owner               common.Address
	Raw                 *types.Log // Blockchain specific contextual infos
}

const RegistrySyntheticDeviceNodeBurnedEventName = "SyntheticDeviceNodeBurned"

// ContractEventName returns the user-defined event name.
func (RegistrySyntheticDeviceNodeBurned) ContractEventName() string {
	return RegistrySyntheticDeviceNodeBurnedEventName
}

// UnpackSyntheticDeviceNodeBurnedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event SyntheticDeviceNodeBurned(uint256 indexed syntheticDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (registry *Registry) UnpackSyntheticDeviceNodeBurnedEvent(log *types.Log) (*RegistrySyntheticDeviceNodeBurned, error) {
	event := "SyntheticDeviceNodeBurned"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistrySyntheticDeviceNodeBurned)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistrySyntheticDeviceNodeMinted represents a SyntheticDeviceNodeMinted event raised by the Registry contract.
type RegistrySyntheticDeviceNodeMinted struct {
	ConnectionId           *big.Int
	SyntheticDeviceNode    *big.Int
	VehicleNode            *big.Int
	SyntheticDeviceAddress common.Address
	Owner                  common.Address
	Raw                    *types.Log // Blockchain specific contextual infos
}

const RegistrySyntheticDeviceNodeMintedEventName = "SyntheticDeviceNodeMinted"

// ContractEventName returns the user-defined event name.
func (RegistrySyntheticDeviceNodeMinted) ContractEventName() string {
	return RegistrySyntheticDeviceNodeMintedEventName
}

// UnpackSyntheticDeviceNodeMintedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event SyntheticDeviceNodeMinted(uint256 connectionId, uint256 syntheticDeviceNode, uint256 indexed vehicleNode, address indexed syntheticDeviceAddress, address indexed owner)
func (registry *Registry) UnpackSyntheticDeviceNodeMintedEvent(log *types.Log) (*RegistrySyntheticDeviceNodeMinted, error) {
	event := "SyntheticDeviceNodeMinted"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistrySyntheticDeviceNodeMinted)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleAttributeAdded represents a VehicleAttributeAdded event raised by the Registry contract.
type RegistryVehicleAttributeAdded struct {
	Attribute string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleAttributeAddedEventName = "VehicleAttributeAdded"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleAttributeAdded) ContractEventName() string {
	return RegistryVehicleAttributeAddedEventName
}

// UnpackVehicleAttributeAddedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleAttributeAdded(string attribute)
func (registry *Registry) UnpackVehicleAttributeAddedEvent(log *types.Log) (*RegistryVehicleAttributeAdded, error) {
	event := "VehicleAttributeAdded"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleAttributeAdded)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleAttributeRemoved represents a VehicleAttributeRemoved event raised by the Registry contract.
type RegistryVehicleAttributeRemoved struct {
	Attribute string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleAttributeRemovedEventName = "VehicleAttributeRemoved"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleAttributeRemoved) ContractEventName() string {
	return RegistryVehicleAttributeRemovedEventName
}

// UnpackVehicleAttributeRemovedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleAttributeRemoved(string attribute)
func (registry *Registry) UnpackVehicleAttributeRemovedEvent(log *types.Log) (*RegistryVehicleAttributeRemoved, error) {
	event := "VehicleAttributeRemoved"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleAttributeRemoved)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleAttributeSet represents a VehicleAttributeSet event raised by the Registry contract.
type RegistryVehicleAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleAttributeSetEventName = "VehicleAttributeSet"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleAttributeSet) ContractEventName() string {
	return RegistryVehicleAttributeSetEventName
}

// UnpackVehicleAttributeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleAttributeSet(uint256 tokenId, string attribute, string info)
func (registry *Registry) UnpackVehicleAttributeSetEvent(log *types.Log) (*RegistryVehicleAttributeSet, error) {
	event := "VehicleAttributeSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleAttributeSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleIdProxySet represents a VehicleIdProxySet event raised by the Registry contract.
type RegistryVehicleIdProxySet struct {
	Proxy common.Address
	Raw   *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleIdProxySetEventName = "VehicleIdProxySet"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleIdProxySet) ContractEventName() string {
	return RegistryVehicleIdProxySetEventName
}

// UnpackVehicleIdProxySetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleIdProxySet(address indexed proxy)
func (registry *Registry) UnpackVehicleIdProxySetEvent(log *types.Log) (*RegistryVehicleIdProxySet, error) {
	event := "VehicleIdProxySet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleIdProxySet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleNodeBurned represents a VehicleNodeBurned event raised by the Registry contract.
type RegistryVehicleNodeBurned struct {
	VehicleNode *big.Int
	Owner       common.Address
	Raw         *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleNodeBurnedEventName = "VehicleNodeBurned"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleNodeBurned) ContractEventName() string {
	return RegistryVehicleNodeBurnedEventName
}

// UnpackVehicleNodeBurnedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleNodeBurned(uint256 indexed vehicleNode, address indexed owner)
func (registry *Registry) UnpackVehicleNodeBurnedEvent(log *types.Log) (*RegistryVehicleNodeBurned, error) {
	event := "VehicleNodeBurned"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleNodeBurned)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleNodeMinted represents a VehicleNodeMinted event raised by the Registry contract.
type RegistryVehicleNodeMinted struct {
	ManufacturerNode *big.Int
	TokenId          *big.Int
	Owner            common.Address
	Raw              *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleNodeMintedEventName = "VehicleNodeMinted"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleNodeMinted) ContractEventName() string {
	return RegistryVehicleNodeMintedEventName
}

// UnpackVehicleNodeMintedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleNodeMinted(uint256 manufacturerNode, uint256 tokenId, address owner)
func (registry *Registry) UnpackVehicleNodeMintedEvent(log *types.Log) (*RegistryVehicleNodeMinted, error) {
	event := "VehicleNodeMinted"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleNodeMinted)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleStorageNodeIdSet represents a VehicleStorageNodeIdSet event raised by the Registry contract.
type RegistryVehicleStorageNodeIdSet struct {
	VehicleId     *big.Int
	StorageNodeId *big.Int
	Raw           *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleStorageNodeIdSetEventName = "VehicleStorageNodeIdSet"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleStorageNodeIdSet) ContractEventName() string {
	return RegistryVehicleStorageNodeIdSetEventName
}

// UnpackVehicleStorageNodeIdSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleStorageNodeIdSet(uint256 indexed vehicleId, uint256 indexed storageNodeId)
func (registry *Registry) UnpackVehicleStorageNodeIdSetEvent(log *types.Log) (*RegistryVehicleStorageNodeIdSet, error) {
	event := "VehicleStorageNodeIdSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleStorageNodeIdSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleStreamSet represents a VehicleStreamSet event raised by the Registry contract.
type RegistryVehicleStreamSet struct {
	VehicleId *big.Int
	StreamId  string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleStreamSetEventName = "VehicleStreamSet"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleStreamSet) ContractEventName() string {
	return RegistryVehicleStreamSetEventName
}

// UnpackVehicleStreamSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleStreamSet(uint256 indexed vehicleId, string streamId)
func (registry *Registry) UnpackVehicleStreamSetEvent(log *types.Log) (*RegistryVehicleStreamSet, error) {
	event := "VehicleStreamSet"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleStreamSet)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// RegistryVehicleStreamUnset represents a VehicleStreamUnset event raised by the Registry contract.
type RegistryVehicleStreamUnset struct {
	VehicleId *big.Int
	StreamId  string
	Raw       *types.Log // Blockchain specific contextual infos
}

const RegistryVehicleStreamUnsetEventName = "VehicleStreamUnset"

// ContractEventName returns the user-defined event name.
func (RegistryVehicleStreamUnset) ContractEventName() string {
	return RegistryVehicleStreamUnsetEventName
}

// UnpackVehicleStreamUnsetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event VehicleStreamUnset(uint256 indexed vehicleId, string streamId)
func (registry *Registry) UnpackVehicleStreamUnsetEvent(log *types.Log) (*RegistryVehicleStreamUnset, error) {
	event := "VehicleStreamUnset"
	if len(log.Topics) == 0 || log.Topics[0] != registry.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(RegistryVehicleStreamUnset)
	if len(log.Data) > 0 {
		if err := registry.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range registry.abi.Events[event].Inputs {
		if arg.Indexed {
			indexed = append(indexed, arg)
		}
	}
	if err := abi.ParseTopics(out, indexed, log.Topics[1:]); err != nil {
		return nil, err
	}
	out.Raw = log
	return out, nil
}

// UnpackError attempts to decode the provided error data using user-defined
// error definitions.
func (registry *Registry) UnpackError(raw []byte) (any, error) {
	if bytes.Equal(raw[:4], registry.abi.Errors["AdNotClaimed"].ID.Bytes()[:4]) {
		return registry.UnpackAdNotClaimedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["AdNotPaired"].ID.Bytes()[:4]) {
		return registry.UnpackAdNotPairedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["AdPaired"].ID.Bytes()[:4]) {
		return registry.UnpackAdPairedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["AttributeExists"].ID.Bytes()[:4]) {
		return registry.UnpackAttributeExistsError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["AttributeNotWhitelisted"].ID.Bytes()[:4]) {
		return registry.UnpackAttributeNotWhitelistedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["ChainNotSupported"].ID.Bytes()[:4]) {
		return registry.UnpackChainNotSupportedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["DeviceAlreadyClaimed"].ID.Bytes()[:4]) {
		return registry.UnpackDeviceAlreadyClaimedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["DeviceAlreadyRegistered"].ID.Bytes()[:4]) {
		return registry.UnpackDeviceAlreadyRegisteredError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidAdSignature"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidAdSignatureError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidLicense"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidLicenseError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidManufacturerId"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidManufacturerIdError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidNode"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidNodeError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidOwnerSignature"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidOwnerSignatureError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidParentNode"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidParentNodeError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidSdSignature"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidSdSignatureError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidSigner"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidSignerError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["InvalidStorageNode"].ID.Bytes()[:4]) {
		return registry.UnpackInvalidStorageNodeError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["NoStreamrPermission"].ID.Bytes()[:4]) {
		return registry.UnpackNoStreamrPermissionError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["OnlyNftProxy"].ID.Bytes()[:4]) {
		return registry.UnpackOnlyNftProxyError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["OwnersDoNotMatch"].ID.Bytes()[:4]) {
		return registry.UnpackOwnersDoNotMatchError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["StreamDoesNotExist"].ID.Bytes()[:4]) {
		return registry.UnpackStreamDoesNotExistError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["TableAlreadyExists"].ID.Bytes()[:4]) {
		return registry.UnpackTableAlreadyExistsError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["TableDoesNotExist"].ID.Bytes()[:4]) {
		return registry.UnpackTableDoesNotExistError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["UintUtilsInsufficientHexLength"].ID.Bytes()[:4]) {
		return registry.UnpackUintUtilsInsufficientHexLengthError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["Unauthorized"].ID.Bytes()[:4]) {
		return registry.UnpackUnauthorizedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["VehicleNotPaired"].ID.Bytes()[:4]) {
		return registry.UnpackVehicleNotPairedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["VehiclePaired"].ID.Bytes()[:4]) {
		return registry.UnpackVehiclePairedError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["VehicleStreamAlreadySet"].ID.Bytes()[:4]) {
		return registry.UnpackVehicleStreamAlreadySetError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["VehicleStreamNotSet"].ID.Bytes()[:4]) {
		return registry.UnpackVehicleStreamNotSetError(raw[4:])
	}
	if bytes.Equal(raw[:4], registry.abi.Errors["ZeroAddress"].ID.Bytes()[:4]) {
		return registry.UnpackZeroAddressError(raw[4:])
	}
	return nil, errors.New("Unknown error")
}

// RegistryAdNotClaimed represents a AdNotClaimed error raised by the Registry contract.
type RegistryAdNotClaimed struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error AdNotClaimed(uint256 id)
func RegistryAdNotClaimedErrorID() common.Hash {
	return common.HexToHash("0x15bdaac1be0e2a0c9761011917ddec5f4cf98a973f9ab2f15d5d48956befe371")
}

// UnpackAdNotClaimedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error AdNotClaimed(uint256 id)
func (registry *Registry) UnpackAdNotClaimedError(raw []byte) (*RegistryAdNotClaimed, error) {
	out := new(RegistryAdNotClaimed)
	if err := registry.abi.UnpackIntoInterface(out, "AdNotClaimed", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryAdNotPaired represents a AdNotPaired error raised by the Registry contract.
type RegistryAdNotPaired struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error AdNotPaired(uint256 id)
func RegistryAdNotPairedErrorID() common.Hash {
	return common.HexToHash("0xd11e35b4971dae42662570b97c37946171bb77e9a71b0a1d04b690f6406b76c4")
}

// UnpackAdNotPairedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error AdNotPaired(uint256 id)
func (registry *Registry) UnpackAdNotPairedError(raw []byte) (*RegistryAdNotPaired, error) {
	out := new(RegistryAdNotPaired)
	if err := registry.abi.UnpackIntoInterface(out, "AdNotPaired", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryAdPaired represents a AdPaired error raised by the Registry contract.
type RegistryAdPaired struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error AdPaired(uint256 id)
func RegistryAdPairedErrorID() common.Hash {
	return common.HexToHash("0x762116ae8a8b930724aeeb5909dbc1cea9ec682c699c9518147b46ec45e97ac2")
}

// UnpackAdPairedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error AdPaired(uint256 id)
func (registry *Registry) UnpackAdPairedError(raw []byte) (*RegistryAdPaired, error) {
	out := new(RegistryAdPaired)
	if err := registry.abi.UnpackIntoInterface(out, "AdPaired", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryAttributeExists represents a AttributeExists error raised by the Registry contract.
type RegistryAttributeExists struct {
	Attr string
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error AttributeExists(string attr)
func RegistryAttributeExistsErrorID() common.Hash {
	return common.HexToHash("0x130e2668a02eb11e486d84a088394487a46ff95792d0b0ad51374d76189d2c60")
}

// UnpackAttributeExistsError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error AttributeExists(string attr)
func (registry *Registry) UnpackAttributeExistsError(raw []byte) (*RegistryAttributeExists, error) {
	out := new(RegistryAttributeExists)
	if err := registry.abi.UnpackIntoInterface(out, "AttributeExists", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryAttributeNotWhitelisted represents a AttributeNotWhitelisted error raised by the Registry contract.
type RegistryAttributeNotWhitelisted struct {
	Attr string
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error AttributeNotWhitelisted(string attr)
func RegistryAttributeNotWhitelistedErrorID() common.Hash {
	return common.HexToHash("0x1c48d49ec8bb0555686dae5e6beabbade4ccfaa91112fba47f56ed431697cb12")
}

// UnpackAttributeNotWhitelistedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error AttributeNotWhitelisted(string attr)
func (registry *Registry) UnpackAttributeNotWhitelistedError(raw []byte) (*RegistryAttributeNotWhitelisted, error) {
	out := new(RegistryAttributeNotWhitelisted)
	if err := registry.abi.UnpackIntoInterface(out, "AttributeNotWhitelisted", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryChainNotSupported represents a ChainNotSupported error raised by the Registry contract.
type RegistryChainNotSupported struct {
	Chainid *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error ChainNotSupported(uint256 chainid)
func RegistryChainNotSupportedErrorID() common.Hash {
	return common.HexToHash("0x264e42cf014c265c433be0c2e7b5e850eda0125d911783f80532591a387c1077")
}

// UnpackChainNotSupportedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error ChainNotSupported(uint256 chainid)
func (registry *Registry) UnpackChainNotSupportedError(raw []byte) (*RegistryChainNotSupported, error) {
	out := new(RegistryChainNotSupported)
	if err := registry.abi.UnpackIntoInterface(out, "ChainNotSupported", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryDeviceAlreadyClaimed represents a DeviceAlreadyClaimed error raised by the Registry contract.
type RegistryDeviceAlreadyClaimed struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error DeviceAlreadyClaimed(uint256 id)
func RegistryDeviceAlreadyClaimedErrorID() common.Hash {
	return common.HexToHash("0x4dec88eb0d830c1ca9d95404eb1837ffe3aae8bf45755195dba9682826bb8fd2")
}

// UnpackDeviceAlreadyClaimedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error DeviceAlreadyClaimed(uint256 id)
func (registry *Registry) UnpackDeviceAlreadyClaimedError(raw []byte) (*RegistryDeviceAlreadyClaimed, error) {
	out := new(RegistryDeviceAlreadyClaimed)
	if err := registry.abi.UnpackIntoInterface(out, "DeviceAlreadyClaimed", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryDeviceAlreadyRegistered represents a DeviceAlreadyRegistered error raised by the Registry contract.
type RegistryDeviceAlreadyRegistered struct {
	Addr common.Address
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error DeviceAlreadyRegistered(address addr)
func RegistryDeviceAlreadyRegisteredErrorID() common.Hash {
	return common.HexToHash("0xcd76e8452330cdbbbf9509933000c6f133cc88a5a3d566b798d9edcc155d0418")
}

// UnpackDeviceAlreadyRegisteredError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error DeviceAlreadyRegistered(address addr)
func (registry *Registry) UnpackDeviceAlreadyRegisteredError(raw []byte) (*RegistryDeviceAlreadyRegistered, error) {
	out := new(RegistryDeviceAlreadyRegistered)
	if err := registry.abi.UnpackIntoInterface(out, "DeviceAlreadyRegistered", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidAdSignature represents a InvalidAdSignature error raised by the Registry contract.
type RegistryInvalidAdSignature struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidAdSignature()
func RegistryInvalidAdSignatureErrorID() common.Hash {
	return common.HexToHash("0xdbe5383bdecd4a5402df73a3bf3051995cd71fa7360ed566cd1144b08e2679b4")
}

// UnpackInvalidAdSignatureError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidAdSignature()
func (registry *Registry) UnpackInvalidAdSignatureError(raw []byte) (*RegistryInvalidAdSignature, error) {
	out := new(RegistryInvalidAdSignature)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidAdSignature", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidLicense represents a InvalidLicense error raised by the Registry contract.
type RegistryInvalidLicense struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidLicense()
func RegistryInvalidLicenseErrorID() common.Hash {
	return common.HexToHash("0x5d6085194bcb0cc07849b946a0dd77e25c61745c7e0cad558ffd9367e5e80dcd")
}

// UnpackInvalidLicenseError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidLicense()
func (registry *Registry) UnpackInvalidLicenseError(raw []byte) (*RegistryInvalidLicense, error) {
	out := new(RegistryInvalidLicense)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidLicense", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidManufacturerId represents a InvalidManufacturerId error raised by the Registry contract.
type RegistryInvalidManufacturerId struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidManufacturerId(uint256 id)
func RegistryInvalidManufacturerIdErrorID() common.Hash {
	return common.HexToHash("0xa25b0cf94058dc9615c073cf4383515615a235aaee7f1df35c97ae52ac0a1101")
}

// UnpackInvalidManufacturerIdError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidManufacturerId(uint256 id)
func (registry *Registry) UnpackInvalidManufacturerIdError(raw []byte) (*RegistryInvalidManufacturerId, error) {
	out := new(RegistryInvalidManufacturerId)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidManufacturerId", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidNode represents a InvalidNode error raised by the Registry contract.
type RegistryInvalidNode struct {
	Proxy common.Address
	Id    *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidNode(address proxy, uint256 id)
func RegistryInvalidNodeErrorID() common.Hash {
	return common.HexToHash("0xe3ca963973068fb7498ab3ab9f953baf821d09dc7e032c626537dbebf1b155cc")
}

// UnpackInvalidNodeError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidNode(address proxy, uint256 id)
func (registry *Registry) UnpackInvalidNodeError(raw []byte) (*RegistryInvalidNode, error) {
	out := new(RegistryInvalidNode)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidNode", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidOwnerSignature represents a InvalidOwnerSignature error raised by the Registry contract.
type RegistryInvalidOwnerSignature struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidOwnerSignature()
func RegistryInvalidOwnerSignatureErrorID() common.Hash {
	return common.HexToHash("0x38a85a8de553ff50a410d75418f20d721cda64b2bff141e621600541fd25cd8b")
}

// UnpackInvalidOwnerSignatureError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidOwnerSignature()
func (registry *Registry) UnpackInvalidOwnerSignatureError(raw []byte) (*RegistryInvalidOwnerSignature, error) {
	out := new(RegistryInvalidOwnerSignature)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidOwnerSignature", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidParentNode represents a InvalidParentNode error raised by the Registry contract.
type RegistryInvalidParentNode struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidParentNode(uint256 id)
func RegistryInvalidParentNodeErrorID() common.Hash {
	return common.HexToHash("0x5299bab74f41ef2a254c9e5e70f4be90fe6e9303bf5d6a2055645af31970a34c")
}

// UnpackInvalidParentNodeError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidParentNode(uint256 id)
func (registry *Registry) UnpackInvalidParentNodeError(raw []byte) (*RegistryInvalidParentNode, error) {
	out := new(RegistryInvalidParentNode)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidParentNode", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidSdSignature represents a InvalidSdSignature error raised by the Registry contract.
type RegistryInvalidSdSignature struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidSdSignature()
func RegistryInvalidSdSignatureErrorID() common.Hash {
	return common.HexToHash("0xf8e95d55bfc0be096004b9233ca2cb04261693197ff83b908710d35ac9418943")
}

// UnpackInvalidSdSignatureError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidSdSignature()
func (registry *Registry) UnpackInvalidSdSignatureError(raw []byte) (*RegistryInvalidSdSignature, error) {
	out := new(RegistryInvalidSdSignature)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidSdSignature", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidSigner represents a InvalidSigner error raised by the Registry contract.
type RegistryInvalidSigner struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidSigner()
func RegistryInvalidSignerErrorID() common.Hash {
	return common.HexToHash("0x815e1d64efb74fbe314c20a2b8a2335d18bce12a19165e447fa36bcb35959528")
}

// UnpackInvalidSignerError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidSigner()
func (registry *Registry) UnpackInvalidSignerError(raw []byte) (*RegistryInvalidSigner, error) {
	out := new(RegistryInvalidSigner)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidSigner", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryInvalidStorageNode represents a InvalidStorageNode error raised by the Registry contract.
type RegistryInvalidStorageNode struct {
	StorageNodeId *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidStorageNode(uint256 storageNodeId)
func RegistryInvalidStorageNodeErrorID() common.Hash {
	return common.HexToHash("0x65745f79c5d0bb62a0725993661b73ba477e33a665bb90b94f80e32e1a53fa91")
}

// UnpackInvalidStorageNodeError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidStorageNode(uint256 storageNodeId)
func (registry *Registry) UnpackInvalidStorageNodeError(raw []byte) (*RegistryInvalidStorageNode, error) {
	out := new(RegistryInvalidStorageNode)
	if err := registry.abi.UnpackIntoInterface(out, "InvalidStorageNode", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryNoStreamrPermission represents a NoStreamrPermission error raised by the Registry contract.
type RegistryNoStreamrPermission struct {
	User           common.Address
	PermissionType uint8
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error NoStreamrPermission(address user, uint8 permissionType)
func RegistryNoStreamrPermissionErrorID() common.Hash {
	return common.HexToHash("0xc8093930947f5ecc4dbef3fa0c4f508b8943f94279a0d964828c34e8edca3643")
}

// UnpackNoStreamrPermissionError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error NoStreamrPermission(address user, uint8 permissionType)
func (registry *Registry) UnpackNoStreamrPermissionError(raw []byte) (*RegistryNoStreamrPermission, error) {
	out := new(RegistryNoStreamrPermission)
	if err := registry.abi.UnpackIntoInterface(out, "NoStreamrPermission", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryOnlyNftProxy represents a OnlyNftProxy error raised by the Registry contract.
type RegistryOnlyNftProxy struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error OnlyNftProxy()
func RegistryOnlyNftProxyErrorID() common.Hash {
	return common.HexToHash("0x87e6ac10b28949367025eba1127c31f21c7b31476813cf4e87a0a58098b6c93e")
}

// UnpackOnlyNftProxyError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error OnlyNftProxy()
func (registry *Registry) UnpackOnlyNftProxyError(raw []byte) (*RegistryOnlyNftProxy, error) {
	out := new(RegistryOnlyNftProxy)
	if err := registry.abi.UnpackIntoInterface(out, "OnlyNftProxy", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryOwnersDoNotMatch represents a OwnersDoNotMatch error raised by the Registry contract.
type RegistryOwnersDoNotMatch struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error OwnersDoNotMatch()
func RegistryOwnersDoNotMatchErrorID() common.Hash {
	return common.HexToHash("0x4fc280abbda3061871aa8c4cad5982371174654cf418a6cf99253cba25a94ccc")
}

// UnpackOwnersDoNotMatchError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error OwnersDoNotMatch()
func (registry *Registry) UnpackOwnersDoNotMatchError(raw []byte) (*RegistryOwnersDoNotMatch, error) {
	out := new(RegistryOwnersDoNotMatch)
	if err := registry.abi.UnpackIntoInterface(out, "OwnersDoNotMatch", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryStreamDoesNotExist represents a StreamDoesNotExist error raised by the Registry contract.
type RegistryStreamDoesNotExist struct {
	StreamId string
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error StreamDoesNotExist(string streamId)
func RegistryStreamDoesNotExistErrorID() common.Hash {
	return common.HexToHash("0xa3f1925ad9ba3e696280acf57ce6b28d27bad007f96b0df84e2795ac494c3dcc")
}

// UnpackStreamDoesNotExistError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error StreamDoesNotExist(string streamId)
func (registry *Registry) UnpackStreamDoesNotExistError(raw []byte) (*RegistryStreamDoesNotExist, error) {
	out := new(RegistryStreamDoesNotExist)
	if err := registry.abi.UnpackIntoInterface(out, "StreamDoesNotExist", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryTableAlreadyExists represents a TableAlreadyExists error raised by the Registry contract.
type RegistryTableAlreadyExists struct {
	ManufacturerId *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error TableAlreadyExists(uint256 manufacturerId)
func RegistryTableAlreadyExistsErrorID() common.Hash {
	return common.HexToHash("0x3784d0a9c3a107b8ee59f40b224472dcb1fbef99a8da4205a255dc53eb6dc1c1")
}

// UnpackTableAlreadyExistsError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error TableAlreadyExists(uint256 manufacturerId)
func (registry *Registry) UnpackTableAlreadyExistsError(raw []byte) (*RegistryTableAlreadyExists, error) {
	out := new(RegistryTableAlreadyExists)
	if err := registry.abi.UnpackIntoInterface(out, "TableAlreadyExists", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryTableDoesNotExist represents a TableDoesNotExist error raised by the Registry contract.
type RegistryTableDoesNotExist struct {
	TableId *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error TableDoesNotExist(uint256 tableId)
func RegistryTableDoesNotExistErrorID() common.Hash {
	return common.HexToHash("0x45cbe5ece2f056835d1a16680e0a590bbeab039ea3a2ed4a66ffc8529e509bec")
}

// UnpackTableDoesNotExistError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error TableDoesNotExist(uint256 tableId)
func (registry *Registry) UnpackTableDoesNotExistError(raw []byte) (*RegistryTableDoesNotExist, error) {
	out := new(RegistryTableDoesNotExist)
	if err := registry.abi.UnpackIntoInterface(out, "TableDoesNotExist", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryUintUtilsInsufficientHexLength represents a UintUtils__InsufficientHexLength error raised by the Registry contract.
type RegistryUintUtilsInsufficientHexLength struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error UintUtils__InsufficientHexLength()
func RegistryUintUtilsInsufficientHexLengthErrorID() common.Hash {
	return common.HexToHash("0xc9134785d3cbe2b640cac727ffdeab73ad3cd3ee091343c660e1fcfea682c654")
}

// UnpackUintUtilsInsufficientHexLengthError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error UintUtils__InsufficientHexLength()
func (registry *Registry) UnpackUintUtilsInsufficientHexLengthError(raw []byte) (*RegistryUintUtilsInsufficientHexLength, error) {
	out := new(RegistryUintUtilsInsufficientHexLength)
	if err := registry.abi.UnpackIntoInterface(out, "UintUtilsInsufficientHexLength", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryUnauthorized represents a Unauthorized error raised by the Registry contract.
type RegistryUnauthorized struct {
	Caller common.Address
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error Unauthorized(address caller)
func RegistryUnauthorizedErrorID() common.Hash {
	return common.HexToHash("0x8e4a23d6a5d81f013eca4bc92aeb9214ccafcaebd1f097c350c922d6e19122d5")
}

// UnpackUnauthorizedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error Unauthorized(address caller)
func (registry *Registry) UnpackUnauthorizedError(raw []byte) (*RegistryUnauthorized, error) {
	out := new(RegistryUnauthorized)
	if err := registry.abi.UnpackIntoInterface(out, "Unauthorized", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryVehicleNotPaired represents a VehicleNotPaired error raised by the Registry contract.
type RegistryVehicleNotPaired struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error VehicleNotPaired(uint256 id)
func RegistryVehicleNotPairedErrorID() common.Hash {
	return common.HexToHash("0x2d91fcb5497041df8ae21845cca8912e2d59c0151eebbc0f6c20d33479efaec5")
}

// UnpackVehicleNotPairedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error VehicleNotPaired(uint256 id)
func (registry *Registry) UnpackVehicleNotPairedError(raw []byte) (*RegistryVehicleNotPaired, error) {
	out := new(RegistryVehicleNotPaired)
	if err := registry.abi.UnpackIntoInterface(out, "VehicleNotPaired", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryVehiclePaired represents a VehiclePaired error raised by the Registry contract.
type RegistryVehiclePaired struct {
	Id *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error VehiclePaired(uint256 id)
func RegistryVehiclePairedErrorID() common.Hash {
	return common.HexToHash("0xc46a516889a8aec276b120978da7bd9b43a972a8400e7328398077b0c2ccf612")
}

// UnpackVehiclePairedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error VehiclePaired(uint256 id)
func (registry *Registry) UnpackVehiclePairedError(raw []byte) (*RegistryVehiclePaired, error) {
	out := new(RegistryVehiclePaired)
	if err := registry.abi.UnpackIntoInterface(out, "VehiclePaired", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryVehicleStreamAlreadySet represents a VehicleStreamAlreadySet error raised by the Registry contract.
type RegistryVehicleStreamAlreadySet struct {
	VehicleId *big.Int
	StreamId  string
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error VehicleStreamAlreadySet(uint256 vehicleId, string streamId)
func RegistryVehicleStreamAlreadySetErrorID() common.Hash {
	return common.HexToHash("0xf7959f9ec3a8654f8c7eae9e4d645ba04042d9d15e594135952938ea2a927643")
}

// UnpackVehicleStreamAlreadySetError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error VehicleStreamAlreadySet(uint256 vehicleId, string streamId)
func (registry *Registry) UnpackVehicleStreamAlreadySetError(raw []byte) (*RegistryVehicleStreamAlreadySet, error) {
	out := new(RegistryVehicleStreamAlreadySet)
	if err := registry.abi.UnpackIntoInterface(out, "VehicleStreamAlreadySet", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryVehicleStreamNotSet represents a VehicleStreamNotSet error raised by the Registry contract.
type RegistryVehicleStreamNotSet struct {
	VehicleId *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error VehicleStreamNotSet(uint256 vehicleId)
func RegistryVehicleStreamNotSetErrorID() common.Hash {
	return common.HexToHash("0x42e5dbbefdd82cdf234a5aa432b115f629a3bfb4b3a80c0795388c57d3542636")
}

// UnpackVehicleStreamNotSetError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error VehicleStreamNotSet(uint256 vehicleId)
func (registry *Registry) UnpackVehicleStreamNotSetError(raw []byte) (*RegistryVehicleStreamNotSet, error) {
	out := new(RegistryVehicleStreamNotSet)
	if err := registry.abi.UnpackIntoInterface(out, "VehicleStreamNotSet", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// RegistryZeroAddress represents a ZeroAddress error raised by the Registry contract.
type RegistryZeroAddress struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error ZeroAddress()
func RegistryZeroAddressErrorID() common.Hash {
	return common.HexToHash("0xd92e233df2717d4a40030e20904abd27b68fcbeede117eaaccbbdac9618c8c73")
}

// UnpackZeroAddressError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error ZeroAddress()
func (registry *Registry) UnpackZeroAddressError(raw []byte) (*RegistryZeroAddress, error) {
	out := new(RegistryZeroAddress)
	if err := registry.abi.UnpackIntoInterface(out, "ZeroAddress", raw); err != nil {
		return nil, err
	}
	return out, nil
}
