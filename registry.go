// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package contracts

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
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

// DeviceDefinitionInput is an auto generated low-level Go binding around an user-defined struct.
type DeviceDefinitionInput struct {
	Id         string
	Model      string
	Year       *big.Int
	Metadata   string
	Ksuid      string
	Devicetype string
	Imageuri   string
}

// MintSyntheticDeviceBatchInput is an auto generated low-level Go binding around an user-defined struct.
type MintSyntheticDeviceBatchInput struct {
	VehicleNode         *big.Int
	SyntheticDeviceAddr common.Address
	AttrInfoPairs       []AttributeInfoPair
}

// MintSyntheticDeviceInput is an auto generated low-level Go binding around an user-defined struct.
type MintSyntheticDeviceInput struct {
	IntegrationNode     *big.Int
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
	IntegrationNode      *big.Int
	VehicleOwnerSig      []byte
	SyntheticDeviceSig   []byte
	SyntheticDeviceAddr  common.Address
	AttrInfoPairsDevice  []AttributeInfoPair
}

// MintVehicleAndSdWithDdInput is an auto generated low-level Go binding around an user-defined struct.
type MintVehicleAndSdWithDdInput struct {
	ManufacturerNode    *big.Int
	Owner               common.Address
	DeviceDefinitionId  string
	IntegrationNode     *big.Int
	VehicleOwnerSig     []byte
	SyntheticDeviceSig  []byte
	SyntheticDeviceAddr common.Address
	AttrInfoPairsDevice []AttributeInfoPair
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
var RegistryMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"UintUtils__InsufficientHexLength\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"moduleAddr\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"ModuleAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"moduleAddr\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"ModuleRemoved\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"oldImplementation\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"oldSelectors\",\"type\":\"bytes4[]\"},{\"indexed\":false,\"internalType\":\"bytes4[]\",\"name\":\"newSelectors\",\"type\":\"bytes4[]\"}],\"name\":\"ModuleUpdated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"previousAdminRole\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"newAdminRole\",\"type\":\"bytes32\"}],\"name\":\"RoleAdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"stateMutability\":\"nonpayable\",\"type\":\"fallback\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"implementation\",\"type\":\"address\"},{\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"addModule\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"implementation\",\"type\":\"address\"},{\"internalType\":\"bytes4[]\",\"name\":\"selectors\",\"type\":\"bytes4[]\"}],\"name\":\"removeModule\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"oldImplementation\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"},{\"internalType\":\"bytes4[]\",\"name\":\"oldSelectors\",\"type\":\"bytes4[]\"},{\"internalType\":\"bytes4[]\",\"name\":\"newSelectors\",\"type\":\"bytes4[]\"}],\"name\":\"updateModule\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"AdNotClaimed\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"AdPaired\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"InvalidNode\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"VehiclePaired\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"AftermarketDeviceAttributeSetDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"adNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceNodeBurnedDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDevicePaired\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"oldOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceTransferredDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"}],\"name\":\"AftermarketDeviceUnclaimedDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceUnpairedDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"SyntheticDeviceAttributeSetDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"syntheticDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"SyntheticDeviceNodeBurnedDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"VehicleAttributeSetDevAdmin\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"VehicleNodeBurnedDevAdmin\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnAftermarketDevices\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnAftermarketDevicesAndDeletePairings\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnSyntheticDevicesAndDeletePairings\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnVehicles\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"tokenIds\",\"type\":\"uint256[]\"}],\"name\":\"adminBurnVehiclesAndDeletePairings\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"adminCacheDimoStreamrEns\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"newParentNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256[]\",\"name\":\"nodeIdList\",\"type\":\"uint256[]\"}],\"name\":\"adminChangeParentNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"}],\"name\":\"adminPairAftermarketDevice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"internalType\":\"structDevAdmin.IdManufacturerName[]\",\"name\":\"idManufacturerNames\",\"type\":\"tuple[]\"}],\"name\":\"renameManufacturers\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferAftermarketDeviceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"aftermarketDeviceNodes\",\"type\":\"uint256[]\"}],\"name\":\"unclaimAftermarketDeviceNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"aftermarketDeviceNodes\",\"type\":\"uint256[]\"}],\"name\":\"unpairAftermarketDeviceByDeviceNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"vehicleNodes\",\"type\":\"uint256[]\"}],\"name\":\"unpairAftermarketDeviceByVehicleNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleAdmin\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"grantRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"revokeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"version\",\"type\":\"string\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes[]\",\"name\":\"data\",\"type\":\"bytes[]\"}],\"name\":\"multiDelegateCall\",\"outputs\":[{\"internalType\":\"bytes[]\",\"name\":\"results\",\"type\":\"bytes[]\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes[]\",\"name\":\"data\",\"type\":\"bytes[]\"}],\"name\":\"multiStaticCall\",\"outputs\":[{\"internalType\":\"bytes[]\",\"name\":\"results\",\"type\":\"bytes[]\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getAdMintCost\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"adMintCost\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_adMintCost\",\"type\":\"uint256\"}],\"name\":\"setAdMintCost\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_dimoToken\",\"type\":\"address\"}],\"name\":\"setDimoToken\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_foundation\",\"type\":\"address\"}],\"name\":\"setFoundationAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_license\",\"type\":\"address\"}],\"name\":\"setLicense\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"AdNotPaired\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attr\",\"type\":\"string\"}],\"name\":\"AttributeExists\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attr\",\"type\":\"string\"}],\"name\":\"AttributeNotWhitelisted\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"DeviceAlreadyClaimed\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"DeviceAlreadyRegistered\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidAdSignature\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidLicense\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidOwnerSignature\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"InvalidParentNode\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"InvalidSigner\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"OwnersDoNotMatch\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"Unauthorized\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"VehicleNotPaired\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"aftermarketDeviceAddress\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceAddressReset\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"AftermarketDeviceAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"AftermarketDeviceAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceClaimed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceNodeBurned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"aftermarketDeviceAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceNodeMinted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"AftermarketDeviceUnpaired\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addAftermarketDeviceAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNodeId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"internalType\":\"structAftermarketDeviceOwnerPair[]\",\"name\":\"adOwnerPair\",\"type\":\"tuple[]\"}],\"name\":\"claimAftermarketDeviceBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"ownerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"aftermarketDeviceSig\",\"type\":\"bytes\"}],\"name\":\"claimAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"getAftermarketDeviceAddressById\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"getAftermarketDeviceIdByAddress\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"isAftermarketDeviceClaimed\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"isClaimed\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairs\",\"type\":\"tuple[]\"}],\"internalType\":\"structAftermarketDeviceInfos[]\",\"name\":\"adInfos\",\"type\":\"tuple[]\"}],\"name\":\"mintAftermarketDeviceByManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"aftermarketDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"}],\"name\":\"pairAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"pairAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"aftermarketDeviceNodeList\",\"type\":\"uint256[]\"}],\"name\":\"reprovisionAftermarketDeviceByManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNodeId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"deviceAddress\",\"type\":\"address\"}],\"internalType\":\"structAftermarketDeviceIdAddressPair[]\",\"name\":\"adIdAddrs\",\"type\":\"tuple[]\"}],\"name\":\"resetAftermarketDeviceAddressByManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setAftermarketDeviceIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"setAftermarketDeviceInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"}],\"name\":\"unpairAftermarketDevice\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"unpairAftermarketDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"controller\",\"type\":\"address\"}],\"name\":\"ControllerSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"ManufacturerAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"ManufacturerAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"ManufacturerIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"ManufacturerNodeMinted\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addManufacturerAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"name\":\"getManufacturerIdByName\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getManufacturerNameById\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isAllowedToOwnManufacturerNode\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isAllowed\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isController\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isController\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isManufacturerMinted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isManufacturerMinted\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairList\",\"type\":\"tuple[]\"}],\"name\":\"mintManufacturer\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string[]\",\"name\":\"names\",\"type\":\"string[]\"}],\"name\":\"mintManufacturerBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_controller\",\"type\":\"address\"}],\"name\":\"setController\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setManufacturerIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoList\",\"type\":\"tuple[]\"}],\"name\":\"setManufacturerInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"updateManufacturerMinted\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"AlreadyController\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"name\":\"IntegrationNameRegisterd\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"MustBeAdmin\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"NotAllowed\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"OnlyNftProxy\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"IntegrationAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"IntegrationAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"IntegrationIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"IntegrationNodeMinted\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addIntegrationAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"name\":\"getIntegrationIdByName\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getIntegrationNameById\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isAllowedToOwnIntegrationNode\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isAllowed\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isIntegrationController\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isController\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"isIntegrationMinted\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"_isIntegrationMinted\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"name\",\"type\":\"string\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairList\",\"type\":\"tuple[]\"}],\"name\":\"mintIntegration\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string[]\",\"name\":\"names\",\"type\":\"string[]\"}],\"name\":\"mintIntegrationBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_controller\",\"type\":\"address\"}],\"name\":\"setIntegrationController\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setIntegrationIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoList\",\"type\":\"tuple[]\"}],\"name\":\"setIntegrationInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"updateIntegrationMinted\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"InvalidSdSignature\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"SyntheticDeviceAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"SyntheticDeviceAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"SyntheticDeviceIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"syntheticDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"SyntheticDeviceNodeBurned\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"integrationNode\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"syntheticDeviceNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"syntheticDeviceAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"SyntheticDeviceNodeMinted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"name\":\"VehicleAttributeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"VehicleNodeMinted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"deviceDefinitionId\",\"type\":\"string\"}],\"name\":\"VehicleNodeMintedWithDeviceDefinition\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addSyntheticDeviceAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"syntheticDeviceNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"ownerSig\",\"type\":\"bytes\"}],\"name\":\"burnSyntheticDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"getSyntheticDeviceAddressById\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"getSyntheticDeviceIdByAddress\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"integrationNode\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairs\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintSyntheticDeviceBatchInput[]\",\"name\":\"data\",\"type\":\"tuple[]\"}],\"name\":\"mintSyntheticDeviceBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"integrationNode\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairs\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintSyntheticDeviceInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"mintSyntheticDeviceSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setSyntheticDeviceIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"setSyntheticDeviceInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"VehicleAttributeAdded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"proxy\",\"type\":\"address\"}],\"name\":\"VehicleIdProxySet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleNode\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"VehicleNodeBurned\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"addVehicleAttribute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"ownerSig\",\"type\":\"bytes\"}],\"name\":\"burnVehicleSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"getDeviceDefinitionIdByVehicleId\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"ddId\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"mintVehicle\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"mintVehicleSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"deviceDefinitionId\",\"type\":\"string\"}],\"name\":\"mintVehicleWithDeviceDefinition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"deviceDefinitionId\",\"type\":\"string\"},{\"internalType\":\"bytes\",\"name\":\"signature\",\"type\":\"bytes\"}],\"name\":\"mintVehicleWithDeviceDefinitionSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setVehicleIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfo\",\"type\":\"tuple[]\"}],\"name\":\"setVehicleInfo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"validateBurnAndResetNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getDataURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"data\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"}],\"name\":\"getInfo\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getParentNode\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"parentNode\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"beneficiary\",\"type\":\"address\"}],\"name\":\"BeneficiarySet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"}],\"name\":\"getBeneficiary\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"beneficiary\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"sourceNode\",\"type\":\"uint256\"}],\"name\":\"getLink\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"targetNode\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddressSource\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"idProxyAddressTarget\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"sourceNode\",\"type\":\"uint256\"}],\"name\":\"getNodeLink\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"targetNode\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"nodeId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"beneficiary\",\"type\":\"address\"}],\"name\":\"setAftermarketDeviceBeneficiary\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsVehicle\",\"type\":\"tuple[]\"},{\"internalType\":\"uint256\",\"name\":\"integrationNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintVehicleAndSdInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"mintVehicleAndSdSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerNode\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"deviceDefinitionId\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"integrationNode\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"vehicleOwnerSig\",\"type\":\"bytes\"},{\"internalType\":\"bytes\",\"name\":\"syntheticDeviceSig\",\"type\":\"bytes\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceAddr\",\"type\":\"address\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"attribute\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"info\",\"type\":\"string\"}],\"internalType\":\"structAttributeInfoPair[]\",\"name\":\"attrInfoPairsDevice\",\"type\":\"tuple[]\"}],\"internalType\":\"structMintVehicleAndSdWithDdInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"mintVehicleAndSdWithDeviceDefinitionSign\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"dataUri\",\"type\":\"string\"}],\"name\":\"BaseDataURISet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxyAddress\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"_baseDataURI\",\"type\":\"string\"}],\"name\":\"setBaseDataURI\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"dimoStreamrEns\",\"type\":\"string\"}],\"name\":\"DimoStreamrEnsSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"dimoStreamrNode\",\"type\":\"address\"}],\"name\":\"DimoStreamrNodeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"streamRegistry\",\"type\":\"address\"}],\"name\":\"StreamRegistrySet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"dimoStreamrEns\",\"type\":\"string\"}],\"name\":\"setDimoBaseStreamId\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"dimoStreamrNode\",\"type\":\"address\"}],\"name\":\"setDimoStreamrNode\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"streamRegistry\",\"type\":\"address\"}],\"name\":\"setStreamRegistry\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"enumIStreamRegistry.PermissionType\",\"name\":\"permissionType\",\"type\":\"uint8\"}],\"name\":\"NoStreamrPermission\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"StreamDoesNotExist\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"VehicleStreamAlreadySet\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"VehicleStreamNotSet\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"SubscribedToVehicleStream\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"VehicleStreamSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"VehicleStreamUnset\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"createVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"getVehicleStream\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"onBurnVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"onSetSubscribePrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"onTransferVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"subscriber\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"setSubscriptionToVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"streamId\",\"type\":\"string\"}],\"name\":\"setVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expirationTime\",\"type\":\"uint256\"}],\"name\":\"subscribeToVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"}],\"name\":\"unsetVehicleStream\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"chainid\",\"type\":\"uint256\"}],\"name\":\"ChainNotSupported\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"InvalidManufacturerId\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"TableAlreadyExists\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"TableDoesNotExist\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"}],\"name\":\"Unauthorized\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"model\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"year\",\"type\":\"uint256\"}],\"name\":\"DeviceDefinitionInserted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"tableOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"DeviceDefinitionTableCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"ManufacturerTableSet\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"tableOwner\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"createDeviceDefinitionTable\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"getDeviceDefinitionTableId\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"}],\"name\":\"getDeviceDefinitionTableName\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"tableName\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"model\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"year\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ksuid\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"devicetype\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"imageuri\",\"type\":\"string\"}],\"internalType\":\"structDeviceDefinitionInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"insertDeviceDefinition\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"model\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"year\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ksuid\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"devicetype\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"imageuri\",\"type\":\"string\"}],\"internalType\":\"structDeviceDefinitionInput[]\",\"name\":\"data\",\"type\":\"tuple[]\"}],\"name\":\"insertDeviceDefinitionBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"contractTablelandTablesImpl\",\"name\":\"tablelandTables\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"string\",\"name\":\"id\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"model\",\"type\":\"string\"},{\"internalType\":\"uint256\",\"name\":\"year\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"metadata\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"ksuid\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"devicetype\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"imageuri\",\"type\":\"string\"}],\"internalType\":\"structDeviceDefinitionInput\",\"name\":\"data\",\"type\":\"tuple\"}],\"name\":\"insertDeviceDefinitionData\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"manufacturerId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"tableId\",\"type\":\"uint256\"}],\"name\":\"setDeviceDefinitionTable\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"getPolicy\",\"outputs\":[{\"components\":[{\"internalType\":\"bool\",\"name\":\"allowInsert\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"allowUpdate\",\"type\":\"bool\"},{\"internalType\":\"bool\",\"name\":\"allowDelete\",\"type\":\"bool\"},{\"internalType\":\"string\",\"name\":\"whereClause\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"withCheck\",\"type\":\"string\"},{\"internalType\":\"string[]\",\"name\":\"updatableColumns\",\"type\":\"string[]\"}],\"internalType\":\"structTablelandPolicy\",\"name\":\"policy\",\"type\":\"tuple\"}],\"stateMutability\":\"payable\",\"type\":\"function\"}]",
}

// RegistryABI is the input ABI used to generate the binding from.
// Deprecated: Use RegistryMetaData.ABI instead.
var RegistryABI = RegistryMetaData.ABI

// Registry is an auto generated Go binding around an Ethereum contract.
type Registry struct {
	RegistryCaller     // Read-only binding to the contract
	RegistryTransactor // Write-only binding to the contract
	RegistryFilterer   // Log filterer for contract events
}

// RegistryCaller is an auto generated read-only Go binding around an Ethereum contract.
type RegistryCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RegistryTransactor is an auto generated write-only Go binding around an Ethereum contract.
type RegistryTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RegistryFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type RegistryFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// RegistrySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type RegistrySession struct {
	Contract     *Registry         // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// RegistryCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type RegistryCallerSession struct {
	Contract *RegistryCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts   // Call options to use throughout this session
}

// RegistryTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type RegistryTransactorSession struct {
	Contract     *RegistryTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts   // Transaction auth options to use throughout this session
}

// RegistryRaw is an auto generated low-level Go binding around an Ethereum contract.
type RegistryRaw struct {
	Contract *Registry // Generic contract binding to access the raw methods on
}

// RegistryCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type RegistryCallerRaw struct {
	Contract *RegistryCaller // Generic read-only contract binding to access the raw methods on
}

// RegistryTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type RegistryTransactorRaw struct {
	Contract *RegistryTransactor // Generic write-only contract binding to access the raw methods on
}

// NewRegistry creates a new instance of Registry, bound to a specific deployed contract.
func NewRegistry(address common.Address, backend bind.ContractBackend) (*Registry, error) {
	contract, err := bindRegistry(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Registry{RegistryCaller: RegistryCaller{contract: contract}, RegistryTransactor: RegistryTransactor{contract: contract}, RegistryFilterer: RegistryFilterer{contract: contract}}, nil
}

// NewRegistryCaller creates a new read-only instance of Registry, bound to a specific deployed contract.
func NewRegistryCaller(address common.Address, caller bind.ContractCaller) (*RegistryCaller, error) {
	contract, err := bindRegistry(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &RegistryCaller{contract: contract}, nil
}

// NewRegistryTransactor creates a new write-only instance of Registry, bound to a specific deployed contract.
func NewRegistryTransactor(address common.Address, transactor bind.ContractTransactor) (*RegistryTransactor, error) {
	contract, err := bindRegistry(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &RegistryTransactor{contract: contract}, nil
}

// NewRegistryFilterer creates a new log filterer instance of Registry, bound to a specific deployed contract.
func NewRegistryFilterer(address common.Address, filterer bind.ContractFilterer) (*RegistryFilterer, error) {
	contract, err := bindRegistry(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &RegistryFilterer{contract: contract}, nil
}

// bindRegistry binds a generic wrapper to an already deployed contract.
func bindRegistry(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := RegistryMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Registry *RegistryRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Registry.Contract.RegistryCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Registry *RegistryRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Registry.Contract.RegistryTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Registry *RegistryRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Registry.Contract.RegistryTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Registry *RegistryCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Registry.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Registry *RegistryTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Registry.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Registry *RegistryTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Registry.Contract.contract.Transact(opts, method, params...)
}

// GetAdMintCost is a free data retrieval call binding the contract method 0x46946743.
//
// Solidity: function getAdMintCost() view returns(uint256 adMintCost)
func (_Registry *RegistryCaller) GetAdMintCost(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getAdMintCost")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetAdMintCost is a free data retrieval call binding the contract method 0x46946743.
//
// Solidity: function getAdMintCost() view returns(uint256 adMintCost)
func (_Registry *RegistrySession) GetAdMintCost() (*big.Int, error) {
	return _Registry.Contract.GetAdMintCost(&_Registry.CallOpts)
}

// GetAdMintCost is a free data retrieval call binding the contract method 0x46946743.
//
// Solidity: function getAdMintCost() view returns(uint256 adMintCost)
func (_Registry *RegistryCallerSession) GetAdMintCost() (*big.Int, error) {
	return _Registry.Contract.GetAdMintCost(&_Registry.CallOpts)
}

// GetAftermarketDeviceAddressById is a free data retrieval call binding the contract method 0x682a25e3.
//
// Solidity: function getAftermarketDeviceAddressById(uint256 nodeId) view returns(address addr)
func (_Registry *RegistryCaller) GetAftermarketDeviceAddressById(opts *bind.CallOpts, nodeId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getAftermarketDeviceAddressById", nodeId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetAftermarketDeviceAddressById is a free data retrieval call binding the contract method 0x682a25e3.
//
// Solidity: function getAftermarketDeviceAddressById(uint256 nodeId) view returns(address addr)
func (_Registry *RegistrySession) GetAftermarketDeviceAddressById(nodeId *big.Int) (common.Address, error) {
	return _Registry.Contract.GetAftermarketDeviceAddressById(&_Registry.CallOpts, nodeId)
}

// GetAftermarketDeviceAddressById is a free data retrieval call binding the contract method 0x682a25e3.
//
// Solidity: function getAftermarketDeviceAddressById(uint256 nodeId) view returns(address addr)
func (_Registry *RegistryCallerSession) GetAftermarketDeviceAddressById(nodeId *big.Int) (common.Address, error) {
	return _Registry.Contract.GetAftermarketDeviceAddressById(&_Registry.CallOpts, nodeId)
}

// GetAftermarketDeviceIdByAddress is a free data retrieval call binding the contract method 0x9796cf22.
//
// Solidity: function getAftermarketDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (_Registry *RegistryCaller) GetAftermarketDeviceIdByAddress(opts *bind.CallOpts, addr common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getAftermarketDeviceIdByAddress", addr)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetAftermarketDeviceIdByAddress is a free data retrieval call binding the contract method 0x9796cf22.
//
// Solidity: function getAftermarketDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (_Registry *RegistrySession) GetAftermarketDeviceIdByAddress(addr common.Address) (*big.Int, error) {
	return _Registry.Contract.GetAftermarketDeviceIdByAddress(&_Registry.CallOpts, addr)
}

// GetAftermarketDeviceIdByAddress is a free data retrieval call binding the contract method 0x9796cf22.
//
// Solidity: function getAftermarketDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (_Registry *RegistryCallerSession) GetAftermarketDeviceIdByAddress(addr common.Address) (*big.Int, error) {
	return _Registry.Contract.GetAftermarketDeviceIdByAddress(&_Registry.CallOpts, addr)
}

// GetBeneficiary is a free data retrieval call binding the contract method 0x0a6cef46.
//
// Solidity: function getBeneficiary(address idProxyAddress, uint256 nodeId) view returns(address beneficiary)
func (_Registry *RegistryCaller) GetBeneficiary(opts *bind.CallOpts, idProxyAddress common.Address, nodeId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getBeneficiary", idProxyAddress, nodeId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetBeneficiary is a free data retrieval call binding the contract method 0x0a6cef46.
//
// Solidity: function getBeneficiary(address idProxyAddress, uint256 nodeId) view returns(address beneficiary)
func (_Registry *RegistrySession) GetBeneficiary(idProxyAddress common.Address, nodeId *big.Int) (common.Address, error) {
	return _Registry.Contract.GetBeneficiary(&_Registry.CallOpts, idProxyAddress, nodeId)
}

// GetBeneficiary is a free data retrieval call binding the contract method 0x0a6cef46.
//
// Solidity: function getBeneficiary(address idProxyAddress, uint256 nodeId) view returns(address beneficiary)
func (_Registry *RegistryCallerSession) GetBeneficiary(idProxyAddress common.Address, nodeId *big.Int) (common.Address, error) {
	return _Registry.Contract.GetBeneficiary(&_Registry.CallOpts, idProxyAddress, nodeId)
}

// GetDataURI is a free data retrieval call binding the contract method 0xbc60a6ba.
//
// Solidity: function getDataURI(address idProxyAddress, uint256 tokenId) view returns(string data)
func (_Registry *RegistryCaller) GetDataURI(opts *bind.CallOpts, idProxyAddress common.Address, tokenId *big.Int) (string, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getDataURI", idProxyAddress, tokenId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetDataURI is a free data retrieval call binding the contract method 0xbc60a6ba.
//
// Solidity: function getDataURI(address idProxyAddress, uint256 tokenId) view returns(string data)
func (_Registry *RegistrySession) GetDataURI(idProxyAddress common.Address, tokenId *big.Int) (string, error) {
	return _Registry.Contract.GetDataURI(&_Registry.CallOpts, idProxyAddress, tokenId)
}

// GetDataURI is a free data retrieval call binding the contract method 0xbc60a6ba.
//
// Solidity: function getDataURI(address idProxyAddress, uint256 tokenId) view returns(string data)
func (_Registry *RegistryCallerSession) GetDataURI(idProxyAddress common.Address, tokenId *big.Int) (string, error) {
	return _Registry.Contract.GetDataURI(&_Registry.CallOpts, idProxyAddress, tokenId)
}

// GetDeviceDefinitionIdByVehicleId is a free data retrieval call binding the contract method 0xb7bded95.
//
// Solidity: function getDeviceDefinitionIdByVehicleId(uint256 vehicleId) view returns(string ddId)
func (_Registry *RegistryCaller) GetDeviceDefinitionIdByVehicleId(opts *bind.CallOpts, vehicleId *big.Int) (string, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getDeviceDefinitionIdByVehicleId", vehicleId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetDeviceDefinitionIdByVehicleId is a free data retrieval call binding the contract method 0xb7bded95.
//
// Solidity: function getDeviceDefinitionIdByVehicleId(uint256 vehicleId) view returns(string ddId)
func (_Registry *RegistrySession) GetDeviceDefinitionIdByVehicleId(vehicleId *big.Int) (string, error) {
	return _Registry.Contract.GetDeviceDefinitionIdByVehicleId(&_Registry.CallOpts, vehicleId)
}

// GetDeviceDefinitionIdByVehicleId is a free data retrieval call binding the contract method 0xb7bded95.
//
// Solidity: function getDeviceDefinitionIdByVehicleId(uint256 vehicleId) view returns(string ddId)
func (_Registry *RegistryCallerSession) GetDeviceDefinitionIdByVehicleId(vehicleId *big.Int) (string, error) {
	return _Registry.Contract.GetDeviceDefinitionIdByVehicleId(&_Registry.CallOpts, vehicleId)
}

// GetDeviceDefinitionTableId is a free data retrieval call binding the contract method 0x396e5987.
//
// Solidity: function getDeviceDefinitionTableId(uint256 manufacturerId) view returns(uint256 tableId)
func (_Registry *RegistryCaller) GetDeviceDefinitionTableId(opts *bind.CallOpts, manufacturerId *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getDeviceDefinitionTableId", manufacturerId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetDeviceDefinitionTableId is a free data retrieval call binding the contract method 0x396e5987.
//
// Solidity: function getDeviceDefinitionTableId(uint256 manufacturerId) view returns(uint256 tableId)
func (_Registry *RegistrySession) GetDeviceDefinitionTableId(manufacturerId *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetDeviceDefinitionTableId(&_Registry.CallOpts, manufacturerId)
}

// GetDeviceDefinitionTableId is a free data retrieval call binding the contract method 0x396e5987.
//
// Solidity: function getDeviceDefinitionTableId(uint256 manufacturerId) view returns(uint256 tableId)
func (_Registry *RegistryCallerSession) GetDeviceDefinitionTableId(manufacturerId *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetDeviceDefinitionTableId(&_Registry.CallOpts, manufacturerId)
}

// GetDeviceDefinitionTableName is a free data retrieval call binding the contract method 0xa1d17941.
//
// Solidity: function getDeviceDefinitionTableName(uint256 manufacturerId) view returns(string tableName)
func (_Registry *RegistryCaller) GetDeviceDefinitionTableName(opts *bind.CallOpts, manufacturerId *big.Int) (string, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getDeviceDefinitionTableName", manufacturerId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetDeviceDefinitionTableName is a free data retrieval call binding the contract method 0xa1d17941.
//
// Solidity: function getDeviceDefinitionTableName(uint256 manufacturerId) view returns(string tableName)
func (_Registry *RegistrySession) GetDeviceDefinitionTableName(manufacturerId *big.Int) (string, error) {
	return _Registry.Contract.GetDeviceDefinitionTableName(&_Registry.CallOpts, manufacturerId)
}

// GetDeviceDefinitionTableName is a free data retrieval call binding the contract method 0xa1d17941.
//
// Solidity: function getDeviceDefinitionTableName(uint256 manufacturerId) view returns(string tableName)
func (_Registry *RegistryCallerSession) GetDeviceDefinitionTableName(manufacturerId *big.Int) (string, error) {
	return _Registry.Contract.GetDeviceDefinitionTableName(&_Registry.CallOpts, manufacturerId)
}

// GetInfo is a free data retrieval call binding the contract method 0xdce2f860.
//
// Solidity: function getInfo(address idProxyAddress, uint256 tokenId, string attribute) view returns(string info)
func (_Registry *RegistryCaller) GetInfo(opts *bind.CallOpts, idProxyAddress common.Address, tokenId *big.Int, attribute string) (string, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getInfo", idProxyAddress, tokenId, attribute)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetInfo is a free data retrieval call binding the contract method 0xdce2f860.
//
// Solidity: function getInfo(address idProxyAddress, uint256 tokenId, string attribute) view returns(string info)
func (_Registry *RegistrySession) GetInfo(idProxyAddress common.Address, tokenId *big.Int, attribute string) (string, error) {
	return _Registry.Contract.GetInfo(&_Registry.CallOpts, idProxyAddress, tokenId, attribute)
}

// GetInfo is a free data retrieval call binding the contract method 0xdce2f860.
//
// Solidity: function getInfo(address idProxyAddress, uint256 tokenId, string attribute) view returns(string info)
func (_Registry *RegistryCallerSession) GetInfo(idProxyAddress common.Address, tokenId *big.Int, attribute string) (string, error) {
	return _Registry.Contract.GetInfo(&_Registry.CallOpts, idProxyAddress, tokenId, attribute)
}

// GetIntegrationIdByName is a free data retrieval call binding the contract method 0x714b7cfb.
//
// Solidity: function getIntegrationIdByName(string name) view returns(uint256 nodeId)
func (_Registry *RegistryCaller) GetIntegrationIdByName(opts *bind.CallOpts, name string) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getIntegrationIdByName", name)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetIntegrationIdByName is a free data retrieval call binding the contract method 0x714b7cfb.
//
// Solidity: function getIntegrationIdByName(string name) view returns(uint256 nodeId)
func (_Registry *RegistrySession) GetIntegrationIdByName(name string) (*big.Int, error) {
	return _Registry.Contract.GetIntegrationIdByName(&_Registry.CallOpts, name)
}

// GetIntegrationIdByName is a free data retrieval call binding the contract method 0x714b7cfb.
//
// Solidity: function getIntegrationIdByName(string name) view returns(uint256 nodeId)
func (_Registry *RegistryCallerSession) GetIntegrationIdByName(name string) (*big.Int, error) {
	return _Registry.Contract.GetIntegrationIdByName(&_Registry.CallOpts, name)
}

// GetIntegrationNameById is a free data retrieval call binding the contract method 0x123141bd.
//
// Solidity: function getIntegrationNameById(uint256 tokenId) view returns(string name)
func (_Registry *RegistryCaller) GetIntegrationNameById(opts *bind.CallOpts, tokenId *big.Int) (string, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getIntegrationNameById", tokenId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetIntegrationNameById is a free data retrieval call binding the contract method 0x123141bd.
//
// Solidity: function getIntegrationNameById(uint256 tokenId) view returns(string name)
func (_Registry *RegistrySession) GetIntegrationNameById(tokenId *big.Int) (string, error) {
	return _Registry.Contract.GetIntegrationNameById(&_Registry.CallOpts, tokenId)
}

// GetIntegrationNameById is a free data retrieval call binding the contract method 0x123141bd.
//
// Solidity: function getIntegrationNameById(uint256 tokenId) view returns(string name)
func (_Registry *RegistryCallerSession) GetIntegrationNameById(tokenId *big.Int) (string, error) {
	return _Registry.Contract.GetIntegrationNameById(&_Registry.CallOpts, tokenId)
}

// GetLink is a free data retrieval call binding the contract method 0x112e62a2.
//
// Solidity: function getLink(address idProxyAddress, uint256 sourceNode) view returns(uint256 targetNode)
func (_Registry *RegistryCaller) GetLink(opts *bind.CallOpts, idProxyAddress common.Address, sourceNode *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getLink", idProxyAddress, sourceNode)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetLink is a free data retrieval call binding the contract method 0x112e62a2.
//
// Solidity: function getLink(address idProxyAddress, uint256 sourceNode) view returns(uint256 targetNode)
func (_Registry *RegistrySession) GetLink(idProxyAddress common.Address, sourceNode *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetLink(&_Registry.CallOpts, idProxyAddress, sourceNode)
}

// GetLink is a free data retrieval call binding the contract method 0x112e62a2.
//
// Solidity: function getLink(address idProxyAddress, uint256 sourceNode) view returns(uint256 targetNode)
func (_Registry *RegistryCallerSession) GetLink(idProxyAddress common.Address, sourceNode *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetLink(&_Registry.CallOpts, idProxyAddress, sourceNode)
}

// GetManufacturerIdByName is a free data retrieval call binding the contract method 0xce55aab0.
//
// Solidity: function getManufacturerIdByName(string name) view returns(uint256 nodeId)
func (_Registry *RegistryCaller) GetManufacturerIdByName(opts *bind.CallOpts, name string) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getManufacturerIdByName", name)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetManufacturerIdByName is a free data retrieval call binding the contract method 0xce55aab0.
//
// Solidity: function getManufacturerIdByName(string name) view returns(uint256 nodeId)
func (_Registry *RegistrySession) GetManufacturerIdByName(name string) (*big.Int, error) {
	return _Registry.Contract.GetManufacturerIdByName(&_Registry.CallOpts, name)
}

// GetManufacturerIdByName is a free data retrieval call binding the contract method 0xce55aab0.
//
// Solidity: function getManufacturerIdByName(string name) view returns(uint256 nodeId)
func (_Registry *RegistryCallerSession) GetManufacturerIdByName(name string) (*big.Int, error) {
	return _Registry.Contract.GetManufacturerIdByName(&_Registry.CallOpts, name)
}

// GetManufacturerNameById is a free data retrieval call binding the contract method 0x9109b30b.
//
// Solidity: function getManufacturerNameById(uint256 tokenId) view returns(string name)
func (_Registry *RegistryCaller) GetManufacturerNameById(opts *bind.CallOpts, tokenId *big.Int) (string, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getManufacturerNameById", tokenId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetManufacturerNameById is a free data retrieval call binding the contract method 0x9109b30b.
//
// Solidity: function getManufacturerNameById(uint256 tokenId) view returns(string name)
func (_Registry *RegistrySession) GetManufacturerNameById(tokenId *big.Int) (string, error) {
	return _Registry.Contract.GetManufacturerNameById(&_Registry.CallOpts, tokenId)
}

// GetManufacturerNameById is a free data retrieval call binding the contract method 0x9109b30b.
//
// Solidity: function getManufacturerNameById(uint256 tokenId) view returns(string name)
func (_Registry *RegistryCallerSession) GetManufacturerNameById(tokenId *big.Int) (string, error) {
	return _Registry.Contract.GetManufacturerNameById(&_Registry.CallOpts, tokenId)
}

// GetNodeLink is a free data retrieval call binding the contract method 0xbd2b5568.
//
// Solidity: function getNodeLink(address idProxyAddressSource, address idProxyAddressTarget, uint256 sourceNode) view returns(uint256 targetNode)
func (_Registry *RegistryCaller) GetNodeLink(opts *bind.CallOpts, idProxyAddressSource common.Address, idProxyAddressTarget common.Address, sourceNode *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getNodeLink", idProxyAddressSource, idProxyAddressTarget, sourceNode)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetNodeLink is a free data retrieval call binding the contract method 0xbd2b5568.
//
// Solidity: function getNodeLink(address idProxyAddressSource, address idProxyAddressTarget, uint256 sourceNode) view returns(uint256 targetNode)
func (_Registry *RegistrySession) GetNodeLink(idProxyAddressSource common.Address, idProxyAddressTarget common.Address, sourceNode *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetNodeLink(&_Registry.CallOpts, idProxyAddressSource, idProxyAddressTarget, sourceNode)
}

// GetNodeLink is a free data retrieval call binding the contract method 0xbd2b5568.
//
// Solidity: function getNodeLink(address idProxyAddressSource, address idProxyAddressTarget, uint256 sourceNode) view returns(uint256 targetNode)
func (_Registry *RegistryCallerSession) GetNodeLink(idProxyAddressSource common.Address, idProxyAddressTarget common.Address, sourceNode *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetNodeLink(&_Registry.CallOpts, idProxyAddressSource, idProxyAddressTarget, sourceNode)
}

// GetParentNode is a free data retrieval call binding the contract method 0x82087d24.
//
// Solidity: function getParentNode(address idProxyAddress, uint256 tokenId) view returns(uint256 parentNode)
func (_Registry *RegistryCaller) GetParentNode(opts *bind.CallOpts, idProxyAddress common.Address, tokenId *big.Int) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getParentNode", idProxyAddress, tokenId)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetParentNode is a free data retrieval call binding the contract method 0x82087d24.
//
// Solidity: function getParentNode(address idProxyAddress, uint256 tokenId) view returns(uint256 parentNode)
func (_Registry *RegistrySession) GetParentNode(idProxyAddress common.Address, tokenId *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetParentNode(&_Registry.CallOpts, idProxyAddress, tokenId)
}

// GetParentNode is a free data retrieval call binding the contract method 0x82087d24.
//
// Solidity: function getParentNode(address idProxyAddress, uint256 tokenId) view returns(uint256 parentNode)
func (_Registry *RegistryCallerSession) GetParentNode(idProxyAddress common.Address, tokenId *big.Int) (*big.Int, error) {
	return _Registry.Contract.GetParentNode(&_Registry.CallOpts, idProxyAddress, tokenId)
}

// GetRoleAdmin is a free data retrieval call binding the contract method 0x248a9ca3.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (_Registry *RegistryCaller) GetRoleAdmin(opts *bind.CallOpts, role [32]byte) ([32]byte, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getRoleAdmin", role)

	if err != nil {
		return *new([32]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)

	return out0, err

}

// GetRoleAdmin is a free data retrieval call binding the contract method 0x248a9ca3.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (_Registry *RegistrySession) GetRoleAdmin(role [32]byte) ([32]byte, error) {
	return _Registry.Contract.GetRoleAdmin(&_Registry.CallOpts, role)
}

// GetRoleAdmin is a free data retrieval call binding the contract method 0x248a9ca3.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (_Registry *RegistryCallerSession) GetRoleAdmin(role [32]byte) ([32]byte, error) {
	return _Registry.Contract.GetRoleAdmin(&_Registry.CallOpts, role)
}

// GetSyntheticDeviceAddressById is a free data retrieval call binding the contract method 0x493b27e1.
//
// Solidity: function getSyntheticDeviceAddressById(uint256 nodeId) view returns(address addr)
func (_Registry *RegistryCaller) GetSyntheticDeviceAddressById(opts *bind.CallOpts, nodeId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getSyntheticDeviceAddressById", nodeId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// GetSyntheticDeviceAddressById is a free data retrieval call binding the contract method 0x493b27e1.
//
// Solidity: function getSyntheticDeviceAddressById(uint256 nodeId) view returns(address addr)
func (_Registry *RegistrySession) GetSyntheticDeviceAddressById(nodeId *big.Int) (common.Address, error) {
	return _Registry.Contract.GetSyntheticDeviceAddressById(&_Registry.CallOpts, nodeId)
}

// GetSyntheticDeviceAddressById is a free data retrieval call binding the contract method 0x493b27e1.
//
// Solidity: function getSyntheticDeviceAddressById(uint256 nodeId) view returns(address addr)
func (_Registry *RegistryCallerSession) GetSyntheticDeviceAddressById(nodeId *big.Int) (common.Address, error) {
	return _Registry.Contract.GetSyntheticDeviceAddressById(&_Registry.CallOpts, nodeId)
}

// GetSyntheticDeviceIdByAddress is a free data retrieval call binding the contract method 0x795b910a.
//
// Solidity: function getSyntheticDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (_Registry *RegistryCaller) GetSyntheticDeviceIdByAddress(opts *bind.CallOpts, addr common.Address) (*big.Int, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getSyntheticDeviceIdByAddress", addr)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetSyntheticDeviceIdByAddress is a free data retrieval call binding the contract method 0x795b910a.
//
// Solidity: function getSyntheticDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (_Registry *RegistrySession) GetSyntheticDeviceIdByAddress(addr common.Address) (*big.Int, error) {
	return _Registry.Contract.GetSyntheticDeviceIdByAddress(&_Registry.CallOpts, addr)
}

// GetSyntheticDeviceIdByAddress is a free data retrieval call binding the contract method 0x795b910a.
//
// Solidity: function getSyntheticDeviceIdByAddress(address addr) view returns(uint256 nodeId)
func (_Registry *RegistryCallerSession) GetSyntheticDeviceIdByAddress(addr common.Address) (*big.Int, error) {
	return _Registry.Contract.GetSyntheticDeviceIdByAddress(&_Registry.CallOpts, addr)
}

// GetVehicleStream is a free data retrieval call binding the contract method 0x180e469a.
//
// Solidity: function getVehicleStream(uint256 vehicleId) view returns(string streamId)
func (_Registry *RegistryCaller) GetVehicleStream(opts *bind.CallOpts, vehicleId *big.Int) (string, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "getVehicleStream", vehicleId)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetVehicleStream is a free data retrieval call binding the contract method 0x180e469a.
//
// Solidity: function getVehicleStream(uint256 vehicleId) view returns(string streamId)
func (_Registry *RegistrySession) GetVehicleStream(vehicleId *big.Int) (string, error) {
	return _Registry.Contract.GetVehicleStream(&_Registry.CallOpts, vehicleId)
}

// GetVehicleStream is a free data retrieval call binding the contract method 0x180e469a.
//
// Solidity: function getVehicleStream(uint256 vehicleId) view returns(string streamId)
func (_Registry *RegistryCallerSession) GetVehicleStream(vehicleId *big.Int) (string, error) {
	return _Registry.Contract.GetVehicleStream(&_Registry.CallOpts, vehicleId)
}

// HasRole is a free data retrieval call binding the contract method 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (_Registry *RegistryCaller) HasRole(opts *bind.CallOpts, role [32]byte, account common.Address) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "hasRole", role, account)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// HasRole is a free data retrieval call binding the contract method 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (_Registry *RegistrySession) HasRole(role [32]byte, account common.Address) (bool, error) {
	return _Registry.Contract.HasRole(&_Registry.CallOpts, role, account)
}

// HasRole is a free data retrieval call binding the contract method 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (_Registry *RegistryCallerSession) HasRole(role [32]byte, account common.Address) (bool, error) {
	return _Registry.Contract.HasRole(&_Registry.CallOpts, role, account)
}

// IsAftermarketDeviceClaimed is a free data retrieval call binding the contract method 0xc6b36f2a.
//
// Solidity: function isAftermarketDeviceClaimed(uint256 nodeId) view returns(bool isClaimed)
func (_Registry *RegistryCaller) IsAftermarketDeviceClaimed(opts *bind.CallOpts, nodeId *big.Int) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "isAftermarketDeviceClaimed", nodeId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsAftermarketDeviceClaimed is a free data retrieval call binding the contract method 0xc6b36f2a.
//
// Solidity: function isAftermarketDeviceClaimed(uint256 nodeId) view returns(bool isClaimed)
func (_Registry *RegistrySession) IsAftermarketDeviceClaimed(nodeId *big.Int) (bool, error) {
	return _Registry.Contract.IsAftermarketDeviceClaimed(&_Registry.CallOpts, nodeId)
}

// IsAftermarketDeviceClaimed is a free data retrieval call binding the contract method 0xc6b36f2a.
//
// Solidity: function isAftermarketDeviceClaimed(uint256 nodeId) view returns(bool isClaimed)
func (_Registry *RegistryCallerSession) IsAftermarketDeviceClaimed(nodeId *big.Int) (bool, error) {
	return _Registry.Contract.IsAftermarketDeviceClaimed(&_Registry.CallOpts, nodeId)
}

// IsAllowedToOwnIntegrationNode is a free data retrieval call binding the contract method 0xbc8002f0.
//
// Solidity: function isAllowedToOwnIntegrationNode(address addr) view returns(bool _isAllowed)
func (_Registry *RegistryCaller) IsAllowedToOwnIntegrationNode(opts *bind.CallOpts, addr common.Address) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "isAllowedToOwnIntegrationNode", addr)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsAllowedToOwnIntegrationNode is a free data retrieval call binding the contract method 0xbc8002f0.
//
// Solidity: function isAllowedToOwnIntegrationNode(address addr) view returns(bool _isAllowed)
func (_Registry *RegistrySession) IsAllowedToOwnIntegrationNode(addr common.Address) (bool, error) {
	return _Registry.Contract.IsAllowedToOwnIntegrationNode(&_Registry.CallOpts, addr)
}

// IsAllowedToOwnIntegrationNode is a free data retrieval call binding the contract method 0xbc8002f0.
//
// Solidity: function isAllowedToOwnIntegrationNode(address addr) view returns(bool _isAllowed)
func (_Registry *RegistryCallerSession) IsAllowedToOwnIntegrationNode(addr common.Address) (bool, error) {
	return _Registry.Contract.IsAllowedToOwnIntegrationNode(&_Registry.CallOpts, addr)
}

// IsAllowedToOwnManufacturerNode is a free data retrieval call binding the contract method 0xd9c27c40.
//
// Solidity: function isAllowedToOwnManufacturerNode(address addr) view returns(bool _isAllowed)
func (_Registry *RegistryCaller) IsAllowedToOwnManufacturerNode(opts *bind.CallOpts, addr common.Address) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "isAllowedToOwnManufacturerNode", addr)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsAllowedToOwnManufacturerNode is a free data retrieval call binding the contract method 0xd9c27c40.
//
// Solidity: function isAllowedToOwnManufacturerNode(address addr) view returns(bool _isAllowed)
func (_Registry *RegistrySession) IsAllowedToOwnManufacturerNode(addr common.Address) (bool, error) {
	return _Registry.Contract.IsAllowedToOwnManufacturerNode(&_Registry.CallOpts, addr)
}

// IsAllowedToOwnManufacturerNode is a free data retrieval call binding the contract method 0xd9c27c40.
//
// Solidity: function isAllowedToOwnManufacturerNode(address addr) view returns(bool _isAllowed)
func (_Registry *RegistryCallerSession) IsAllowedToOwnManufacturerNode(addr common.Address) (bool, error) {
	return _Registry.Contract.IsAllowedToOwnManufacturerNode(&_Registry.CallOpts, addr)
}

// IsController is a free data retrieval call binding the contract method 0xb429afeb.
//
// Solidity: function isController(address addr) view returns(bool _isController)
func (_Registry *RegistryCaller) IsController(opts *bind.CallOpts, addr common.Address) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "isController", addr)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsController is a free data retrieval call binding the contract method 0xb429afeb.
//
// Solidity: function isController(address addr) view returns(bool _isController)
func (_Registry *RegistrySession) IsController(addr common.Address) (bool, error) {
	return _Registry.Contract.IsController(&_Registry.CallOpts, addr)
}

// IsController is a free data retrieval call binding the contract method 0xb429afeb.
//
// Solidity: function isController(address addr) view returns(bool _isController)
func (_Registry *RegistryCallerSession) IsController(addr common.Address) (bool, error) {
	return _Registry.Contract.IsController(&_Registry.CallOpts, addr)
}

// IsIntegrationController is a free data retrieval call binding the contract method 0xe21f68b7.
//
// Solidity: function isIntegrationController(address addr) view returns(bool _isController)
func (_Registry *RegistryCaller) IsIntegrationController(opts *bind.CallOpts, addr common.Address) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "isIntegrationController", addr)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsIntegrationController is a free data retrieval call binding the contract method 0xe21f68b7.
//
// Solidity: function isIntegrationController(address addr) view returns(bool _isController)
func (_Registry *RegistrySession) IsIntegrationController(addr common.Address) (bool, error) {
	return _Registry.Contract.IsIntegrationController(&_Registry.CallOpts, addr)
}

// IsIntegrationController is a free data retrieval call binding the contract method 0xe21f68b7.
//
// Solidity: function isIntegrationController(address addr) view returns(bool _isController)
func (_Registry *RegistryCallerSession) IsIntegrationController(addr common.Address) (bool, error) {
	return _Registry.Contract.IsIntegrationController(&_Registry.CallOpts, addr)
}

// IsIntegrationMinted is a free data retrieval call binding the contract method 0x603dd1db.
//
// Solidity: function isIntegrationMinted(address addr) view returns(bool _isIntegrationMinted)
func (_Registry *RegistryCaller) IsIntegrationMinted(opts *bind.CallOpts, addr common.Address) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "isIntegrationMinted", addr)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsIntegrationMinted is a free data retrieval call binding the contract method 0x603dd1db.
//
// Solidity: function isIntegrationMinted(address addr) view returns(bool _isIntegrationMinted)
func (_Registry *RegistrySession) IsIntegrationMinted(addr common.Address) (bool, error) {
	return _Registry.Contract.IsIntegrationMinted(&_Registry.CallOpts, addr)
}

// IsIntegrationMinted is a free data retrieval call binding the contract method 0x603dd1db.
//
// Solidity: function isIntegrationMinted(address addr) view returns(bool _isIntegrationMinted)
func (_Registry *RegistryCallerSession) IsIntegrationMinted(addr common.Address) (bool, error) {
	return _Registry.Contract.IsIntegrationMinted(&_Registry.CallOpts, addr)
}

// IsManufacturerMinted is a free data retrieval call binding the contract method 0x456bf169.
//
// Solidity: function isManufacturerMinted(address addr) view returns(bool _isManufacturerMinted)
func (_Registry *RegistryCaller) IsManufacturerMinted(opts *bind.CallOpts, addr common.Address) (bool, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "isManufacturerMinted", addr)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsManufacturerMinted is a free data retrieval call binding the contract method 0x456bf169.
//
// Solidity: function isManufacturerMinted(address addr) view returns(bool _isManufacturerMinted)
func (_Registry *RegistrySession) IsManufacturerMinted(addr common.Address) (bool, error) {
	return _Registry.Contract.IsManufacturerMinted(&_Registry.CallOpts, addr)
}

// IsManufacturerMinted is a free data retrieval call binding the contract method 0x456bf169.
//
// Solidity: function isManufacturerMinted(address addr) view returns(bool _isManufacturerMinted)
func (_Registry *RegistryCallerSession) IsManufacturerMinted(addr common.Address) (bool, error) {
	return _Registry.Contract.IsManufacturerMinted(&_Registry.CallOpts, addr)
}

// MultiStaticCall is a free data retrieval call binding the contract method 0x1c0c6e51.
//
// Solidity: function multiStaticCall(bytes[] data) view returns(bytes[] results)
func (_Registry *RegistryCaller) MultiStaticCall(opts *bind.CallOpts, data [][]byte) ([][]byte, error) {
	var out []interface{}
	err := _Registry.contract.Call(opts, &out, "multiStaticCall", data)

	if err != nil {
		return *new([][]byte), err
	}

	out0 := *abi.ConvertType(out[0], new([][]byte)).(*[][]byte)

	return out0, err

}

// MultiStaticCall is a free data retrieval call binding the contract method 0x1c0c6e51.
//
// Solidity: function multiStaticCall(bytes[] data) view returns(bytes[] results)
func (_Registry *RegistrySession) MultiStaticCall(data [][]byte) ([][]byte, error) {
	return _Registry.Contract.MultiStaticCall(&_Registry.CallOpts, data)
}

// MultiStaticCall is a free data retrieval call binding the contract method 0x1c0c6e51.
//
// Solidity: function multiStaticCall(bytes[] data) view returns(bytes[] results)
func (_Registry *RegistryCallerSession) MultiStaticCall(data [][]byte) ([][]byte, error) {
	return _Registry.Contract.MultiStaticCall(&_Registry.CallOpts, data)
}

// AddAftermarketDeviceAttribute is a paid mutator transaction binding the contract method 0x6111afa3.
//
// Solidity: function addAftermarketDeviceAttribute(string attribute) returns()
func (_Registry *RegistryTransactor) AddAftermarketDeviceAttribute(opts *bind.TransactOpts, attribute string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "addAftermarketDeviceAttribute", attribute)
}

// AddAftermarketDeviceAttribute is a paid mutator transaction binding the contract method 0x6111afa3.
//
// Solidity: function addAftermarketDeviceAttribute(string attribute) returns()
func (_Registry *RegistrySession) AddAftermarketDeviceAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddAftermarketDeviceAttribute(&_Registry.TransactOpts, attribute)
}

// AddAftermarketDeviceAttribute is a paid mutator transaction binding the contract method 0x6111afa3.
//
// Solidity: function addAftermarketDeviceAttribute(string attribute) returns()
func (_Registry *RegistryTransactorSession) AddAftermarketDeviceAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddAftermarketDeviceAttribute(&_Registry.TransactOpts, attribute)
}

// AddIntegrationAttribute is a paid mutator transaction binding the contract method 0x044d2498.
//
// Solidity: function addIntegrationAttribute(string attribute) returns()
func (_Registry *RegistryTransactor) AddIntegrationAttribute(opts *bind.TransactOpts, attribute string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "addIntegrationAttribute", attribute)
}

// AddIntegrationAttribute is a paid mutator transaction binding the contract method 0x044d2498.
//
// Solidity: function addIntegrationAttribute(string attribute) returns()
func (_Registry *RegistrySession) AddIntegrationAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddIntegrationAttribute(&_Registry.TransactOpts, attribute)
}

// AddIntegrationAttribute is a paid mutator transaction binding the contract method 0x044d2498.
//
// Solidity: function addIntegrationAttribute(string attribute) returns()
func (_Registry *RegistryTransactorSession) AddIntegrationAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddIntegrationAttribute(&_Registry.TransactOpts, attribute)
}

// AddManufacturerAttribute is a paid mutator transaction binding the contract method 0x50300a3f.
//
// Solidity: function addManufacturerAttribute(string attribute) returns()
func (_Registry *RegistryTransactor) AddManufacturerAttribute(opts *bind.TransactOpts, attribute string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "addManufacturerAttribute", attribute)
}

// AddManufacturerAttribute is a paid mutator transaction binding the contract method 0x50300a3f.
//
// Solidity: function addManufacturerAttribute(string attribute) returns()
func (_Registry *RegistrySession) AddManufacturerAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddManufacturerAttribute(&_Registry.TransactOpts, attribute)
}

// AddManufacturerAttribute is a paid mutator transaction binding the contract method 0x50300a3f.
//
// Solidity: function addManufacturerAttribute(string attribute) returns()
func (_Registry *RegistryTransactorSession) AddManufacturerAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddManufacturerAttribute(&_Registry.TransactOpts, attribute)
}

// AddModule is a paid mutator transaction binding the contract method 0x0df5b997.
//
// Solidity: function addModule(address implementation, bytes4[] selectors) returns()
func (_Registry *RegistryTransactor) AddModule(opts *bind.TransactOpts, implementation common.Address, selectors [][4]byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "addModule", implementation, selectors)
}

// AddModule is a paid mutator transaction binding the contract method 0x0df5b997.
//
// Solidity: function addModule(address implementation, bytes4[] selectors) returns()
func (_Registry *RegistrySession) AddModule(implementation common.Address, selectors [][4]byte) (*types.Transaction, error) {
	return _Registry.Contract.AddModule(&_Registry.TransactOpts, implementation, selectors)
}

// AddModule is a paid mutator transaction binding the contract method 0x0df5b997.
//
// Solidity: function addModule(address implementation, bytes4[] selectors) returns()
func (_Registry *RegistryTransactorSession) AddModule(implementation common.Address, selectors [][4]byte) (*types.Transaction, error) {
	return _Registry.Contract.AddModule(&_Registry.TransactOpts, implementation, selectors)
}

// AddSyntheticDeviceAttribute is a paid mutator transaction binding the contract method 0xe1f371df.
//
// Solidity: function addSyntheticDeviceAttribute(string attribute) returns()
func (_Registry *RegistryTransactor) AddSyntheticDeviceAttribute(opts *bind.TransactOpts, attribute string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "addSyntheticDeviceAttribute", attribute)
}

// AddSyntheticDeviceAttribute is a paid mutator transaction binding the contract method 0xe1f371df.
//
// Solidity: function addSyntheticDeviceAttribute(string attribute) returns()
func (_Registry *RegistrySession) AddSyntheticDeviceAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddSyntheticDeviceAttribute(&_Registry.TransactOpts, attribute)
}

// AddSyntheticDeviceAttribute is a paid mutator transaction binding the contract method 0xe1f371df.
//
// Solidity: function addSyntheticDeviceAttribute(string attribute) returns()
func (_Registry *RegistryTransactorSession) AddSyntheticDeviceAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddSyntheticDeviceAttribute(&_Registry.TransactOpts, attribute)
}

// AddVehicleAttribute is a paid mutator transaction binding the contract method 0xf0d1a557.
//
// Solidity: function addVehicleAttribute(string attribute) returns()
func (_Registry *RegistryTransactor) AddVehicleAttribute(opts *bind.TransactOpts, attribute string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "addVehicleAttribute", attribute)
}

// AddVehicleAttribute is a paid mutator transaction binding the contract method 0xf0d1a557.
//
// Solidity: function addVehicleAttribute(string attribute) returns()
func (_Registry *RegistrySession) AddVehicleAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddVehicleAttribute(&_Registry.TransactOpts, attribute)
}

// AddVehicleAttribute is a paid mutator transaction binding the contract method 0xf0d1a557.
//
// Solidity: function addVehicleAttribute(string attribute) returns()
func (_Registry *RegistryTransactorSession) AddVehicleAttribute(attribute string) (*types.Transaction, error) {
	return _Registry.Contract.AddVehicleAttribute(&_Registry.TransactOpts, attribute)
}

// AdminBurnAftermarketDevices is a paid mutator transaction binding the contract method 0xd7376bae.
//
// Solidity: function adminBurnAftermarketDevices(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactor) AdminBurnAftermarketDevices(opts *bind.TransactOpts, tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminBurnAftermarketDevices", tokenIds)
}

// AdminBurnAftermarketDevices is a paid mutator transaction binding the contract method 0xd7376bae.
//
// Solidity: function adminBurnAftermarketDevices(uint256[] tokenIds) returns()
func (_Registry *RegistrySession) AdminBurnAftermarketDevices(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnAftermarketDevices(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnAftermarketDevices is a paid mutator transaction binding the contract method 0xd7376bae.
//
// Solidity: function adminBurnAftermarketDevices(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactorSession) AdminBurnAftermarketDevices(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnAftermarketDevices(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnAftermarketDevicesAndDeletePairings is a paid mutator transaction binding the contract method 0x63dec203.
//
// Solidity: function adminBurnAftermarketDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactor) AdminBurnAftermarketDevicesAndDeletePairings(opts *bind.TransactOpts, tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminBurnAftermarketDevicesAndDeletePairings", tokenIds)
}

// AdminBurnAftermarketDevicesAndDeletePairings is a paid mutator transaction binding the contract method 0x63dec203.
//
// Solidity: function adminBurnAftermarketDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistrySession) AdminBurnAftermarketDevicesAndDeletePairings(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnAftermarketDevicesAndDeletePairings(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnAftermarketDevicesAndDeletePairings is a paid mutator transaction binding the contract method 0x63dec203.
//
// Solidity: function adminBurnAftermarketDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactorSession) AdminBurnAftermarketDevicesAndDeletePairings(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnAftermarketDevicesAndDeletePairings(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnSyntheticDevicesAndDeletePairings is a paid mutator transaction binding the contract method 0x52878b61.
//
// Solidity: function adminBurnSyntheticDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactor) AdminBurnSyntheticDevicesAndDeletePairings(opts *bind.TransactOpts, tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminBurnSyntheticDevicesAndDeletePairings", tokenIds)
}

// AdminBurnSyntheticDevicesAndDeletePairings is a paid mutator transaction binding the contract method 0x52878b61.
//
// Solidity: function adminBurnSyntheticDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistrySession) AdminBurnSyntheticDevicesAndDeletePairings(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnSyntheticDevicesAndDeletePairings(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnSyntheticDevicesAndDeletePairings is a paid mutator transaction binding the contract method 0x52878b61.
//
// Solidity: function adminBurnSyntheticDevicesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactorSession) AdminBurnSyntheticDevicesAndDeletePairings(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnSyntheticDevicesAndDeletePairings(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnVehicles is a paid mutator transaction binding the contract method 0x282eb387.
//
// Solidity: function adminBurnVehicles(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactor) AdminBurnVehicles(opts *bind.TransactOpts, tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminBurnVehicles", tokenIds)
}

// AdminBurnVehicles is a paid mutator transaction binding the contract method 0x282eb387.
//
// Solidity: function adminBurnVehicles(uint256[] tokenIds) returns()
func (_Registry *RegistrySession) AdminBurnVehicles(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnVehicles(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnVehicles is a paid mutator transaction binding the contract method 0x282eb387.
//
// Solidity: function adminBurnVehicles(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactorSession) AdminBurnVehicles(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnVehicles(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnVehiclesAndDeletePairings is a paid mutator transaction binding the contract method 0x11d679c9.
//
// Solidity: function adminBurnVehiclesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactor) AdminBurnVehiclesAndDeletePairings(opts *bind.TransactOpts, tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminBurnVehiclesAndDeletePairings", tokenIds)
}

// AdminBurnVehiclesAndDeletePairings is a paid mutator transaction binding the contract method 0x11d679c9.
//
// Solidity: function adminBurnVehiclesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistrySession) AdminBurnVehiclesAndDeletePairings(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnVehiclesAndDeletePairings(&_Registry.TransactOpts, tokenIds)
}

// AdminBurnVehiclesAndDeletePairings is a paid mutator transaction binding the contract method 0x11d679c9.
//
// Solidity: function adminBurnVehiclesAndDeletePairings(uint256[] tokenIds) returns()
func (_Registry *RegistryTransactorSession) AdminBurnVehiclesAndDeletePairings(tokenIds []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminBurnVehiclesAndDeletePairings(&_Registry.TransactOpts, tokenIds)
}

// AdminCacheDimoStreamrEns is a paid mutator transaction binding the contract method 0xb17b974b.
//
// Solidity: function adminCacheDimoStreamrEns() returns()
func (_Registry *RegistryTransactor) AdminCacheDimoStreamrEns(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminCacheDimoStreamrEns")
}

// AdminCacheDimoStreamrEns is a paid mutator transaction binding the contract method 0xb17b974b.
//
// Solidity: function adminCacheDimoStreamrEns() returns()
func (_Registry *RegistrySession) AdminCacheDimoStreamrEns() (*types.Transaction, error) {
	return _Registry.Contract.AdminCacheDimoStreamrEns(&_Registry.TransactOpts)
}

// AdminCacheDimoStreamrEns is a paid mutator transaction binding the contract method 0xb17b974b.
//
// Solidity: function adminCacheDimoStreamrEns() returns()
func (_Registry *RegistryTransactorSession) AdminCacheDimoStreamrEns() (*types.Transaction, error) {
	return _Registry.Contract.AdminCacheDimoStreamrEns(&_Registry.TransactOpts)
}

// AdminChangeParentNode is a paid mutator transaction binding the contract method 0x56936962.
//
// Solidity: function adminChangeParentNode(uint256 newParentNode, address idProxyAddress, uint256[] nodeIdList) returns()
func (_Registry *RegistryTransactor) AdminChangeParentNode(opts *bind.TransactOpts, newParentNode *big.Int, idProxyAddress common.Address, nodeIdList []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminChangeParentNode", newParentNode, idProxyAddress, nodeIdList)
}

// AdminChangeParentNode is a paid mutator transaction binding the contract method 0x56936962.
//
// Solidity: function adminChangeParentNode(uint256 newParentNode, address idProxyAddress, uint256[] nodeIdList) returns()
func (_Registry *RegistrySession) AdminChangeParentNode(newParentNode *big.Int, idProxyAddress common.Address, nodeIdList []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminChangeParentNode(&_Registry.TransactOpts, newParentNode, idProxyAddress, nodeIdList)
}

// AdminChangeParentNode is a paid mutator transaction binding the contract method 0x56936962.
//
// Solidity: function adminChangeParentNode(uint256 newParentNode, address idProxyAddress, uint256[] nodeIdList) returns()
func (_Registry *RegistryTransactorSession) AdminChangeParentNode(newParentNode *big.Int, idProxyAddress common.Address, nodeIdList []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminChangeParentNode(&_Registry.TransactOpts, newParentNode, idProxyAddress, nodeIdList)
}

// AdminPairAftermarketDevice is a paid mutator transaction binding the contract method 0x3febacab.
//
// Solidity: function adminPairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (_Registry *RegistryTransactor) AdminPairAftermarketDevice(opts *bind.TransactOpts, aftermarketDeviceNode *big.Int, vehicleNode *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "adminPairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
}

// AdminPairAftermarketDevice is a paid mutator transaction binding the contract method 0x3febacab.
//
// Solidity: function adminPairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (_Registry *RegistrySession) AdminPairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminPairAftermarketDevice(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode)
}

// AdminPairAftermarketDevice is a paid mutator transaction binding the contract method 0x3febacab.
//
// Solidity: function adminPairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (_Registry *RegistryTransactorSession) AdminPairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.AdminPairAftermarketDevice(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode)
}

// BurnSyntheticDeviceSign is a paid mutator transaction binding the contract method 0x7c7c9978.
//
// Solidity: function burnSyntheticDeviceSign(uint256 vehicleNode, uint256 syntheticDeviceNode, bytes ownerSig) returns()
func (_Registry *RegistryTransactor) BurnSyntheticDeviceSign(opts *bind.TransactOpts, vehicleNode *big.Int, syntheticDeviceNode *big.Int, ownerSig []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "burnSyntheticDeviceSign", vehicleNode, syntheticDeviceNode, ownerSig)
}

// BurnSyntheticDeviceSign is a paid mutator transaction binding the contract method 0x7c7c9978.
//
// Solidity: function burnSyntheticDeviceSign(uint256 vehicleNode, uint256 syntheticDeviceNode, bytes ownerSig) returns()
func (_Registry *RegistrySession) BurnSyntheticDeviceSign(vehicleNode *big.Int, syntheticDeviceNode *big.Int, ownerSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.BurnSyntheticDeviceSign(&_Registry.TransactOpts, vehicleNode, syntheticDeviceNode, ownerSig)
}

// BurnSyntheticDeviceSign is a paid mutator transaction binding the contract method 0x7c7c9978.
//
// Solidity: function burnSyntheticDeviceSign(uint256 vehicleNode, uint256 syntheticDeviceNode, bytes ownerSig) returns()
func (_Registry *RegistryTransactorSession) BurnSyntheticDeviceSign(vehicleNode *big.Int, syntheticDeviceNode *big.Int, ownerSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.BurnSyntheticDeviceSign(&_Registry.TransactOpts, vehicleNode, syntheticDeviceNode, ownerSig)
}

// BurnVehicleSign is a paid mutator transaction binding the contract method 0xd0b61156.
//
// Solidity: function burnVehicleSign(uint256 tokenId, bytes ownerSig) returns()
func (_Registry *RegistryTransactor) BurnVehicleSign(opts *bind.TransactOpts, tokenId *big.Int, ownerSig []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "burnVehicleSign", tokenId, ownerSig)
}

// BurnVehicleSign is a paid mutator transaction binding the contract method 0xd0b61156.
//
// Solidity: function burnVehicleSign(uint256 tokenId, bytes ownerSig) returns()
func (_Registry *RegistrySession) BurnVehicleSign(tokenId *big.Int, ownerSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.BurnVehicleSign(&_Registry.TransactOpts, tokenId, ownerSig)
}

// BurnVehicleSign is a paid mutator transaction binding the contract method 0xd0b61156.
//
// Solidity: function burnVehicleSign(uint256 tokenId, bytes ownerSig) returns()
func (_Registry *RegistryTransactorSession) BurnVehicleSign(tokenId *big.Int, ownerSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.BurnVehicleSign(&_Registry.TransactOpts, tokenId, ownerSig)
}

// ClaimAftermarketDeviceBatch is a paid mutator transaction binding the contract method 0x60deec60.
//
// Solidity: function claimAftermarketDeviceBatch(uint256 manufacturerNode, (uint256,address)[] adOwnerPair) returns()
func (_Registry *RegistryTransactor) ClaimAftermarketDeviceBatch(opts *bind.TransactOpts, manufacturerNode *big.Int, adOwnerPair []AftermarketDeviceOwnerPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "claimAftermarketDeviceBatch", manufacturerNode, adOwnerPair)
}

// ClaimAftermarketDeviceBatch is a paid mutator transaction binding the contract method 0x60deec60.
//
// Solidity: function claimAftermarketDeviceBatch(uint256 manufacturerNode, (uint256,address)[] adOwnerPair) returns()
func (_Registry *RegistrySession) ClaimAftermarketDeviceBatch(manufacturerNode *big.Int, adOwnerPair []AftermarketDeviceOwnerPair) (*types.Transaction, error) {
	return _Registry.Contract.ClaimAftermarketDeviceBatch(&_Registry.TransactOpts, manufacturerNode, adOwnerPair)
}

// ClaimAftermarketDeviceBatch is a paid mutator transaction binding the contract method 0x60deec60.
//
// Solidity: function claimAftermarketDeviceBatch(uint256 manufacturerNode, (uint256,address)[] adOwnerPair) returns()
func (_Registry *RegistryTransactorSession) ClaimAftermarketDeviceBatch(manufacturerNode *big.Int, adOwnerPair []AftermarketDeviceOwnerPair) (*types.Transaction, error) {
	return _Registry.Contract.ClaimAftermarketDeviceBatch(&_Registry.TransactOpts, manufacturerNode, adOwnerPair)
}

// ClaimAftermarketDeviceSign is a paid mutator transaction binding the contract method 0x89a841bb.
//
// Solidity: function claimAftermarketDeviceSign(uint256 aftermarketDeviceNode, address owner, bytes ownerSig, bytes aftermarketDeviceSig) returns()
func (_Registry *RegistryTransactor) ClaimAftermarketDeviceSign(opts *bind.TransactOpts, aftermarketDeviceNode *big.Int, owner common.Address, ownerSig []byte, aftermarketDeviceSig []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "claimAftermarketDeviceSign", aftermarketDeviceNode, owner, ownerSig, aftermarketDeviceSig)
}

// ClaimAftermarketDeviceSign is a paid mutator transaction binding the contract method 0x89a841bb.
//
// Solidity: function claimAftermarketDeviceSign(uint256 aftermarketDeviceNode, address owner, bytes ownerSig, bytes aftermarketDeviceSig) returns()
func (_Registry *RegistrySession) ClaimAftermarketDeviceSign(aftermarketDeviceNode *big.Int, owner common.Address, ownerSig []byte, aftermarketDeviceSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.ClaimAftermarketDeviceSign(&_Registry.TransactOpts, aftermarketDeviceNode, owner, ownerSig, aftermarketDeviceSig)
}

// ClaimAftermarketDeviceSign is a paid mutator transaction binding the contract method 0x89a841bb.
//
// Solidity: function claimAftermarketDeviceSign(uint256 aftermarketDeviceNode, address owner, bytes ownerSig, bytes aftermarketDeviceSig) returns()
func (_Registry *RegistryTransactorSession) ClaimAftermarketDeviceSign(aftermarketDeviceNode *big.Int, owner common.Address, ownerSig []byte, aftermarketDeviceSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.ClaimAftermarketDeviceSign(&_Registry.TransactOpts, aftermarketDeviceNode, owner, ownerSig, aftermarketDeviceSig)
}

// CreateDeviceDefinitionTable is a paid mutator transaction binding the contract method 0x20954d21.
//
// Solidity: function createDeviceDefinitionTable(address tableOwner, uint256 manufacturerId) returns()
func (_Registry *RegistryTransactor) CreateDeviceDefinitionTable(opts *bind.TransactOpts, tableOwner common.Address, manufacturerId *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "createDeviceDefinitionTable", tableOwner, manufacturerId)
}

// CreateDeviceDefinitionTable is a paid mutator transaction binding the contract method 0x20954d21.
//
// Solidity: function createDeviceDefinitionTable(address tableOwner, uint256 manufacturerId) returns()
func (_Registry *RegistrySession) CreateDeviceDefinitionTable(tableOwner common.Address, manufacturerId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.CreateDeviceDefinitionTable(&_Registry.TransactOpts, tableOwner, manufacturerId)
}

// CreateDeviceDefinitionTable is a paid mutator transaction binding the contract method 0x20954d21.
//
// Solidity: function createDeviceDefinitionTable(address tableOwner, uint256 manufacturerId) returns()
func (_Registry *RegistryTransactorSession) CreateDeviceDefinitionTable(tableOwner common.Address, manufacturerId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.CreateDeviceDefinitionTable(&_Registry.TransactOpts, tableOwner, manufacturerId)
}

// CreateVehicleStream is a paid mutator transaction binding the contract method 0x497323c8.
//
// Solidity: function createVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistryTransactor) CreateVehicleStream(opts *bind.TransactOpts, vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "createVehicleStream", vehicleId)
}

// CreateVehicleStream is a paid mutator transaction binding the contract method 0x497323c8.
//
// Solidity: function createVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistrySession) CreateVehicleStream(vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.CreateVehicleStream(&_Registry.TransactOpts, vehicleId)
}

// CreateVehicleStream is a paid mutator transaction binding the contract method 0x497323c8.
//
// Solidity: function createVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistryTransactorSession) CreateVehicleStream(vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.CreateVehicleStream(&_Registry.TransactOpts, vehicleId)
}

// GetPolicy is a paid mutator transaction binding the contract method 0x66df322e.
//
// Solidity: function getPolicy(address caller, uint256 ) payable returns((bool,bool,bool,string,string,string[]) policy)
func (_Registry *RegistryTransactor) GetPolicy(opts *bind.TransactOpts, caller common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "getPolicy", caller, arg1)
}

// GetPolicy is a paid mutator transaction binding the contract method 0x66df322e.
//
// Solidity: function getPolicy(address caller, uint256 ) payable returns((bool,bool,bool,string,string,string[]) policy)
func (_Registry *RegistrySession) GetPolicy(caller common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.GetPolicy(&_Registry.TransactOpts, caller, arg1)
}

// GetPolicy is a paid mutator transaction binding the contract method 0x66df322e.
//
// Solidity: function getPolicy(address caller, uint256 ) payable returns((bool,bool,bool,string,string,string[]) policy)
func (_Registry *RegistryTransactorSession) GetPolicy(caller common.Address, arg1 *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.GetPolicy(&_Registry.TransactOpts, caller, arg1)
}

// GrantRole is a paid mutator transaction binding the contract method 0x2f2ff15d.
//
// Solidity: function grantRole(bytes32 role, address account) returns()
func (_Registry *RegistryTransactor) GrantRole(opts *bind.TransactOpts, role [32]byte, account common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "grantRole", role, account)
}

// GrantRole is a paid mutator transaction binding the contract method 0x2f2ff15d.
//
// Solidity: function grantRole(bytes32 role, address account) returns()
func (_Registry *RegistrySession) GrantRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _Registry.Contract.GrantRole(&_Registry.TransactOpts, role, account)
}

// GrantRole is a paid mutator transaction binding the contract method 0x2f2ff15d.
//
// Solidity: function grantRole(bytes32 role, address account) returns()
func (_Registry *RegistryTransactorSession) GrantRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _Registry.Contract.GrantRole(&_Registry.TransactOpts, role, account)
}

// Initialize is a paid mutator transaction binding the contract method 0x4cd88b76.
//
// Solidity: function initialize(string name, string version) returns()
func (_Registry *RegistryTransactor) Initialize(opts *bind.TransactOpts, name string, version string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "initialize", name, version)
}

// Initialize is a paid mutator transaction binding the contract method 0x4cd88b76.
//
// Solidity: function initialize(string name, string version) returns()
func (_Registry *RegistrySession) Initialize(name string, version string) (*types.Transaction, error) {
	return _Registry.Contract.Initialize(&_Registry.TransactOpts, name, version)
}

// Initialize is a paid mutator transaction binding the contract method 0x4cd88b76.
//
// Solidity: function initialize(string name, string version) returns()
func (_Registry *RegistryTransactorSession) Initialize(name string, version string) (*types.Transaction, error) {
	return _Registry.Contract.Initialize(&_Registry.TransactOpts, name, version)
}

// InsertDeviceDefinition is a paid mutator transaction binding the contract method 0x23536c5f.
//
// Solidity: function insertDeviceDefinition(uint256 manufacturerId, (string,string,uint256,string,string,string,string) data) returns()
func (_Registry *RegistryTransactor) InsertDeviceDefinition(opts *bind.TransactOpts, manufacturerId *big.Int, data DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "insertDeviceDefinition", manufacturerId, data)
}

// InsertDeviceDefinition is a paid mutator transaction binding the contract method 0x23536c5f.
//
// Solidity: function insertDeviceDefinition(uint256 manufacturerId, (string,string,uint256,string,string,string,string) data) returns()
func (_Registry *RegistrySession) InsertDeviceDefinition(manufacturerId *big.Int, data DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.Contract.InsertDeviceDefinition(&_Registry.TransactOpts, manufacturerId, data)
}

// InsertDeviceDefinition is a paid mutator transaction binding the contract method 0x23536c5f.
//
// Solidity: function insertDeviceDefinition(uint256 manufacturerId, (string,string,uint256,string,string,string,string) data) returns()
func (_Registry *RegistryTransactorSession) InsertDeviceDefinition(manufacturerId *big.Int, data DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.Contract.InsertDeviceDefinition(&_Registry.TransactOpts, manufacturerId, data)
}

// InsertDeviceDefinitionBatch is a paid mutator transaction binding the contract method 0x80d50451.
//
// Solidity: function insertDeviceDefinitionBatch(uint256 manufacturerId, (string,string,uint256,string,string,string,string)[] data) returns()
func (_Registry *RegistryTransactor) InsertDeviceDefinitionBatch(opts *bind.TransactOpts, manufacturerId *big.Int, data []DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "insertDeviceDefinitionBatch", manufacturerId, data)
}

// InsertDeviceDefinitionBatch is a paid mutator transaction binding the contract method 0x80d50451.
//
// Solidity: function insertDeviceDefinitionBatch(uint256 manufacturerId, (string,string,uint256,string,string,string,string)[] data) returns()
func (_Registry *RegistrySession) InsertDeviceDefinitionBatch(manufacturerId *big.Int, data []DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.Contract.InsertDeviceDefinitionBatch(&_Registry.TransactOpts, manufacturerId, data)
}

// InsertDeviceDefinitionBatch is a paid mutator transaction binding the contract method 0x80d50451.
//
// Solidity: function insertDeviceDefinitionBatch(uint256 manufacturerId, (string,string,uint256,string,string,string,string)[] data) returns()
func (_Registry *RegistryTransactorSession) InsertDeviceDefinitionBatch(manufacturerId *big.Int, data []DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.Contract.InsertDeviceDefinitionBatch(&_Registry.TransactOpts, manufacturerId, data)
}

// InsertDeviceDefinitionData is a paid mutator transaction binding the contract method 0x39438f38.
//
// Solidity: function insertDeviceDefinitionData(address tablelandTables, uint256 tableId, (string,string,uint256,string,string,string,string) data) returns()
func (_Registry *RegistryTransactor) InsertDeviceDefinitionData(opts *bind.TransactOpts, tablelandTables common.Address, tableId *big.Int, data DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "insertDeviceDefinitionData", tablelandTables, tableId, data)
}

// InsertDeviceDefinitionData is a paid mutator transaction binding the contract method 0x39438f38.
//
// Solidity: function insertDeviceDefinitionData(address tablelandTables, uint256 tableId, (string,string,uint256,string,string,string,string) data) returns()
func (_Registry *RegistrySession) InsertDeviceDefinitionData(tablelandTables common.Address, tableId *big.Int, data DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.Contract.InsertDeviceDefinitionData(&_Registry.TransactOpts, tablelandTables, tableId, data)
}

// InsertDeviceDefinitionData is a paid mutator transaction binding the contract method 0x39438f38.
//
// Solidity: function insertDeviceDefinitionData(address tablelandTables, uint256 tableId, (string,string,uint256,string,string,string,string) data) returns()
func (_Registry *RegistryTransactorSession) InsertDeviceDefinitionData(tablelandTables common.Address, tableId *big.Int, data DeviceDefinitionInput) (*types.Transaction, error) {
	return _Registry.Contract.InsertDeviceDefinitionData(&_Registry.TransactOpts, tablelandTables, tableId, data)
}

// MintAftermarketDeviceByManufacturerBatch is a paid mutator transaction binding the contract method 0x7ba79a39.
//
// Solidity: function mintAftermarketDeviceByManufacturerBatch(uint256 manufacturerNode, (address,(string,string)[])[] adInfos) returns()
func (_Registry *RegistryTransactor) MintAftermarketDeviceByManufacturerBatch(opts *bind.TransactOpts, manufacturerNode *big.Int, adInfos []AftermarketDeviceInfos) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintAftermarketDeviceByManufacturerBatch", manufacturerNode, adInfos)
}

// MintAftermarketDeviceByManufacturerBatch is a paid mutator transaction binding the contract method 0x7ba79a39.
//
// Solidity: function mintAftermarketDeviceByManufacturerBatch(uint256 manufacturerNode, (address,(string,string)[])[] adInfos) returns()
func (_Registry *RegistrySession) MintAftermarketDeviceByManufacturerBatch(manufacturerNode *big.Int, adInfos []AftermarketDeviceInfos) (*types.Transaction, error) {
	return _Registry.Contract.MintAftermarketDeviceByManufacturerBatch(&_Registry.TransactOpts, manufacturerNode, adInfos)
}

// MintAftermarketDeviceByManufacturerBatch is a paid mutator transaction binding the contract method 0x7ba79a39.
//
// Solidity: function mintAftermarketDeviceByManufacturerBatch(uint256 manufacturerNode, (address,(string,string)[])[] adInfos) returns()
func (_Registry *RegistryTransactorSession) MintAftermarketDeviceByManufacturerBatch(manufacturerNode *big.Int, adInfos []AftermarketDeviceInfos) (*types.Transaction, error) {
	return _Registry.Contract.MintAftermarketDeviceByManufacturerBatch(&_Registry.TransactOpts, manufacturerNode, adInfos)
}

// MintIntegration is a paid mutator transaction binding the contract method 0xd6739004.
//
// Solidity: function mintIntegration(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (_Registry *RegistryTransactor) MintIntegration(opts *bind.TransactOpts, owner common.Address, name string, attrInfoPairList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintIntegration", owner, name, attrInfoPairList)
}

// MintIntegration is a paid mutator transaction binding the contract method 0xd6739004.
//
// Solidity: function mintIntegration(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (_Registry *RegistrySession) MintIntegration(owner common.Address, name string, attrInfoPairList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.MintIntegration(&_Registry.TransactOpts, owner, name, attrInfoPairList)
}

// MintIntegration is a paid mutator transaction binding the contract method 0xd6739004.
//
// Solidity: function mintIntegration(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (_Registry *RegistryTransactorSession) MintIntegration(owner common.Address, name string, attrInfoPairList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.MintIntegration(&_Registry.TransactOpts, owner, name, attrInfoPairList)
}

// MintIntegrationBatch is a paid mutator transaction binding the contract method 0x653af271.
//
// Solidity: function mintIntegrationBatch(address owner, string[] names) returns()
func (_Registry *RegistryTransactor) MintIntegrationBatch(opts *bind.TransactOpts, owner common.Address, names []string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintIntegrationBatch", owner, names)
}

// MintIntegrationBatch is a paid mutator transaction binding the contract method 0x653af271.
//
// Solidity: function mintIntegrationBatch(address owner, string[] names) returns()
func (_Registry *RegistrySession) MintIntegrationBatch(owner common.Address, names []string) (*types.Transaction, error) {
	return _Registry.Contract.MintIntegrationBatch(&_Registry.TransactOpts, owner, names)
}

// MintIntegrationBatch is a paid mutator transaction binding the contract method 0x653af271.
//
// Solidity: function mintIntegrationBatch(address owner, string[] names) returns()
func (_Registry *RegistryTransactorSession) MintIntegrationBatch(owner common.Address, names []string) (*types.Transaction, error) {
	return _Registry.Contract.MintIntegrationBatch(&_Registry.TransactOpts, owner, names)
}

// MintManufacturer is a paid mutator transaction binding the contract method 0x5f36da6b.
//
// Solidity: function mintManufacturer(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (_Registry *RegistryTransactor) MintManufacturer(opts *bind.TransactOpts, owner common.Address, name string, attrInfoPairList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintManufacturer", owner, name, attrInfoPairList)
}

// MintManufacturer is a paid mutator transaction binding the contract method 0x5f36da6b.
//
// Solidity: function mintManufacturer(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (_Registry *RegistrySession) MintManufacturer(owner common.Address, name string, attrInfoPairList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.MintManufacturer(&_Registry.TransactOpts, owner, name, attrInfoPairList)
}

// MintManufacturer is a paid mutator transaction binding the contract method 0x5f36da6b.
//
// Solidity: function mintManufacturer(address owner, string name, (string,string)[] attrInfoPairList) returns()
func (_Registry *RegistryTransactorSession) MintManufacturer(owner common.Address, name string, attrInfoPairList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.MintManufacturer(&_Registry.TransactOpts, owner, name, attrInfoPairList)
}

// MintManufacturerBatch is a paid mutator transaction binding the contract method 0x9abb3000.
//
// Solidity: function mintManufacturerBatch(address owner, string[] names) returns()
func (_Registry *RegistryTransactor) MintManufacturerBatch(opts *bind.TransactOpts, owner common.Address, names []string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintManufacturerBatch", owner, names)
}

// MintManufacturerBatch is a paid mutator transaction binding the contract method 0x9abb3000.
//
// Solidity: function mintManufacturerBatch(address owner, string[] names) returns()
func (_Registry *RegistrySession) MintManufacturerBatch(owner common.Address, names []string) (*types.Transaction, error) {
	return _Registry.Contract.MintManufacturerBatch(&_Registry.TransactOpts, owner, names)
}

// MintManufacturerBatch is a paid mutator transaction binding the contract method 0x9abb3000.
//
// Solidity: function mintManufacturerBatch(address owner, string[] names) returns()
func (_Registry *RegistryTransactorSession) MintManufacturerBatch(owner common.Address, names []string) (*types.Transaction, error) {
	return _Registry.Contract.MintManufacturerBatch(&_Registry.TransactOpts, owner, names)
}

// MintSyntheticDeviceBatch is a paid mutator transaction binding the contract method 0x261d982a.
//
// Solidity: function mintSyntheticDeviceBatch(uint256 integrationNode, (uint256,address,(string,string)[])[] data) returns()
func (_Registry *RegistryTransactor) MintSyntheticDeviceBatch(opts *bind.TransactOpts, integrationNode *big.Int, data []MintSyntheticDeviceBatchInput) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintSyntheticDeviceBatch", integrationNode, data)
}

// MintSyntheticDeviceBatch is a paid mutator transaction binding the contract method 0x261d982a.
//
// Solidity: function mintSyntheticDeviceBatch(uint256 integrationNode, (uint256,address,(string,string)[])[] data) returns()
func (_Registry *RegistrySession) MintSyntheticDeviceBatch(integrationNode *big.Int, data []MintSyntheticDeviceBatchInput) (*types.Transaction, error) {
	return _Registry.Contract.MintSyntheticDeviceBatch(&_Registry.TransactOpts, integrationNode, data)
}

// MintSyntheticDeviceBatch is a paid mutator transaction binding the contract method 0x261d982a.
//
// Solidity: function mintSyntheticDeviceBatch(uint256 integrationNode, (uint256,address,(string,string)[])[] data) returns()
func (_Registry *RegistryTransactorSession) MintSyntheticDeviceBatch(integrationNode *big.Int, data []MintSyntheticDeviceBatchInput) (*types.Transaction, error) {
	return _Registry.Contract.MintSyntheticDeviceBatch(&_Registry.TransactOpts, integrationNode, data)
}

// MintSyntheticDeviceSign is a paid mutator transaction binding the contract method 0xc624e8a1.
//
// Solidity: function mintSyntheticDeviceSign((uint256,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistryTransactor) MintSyntheticDeviceSign(opts *bind.TransactOpts, data MintSyntheticDeviceInput) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintSyntheticDeviceSign", data)
}

// MintSyntheticDeviceSign is a paid mutator transaction binding the contract method 0xc624e8a1.
//
// Solidity: function mintSyntheticDeviceSign((uint256,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistrySession) MintSyntheticDeviceSign(data MintSyntheticDeviceInput) (*types.Transaction, error) {
	return _Registry.Contract.MintSyntheticDeviceSign(&_Registry.TransactOpts, data)
}

// MintSyntheticDeviceSign is a paid mutator transaction binding the contract method 0xc624e8a1.
//
// Solidity: function mintSyntheticDeviceSign((uint256,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistryTransactorSession) MintSyntheticDeviceSign(data MintSyntheticDeviceInput) (*types.Transaction, error) {
	return _Registry.Contract.MintSyntheticDeviceSign(&_Registry.TransactOpts, data)
}

// MintVehicle is a paid mutator transaction binding the contract method 0x3da44e56.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactor) MintVehicle(opts *bind.TransactOpts, manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintVehicle", manufacturerNode, owner, attrInfo)
}

// MintVehicle is a paid mutator transaction binding the contract method 0x3da44e56.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, (string,string)[] attrInfo) returns()
func (_Registry *RegistrySession) MintVehicle(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicle(&_Registry.TransactOpts, manufacturerNode, owner, attrInfo)
}

// MintVehicle is a paid mutator transaction binding the contract method 0x3da44e56.
//
// Solidity: function mintVehicle(uint256 manufacturerNode, address owner, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactorSession) MintVehicle(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicle(&_Registry.TransactOpts, manufacturerNode, owner, attrInfo)
}

// MintVehicleAndSdSign is a paid mutator transaction binding the contract method 0xfb1a28e8.
//
// Solidity: function mintVehicleAndSdSign((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistryTransactor) MintVehicleAndSdSign(opts *bind.TransactOpts, data MintVehicleAndSdInput) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintVehicleAndSdSign", data)
}

// MintVehicleAndSdSign is a paid mutator transaction binding the contract method 0xfb1a28e8.
//
// Solidity: function mintVehicleAndSdSign((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistrySession) MintVehicleAndSdSign(data MintVehicleAndSdInput) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleAndSdSign(&_Registry.TransactOpts, data)
}

// MintVehicleAndSdSign is a paid mutator transaction binding the contract method 0xfb1a28e8.
//
// Solidity: function mintVehicleAndSdSign((uint256,address,(string,string)[],uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistryTransactorSession) MintVehicleAndSdSign(data MintVehicleAndSdInput) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleAndSdSign(&_Registry.TransactOpts, data)
}

// MintVehicleAndSdWithDeviceDefinitionSign is a paid mutator transaction binding the contract method 0x191292f8.
//
// Solidity: function mintVehicleAndSdWithDeviceDefinitionSign((uint256,address,string,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistryTransactor) MintVehicleAndSdWithDeviceDefinitionSign(opts *bind.TransactOpts, data MintVehicleAndSdWithDdInput) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintVehicleAndSdWithDeviceDefinitionSign", data)
}

// MintVehicleAndSdWithDeviceDefinitionSign is a paid mutator transaction binding the contract method 0x191292f8.
//
// Solidity: function mintVehicleAndSdWithDeviceDefinitionSign((uint256,address,string,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistrySession) MintVehicleAndSdWithDeviceDefinitionSign(data MintVehicleAndSdWithDdInput) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleAndSdWithDeviceDefinitionSign(&_Registry.TransactOpts, data)
}

// MintVehicleAndSdWithDeviceDefinitionSign is a paid mutator transaction binding the contract method 0x191292f8.
//
// Solidity: function mintVehicleAndSdWithDeviceDefinitionSign((uint256,address,string,uint256,bytes,bytes,address,(string,string)[]) data) returns()
func (_Registry *RegistryTransactorSession) MintVehicleAndSdWithDeviceDefinitionSign(data MintVehicleAndSdWithDdInput) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleAndSdWithDeviceDefinitionSign(&_Registry.TransactOpts, data)
}

// MintVehicleSign is a paid mutator transaction binding the contract method 0x1b1a82c8.
//
// Solidity: function mintVehicleSign(uint256 manufacturerNode, address owner, (string,string)[] attrInfo, bytes signature) returns()
func (_Registry *RegistryTransactor) MintVehicleSign(opts *bind.TransactOpts, manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair, signature []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintVehicleSign", manufacturerNode, owner, attrInfo, signature)
}

// MintVehicleSign is a paid mutator transaction binding the contract method 0x1b1a82c8.
//
// Solidity: function mintVehicleSign(uint256 manufacturerNode, address owner, (string,string)[] attrInfo, bytes signature) returns()
func (_Registry *RegistrySession) MintVehicleSign(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleSign(&_Registry.TransactOpts, manufacturerNode, owner, attrInfo, signature)
}

// MintVehicleSign is a paid mutator transaction binding the contract method 0x1b1a82c8.
//
// Solidity: function mintVehicleSign(uint256 manufacturerNode, address owner, (string,string)[] attrInfo, bytes signature) returns()
func (_Registry *RegistryTransactorSession) MintVehicleSign(manufacturerNode *big.Int, owner common.Address, attrInfo []AttributeInfoPair, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleSign(&_Registry.TransactOpts, manufacturerNode, owner, attrInfo, signature)
}

// MintVehicleWithDeviceDefinition is a paid mutator transaction binding the contract method 0xf8ddeada.
//
// Solidity: function mintVehicleWithDeviceDefinition(uint256 manufacturerNode, address owner, string deviceDefinitionId) returns()
func (_Registry *RegistryTransactor) MintVehicleWithDeviceDefinition(opts *bind.TransactOpts, manufacturerNode *big.Int, owner common.Address, deviceDefinitionId string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintVehicleWithDeviceDefinition", manufacturerNode, owner, deviceDefinitionId)
}

// MintVehicleWithDeviceDefinition is a paid mutator transaction binding the contract method 0xf8ddeada.
//
// Solidity: function mintVehicleWithDeviceDefinition(uint256 manufacturerNode, address owner, string deviceDefinitionId) returns()
func (_Registry *RegistrySession) MintVehicleWithDeviceDefinition(manufacturerNode *big.Int, owner common.Address, deviceDefinitionId string) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleWithDeviceDefinition(&_Registry.TransactOpts, manufacturerNode, owner, deviceDefinitionId)
}

// MintVehicleWithDeviceDefinition is a paid mutator transaction binding the contract method 0xf8ddeada.
//
// Solidity: function mintVehicleWithDeviceDefinition(uint256 manufacturerNode, address owner, string deviceDefinitionId) returns()
func (_Registry *RegistryTransactorSession) MintVehicleWithDeviceDefinition(manufacturerNode *big.Int, owner common.Address, deviceDefinitionId string) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleWithDeviceDefinition(&_Registry.TransactOpts, manufacturerNode, owner, deviceDefinitionId)
}

// MintVehicleWithDeviceDefinitionSign is a paid mutator transaction binding the contract method 0xd3b47405.
//
// Solidity: function mintVehicleWithDeviceDefinitionSign(uint256 manufacturerNode, address owner, string deviceDefinitionId, bytes signature) returns()
func (_Registry *RegistryTransactor) MintVehicleWithDeviceDefinitionSign(opts *bind.TransactOpts, manufacturerNode *big.Int, owner common.Address, deviceDefinitionId string, signature []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "mintVehicleWithDeviceDefinitionSign", manufacturerNode, owner, deviceDefinitionId, signature)
}

// MintVehicleWithDeviceDefinitionSign is a paid mutator transaction binding the contract method 0xd3b47405.
//
// Solidity: function mintVehicleWithDeviceDefinitionSign(uint256 manufacturerNode, address owner, string deviceDefinitionId, bytes signature) returns()
func (_Registry *RegistrySession) MintVehicleWithDeviceDefinitionSign(manufacturerNode *big.Int, owner common.Address, deviceDefinitionId string, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleWithDeviceDefinitionSign(&_Registry.TransactOpts, manufacturerNode, owner, deviceDefinitionId, signature)
}

// MintVehicleWithDeviceDefinitionSign is a paid mutator transaction binding the contract method 0xd3b47405.
//
// Solidity: function mintVehicleWithDeviceDefinitionSign(uint256 manufacturerNode, address owner, string deviceDefinitionId, bytes signature) returns()
func (_Registry *RegistryTransactorSession) MintVehicleWithDeviceDefinitionSign(manufacturerNode *big.Int, owner common.Address, deviceDefinitionId string, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.MintVehicleWithDeviceDefinitionSign(&_Registry.TransactOpts, manufacturerNode, owner, deviceDefinitionId, signature)
}

// MultiDelegateCall is a paid mutator transaction binding the contract method 0x415c2d96.
//
// Solidity: function multiDelegateCall(bytes[] data) returns(bytes[] results)
func (_Registry *RegistryTransactor) MultiDelegateCall(opts *bind.TransactOpts, data [][]byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "multiDelegateCall", data)
}

// MultiDelegateCall is a paid mutator transaction binding the contract method 0x415c2d96.
//
// Solidity: function multiDelegateCall(bytes[] data) returns(bytes[] results)
func (_Registry *RegistrySession) MultiDelegateCall(data [][]byte) (*types.Transaction, error) {
	return _Registry.Contract.MultiDelegateCall(&_Registry.TransactOpts, data)
}

// MultiDelegateCall is a paid mutator transaction binding the contract method 0x415c2d96.
//
// Solidity: function multiDelegateCall(bytes[] data) returns(bytes[] results)
func (_Registry *RegistryTransactorSession) MultiDelegateCall(data [][]byte) (*types.Transaction, error) {
	return _Registry.Contract.MultiDelegateCall(&_Registry.TransactOpts, data)
}

// OnBurnVehicleStream is a paid mutator transaction binding the contract method 0xa91ec798.
//
// Solidity: function onBurnVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistryTransactor) OnBurnVehicleStream(opts *bind.TransactOpts, vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "onBurnVehicleStream", vehicleId)
}

// OnBurnVehicleStream is a paid mutator transaction binding the contract method 0xa91ec798.
//
// Solidity: function onBurnVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistrySession) OnBurnVehicleStream(vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.OnBurnVehicleStream(&_Registry.TransactOpts, vehicleId)
}

// OnBurnVehicleStream is a paid mutator transaction binding the contract method 0xa91ec798.
//
// Solidity: function onBurnVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistryTransactorSession) OnBurnVehicleStream(vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.OnBurnVehicleStream(&_Registry.TransactOpts, vehicleId)
}

// OnSetSubscribePrivilege is a paid mutator transaction binding the contract method 0xc8f11a06.
//
// Solidity: function onSetSubscribePrivilege(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (_Registry *RegistryTransactor) OnSetSubscribePrivilege(opts *bind.TransactOpts, vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "onSetSubscribePrivilege", vehicleId, subscriber, expirationTime)
}

// OnSetSubscribePrivilege is a paid mutator transaction binding the contract method 0xc8f11a06.
//
// Solidity: function onSetSubscribePrivilege(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (_Registry *RegistrySession) OnSetSubscribePrivilege(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.OnSetSubscribePrivilege(&_Registry.TransactOpts, vehicleId, subscriber, expirationTime)
}

// OnSetSubscribePrivilege is a paid mutator transaction binding the contract method 0xc8f11a06.
//
// Solidity: function onSetSubscribePrivilege(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (_Registry *RegistryTransactorSession) OnSetSubscribePrivilege(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.OnSetSubscribePrivilege(&_Registry.TransactOpts, vehicleId, subscriber, expirationTime)
}

// OnTransferVehicleStream is a paid mutator transaction binding the contract method 0x1882b263.
//
// Solidity: function onTransferVehicleStream(address to, uint256 vehicleId) returns()
func (_Registry *RegistryTransactor) OnTransferVehicleStream(opts *bind.TransactOpts, to common.Address, vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "onTransferVehicleStream", to, vehicleId)
}

// OnTransferVehicleStream is a paid mutator transaction binding the contract method 0x1882b263.
//
// Solidity: function onTransferVehicleStream(address to, uint256 vehicleId) returns()
func (_Registry *RegistrySession) OnTransferVehicleStream(to common.Address, vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.OnTransferVehicleStream(&_Registry.TransactOpts, to, vehicleId)
}

// OnTransferVehicleStream is a paid mutator transaction binding the contract method 0x1882b263.
//
// Solidity: function onTransferVehicleStream(address to, uint256 vehicleId) returns()
func (_Registry *RegistryTransactorSession) OnTransferVehicleStream(to common.Address, vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.OnTransferVehicleStream(&_Registry.TransactOpts, to, vehicleId)
}

// PairAftermarketDeviceSign is a paid mutator transaction binding the contract method 0xb50df2f7.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes aftermarketDeviceSig, bytes vehicleOwnerSig) returns()
func (_Registry *RegistryTransactor) PairAftermarketDeviceSign(opts *bind.TransactOpts, aftermarketDeviceNode *big.Int, vehicleNode *big.Int, aftermarketDeviceSig []byte, vehicleOwnerSig []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "pairAftermarketDeviceSign", aftermarketDeviceNode, vehicleNode, aftermarketDeviceSig, vehicleOwnerSig)
}

// PairAftermarketDeviceSign is a paid mutator transaction binding the contract method 0xb50df2f7.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes aftermarketDeviceSig, bytes vehicleOwnerSig) returns()
func (_Registry *RegistrySession) PairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, aftermarketDeviceSig []byte, vehicleOwnerSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.PairAftermarketDeviceSign(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode, aftermarketDeviceSig, vehicleOwnerSig)
}

// PairAftermarketDeviceSign is a paid mutator transaction binding the contract method 0xb50df2f7.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes aftermarketDeviceSig, bytes vehicleOwnerSig) returns()
func (_Registry *RegistryTransactorSession) PairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, aftermarketDeviceSig []byte, vehicleOwnerSig []byte) (*types.Transaction, error) {
	return _Registry.Contract.PairAftermarketDeviceSign(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode, aftermarketDeviceSig, vehicleOwnerSig)
}

// PairAftermarketDeviceSign0 is a paid mutator transaction binding the contract method 0xcfe642dd.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (_Registry *RegistryTransactor) PairAftermarketDeviceSign0(opts *bind.TransactOpts, aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "pairAftermarketDeviceSign0", aftermarketDeviceNode, vehicleNode, signature)
}

// PairAftermarketDeviceSign0 is a paid mutator transaction binding the contract method 0xcfe642dd.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (_Registry *RegistrySession) PairAftermarketDeviceSign0(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.PairAftermarketDeviceSign0(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode, signature)
}

// PairAftermarketDeviceSign0 is a paid mutator transaction binding the contract method 0xcfe642dd.
//
// Solidity: function pairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (_Registry *RegistryTransactorSession) PairAftermarketDeviceSign0(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.PairAftermarketDeviceSign0(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode, signature)
}

// RemoveModule is a paid mutator transaction binding the contract method 0x9748a762.
//
// Solidity: function removeModule(address implementation, bytes4[] selectors) returns()
func (_Registry *RegistryTransactor) RemoveModule(opts *bind.TransactOpts, implementation common.Address, selectors [][4]byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "removeModule", implementation, selectors)
}

// RemoveModule is a paid mutator transaction binding the contract method 0x9748a762.
//
// Solidity: function removeModule(address implementation, bytes4[] selectors) returns()
func (_Registry *RegistrySession) RemoveModule(implementation common.Address, selectors [][4]byte) (*types.Transaction, error) {
	return _Registry.Contract.RemoveModule(&_Registry.TransactOpts, implementation, selectors)
}

// RemoveModule is a paid mutator transaction binding the contract method 0x9748a762.
//
// Solidity: function removeModule(address implementation, bytes4[] selectors) returns()
func (_Registry *RegistryTransactorSession) RemoveModule(implementation common.Address, selectors [][4]byte) (*types.Transaction, error) {
	return _Registry.Contract.RemoveModule(&_Registry.TransactOpts, implementation, selectors)
}

// RenameManufacturers is a paid mutator transaction binding the contract method 0xf73a8f04.
//
// Solidity: function renameManufacturers((uint256,string)[] idManufacturerNames) returns()
func (_Registry *RegistryTransactor) RenameManufacturers(opts *bind.TransactOpts, idManufacturerNames []DevAdminIdManufacturerName) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "renameManufacturers", idManufacturerNames)
}

// RenameManufacturers is a paid mutator transaction binding the contract method 0xf73a8f04.
//
// Solidity: function renameManufacturers((uint256,string)[] idManufacturerNames) returns()
func (_Registry *RegistrySession) RenameManufacturers(idManufacturerNames []DevAdminIdManufacturerName) (*types.Transaction, error) {
	return _Registry.Contract.RenameManufacturers(&_Registry.TransactOpts, idManufacturerNames)
}

// RenameManufacturers is a paid mutator transaction binding the contract method 0xf73a8f04.
//
// Solidity: function renameManufacturers((uint256,string)[] idManufacturerNames) returns()
func (_Registry *RegistryTransactorSession) RenameManufacturers(idManufacturerNames []DevAdminIdManufacturerName) (*types.Transaction, error) {
	return _Registry.Contract.RenameManufacturers(&_Registry.TransactOpts, idManufacturerNames)
}

// RenounceRole is a paid mutator transaction binding the contract method 0x8bb9c5bf.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (_Registry *RegistryTransactor) RenounceRole(opts *bind.TransactOpts, role [32]byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "renounceRole", role)
}

// RenounceRole is a paid mutator transaction binding the contract method 0x8bb9c5bf.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (_Registry *RegistrySession) RenounceRole(role [32]byte) (*types.Transaction, error) {
	return _Registry.Contract.RenounceRole(&_Registry.TransactOpts, role)
}

// RenounceRole is a paid mutator transaction binding the contract method 0x8bb9c5bf.
//
// Solidity: function renounceRole(bytes32 role) returns()
func (_Registry *RegistryTransactorSession) RenounceRole(role [32]byte) (*types.Transaction, error) {
	return _Registry.Contract.RenounceRole(&_Registry.TransactOpts, role)
}

// ReprovisionAftermarketDeviceByManufacturerBatch is a paid mutator transaction binding the contract method 0x9b3abd48.
//
// Solidity: function reprovisionAftermarketDeviceByManufacturerBatch(uint256[] aftermarketDeviceNodeList) returns()
func (_Registry *RegistryTransactor) ReprovisionAftermarketDeviceByManufacturerBatch(opts *bind.TransactOpts, aftermarketDeviceNodeList []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "reprovisionAftermarketDeviceByManufacturerBatch", aftermarketDeviceNodeList)
}

// ReprovisionAftermarketDeviceByManufacturerBatch is a paid mutator transaction binding the contract method 0x9b3abd48.
//
// Solidity: function reprovisionAftermarketDeviceByManufacturerBatch(uint256[] aftermarketDeviceNodeList) returns()
func (_Registry *RegistrySession) ReprovisionAftermarketDeviceByManufacturerBatch(aftermarketDeviceNodeList []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.ReprovisionAftermarketDeviceByManufacturerBatch(&_Registry.TransactOpts, aftermarketDeviceNodeList)
}

// ReprovisionAftermarketDeviceByManufacturerBatch is a paid mutator transaction binding the contract method 0x9b3abd48.
//
// Solidity: function reprovisionAftermarketDeviceByManufacturerBatch(uint256[] aftermarketDeviceNodeList) returns()
func (_Registry *RegistryTransactorSession) ReprovisionAftermarketDeviceByManufacturerBatch(aftermarketDeviceNodeList []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.ReprovisionAftermarketDeviceByManufacturerBatch(&_Registry.TransactOpts, aftermarketDeviceNodeList)
}

// ResetAftermarketDeviceAddressByManufacturerBatch is a paid mutator transaction binding the contract method 0x9d0b139b.
//
// Solidity: function resetAftermarketDeviceAddressByManufacturerBatch((uint256,address)[] adIdAddrs) returns()
func (_Registry *RegistryTransactor) ResetAftermarketDeviceAddressByManufacturerBatch(opts *bind.TransactOpts, adIdAddrs []AftermarketDeviceIdAddressPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "resetAftermarketDeviceAddressByManufacturerBatch", adIdAddrs)
}

// ResetAftermarketDeviceAddressByManufacturerBatch is a paid mutator transaction binding the contract method 0x9d0b139b.
//
// Solidity: function resetAftermarketDeviceAddressByManufacturerBatch((uint256,address)[] adIdAddrs) returns()
func (_Registry *RegistrySession) ResetAftermarketDeviceAddressByManufacturerBatch(adIdAddrs []AftermarketDeviceIdAddressPair) (*types.Transaction, error) {
	return _Registry.Contract.ResetAftermarketDeviceAddressByManufacturerBatch(&_Registry.TransactOpts, adIdAddrs)
}

// ResetAftermarketDeviceAddressByManufacturerBatch is a paid mutator transaction binding the contract method 0x9d0b139b.
//
// Solidity: function resetAftermarketDeviceAddressByManufacturerBatch((uint256,address)[] adIdAddrs) returns()
func (_Registry *RegistryTransactorSession) ResetAftermarketDeviceAddressByManufacturerBatch(adIdAddrs []AftermarketDeviceIdAddressPair) (*types.Transaction, error) {
	return _Registry.Contract.ResetAftermarketDeviceAddressByManufacturerBatch(&_Registry.TransactOpts, adIdAddrs)
}

// RevokeRole is a paid mutator transaction binding the contract method 0xd547741f.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (_Registry *RegistryTransactor) RevokeRole(opts *bind.TransactOpts, role [32]byte, account common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "revokeRole", role, account)
}

// RevokeRole is a paid mutator transaction binding the contract method 0xd547741f.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (_Registry *RegistrySession) RevokeRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _Registry.Contract.RevokeRole(&_Registry.TransactOpts, role, account)
}

// RevokeRole is a paid mutator transaction binding the contract method 0xd547741f.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (_Registry *RegistryTransactorSession) RevokeRole(role [32]byte, account common.Address) (*types.Transaction, error) {
	return _Registry.Contract.RevokeRole(&_Registry.TransactOpts, role, account)
}

// SetAdMintCost is a paid mutator transaction binding the contract method 0x2390baa8.
//
// Solidity: function setAdMintCost(uint256 _adMintCost) returns()
func (_Registry *RegistryTransactor) SetAdMintCost(opts *bind.TransactOpts, _adMintCost *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setAdMintCost", _adMintCost)
}

// SetAdMintCost is a paid mutator transaction binding the contract method 0x2390baa8.
//
// Solidity: function setAdMintCost(uint256 _adMintCost) returns()
func (_Registry *RegistrySession) SetAdMintCost(_adMintCost *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SetAdMintCost(&_Registry.TransactOpts, _adMintCost)
}

// SetAdMintCost is a paid mutator transaction binding the contract method 0x2390baa8.
//
// Solidity: function setAdMintCost(uint256 _adMintCost) returns()
func (_Registry *RegistryTransactorSession) SetAdMintCost(_adMintCost *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SetAdMintCost(&_Registry.TransactOpts, _adMintCost)
}

// SetAftermarketDeviceBeneficiary is a paid mutator transaction binding the contract method 0xbebc0bfc.
//
// Solidity: function setAftermarketDeviceBeneficiary(uint256 nodeId, address beneficiary) returns()
func (_Registry *RegistryTransactor) SetAftermarketDeviceBeneficiary(opts *bind.TransactOpts, nodeId *big.Int, beneficiary common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setAftermarketDeviceBeneficiary", nodeId, beneficiary)
}

// SetAftermarketDeviceBeneficiary is a paid mutator transaction binding the contract method 0xbebc0bfc.
//
// Solidity: function setAftermarketDeviceBeneficiary(uint256 nodeId, address beneficiary) returns()
func (_Registry *RegistrySession) SetAftermarketDeviceBeneficiary(nodeId *big.Int, beneficiary common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetAftermarketDeviceBeneficiary(&_Registry.TransactOpts, nodeId, beneficiary)
}

// SetAftermarketDeviceBeneficiary is a paid mutator transaction binding the contract method 0xbebc0bfc.
//
// Solidity: function setAftermarketDeviceBeneficiary(uint256 nodeId, address beneficiary) returns()
func (_Registry *RegistryTransactorSession) SetAftermarketDeviceBeneficiary(nodeId *big.Int, beneficiary common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetAftermarketDeviceBeneficiary(&_Registry.TransactOpts, nodeId, beneficiary)
}

// SetAftermarketDeviceIdProxyAddress is a paid mutator transaction binding the contract method 0x4d49d82a.
//
// Solidity: function setAftermarketDeviceIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactor) SetAftermarketDeviceIdProxyAddress(opts *bind.TransactOpts, addr common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setAftermarketDeviceIdProxyAddress", addr)
}

// SetAftermarketDeviceIdProxyAddress is a paid mutator transaction binding the contract method 0x4d49d82a.
//
// Solidity: function setAftermarketDeviceIdProxyAddress(address addr) returns()
func (_Registry *RegistrySession) SetAftermarketDeviceIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetAftermarketDeviceIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetAftermarketDeviceIdProxyAddress is a paid mutator transaction binding the contract method 0x4d49d82a.
//
// Solidity: function setAftermarketDeviceIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactorSession) SetAftermarketDeviceIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetAftermarketDeviceIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetAftermarketDeviceInfo is a paid mutator transaction binding the contract method 0x4d13b709.
//
// Solidity: function setAftermarketDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactor) SetAftermarketDeviceInfo(opts *bind.TransactOpts, tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setAftermarketDeviceInfo", tokenId, attrInfo)
}

// SetAftermarketDeviceInfo is a paid mutator transaction binding the contract method 0x4d13b709.
//
// Solidity: function setAftermarketDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistrySession) SetAftermarketDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetAftermarketDeviceInfo(&_Registry.TransactOpts, tokenId, attrInfo)
}

// SetAftermarketDeviceInfo is a paid mutator transaction binding the contract method 0x4d13b709.
//
// Solidity: function setAftermarketDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactorSession) SetAftermarketDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetAftermarketDeviceInfo(&_Registry.TransactOpts, tokenId, attrInfo)
}

// SetBaseDataURI is a paid mutator transaction binding the contract method 0xe324093f.
//
// Solidity: function setBaseDataURI(address idProxyAddress, string _baseDataURI) returns()
func (_Registry *RegistryTransactor) SetBaseDataURI(opts *bind.TransactOpts, idProxyAddress common.Address, _baseDataURI string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setBaseDataURI", idProxyAddress, _baseDataURI)
}

// SetBaseDataURI is a paid mutator transaction binding the contract method 0xe324093f.
//
// Solidity: function setBaseDataURI(address idProxyAddress, string _baseDataURI) returns()
func (_Registry *RegistrySession) SetBaseDataURI(idProxyAddress common.Address, _baseDataURI string) (*types.Transaction, error) {
	return _Registry.Contract.SetBaseDataURI(&_Registry.TransactOpts, idProxyAddress, _baseDataURI)
}

// SetBaseDataURI is a paid mutator transaction binding the contract method 0xe324093f.
//
// Solidity: function setBaseDataURI(address idProxyAddress, string _baseDataURI) returns()
func (_Registry *RegistryTransactorSession) SetBaseDataURI(idProxyAddress common.Address, _baseDataURI string) (*types.Transaction, error) {
	return _Registry.Contract.SetBaseDataURI(&_Registry.TransactOpts, idProxyAddress, _baseDataURI)
}

// SetController is a paid mutator transaction binding the contract method 0x92eefe9b.
//
// Solidity: function setController(address _controller) returns()
func (_Registry *RegistryTransactor) SetController(opts *bind.TransactOpts, _controller common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setController", _controller)
}

// SetController is a paid mutator transaction binding the contract method 0x92eefe9b.
//
// Solidity: function setController(address _controller) returns()
func (_Registry *RegistrySession) SetController(_controller common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetController(&_Registry.TransactOpts, _controller)
}

// SetController is a paid mutator transaction binding the contract method 0x92eefe9b.
//
// Solidity: function setController(address _controller) returns()
func (_Registry *RegistryTransactorSession) SetController(_controller common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetController(&_Registry.TransactOpts, _controller)
}

// SetDeviceDefinitionTable is a paid mutator transaction binding the contract method 0x088fafdb.
//
// Solidity: function setDeviceDefinitionTable(uint256 manufacturerId, uint256 tableId) returns()
func (_Registry *RegistryTransactor) SetDeviceDefinitionTable(opts *bind.TransactOpts, manufacturerId *big.Int, tableId *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setDeviceDefinitionTable", manufacturerId, tableId)
}

// SetDeviceDefinitionTable is a paid mutator transaction binding the contract method 0x088fafdb.
//
// Solidity: function setDeviceDefinitionTable(uint256 manufacturerId, uint256 tableId) returns()
func (_Registry *RegistrySession) SetDeviceDefinitionTable(manufacturerId *big.Int, tableId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SetDeviceDefinitionTable(&_Registry.TransactOpts, manufacturerId, tableId)
}

// SetDeviceDefinitionTable is a paid mutator transaction binding the contract method 0x088fafdb.
//
// Solidity: function setDeviceDefinitionTable(uint256 manufacturerId, uint256 tableId) returns()
func (_Registry *RegistryTransactorSession) SetDeviceDefinitionTable(manufacturerId *big.Int, tableId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SetDeviceDefinitionTable(&_Registry.TransactOpts, manufacturerId, tableId)
}

// SetDimoBaseStreamId is a paid mutator transaction binding the contract method 0x9e594424.
//
// Solidity: function setDimoBaseStreamId(string dimoStreamrEns) returns()
func (_Registry *RegistryTransactor) SetDimoBaseStreamId(opts *bind.TransactOpts, dimoStreamrEns string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setDimoBaseStreamId", dimoStreamrEns)
}

// SetDimoBaseStreamId is a paid mutator transaction binding the contract method 0x9e594424.
//
// Solidity: function setDimoBaseStreamId(string dimoStreamrEns) returns()
func (_Registry *RegistrySession) SetDimoBaseStreamId(dimoStreamrEns string) (*types.Transaction, error) {
	return _Registry.Contract.SetDimoBaseStreamId(&_Registry.TransactOpts, dimoStreamrEns)
}

// SetDimoBaseStreamId is a paid mutator transaction binding the contract method 0x9e594424.
//
// Solidity: function setDimoBaseStreamId(string dimoStreamrEns) returns()
func (_Registry *RegistryTransactorSession) SetDimoBaseStreamId(dimoStreamrEns string) (*types.Transaction, error) {
	return _Registry.Contract.SetDimoBaseStreamId(&_Registry.TransactOpts, dimoStreamrEns)
}

// SetDimoStreamrNode is a paid mutator transaction binding the contract method 0x5f450e29.
//
// Solidity: function setDimoStreamrNode(address dimoStreamrNode) returns()
func (_Registry *RegistryTransactor) SetDimoStreamrNode(opts *bind.TransactOpts, dimoStreamrNode common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setDimoStreamrNode", dimoStreamrNode)
}

// SetDimoStreamrNode is a paid mutator transaction binding the contract method 0x5f450e29.
//
// Solidity: function setDimoStreamrNode(address dimoStreamrNode) returns()
func (_Registry *RegistrySession) SetDimoStreamrNode(dimoStreamrNode common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetDimoStreamrNode(&_Registry.TransactOpts, dimoStreamrNode)
}

// SetDimoStreamrNode is a paid mutator transaction binding the contract method 0x5f450e29.
//
// Solidity: function setDimoStreamrNode(address dimoStreamrNode) returns()
func (_Registry *RegistryTransactorSession) SetDimoStreamrNode(dimoStreamrNode common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetDimoStreamrNode(&_Registry.TransactOpts, dimoStreamrNode)
}

// SetDimoToken is a paid mutator transaction binding the contract method 0x5b6c1979.
//
// Solidity: function setDimoToken(address _dimoToken) returns()
func (_Registry *RegistryTransactor) SetDimoToken(opts *bind.TransactOpts, _dimoToken common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setDimoToken", _dimoToken)
}

// SetDimoToken is a paid mutator transaction binding the contract method 0x5b6c1979.
//
// Solidity: function setDimoToken(address _dimoToken) returns()
func (_Registry *RegistrySession) SetDimoToken(_dimoToken common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetDimoToken(&_Registry.TransactOpts, _dimoToken)
}

// SetDimoToken is a paid mutator transaction binding the contract method 0x5b6c1979.
//
// Solidity: function setDimoToken(address _dimoToken) returns()
func (_Registry *RegistryTransactorSession) SetDimoToken(_dimoToken common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetDimoToken(&_Registry.TransactOpts, _dimoToken)
}

// SetFoundationAddress is a paid mutator transaction binding the contract method 0xf41377ca.
//
// Solidity: function setFoundationAddress(address _foundation) returns()
func (_Registry *RegistryTransactor) SetFoundationAddress(opts *bind.TransactOpts, _foundation common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setFoundationAddress", _foundation)
}

// SetFoundationAddress is a paid mutator transaction binding the contract method 0xf41377ca.
//
// Solidity: function setFoundationAddress(address _foundation) returns()
func (_Registry *RegistrySession) SetFoundationAddress(_foundation common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetFoundationAddress(&_Registry.TransactOpts, _foundation)
}

// SetFoundationAddress is a paid mutator transaction binding the contract method 0xf41377ca.
//
// Solidity: function setFoundationAddress(address _foundation) returns()
func (_Registry *RegistryTransactorSession) SetFoundationAddress(_foundation common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetFoundationAddress(&_Registry.TransactOpts, _foundation)
}

// SetIntegrationController is a paid mutator transaction binding the contract method 0x106129aa.
//
// Solidity: function setIntegrationController(address _controller) returns()
func (_Registry *RegistryTransactor) SetIntegrationController(opts *bind.TransactOpts, _controller common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setIntegrationController", _controller)
}

// SetIntegrationController is a paid mutator transaction binding the contract method 0x106129aa.
//
// Solidity: function setIntegrationController(address _controller) returns()
func (_Registry *RegistrySession) SetIntegrationController(_controller common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetIntegrationController(&_Registry.TransactOpts, _controller)
}

// SetIntegrationController is a paid mutator transaction binding the contract method 0x106129aa.
//
// Solidity: function setIntegrationController(address _controller) returns()
func (_Registry *RegistryTransactorSession) SetIntegrationController(_controller common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetIntegrationController(&_Registry.TransactOpts, _controller)
}

// SetIntegrationIdProxyAddress is a paid mutator transaction binding the contract method 0x636c1d1b.
//
// Solidity: function setIntegrationIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactor) SetIntegrationIdProxyAddress(opts *bind.TransactOpts, addr common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setIntegrationIdProxyAddress", addr)
}

// SetIntegrationIdProxyAddress is a paid mutator transaction binding the contract method 0x636c1d1b.
//
// Solidity: function setIntegrationIdProxyAddress(address addr) returns()
func (_Registry *RegistrySession) SetIntegrationIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetIntegrationIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetIntegrationIdProxyAddress is a paid mutator transaction binding the contract method 0x636c1d1b.
//
// Solidity: function setIntegrationIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactorSession) SetIntegrationIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetIntegrationIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetIntegrationInfo is a paid mutator transaction binding the contract method 0x8d7e6001.
//
// Solidity: function setIntegrationInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (_Registry *RegistryTransactor) SetIntegrationInfo(opts *bind.TransactOpts, tokenId *big.Int, attrInfoList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setIntegrationInfo", tokenId, attrInfoList)
}

// SetIntegrationInfo is a paid mutator transaction binding the contract method 0x8d7e6001.
//
// Solidity: function setIntegrationInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (_Registry *RegistrySession) SetIntegrationInfo(tokenId *big.Int, attrInfoList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetIntegrationInfo(&_Registry.TransactOpts, tokenId, attrInfoList)
}

// SetIntegrationInfo is a paid mutator transaction binding the contract method 0x8d7e6001.
//
// Solidity: function setIntegrationInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (_Registry *RegistryTransactorSession) SetIntegrationInfo(tokenId *big.Int, attrInfoList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetIntegrationInfo(&_Registry.TransactOpts, tokenId, attrInfoList)
}

// SetLicense is a paid mutator transaction binding the contract method 0x0fd21c17.
//
// Solidity: function setLicense(address _license) returns()
func (_Registry *RegistryTransactor) SetLicense(opts *bind.TransactOpts, _license common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setLicense", _license)
}

// SetLicense is a paid mutator transaction binding the contract method 0x0fd21c17.
//
// Solidity: function setLicense(address _license) returns()
func (_Registry *RegistrySession) SetLicense(_license common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetLicense(&_Registry.TransactOpts, _license)
}

// SetLicense is a paid mutator transaction binding the contract method 0x0fd21c17.
//
// Solidity: function setLicense(address _license) returns()
func (_Registry *RegistryTransactorSession) SetLicense(_license common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetLicense(&_Registry.TransactOpts, _license)
}

// SetManufacturerIdProxyAddress is a paid mutator transaction binding the contract method 0xd159f49a.
//
// Solidity: function setManufacturerIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactor) SetManufacturerIdProxyAddress(opts *bind.TransactOpts, addr common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setManufacturerIdProxyAddress", addr)
}

// SetManufacturerIdProxyAddress is a paid mutator transaction binding the contract method 0xd159f49a.
//
// Solidity: function setManufacturerIdProxyAddress(address addr) returns()
func (_Registry *RegistrySession) SetManufacturerIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetManufacturerIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetManufacturerIdProxyAddress is a paid mutator transaction binding the contract method 0xd159f49a.
//
// Solidity: function setManufacturerIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactorSession) SetManufacturerIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetManufacturerIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetManufacturerInfo is a paid mutator transaction binding the contract method 0x63545ffa.
//
// Solidity: function setManufacturerInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (_Registry *RegistryTransactor) SetManufacturerInfo(opts *bind.TransactOpts, tokenId *big.Int, attrInfoList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setManufacturerInfo", tokenId, attrInfoList)
}

// SetManufacturerInfo is a paid mutator transaction binding the contract method 0x63545ffa.
//
// Solidity: function setManufacturerInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (_Registry *RegistrySession) SetManufacturerInfo(tokenId *big.Int, attrInfoList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetManufacturerInfo(&_Registry.TransactOpts, tokenId, attrInfoList)
}

// SetManufacturerInfo is a paid mutator transaction binding the contract method 0x63545ffa.
//
// Solidity: function setManufacturerInfo(uint256 tokenId, (string,string)[] attrInfoList) returns()
func (_Registry *RegistryTransactorSession) SetManufacturerInfo(tokenId *big.Int, attrInfoList []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetManufacturerInfo(&_Registry.TransactOpts, tokenId, attrInfoList)
}

// SetStreamRegistry is a paid mutator transaction binding the contract method 0x0c3cac3b.
//
// Solidity: function setStreamRegistry(address streamRegistry) returns()
func (_Registry *RegistryTransactor) SetStreamRegistry(opts *bind.TransactOpts, streamRegistry common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setStreamRegistry", streamRegistry)
}

// SetStreamRegistry is a paid mutator transaction binding the contract method 0x0c3cac3b.
//
// Solidity: function setStreamRegistry(address streamRegistry) returns()
func (_Registry *RegistrySession) SetStreamRegistry(streamRegistry common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetStreamRegistry(&_Registry.TransactOpts, streamRegistry)
}

// SetStreamRegistry is a paid mutator transaction binding the contract method 0x0c3cac3b.
//
// Solidity: function setStreamRegistry(address streamRegistry) returns()
func (_Registry *RegistryTransactorSession) SetStreamRegistry(streamRegistry common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetStreamRegistry(&_Registry.TransactOpts, streamRegistry)
}

// SetSubscriptionToVehicleStream is a paid mutator transaction binding the contract method 0xbb44bb75.
//
// Solidity: function setSubscriptionToVehicleStream(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (_Registry *RegistryTransactor) SetSubscriptionToVehicleStream(opts *bind.TransactOpts, vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setSubscriptionToVehicleStream", vehicleId, subscriber, expirationTime)
}

// SetSubscriptionToVehicleStream is a paid mutator transaction binding the contract method 0xbb44bb75.
//
// Solidity: function setSubscriptionToVehicleStream(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (_Registry *RegistrySession) SetSubscriptionToVehicleStream(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SetSubscriptionToVehicleStream(&_Registry.TransactOpts, vehicleId, subscriber, expirationTime)
}

// SetSubscriptionToVehicleStream is a paid mutator transaction binding the contract method 0xbb44bb75.
//
// Solidity: function setSubscriptionToVehicleStream(uint256 vehicleId, address subscriber, uint256 expirationTime) returns()
func (_Registry *RegistryTransactorSession) SetSubscriptionToVehicleStream(vehicleId *big.Int, subscriber common.Address, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SetSubscriptionToVehicleStream(&_Registry.TransactOpts, vehicleId, subscriber, expirationTime)
}

// SetSyntheticDeviceIdProxyAddress is a paid mutator transaction binding the contract method 0xecf452d7.
//
// Solidity: function setSyntheticDeviceIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactor) SetSyntheticDeviceIdProxyAddress(opts *bind.TransactOpts, addr common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setSyntheticDeviceIdProxyAddress", addr)
}

// SetSyntheticDeviceIdProxyAddress is a paid mutator transaction binding the contract method 0xecf452d7.
//
// Solidity: function setSyntheticDeviceIdProxyAddress(address addr) returns()
func (_Registry *RegistrySession) SetSyntheticDeviceIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetSyntheticDeviceIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetSyntheticDeviceIdProxyAddress is a paid mutator transaction binding the contract method 0xecf452d7.
//
// Solidity: function setSyntheticDeviceIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactorSession) SetSyntheticDeviceIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetSyntheticDeviceIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetSyntheticDeviceInfo is a paid mutator transaction binding the contract method 0x80430e0d.
//
// Solidity: function setSyntheticDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactor) SetSyntheticDeviceInfo(opts *bind.TransactOpts, tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setSyntheticDeviceInfo", tokenId, attrInfo)
}

// SetSyntheticDeviceInfo is a paid mutator transaction binding the contract method 0x80430e0d.
//
// Solidity: function setSyntheticDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistrySession) SetSyntheticDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetSyntheticDeviceInfo(&_Registry.TransactOpts, tokenId, attrInfo)
}

// SetSyntheticDeviceInfo is a paid mutator transaction binding the contract method 0x80430e0d.
//
// Solidity: function setSyntheticDeviceInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactorSession) SetSyntheticDeviceInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetSyntheticDeviceInfo(&_Registry.TransactOpts, tokenId, attrInfo)
}

// SetVehicleIdProxyAddress is a paid mutator transaction binding the contract method 0x9bfae6da.
//
// Solidity: function setVehicleIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactor) SetVehicleIdProxyAddress(opts *bind.TransactOpts, addr common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setVehicleIdProxyAddress", addr)
}

// SetVehicleIdProxyAddress is a paid mutator transaction binding the contract method 0x9bfae6da.
//
// Solidity: function setVehicleIdProxyAddress(address addr) returns()
func (_Registry *RegistrySession) SetVehicleIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetVehicleIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetVehicleIdProxyAddress is a paid mutator transaction binding the contract method 0x9bfae6da.
//
// Solidity: function setVehicleIdProxyAddress(address addr) returns()
func (_Registry *RegistryTransactorSession) SetVehicleIdProxyAddress(addr common.Address) (*types.Transaction, error) {
	return _Registry.Contract.SetVehicleIdProxyAddress(&_Registry.TransactOpts, addr)
}

// SetVehicleInfo is a paid mutator transaction binding the contract method 0xd9c3ae61.
//
// Solidity: function setVehicleInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactor) SetVehicleInfo(opts *bind.TransactOpts, tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setVehicleInfo", tokenId, attrInfo)
}

// SetVehicleInfo is a paid mutator transaction binding the contract method 0xd9c3ae61.
//
// Solidity: function setVehicleInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistrySession) SetVehicleInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetVehicleInfo(&_Registry.TransactOpts, tokenId, attrInfo)
}

// SetVehicleInfo is a paid mutator transaction binding the contract method 0xd9c3ae61.
//
// Solidity: function setVehicleInfo(uint256 tokenId, (string,string)[] attrInfo) returns()
func (_Registry *RegistryTransactorSession) SetVehicleInfo(tokenId *big.Int, attrInfo []AttributeInfoPair) (*types.Transaction, error) {
	return _Registry.Contract.SetVehicleInfo(&_Registry.TransactOpts, tokenId, attrInfo)
}

// SetVehicleStream is a paid mutator transaction binding the contract method 0x6f58f093.
//
// Solidity: function setVehicleStream(uint256 vehicleId, string streamId) returns()
func (_Registry *RegistryTransactor) SetVehicleStream(opts *bind.TransactOpts, vehicleId *big.Int, streamId string) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "setVehicleStream", vehicleId, streamId)
}

// SetVehicleStream is a paid mutator transaction binding the contract method 0x6f58f093.
//
// Solidity: function setVehicleStream(uint256 vehicleId, string streamId) returns()
func (_Registry *RegistrySession) SetVehicleStream(vehicleId *big.Int, streamId string) (*types.Transaction, error) {
	return _Registry.Contract.SetVehicleStream(&_Registry.TransactOpts, vehicleId, streamId)
}

// SetVehicleStream is a paid mutator transaction binding the contract method 0x6f58f093.
//
// Solidity: function setVehicleStream(uint256 vehicleId, string streamId) returns()
func (_Registry *RegistryTransactorSession) SetVehicleStream(vehicleId *big.Int, streamId string) (*types.Transaction, error) {
	return _Registry.Contract.SetVehicleStream(&_Registry.TransactOpts, vehicleId, streamId)
}

// SubscribeToVehicleStream is a paid mutator transaction binding the contract method 0x37479f7e.
//
// Solidity: function subscribeToVehicleStream(uint256 vehicleId, uint256 expirationTime) returns()
func (_Registry *RegistryTransactor) SubscribeToVehicleStream(opts *bind.TransactOpts, vehicleId *big.Int, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "subscribeToVehicleStream", vehicleId, expirationTime)
}

// SubscribeToVehicleStream is a paid mutator transaction binding the contract method 0x37479f7e.
//
// Solidity: function subscribeToVehicleStream(uint256 vehicleId, uint256 expirationTime) returns()
func (_Registry *RegistrySession) SubscribeToVehicleStream(vehicleId *big.Int, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SubscribeToVehicleStream(&_Registry.TransactOpts, vehicleId, expirationTime)
}

// SubscribeToVehicleStream is a paid mutator transaction binding the contract method 0x37479f7e.
//
// Solidity: function subscribeToVehicleStream(uint256 vehicleId, uint256 expirationTime) returns()
func (_Registry *RegistryTransactorSession) SubscribeToVehicleStream(vehicleId *big.Int, expirationTime *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.SubscribeToVehicleStream(&_Registry.TransactOpts, vehicleId, expirationTime)
}

// TransferAftermarketDeviceOwnership is a paid mutator transaction binding the contract method 0xff96b761.
//
// Solidity: function transferAftermarketDeviceOwnership(uint256 aftermarketDeviceNode, address newOwner) returns()
func (_Registry *RegistryTransactor) TransferAftermarketDeviceOwnership(opts *bind.TransactOpts, aftermarketDeviceNode *big.Int, newOwner common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "transferAftermarketDeviceOwnership", aftermarketDeviceNode, newOwner)
}

// TransferAftermarketDeviceOwnership is a paid mutator transaction binding the contract method 0xff96b761.
//
// Solidity: function transferAftermarketDeviceOwnership(uint256 aftermarketDeviceNode, address newOwner) returns()
func (_Registry *RegistrySession) TransferAftermarketDeviceOwnership(aftermarketDeviceNode *big.Int, newOwner common.Address) (*types.Transaction, error) {
	return _Registry.Contract.TransferAftermarketDeviceOwnership(&_Registry.TransactOpts, aftermarketDeviceNode, newOwner)
}

// TransferAftermarketDeviceOwnership is a paid mutator transaction binding the contract method 0xff96b761.
//
// Solidity: function transferAftermarketDeviceOwnership(uint256 aftermarketDeviceNode, address newOwner) returns()
func (_Registry *RegistryTransactorSession) TransferAftermarketDeviceOwnership(aftermarketDeviceNode *big.Int, newOwner common.Address) (*types.Transaction, error) {
	return _Registry.Contract.TransferAftermarketDeviceOwnership(&_Registry.TransactOpts, aftermarketDeviceNode, newOwner)
}

// UnclaimAftermarketDeviceNode is a paid mutator transaction binding the contract method 0x5c129493.
//
// Solidity: function unclaimAftermarketDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (_Registry *RegistryTransactor) UnclaimAftermarketDeviceNode(opts *bind.TransactOpts, aftermarketDeviceNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "unclaimAftermarketDeviceNode", aftermarketDeviceNodes)
}

// UnclaimAftermarketDeviceNode is a paid mutator transaction binding the contract method 0x5c129493.
//
// Solidity: function unclaimAftermarketDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (_Registry *RegistrySession) UnclaimAftermarketDeviceNode(aftermarketDeviceNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnclaimAftermarketDeviceNode(&_Registry.TransactOpts, aftermarketDeviceNodes)
}

// UnclaimAftermarketDeviceNode is a paid mutator transaction binding the contract method 0x5c129493.
//
// Solidity: function unclaimAftermarketDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (_Registry *RegistryTransactorSession) UnclaimAftermarketDeviceNode(aftermarketDeviceNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnclaimAftermarketDeviceNode(&_Registry.TransactOpts, aftermarketDeviceNodes)
}

// UnpairAftermarketDevice is a paid mutator transaction binding the contract method 0xee4d9596.
//
// Solidity: function unpairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (_Registry *RegistryTransactor) UnpairAftermarketDevice(opts *bind.TransactOpts, aftermarketDeviceNode *big.Int, vehicleNode *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "unpairAftermarketDevice", aftermarketDeviceNode, vehicleNode)
}

// UnpairAftermarketDevice is a paid mutator transaction binding the contract method 0xee4d9596.
//
// Solidity: function unpairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (_Registry *RegistrySession) UnpairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDevice(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode)
}

// UnpairAftermarketDevice is a paid mutator transaction binding the contract method 0xee4d9596.
//
// Solidity: function unpairAftermarketDevice(uint256 aftermarketDeviceNode, uint256 vehicleNode) returns()
func (_Registry *RegistryTransactorSession) UnpairAftermarketDevice(aftermarketDeviceNode *big.Int, vehicleNode *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDevice(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode)
}

// UnpairAftermarketDeviceByDeviceNode is a paid mutator transaction binding the contract method 0x71193956.
//
// Solidity: function unpairAftermarketDeviceByDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (_Registry *RegistryTransactor) UnpairAftermarketDeviceByDeviceNode(opts *bind.TransactOpts, aftermarketDeviceNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "unpairAftermarketDeviceByDeviceNode", aftermarketDeviceNodes)
}

// UnpairAftermarketDeviceByDeviceNode is a paid mutator transaction binding the contract method 0x71193956.
//
// Solidity: function unpairAftermarketDeviceByDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (_Registry *RegistrySession) UnpairAftermarketDeviceByDeviceNode(aftermarketDeviceNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDeviceByDeviceNode(&_Registry.TransactOpts, aftermarketDeviceNodes)
}

// UnpairAftermarketDeviceByDeviceNode is a paid mutator transaction binding the contract method 0x71193956.
//
// Solidity: function unpairAftermarketDeviceByDeviceNode(uint256[] aftermarketDeviceNodes) returns()
func (_Registry *RegistryTransactorSession) UnpairAftermarketDeviceByDeviceNode(aftermarketDeviceNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDeviceByDeviceNode(&_Registry.TransactOpts, aftermarketDeviceNodes)
}

// UnpairAftermarketDeviceByVehicleNode is a paid mutator transaction binding the contract method 0x8c2ee9bb.
//
// Solidity: function unpairAftermarketDeviceByVehicleNode(uint256[] vehicleNodes) returns()
func (_Registry *RegistryTransactor) UnpairAftermarketDeviceByVehicleNode(opts *bind.TransactOpts, vehicleNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "unpairAftermarketDeviceByVehicleNode", vehicleNodes)
}

// UnpairAftermarketDeviceByVehicleNode is a paid mutator transaction binding the contract method 0x8c2ee9bb.
//
// Solidity: function unpairAftermarketDeviceByVehicleNode(uint256[] vehicleNodes) returns()
func (_Registry *RegistrySession) UnpairAftermarketDeviceByVehicleNode(vehicleNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDeviceByVehicleNode(&_Registry.TransactOpts, vehicleNodes)
}

// UnpairAftermarketDeviceByVehicleNode is a paid mutator transaction binding the contract method 0x8c2ee9bb.
//
// Solidity: function unpairAftermarketDeviceByVehicleNode(uint256[] vehicleNodes) returns()
func (_Registry *RegistryTransactorSession) UnpairAftermarketDeviceByVehicleNode(vehicleNodes []*big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDeviceByVehicleNode(&_Registry.TransactOpts, vehicleNodes)
}

// UnpairAftermarketDeviceSign is a paid mutator transaction binding the contract method 0x3f65997a.
//
// Solidity: function unpairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (_Registry *RegistryTransactor) UnpairAftermarketDeviceSign(opts *bind.TransactOpts, aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "unpairAftermarketDeviceSign", aftermarketDeviceNode, vehicleNode, signature)
}

// UnpairAftermarketDeviceSign is a paid mutator transaction binding the contract method 0x3f65997a.
//
// Solidity: function unpairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (_Registry *RegistrySession) UnpairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDeviceSign(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode, signature)
}

// UnpairAftermarketDeviceSign is a paid mutator transaction binding the contract method 0x3f65997a.
//
// Solidity: function unpairAftermarketDeviceSign(uint256 aftermarketDeviceNode, uint256 vehicleNode, bytes signature) returns()
func (_Registry *RegistryTransactorSession) UnpairAftermarketDeviceSign(aftermarketDeviceNode *big.Int, vehicleNode *big.Int, signature []byte) (*types.Transaction, error) {
	return _Registry.Contract.UnpairAftermarketDeviceSign(&_Registry.TransactOpts, aftermarketDeviceNode, vehicleNode, signature)
}

// UnsetVehicleStream is a paid mutator transaction binding the contract method 0xcd90df7e.
//
// Solidity: function unsetVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistryTransactor) UnsetVehicleStream(opts *bind.TransactOpts, vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "unsetVehicleStream", vehicleId)
}

// UnsetVehicleStream is a paid mutator transaction binding the contract method 0xcd90df7e.
//
// Solidity: function unsetVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistrySession) UnsetVehicleStream(vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnsetVehicleStream(&_Registry.TransactOpts, vehicleId)
}

// UnsetVehicleStream is a paid mutator transaction binding the contract method 0xcd90df7e.
//
// Solidity: function unsetVehicleStream(uint256 vehicleId) returns()
func (_Registry *RegistryTransactorSession) UnsetVehicleStream(vehicleId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.UnsetVehicleStream(&_Registry.TransactOpts, vehicleId)
}

// UpdateIntegrationMinted is a paid mutator transaction binding the contract method 0x440707b5.
//
// Solidity: function updateIntegrationMinted(address from, address to) returns()
func (_Registry *RegistryTransactor) UpdateIntegrationMinted(opts *bind.TransactOpts, from common.Address, to common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "updateIntegrationMinted", from, to)
}

// UpdateIntegrationMinted is a paid mutator transaction binding the contract method 0x440707b5.
//
// Solidity: function updateIntegrationMinted(address from, address to) returns()
func (_Registry *RegistrySession) UpdateIntegrationMinted(from common.Address, to common.Address) (*types.Transaction, error) {
	return _Registry.Contract.UpdateIntegrationMinted(&_Registry.TransactOpts, from, to)
}

// UpdateIntegrationMinted is a paid mutator transaction binding the contract method 0x440707b5.
//
// Solidity: function updateIntegrationMinted(address from, address to) returns()
func (_Registry *RegistryTransactorSession) UpdateIntegrationMinted(from common.Address, to common.Address) (*types.Transaction, error) {
	return _Registry.Contract.UpdateIntegrationMinted(&_Registry.TransactOpts, from, to)
}

// UpdateManufacturerMinted is a paid mutator transaction binding the contract method 0x20d60248.
//
// Solidity: function updateManufacturerMinted(address from, address to) returns()
func (_Registry *RegistryTransactor) UpdateManufacturerMinted(opts *bind.TransactOpts, from common.Address, to common.Address) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "updateManufacturerMinted", from, to)
}

// UpdateManufacturerMinted is a paid mutator transaction binding the contract method 0x20d60248.
//
// Solidity: function updateManufacturerMinted(address from, address to) returns()
func (_Registry *RegistrySession) UpdateManufacturerMinted(from common.Address, to common.Address) (*types.Transaction, error) {
	return _Registry.Contract.UpdateManufacturerMinted(&_Registry.TransactOpts, from, to)
}

// UpdateManufacturerMinted is a paid mutator transaction binding the contract method 0x20d60248.
//
// Solidity: function updateManufacturerMinted(address from, address to) returns()
func (_Registry *RegistryTransactorSession) UpdateManufacturerMinted(from common.Address, to common.Address) (*types.Transaction, error) {
	return _Registry.Contract.UpdateManufacturerMinted(&_Registry.TransactOpts, from, to)
}

// UpdateModule is a paid mutator transaction binding the contract method 0x06d1d2a1.
//
// Solidity: function updateModule(address oldImplementation, address newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors) returns()
func (_Registry *RegistryTransactor) UpdateModule(opts *bind.TransactOpts, oldImplementation common.Address, newImplementation common.Address, oldSelectors [][4]byte, newSelectors [][4]byte) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "updateModule", oldImplementation, newImplementation, oldSelectors, newSelectors)
}

// UpdateModule is a paid mutator transaction binding the contract method 0x06d1d2a1.
//
// Solidity: function updateModule(address oldImplementation, address newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors) returns()
func (_Registry *RegistrySession) UpdateModule(oldImplementation common.Address, newImplementation common.Address, oldSelectors [][4]byte, newSelectors [][4]byte) (*types.Transaction, error) {
	return _Registry.Contract.UpdateModule(&_Registry.TransactOpts, oldImplementation, newImplementation, oldSelectors, newSelectors)
}

// UpdateModule is a paid mutator transaction binding the contract method 0x06d1d2a1.
//
// Solidity: function updateModule(address oldImplementation, address newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors) returns()
func (_Registry *RegistryTransactorSession) UpdateModule(oldImplementation common.Address, newImplementation common.Address, oldSelectors [][4]byte, newSelectors [][4]byte) (*types.Transaction, error) {
	return _Registry.Contract.UpdateModule(&_Registry.TransactOpts, oldImplementation, newImplementation, oldSelectors, newSelectors)
}

// ValidateBurnAndResetNode is a paid mutator transaction binding the contract method 0xea0e7d3a.
//
// Solidity: function validateBurnAndResetNode(uint256 tokenId) returns()
func (_Registry *RegistryTransactor) ValidateBurnAndResetNode(opts *bind.TransactOpts, tokenId *big.Int) (*types.Transaction, error) {
	return _Registry.contract.Transact(opts, "validateBurnAndResetNode", tokenId)
}

// ValidateBurnAndResetNode is a paid mutator transaction binding the contract method 0xea0e7d3a.
//
// Solidity: function validateBurnAndResetNode(uint256 tokenId) returns()
func (_Registry *RegistrySession) ValidateBurnAndResetNode(tokenId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.ValidateBurnAndResetNode(&_Registry.TransactOpts, tokenId)
}

// ValidateBurnAndResetNode is a paid mutator transaction binding the contract method 0xea0e7d3a.
//
// Solidity: function validateBurnAndResetNode(uint256 tokenId) returns()
func (_Registry *RegistryTransactorSession) ValidateBurnAndResetNode(tokenId *big.Int) (*types.Transaction, error) {
	return _Registry.Contract.ValidateBurnAndResetNode(&_Registry.TransactOpts, tokenId)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() returns()
func (_Registry *RegistryTransactor) Fallback(opts *bind.TransactOpts, calldata []byte) (*types.Transaction, error) {
	return _Registry.contract.RawTransact(opts, calldata)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() returns()
func (_Registry *RegistrySession) Fallback(calldata []byte) (*types.Transaction, error) {
	return _Registry.Contract.Fallback(&_Registry.TransactOpts, calldata)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() returns()
func (_Registry *RegistryTransactorSession) Fallback(calldata []byte) (*types.Transaction, error) {
	return _Registry.Contract.Fallback(&_Registry.TransactOpts, calldata)
}

// RegistryAftermarketDeviceAddressResetIterator is returned from FilterAftermarketDeviceAddressReset and is used to iterate over the raw logs and unpacked data for AftermarketDeviceAddressReset events raised by the Registry contract.
type RegistryAftermarketDeviceAddressResetIterator struct {
	Event *RegistryAftermarketDeviceAddressReset // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceAddressResetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceAddressReset)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceAddressReset)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceAddressResetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceAddressResetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceAddressReset represents a AftermarketDeviceAddressReset event raised by the Registry contract.
type RegistryAftermarketDeviceAddressReset struct {
	ManufacturerId           *big.Int
	TokenId                  *big.Int
	AftermarketDeviceAddress common.Address
	Raw                      types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceAddressReset is a free log retrieval operation binding the contract event 0x4993b53bba9fe570bd465464126bb5be93bd1504db0060ed2b7cd89f5a32b6be.
//
// Solidity: event AftermarketDeviceAddressReset(uint256 indexed manufacturerId, uint256 indexed tokenId, address indexed aftermarketDeviceAddress)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceAddressReset(opts *bind.FilterOpts, manufacturerId []*big.Int, tokenId []*big.Int, aftermarketDeviceAddress []common.Address) (*RegistryAftermarketDeviceAddressResetIterator, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}
	var aftermarketDeviceAddressRule []interface{}
	for _, aftermarketDeviceAddressItem := range aftermarketDeviceAddress {
		aftermarketDeviceAddressRule = append(aftermarketDeviceAddressRule, aftermarketDeviceAddressItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceAddressReset", manufacturerIdRule, tokenIdRule, aftermarketDeviceAddressRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceAddressResetIterator{contract: _Registry.contract, event: "AftermarketDeviceAddressReset", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceAddressReset is a free log subscription operation binding the contract event 0x4993b53bba9fe570bd465464126bb5be93bd1504db0060ed2b7cd89f5a32b6be.
//
// Solidity: event AftermarketDeviceAddressReset(uint256 indexed manufacturerId, uint256 indexed tokenId, address indexed aftermarketDeviceAddress)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceAddressReset(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceAddressReset, manufacturerId []*big.Int, tokenId []*big.Int, aftermarketDeviceAddress []common.Address) (event.Subscription, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}
	var aftermarketDeviceAddressRule []interface{}
	for _, aftermarketDeviceAddressItem := range aftermarketDeviceAddress {
		aftermarketDeviceAddressRule = append(aftermarketDeviceAddressRule, aftermarketDeviceAddressItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceAddressReset", manufacturerIdRule, tokenIdRule, aftermarketDeviceAddressRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceAddressReset)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAddressReset", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceAddressReset is a log parse operation binding the contract event 0x4993b53bba9fe570bd465464126bb5be93bd1504db0060ed2b7cd89f5a32b6be.
//
// Solidity: event AftermarketDeviceAddressReset(uint256 indexed manufacturerId, uint256 indexed tokenId, address indexed aftermarketDeviceAddress)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceAddressReset(log types.Log) (*RegistryAftermarketDeviceAddressReset, error) {
	event := new(RegistryAftermarketDeviceAddressReset)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAddressReset", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceAttributeAddedIterator is returned from FilterAftermarketDeviceAttributeAdded and is used to iterate over the raw logs and unpacked data for AftermarketDeviceAttributeAdded events raised by the Registry contract.
type RegistryAftermarketDeviceAttributeAddedIterator struct {
	Event *RegistryAftermarketDeviceAttributeAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceAttributeAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceAttributeAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceAttributeAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceAttributeAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceAttributeAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceAttributeAdded represents a AftermarketDeviceAttributeAdded event raised by the Registry contract.
type RegistryAftermarketDeviceAttributeAdded struct {
	Attribute string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceAttributeAdded is a free log retrieval operation binding the contract event 0x3ef2473cbfb66e153539befafe6ba95e95c6cc0659ebc0d7e8a56f014de7eb5f.
//
// Solidity: event AftermarketDeviceAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceAttributeAdded(opts *bind.FilterOpts) (*RegistryAftermarketDeviceAttributeAddedIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceAttributeAdded")
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceAttributeAddedIterator{contract: _Registry.contract, event: "AftermarketDeviceAttributeAdded", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceAttributeAdded is a free log subscription operation binding the contract event 0x3ef2473cbfb66e153539befafe6ba95e95c6cc0659ebc0d7e8a56f014de7eb5f.
//
// Solidity: event AftermarketDeviceAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceAttributeAdded(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceAttributeAdded) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceAttributeAdded")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceAttributeAdded)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAttributeAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceAttributeAdded is a log parse operation binding the contract event 0x3ef2473cbfb66e153539befafe6ba95e95c6cc0659ebc0d7e8a56f014de7eb5f.
//
// Solidity: event AftermarketDeviceAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceAttributeAdded(log types.Log) (*RegistryAftermarketDeviceAttributeAdded, error) {
	event := new(RegistryAftermarketDeviceAttributeAdded)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAttributeAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceAttributeSetIterator is returned from FilterAftermarketDeviceAttributeSet and is used to iterate over the raw logs and unpacked data for AftermarketDeviceAttributeSet events raised by the Registry contract.
type RegistryAftermarketDeviceAttributeSetIterator struct {
	Event *RegistryAftermarketDeviceAttributeSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceAttributeSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceAttributeSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceAttributeSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceAttributeSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceAttributeSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceAttributeSet represents a AftermarketDeviceAttributeSet event raised by the Registry contract.
type RegistryAftermarketDeviceAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceAttributeSet is a free log retrieval operation binding the contract event 0x977fe0ddf8485988af0b93d70bf5977b48236e9969cdb9b1f55977fbab7cd417.
//
// Solidity: event AftermarketDeviceAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceAttributeSet(opts *bind.FilterOpts) (*RegistryAftermarketDeviceAttributeSetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceAttributeSet")
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceAttributeSetIterator{contract: _Registry.contract, event: "AftermarketDeviceAttributeSet", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceAttributeSet is a free log subscription operation binding the contract event 0x977fe0ddf8485988af0b93d70bf5977b48236e9969cdb9b1f55977fbab7cd417.
//
// Solidity: event AftermarketDeviceAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceAttributeSet(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceAttributeSet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceAttributeSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceAttributeSet)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAttributeSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceAttributeSet is a log parse operation binding the contract event 0x977fe0ddf8485988af0b93d70bf5977b48236e9969cdb9b1f55977fbab7cd417.
//
// Solidity: event AftermarketDeviceAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceAttributeSet(log types.Log) (*RegistryAftermarketDeviceAttributeSet, error) {
	event := new(RegistryAftermarketDeviceAttributeSet)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAttributeSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceAttributeSetDevAdminIterator is returned from FilterAftermarketDeviceAttributeSetDevAdmin and is used to iterate over the raw logs and unpacked data for AftermarketDeviceAttributeSetDevAdmin events raised by the Registry contract.
type RegistryAftermarketDeviceAttributeSetDevAdminIterator struct {
	Event *RegistryAftermarketDeviceAttributeSetDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceAttributeSetDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceAttributeSetDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceAttributeSetDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceAttributeSetDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceAttributeSetDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceAttributeSetDevAdmin represents a AftermarketDeviceAttributeSetDevAdmin event raised by the Registry contract.
type RegistryAftermarketDeviceAttributeSetDevAdmin struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceAttributeSetDevAdmin is a free log retrieval operation binding the contract event 0x000d5c453b5e43761f8a52bf98395d56422aaaebab0f8bcf44ac3c1627276b45.
//
// Solidity: event AftermarketDeviceAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceAttributeSetDevAdmin(opts *bind.FilterOpts, tokenId []*big.Int) (*RegistryAftermarketDeviceAttributeSetDevAdminIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceAttributeSetDevAdmin", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceAttributeSetDevAdminIterator{contract: _Registry.contract, event: "AftermarketDeviceAttributeSetDevAdmin", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceAttributeSetDevAdmin is a free log subscription operation binding the contract event 0x000d5c453b5e43761f8a52bf98395d56422aaaebab0f8bcf44ac3c1627276b45.
//
// Solidity: event AftermarketDeviceAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceAttributeSetDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceAttributeSetDevAdmin, tokenId []*big.Int) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceAttributeSetDevAdmin", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceAttributeSetDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAttributeSetDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceAttributeSetDevAdmin is a log parse operation binding the contract event 0x000d5c453b5e43761f8a52bf98395d56422aaaebab0f8bcf44ac3c1627276b45.
//
// Solidity: event AftermarketDeviceAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceAttributeSetDevAdmin(log types.Log) (*RegistryAftermarketDeviceAttributeSetDevAdmin, error) {
	event := new(RegistryAftermarketDeviceAttributeSetDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceAttributeSetDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceClaimedIterator is returned from FilterAftermarketDeviceClaimed and is used to iterate over the raw logs and unpacked data for AftermarketDeviceClaimed events raised by the Registry contract.
type RegistryAftermarketDeviceClaimedIterator struct {
	Event *RegistryAftermarketDeviceClaimed // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceClaimedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceClaimed)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceClaimed)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceClaimedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceClaimedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceClaimed represents a AftermarketDeviceClaimed event raised by the Registry contract.
type RegistryAftermarketDeviceClaimed struct {
	AftermarketDeviceNode *big.Int
	Owner                 common.Address
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceClaimed is a free log retrieval operation binding the contract event 0x8468d811e5090d3b1a07e28af524e66c128f624e16b07638f419012c779f76ec.
//
// Solidity: event AftermarketDeviceClaimed(uint256 aftermarketDeviceNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceClaimed(opts *bind.FilterOpts, owner []common.Address) (*RegistryAftermarketDeviceClaimedIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceClaimed", ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceClaimedIterator{contract: _Registry.contract, event: "AftermarketDeviceClaimed", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceClaimed is a free log subscription operation binding the contract event 0x8468d811e5090d3b1a07e28af524e66c128f624e16b07638f419012c779f76ec.
//
// Solidity: event AftermarketDeviceClaimed(uint256 aftermarketDeviceNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceClaimed(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceClaimed, owner []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceClaimed", ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceClaimed)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceClaimed", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceClaimed is a log parse operation binding the contract event 0x8468d811e5090d3b1a07e28af524e66c128f624e16b07638f419012c779f76ec.
//
// Solidity: event AftermarketDeviceClaimed(uint256 aftermarketDeviceNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceClaimed(log types.Log) (*RegistryAftermarketDeviceClaimed, error) {
	event := new(RegistryAftermarketDeviceClaimed)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceClaimed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceIdProxySetIterator is returned from FilterAftermarketDeviceIdProxySet and is used to iterate over the raw logs and unpacked data for AftermarketDeviceIdProxySet events raised by the Registry contract.
type RegistryAftermarketDeviceIdProxySetIterator struct {
	Event *RegistryAftermarketDeviceIdProxySet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceIdProxySetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceIdProxySet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceIdProxySet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceIdProxySetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceIdProxySetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceIdProxySet represents a AftermarketDeviceIdProxySet event raised by the Registry contract.
type RegistryAftermarketDeviceIdProxySet struct {
	Proxy common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceIdProxySet is a free log retrieval operation binding the contract event 0xe2daa727eb82f2761802221c26f72d54501ca8abd6da081e50fedaaab21f4036.
//
// Solidity: event AftermarketDeviceIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceIdProxySet(opts *bind.FilterOpts, proxy []common.Address) (*RegistryAftermarketDeviceIdProxySetIterator, error) {

	var proxyRule []interface{}
	for _, proxyItem := range proxy {
		proxyRule = append(proxyRule, proxyItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceIdProxySet", proxyRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceIdProxySetIterator{contract: _Registry.contract, event: "AftermarketDeviceIdProxySet", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceIdProxySet is a free log subscription operation binding the contract event 0xe2daa727eb82f2761802221c26f72d54501ca8abd6da081e50fedaaab21f4036.
//
// Solidity: event AftermarketDeviceIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceIdProxySet(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceIdProxySet, proxy []common.Address) (event.Subscription, error) {

	var proxyRule []interface{}
	for _, proxyItem := range proxy {
		proxyRule = append(proxyRule, proxyItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceIdProxySet", proxyRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceIdProxySet)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceIdProxySet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceIdProxySet is a log parse operation binding the contract event 0xe2daa727eb82f2761802221c26f72d54501ca8abd6da081e50fedaaab21f4036.
//
// Solidity: event AftermarketDeviceIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceIdProxySet(log types.Log) (*RegistryAftermarketDeviceIdProxySet, error) {
	event := new(RegistryAftermarketDeviceIdProxySet)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceIdProxySet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceNodeBurnedIterator is returned from FilterAftermarketDeviceNodeBurned and is used to iterate over the raw logs and unpacked data for AftermarketDeviceNodeBurned events raised by the Registry contract.
type RegistryAftermarketDeviceNodeBurnedIterator struct {
	Event *RegistryAftermarketDeviceNodeBurned // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceNodeBurnedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceNodeBurned)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceNodeBurned)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceNodeBurnedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceNodeBurnedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceNodeBurned represents a AftermarketDeviceNodeBurned event raised by the Registry contract.
type RegistryAftermarketDeviceNodeBurned struct {
	TokenId *big.Int
	Owner   common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceNodeBurned is a free log retrieval operation binding the contract event 0xc4d38c0a034bc1693db3b9a33125831c3d2e1f11e5b69be183ff9ac991384d95.
//
// Solidity: event AftermarketDeviceNodeBurned(uint256 indexed tokenId, address indexed owner)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceNodeBurned(opts *bind.FilterOpts, tokenId []*big.Int, owner []common.Address) (*RegistryAftermarketDeviceNodeBurnedIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceNodeBurned", tokenIdRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceNodeBurnedIterator{contract: _Registry.contract, event: "AftermarketDeviceNodeBurned", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceNodeBurned is a free log subscription operation binding the contract event 0xc4d38c0a034bc1693db3b9a33125831c3d2e1f11e5b69be183ff9ac991384d95.
//
// Solidity: event AftermarketDeviceNodeBurned(uint256 indexed tokenId, address indexed owner)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceNodeBurned(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceNodeBurned, tokenId []*big.Int, owner []common.Address) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceNodeBurned", tokenIdRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceNodeBurned)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceNodeBurned", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceNodeBurned is a log parse operation binding the contract event 0xc4d38c0a034bc1693db3b9a33125831c3d2e1f11e5b69be183ff9ac991384d95.
//
// Solidity: event AftermarketDeviceNodeBurned(uint256 indexed tokenId, address indexed owner)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceNodeBurned(log types.Log) (*RegistryAftermarketDeviceNodeBurned, error) {
	event := new(RegistryAftermarketDeviceNodeBurned)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceNodeBurned", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceNodeBurnedDevAdminIterator is returned from FilterAftermarketDeviceNodeBurnedDevAdmin and is used to iterate over the raw logs and unpacked data for AftermarketDeviceNodeBurnedDevAdmin events raised by the Registry contract.
type RegistryAftermarketDeviceNodeBurnedDevAdminIterator struct {
	Event *RegistryAftermarketDeviceNodeBurnedDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceNodeBurnedDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceNodeBurnedDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceNodeBurnedDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceNodeBurnedDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceNodeBurnedDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceNodeBurnedDevAdmin represents a AftermarketDeviceNodeBurnedDevAdmin event raised by the Registry contract.
type RegistryAftermarketDeviceNodeBurnedDevAdmin struct {
	AdNode *big.Int
	Owner  common.Address
	Raw    types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceNodeBurnedDevAdmin is a free log retrieval operation binding the contract event 0xb33f329db9f4347b4ce64f7b9c2d5fe2d92e95ac9fee76a553543f1338752a45.
//
// Solidity: event AftermarketDeviceNodeBurnedDevAdmin(uint256 indexed adNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceNodeBurnedDevAdmin(opts *bind.FilterOpts, adNode []*big.Int, owner []common.Address) (*RegistryAftermarketDeviceNodeBurnedDevAdminIterator, error) {

	var adNodeRule []interface{}
	for _, adNodeItem := range adNode {
		adNodeRule = append(adNodeRule, adNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceNodeBurnedDevAdmin", adNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceNodeBurnedDevAdminIterator{contract: _Registry.contract, event: "AftermarketDeviceNodeBurnedDevAdmin", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceNodeBurnedDevAdmin is a free log subscription operation binding the contract event 0xb33f329db9f4347b4ce64f7b9c2d5fe2d92e95ac9fee76a553543f1338752a45.
//
// Solidity: event AftermarketDeviceNodeBurnedDevAdmin(uint256 indexed adNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceNodeBurnedDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceNodeBurnedDevAdmin, adNode []*big.Int, owner []common.Address) (event.Subscription, error) {

	var adNodeRule []interface{}
	for _, adNodeItem := range adNode {
		adNodeRule = append(adNodeRule, adNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceNodeBurnedDevAdmin", adNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceNodeBurnedDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceNodeBurnedDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceNodeBurnedDevAdmin is a log parse operation binding the contract event 0xb33f329db9f4347b4ce64f7b9c2d5fe2d92e95ac9fee76a553543f1338752a45.
//
// Solidity: event AftermarketDeviceNodeBurnedDevAdmin(uint256 indexed adNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceNodeBurnedDevAdmin(log types.Log) (*RegistryAftermarketDeviceNodeBurnedDevAdmin, error) {
	event := new(RegistryAftermarketDeviceNodeBurnedDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceNodeBurnedDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceNodeMintedIterator is returned from FilterAftermarketDeviceNodeMinted and is used to iterate over the raw logs and unpacked data for AftermarketDeviceNodeMinted events raised by the Registry contract.
type RegistryAftermarketDeviceNodeMintedIterator struct {
	Event *RegistryAftermarketDeviceNodeMinted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceNodeMintedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceNodeMinted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceNodeMinted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceNodeMintedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceNodeMintedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceNodeMinted represents a AftermarketDeviceNodeMinted event raised by the Registry contract.
type RegistryAftermarketDeviceNodeMinted struct {
	ManufacturerId           *big.Int
	TokenId                  *big.Int
	AftermarketDeviceAddress common.Address
	Owner                    common.Address
	Raw                      types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceNodeMinted is a free log retrieval operation binding the contract event 0xd624fd4c3311e1803d230d97ce71fd60c4f658c30a31fbe08edcb211fd90f63f.
//
// Solidity: event AftermarketDeviceNodeMinted(uint256 indexed manufacturerId, uint256 tokenId, address indexed aftermarketDeviceAddress, address indexed owner)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceNodeMinted(opts *bind.FilterOpts, manufacturerId []*big.Int, aftermarketDeviceAddress []common.Address, owner []common.Address) (*RegistryAftermarketDeviceNodeMintedIterator, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}

	var aftermarketDeviceAddressRule []interface{}
	for _, aftermarketDeviceAddressItem := range aftermarketDeviceAddress {
		aftermarketDeviceAddressRule = append(aftermarketDeviceAddressRule, aftermarketDeviceAddressItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceNodeMinted", manufacturerIdRule, aftermarketDeviceAddressRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceNodeMintedIterator{contract: _Registry.contract, event: "AftermarketDeviceNodeMinted", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceNodeMinted is a free log subscription operation binding the contract event 0xd624fd4c3311e1803d230d97ce71fd60c4f658c30a31fbe08edcb211fd90f63f.
//
// Solidity: event AftermarketDeviceNodeMinted(uint256 indexed manufacturerId, uint256 tokenId, address indexed aftermarketDeviceAddress, address indexed owner)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceNodeMinted(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceNodeMinted, manufacturerId []*big.Int, aftermarketDeviceAddress []common.Address, owner []common.Address) (event.Subscription, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}

	var aftermarketDeviceAddressRule []interface{}
	for _, aftermarketDeviceAddressItem := range aftermarketDeviceAddress {
		aftermarketDeviceAddressRule = append(aftermarketDeviceAddressRule, aftermarketDeviceAddressItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceNodeMinted", manufacturerIdRule, aftermarketDeviceAddressRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceNodeMinted)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceNodeMinted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceNodeMinted is a log parse operation binding the contract event 0xd624fd4c3311e1803d230d97ce71fd60c4f658c30a31fbe08edcb211fd90f63f.
//
// Solidity: event AftermarketDeviceNodeMinted(uint256 indexed manufacturerId, uint256 tokenId, address indexed aftermarketDeviceAddress, address indexed owner)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceNodeMinted(log types.Log) (*RegistryAftermarketDeviceNodeMinted, error) {
	event := new(RegistryAftermarketDeviceNodeMinted)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceNodeMinted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDevicePairedIterator is returned from FilterAftermarketDevicePaired and is used to iterate over the raw logs and unpacked data for AftermarketDevicePaired events raised by the Registry contract.
type RegistryAftermarketDevicePairedIterator struct {
	Event *RegistryAftermarketDevicePaired // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDevicePairedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDevicePaired)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDevicePaired)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDevicePairedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDevicePairedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDevicePaired represents a AftermarketDevicePaired event raised by the Registry contract.
type RegistryAftermarketDevicePaired struct {
	AftermarketDeviceNode *big.Int
	VehicleNode           *big.Int
	Owner                 common.Address
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDevicePaired is a free log retrieval operation binding the contract event 0x89ec132808bbf01af00b90fd34e04fd6cfb8dba2813ca5446a415500b83c7938.
//
// Solidity: event AftermarketDevicePaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterAftermarketDevicePaired(opts *bind.FilterOpts, owner []common.Address) (*RegistryAftermarketDevicePairedIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDevicePaired", ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDevicePairedIterator{contract: _Registry.contract, event: "AftermarketDevicePaired", logs: logs, sub: sub}, nil
}

// WatchAftermarketDevicePaired is a free log subscription operation binding the contract event 0x89ec132808bbf01af00b90fd34e04fd6cfb8dba2813ca5446a415500b83c7938.
//
// Solidity: event AftermarketDevicePaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchAftermarketDevicePaired(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDevicePaired, owner []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDevicePaired", ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDevicePaired)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDevicePaired", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDevicePaired is a log parse operation binding the contract event 0x89ec132808bbf01af00b90fd34e04fd6cfb8dba2813ca5446a415500b83c7938.
//
// Solidity: event AftermarketDevicePaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseAftermarketDevicePaired(log types.Log) (*RegistryAftermarketDevicePaired, error) {
	event := new(RegistryAftermarketDevicePaired)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDevicePaired", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceTransferredDevAdminIterator is returned from FilterAftermarketDeviceTransferredDevAdmin and is used to iterate over the raw logs and unpacked data for AftermarketDeviceTransferredDevAdmin events raised by the Registry contract.
type RegistryAftermarketDeviceTransferredDevAdminIterator struct {
	Event *RegistryAftermarketDeviceTransferredDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceTransferredDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceTransferredDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceTransferredDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceTransferredDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceTransferredDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceTransferredDevAdmin represents a AftermarketDeviceTransferredDevAdmin event raised by the Registry contract.
type RegistryAftermarketDeviceTransferredDevAdmin struct {
	AftermarketDeviceNode *big.Int
	OldOwner              common.Address
	NewOwner              common.Address
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceTransferredDevAdmin is a free log retrieval operation binding the contract event 0xaabf86a9bd61090827f5b0300192acf8de59d19921c52d81661675293105a8d8.
//
// Solidity: event AftermarketDeviceTransferredDevAdmin(uint256 indexed aftermarketDeviceNode, address indexed oldOwner, address indexed newOwner)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceTransferredDevAdmin(opts *bind.FilterOpts, aftermarketDeviceNode []*big.Int, oldOwner []common.Address, newOwner []common.Address) (*RegistryAftermarketDeviceTransferredDevAdminIterator, error) {

	var aftermarketDeviceNodeRule []interface{}
	for _, aftermarketDeviceNodeItem := range aftermarketDeviceNode {
		aftermarketDeviceNodeRule = append(aftermarketDeviceNodeRule, aftermarketDeviceNodeItem)
	}
	var oldOwnerRule []interface{}
	for _, oldOwnerItem := range oldOwner {
		oldOwnerRule = append(oldOwnerRule, oldOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceTransferredDevAdmin", aftermarketDeviceNodeRule, oldOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceTransferredDevAdminIterator{contract: _Registry.contract, event: "AftermarketDeviceTransferredDevAdmin", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceTransferredDevAdmin is a free log subscription operation binding the contract event 0xaabf86a9bd61090827f5b0300192acf8de59d19921c52d81661675293105a8d8.
//
// Solidity: event AftermarketDeviceTransferredDevAdmin(uint256 indexed aftermarketDeviceNode, address indexed oldOwner, address indexed newOwner)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceTransferredDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceTransferredDevAdmin, aftermarketDeviceNode []*big.Int, oldOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var aftermarketDeviceNodeRule []interface{}
	for _, aftermarketDeviceNodeItem := range aftermarketDeviceNode {
		aftermarketDeviceNodeRule = append(aftermarketDeviceNodeRule, aftermarketDeviceNodeItem)
	}
	var oldOwnerRule []interface{}
	for _, oldOwnerItem := range oldOwner {
		oldOwnerRule = append(oldOwnerRule, oldOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceTransferredDevAdmin", aftermarketDeviceNodeRule, oldOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceTransferredDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceTransferredDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceTransferredDevAdmin is a log parse operation binding the contract event 0xaabf86a9bd61090827f5b0300192acf8de59d19921c52d81661675293105a8d8.
//
// Solidity: event AftermarketDeviceTransferredDevAdmin(uint256 indexed aftermarketDeviceNode, address indexed oldOwner, address indexed newOwner)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceTransferredDevAdmin(log types.Log) (*RegistryAftermarketDeviceTransferredDevAdmin, error) {
	event := new(RegistryAftermarketDeviceTransferredDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceTransferredDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceUnclaimedDevAdminIterator is returned from FilterAftermarketDeviceUnclaimedDevAdmin and is used to iterate over the raw logs and unpacked data for AftermarketDeviceUnclaimedDevAdmin events raised by the Registry contract.
type RegistryAftermarketDeviceUnclaimedDevAdminIterator struct {
	Event *RegistryAftermarketDeviceUnclaimedDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceUnclaimedDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceUnclaimedDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceUnclaimedDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceUnclaimedDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceUnclaimedDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceUnclaimedDevAdmin represents a AftermarketDeviceUnclaimedDevAdmin event raised by the Registry contract.
type RegistryAftermarketDeviceUnclaimedDevAdmin struct {
	AftermarketDeviceNode *big.Int
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceUnclaimedDevAdmin is a free log retrieval operation binding the contract event 0xd2a3fcd44d76e5d8eb77caa34c23f3d95ba16844e0ac03c41fd12c91f799e951.
//
// Solidity: event AftermarketDeviceUnclaimedDevAdmin(uint256 indexed aftermarketDeviceNode)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceUnclaimedDevAdmin(opts *bind.FilterOpts, aftermarketDeviceNode []*big.Int) (*RegistryAftermarketDeviceUnclaimedDevAdminIterator, error) {

	var aftermarketDeviceNodeRule []interface{}
	for _, aftermarketDeviceNodeItem := range aftermarketDeviceNode {
		aftermarketDeviceNodeRule = append(aftermarketDeviceNodeRule, aftermarketDeviceNodeItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceUnclaimedDevAdmin", aftermarketDeviceNodeRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceUnclaimedDevAdminIterator{contract: _Registry.contract, event: "AftermarketDeviceUnclaimedDevAdmin", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceUnclaimedDevAdmin is a free log subscription operation binding the contract event 0xd2a3fcd44d76e5d8eb77caa34c23f3d95ba16844e0ac03c41fd12c91f799e951.
//
// Solidity: event AftermarketDeviceUnclaimedDevAdmin(uint256 indexed aftermarketDeviceNode)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceUnclaimedDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceUnclaimedDevAdmin, aftermarketDeviceNode []*big.Int) (event.Subscription, error) {

	var aftermarketDeviceNodeRule []interface{}
	for _, aftermarketDeviceNodeItem := range aftermarketDeviceNode {
		aftermarketDeviceNodeRule = append(aftermarketDeviceNodeRule, aftermarketDeviceNodeItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceUnclaimedDevAdmin", aftermarketDeviceNodeRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceUnclaimedDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceUnclaimedDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceUnclaimedDevAdmin is a log parse operation binding the contract event 0xd2a3fcd44d76e5d8eb77caa34c23f3d95ba16844e0ac03c41fd12c91f799e951.
//
// Solidity: event AftermarketDeviceUnclaimedDevAdmin(uint256 indexed aftermarketDeviceNode)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceUnclaimedDevAdmin(log types.Log) (*RegistryAftermarketDeviceUnclaimedDevAdmin, error) {
	event := new(RegistryAftermarketDeviceUnclaimedDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceUnclaimedDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceUnpairedIterator is returned from FilterAftermarketDeviceUnpaired and is used to iterate over the raw logs and unpacked data for AftermarketDeviceUnpaired events raised by the Registry contract.
type RegistryAftermarketDeviceUnpairedIterator struct {
	Event *RegistryAftermarketDeviceUnpaired // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceUnpairedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceUnpaired)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceUnpaired)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceUnpairedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceUnpairedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceUnpaired represents a AftermarketDeviceUnpaired event raised by the Registry contract.
type RegistryAftermarketDeviceUnpaired struct {
	AftermarketDeviceNode *big.Int
	VehicleNode           *big.Int
	Owner                 common.Address
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceUnpaired is a free log retrieval operation binding the contract event 0xd9135724aa6cdaa5b3ea73e3e0d74cb1a3a6d3cddcb9d58583f05f17bac82a8e.
//
// Solidity: event AftermarketDeviceUnpaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceUnpaired(opts *bind.FilterOpts, owner []common.Address) (*RegistryAftermarketDeviceUnpairedIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceUnpaired", ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceUnpairedIterator{contract: _Registry.contract, event: "AftermarketDeviceUnpaired", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceUnpaired is a free log subscription operation binding the contract event 0xd9135724aa6cdaa5b3ea73e3e0d74cb1a3a6d3cddcb9d58583f05f17bac82a8e.
//
// Solidity: event AftermarketDeviceUnpaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceUnpaired(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceUnpaired, owner []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceUnpaired", ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceUnpaired)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceUnpaired", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceUnpaired is a log parse operation binding the contract event 0xd9135724aa6cdaa5b3ea73e3e0d74cb1a3a6d3cddcb9d58583f05f17bac82a8e.
//
// Solidity: event AftermarketDeviceUnpaired(uint256 aftermarketDeviceNode, uint256 vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceUnpaired(log types.Log) (*RegistryAftermarketDeviceUnpaired, error) {
	event := new(RegistryAftermarketDeviceUnpaired)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceUnpaired", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryAftermarketDeviceUnpairedDevAdminIterator is returned from FilterAftermarketDeviceUnpairedDevAdmin and is used to iterate over the raw logs and unpacked data for AftermarketDeviceUnpairedDevAdmin events raised by the Registry contract.
type RegistryAftermarketDeviceUnpairedDevAdminIterator struct {
	Event *RegistryAftermarketDeviceUnpairedDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryAftermarketDeviceUnpairedDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryAftermarketDeviceUnpairedDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryAftermarketDeviceUnpairedDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryAftermarketDeviceUnpairedDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryAftermarketDeviceUnpairedDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryAftermarketDeviceUnpairedDevAdmin represents a AftermarketDeviceUnpairedDevAdmin event raised by the Registry contract.
type RegistryAftermarketDeviceUnpairedDevAdmin struct {
	AftermarketDeviceNode *big.Int
	VehicleNode           *big.Int
	Owner                 common.Address
	Raw                   types.Log // Blockchain specific contextual infos
}

// FilterAftermarketDeviceUnpairedDevAdmin is a free log retrieval operation binding the contract event 0x1ba4ec81d8261daefdabcf390fb1434fb92bc9a103e4cdc764ca43fa37d0ab0d.
//
// Solidity: event AftermarketDeviceUnpairedDevAdmin(uint256 indexed aftermarketDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterAftermarketDeviceUnpairedDevAdmin(opts *bind.FilterOpts, aftermarketDeviceNode []*big.Int, vehicleNode []*big.Int, owner []common.Address) (*RegistryAftermarketDeviceUnpairedDevAdminIterator, error) {

	var aftermarketDeviceNodeRule []interface{}
	for _, aftermarketDeviceNodeItem := range aftermarketDeviceNode {
		aftermarketDeviceNodeRule = append(aftermarketDeviceNodeRule, aftermarketDeviceNodeItem)
	}
	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "AftermarketDeviceUnpairedDevAdmin", aftermarketDeviceNodeRule, vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryAftermarketDeviceUnpairedDevAdminIterator{contract: _Registry.contract, event: "AftermarketDeviceUnpairedDevAdmin", logs: logs, sub: sub}, nil
}

// WatchAftermarketDeviceUnpairedDevAdmin is a free log subscription operation binding the contract event 0x1ba4ec81d8261daefdabcf390fb1434fb92bc9a103e4cdc764ca43fa37d0ab0d.
//
// Solidity: event AftermarketDeviceUnpairedDevAdmin(uint256 indexed aftermarketDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchAftermarketDeviceUnpairedDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistryAftermarketDeviceUnpairedDevAdmin, aftermarketDeviceNode []*big.Int, vehicleNode []*big.Int, owner []common.Address) (event.Subscription, error) {

	var aftermarketDeviceNodeRule []interface{}
	for _, aftermarketDeviceNodeItem := range aftermarketDeviceNode {
		aftermarketDeviceNodeRule = append(aftermarketDeviceNodeRule, aftermarketDeviceNodeItem)
	}
	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "AftermarketDeviceUnpairedDevAdmin", aftermarketDeviceNodeRule, vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryAftermarketDeviceUnpairedDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceUnpairedDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAftermarketDeviceUnpairedDevAdmin is a log parse operation binding the contract event 0x1ba4ec81d8261daefdabcf390fb1434fb92bc9a103e4cdc764ca43fa37d0ab0d.
//
// Solidity: event AftermarketDeviceUnpairedDevAdmin(uint256 indexed aftermarketDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseAftermarketDeviceUnpairedDevAdmin(log types.Log) (*RegistryAftermarketDeviceUnpairedDevAdmin, error) {
	event := new(RegistryAftermarketDeviceUnpairedDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "AftermarketDeviceUnpairedDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryBaseDataURISetIterator is returned from FilterBaseDataURISet and is used to iterate over the raw logs and unpacked data for BaseDataURISet events raised by the Registry contract.
type RegistryBaseDataURISetIterator struct {
	Event *RegistryBaseDataURISet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryBaseDataURISetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryBaseDataURISet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryBaseDataURISet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryBaseDataURISetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryBaseDataURISetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryBaseDataURISet represents a BaseDataURISet event raised by the Registry contract.
type RegistryBaseDataURISet struct {
	IdProxyAddress common.Address
	DataUri        string
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterBaseDataURISet is a free log retrieval operation binding the contract event 0x9f53d8a6c486c216c3b3fd5d6d4a133c4d66db260694bc0cfe0696d99458851f.
//
// Solidity: event BaseDataURISet(address idProxyAddress, string dataUri)
func (_Registry *RegistryFilterer) FilterBaseDataURISet(opts *bind.FilterOpts) (*RegistryBaseDataURISetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "BaseDataURISet")
	if err != nil {
		return nil, err
	}
	return &RegistryBaseDataURISetIterator{contract: _Registry.contract, event: "BaseDataURISet", logs: logs, sub: sub}, nil
}

// WatchBaseDataURISet is a free log subscription operation binding the contract event 0x9f53d8a6c486c216c3b3fd5d6d4a133c4d66db260694bc0cfe0696d99458851f.
//
// Solidity: event BaseDataURISet(address idProxyAddress, string dataUri)
func (_Registry *RegistryFilterer) WatchBaseDataURISet(opts *bind.WatchOpts, sink chan<- *RegistryBaseDataURISet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "BaseDataURISet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryBaseDataURISet)
				if err := _Registry.contract.UnpackLog(event, "BaseDataURISet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseBaseDataURISet is a log parse operation binding the contract event 0x9f53d8a6c486c216c3b3fd5d6d4a133c4d66db260694bc0cfe0696d99458851f.
//
// Solidity: event BaseDataURISet(address idProxyAddress, string dataUri)
func (_Registry *RegistryFilterer) ParseBaseDataURISet(log types.Log) (*RegistryBaseDataURISet, error) {
	event := new(RegistryBaseDataURISet)
	if err := _Registry.contract.UnpackLog(event, "BaseDataURISet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryBeneficiarySetIterator is returned from FilterBeneficiarySet and is used to iterate over the raw logs and unpacked data for BeneficiarySet events raised by the Registry contract.
type RegistryBeneficiarySetIterator struct {
	Event *RegistryBeneficiarySet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryBeneficiarySetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryBeneficiarySet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryBeneficiarySet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryBeneficiarySetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryBeneficiarySetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryBeneficiarySet represents a BeneficiarySet event raised by the Registry contract.
type RegistryBeneficiarySet struct {
	IdProxyAddress common.Address
	NodeId         *big.Int
	Beneficiary    common.Address
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterBeneficiarySet is a free log retrieval operation binding the contract event 0xf6f6de47a057b68d993d1ca4c1b8a95e51b10d7efbf516bc3c591eb6c4f209ee.
//
// Solidity: event BeneficiarySet(address indexed idProxyAddress, uint256 indexed nodeId, address indexed beneficiary)
func (_Registry *RegistryFilterer) FilterBeneficiarySet(opts *bind.FilterOpts, idProxyAddress []common.Address, nodeId []*big.Int, beneficiary []common.Address) (*RegistryBeneficiarySetIterator, error) {

	var idProxyAddressRule []interface{}
	for _, idProxyAddressItem := range idProxyAddress {
		idProxyAddressRule = append(idProxyAddressRule, idProxyAddressItem)
	}
	var nodeIdRule []interface{}
	for _, nodeIdItem := range nodeId {
		nodeIdRule = append(nodeIdRule, nodeIdItem)
	}
	var beneficiaryRule []interface{}
	for _, beneficiaryItem := range beneficiary {
		beneficiaryRule = append(beneficiaryRule, beneficiaryItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "BeneficiarySet", idProxyAddressRule, nodeIdRule, beneficiaryRule)
	if err != nil {
		return nil, err
	}
	return &RegistryBeneficiarySetIterator{contract: _Registry.contract, event: "BeneficiarySet", logs: logs, sub: sub}, nil
}

// WatchBeneficiarySet is a free log subscription operation binding the contract event 0xf6f6de47a057b68d993d1ca4c1b8a95e51b10d7efbf516bc3c591eb6c4f209ee.
//
// Solidity: event BeneficiarySet(address indexed idProxyAddress, uint256 indexed nodeId, address indexed beneficiary)
func (_Registry *RegistryFilterer) WatchBeneficiarySet(opts *bind.WatchOpts, sink chan<- *RegistryBeneficiarySet, idProxyAddress []common.Address, nodeId []*big.Int, beneficiary []common.Address) (event.Subscription, error) {

	var idProxyAddressRule []interface{}
	for _, idProxyAddressItem := range idProxyAddress {
		idProxyAddressRule = append(idProxyAddressRule, idProxyAddressItem)
	}
	var nodeIdRule []interface{}
	for _, nodeIdItem := range nodeId {
		nodeIdRule = append(nodeIdRule, nodeIdItem)
	}
	var beneficiaryRule []interface{}
	for _, beneficiaryItem := range beneficiary {
		beneficiaryRule = append(beneficiaryRule, beneficiaryItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "BeneficiarySet", idProxyAddressRule, nodeIdRule, beneficiaryRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryBeneficiarySet)
				if err := _Registry.contract.UnpackLog(event, "BeneficiarySet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseBeneficiarySet is a log parse operation binding the contract event 0xf6f6de47a057b68d993d1ca4c1b8a95e51b10d7efbf516bc3c591eb6c4f209ee.
//
// Solidity: event BeneficiarySet(address indexed idProxyAddress, uint256 indexed nodeId, address indexed beneficiary)
func (_Registry *RegistryFilterer) ParseBeneficiarySet(log types.Log) (*RegistryBeneficiarySet, error) {
	event := new(RegistryBeneficiarySet)
	if err := _Registry.contract.UnpackLog(event, "BeneficiarySet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryControllerSetIterator is returned from FilterControllerSet and is used to iterate over the raw logs and unpacked data for ControllerSet events raised by the Registry contract.
type RegistryControllerSetIterator struct {
	Event *RegistryControllerSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryControllerSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryControllerSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryControllerSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryControllerSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryControllerSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryControllerSet represents a ControllerSet event raised by the Registry contract.
type RegistryControllerSet struct {
	Controller common.Address
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterControllerSet is a free log retrieval operation binding the contract event 0x79f74fd5964b6943d8a1865abfb7f668c92fa3f32c0a2e3195da7d0946703ad7.
//
// Solidity: event ControllerSet(address indexed controller)
func (_Registry *RegistryFilterer) FilterControllerSet(opts *bind.FilterOpts, controller []common.Address) (*RegistryControllerSetIterator, error) {

	var controllerRule []interface{}
	for _, controllerItem := range controller {
		controllerRule = append(controllerRule, controllerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ControllerSet", controllerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryControllerSetIterator{contract: _Registry.contract, event: "ControllerSet", logs: logs, sub: sub}, nil
}

// WatchControllerSet is a free log subscription operation binding the contract event 0x79f74fd5964b6943d8a1865abfb7f668c92fa3f32c0a2e3195da7d0946703ad7.
//
// Solidity: event ControllerSet(address indexed controller)
func (_Registry *RegistryFilterer) WatchControllerSet(opts *bind.WatchOpts, sink chan<- *RegistryControllerSet, controller []common.Address) (event.Subscription, error) {

	var controllerRule []interface{}
	for _, controllerItem := range controller {
		controllerRule = append(controllerRule, controllerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ControllerSet", controllerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryControllerSet)
				if err := _Registry.contract.UnpackLog(event, "ControllerSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseControllerSet is a log parse operation binding the contract event 0x79f74fd5964b6943d8a1865abfb7f668c92fa3f32c0a2e3195da7d0946703ad7.
//
// Solidity: event ControllerSet(address indexed controller)
func (_Registry *RegistryFilterer) ParseControllerSet(log types.Log) (*RegistryControllerSet, error) {
	event := new(RegistryControllerSet)
	if err := _Registry.contract.UnpackLog(event, "ControllerSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryDeviceDefinitionInsertedIterator is returned from FilterDeviceDefinitionInserted and is used to iterate over the raw logs and unpacked data for DeviceDefinitionInserted events raised by the Registry contract.
type RegistryDeviceDefinitionInsertedIterator struct {
	Event *RegistryDeviceDefinitionInserted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryDeviceDefinitionInsertedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryDeviceDefinitionInserted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryDeviceDefinitionInserted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryDeviceDefinitionInsertedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryDeviceDefinitionInsertedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryDeviceDefinitionInserted represents a DeviceDefinitionInserted event raised by the Registry contract.
type RegistryDeviceDefinitionInserted struct {
	TableId *big.Int
	Id      string
	Model   string
	Year    *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterDeviceDefinitionInserted is a free log retrieval operation binding the contract event 0x462ef08cd7ac75ba02b3d84fe43ba15ae23f90a51484c6536057e951c2b629bb.
//
// Solidity: event DeviceDefinitionInserted(uint256 indexed tableId, string id, string model, uint256 year)
func (_Registry *RegistryFilterer) FilterDeviceDefinitionInserted(opts *bind.FilterOpts, tableId []*big.Int) (*RegistryDeviceDefinitionInsertedIterator, error) {

	var tableIdRule []interface{}
	for _, tableIdItem := range tableId {
		tableIdRule = append(tableIdRule, tableIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "DeviceDefinitionInserted", tableIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryDeviceDefinitionInsertedIterator{contract: _Registry.contract, event: "DeviceDefinitionInserted", logs: logs, sub: sub}, nil
}

// WatchDeviceDefinitionInserted is a free log subscription operation binding the contract event 0x462ef08cd7ac75ba02b3d84fe43ba15ae23f90a51484c6536057e951c2b629bb.
//
// Solidity: event DeviceDefinitionInserted(uint256 indexed tableId, string id, string model, uint256 year)
func (_Registry *RegistryFilterer) WatchDeviceDefinitionInserted(opts *bind.WatchOpts, sink chan<- *RegistryDeviceDefinitionInserted, tableId []*big.Int) (event.Subscription, error) {

	var tableIdRule []interface{}
	for _, tableIdItem := range tableId {
		tableIdRule = append(tableIdRule, tableIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "DeviceDefinitionInserted", tableIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryDeviceDefinitionInserted)
				if err := _Registry.contract.UnpackLog(event, "DeviceDefinitionInserted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDeviceDefinitionInserted is a log parse operation binding the contract event 0x462ef08cd7ac75ba02b3d84fe43ba15ae23f90a51484c6536057e951c2b629bb.
//
// Solidity: event DeviceDefinitionInserted(uint256 indexed tableId, string id, string model, uint256 year)
func (_Registry *RegistryFilterer) ParseDeviceDefinitionInserted(log types.Log) (*RegistryDeviceDefinitionInserted, error) {
	event := new(RegistryDeviceDefinitionInserted)
	if err := _Registry.contract.UnpackLog(event, "DeviceDefinitionInserted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryDeviceDefinitionTableCreatedIterator is returned from FilterDeviceDefinitionTableCreated and is used to iterate over the raw logs and unpacked data for DeviceDefinitionTableCreated events raised by the Registry contract.
type RegistryDeviceDefinitionTableCreatedIterator struct {
	Event *RegistryDeviceDefinitionTableCreated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryDeviceDefinitionTableCreatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryDeviceDefinitionTableCreated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryDeviceDefinitionTableCreated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryDeviceDefinitionTableCreatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryDeviceDefinitionTableCreatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryDeviceDefinitionTableCreated represents a DeviceDefinitionTableCreated event raised by the Registry contract.
type RegistryDeviceDefinitionTableCreated struct {
	TableOwner     common.Address
	ManufacturerId *big.Int
	TableId        *big.Int
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterDeviceDefinitionTableCreated is a free log retrieval operation binding the contract event 0x34045c03bca909729abb696ffeefc454874a5b7967ee473daeafa7b45c91999e.
//
// Solidity: event DeviceDefinitionTableCreated(address indexed tableOwner, uint256 indexed manufacturerId, uint256 indexed tableId)
func (_Registry *RegistryFilterer) FilterDeviceDefinitionTableCreated(opts *bind.FilterOpts, tableOwner []common.Address, manufacturerId []*big.Int, tableId []*big.Int) (*RegistryDeviceDefinitionTableCreatedIterator, error) {

	var tableOwnerRule []interface{}
	for _, tableOwnerItem := range tableOwner {
		tableOwnerRule = append(tableOwnerRule, tableOwnerItem)
	}
	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var tableIdRule []interface{}
	for _, tableIdItem := range tableId {
		tableIdRule = append(tableIdRule, tableIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "DeviceDefinitionTableCreated", tableOwnerRule, manufacturerIdRule, tableIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryDeviceDefinitionTableCreatedIterator{contract: _Registry.contract, event: "DeviceDefinitionTableCreated", logs: logs, sub: sub}, nil
}

// WatchDeviceDefinitionTableCreated is a free log subscription operation binding the contract event 0x34045c03bca909729abb696ffeefc454874a5b7967ee473daeafa7b45c91999e.
//
// Solidity: event DeviceDefinitionTableCreated(address indexed tableOwner, uint256 indexed manufacturerId, uint256 indexed tableId)
func (_Registry *RegistryFilterer) WatchDeviceDefinitionTableCreated(opts *bind.WatchOpts, sink chan<- *RegistryDeviceDefinitionTableCreated, tableOwner []common.Address, manufacturerId []*big.Int, tableId []*big.Int) (event.Subscription, error) {

	var tableOwnerRule []interface{}
	for _, tableOwnerItem := range tableOwner {
		tableOwnerRule = append(tableOwnerRule, tableOwnerItem)
	}
	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var tableIdRule []interface{}
	for _, tableIdItem := range tableId {
		tableIdRule = append(tableIdRule, tableIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "DeviceDefinitionTableCreated", tableOwnerRule, manufacturerIdRule, tableIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryDeviceDefinitionTableCreated)
				if err := _Registry.contract.UnpackLog(event, "DeviceDefinitionTableCreated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDeviceDefinitionTableCreated is a log parse operation binding the contract event 0x34045c03bca909729abb696ffeefc454874a5b7967ee473daeafa7b45c91999e.
//
// Solidity: event DeviceDefinitionTableCreated(address indexed tableOwner, uint256 indexed manufacturerId, uint256 indexed tableId)
func (_Registry *RegistryFilterer) ParseDeviceDefinitionTableCreated(log types.Log) (*RegistryDeviceDefinitionTableCreated, error) {
	event := new(RegistryDeviceDefinitionTableCreated)
	if err := _Registry.contract.UnpackLog(event, "DeviceDefinitionTableCreated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryDimoStreamrEnsSetIterator is returned from FilterDimoStreamrEnsSet and is used to iterate over the raw logs and unpacked data for DimoStreamrEnsSet events raised by the Registry contract.
type RegistryDimoStreamrEnsSetIterator struct {
	Event *RegistryDimoStreamrEnsSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryDimoStreamrEnsSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryDimoStreamrEnsSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryDimoStreamrEnsSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryDimoStreamrEnsSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryDimoStreamrEnsSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryDimoStreamrEnsSet represents a DimoStreamrEnsSet event raised by the Registry contract.
type RegistryDimoStreamrEnsSet struct {
	DimoStreamrEns string
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterDimoStreamrEnsSet is a free log retrieval operation binding the contract event 0x5c6e4ce43bdb4e1b32c15a4e01073b36c28f6f16a024609785a545634d83ba69.
//
// Solidity: event DimoStreamrEnsSet(string dimoStreamrEns)
func (_Registry *RegistryFilterer) FilterDimoStreamrEnsSet(opts *bind.FilterOpts) (*RegistryDimoStreamrEnsSetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "DimoStreamrEnsSet")
	if err != nil {
		return nil, err
	}
	return &RegistryDimoStreamrEnsSetIterator{contract: _Registry.contract, event: "DimoStreamrEnsSet", logs: logs, sub: sub}, nil
}

// WatchDimoStreamrEnsSet is a free log subscription operation binding the contract event 0x5c6e4ce43bdb4e1b32c15a4e01073b36c28f6f16a024609785a545634d83ba69.
//
// Solidity: event DimoStreamrEnsSet(string dimoStreamrEns)
func (_Registry *RegistryFilterer) WatchDimoStreamrEnsSet(opts *bind.WatchOpts, sink chan<- *RegistryDimoStreamrEnsSet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "DimoStreamrEnsSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryDimoStreamrEnsSet)
				if err := _Registry.contract.UnpackLog(event, "DimoStreamrEnsSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDimoStreamrEnsSet is a log parse operation binding the contract event 0x5c6e4ce43bdb4e1b32c15a4e01073b36c28f6f16a024609785a545634d83ba69.
//
// Solidity: event DimoStreamrEnsSet(string dimoStreamrEns)
func (_Registry *RegistryFilterer) ParseDimoStreamrEnsSet(log types.Log) (*RegistryDimoStreamrEnsSet, error) {
	event := new(RegistryDimoStreamrEnsSet)
	if err := _Registry.contract.UnpackLog(event, "DimoStreamrEnsSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryDimoStreamrNodeSetIterator is returned from FilterDimoStreamrNodeSet and is used to iterate over the raw logs and unpacked data for DimoStreamrNodeSet events raised by the Registry contract.
type RegistryDimoStreamrNodeSetIterator struct {
	Event *RegistryDimoStreamrNodeSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryDimoStreamrNodeSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryDimoStreamrNodeSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryDimoStreamrNodeSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryDimoStreamrNodeSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryDimoStreamrNodeSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryDimoStreamrNodeSet represents a DimoStreamrNodeSet event raised by the Registry contract.
type RegistryDimoStreamrNodeSet struct {
	DimoStreamrNode common.Address
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterDimoStreamrNodeSet is a free log retrieval operation binding the contract event 0x49a3b2d583fcf868092d6cb62f348da2ae9e03698d56a5104a9dd5ea5cafbae7.
//
// Solidity: event DimoStreamrNodeSet(address dimoStreamrNode)
func (_Registry *RegistryFilterer) FilterDimoStreamrNodeSet(opts *bind.FilterOpts) (*RegistryDimoStreamrNodeSetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "DimoStreamrNodeSet")
	if err != nil {
		return nil, err
	}
	return &RegistryDimoStreamrNodeSetIterator{contract: _Registry.contract, event: "DimoStreamrNodeSet", logs: logs, sub: sub}, nil
}

// WatchDimoStreamrNodeSet is a free log subscription operation binding the contract event 0x49a3b2d583fcf868092d6cb62f348da2ae9e03698d56a5104a9dd5ea5cafbae7.
//
// Solidity: event DimoStreamrNodeSet(address dimoStreamrNode)
func (_Registry *RegistryFilterer) WatchDimoStreamrNodeSet(opts *bind.WatchOpts, sink chan<- *RegistryDimoStreamrNodeSet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "DimoStreamrNodeSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryDimoStreamrNodeSet)
				if err := _Registry.contract.UnpackLog(event, "DimoStreamrNodeSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseDimoStreamrNodeSet is a log parse operation binding the contract event 0x49a3b2d583fcf868092d6cb62f348da2ae9e03698d56a5104a9dd5ea5cafbae7.
//
// Solidity: event DimoStreamrNodeSet(address dimoStreamrNode)
func (_Registry *RegistryFilterer) ParseDimoStreamrNodeSet(log types.Log) (*RegistryDimoStreamrNodeSet, error) {
	event := new(RegistryDimoStreamrNodeSet)
	if err := _Registry.contract.UnpackLog(event, "DimoStreamrNodeSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryIntegrationAttributeAddedIterator is returned from FilterIntegrationAttributeAdded and is used to iterate over the raw logs and unpacked data for IntegrationAttributeAdded events raised by the Registry contract.
type RegistryIntegrationAttributeAddedIterator struct {
	Event *RegistryIntegrationAttributeAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryIntegrationAttributeAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryIntegrationAttributeAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryIntegrationAttributeAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryIntegrationAttributeAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryIntegrationAttributeAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryIntegrationAttributeAdded represents a IntegrationAttributeAdded event raised by the Registry contract.
type RegistryIntegrationAttributeAdded struct {
	Attribute string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterIntegrationAttributeAdded is a free log retrieval operation binding the contract event 0x8a60d58f652ffe56b0987cf68f5cf87f9b67e2ceeadfc9de04d2620141749504.
//
// Solidity: event IntegrationAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) FilterIntegrationAttributeAdded(opts *bind.FilterOpts) (*RegistryIntegrationAttributeAddedIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "IntegrationAttributeAdded")
	if err != nil {
		return nil, err
	}
	return &RegistryIntegrationAttributeAddedIterator{contract: _Registry.contract, event: "IntegrationAttributeAdded", logs: logs, sub: sub}, nil
}

// WatchIntegrationAttributeAdded is a free log subscription operation binding the contract event 0x8a60d58f652ffe56b0987cf68f5cf87f9b67e2ceeadfc9de04d2620141749504.
//
// Solidity: event IntegrationAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) WatchIntegrationAttributeAdded(opts *bind.WatchOpts, sink chan<- *RegistryIntegrationAttributeAdded) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "IntegrationAttributeAdded")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryIntegrationAttributeAdded)
				if err := _Registry.contract.UnpackLog(event, "IntegrationAttributeAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseIntegrationAttributeAdded is a log parse operation binding the contract event 0x8a60d58f652ffe56b0987cf68f5cf87f9b67e2ceeadfc9de04d2620141749504.
//
// Solidity: event IntegrationAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) ParseIntegrationAttributeAdded(log types.Log) (*RegistryIntegrationAttributeAdded, error) {
	event := new(RegistryIntegrationAttributeAdded)
	if err := _Registry.contract.UnpackLog(event, "IntegrationAttributeAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryIntegrationAttributeSetIterator is returned from FilterIntegrationAttributeSet and is used to iterate over the raw logs and unpacked data for IntegrationAttributeSet events raised by the Registry contract.
type RegistryIntegrationAttributeSetIterator struct {
	Event *RegistryIntegrationAttributeSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryIntegrationAttributeSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryIntegrationAttributeSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryIntegrationAttributeSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryIntegrationAttributeSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryIntegrationAttributeSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryIntegrationAttributeSet represents a IntegrationAttributeSet event raised by the Registry contract.
type RegistryIntegrationAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterIntegrationAttributeSet is a free log retrieval operation binding the contract event 0x7ad258fae6070243285178171825b61e931d6d4786b7964aa4268e3dd8635f5b.
//
// Solidity: event IntegrationAttributeSet(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterIntegrationAttributeSet(opts *bind.FilterOpts, tokenId []*big.Int) (*RegistryIntegrationAttributeSetIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "IntegrationAttributeSet", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryIntegrationAttributeSetIterator{contract: _Registry.contract, event: "IntegrationAttributeSet", logs: logs, sub: sub}, nil
}

// WatchIntegrationAttributeSet is a free log subscription operation binding the contract event 0x7ad258fae6070243285178171825b61e931d6d4786b7964aa4268e3dd8635f5b.
//
// Solidity: event IntegrationAttributeSet(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchIntegrationAttributeSet(opts *bind.WatchOpts, sink chan<- *RegistryIntegrationAttributeSet, tokenId []*big.Int) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "IntegrationAttributeSet", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryIntegrationAttributeSet)
				if err := _Registry.contract.UnpackLog(event, "IntegrationAttributeSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseIntegrationAttributeSet is a log parse operation binding the contract event 0x7ad258fae6070243285178171825b61e931d6d4786b7964aa4268e3dd8635f5b.
//
// Solidity: event IntegrationAttributeSet(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseIntegrationAttributeSet(log types.Log) (*RegistryIntegrationAttributeSet, error) {
	event := new(RegistryIntegrationAttributeSet)
	if err := _Registry.contract.UnpackLog(event, "IntegrationAttributeSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryIntegrationIdProxySetIterator is returned from FilterIntegrationIdProxySet and is used to iterate over the raw logs and unpacked data for IntegrationIdProxySet events raised by the Registry contract.
type RegistryIntegrationIdProxySetIterator struct {
	Event *RegistryIntegrationIdProxySet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryIntegrationIdProxySetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryIntegrationIdProxySet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryIntegrationIdProxySet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryIntegrationIdProxySetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryIntegrationIdProxySetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryIntegrationIdProxySet represents a IntegrationIdProxySet event raised by the Registry contract.
type RegistryIntegrationIdProxySet struct {
	Proxy common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterIntegrationIdProxySet is a free log retrieval operation binding the contract event 0x25dd5f73797a6c0ea7e44d94e7c58a4fdee93b784c99db224ba8a49832741ac2.
//
// Solidity: event IntegrationIdProxySet(address proxy)
func (_Registry *RegistryFilterer) FilterIntegrationIdProxySet(opts *bind.FilterOpts) (*RegistryIntegrationIdProxySetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "IntegrationIdProxySet")
	if err != nil {
		return nil, err
	}
	return &RegistryIntegrationIdProxySetIterator{contract: _Registry.contract, event: "IntegrationIdProxySet", logs: logs, sub: sub}, nil
}

// WatchIntegrationIdProxySet is a free log subscription operation binding the contract event 0x25dd5f73797a6c0ea7e44d94e7c58a4fdee93b784c99db224ba8a49832741ac2.
//
// Solidity: event IntegrationIdProxySet(address proxy)
func (_Registry *RegistryFilterer) WatchIntegrationIdProxySet(opts *bind.WatchOpts, sink chan<- *RegistryIntegrationIdProxySet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "IntegrationIdProxySet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryIntegrationIdProxySet)
				if err := _Registry.contract.UnpackLog(event, "IntegrationIdProxySet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseIntegrationIdProxySet is a log parse operation binding the contract event 0x25dd5f73797a6c0ea7e44d94e7c58a4fdee93b784c99db224ba8a49832741ac2.
//
// Solidity: event IntegrationIdProxySet(address proxy)
func (_Registry *RegistryFilterer) ParseIntegrationIdProxySet(log types.Log) (*RegistryIntegrationIdProxySet, error) {
	event := new(RegistryIntegrationIdProxySet)
	if err := _Registry.contract.UnpackLog(event, "IntegrationIdProxySet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryIntegrationNodeMintedIterator is returned from FilterIntegrationNodeMinted and is used to iterate over the raw logs and unpacked data for IntegrationNodeMinted events raised by the Registry contract.
type RegistryIntegrationNodeMintedIterator struct {
	Event *RegistryIntegrationNodeMinted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryIntegrationNodeMintedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryIntegrationNodeMinted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryIntegrationNodeMinted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryIntegrationNodeMintedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryIntegrationNodeMintedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryIntegrationNodeMinted represents a IntegrationNodeMinted event raised by the Registry contract.
type RegistryIntegrationNodeMinted struct {
	TokenId *big.Int
	Owner   common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterIntegrationNodeMinted is a free log retrieval operation binding the contract event 0x98490372c5dc5c685bd6d9efd43eaf17e5ac95f4d4a77be5a2769330e0afa2e9.
//
// Solidity: event IntegrationNodeMinted(uint256 indexed tokenId, address indexed owner)
func (_Registry *RegistryFilterer) FilterIntegrationNodeMinted(opts *bind.FilterOpts, tokenId []*big.Int, owner []common.Address) (*RegistryIntegrationNodeMintedIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "IntegrationNodeMinted", tokenIdRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryIntegrationNodeMintedIterator{contract: _Registry.contract, event: "IntegrationNodeMinted", logs: logs, sub: sub}, nil
}

// WatchIntegrationNodeMinted is a free log subscription operation binding the contract event 0x98490372c5dc5c685bd6d9efd43eaf17e5ac95f4d4a77be5a2769330e0afa2e9.
//
// Solidity: event IntegrationNodeMinted(uint256 indexed tokenId, address indexed owner)
func (_Registry *RegistryFilterer) WatchIntegrationNodeMinted(opts *bind.WatchOpts, sink chan<- *RegistryIntegrationNodeMinted, tokenId []*big.Int, owner []common.Address) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "IntegrationNodeMinted", tokenIdRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryIntegrationNodeMinted)
				if err := _Registry.contract.UnpackLog(event, "IntegrationNodeMinted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseIntegrationNodeMinted is a log parse operation binding the contract event 0x98490372c5dc5c685bd6d9efd43eaf17e5ac95f4d4a77be5a2769330e0afa2e9.
//
// Solidity: event IntegrationNodeMinted(uint256 indexed tokenId, address indexed owner)
func (_Registry *RegistryFilterer) ParseIntegrationNodeMinted(log types.Log) (*RegistryIntegrationNodeMinted, error) {
	event := new(RegistryIntegrationNodeMinted)
	if err := _Registry.contract.UnpackLog(event, "IntegrationNodeMinted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryManufacturerAttributeAddedIterator is returned from FilterManufacturerAttributeAdded and is used to iterate over the raw logs and unpacked data for ManufacturerAttributeAdded events raised by the Registry contract.
type RegistryManufacturerAttributeAddedIterator struct {
	Event *RegistryManufacturerAttributeAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryManufacturerAttributeAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryManufacturerAttributeAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryManufacturerAttributeAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryManufacturerAttributeAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryManufacturerAttributeAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryManufacturerAttributeAdded represents a ManufacturerAttributeAdded event raised by the Registry contract.
type RegistryManufacturerAttributeAdded struct {
	Attribute string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterManufacturerAttributeAdded is a free log retrieval operation binding the contract event 0x47ff34ba477617ab4dc2aefe5ea26ba19a207b052ec44d59b86c2ff3e7fd53b3.
//
// Solidity: event ManufacturerAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) FilterManufacturerAttributeAdded(opts *bind.FilterOpts) (*RegistryManufacturerAttributeAddedIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ManufacturerAttributeAdded")
	if err != nil {
		return nil, err
	}
	return &RegistryManufacturerAttributeAddedIterator{contract: _Registry.contract, event: "ManufacturerAttributeAdded", logs: logs, sub: sub}, nil
}

// WatchManufacturerAttributeAdded is a free log subscription operation binding the contract event 0x47ff34ba477617ab4dc2aefe5ea26ba19a207b052ec44d59b86c2ff3e7fd53b3.
//
// Solidity: event ManufacturerAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) WatchManufacturerAttributeAdded(opts *bind.WatchOpts, sink chan<- *RegistryManufacturerAttributeAdded) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ManufacturerAttributeAdded")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryManufacturerAttributeAdded)
				if err := _Registry.contract.UnpackLog(event, "ManufacturerAttributeAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseManufacturerAttributeAdded is a log parse operation binding the contract event 0x47ff34ba477617ab4dc2aefe5ea26ba19a207b052ec44d59b86c2ff3e7fd53b3.
//
// Solidity: event ManufacturerAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) ParseManufacturerAttributeAdded(log types.Log) (*RegistryManufacturerAttributeAdded, error) {
	event := new(RegistryManufacturerAttributeAdded)
	if err := _Registry.contract.UnpackLog(event, "ManufacturerAttributeAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryManufacturerAttributeSetIterator is returned from FilterManufacturerAttributeSet and is used to iterate over the raw logs and unpacked data for ManufacturerAttributeSet events raised by the Registry contract.
type RegistryManufacturerAttributeSetIterator struct {
	Event *RegistryManufacturerAttributeSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryManufacturerAttributeSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryManufacturerAttributeSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryManufacturerAttributeSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryManufacturerAttributeSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryManufacturerAttributeSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryManufacturerAttributeSet represents a ManufacturerAttributeSet event raised by the Registry contract.
type RegistryManufacturerAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterManufacturerAttributeSet is a free log retrieval operation binding the contract event 0xb81a4ce1a42b79dd48c79a2c5a0b170cebf3c78b5ecb25df31066eb9b656a929.
//
// Solidity: event ManufacturerAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterManufacturerAttributeSet(opts *bind.FilterOpts) (*RegistryManufacturerAttributeSetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ManufacturerAttributeSet")
	if err != nil {
		return nil, err
	}
	return &RegistryManufacturerAttributeSetIterator{contract: _Registry.contract, event: "ManufacturerAttributeSet", logs: logs, sub: sub}, nil
}

// WatchManufacturerAttributeSet is a free log subscription operation binding the contract event 0xb81a4ce1a42b79dd48c79a2c5a0b170cebf3c78b5ecb25df31066eb9b656a929.
//
// Solidity: event ManufacturerAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchManufacturerAttributeSet(opts *bind.WatchOpts, sink chan<- *RegistryManufacturerAttributeSet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ManufacturerAttributeSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryManufacturerAttributeSet)
				if err := _Registry.contract.UnpackLog(event, "ManufacturerAttributeSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseManufacturerAttributeSet is a log parse operation binding the contract event 0xb81a4ce1a42b79dd48c79a2c5a0b170cebf3c78b5ecb25df31066eb9b656a929.
//
// Solidity: event ManufacturerAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseManufacturerAttributeSet(log types.Log) (*RegistryManufacturerAttributeSet, error) {
	event := new(RegistryManufacturerAttributeSet)
	if err := _Registry.contract.UnpackLog(event, "ManufacturerAttributeSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryManufacturerIdProxySetIterator is returned from FilterManufacturerIdProxySet and is used to iterate over the raw logs and unpacked data for ManufacturerIdProxySet events raised by the Registry contract.
type RegistryManufacturerIdProxySetIterator struct {
	Event *RegistryManufacturerIdProxySet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryManufacturerIdProxySetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryManufacturerIdProxySet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryManufacturerIdProxySet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryManufacturerIdProxySetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryManufacturerIdProxySetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryManufacturerIdProxySet represents a ManufacturerIdProxySet event raised by the Registry contract.
type RegistryManufacturerIdProxySet struct {
	Proxy common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterManufacturerIdProxySet is a free log retrieval operation binding the contract event 0xf9bca5f2d5444f9fbb6e6d0fb2b4c2cda766bd110a1326420b883ffc6978f5e2.
//
// Solidity: event ManufacturerIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) FilterManufacturerIdProxySet(opts *bind.FilterOpts, proxy []common.Address) (*RegistryManufacturerIdProxySetIterator, error) {

	var proxyRule []interface{}
	for _, proxyItem := range proxy {
		proxyRule = append(proxyRule, proxyItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ManufacturerIdProxySet", proxyRule)
	if err != nil {
		return nil, err
	}
	return &RegistryManufacturerIdProxySetIterator{contract: _Registry.contract, event: "ManufacturerIdProxySet", logs: logs, sub: sub}, nil
}

// WatchManufacturerIdProxySet is a free log subscription operation binding the contract event 0xf9bca5f2d5444f9fbb6e6d0fb2b4c2cda766bd110a1326420b883ffc6978f5e2.
//
// Solidity: event ManufacturerIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) WatchManufacturerIdProxySet(opts *bind.WatchOpts, sink chan<- *RegistryManufacturerIdProxySet, proxy []common.Address) (event.Subscription, error) {

	var proxyRule []interface{}
	for _, proxyItem := range proxy {
		proxyRule = append(proxyRule, proxyItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ManufacturerIdProxySet", proxyRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryManufacturerIdProxySet)
				if err := _Registry.contract.UnpackLog(event, "ManufacturerIdProxySet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseManufacturerIdProxySet is a log parse operation binding the contract event 0xf9bca5f2d5444f9fbb6e6d0fb2b4c2cda766bd110a1326420b883ffc6978f5e2.
//
// Solidity: event ManufacturerIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) ParseManufacturerIdProxySet(log types.Log) (*RegistryManufacturerIdProxySet, error) {
	event := new(RegistryManufacturerIdProxySet)
	if err := _Registry.contract.UnpackLog(event, "ManufacturerIdProxySet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryManufacturerNodeMintedIterator is returned from FilterManufacturerNodeMinted and is used to iterate over the raw logs and unpacked data for ManufacturerNodeMinted events raised by the Registry contract.
type RegistryManufacturerNodeMintedIterator struct {
	Event *RegistryManufacturerNodeMinted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryManufacturerNodeMintedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryManufacturerNodeMinted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryManufacturerNodeMinted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryManufacturerNodeMintedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryManufacturerNodeMintedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryManufacturerNodeMinted represents a ManufacturerNodeMinted event raised by the Registry contract.
type RegistryManufacturerNodeMinted struct {
	Name    string
	TokenId *big.Int
	Owner   common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterManufacturerNodeMinted is a free log retrieval operation binding the contract event 0xc1279f9a9b23f63ed6e8fe22568fdb1962597404fb8ecb1d4b1722ac5e7a4343.
//
// Solidity: event ManufacturerNodeMinted(string name, uint256 tokenId, address indexed owner)
func (_Registry *RegistryFilterer) FilterManufacturerNodeMinted(opts *bind.FilterOpts, owner []common.Address) (*RegistryManufacturerNodeMintedIterator, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ManufacturerNodeMinted", ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryManufacturerNodeMintedIterator{contract: _Registry.contract, event: "ManufacturerNodeMinted", logs: logs, sub: sub}, nil
}

// WatchManufacturerNodeMinted is a free log subscription operation binding the contract event 0xc1279f9a9b23f63ed6e8fe22568fdb1962597404fb8ecb1d4b1722ac5e7a4343.
//
// Solidity: event ManufacturerNodeMinted(string name, uint256 tokenId, address indexed owner)
func (_Registry *RegistryFilterer) WatchManufacturerNodeMinted(opts *bind.WatchOpts, sink chan<- *RegistryManufacturerNodeMinted, owner []common.Address) (event.Subscription, error) {

	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ManufacturerNodeMinted", ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryManufacturerNodeMinted)
				if err := _Registry.contract.UnpackLog(event, "ManufacturerNodeMinted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseManufacturerNodeMinted is a log parse operation binding the contract event 0xc1279f9a9b23f63ed6e8fe22568fdb1962597404fb8ecb1d4b1722ac5e7a4343.
//
// Solidity: event ManufacturerNodeMinted(string name, uint256 tokenId, address indexed owner)
func (_Registry *RegistryFilterer) ParseManufacturerNodeMinted(log types.Log) (*RegistryManufacturerNodeMinted, error) {
	event := new(RegistryManufacturerNodeMinted)
	if err := _Registry.contract.UnpackLog(event, "ManufacturerNodeMinted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryManufacturerTableSetIterator is returned from FilterManufacturerTableSet and is used to iterate over the raw logs and unpacked data for ManufacturerTableSet events raised by the Registry contract.
type RegistryManufacturerTableSetIterator struct {
	Event *RegistryManufacturerTableSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryManufacturerTableSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryManufacturerTableSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryManufacturerTableSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryManufacturerTableSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryManufacturerTableSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryManufacturerTableSet represents a ManufacturerTableSet event raised by the Registry contract.
type RegistryManufacturerTableSet struct {
	ManufacturerId *big.Int
	TableId        *big.Int
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterManufacturerTableSet is a free log retrieval operation binding the contract event 0x753affc1c97f48f4eb21cf9ca5906ba280ab310171483c29e73826d74505b3cf.
//
// Solidity: event ManufacturerTableSet(uint256 indexed manufacturerId, uint256 indexed tableId)
func (_Registry *RegistryFilterer) FilterManufacturerTableSet(opts *bind.FilterOpts, manufacturerId []*big.Int, tableId []*big.Int) (*RegistryManufacturerTableSetIterator, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var tableIdRule []interface{}
	for _, tableIdItem := range tableId {
		tableIdRule = append(tableIdRule, tableIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ManufacturerTableSet", manufacturerIdRule, tableIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryManufacturerTableSetIterator{contract: _Registry.contract, event: "ManufacturerTableSet", logs: logs, sub: sub}, nil
}

// WatchManufacturerTableSet is a free log subscription operation binding the contract event 0x753affc1c97f48f4eb21cf9ca5906ba280ab310171483c29e73826d74505b3cf.
//
// Solidity: event ManufacturerTableSet(uint256 indexed manufacturerId, uint256 indexed tableId)
func (_Registry *RegistryFilterer) WatchManufacturerTableSet(opts *bind.WatchOpts, sink chan<- *RegistryManufacturerTableSet, manufacturerId []*big.Int, tableId []*big.Int) (event.Subscription, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var tableIdRule []interface{}
	for _, tableIdItem := range tableId {
		tableIdRule = append(tableIdRule, tableIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ManufacturerTableSet", manufacturerIdRule, tableIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryManufacturerTableSet)
				if err := _Registry.contract.UnpackLog(event, "ManufacturerTableSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseManufacturerTableSet is a log parse operation binding the contract event 0x753affc1c97f48f4eb21cf9ca5906ba280ab310171483c29e73826d74505b3cf.
//
// Solidity: event ManufacturerTableSet(uint256 indexed manufacturerId, uint256 indexed tableId)
func (_Registry *RegistryFilterer) ParseManufacturerTableSet(log types.Log) (*RegistryManufacturerTableSet, error) {
	event := new(RegistryManufacturerTableSet)
	if err := _Registry.contract.UnpackLog(event, "ManufacturerTableSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryModuleAddedIterator is returned from FilterModuleAdded and is used to iterate over the raw logs and unpacked data for ModuleAdded events raised by the Registry contract.
type RegistryModuleAddedIterator struct {
	Event *RegistryModuleAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryModuleAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryModuleAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryModuleAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryModuleAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryModuleAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryModuleAdded represents a ModuleAdded event raised by the Registry contract.
type RegistryModuleAdded struct {
	ModuleAddr common.Address
	Selectors  [][4]byte
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterModuleAdded is a free log retrieval operation binding the contract event 0x02d0c334c706cd2f08faf7bc03674fc7f3970dd8921776c655069cde33b7fb29.
//
// Solidity: event ModuleAdded(address indexed moduleAddr, bytes4[] selectors)
func (_Registry *RegistryFilterer) FilterModuleAdded(opts *bind.FilterOpts, moduleAddr []common.Address) (*RegistryModuleAddedIterator, error) {

	var moduleAddrRule []interface{}
	for _, moduleAddrItem := range moduleAddr {
		moduleAddrRule = append(moduleAddrRule, moduleAddrItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ModuleAdded", moduleAddrRule)
	if err != nil {
		return nil, err
	}
	return &RegistryModuleAddedIterator{contract: _Registry.contract, event: "ModuleAdded", logs: logs, sub: sub}, nil
}

// WatchModuleAdded is a free log subscription operation binding the contract event 0x02d0c334c706cd2f08faf7bc03674fc7f3970dd8921776c655069cde33b7fb29.
//
// Solidity: event ModuleAdded(address indexed moduleAddr, bytes4[] selectors)
func (_Registry *RegistryFilterer) WatchModuleAdded(opts *bind.WatchOpts, sink chan<- *RegistryModuleAdded, moduleAddr []common.Address) (event.Subscription, error) {

	var moduleAddrRule []interface{}
	for _, moduleAddrItem := range moduleAddr {
		moduleAddrRule = append(moduleAddrRule, moduleAddrItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ModuleAdded", moduleAddrRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryModuleAdded)
				if err := _Registry.contract.UnpackLog(event, "ModuleAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseModuleAdded is a log parse operation binding the contract event 0x02d0c334c706cd2f08faf7bc03674fc7f3970dd8921776c655069cde33b7fb29.
//
// Solidity: event ModuleAdded(address indexed moduleAddr, bytes4[] selectors)
func (_Registry *RegistryFilterer) ParseModuleAdded(log types.Log) (*RegistryModuleAdded, error) {
	event := new(RegistryModuleAdded)
	if err := _Registry.contract.UnpackLog(event, "ModuleAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryModuleRemovedIterator is returned from FilterModuleRemoved and is used to iterate over the raw logs and unpacked data for ModuleRemoved events raised by the Registry contract.
type RegistryModuleRemovedIterator struct {
	Event *RegistryModuleRemoved // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryModuleRemovedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryModuleRemoved)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryModuleRemoved)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryModuleRemovedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryModuleRemovedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryModuleRemoved represents a ModuleRemoved event raised by the Registry contract.
type RegistryModuleRemoved struct {
	ModuleAddr common.Address
	Selectors  [][4]byte
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterModuleRemoved is a free log retrieval operation binding the contract event 0x7c3eb4f9083f75cbed2bd3f703e24b4bbcb77d345d3c50945f3abf3e967755cb.
//
// Solidity: event ModuleRemoved(address indexed moduleAddr, bytes4[] selectors)
func (_Registry *RegistryFilterer) FilterModuleRemoved(opts *bind.FilterOpts, moduleAddr []common.Address) (*RegistryModuleRemovedIterator, error) {

	var moduleAddrRule []interface{}
	for _, moduleAddrItem := range moduleAddr {
		moduleAddrRule = append(moduleAddrRule, moduleAddrItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ModuleRemoved", moduleAddrRule)
	if err != nil {
		return nil, err
	}
	return &RegistryModuleRemovedIterator{contract: _Registry.contract, event: "ModuleRemoved", logs: logs, sub: sub}, nil
}

// WatchModuleRemoved is a free log subscription operation binding the contract event 0x7c3eb4f9083f75cbed2bd3f703e24b4bbcb77d345d3c50945f3abf3e967755cb.
//
// Solidity: event ModuleRemoved(address indexed moduleAddr, bytes4[] selectors)
func (_Registry *RegistryFilterer) WatchModuleRemoved(opts *bind.WatchOpts, sink chan<- *RegistryModuleRemoved, moduleAddr []common.Address) (event.Subscription, error) {

	var moduleAddrRule []interface{}
	for _, moduleAddrItem := range moduleAddr {
		moduleAddrRule = append(moduleAddrRule, moduleAddrItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ModuleRemoved", moduleAddrRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryModuleRemoved)
				if err := _Registry.contract.UnpackLog(event, "ModuleRemoved", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseModuleRemoved is a log parse operation binding the contract event 0x7c3eb4f9083f75cbed2bd3f703e24b4bbcb77d345d3c50945f3abf3e967755cb.
//
// Solidity: event ModuleRemoved(address indexed moduleAddr, bytes4[] selectors)
func (_Registry *RegistryFilterer) ParseModuleRemoved(log types.Log) (*RegistryModuleRemoved, error) {
	event := new(RegistryModuleRemoved)
	if err := _Registry.contract.UnpackLog(event, "ModuleRemoved", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryModuleUpdatedIterator is returned from FilterModuleUpdated and is used to iterate over the raw logs and unpacked data for ModuleUpdated events raised by the Registry contract.
type RegistryModuleUpdatedIterator struct {
	Event *RegistryModuleUpdated // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryModuleUpdatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryModuleUpdated)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryModuleUpdated)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryModuleUpdatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryModuleUpdatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryModuleUpdated represents a ModuleUpdated event raised by the Registry contract.
type RegistryModuleUpdated struct {
	OldImplementation common.Address
	NewImplementation common.Address
	OldSelectors      [][4]byte
	NewSelectors      [][4]byte
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterModuleUpdated is a free log retrieval operation binding the contract event 0xa062c2c046aa14dc9284b13bde77061cb034f0aa820f20057af6b164651eaa08.
//
// Solidity: event ModuleUpdated(address indexed oldImplementation, address indexed newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors)
func (_Registry *RegistryFilterer) FilterModuleUpdated(opts *bind.FilterOpts, oldImplementation []common.Address, newImplementation []common.Address) (*RegistryModuleUpdatedIterator, error) {

	var oldImplementationRule []interface{}
	for _, oldImplementationItem := range oldImplementation {
		oldImplementationRule = append(oldImplementationRule, oldImplementationItem)
	}
	var newImplementationRule []interface{}
	for _, newImplementationItem := range newImplementation {
		newImplementationRule = append(newImplementationRule, newImplementationItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "ModuleUpdated", oldImplementationRule, newImplementationRule)
	if err != nil {
		return nil, err
	}
	return &RegistryModuleUpdatedIterator{contract: _Registry.contract, event: "ModuleUpdated", logs: logs, sub: sub}, nil
}

// WatchModuleUpdated is a free log subscription operation binding the contract event 0xa062c2c046aa14dc9284b13bde77061cb034f0aa820f20057af6b164651eaa08.
//
// Solidity: event ModuleUpdated(address indexed oldImplementation, address indexed newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors)
func (_Registry *RegistryFilterer) WatchModuleUpdated(opts *bind.WatchOpts, sink chan<- *RegistryModuleUpdated, oldImplementation []common.Address, newImplementation []common.Address) (event.Subscription, error) {

	var oldImplementationRule []interface{}
	for _, oldImplementationItem := range oldImplementation {
		oldImplementationRule = append(oldImplementationRule, oldImplementationItem)
	}
	var newImplementationRule []interface{}
	for _, newImplementationItem := range newImplementation {
		newImplementationRule = append(newImplementationRule, newImplementationItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "ModuleUpdated", oldImplementationRule, newImplementationRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryModuleUpdated)
				if err := _Registry.contract.UnpackLog(event, "ModuleUpdated", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseModuleUpdated is a log parse operation binding the contract event 0xa062c2c046aa14dc9284b13bde77061cb034f0aa820f20057af6b164651eaa08.
//
// Solidity: event ModuleUpdated(address indexed oldImplementation, address indexed newImplementation, bytes4[] oldSelectors, bytes4[] newSelectors)
func (_Registry *RegistryFilterer) ParseModuleUpdated(log types.Log) (*RegistryModuleUpdated, error) {
	event := new(RegistryModuleUpdated)
	if err := _Registry.contract.UnpackLog(event, "ModuleUpdated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryRoleAdminChangedIterator is returned from FilterRoleAdminChanged and is used to iterate over the raw logs and unpacked data for RoleAdminChanged events raised by the Registry contract.
type RegistryRoleAdminChangedIterator struct {
	Event *RegistryRoleAdminChanged // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryRoleAdminChangedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryRoleAdminChanged)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryRoleAdminChanged)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryRoleAdminChangedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryRoleAdminChangedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryRoleAdminChanged represents a RoleAdminChanged event raised by the Registry contract.
type RegistryRoleAdminChanged struct {
	Role              [32]byte
	PreviousAdminRole [32]byte
	NewAdminRole      [32]byte
	Raw               types.Log // Blockchain specific contextual infos
}

// FilterRoleAdminChanged is a free log retrieval operation binding the contract event 0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff.
//
// Solidity: event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
func (_Registry *RegistryFilterer) FilterRoleAdminChanged(opts *bind.FilterOpts, role [][32]byte, previousAdminRole [][32]byte, newAdminRole [][32]byte) (*RegistryRoleAdminChangedIterator, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var previousAdminRoleRule []interface{}
	for _, previousAdminRoleItem := range previousAdminRole {
		previousAdminRoleRule = append(previousAdminRoleRule, previousAdminRoleItem)
	}
	var newAdminRoleRule []interface{}
	for _, newAdminRoleItem := range newAdminRole {
		newAdminRoleRule = append(newAdminRoleRule, newAdminRoleItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "RoleAdminChanged", roleRule, previousAdminRoleRule, newAdminRoleRule)
	if err != nil {
		return nil, err
	}
	return &RegistryRoleAdminChangedIterator{contract: _Registry.contract, event: "RoleAdminChanged", logs: logs, sub: sub}, nil
}

// WatchRoleAdminChanged is a free log subscription operation binding the contract event 0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff.
//
// Solidity: event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
func (_Registry *RegistryFilterer) WatchRoleAdminChanged(opts *bind.WatchOpts, sink chan<- *RegistryRoleAdminChanged, role [][32]byte, previousAdminRole [][32]byte, newAdminRole [][32]byte) (event.Subscription, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var previousAdminRoleRule []interface{}
	for _, previousAdminRoleItem := range previousAdminRole {
		previousAdminRoleRule = append(previousAdminRoleRule, previousAdminRoleItem)
	}
	var newAdminRoleRule []interface{}
	for _, newAdminRoleItem := range newAdminRole {
		newAdminRoleRule = append(newAdminRoleRule, newAdminRoleItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "RoleAdminChanged", roleRule, previousAdminRoleRule, newAdminRoleRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryRoleAdminChanged)
				if err := _Registry.contract.UnpackLog(event, "RoleAdminChanged", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRoleAdminChanged is a log parse operation binding the contract event 0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff.
//
// Solidity: event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
func (_Registry *RegistryFilterer) ParseRoleAdminChanged(log types.Log) (*RegistryRoleAdminChanged, error) {
	event := new(RegistryRoleAdminChanged)
	if err := _Registry.contract.UnpackLog(event, "RoleAdminChanged", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryRoleGrantedIterator is returned from FilterRoleGranted and is used to iterate over the raw logs and unpacked data for RoleGranted events raised by the Registry contract.
type RegistryRoleGrantedIterator struct {
	Event *RegistryRoleGranted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryRoleGrantedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryRoleGranted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryRoleGranted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryRoleGrantedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryRoleGrantedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryRoleGranted represents a RoleGranted event raised by the Registry contract.
type RegistryRoleGranted struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterRoleGranted is a free log retrieval operation binding the contract event 0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (_Registry *RegistryFilterer) FilterRoleGranted(opts *bind.FilterOpts, role [][32]byte, account []common.Address, sender []common.Address) (*RegistryRoleGrantedIterator, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "RoleGranted", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return &RegistryRoleGrantedIterator{contract: _Registry.contract, event: "RoleGranted", logs: logs, sub: sub}, nil
}

// WatchRoleGranted is a free log subscription operation binding the contract event 0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (_Registry *RegistryFilterer) WatchRoleGranted(opts *bind.WatchOpts, sink chan<- *RegistryRoleGranted, role [][32]byte, account []common.Address, sender []common.Address) (event.Subscription, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "RoleGranted", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryRoleGranted)
				if err := _Registry.contract.UnpackLog(event, "RoleGranted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRoleGranted is a log parse operation binding the contract event 0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (_Registry *RegistryFilterer) ParseRoleGranted(log types.Log) (*RegistryRoleGranted, error) {
	event := new(RegistryRoleGranted)
	if err := _Registry.contract.UnpackLog(event, "RoleGranted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryRoleRevokedIterator is returned from FilterRoleRevoked and is used to iterate over the raw logs and unpacked data for RoleRevoked events raised by the Registry contract.
type RegistryRoleRevokedIterator struct {
	Event *RegistryRoleRevoked // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryRoleRevokedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryRoleRevoked)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryRoleRevoked)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryRoleRevokedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryRoleRevokedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryRoleRevoked represents a RoleRevoked event raised by the Registry contract.
type RegistryRoleRevoked struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterRoleRevoked is a free log retrieval operation binding the contract event 0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (_Registry *RegistryFilterer) FilterRoleRevoked(opts *bind.FilterOpts, role [][32]byte, account []common.Address, sender []common.Address) (*RegistryRoleRevokedIterator, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "RoleRevoked", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return &RegistryRoleRevokedIterator{contract: _Registry.contract, event: "RoleRevoked", logs: logs, sub: sub}, nil
}

// WatchRoleRevoked is a free log subscription operation binding the contract event 0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (_Registry *RegistryFilterer) WatchRoleRevoked(opts *bind.WatchOpts, sink chan<- *RegistryRoleRevoked, role [][32]byte, account []common.Address, sender []common.Address) (event.Subscription, error) {

	var roleRule []interface{}
	for _, roleItem := range role {
		roleRule = append(roleRule, roleItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var senderRule []interface{}
	for _, senderItem := range sender {
		senderRule = append(senderRule, senderItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "RoleRevoked", roleRule, accountRule, senderRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryRoleRevoked)
				if err := _Registry.contract.UnpackLog(event, "RoleRevoked", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseRoleRevoked is a log parse operation binding the contract event 0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (_Registry *RegistryFilterer) ParseRoleRevoked(log types.Log) (*RegistryRoleRevoked, error) {
	event := new(RegistryRoleRevoked)
	if err := _Registry.contract.UnpackLog(event, "RoleRevoked", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryStreamRegistrySetIterator is returned from FilterStreamRegistrySet and is used to iterate over the raw logs and unpacked data for StreamRegistrySet events raised by the Registry contract.
type RegistryStreamRegistrySetIterator struct {
	Event *RegistryStreamRegistrySet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryStreamRegistrySetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryStreamRegistrySet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryStreamRegistrySet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryStreamRegistrySetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryStreamRegistrySetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryStreamRegistrySet represents a StreamRegistrySet event raised by the Registry contract.
type RegistryStreamRegistrySet struct {
	StreamRegistry common.Address
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterStreamRegistrySet is a free log retrieval operation binding the contract event 0x42d068f44efba28cc4aa260e8fd67e7d93abf8215c8a61b4dbbc3eaf0ab39f56.
//
// Solidity: event StreamRegistrySet(address streamRegistry)
func (_Registry *RegistryFilterer) FilterStreamRegistrySet(opts *bind.FilterOpts) (*RegistryStreamRegistrySetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "StreamRegistrySet")
	if err != nil {
		return nil, err
	}
	return &RegistryStreamRegistrySetIterator{contract: _Registry.contract, event: "StreamRegistrySet", logs: logs, sub: sub}, nil
}

// WatchStreamRegistrySet is a free log subscription operation binding the contract event 0x42d068f44efba28cc4aa260e8fd67e7d93abf8215c8a61b4dbbc3eaf0ab39f56.
//
// Solidity: event StreamRegistrySet(address streamRegistry)
func (_Registry *RegistryFilterer) WatchStreamRegistrySet(opts *bind.WatchOpts, sink chan<- *RegistryStreamRegistrySet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "StreamRegistrySet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryStreamRegistrySet)
				if err := _Registry.contract.UnpackLog(event, "StreamRegistrySet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseStreamRegistrySet is a log parse operation binding the contract event 0x42d068f44efba28cc4aa260e8fd67e7d93abf8215c8a61b4dbbc3eaf0ab39f56.
//
// Solidity: event StreamRegistrySet(address streamRegistry)
func (_Registry *RegistryFilterer) ParseStreamRegistrySet(log types.Log) (*RegistryStreamRegistrySet, error) {
	event := new(RegistryStreamRegistrySet)
	if err := _Registry.contract.UnpackLog(event, "StreamRegistrySet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySubscribedToVehicleStreamIterator is returned from FilterSubscribedToVehicleStream and is used to iterate over the raw logs and unpacked data for SubscribedToVehicleStream events raised by the Registry contract.
type RegistrySubscribedToVehicleStreamIterator struct {
	Event *RegistrySubscribedToVehicleStream // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySubscribedToVehicleStreamIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySubscribedToVehicleStream)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySubscribedToVehicleStream)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySubscribedToVehicleStreamIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySubscribedToVehicleStreamIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySubscribedToVehicleStream represents a SubscribedToVehicleStream event raised by the Registry contract.
type RegistrySubscribedToVehicleStream struct {
	StreamId       string
	Subscriber     common.Address
	ExpirationTime *big.Int
	Raw            types.Log // Blockchain specific contextual infos
}

// FilterSubscribedToVehicleStream is a free log retrieval operation binding the contract event 0x316c96770fe2528453ad15ac8843953cbc659399f006200f7d61fe124720d607.
//
// Solidity: event SubscribedToVehicleStream(string streamId, address indexed subscriber, uint256 expirationTime)
func (_Registry *RegistryFilterer) FilterSubscribedToVehicleStream(opts *bind.FilterOpts, subscriber []common.Address) (*RegistrySubscribedToVehicleStreamIterator, error) {

	var subscriberRule []interface{}
	for _, subscriberItem := range subscriber {
		subscriberRule = append(subscriberRule, subscriberItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SubscribedToVehicleStream", subscriberRule)
	if err != nil {
		return nil, err
	}
	return &RegistrySubscribedToVehicleStreamIterator{contract: _Registry.contract, event: "SubscribedToVehicleStream", logs: logs, sub: sub}, nil
}

// WatchSubscribedToVehicleStream is a free log subscription operation binding the contract event 0x316c96770fe2528453ad15ac8843953cbc659399f006200f7d61fe124720d607.
//
// Solidity: event SubscribedToVehicleStream(string streamId, address indexed subscriber, uint256 expirationTime)
func (_Registry *RegistryFilterer) WatchSubscribedToVehicleStream(opts *bind.WatchOpts, sink chan<- *RegistrySubscribedToVehicleStream, subscriber []common.Address) (event.Subscription, error) {

	var subscriberRule []interface{}
	for _, subscriberItem := range subscriber {
		subscriberRule = append(subscriberRule, subscriberItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SubscribedToVehicleStream", subscriberRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySubscribedToVehicleStream)
				if err := _Registry.contract.UnpackLog(event, "SubscribedToVehicleStream", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSubscribedToVehicleStream is a log parse operation binding the contract event 0x316c96770fe2528453ad15ac8843953cbc659399f006200f7d61fe124720d607.
//
// Solidity: event SubscribedToVehicleStream(string streamId, address indexed subscriber, uint256 expirationTime)
func (_Registry *RegistryFilterer) ParseSubscribedToVehicleStream(log types.Log) (*RegistrySubscribedToVehicleStream, error) {
	event := new(RegistrySubscribedToVehicleStream)
	if err := _Registry.contract.UnpackLog(event, "SubscribedToVehicleStream", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySyntheticDeviceAttributeAddedIterator is returned from FilterSyntheticDeviceAttributeAdded and is used to iterate over the raw logs and unpacked data for SyntheticDeviceAttributeAdded events raised by the Registry contract.
type RegistrySyntheticDeviceAttributeAddedIterator struct {
	Event *RegistrySyntheticDeviceAttributeAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySyntheticDeviceAttributeAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySyntheticDeviceAttributeAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySyntheticDeviceAttributeAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySyntheticDeviceAttributeAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySyntheticDeviceAttributeAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySyntheticDeviceAttributeAdded represents a SyntheticDeviceAttributeAdded event raised by the Registry contract.
type RegistrySyntheticDeviceAttributeAdded struct {
	Attribute string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterSyntheticDeviceAttributeAdded is a free log retrieval operation binding the contract event 0x6e358be27e6aade9d45fb0b4de4cf68e2dc5630108c30a699ad5cc954d6d05c5.
//
// Solidity: event SyntheticDeviceAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) FilterSyntheticDeviceAttributeAdded(opts *bind.FilterOpts) (*RegistrySyntheticDeviceAttributeAddedIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SyntheticDeviceAttributeAdded")
	if err != nil {
		return nil, err
	}
	return &RegistrySyntheticDeviceAttributeAddedIterator{contract: _Registry.contract, event: "SyntheticDeviceAttributeAdded", logs: logs, sub: sub}, nil
}

// WatchSyntheticDeviceAttributeAdded is a free log subscription operation binding the contract event 0x6e358be27e6aade9d45fb0b4de4cf68e2dc5630108c30a699ad5cc954d6d05c5.
//
// Solidity: event SyntheticDeviceAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) WatchSyntheticDeviceAttributeAdded(opts *bind.WatchOpts, sink chan<- *RegistrySyntheticDeviceAttributeAdded) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SyntheticDeviceAttributeAdded")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySyntheticDeviceAttributeAdded)
				if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceAttributeAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSyntheticDeviceAttributeAdded is a log parse operation binding the contract event 0x6e358be27e6aade9d45fb0b4de4cf68e2dc5630108c30a699ad5cc954d6d05c5.
//
// Solidity: event SyntheticDeviceAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) ParseSyntheticDeviceAttributeAdded(log types.Log) (*RegistrySyntheticDeviceAttributeAdded, error) {
	event := new(RegistrySyntheticDeviceAttributeAdded)
	if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceAttributeAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySyntheticDeviceAttributeSetIterator is returned from FilterSyntheticDeviceAttributeSet and is used to iterate over the raw logs and unpacked data for SyntheticDeviceAttributeSet events raised by the Registry contract.
type RegistrySyntheticDeviceAttributeSetIterator struct {
	Event *RegistrySyntheticDeviceAttributeSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySyntheticDeviceAttributeSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySyntheticDeviceAttributeSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySyntheticDeviceAttributeSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySyntheticDeviceAttributeSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySyntheticDeviceAttributeSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySyntheticDeviceAttributeSet represents a SyntheticDeviceAttributeSet event raised by the Registry contract.
type RegistrySyntheticDeviceAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterSyntheticDeviceAttributeSet is a free log retrieval operation binding the contract event 0xe89d3dc758bde24a2e62ff9b8b2e7e099d7d181ca58160bce0f3fd4939da0dd1.
//
// Solidity: event SyntheticDeviceAttributeSet(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterSyntheticDeviceAttributeSet(opts *bind.FilterOpts, tokenId []*big.Int) (*RegistrySyntheticDeviceAttributeSetIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SyntheticDeviceAttributeSet", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistrySyntheticDeviceAttributeSetIterator{contract: _Registry.contract, event: "SyntheticDeviceAttributeSet", logs: logs, sub: sub}, nil
}

// WatchSyntheticDeviceAttributeSet is a free log subscription operation binding the contract event 0xe89d3dc758bde24a2e62ff9b8b2e7e099d7d181ca58160bce0f3fd4939da0dd1.
//
// Solidity: event SyntheticDeviceAttributeSet(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchSyntheticDeviceAttributeSet(opts *bind.WatchOpts, sink chan<- *RegistrySyntheticDeviceAttributeSet, tokenId []*big.Int) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SyntheticDeviceAttributeSet", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySyntheticDeviceAttributeSet)
				if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceAttributeSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSyntheticDeviceAttributeSet is a log parse operation binding the contract event 0xe89d3dc758bde24a2e62ff9b8b2e7e099d7d181ca58160bce0f3fd4939da0dd1.
//
// Solidity: event SyntheticDeviceAttributeSet(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseSyntheticDeviceAttributeSet(log types.Log) (*RegistrySyntheticDeviceAttributeSet, error) {
	event := new(RegistrySyntheticDeviceAttributeSet)
	if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceAttributeSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySyntheticDeviceAttributeSetDevAdminIterator is returned from FilterSyntheticDeviceAttributeSetDevAdmin and is used to iterate over the raw logs and unpacked data for SyntheticDeviceAttributeSetDevAdmin events raised by the Registry contract.
type RegistrySyntheticDeviceAttributeSetDevAdminIterator struct {
	Event *RegistrySyntheticDeviceAttributeSetDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySyntheticDeviceAttributeSetDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySyntheticDeviceAttributeSetDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySyntheticDeviceAttributeSetDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySyntheticDeviceAttributeSetDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySyntheticDeviceAttributeSetDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySyntheticDeviceAttributeSetDevAdmin represents a SyntheticDeviceAttributeSetDevAdmin event raised by the Registry contract.
type RegistrySyntheticDeviceAttributeSetDevAdmin struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterSyntheticDeviceAttributeSetDevAdmin is a free log retrieval operation binding the contract event 0x8ad1818721bed7b9d8f765123a04baa9895dbe02ebfa9c7e886e207ee43f4360.
//
// Solidity: event SyntheticDeviceAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterSyntheticDeviceAttributeSetDevAdmin(opts *bind.FilterOpts, tokenId []*big.Int) (*RegistrySyntheticDeviceAttributeSetDevAdminIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SyntheticDeviceAttributeSetDevAdmin", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistrySyntheticDeviceAttributeSetDevAdminIterator{contract: _Registry.contract, event: "SyntheticDeviceAttributeSetDevAdmin", logs: logs, sub: sub}, nil
}

// WatchSyntheticDeviceAttributeSetDevAdmin is a free log subscription operation binding the contract event 0x8ad1818721bed7b9d8f765123a04baa9895dbe02ebfa9c7e886e207ee43f4360.
//
// Solidity: event SyntheticDeviceAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchSyntheticDeviceAttributeSetDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistrySyntheticDeviceAttributeSetDevAdmin, tokenId []*big.Int) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SyntheticDeviceAttributeSetDevAdmin", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySyntheticDeviceAttributeSetDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceAttributeSetDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSyntheticDeviceAttributeSetDevAdmin is a log parse operation binding the contract event 0x8ad1818721bed7b9d8f765123a04baa9895dbe02ebfa9c7e886e207ee43f4360.
//
// Solidity: event SyntheticDeviceAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseSyntheticDeviceAttributeSetDevAdmin(log types.Log) (*RegistrySyntheticDeviceAttributeSetDevAdmin, error) {
	event := new(RegistrySyntheticDeviceAttributeSetDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceAttributeSetDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySyntheticDeviceIdProxySetIterator is returned from FilterSyntheticDeviceIdProxySet and is used to iterate over the raw logs and unpacked data for SyntheticDeviceIdProxySet events raised by the Registry contract.
type RegistrySyntheticDeviceIdProxySetIterator struct {
	Event *RegistrySyntheticDeviceIdProxySet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySyntheticDeviceIdProxySetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySyntheticDeviceIdProxySet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySyntheticDeviceIdProxySet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySyntheticDeviceIdProxySetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySyntheticDeviceIdProxySetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySyntheticDeviceIdProxySet represents a SyntheticDeviceIdProxySet event raised by the Registry contract.
type RegistrySyntheticDeviceIdProxySet struct {
	Proxy common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterSyntheticDeviceIdProxySet is a free log retrieval operation binding the contract event 0x03f4b74ae931497684aeebcd1d5bdf812118bbabca14f32f5d58a226534485da.
//
// Solidity: event SyntheticDeviceIdProxySet(address proxy)
func (_Registry *RegistryFilterer) FilterSyntheticDeviceIdProxySet(opts *bind.FilterOpts) (*RegistrySyntheticDeviceIdProxySetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SyntheticDeviceIdProxySet")
	if err != nil {
		return nil, err
	}
	return &RegistrySyntheticDeviceIdProxySetIterator{contract: _Registry.contract, event: "SyntheticDeviceIdProxySet", logs: logs, sub: sub}, nil
}

// WatchSyntheticDeviceIdProxySet is a free log subscription operation binding the contract event 0x03f4b74ae931497684aeebcd1d5bdf812118bbabca14f32f5d58a226534485da.
//
// Solidity: event SyntheticDeviceIdProxySet(address proxy)
func (_Registry *RegistryFilterer) WatchSyntheticDeviceIdProxySet(opts *bind.WatchOpts, sink chan<- *RegistrySyntheticDeviceIdProxySet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SyntheticDeviceIdProxySet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySyntheticDeviceIdProxySet)
				if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceIdProxySet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSyntheticDeviceIdProxySet is a log parse operation binding the contract event 0x03f4b74ae931497684aeebcd1d5bdf812118bbabca14f32f5d58a226534485da.
//
// Solidity: event SyntheticDeviceIdProxySet(address proxy)
func (_Registry *RegistryFilterer) ParseSyntheticDeviceIdProxySet(log types.Log) (*RegistrySyntheticDeviceIdProxySet, error) {
	event := new(RegistrySyntheticDeviceIdProxySet)
	if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceIdProxySet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySyntheticDeviceNodeBurnedIterator is returned from FilterSyntheticDeviceNodeBurned and is used to iterate over the raw logs and unpacked data for SyntheticDeviceNodeBurned events raised by the Registry contract.
type RegistrySyntheticDeviceNodeBurnedIterator struct {
	Event *RegistrySyntheticDeviceNodeBurned // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySyntheticDeviceNodeBurnedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySyntheticDeviceNodeBurned)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySyntheticDeviceNodeBurned)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySyntheticDeviceNodeBurnedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySyntheticDeviceNodeBurnedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySyntheticDeviceNodeBurned represents a SyntheticDeviceNodeBurned event raised by the Registry contract.
type RegistrySyntheticDeviceNodeBurned struct {
	SyntheticDeviceNode *big.Int
	VehicleNode         *big.Int
	Owner               common.Address
	Raw                 types.Log // Blockchain specific contextual infos
}

// FilterSyntheticDeviceNodeBurned is a free log retrieval operation binding the contract event 0xe4edc3c1f917608d486e02df63af34158f185b78cef44615aebee26c09064122.
//
// Solidity: event SyntheticDeviceNodeBurned(uint256 indexed syntheticDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterSyntheticDeviceNodeBurned(opts *bind.FilterOpts, syntheticDeviceNode []*big.Int, vehicleNode []*big.Int, owner []common.Address) (*RegistrySyntheticDeviceNodeBurnedIterator, error) {

	var syntheticDeviceNodeRule []interface{}
	for _, syntheticDeviceNodeItem := range syntheticDeviceNode {
		syntheticDeviceNodeRule = append(syntheticDeviceNodeRule, syntheticDeviceNodeItem)
	}
	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SyntheticDeviceNodeBurned", syntheticDeviceNodeRule, vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistrySyntheticDeviceNodeBurnedIterator{contract: _Registry.contract, event: "SyntheticDeviceNodeBurned", logs: logs, sub: sub}, nil
}

// WatchSyntheticDeviceNodeBurned is a free log subscription operation binding the contract event 0xe4edc3c1f917608d486e02df63af34158f185b78cef44615aebee26c09064122.
//
// Solidity: event SyntheticDeviceNodeBurned(uint256 indexed syntheticDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchSyntheticDeviceNodeBurned(opts *bind.WatchOpts, sink chan<- *RegistrySyntheticDeviceNodeBurned, syntheticDeviceNode []*big.Int, vehicleNode []*big.Int, owner []common.Address) (event.Subscription, error) {

	var syntheticDeviceNodeRule []interface{}
	for _, syntheticDeviceNodeItem := range syntheticDeviceNode {
		syntheticDeviceNodeRule = append(syntheticDeviceNodeRule, syntheticDeviceNodeItem)
	}
	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SyntheticDeviceNodeBurned", syntheticDeviceNodeRule, vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySyntheticDeviceNodeBurned)
				if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceNodeBurned", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSyntheticDeviceNodeBurned is a log parse operation binding the contract event 0xe4edc3c1f917608d486e02df63af34158f185b78cef44615aebee26c09064122.
//
// Solidity: event SyntheticDeviceNodeBurned(uint256 indexed syntheticDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseSyntheticDeviceNodeBurned(log types.Log) (*RegistrySyntheticDeviceNodeBurned, error) {
	event := new(RegistrySyntheticDeviceNodeBurned)
	if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceNodeBurned", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySyntheticDeviceNodeBurnedDevAdminIterator is returned from FilterSyntheticDeviceNodeBurnedDevAdmin and is used to iterate over the raw logs and unpacked data for SyntheticDeviceNodeBurnedDevAdmin events raised by the Registry contract.
type RegistrySyntheticDeviceNodeBurnedDevAdminIterator struct {
	Event *RegistrySyntheticDeviceNodeBurnedDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySyntheticDeviceNodeBurnedDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySyntheticDeviceNodeBurnedDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySyntheticDeviceNodeBurnedDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySyntheticDeviceNodeBurnedDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySyntheticDeviceNodeBurnedDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySyntheticDeviceNodeBurnedDevAdmin represents a SyntheticDeviceNodeBurnedDevAdmin event raised by the Registry contract.
type RegistrySyntheticDeviceNodeBurnedDevAdmin struct {
	SyntheticDeviceNode *big.Int
	VehicleNode         *big.Int
	Owner               common.Address
	Raw                 types.Log // Blockchain specific contextual infos
}

// FilterSyntheticDeviceNodeBurnedDevAdmin is a free log retrieval operation binding the contract event 0x81741fdd73b815709bc61e67c1aeb3a0baa2afb920b26347eab2f4f980595cd4.
//
// Solidity: event SyntheticDeviceNodeBurnedDevAdmin(uint256 indexed syntheticDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterSyntheticDeviceNodeBurnedDevAdmin(opts *bind.FilterOpts, syntheticDeviceNode []*big.Int, vehicleNode []*big.Int, owner []common.Address) (*RegistrySyntheticDeviceNodeBurnedDevAdminIterator, error) {

	var syntheticDeviceNodeRule []interface{}
	for _, syntheticDeviceNodeItem := range syntheticDeviceNode {
		syntheticDeviceNodeRule = append(syntheticDeviceNodeRule, syntheticDeviceNodeItem)
	}
	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SyntheticDeviceNodeBurnedDevAdmin", syntheticDeviceNodeRule, vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistrySyntheticDeviceNodeBurnedDevAdminIterator{contract: _Registry.contract, event: "SyntheticDeviceNodeBurnedDevAdmin", logs: logs, sub: sub}, nil
}

// WatchSyntheticDeviceNodeBurnedDevAdmin is a free log subscription operation binding the contract event 0x81741fdd73b815709bc61e67c1aeb3a0baa2afb920b26347eab2f4f980595cd4.
//
// Solidity: event SyntheticDeviceNodeBurnedDevAdmin(uint256 indexed syntheticDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchSyntheticDeviceNodeBurnedDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistrySyntheticDeviceNodeBurnedDevAdmin, syntheticDeviceNode []*big.Int, vehicleNode []*big.Int, owner []common.Address) (event.Subscription, error) {

	var syntheticDeviceNodeRule []interface{}
	for _, syntheticDeviceNodeItem := range syntheticDeviceNode {
		syntheticDeviceNodeRule = append(syntheticDeviceNodeRule, syntheticDeviceNodeItem)
	}
	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SyntheticDeviceNodeBurnedDevAdmin", syntheticDeviceNodeRule, vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySyntheticDeviceNodeBurnedDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceNodeBurnedDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSyntheticDeviceNodeBurnedDevAdmin is a log parse operation binding the contract event 0x81741fdd73b815709bc61e67c1aeb3a0baa2afb920b26347eab2f4f980595cd4.
//
// Solidity: event SyntheticDeviceNodeBurnedDevAdmin(uint256 indexed syntheticDeviceNode, uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseSyntheticDeviceNodeBurnedDevAdmin(log types.Log) (*RegistrySyntheticDeviceNodeBurnedDevAdmin, error) {
	event := new(RegistrySyntheticDeviceNodeBurnedDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceNodeBurnedDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistrySyntheticDeviceNodeMintedIterator is returned from FilterSyntheticDeviceNodeMinted and is used to iterate over the raw logs and unpacked data for SyntheticDeviceNodeMinted events raised by the Registry contract.
type RegistrySyntheticDeviceNodeMintedIterator struct {
	Event *RegistrySyntheticDeviceNodeMinted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistrySyntheticDeviceNodeMintedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistrySyntheticDeviceNodeMinted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistrySyntheticDeviceNodeMinted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistrySyntheticDeviceNodeMintedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistrySyntheticDeviceNodeMintedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistrySyntheticDeviceNodeMinted represents a SyntheticDeviceNodeMinted event raised by the Registry contract.
type RegistrySyntheticDeviceNodeMinted struct {
	IntegrationNode        *big.Int
	SyntheticDeviceNode    *big.Int
	VehicleNode            *big.Int
	SyntheticDeviceAddress common.Address
	Owner                  common.Address
	Raw                    types.Log // Blockchain specific contextual infos
}

// FilterSyntheticDeviceNodeMinted is a free log retrieval operation binding the contract event 0x5a560c1adda92bd6cbf9c891dc38e9e2973b7963493f2364caa40a4218346280.
//
// Solidity: event SyntheticDeviceNodeMinted(uint256 integrationNode, uint256 syntheticDeviceNode, uint256 indexed vehicleNode, address indexed syntheticDeviceAddress, address indexed owner)
func (_Registry *RegistryFilterer) FilterSyntheticDeviceNodeMinted(opts *bind.FilterOpts, vehicleNode []*big.Int, syntheticDeviceAddress []common.Address, owner []common.Address) (*RegistrySyntheticDeviceNodeMintedIterator, error) {

	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var syntheticDeviceAddressRule []interface{}
	for _, syntheticDeviceAddressItem := range syntheticDeviceAddress {
		syntheticDeviceAddressRule = append(syntheticDeviceAddressRule, syntheticDeviceAddressItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "SyntheticDeviceNodeMinted", vehicleNodeRule, syntheticDeviceAddressRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistrySyntheticDeviceNodeMintedIterator{contract: _Registry.contract, event: "SyntheticDeviceNodeMinted", logs: logs, sub: sub}, nil
}

// WatchSyntheticDeviceNodeMinted is a free log subscription operation binding the contract event 0x5a560c1adda92bd6cbf9c891dc38e9e2973b7963493f2364caa40a4218346280.
//
// Solidity: event SyntheticDeviceNodeMinted(uint256 integrationNode, uint256 syntheticDeviceNode, uint256 indexed vehicleNode, address indexed syntheticDeviceAddress, address indexed owner)
func (_Registry *RegistryFilterer) WatchSyntheticDeviceNodeMinted(opts *bind.WatchOpts, sink chan<- *RegistrySyntheticDeviceNodeMinted, vehicleNode []*big.Int, syntheticDeviceAddress []common.Address, owner []common.Address) (event.Subscription, error) {

	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var syntheticDeviceAddressRule []interface{}
	for _, syntheticDeviceAddressItem := range syntheticDeviceAddress {
		syntheticDeviceAddressRule = append(syntheticDeviceAddressRule, syntheticDeviceAddressItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "SyntheticDeviceNodeMinted", vehicleNodeRule, syntheticDeviceAddressRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistrySyntheticDeviceNodeMinted)
				if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceNodeMinted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSyntheticDeviceNodeMinted is a log parse operation binding the contract event 0x5a560c1adda92bd6cbf9c891dc38e9e2973b7963493f2364caa40a4218346280.
//
// Solidity: event SyntheticDeviceNodeMinted(uint256 integrationNode, uint256 syntheticDeviceNode, uint256 indexed vehicleNode, address indexed syntheticDeviceAddress, address indexed owner)
func (_Registry *RegistryFilterer) ParseSyntheticDeviceNodeMinted(log types.Log) (*RegistrySyntheticDeviceNodeMinted, error) {
	event := new(RegistrySyntheticDeviceNodeMinted)
	if err := _Registry.contract.UnpackLog(event, "SyntheticDeviceNodeMinted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleAttributeAddedIterator is returned from FilterVehicleAttributeAdded and is used to iterate over the raw logs and unpacked data for VehicleAttributeAdded events raised by the Registry contract.
type RegistryVehicleAttributeAddedIterator struct {
	Event *RegistryVehicleAttributeAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleAttributeAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleAttributeAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleAttributeAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleAttributeAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleAttributeAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleAttributeAdded represents a VehicleAttributeAdded event raised by the Registry contract.
type RegistryVehicleAttributeAdded struct {
	Attribute string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterVehicleAttributeAdded is a free log retrieval operation binding the contract event 0x2b7d41dc33ffd58029f53ebfc3232e4f343480b078458bc17c527583e0172c1a.
//
// Solidity: event VehicleAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) FilterVehicleAttributeAdded(opts *bind.FilterOpts) (*RegistryVehicleAttributeAddedIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleAttributeAdded")
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleAttributeAddedIterator{contract: _Registry.contract, event: "VehicleAttributeAdded", logs: logs, sub: sub}, nil
}

// WatchVehicleAttributeAdded is a free log subscription operation binding the contract event 0x2b7d41dc33ffd58029f53ebfc3232e4f343480b078458bc17c527583e0172c1a.
//
// Solidity: event VehicleAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) WatchVehicleAttributeAdded(opts *bind.WatchOpts, sink chan<- *RegistryVehicleAttributeAdded) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleAttributeAdded")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleAttributeAdded)
				if err := _Registry.contract.UnpackLog(event, "VehicleAttributeAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleAttributeAdded is a log parse operation binding the contract event 0x2b7d41dc33ffd58029f53ebfc3232e4f343480b078458bc17c527583e0172c1a.
//
// Solidity: event VehicleAttributeAdded(string attribute)
func (_Registry *RegistryFilterer) ParseVehicleAttributeAdded(log types.Log) (*RegistryVehicleAttributeAdded, error) {
	event := new(RegistryVehicleAttributeAdded)
	if err := _Registry.contract.UnpackLog(event, "VehicleAttributeAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleAttributeSetIterator is returned from FilterVehicleAttributeSet and is used to iterate over the raw logs and unpacked data for VehicleAttributeSet events raised by the Registry contract.
type RegistryVehicleAttributeSetIterator struct {
	Event *RegistryVehicleAttributeSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleAttributeSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleAttributeSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleAttributeSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleAttributeSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleAttributeSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleAttributeSet represents a VehicleAttributeSet event raised by the Registry contract.
type RegistryVehicleAttributeSet struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterVehicleAttributeSet is a free log retrieval operation binding the contract event 0x3a259e5d4c53f11c343582a8291a82a8cc0b36ec211d5ab48c2f29ebb068e5fb.
//
// Solidity: event VehicleAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterVehicleAttributeSet(opts *bind.FilterOpts) (*RegistryVehicleAttributeSetIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleAttributeSet")
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleAttributeSetIterator{contract: _Registry.contract, event: "VehicleAttributeSet", logs: logs, sub: sub}, nil
}

// WatchVehicleAttributeSet is a free log subscription operation binding the contract event 0x3a259e5d4c53f11c343582a8291a82a8cc0b36ec211d5ab48c2f29ebb068e5fb.
//
// Solidity: event VehicleAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchVehicleAttributeSet(opts *bind.WatchOpts, sink chan<- *RegistryVehicleAttributeSet) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleAttributeSet")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleAttributeSet)
				if err := _Registry.contract.UnpackLog(event, "VehicleAttributeSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleAttributeSet is a log parse operation binding the contract event 0x3a259e5d4c53f11c343582a8291a82a8cc0b36ec211d5ab48c2f29ebb068e5fb.
//
// Solidity: event VehicleAttributeSet(uint256 tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseVehicleAttributeSet(log types.Log) (*RegistryVehicleAttributeSet, error) {
	event := new(RegistryVehicleAttributeSet)
	if err := _Registry.contract.UnpackLog(event, "VehicleAttributeSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleAttributeSetDevAdminIterator is returned from FilterVehicleAttributeSetDevAdmin and is used to iterate over the raw logs and unpacked data for VehicleAttributeSetDevAdmin events raised by the Registry contract.
type RegistryVehicleAttributeSetDevAdminIterator struct {
	Event *RegistryVehicleAttributeSetDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleAttributeSetDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleAttributeSetDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleAttributeSetDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleAttributeSetDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleAttributeSetDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleAttributeSetDevAdmin represents a VehicleAttributeSetDevAdmin event raised by the Registry contract.
type RegistryVehicleAttributeSetDevAdmin struct {
	TokenId   *big.Int
	Attribute string
	Info      string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterVehicleAttributeSetDevAdmin is a free log retrieval operation binding the contract event 0x1d91e00c26e65ad33a7ff60138cf8250090a290b59ec754323b9f5e6be929896.
//
// Solidity: event VehicleAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) FilterVehicleAttributeSetDevAdmin(opts *bind.FilterOpts, tokenId []*big.Int) (*RegistryVehicleAttributeSetDevAdminIterator, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleAttributeSetDevAdmin", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleAttributeSetDevAdminIterator{contract: _Registry.contract, event: "VehicleAttributeSetDevAdmin", logs: logs, sub: sub}, nil
}

// WatchVehicleAttributeSetDevAdmin is a free log subscription operation binding the contract event 0x1d91e00c26e65ad33a7ff60138cf8250090a290b59ec754323b9f5e6be929896.
//
// Solidity: event VehicleAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) WatchVehicleAttributeSetDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistryVehicleAttributeSetDevAdmin, tokenId []*big.Int) (event.Subscription, error) {

	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleAttributeSetDevAdmin", tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleAttributeSetDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "VehicleAttributeSetDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleAttributeSetDevAdmin is a log parse operation binding the contract event 0x1d91e00c26e65ad33a7ff60138cf8250090a290b59ec754323b9f5e6be929896.
//
// Solidity: event VehicleAttributeSetDevAdmin(uint256 indexed tokenId, string attribute, string info)
func (_Registry *RegistryFilterer) ParseVehicleAttributeSetDevAdmin(log types.Log) (*RegistryVehicleAttributeSetDevAdmin, error) {
	event := new(RegistryVehicleAttributeSetDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "VehicleAttributeSetDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleIdProxySetIterator is returned from FilterVehicleIdProxySet and is used to iterate over the raw logs and unpacked data for VehicleIdProxySet events raised by the Registry contract.
type RegistryVehicleIdProxySetIterator struct {
	Event *RegistryVehicleIdProxySet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleIdProxySetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleIdProxySet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleIdProxySet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleIdProxySetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleIdProxySetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleIdProxySet represents a VehicleIdProxySet event raised by the Registry contract.
type RegistryVehicleIdProxySet struct {
	Proxy common.Address
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterVehicleIdProxySet is a free log retrieval operation binding the contract event 0x3e7484c4e57f7d92e9f02eba6cd805d89112e48db8c21aeb8485fcf0020e479d.
//
// Solidity: event VehicleIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) FilterVehicleIdProxySet(opts *bind.FilterOpts, proxy []common.Address) (*RegistryVehicleIdProxySetIterator, error) {

	var proxyRule []interface{}
	for _, proxyItem := range proxy {
		proxyRule = append(proxyRule, proxyItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleIdProxySet", proxyRule)
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleIdProxySetIterator{contract: _Registry.contract, event: "VehicleIdProxySet", logs: logs, sub: sub}, nil
}

// WatchVehicleIdProxySet is a free log subscription operation binding the contract event 0x3e7484c4e57f7d92e9f02eba6cd805d89112e48db8c21aeb8485fcf0020e479d.
//
// Solidity: event VehicleIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) WatchVehicleIdProxySet(opts *bind.WatchOpts, sink chan<- *RegistryVehicleIdProxySet, proxy []common.Address) (event.Subscription, error) {

	var proxyRule []interface{}
	for _, proxyItem := range proxy {
		proxyRule = append(proxyRule, proxyItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleIdProxySet", proxyRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleIdProxySet)
				if err := _Registry.contract.UnpackLog(event, "VehicleIdProxySet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleIdProxySet is a log parse operation binding the contract event 0x3e7484c4e57f7d92e9f02eba6cd805d89112e48db8c21aeb8485fcf0020e479d.
//
// Solidity: event VehicleIdProxySet(address indexed proxy)
func (_Registry *RegistryFilterer) ParseVehicleIdProxySet(log types.Log) (*RegistryVehicleIdProxySet, error) {
	event := new(RegistryVehicleIdProxySet)
	if err := _Registry.contract.UnpackLog(event, "VehicleIdProxySet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleNodeBurnedIterator is returned from FilterVehicleNodeBurned and is used to iterate over the raw logs and unpacked data for VehicleNodeBurned events raised by the Registry contract.
type RegistryVehicleNodeBurnedIterator struct {
	Event *RegistryVehicleNodeBurned // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleNodeBurnedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleNodeBurned)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleNodeBurned)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleNodeBurnedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleNodeBurnedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleNodeBurned represents a VehicleNodeBurned event raised by the Registry contract.
type RegistryVehicleNodeBurned struct {
	VehicleNode *big.Int
	Owner       common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterVehicleNodeBurned is a free log retrieval operation binding the contract event 0x7b36384f0fcf18da09247269a4716eecbcbc475a5b2bc7aa371fc1164789508d.
//
// Solidity: event VehicleNodeBurned(uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterVehicleNodeBurned(opts *bind.FilterOpts, vehicleNode []*big.Int, owner []common.Address) (*RegistryVehicleNodeBurnedIterator, error) {

	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleNodeBurned", vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleNodeBurnedIterator{contract: _Registry.contract, event: "VehicleNodeBurned", logs: logs, sub: sub}, nil
}

// WatchVehicleNodeBurned is a free log subscription operation binding the contract event 0x7b36384f0fcf18da09247269a4716eecbcbc475a5b2bc7aa371fc1164789508d.
//
// Solidity: event VehicleNodeBurned(uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchVehicleNodeBurned(opts *bind.WatchOpts, sink chan<- *RegistryVehicleNodeBurned, vehicleNode []*big.Int, owner []common.Address) (event.Subscription, error) {

	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleNodeBurned", vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleNodeBurned)
				if err := _Registry.contract.UnpackLog(event, "VehicleNodeBurned", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleNodeBurned is a log parse operation binding the contract event 0x7b36384f0fcf18da09247269a4716eecbcbc475a5b2bc7aa371fc1164789508d.
//
// Solidity: event VehicleNodeBurned(uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseVehicleNodeBurned(log types.Log) (*RegistryVehicleNodeBurned, error) {
	event := new(RegistryVehicleNodeBurned)
	if err := _Registry.contract.UnpackLog(event, "VehicleNodeBurned", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleNodeBurnedDevAdminIterator is returned from FilterVehicleNodeBurnedDevAdmin and is used to iterate over the raw logs and unpacked data for VehicleNodeBurnedDevAdmin events raised by the Registry contract.
type RegistryVehicleNodeBurnedDevAdminIterator struct {
	Event *RegistryVehicleNodeBurnedDevAdmin // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleNodeBurnedDevAdminIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleNodeBurnedDevAdmin)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleNodeBurnedDevAdmin)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleNodeBurnedDevAdminIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleNodeBurnedDevAdminIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleNodeBurnedDevAdmin represents a VehicleNodeBurnedDevAdmin event raised by the Registry contract.
type RegistryVehicleNodeBurnedDevAdmin struct {
	VehicleNode *big.Int
	Owner       common.Address
	Raw         types.Log // Blockchain specific contextual infos
}

// FilterVehicleNodeBurnedDevAdmin is a free log retrieval operation binding the contract event 0xb956d02723efc0f9c3b60b95271d0b2c35628307c1f98a8f4c9a7f521d9dd0ff.
//
// Solidity: event VehicleNodeBurnedDevAdmin(uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) FilterVehicleNodeBurnedDevAdmin(opts *bind.FilterOpts, vehicleNode []*big.Int, owner []common.Address) (*RegistryVehicleNodeBurnedDevAdminIterator, error) {

	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleNodeBurnedDevAdmin", vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleNodeBurnedDevAdminIterator{contract: _Registry.contract, event: "VehicleNodeBurnedDevAdmin", logs: logs, sub: sub}, nil
}

// WatchVehicleNodeBurnedDevAdmin is a free log subscription operation binding the contract event 0xb956d02723efc0f9c3b60b95271d0b2c35628307c1f98a8f4c9a7f521d9dd0ff.
//
// Solidity: event VehicleNodeBurnedDevAdmin(uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) WatchVehicleNodeBurnedDevAdmin(opts *bind.WatchOpts, sink chan<- *RegistryVehicleNodeBurnedDevAdmin, vehicleNode []*big.Int, owner []common.Address) (event.Subscription, error) {

	var vehicleNodeRule []interface{}
	for _, vehicleNodeItem := range vehicleNode {
		vehicleNodeRule = append(vehicleNodeRule, vehicleNodeItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleNodeBurnedDevAdmin", vehicleNodeRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleNodeBurnedDevAdmin)
				if err := _Registry.contract.UnpackLog(event, "VehicleNodeBurnedDevAdmin", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleNodeBurnedDevAdmin is a log parse operation binding the contract event 0xb956d02723efc0f9c3b60b95271d0b2c35628307c1f98a8f4c9a7f521d9dd0ff.
//
// Solidity: event VehicleNodeBurnedDevAdmin(uint256 indexed vehicleNode, address indexed owner)
func (_Registry *RegistryFilterer) ParseVehicleNodeBurnedDevAdmin(log types.Log) (*RegistryVehicleNodeBurnedDevAdmin, error) {
	event := new(RegistryVehicleNodeBurnedDevAdmin)
	if err := _Registry.contract.UnpackLog(event, "VehicleNodeBurnedDevAdmin", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleNodeMintedIterator is returned from FilterVehicleNodeMinted and is used to iterate over the raw logs and unpacked data for VehicleNodeMinted events raised by the Registry contract.
type RegistryVehicleNodeMintedIterator struct {
	Event *RegistryVehicleNodeMinted // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleNodeMintedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleNodeMinted)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleNodeMinted)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleNodeMintedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleNodeMintedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleNodeMinted represents a VehicleNodeMinted event raised by the Registry contract.
type RegistryVehicleNodeMinted struct {
	ManufacturerNode *big.Int
	TokenId          *big.Int
	Owner            common.Address
	Raw              types.Log // Blockchain specific contextual infos
}

// FilterVehicleNodeMinted is a free log retrieval operation binding the contract event 0xd471ae8ab3c01edc986909c344bb50f982b21772fcac173103ef8b9924375ec6.
//
// Solidity: event VehicleNodeMinted(uint256 manufacturerNode, uint256 tokenId, address owner)
func (_Registry *RegistryFilterer) FilterVehicleNodeMinted(opts *bind.FilterOpts) (*RegistryVehicleNodeMintedIterator, error) {

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleNodeMinted")
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleNodeMintedIterator{contract: _Registry.contract, event: "VehicleNodeMinted", logs: logs, sub: sub}, nil
}

// WatchVehicleNodeMinted is a free log subscription operation binding the contract event 0xd471ae8ab3c01edc986909c344bb50f982b21772fcac173103ef8b9924375ec6.
//
// Solidity: event VehicleNodeMinted(uint256 manufacturerNode, uint256 tokenId, address owner)
func (_Registry *RegistryFilterer) WatchVehicleNodeMinted(opts *bind.WatchOpts, sink chan<- *RegistryVehicleNodeMinted) (event.Subscription, error) {

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleNodeMinted")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleNodeMinted)
				if err := _Registry.contract.UnpackLog(event, "VehicleNodeMinted", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleNodeMinted is a log parse operation binding the contract event 0xd471ae8ab3c01edc986909c344bb50f982b21772fcac173103ef8b9924375ec6.
//
// Solidity: event VehicleNodeMinted(uint256 manufacturerNode, uint256 tokenId, address owner)
func (_Registry *RegistryFilterer) ParseVehicleNodeMinted(log types.Log) (*RegistryVehicleNodeMinted, error) {
	event := new(RegistryVehicleNodeMinted)
	if err := _Registry.contract.UnpackLog(event, "VehicleNodeMinted", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleNodeMintedWithDeviceDefinitionIterator is returned from FilterVehicleNodeMintedWithDeviceDefinition and is used to iterate over the raw logs and unpacked data for VehicleNodeMintedWithDeviceDefinition events raised by the Registry contract.
type RegistryVehicleNodeMintedWithDeviceDefinitionIterator struct {
	Event *RegistryVehicleNodeMintedWithDeviceDefinition // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleNodeMintedWithDeviceDefinitionIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleNodeMintedWithDeviceDefinition)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleNodeMintedWithDeviceDefinition)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleNodeMintedWithDeviceDefinitionIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleNodeMintedWithDeviceDefinitionIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleNodeMintedWithDeviceDefinition represents a VehicleNodeMintedWithDeviceDefinition event raised by the Registry contract.
type RegistryVehicleNodeMintedWithDeviceDefinition struct {
	ManufacturerId     *big.Int
	VehicleId          *big.Int
	Owner              common.Address
	DeviceDefinitionId string
	Raw                types.Log // Blockchain specific contextual infos
}

// FilterVehicleNodeMintedWithDeviceDefinition is a free log retrieval operation binding the contract event 0xc7c7d9ac150ee7eff1ae17be6e6c250d9f574d019d47cd741f693feb1929496c.
//
// Solidity: event VehicleNodeMintedWithDeviceDefinition(uint256 indexed manufacturerId, uint256 indexed vehicleId, address indexed owner, string deviceDefinitionId)
func (_Registry *RegistryFilterer) FilterVehicleNodeMintedWithDeviceDefinition(opts *bind.FilterOpts, manufacturerId []*big.Int, vehicleId []*big.Int, owner []common.Address) (*RegistryVehicleNodeMintedWithDeviceDefinitionIterator, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var vehicleIdRule []interface{}
	for _, vehicleIdItem := range vehicleId {
		vehicleIdRule = append(vehicleIdRule, vehicleIdItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleNodeMintedWithDeviceDefinition", manufacturerIdRule, vehicleIdRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleNodeMintedWithDeviceDefinitionIterator{contract: _Registry.contract, event: "VehicleNodeMintedWithDeviceDefinition", logs: logs, sub: sub}, nil
}

// WatchVehicleNodeMintedWithDeviceDefinition is a free log subscription operation binding the contract event 0xc7c7d9ac150ee7eff1ae17be6e6c250d9f574d019d47cd741f693feb1929496c.
//
// Solidity: event VehicleNodeMintedWithDeviceDefinition(uint256 indexed manufacturerId, uint256 indexed vehicleId, address indexed owner, string deviceDefinitionId)
func (_Registry *RegistryFilterer) WatchVehicleNodeMintedWithDeviceDefinition(opts *bind.WatchOpts, sink chan<- *RegistryVehicleNodeMintedWithDeviceDefinition, manufacturerId []*big.Int, vehicleId []*big.Int, owner []common.Address) (event.Subscription, error) {

	var manufacturerIdRule []interface{}
	for _, manufacturerIdItem := range manufacturerId {
		manufacturerIdRule = append(manufacturerIdRule, manufacturerIdItem)
	}
	var vehicleIdRule []interface{}
	for _, vehicleIdItem := range vehicleId {
		vehicleIdRule = append(vehicleIdRule, vehicleIdItem)
	}
	var ownerRule []interface{}
	for _, ownerItem := range owner {
		ownerRule = append(ownerRule, ownerItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleNodeMintedWithDeviceDefinition", manufacturerIdRule, vehicleIdRule, ownerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleNodeMintedWithDeviceDefinition)
				if err := _Registry.contract.UnpackLog(event, "VehicleNodeMintedWithDeviceDefinition", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleNodeMintedWithDeviceDefinition is a log parse operation binding the contract event 0xc7c7d9ac150ee7eff1ae17be6e6c250d9f574d019d47cd741f693feb1929496c.
//
// Solidity: event VehicleNodeMintedWithDeviceDefinition(uint256 indexed manufacturerId, uint256 indexed vehicleId, address indexed owner, string deviceDefinitionId)
func (_Registry *RegistryFilterer) ParseVehicleNodeMintedWithDeviceDefinition(log types.Log) (*RegistryVehicleNodeMintedWithDeviceDefinition, error) {
	event := new(RegistryVehicleNodeMintedWithDeviceDefinition)
	if err := _Registry.contract.UnpackLog(event, "VehicleNodeMintedWithDeviceDefinition", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleStreamSetIterator is returned from FilterVehicleStreamSet and is used to iterate over the raw logs and unpacked data for VehicleStreamSet events raised by the Registry contract.
type RegistryVehicleStreamSetIterator struct {
	Event *RegistryVehicleStreamSet // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleStreamSetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleStreamSet)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleStreamSet)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleStreamSetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleStreamSetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleStreamSet represents a VehicleStreamSet event raised by the Registry contract.
type RegistryVehicleStreamSet struct {
	VehicleId *big.Int
	StreamId  string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterVehicleStreamSet is a free log retrieval operation binding the contract event 0x09d0a7809cb7d90906448d57618581b65ca306d116e2b991721b9ef877d890de.
//
// Solidity: event VehicleStreamSet(uint256 indexed vehicleId, string streamId)
func (_Registry *RegistryFilterer) FilterVehicleStreamSet(opts *bind.FilterOpts, vehicleId []*big.Int) (*RegistryVehicleStreamSetIterator, error) {

	var vehicleIdRule []interface{}
	for _, vehicleIdItem := range vehicleId {
		vehicleIdRule = append(vehicleIdRule, vehicleIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleStreamSet", vehicleIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleStreamSetIterator{contract: _Registry.contract, event: "VehicleStreamSet", logs: logs, sub: sub}, nil
}

// WatchVehicleStreamSet is a free log subscription operation binding the contract event 0x09d0a7809cb7d90906448d57618581b65ca306d116e2b991721b9ef877d890de.
//
// Solidity: event VehicleStreamSet(uint256 indexed vehicleId, string streamId)
func (_Registry *RegistryFilterer) WatchVehicleStreamSet(opts *bind.WatchOpts, sink chan<- *RegistryVehicleStreamSet, vehicleId []*big.Int) (event.Subscription, error) {

	var vehicleIdRule []interface{}
	for _, vehicleIdItem := range vehicleId {
		vehicleIdRule = append(vehicleIdRule, vehicleIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleStreamSet", vehicleIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleStreamSet)
				if err := _Registry.contract.UnpackLog(event, "VehicleStreamSet", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleStreamSet is a log parse operation binding the contract event 0x09d0a7809cb7d90906448d57618581b65ca306d116e2b991721b9ef877d890de.
//
// Solidity: event VehicleStreamSet(uint256 indexed vehicleId, string streamId)
func (_Registry *RegistryFilterer) ParseVehicleStreamSet(log types.Log) (*RegistryVehicleStreamSet, error) {
	event := new(RegistryVehicleStreamSet)
	if err := _Registry.contract.UnpackLog(event, "VehicleStreamSet", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// RegistryVehicleStreamUnsetIterator is returned from FilterVehicleStreamUnset and is used to iterate over the raw logs and unpacked data for VehicleStreamUnset events raised by the Registry contract.
type RegistryVehicleStreamUnsetIterator struct {
	Event *RegistryVehicleStreamUnset // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *RegistryVehicleStreamUnsetIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(RegistryVehicleStreamUnset)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(RegistryVehicleStreamUnset)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *RegistryVehicleStreamUnsetIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *RegistryVehicleStreamUnsetIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// RegistryVehicleStreamUnset represents a VehicleStreamUnset event raised by the Registry contract.
type RegistryVehicleStreamUnset struct {
	VehicleId *big.Int
	StreamId  string
	Raw       types.Log // Blockchain specific contextual infos
}

// FilterVehicleStreamUnset is a free log retrieval operation binding the contract event 0x14692607635062a59787a92503915f7eca22e88b9bb3474438d0b393ad0ecf0d.
//
// Solidity: event VehicleStreamUnset(uint256 indexed vehicleId, string streamId)
func (_Registry *RegistryFilterer) FilterVehicleStreamUnset(opts *bind.FilterOpts, vehicleId []*big.Int) (*RegistryVehicleStreamUnsetIterator, error) {

	var vehicleIdRule []interface{}
	for _, vehicleIdItem := range vehicleId {
		vehicleIdRule = append(vehicleIdRule, vehicleIdItem)
	}

	logs, sub, err := _Registry.contract.FilterLogs(opts, "VehicleStreamUnset", vehicleIdRule)
	if err != nil {
		return nil, err
	}
	return &RegistryVehicleStreamUnsetIterator{contract: _Registry.contract, event: "VehicleStreamUnset", logs: logs, sub: sub}, nil
}

// WatchVehicleStreamUnset is a free log subscription operation binding the contract event 0x14692607635062a59787a92503915f7eca22e88b9bb3474438d0b393ad0ecf0d.
//
// Solidity: event VehicleStreamUnset(uint256 indexed vehicleId, string streamId)
func (_Registry *RegistryFilterer) WatchVehicleStreamUnset(opts *bind.WatchOpts, sink chan<- *RegistryVehicleStreamUnset, vehicleId []*big.Int) (event.Subscription, error) {

	var vehicleIdRule []interface{}
	for _, vehicleIdItem := range vehicleId {
		vehicleIdRule = append(vehicleIdRule, vehicleIdItem)
	}

	logs, sub, err := _Registry.contract.WatchLogs(opts, "VehicleStreamUnset", vehicleIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(RegistryVehicleStreamUnset)
				if err := _Registry.contract.UnpackLog(event, "VehicleStreamUnset", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseVehicleStreamUnset is a log parse operation binding the contract event 0x14692607635062a59787a92503915f7eca22e88b9bb3474438d0b393ad0ecf0d.
//
// Solidity: event VehicleStreamUnset(uint256 indexed vehicleId, string streamId)
func (_Registry *RegistryFilterer) ParseVehicleStreamUnset(log types.Log) (*RegistryVehicleStreamUnset, error) {
	event := new(RegistryVehicleStreamUnset)
	if err := _Registry.contract.UnpackLog(event, "VehicleStreamUnset", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
