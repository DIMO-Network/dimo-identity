// Code generated via abigen V2 - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package dimoForwarder

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

// DimoForwarderMetaData contains all meta data concerning the DimoForwarder contract.
var DimoForwarderMetaData = bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxySource\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"idProxyTraget\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"sourceId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"targetId\",\"type\":\"uint256\"}],\"name\":\"InvalidLink\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxy\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"errorMessage\",\"type\":\"string\"}],\"name\":\"TransferFailed\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"previousAdmin\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"newAdmin\",\"type\":\"address\"}],\"name\":\"AdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"beacon\",\"type\":\"address\"}],\"name\":\"BeaconUpgraded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"previousAdminRole\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"newAdminRole\",\"type\":\"bytes32\"}],\"name\":\"RoleAdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"implementation\",\"type\":\"address\"}],\"name\":\"Upgraded\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"DEFAULT_ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"SAFE_TRANSFER_FROM\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"\",\"type\":\"bytes4\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"UPGRADER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"adIdProxyAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"dimoRegistry\",\"outputs\":[{\"internalType\":\"contractIDimoRegistry\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleAdmin\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"grantRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"dimoRegistry_\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"vehicleIdProxyAddress_\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"adIdProxyAddress_\",\"type\":\"address\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"proxiableUUID\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"revokeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"adIdProxyAddress_\",\"type\":\"address\"}],\"name\":\"setAftermarketDeviceIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"dimoRegistry_\",\"type\":\"address\"}],\"name\":\"setDimoRegistryAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"vehicleIdProxyAddress_\",\"type\":\"address\"}],\"name\":\"setVehicleIdProxyAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[]\",\"name\":\"vehicleIds\",\"type\":\"uint256[]\"},{\"internalType\":\"uint256[]\",\"name\":\"aftermarketDeviceIds\",\"type\":\"uint256[]\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"transferVehicleAndAftermarketDeviceIds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vehicleId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"aftermarketDeviceId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"transferVehicleAndAftermarketDeviceIds\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"}],\"name\":\"upgradeTo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"upgradeToAndCall\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"vehicleIdProxyAddress\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
	ID:  "DimoForwarder",
}

// DimoForwarder is an auto generated Go binding around an Ethereum contract.
type DimoForwarder struct {
	abi abi.ABI
}

// NewDimoForwarder creates a new instance of DimoForwarder.
func NewDimoForwarder() *DimoForwarder {
	parsed, err := DimoForwarderMetaData.ParseABI()
	if err != nil {
		panic(errors.New("invalid ABI: " + err.Error()))
	}
	return &DimoForwarder{abi: *parsed}
}

// Instance creates a wrapper for a deployed contract instance at the given address.
// Use this to create the instance object passed to abigen v2 library functions Call, Transact, etc.
func (c *DimoForwarder) Instance(backend bind.ContractBackend, addr common.Address) *bind.BoundContract {
	return bind.NewBoundContract(addr, c.abi, backend, backend, backend)
}

// PackADMINROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x75b238fc.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function ADMIN_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) PackADMINROLE() []byte {
	enc, err := dimoForwarder.abi.Pack("ADMIN_ROLE")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackADMINROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x75b238fc.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function ADMIN_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) TryPackADMINROLE() ([]byte, error) {
	return dimoForwarder.abi.Pack("ADMIN_ROLE")
}

// UnpackADMINROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x75b238fc.
//
// Solidity: function ADMIN_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) UnpackADMINROLE(data []byte) ([32]byte, error) {
	out, err := dimoForwarder.abi.Unpack("ADMIN_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackDEFAULTADMINROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa217fddf.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function DEFAULT_ADMIN_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) PackDEFAULTADMINROLE() []byte {
	enc, err := dimoForwarder.abi.Pack("DEFAULT_ADMIN_ROLE")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackDEFAULTADMINROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa217fddf.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function DEFAULT_ADMIN_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) TryPackDEFAULTADMINROLE() ([]byte, error) {
	return dimoForwarder.abi.Pack("DEFAULT_ADMIN_ROLE")
}

// UnpackDEFAULTADMINROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xa217fddf.
//
// Solidity: function DEFAULT_ADMIN_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) UnpackDEFAULTADMINROLE(data []byte) ([32]byte, error) {
	out, err := dimoForwarder.abi.Unpack("DEFAULT_ADMIN_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackSAFETRANSFERFROM is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe4cdbfdb.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function SAFE_TRANSFER_FROM() view returns(bytes4)
func (dimoForwarder *DimoForwarder) PackSAFETRANSFERFROM() []byte {
	enc, err := dimoForwarder.abi.Pack("SAFE_TRANSFER_FROM")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSAFETRANSFERFROM is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe4cdbfdb.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function SAFE_TRANSFER_FROM() view returns(bytes4)
func (dimoForwarder *DimoForwarder) TryPackSAFETRANSFERFROM() ([]byte, error) {
	return dimoForwarder.abi.Pack("SAFE_TRANSFER_FROM")
}

// UnpackSAFETRANSFERFROM is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xe4cdbfdb.
//
// Solidity: function SAFE_TRANSFER_FROM() view returns(bytes4)
func (dimoForwarder *DimoForwarder) UnpackSAFETRANSFERFROM(data []byte) ([4]byte, error) {
	out, err := dimoForwarder.abi.Unpack("SAFE_TRANSFER_FROM", data)
	if err != nil {
		return *new([4]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([4]byte)).(*[4]byte)
	return out0, nil
}

// PackUPGRADERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf72c0d8b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function UPGRADER_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) PackUPGRADERROLE() []byte {
	enc, err := dimoForwarder.abi.Pack("UPGRADER_ROLE")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUPGRADERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf72c0d8b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function UPGRADER_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) TryPackUPGRADERROLE() ([]byte, error) {
	return dimoForwarder.abi.Pack("UPGRADER_ROLE")
}

// UnpackUPGRADERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xf72c0d8b.
//
// Solidity: function UPGRADER_ROLE() view returns(bytes32)
func (dimoForwarder *DimoForwarder) UnpackUPGRADERROLE(data []byte) ([32]byte, error) {
	out, err := dimoForwarder.abi.Unpack("UPGRADER_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackAdIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb1ba0e45.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function adIdProxyAddress() view returns(address)
func (dimoForwarder *DimoForwarder) PackAdIdProxyAddress() []byte {
	enc, err := dimoForwarder.abi.Pack("adIdProxyAddress")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackAdIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb1ba0e45.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function adIdProxyAddress() view returns(address)
func (dimoForwarder *DimoForwarder) TryPackAdIdProxyAddress() ([]byte, error) {
	return dimoForwarder.abi.Pack("adIdProxyAddress")
}

// UnpackAdIdProxyAddress is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xb1ba0e45.
//
// Solidity: function adIdProxyAddress() view returns(address)
func (dimoForwarder *DimoForwarder) UnpackAdIdProxyAddress(data []byte) (common.Address, error) {
	out, err := dimoForwarder.abi.Unpack("adIdProxyAddress", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackDimoRegistry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x20678275.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function dimoRegistry() view returns(address)
func (dimoForwarder *DimoForwarder) PackDimoRegistry() []byte {
	enc, err := dimoForwarder.abi.Pack("dimoRegistry")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackDimoRegistry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x20678275.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function dimoRegistry() view returns(address)
func (dimoForwarder *DimoForwarder) TryPackDimoRegistry() ([]byte, error) {
	return dimoForwarder.abi.Pack("dimoRegistry")
}

// UnpackDimoRegistry is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x20678275.
//
// Solidity: function dimoRegistry() view returns(address)
func (dimoForwarder *DimoForwarder) UnpackDimoRegistry(data []byte) (common.Address, error) {
	out, err := dimoForwarder.abi.Unpack("dimoRegistry", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetRoleAdmin is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x248a9ca3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (dimoForwarder *DimoForwarder) PackGetRoleAdmin(role [32]byte) []byte {
	enc, err := dimoForwarder.abi.Pack("getRoleAdmin", role)
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
func (dimoForwarder *DimoForwarder) TryPackGetRoleAdmin(role [32]byte) ([]byte, error) {
	return dimoForwarder.abi.Pack("getRoleAdmin", role)
}

// UnpackGetRoleAdmin is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x248a9ca3.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (dimoForwarder *DimoForwarder) UnpackGetRoleAdmin(data []byte) ([32]byte, error) {
	out, err := dimoForwarder.abi.Unpack("getRoleAdmin", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackGrantRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x2f2ff15d.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function grantRole(bytes32 role, address account) returns()
func (dimoForwarder *DimoForwarder) PackGrantRole(role [32]byte, account common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("grantRole", role, account)
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
func (dimoForwarder *DimoForwarder) TryPackGrantRole(role [32]byte, account common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("grantRole", role, account)
}

// PackHasRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x91d14854.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (dimoForwarder *DimoForwarder) PackHasRole(role [32]byte, account common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("hasRole", role, account)
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
func (dimoForwarder *DimoForwarder) TryPackHasRole(role [32]byte, account common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("hasRole", role, account)
}

// UnpackHasRole is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (dimoForwarder *DimoForwarder) UnpackHasRole(data []byte) (bool, error) {
	out, err := dimoForwarder.abi.Unpack("hasRole", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc0c53b8b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function initialize(address dimoRegistry_, address vehicleIdProxyAddress_, address adIdProxyAddress_) returns()
func (dimoForwarder *DimoForwarder) PackInitialize(dimoRegistry common.Address, vehicleIdProxyAddress common.Address, adIdProxyAddress common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("initialize", dimoRegistry, vehicleIdProxyAddress, adIdProxyAddress)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc0c53b8b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function initialize(address dimoRegistry_, address vehicleIdProxyAddress_, address adIdProxyAddress_) returns()
func (dimoForwarder *DimoForwarder) TryPackInitialize(dimoRegistry common.Address, vehicleIdProxyAddress common.Address, adIdProxyAddress common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("initialize", dimoRegistry, vehicleIdProxyAddress, adIdProxyAddress)
}

// PackProxiableUUID is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x52d1902d.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function proxiableUUID() view returns(bytes32)
func (dimoForwarder *DimoForwarder) PackProxiableUUID() []byte {
	enc, err := dimoForwarder.abi.Pack("proxiableUUID")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackProxiableUUID is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x52d1902d.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function proxiableUUID() view returns(bytes32)
func (dimoForwarder *DimoForwarder) TryPackProxiableUUID() ([]byte, error) {
	return dimoForwarder.abi.Pack("proxiableUUID")
}

// UnpackProxiableUUID is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x52d1902d.
//
// Solidity: function proxiableUUID() view returns(bytes32)
func (dimoForwarder *DimoForwarder) UnpackProxiableUUID(data []byte) ([32]byte, error) {
	out, err := dimoForwarder.abi.Unpack("proxiableUUID", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackRenounceRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x36568abe.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function renounceRole(bytes32 role, address account) returns()
func (dimoForwarder *DimoForwarder) PackRenounceRole(role [32]byte, account common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("renounceRole", role, account)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackRenounceRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x36568abe.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function renounceRole(bytes32 role, address account) returns()
func (dimoForwarder *DimoForwarder) TryPackRenounceRole(role [32]byte, account common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("renounceRole", role, account)
}

// PackRevokeRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd547741f.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (dimoForwarder *DimoForwarder) PackRevokeRole(role [32]byte, account common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("revokeRole", role, account)
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
func (dimoForwarder *DimoForwarder) TryPackRevokeRole(role [32]byte, account common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("revokeRole", role, account)
}

// PackSetAftermarketDeviceIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4d49d82a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setAftermarketDeviceIdProxyAddress(address adIdProxyAddress_) returns()
func (dimoForwarder *DimoForwarder) PackSetAftermarketDeviceIdProxyAddress(adIdProxyAddress common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("setAftermarketDeviceIdProxyAddress", adIdProxyAddress)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetAftermarketDeviceIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4d49d82a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setAftermarketDeviceIdProxyAddress(address adIdProxyAddress_) returns()
func (dimoForwarder *DimoForwarder) TryPackSetAftermarketDeviceIdProxyAddress(adIdProxyAddress common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("setAftermarketDeviceIdProxyAddress", adIdProxyAddress)
}

// PackSetDimoRegistryAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0db857ea.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDimoRegistryAddress(address dimoRegistry_) returns()
func (dimoForwarder *DimoForwarder) PackSetDimoRegistryAddress(dimoRegistry common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("setDimoRegistryAddress", dimoRegistry)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDimoRegistryAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0db857ea.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDimoRegistryAddress(address dimoRegistry_) returns()
func (dimoForwarder *DimoForwarder) TryPackSetDimoRegistryAddress(dimoRegistry common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("setDimoRegistryAddress", dimoRegistry)
}

// PackSetVehicleIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9bfae6da.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setVehicleIdProxyAddress(address vehicleIdProxyAddress_) returns()
func (dimoForwarder *DimoForwarder) PackSetVehicleIdProxyAddress(vehicleIdProxyAddress common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("setVehicleIdProxyAddress", vehicleIdProxyAddress)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetVehicleIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9bfae6da.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setVehicleIdProxyAddress(address vehicleIdProxyAddress_) returns()
func (dimoForwarder *DimoForwarder) TryPackSetVehicleIdProxyAddress(vehicleIdProxyAddress common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("setVehicleIdProxyAddress", vehicleIdProxyAddress)
}

// PackSupportsInterface is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x01ffc9a7.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (dimoForwarder *DimoForwarder) PackSupportsInterface(interfaceId [4]byte) []byte {
	enc, err := dimoForwarder.abi.Pack("supportsInterface", interfaceId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSupportsInterface is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x01ffc9a7.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (dimoForwarder *DimoForwarder) TryPackSupportsInterface(interfaceId [4]byte) ([]byte, error) {
	return dimoForwarder.abi.Pack("supportsInterface", interfaceId)
}

// UnpackSupportsInterface is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (dimoForwarder *DimoForwarder) UnpackSupportsInterface(data []byte) (bool, error) {
	out, err := dimoForwarder.abi.Unpack("supportsInterface", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackTransferVehicleAndAftermarketDeviceIds is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3cdd8326.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function transferVehicleAndAftermarketDeviceIds(uint256[] vehicleIds, uint256[] aftermarketDeviceIds, address to) returns()
func (dimoForwarder *DimoForwarder) PackTransferVehicleAndAftermarketDeviceIds(vehicleIds []*big.Int, aftermarketDeviceIds []*big.Int, to common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("transferVehicleAndAftermarketDeviceIds", vehicleIds, aftermarketDeviceIds, to)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTransferVehicleAndAftermarketDeviceIds is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3cdd8326.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function transferVehicleAndAftermarketDeviceIds(uint256[] vehicleIds, uint256[] aftermarketDeviceIds, address to) returns()
func (dimoForwarder *DimoForwarder) TryPackTransferVehicleAndAftermarketDeviceIds(vehicleIds []*big.Int, aftermarketDeviceIds []*big.Int, to common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("transferVehicleAndAftermarketDeviceIds", vehicleIds, aftermarketDeviceIds, to)
}

// PackTransferVehicleAndAftermarketDeviceIds0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6d2f54de.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function transferVehicleAndAftermarketDeviceIds(uint256 vehicleId, uint256 aftermarketDeviceId, address to) returns()
func (dimoForwarder *DimoForwarder) PackTransferVehicleAndAftermarketDeviceIds0(vehicleId *big.Int, aftermarketDeviceId *big.Int, to common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("transferVehicleAndAftermarketDeviceIds0", vehicleId, aftermarketDeviceId, to)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTransferVehicleAndAftermarketDeviceIds0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6d2f54de.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function transferVehicleAndAftermarketDeviceIds(uint256 vehicleId, uint256 aftermarketDeviceId, address to) returns()
func (dimoForwarder *DimoForwarder) TryPackTransferVehicleAndAftermarketDeviceIds0(vehicleId *big.Int, aftermarketDeviceId *big.Int, to common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("transferVehicleAndAftermarketDeviceIds0", vehicleId, aftermarketDeviceId, to)
}

// PackUpgradeTo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3659cfe6.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function upgradeTo(address newImplementation) returns()
func (dimoForwarder *DimoForwarder) PackUpgradeTo(newImplementation common.Address) []byte {
	enc, err := dimoForwarder.abi.Pack("upgradeTo", newImplementation)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUpgradeTo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3659cfe6.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function upgradeTo(address newImplementation) returns()
func (dimoForwarder *DimoForwarder) TryPackUpgradeTo(newImplementation common.Address) ([]byte, error) {
	return dimoForwarder.abi.Pack("upgradeTo", newImplementation)
}

// PackUpgradeToAndCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4f1ef286.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function upgradeToAndCall(address newImplementation, bytes data) payable returns()
func (dimoForwarder *DimoForwarder) PackUpgradeToAndCall(newImplementation common.Address, data []byte) []byte {
	enc, err := dimoForwarder.abi.Pack("upgradeToAndCall", newImplementation, data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackUpgradeToAndCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4f1ef286.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function upgradeToAndCall(address newImplementation, bytes data) payable returns()
func (dimoForwarder *DimoForwarder) TryPackUpgradeToAndCall(newImplementation common.Address, data []byte) ([]byte, error) {
	return dimoForwarder.abi.Pack("upgradeToAndCall", newImplementation, data)
}

// PackVehicleIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8823467a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function vehicleIdProxyAddress() view returns(address)
func (dimoForwarder *DimoForwarder) PackVehicleIdProxyAddress() []byte {
	enc, err := dimoForwarder.abi.Pack("vehicleIdProxyAddress")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackVehicleIdProxyAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8823467a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function vehicleIdProxyAddress() view returns(address)
func (dimoForwarder *DimoForwarder) TryPackVehicleIdProxyAddress() ([]byte, error) {
	return dimoForwarder.abi.Pack("vehicleIdProxyAddress")
}

// UnpackVehicleIdProxyAddress is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x8823467a.
//
// Solidity: function vehicleIdProxyAddress() view returns(address)
func (dimoForwarder *DimoForwarder) UnpackVehicleIdProxyAddress(data []byte) (common.Address, error) {
	out, err := dimoForwarder.abi.Unpack("vehicleIdProxyAddress", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// DimoForwarderAdminChanged represents a AdminChanged event raised by the DimoForwarder contract.
type DimoForwarderAdminChanged struct {
	PreviousAdmin common.Address
	NewAdmin      common.Address
	Raw           *types.Log // Blockchain specific contextual infos
}

const DimoForwarderAdminChangedEventName = "AdminChanged"

// ContractEventName returns the user-defined event name.
func (DimoForwarderAdminChanged) ContractEventName() string {
	return DimoForwarderAdminChangedEventName
}

// UnpackAdminChangedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AdminChanged(address previousAdmin, address newAdmin)
func (dimoForwarder *DimoForwarder) UnpackAdminChangedEvent(log *types.Log) (*DimoForwarderAdminChanged, error) {
	event := "AdminChanged"
	if len(log.Topics) == 0 || log.Topics[0] != dimoForwarder.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(DimoForwarderAdminChanged)
	if len(log.Data) > 0 {
		if err := dimoForwarder.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range dimoForwarder.abi.Events[event].Inputs {
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

// DimoForwarderBeaconUpgraded represents a BeaconUpgraded event raised by the DimoForwarder contract.
type DimoForwarderBeaconUpgraded struct {
	Beacon common.Address
	Raw    *types.Log // Blockchain specific contextual infos
}

const DimoForwarderBeaconUpgradedEventName = "BeaconUpgraded"

// ContractEventName returns the user-defined event name.
func (DimoForwarderBeaconUpgraded) ContractEventName() string {
	return DimoForwarderBeaconUpgradedEventName
}

// UnpackBeaconUpgradedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event BeaconUpgraded(address indexed beacon)
func (dimoForwarder *DimoForwarder) UnpackBeaconUpgradedEvent(log *types.Log) (*DimoForwarderBeaconUpgraded, error) {
	event := "BeaconUpgraded"
	if len(log.Topics) == 0 || log.Topics[0] != dimoForwarder.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(DimoForwarderBeaconUpgraded)
	if len(log.Data) > 0 {
		if err := dimoForwarder.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range dimoForwarder.abi.Events[event].Inputs {
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

// DimoForwarderInitialized represents a Initialized event raised by the DimoForwarder contract.
type DimoForwarderInitialized struct {
	Version uint8
	Raw     *types.Log // Blockchain specific contextual infos
}

const DimoForwarderInitializedEventName = "Initialized"

// ContractEventName returns the user-defined event name.
func (DimoForwarderInitialized) ContractEventName() string {
	return DimoForwarderInitializedEventName
}

// UnpackInitializedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Initialized(uint8 version)
func (dimoForwarder *DimoForwarder) UnpackInitializedEvent(log *types.Log) (*DimoForwarderInitialized, error) {
	event := "Initialized"
	if len(log.Topics) == 0 || log.Topics[0] != dimoForwarder.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(DimoForwarderInitialized)
	if len(log.Data) > 0 {
		if err := dimoForwarder.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range dimoForwarder.abi.Events[event].Inputs {
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

// DimoForwarderRoleAdminChanged represents a RoleAdminChanged event raised by the DimoForwarder contract.
type DimoForwarderRoleAdminChanged struct {
	Role              [32]byte
	PreviousAdminRole [32]byte
	NewAdminRole      [32]byte
	Raw               *types.Log // Blockchain specific contextual infos
}

const DimoForwarderRoleAdminChangedEventName = "RoleAdminChanged"

// ContractEventName returns the user-defined event name.
func (DimoForwarderRoleAdminChanged) ContractEventName() string {
	return DimoForwarderRoleAdminChangedEventName
}

// UnpackRoleAdminChangedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
func (dimoForwarder *DimoForwarder) UnpackRoleAdminChangedEvent(log *types.Log) (*DimoForwarderRoleAdminChanged, error) {
	event := "RoleAdminChanged"
	if len(log.Topics) == 0 || log.Topics[0] != dimoForwarder.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(DimoForwarderRoleAdminChanged)
	if len(log.Data) > 0 {
		if err := dimoForwarder.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range dimoForwarder.abi.Events[event].Inputs {
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

// DimoForwarderRoleGranted represents a RoleGranted event raised by the DimoForwarder contract.
type DimoForwarderRoleGranted struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const DimoForwarderRoleGrantedEventName = "RoleGranted"

// ContractEventName returns the user-defined event name.
func (DimoForwarderRoleGranted) ContractEventName() string {
	return DimoForwarderRoleGrantedEventName
}

// UnpackRoleGrantedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (dimoForwarder *DimoForwarder) UnpackRoleGrantedEvent(log *types.Log) (*DimoForwarderRoleGranted, error) {
	event := "RoleGranted"
	if len(log.Topics) == 0 || log.Topics[0] != dimoForwarder.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(DimoForwarderRoleGranted)
	if len(log.Data) > 0 {
		if err := dimoForwarder.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range dimoForwarder.abi.Events[event].Inputs {
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

// DimoForwarderRoleRevoked represents a RoleRevoked event raised by the DimoForwarder contract.
type DimoForwarderRoleRevoked struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const DimoForwarderRoleRevokedEventName = "RoleRevoked"

// ContractEventName returns the user-defined event name.
func (DimoForwarderRoleRevoked) ContractEventName() string {
	return DimoForwarderRoleRevokedEventName
}

// UnpackRoleRevokedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (dimoForwarder *DimoForwarder) UnpackRoleRevokedEvent(log *types.Log) (*DimoForwarderRoleRevoked, error) {
	event := "RoleRevoked"
	if len(log.Topics) == 0 || log.Topics[0] != dimoForwarder.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(DimoForwarderRoleRevoked)
	if len(log.Data) > 0 {
		if err := dimoForwarder.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range dimoForwarder.abi.Events[event].Inputs {
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

// DimoForwarderUpgraded represents a Upgraded event raised by the DimoForwarder contract.
type DimoForwarderUpgraded struct {
	Implementation common.Address
	Raw            *types.Log // Blockchain specific contextual infos
}

const DimoForwarderUpgradedEventName = "Upgraded"

// ContractEventName returns the user-defined event name.
func (DimoForwarderUpgraded) ContractEventName() string {
	return DimoForwarderUpgradedEventName
}

// UnpackUpgradedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Upgraded(address indexed implementation)
func (dimoForwarder *DimoForwarder) UnpackUpgradedEvent(log *types.Log) (*DimoForwarderUpgraded, error) {
	event := "Upgraded"
	if len(log.Topics) == 0 || log.Topics[0] != dimoForwarder.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(DimoForwarderUpgraded)
	if len(log.Data) > 0 {
		if err := dimoForwarder.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range dimoForwarder.abi.Events[event].Inputs {
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
func (dimoForwarder *DimoForwarder) UnpackError(raw []byte) (any, error) {
	if bytes.Equal(raw[:4], dimoForwarder.abi.Errors["InvalidLink"].ID.Bytes()[:4]) {
		return dimoForwarder.UnpackInvalidLinkError(raw[4:])
	}
	if bytes.Equal(raw[:4], dimoForwarder.abi.Errors["TransferFailed"].ID.Bytes()[:4]) {
		return dimoForwarder.UnpackTransferFailedError(raw[4:])
	}
	if bytes.Equal(raw[:4], dimoForwarder.abi.Errors["ZeroAddress"].ID.Bytes()[:4]) {
		return dimoForwarder.UnpackZeroAddressError(raw[4:])
	}
	return nil, errors.New("Unknown error")
}

// DimoForwarderInvalidLink represents a InvalidLink error raised by the DimoForwarder contract.
type DimoForwarderInvalidLink struct {
	IdProxySource common.Address
	IdProxyTraget common.Address
	SourceId      *big.Int
	TargetId      *big.Int
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error InvalidLink(address idProxySource, address idProxyTraget, uint256 sourceId, uint256 targetId)
func DimoForwarderInvalidLinkErrorID() common.Hash {
	return common.HexToHash("0x08ee6d9866be82d3f5b24594002781d23c51dd22640c216d421b0054f147e80b")
}

// UnpackInvalidLinkError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error InvalidLink(address idProxySource, address idProxyTraget, uint256 sourceId, uint256 targetId)
func (dimoForwarder *DimoForwarder) UnpackInvalidLinkError(raw []byte) (*DimoForwarderInvalidLink, error) {
	out := new(DimoForwarderInvalidLink)
	if err := dimoForwarder.abi.UnpackIntoInterface(out, "InvalidLink", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// DimoForwarderTransferFailed represents a TransferFailed error raised by the DimoForwarder contract.
type DimoForwarderTransferFailed struct {
	IdProxy      common.Address
	Id           *big.Int
	ErrorMessage string
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error TransferFailed(address idProxy, uint256 id, string errorMessage)
func DimoForwarderTransferFailedErrorID() common.Hash {
	return common.HexToHash("0x32bd04fba17e3a4e042de2ca40e007e3f7478948cb07937b3e2059d4be9486e0")
}

// UnpackTransferFailedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error TransferFailed(address idProxy, uint256 id, string errorMessage)
func (dimoForwarder *DimoForwarder) UnpackTransferFailedError(raw []byte) (*DimoForwarderTransferFailed, error) {
	out := new(DimoForwarderTransferFailed)
	if err := dimoForwarder.abi.UnpackIntoInterface(out, "TransferFailed", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// DimoForwarderZeroAddress represents a ZeroAddress error raised by the DimoForwarder contract.
type DimoForwarderZeroAddress struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error ZeroAddress()
func DimoForwarderZeroAddressErrorID() common.Hash {
	return common.HexToHash("0xd92e233df2717d4a40030e20904abd27b68fcbeede117eaaccbbdac9618c8c73")
}

// UnpackZeroAddressError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error ZeroAddress()
func (dimoForwarder *DimoForwarder) UnpackZeroAddressError(raw []byte) (*DimoForwarderZeroAddress, error) {
	out := new(DimoForwarderZeroAddress)
	if err := dimoForwarder.abi.UnpackIntoInterface(out, "ZeroAddress", raw); err != nil {
		return nil, err
	}
	return out, nil
}
