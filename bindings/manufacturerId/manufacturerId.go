// Code generated via abigen V2 - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package manufacturerId

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

// ManufacturerIdSetPrivilegeData is an auto generated low-level Go binding around an user-defined struct.
type ManufacturerIdSetPrivilegeData struct {
	TokenId *big.Int
	PrivId  *big.Int
	User    common.Address
	Expires *big.Int
}

// ManufacturerIdMetaData contains all meta data concerning the ManufacturerId contract.
var ManufacturerIdMetaData = bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"previousAdmin\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"newAdmin\",\"type\":\"address\"}],\"name\":\"AdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_fromTokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_toTokenId\",\"type\":\"uint256\"}],\"name\":\"BatchMetadataUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"beacon\",\"type\":\"address\"}],\"name\":\"BeaconUpgraded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_tokenId\",\"type\":\"uint256\"}],\"name\":\"MetadataUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privilegeId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"}],\"name\":\"PrivilegeCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privilegeId\",\"type\":\"uint256\"}],\"name\":\"PrivilegeDisabled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privilegeId\",\"type\":\"uint256\"}],\"name\":\"PrivilegeEnabled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"version\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"expires\",\"type\":\"uint256\"}],\"name\":\"PrivilegeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"previousAdminRole\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"newAdminRole\",\"type\":\"bytes32\"}],\"name\":\"RoleAdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"implementation\",\"type\":\"address\"}],\"name\":\"Upgraded\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"BURNER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"DEFAULT_ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MINTER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"TRANSFERER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"UPGRADER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_dimoRegistry\",\"outputs\":[{\"internalType\":\"contractIDimoRegistry\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"}],\"name\":\"createPrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"}],\"name\":\"disablePrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"}],\"name\":\"enablePrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"exists\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleAdmin\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"grantRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"hasPrivilege\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name_\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"symbol_\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"baseUri_\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"dimoRegistry_\",\"type\":\"address\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"privilegeEntry\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"privilegeExpiresAt\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"privilegeRecord\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"proxiableUUID\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"revokeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"safeMint\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"uri\",\"type\":\"string\"}],\"name\":\"safeMint\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"baseURI_\",\"type\":\"string\"}],\"name\":\"setBaseURI\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setDimoRegistryAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expires\",\"type\":\"uint256\"}],\"name\":\"setPrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expires\",\"type\":\"uint256\"}],\"internalType\":\"structManufacturerId.SetPrivilegeData[]\",\"name\":\"privData\",\"type\":\"tuple[]\"}],\"name\":\"setPrivileges\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"tokenIdToVersion\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"}],\"name\":\"upgradeTo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"upgradeToAndCall\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"}]",
	ID:  "ManufacturerId",
}

// ManufacturerId is an auto generated Go binding around an Ethereum contract.
type ManufacturerId struct {
	abi abi.ABI
}

// NewManufacturerId creates a new instance of ManufacturerId.
func NewManufacturerId() *ManufacturerId {
	parsed, err := ManufacturerIdMetaData.ParseABI()
	if err != nil {
		panic(errors.New("invalid ABI: " + err.Error()))
	}
	return &ManufacturerId{abi: *parsed}
}

// Instance creates a wrapper for a deployed contract instance at the given address.
// Use this to create the instance object passed to abigen v2 library functions Call, Transact, etc.
func (c *ManufacturerId) Instance(backend bind.ContractBackend, addr common.Address) *bind.BoundContract {
	return bind.NewBoundContract(addr, c.abi, backend, backend, backend)
}

// PackADMINROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x75b238fc.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function ADMIN_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) PackADMINROLE() []byte {
	enc, err := manufacturerId.abi.Pack("ADMIN_ROLE")
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
func (manufacturerId *ManufacturerId) TryPackADMINROLE() ([]byte, error) {
	return manufacturerId.abi.Pack("ADMIN_ROLE")
}

// UnpackADMINROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x75b238fc.
//
// Solidity: function ADMIN_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackADMINROLE(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("ADMIN_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackBURNERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x282c51f3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function BURNER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) PackBURNERROLE() []byte {
	enc, err := manufacturerId.abi.Pack("BURNER_ROLE")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackBURNERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x282c51f3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function BURNER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) TryPackBURNERROLE() ([]byte, error) {
	return manufacturerId.abi.Pack("BURNER_ROLE")
}

// UnpackBURNERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x282c51f3.
//
// Solidity: function BURNER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackBURNERROLE(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("BURNER_ROLE", data)
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
func (manufacturerId *ManufacturerId) PackDEFAULTADMINROLE() []byte {
	enc, err := manufacturerId.abi.Pack("DEFAULT_ADMIN_ROLE")
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
func (manufacturerId *ManufacturerId) TryPackDEFAULTADMINROLE() ([]byte, error) {
	return manufacturerId.abi.Pack("DEFAULT_ADMIN_ROLE")
}

// UnpackDEFAULTADMINROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xa217fddf.
//
// Solidity: function DEFAULT_ADMIN_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackDEFAULTADMINROLE(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("DEFAULT_ADMIN_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackMINTERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd5391393.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function MINTER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) PackMINTERROLE() []byte {
	enc, err := manufacturerId.abi.Pack("MINTER_ROLE")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackMINTERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd5391393.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function MINTER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) TryPackMINTERROLE() ([]byte, error) {
	return manufacturerId.abi.Pack("MINTER_ROLE")
}

// UnpackMINTERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd5391393.
//
// Solidity: function MINTER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackMINTERROLE(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("MINTER_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackTRANSFERERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0ade7dc1.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function TRANSFERER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) PackTRANSFERERROLE() []byte {
	enc, err := manufacturerId.abi.Pack("TRANSFERER_ROLE")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTRANSFERERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0ade7dc1.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function TRANSFERER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) TryPackTRANSFERERROLE() ([]byte, error) {
	return manufacturerId.abi.Pack("TRANSFERER_ROLE")
}

// UnpackTRANSFERERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x0ade7dc1.
//
// Solidity: function TRANSFERER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackTRANSFERERROLE(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("TRANSFERER_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackUPGRADERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf72c0d8b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function UPGRADER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) PackUPGRADERROLE() []byte {
	enc, err := manufacturerId.abi.Pack("UPGRADER_ROLE")
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
func (manufacturerId *ManufacturerId) TryPackUPGRADERROLE() ([]byte, error) {
	return manufacturerId.abi.Pack("UPGRADER_ROLE")
}

// UnpackUPGRADERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xf72c0d8b.
//
// Solidity: function UPGRADER_ROLE() view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackUPGRADERROLE(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("UPGRADER_ROLE", data)
	if err != nil {
		return *new([32]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([32]byte)).(*[32]byte)
	return out0, nil
}

// PackDimoRegistry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7625c605.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function _dimoRegistry() view returns(address)
func (manufacturerId *ManufacturerId) PackDimoRegistry() []byte {
	enc, err := manufacturerId.abi.Pack("_dimoRegistry")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackDimoRegistry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x7625c605.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function _dimoRegistry() view returns(address)
func (manufacturerId *ManufacturerId) TryPackDimoRegistry() ([]byte, error) {
	return manufacturerId.abi.Pack("_dimoRegistry")
}

// UnpackDimoRegistry is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x7625c605.
//
// Solidity: function _dimoRegistry() view returns(address)
func (manufacturerId *ManufacturerId) UnpackDimoRegistry(data []byte) (common.Address, error) {
	out, err := manufacturerId.abi.Unpack("_dimoRegistry", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackApprove is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x095ea7b3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) PackApprove(to common.Address, tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("approve", to, tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackApprove is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x095ea7b3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function approve(address to, uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) TryPackApprove(to common.Address, tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("approve", to, tokenId)
}

// PackBalanceOf is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x70a08231.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (manufacturerId *ManufacturerId) PackBalanceOf(owner common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("balanceOf", owner)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackBalanceOf is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x70a08231.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (manufacturerId *ManufacturerId) TryPackBalanceOf(owner common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("balanceOf", owner)
}

// UnpackBalanceOf is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (manufacturerId *ManufacturerId) UnpackBalanceOf(data []byte) (*big.Int, error) {
	out, err := manufacturerId.abi.Unpack("balanceOf", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackBurn is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x42966c68.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function burn(uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) PackBurn(tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("burn", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackBurn is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x42966c68.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function burn(uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) TryPackBurn(tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("burn", tokenId)
}

// PackCreatePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc1d58b3b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function createPrivilege(bool enabled, string description) returns()
func (manufacturerId *ManufacturerId) PackCreatePrivilege(enabled bool, description string) []byte {
	enc, err := manufacturerId.abi.Pack("createPrivilege", enabled, description)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackCreatePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc1d58b3b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function createPrivilege(bool enabled, string description) returns()
func (manufacturerId *ManufacturerId) TryPackCreatePrivilege(enabled bool, description string) ([]byte, error) {
	return manufacturerId.abi.Pack("createPrivilege", enabled, description)
}

// PackDisablePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1a153ed0.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function disablePrivilege(uint256 privId) returns()
func (manufacturerId *ManufacturerId) PackDisablePrivilege(privId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("disablePrivilege", privId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackDisablePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1a153ed0.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function disablePrivilege(uint256 privId) returns()
func (manufacturerId *ManufacturerId) TryPackDisablePrivilege(privId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("disablePrivilege", privId)
}

// PackEnablePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x831ba696.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function enablePrivilege(uint256 privId) returns()
func (manufacturerId *ManufacturerId) PackEnablePrivilege(privId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("enablePrivilege", privId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackEnablePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x831ba696.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function enablePrivilege(uint256 privId) returns()
func (manufacturerId *ManufacturerId) TryPackEnablePrivilege(privId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("enablePrivilege", privId)
}

// PackExists is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4f558e79.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function exists(uint256 tokenId) view returns(bool)
func (manufacturerId *ManufacturerId) PackExists(tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("exists", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackExists is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4f558e79.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function exists(uint256 tokenId) view returns(bool)
func (manufacturerId *ManufacturerId) TryPackExists(tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("exists", tokenId)
}

// UnpackExists is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x4f558e79.
//
// Solidity: function exists(uint256 tokenId) view returns(bool)
func (manufacturerId *ManufacturerId) UnpackExists(data []byte) (bool, error) {
	out, err := manufacturerId.abi.Unpack("exists", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackGetApproved is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x081812fc.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (manufacturerId *ManufacturerId) PackGetApproved(tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("getApproved", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetApproved is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x081812fc.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (manufacturerId *ManufacturerId) TryPackGetApproved(tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("getApproved", tokenId)
}

// UnpackGetApproved is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (manufacturerId *ManufacturerId) UnpackGetApproved(data []byte) (common.Address, error) {
	out, err := manufacturerId.abi.Unpack("getApproved", data)
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
func (manufacturerId *ManufacturerId) PackGetRoleAdmin(role [32]byte) []byte {
	enc, err := manufacturerId.abi.Pack("getRoleAdmin", role)
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
func (manufacturerId *ManufacturerId) TryPackGetRoleAdmin(role [32]byte) ([]byte, error) {
	return manufacturerId.abi.Pack("getRoleAdmin", role)
}

// UnpackGetRoleAdmin is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x248a9ca3.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackGetRoleAdmin(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("getRoleAdmin", data)
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
func (manufacturerId *ManufacturerId) PackGrantRole(role [32]byte, account common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("grantRole", role, account)
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
func (manufacturerId *ManufacturerId) TryPackGrantRole(role [32]byte, account common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("grantRole", role, account)
}

// PackHasPrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x05d80b00.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function hasPrivilege(uint256 tokenId, uint256 privId, address user) view returns(bool)
func (manufacturerId *ManufacturerId) PackHasPrivilege(tokenId *big.Int, privId *big.Int, user common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("hasPrivilege", tokenId, privId, user)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackHasPrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x05d80b00.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function hasPrivilege(uint256 tokenId, uint256 privId, address user) view returns(bool)
func (manufacturerId *ManufacturerId) TryPackHasPrivilege(tokenId *big.Int, privId *big.Int, user common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("hasPrivilege", tokenId, privId, user)
}

// UnpackHasPrivilege is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x05d80b00.
//
// Solidity: function hasPrivilege(uint256 tokenId, uint256 privId, address user) view returns(bool)
func (manufacturerId *ManufacturerId) UnpackHasPrivilege(data []byte) (bool, error) {
	out, err := manufacturerId.abi.Unpack("hasPrivilege", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackHasRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x91d14854.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (manufacturerId *ManufacturerId) PackHasRole(role [32]byte, account common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("hasRole", role, account)
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
func (manufacturerId *ManufacturerId) TryPackHasRole(role [32]byte, account common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("hasRole", role, account)
}

// UnpackHasRole is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (manufacturerId *ManufacturerId) UnpackHasRole(data []byte) (bool, error) {
	out, err := manufacturerId.abi.Unpack("hasRole", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5c6d8da1.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function initialize(string name_, string symbol_, string baseUri_, address dimoRegistry_) returns()
func (manufacturerId *ManufacturerId) PackInitialize(name string, symbol string, baseUri string, dimoRegistry common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("initialize", name, symbol, baseUri, dimoRegistry)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x5c6d8da1.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function initialize(string name_, string symbol_, string baseUri_, address dimoRegistry_) returns()
func (manufacturerId *ManufacturerId) TryPackInitialize(name string, symbol string, baseUri string, dimoRegistry common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("initialize", name, symbol, baseUri, dimoRegistry)
}

// PackIsApprovedForAll is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe985e9c5.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (manufacturerId *ManufacturerId) PackIsApprovedForAll(owner common.Address, operator common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("isApprovedForAll", owner, operator)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackIsApprovedForAll is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe985e9c5.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (manufacturerId *ManufacturerId) TryPackIsApprovedForAll(owner common.Address, operator common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("isApprovedForAll", owner, operator)
}

// UnpackIsApprovedForAll is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (manufacturerId *ManufacturerId) UnpackIsApprovedForAll(data []byte) (bool, error) {
	out, err := manufacturerId.abi.Unpack("isApprovedForAll", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackName is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x06fdde03.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function name() view returns(string)
func (manufacturerId *ManufacturerId) PackName() []byte {
	enc, err := manufacturerId.abi.Pack("name")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackName is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x06fdde03.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function name() view returns(string)
func (manufacturerId *ManufacturerId) TryPackName() ([]byte, error) {
	return manufacturerId.abi.Pack("name")
}

// UnpackName is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (manufacturerId *ManufacturerId) UnpackName(data []byte) (string, error) {
	out, err := manufacturerId.abi.Unpack("name", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackOwnerOf is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6352211e.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (manufacturerId *ManufacturerId) PackOwnerOf(tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("ownerOf", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackOwnerOf is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6352211e.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (manufacturerId *ManufacturerId) TryPackOwnerOf(tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("ownerOf", tokenId)
}

// UnpackOwnerOf is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (manufacturerId *ManufacturerId) UnpackOwnerOf(data []byte) (common.Address, error) {
	out, err := manufacturerId.abi.Unpack("ownerOf", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackPrivilegeEntry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x48db4640.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function privilegeEntry(uint256 , uint256 , uint256 , address ) view returns(uint256)
func (manufacturerId *ManufacturerId) PackPrivilegeEntry(arg0 *big.Int, arg1 *big.Int, arg2 *big.Int, arg3 common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("privilegeEntry", arg0, arg1, arg2, arg3)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackPrivilegeEntry is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x48db4640.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function privilegeEntry(uint256 , uint256 , uint256 , address ) view returns(uint256)
func (manufacturerId *ManufacturerId) TryPackPrivilegeEntry(arg0 *big.Int, arg1 *big.Int, arg2 *big.Int, arg3 common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("privilegeEntry", arg0, arg1, arg2, arg3)
}

// UnpackPrivilegeEntry is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x48db4640.
//
// Solidity: function privilegeEntry(uint256 , uint256 , uint256 , address ) view returns(uint256)
func (manufacturerId *ManufacturerId) UnpackPrivilegeEntry(data []byte) (*big.Int, error) {
	out, err := manufacturerId.abi.Unpack("privilegeEntry", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackPrivilegeExpiresAt is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd0f8f5f6.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function privilegeExpiresAt(uint256 tokenId, uint256 privId, address user) view returns(uint256)
func (manufacturerId *ManufacturerId) PackPrivilegeExpiresAt(tokenId *big.Int, privId *big.Int, user common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("privilegeExpiresAt", tokenId, privId, user)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackPrivilegeExpiresAt is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd0f8f5f6.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function privilegeExpiresAt(uint256 tokenId, uint256 privId, address user) view returns(uint256)
func (manufacturerId *ManufacturerId) TryPackPrivilegeExpiresAt(tokenId *big.Int, privId *big.Int, user common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("privilegeExpiresAt", tokenId, privId, user)
}

// UnpackPrivilegeExpiresAt is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd0f8f5f6.
//
// Solidity: function privilegeExpiresAt(uint256 tokenId, uint256 privId, address user) view returns(uint256)
func (manufacturerId *ManufacturerId) UnpackPrivilegeExpiresAt(data []byte) (*big.Int, error) {
	out, err := manufacturerId.abi.Unpack("privilegeExpiresAt", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackPrivilegeRecord is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf9ad3efe.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function privilegeRecord(uint256 ) view returns(bool enabled, string description)
func (manufacturerId *ManufacturerId) PackPrivilegeRecord(arg0 *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("privilegeRecord", arg0)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackPrivilegeRecord is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf9ad3efe.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function privilegeRecord(uint256 ) view returns(bool enabled, string description)
func (manufacturerId *ManufacturerId) TryPackPrivilegeRecord(arg0 *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("privilegeRecord", arg0)
}

// PrivilegeRecordOutput serves as a container for the return parameters of contract
// method PrivilegeRecord.
type PrivilegeRecordOutput struct {
	Enabled     bool
	Description string
}

// UnpackPrivilegeRecord is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xf9ad3efe.
//
// Solidity: function privilegeRecord(uint256 ) view returns(bool enabled, string description)
func (manufacturerId *ManufacturerId) UnpackPrivilegeRecord(data []byte) (PrivilegeRecordOutput, error) {
	out, err := manufacturerId.abi.Unpack("privilegeRecord", data)
	outstruct := new(PrivilegeRecordOutput)
	if err != nil {
		return *outstruct, err
	}
	outstruct.Enabled = *abi.ConvertType(out[0], new(bool)).(*bool)
	outstruct.Description = *abi.ConvertType(out[1], new(string)).(*string)
	return *outstruct, nil
}

// PackProxiableUUID is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x52d1902d.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function proxiableUUID() view returns(bytes32)
func (manufacturerId *ManufacturerId) PackProxiableUUID() []byte {
	enc, err := manufacturerId.abi.Pack("proxiableUUID")
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
func (manufacturerId *ManufacturerId) TryPackProxiableUUID() ([]byte, error) {
	return manufacturerId.abi.Pack("proxiableUUID")
}

// UnpackProxiableUUID is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x52d1902d.
//
// Solidity: function proxiableUUID() view returns(bytes32)
func (manufacturerId *ManufacturerId) UnpackProxiableUUID(data []byte) ([32]byte, error) {
	out, err := manufacturerId.abi.Unpack("proxiableUUID", data)
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
func (manufacturerId *ManufacturerId) PackRenounceRole(role [32]byte, account common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("renounceRole", role, account)
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
func (manufacturerId *ManufacturerId) TryPackRenounceRole(role [32]byte, account common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("renounceRole", role, account)
}

// PackRevokeRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd547741f.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (manufacturerId *ManufacturerId) PackRevokeRole(role [32]byte, account common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("revokeRole", role, account)
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
func (manufacturerId *ManufacturerId) TryPackRevokeRole(role [32]byte, account common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("revokeRole", role, account)
}

// PackSafeMint is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x40d097c3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function safeMint(address to) returns(uint256 tokenId)
func (manufacturerId *ManufacturerId) PackSafeMint(to common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("safeMint", to)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSafeMint is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x40d097c3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function safeMint(address to) returns(uint256 tokenId)
func (manufacturerId *ManufacturerId) TryPackSafeMint(to common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("safeMint", to)
}

// UnpackSafeMint is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x40d097c3.
//
// Solidity: function safeMint(address to) returns(uint256 tokenId)
func (manufacturerId *ManufacturerId) UnpackSafeMint(data []byte) (*big.Int, error) {
	out, err := manufacturerId.abi.Unpack("safeMint", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackSafeMint0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd204c45e.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function safeMint(address to, string uri) returns(uint256 tokenId)
func (manufacturerId *ManufacturerId) PackSafeMint0(to common.Address, uri string) []byte {
	enc, err := manufacturerId.abi.Pack("safeMint0", to, uri)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSafeMint0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd204c45e.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function safeMint(address to, string uri) returns(uint256 tokenId)
func (manufacturerId *ManufacturerId) TryPackSafeMint0(to common.Address, uri string) ([]byte, error) {
	return manufacturerId.abi.Pack("safeMint0", to, uri)
}

// UnpackSafeMint0 is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd204c45e.
//
// Solidity: function safeMint(address to, string uri) returns(uint256 tokenId)
func (manufacturerId *ManufacturerId) UnpackSafeMint0(data []byte) (*big.Int, error) {
	out, err := manufacturerId.abi.Unpack("safeMint0", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackSafeTransferFrom is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x42842e0e.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) PackSafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("safeTransferFrom", from, to, tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSafeTransferFrom is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x42842e0e.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) TryPackSafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("safeTransferFrom", from, to, tokenId)
}

// PackSafeTransferFrom0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb88d4fde.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (manufacturerId *ManufacturerId) PackSafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) []byte {
	enc, err := manufacturerId.abi.Pack("safeTransferFrom0", from, to, tokenId, data)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSafeTransferFrom0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb88d4fde.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (manufacturerId *ManufacturerId) TryPackSafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) ([]byte, error) {
	return manufacturerId.abi.Pack("safeTransferFrom0", from, to, tokenId, data)
}

// PackSetApprovalForAll is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa22cb465.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (manufacturerId *ManufacturerId) PackSetApprovalForAll(operator common.Address, approved bool) []byte {
	enc, err := manufacturerId.abi.Pack("setApprovalForAll", operator, approved)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetApprovalForAll is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa22cb465.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (manufacturerId *ManufacturerId) TryPackSetApprovalForAll(operator common.Address, approved bool) ([]byte, error) {
	return manufacturerId.abi.Pack("setApprovalForAll", operator, approved)
}

// PackSetBaseURI is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x55f804b3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setBaseURI(string baseURI_) returns()
func (manufacturerId *ManufacturerId) PackSetBaseURI(baseURI string) []byte {
	enc, err := manufacturerId.abi.Pack("setBaseURI", baseURI)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetBaseURI is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x55f804b3.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setBaseURI(string baseURI_) returns()
func (manufacturerId *ManufacturerId) TryPackSetBaseURI(baseURI string) ([]byte, error) {
	return manufacturerId.abi.Pack("setBaseURI", baseURI)
}

// PackSetDimoRegistryAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0db857ea.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDimoRegistryAddress(address addr) returns()
func (manufacturerId *ManufacturerId) PackSetDimoRegistryAddress(addr common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("setDimoRegistryAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetDimoRegistryAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0db857ea.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setDimoRegistryAddress(address addr) returns()
func (manufacturerId *ManufacturerId) TryPackSetDimoRegistryAddress(addr common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("setDimoRegistryAddress", addr)
}

// PackSetPrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xeca3221a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setPrivilege(uint256 tokenId, uint256 privId, address user, uint256 expires) returns()
func (manufacturerId *ManufacturerId) PackSetPrivilege(tokenId *big.Int, privId *big.Int, user common.Address, expires *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("setPrivilege", tokenId, privId, user, expires)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetPrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xeca3221a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setPrivilege(uint256 tokenId, uint256 privId, address user, uint256 expires) returns()
func (manufacturerId *ManufacturerId) TryPackSetPrivilege(tokenId *big.Int, privId *big.Int, user common.Address, expires *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("setPrivilege", tokenId, privId, user, expires)
}

// PackSetPrivileges is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x57ae9754.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setPrivileges((uint256,uint256,address,uint256)[] privData) returns()
func (manufacturerId *ManufacturerId) PackSetPrivileges(privData []ManufacturerIdSetPrivilegeData) []byte {
	enc, err := manufacturerId.abi.Pack("setPrivileges", privData)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetPrivileges is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x57ae9754.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setPrivileges((uint256,uint256,address,uint256)[] privData) returns()
func (manufacturerId *ManufacturerId) TryPackSetPrivileges(privData []ManufacturerIdSetPrivilegeData) ([]byte, error) {
	return manufacturerId.abi.Pack("setPrivileges", privData)
}

// PackSupportsInterface is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x01ffc9a7.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (manufacturerId *ManufacturerId) PackSupportsInterface(interfaceId [4]byte) []byte {
	enc, err := manufacturerId.abi.Pack("supportsInterface", interfaceId)
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
func (manufacturerId *ManufacturerId) TryPackSupportsInterface(interfaceId [4]byte) ([]byte, error) {
	return manufacturerId.abi.Pack("supportsInterface", interfaceId)
}

// UnpackSupportsInterface is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (manufacturerId *ManufacturerId) UnpackSupportsInterface(data []byte) (bool, error) {
	out, err := manufacturerId.abi.Unpack("supportsInterface", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackSymbol is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x95d89b41.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function symbol() view returns(string)
func (manufacturerId *ManufacturerId) PackSymbol() []byte {
	enc, err := manufacturerId.abi.Pack("symbol")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSymbol is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x95d89b41.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function symbol() view returns(string)
func (manufacturerId *ManufacturerId) TryPackSymbol() ([]byte, error) {
	return manufacturerId.abi.Pack("symbol")
}

// UnpackSymbol is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (manufacturerId *ManufacturerId) UnpackSymbol(data []byte) (string, error) {
	out, err := manufacturerId.abi.Unpack("symbol", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackTokenIdToVersion is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf1a9d41c.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function tokenIdToVersion(uint256 ) view returns(uint256)
func (manufacturerId *ManufacturerId) PackTokenIdToVersion(arg0 *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("tokenIdToVersion", arg0)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTokenIdToVersion is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf1a9d41c.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function tokenIdToVersion(uint256 ) view returns(uint256)
func (manufacturerId *ManufacturerId) TryPackTokenIdToVersion(arg0 *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("tokenIdToVersion", arg0)
}

// UnpackTokenIdToVersion is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xf1a9d41c.
//
// Solidity: function tokenIdToVersion(uint256 ) view returns(uint256)
func (manufacturerId *ManufacturerId) UnpackTokenIdToVersion(data []byte) (*big.Int, error) {
	out, err := manufacturerId.abi.Unpack("tokenIdToVersion", data)
	if err != nil {
		return new(big.Int), err
	}
	out0 := abi.ConvertType(out[0], new(big.Int)).(*big.Int)
	return out0, nil
}

// PackTokenURI is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc87b56dd.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (manufacturerId *ManufacturerId) PackTokenURI(tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("tokenURI", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTokenURI is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc87b56dd.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (manufacturerId *ManufacturerId) TryPackTokenURI(tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("tokenURI", tokenId)
}

// UnpackTokenURI is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (manufacturerId *ManufacturerId) UnpackTokenURI(data []byte) (string, error) {
	out, err := manufacturerId.abi.Unpack("tokenURI", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackTransferFrom is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x23b872dd.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) PackTransferFrom(from common.Address, to common.Address, tokenId *big.Int) []byte {
	enc, err := manufacturerId.abi.Pack("transferFrom", from, to, tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTransferFrom is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x23b872dd.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function transferFrom(address from, address to, uint256 tokenId) returns()
func (manufacturerId *ManufacturerId) TryPackTransferFrom(from common.Address, to common.Address, tokenId *big.Int) ([]byte, error) {
	return manufacturerId.abi.Pack("transferFrom", from, to, tokenId)
}

// PackUpgradeTo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3659cfe6.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function upgradeTo(address newImplementation) returns()
func (manufacturerId *ManufacturerId) PackUpgradeTo(newImplementation common.Address) []byte {
	enc, err := manufacturerId.abi.Pack("upgradeTo", newImplementation)
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
func (manufacturerId *ManufacturerId) TryPackUpgradeTo(newImplementation common.Address) ([]byte, error) {
	return manufacturerId.abi.Pack("upgradeTo", newImplementation)
}

// PackUpgradeToAndCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4f1ef286.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function upgradeToAndCall(address newImplementation, bytes data) payable returns()
func (manufacturerId *ManufacturerId) PackUpgradeToAndCall(newImplementation common.Address, data []byte) []byte {
	enc, err := manufacturerId.abi.Pack("upgradeToAndCall", newImplementation, data)
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
func (manufacturerId *ManufacturerId) TryPackUpgradeToAndCall(newImplementation common.Address, data []byte) ([]byte, error) {
	return manufacturerId.abi.Pack("upgradeToAndCall", newImplementation, data)
}

// ManufacturerIdAdminChanged represents a AdminChanged event raised by the ManufacturerId contract.
type ManufacturerIdAdminChanged struct {
	PreviousAdmin common.Address
	NewAdmin      common.Address
	Raw           *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdAdminChangedEventName = "AdminChanged"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdAdminChanged) ContractEventName() string {
	return ManufacturerIdAdminChangedEventName
}

// UnpackAdminChangedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AdminChanged(address previousAdmin, address newAdmin)
func (manufacturerId *ManufacturerId) UnpackAdminChangedEvent(log *types.Log) (*ManufacturerIdAdminChanged, error) {
	event := "AdminChanged"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdAdminChanged)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdApproval represents a Approval event raised by the ManufacturerId contract.
type ManufacturerIdApproval struct {
	Owner    common.Address
	Approved common.Address
	TokenId  *big.Int
	Raw      *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdApprovalEventName = "Approval"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdApproval) ContractEventName() string {
	return ManufacturerIdApprovalEventName
}

// UnpackApprovalEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (manufacturerId *ManufacturerId) UnpackApprovalEvent(log *types.Log) (*ManufacturerIdApproval, error) {
	event := "Approval"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdApproval)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdApprovalForAll represents a ApprovalForAll event raised by the ManufacturerId contract.
type ManufacturerIdApprovalForAll struct {
	Owner    common.Address
	Operator common.Address
	Approved bool
	Raw      *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdApprovalForAllEventName = "ApprovalForAll"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdApprovalForAll) ContractEventName() string {
	return ManufacturerIdApprovalForAllEventName
}

// UnpackApprovalForAllEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (manufacturerId *ManufacturerId) UnpackApprovalForAllEvent(log *types.Log) (*ManufacturerIdApprovalForAll, error) {
	event := "ApprovalForAll"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdApprovalForAll)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdBatchMetadataUpdate represents a BatchMetadataUpdate event raised by the ManufacturerId contract.
type ManufacturerIdBatchMetadataUpdate struct {
	FromTokenId *big.Int
	ToTokenId   *big.Int
	Raw         *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdBatchMetadataUpdateEventName = "BatchMetadataUpdate"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdBatchMetadataUpdate) ContractEventName() string {
	return ManufacturerIdBatchMetadataUpdateEventName
}

// UnpackBatchMetadataUpdateEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)
func (manufacturerId *ManufacturerId) UnpackBatchMetadataUpdateEvent(log *types.Log) (*ManufacturerIdBatchMetadataUpdate, error) {
	event := "BatchMetadataUpdate"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdBatchMetadataUpdate)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdBeaconUpgraded represents a BeaconUpgraded event raised by the ManufacturerId contract.
type ManufacturerIdBeaconUpgraded struct {
	Beacon common.Address
	Raw    *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdBeaconUpgradedEventName = "BeaconUpgraded"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdBeaconUpgraded) ContractEventName() string {
	return ManufacturerIdBeaconUpgradedEventName
}

// UnpackBeaconUpgradedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event BeaconUpgraded(address indexed beacon)
func (manufacturerId *ManufacturerId) UnpackBeaconUpgradedEvent(log *types.Log) (*ManufacturerIdBeaconUpgraded, error) {
	event := "BeaconUpgraded"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdBeaconUpgraded)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdInitialized represents a Initialized event raised by the ManufacturerId contract.
type ManufacturerIdInitialized struct {
	Version uint8
	Raw     *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdInitializedEventName = "Initialized"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdInitialized) ContractEventName() string {
	return ManufacturerIdInitializedEventName
}

// UnpackInitializedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Initialized(uint8 version)
func (manufacturerId *ManufacturerId) UnpackInitializedEvent(log *types.Log) (*ManufacturerIdInitialized, error) {
	event := "Initialized"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdInitialized)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdMetadataUpdate represents a MetadataUpdate event raised by the ManufacturerId contract.
type ManufacturerIdMetadataUpdate struct {
	TokenId *big.Int
	Raw     *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdMetadataUpdateEventName = "MetadataUpdate"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdMetadataUpdate) ContractEventName() string {
	return ManufacturerIdMetadataUpdateEventName
}

// UnpackMetadataUpdateEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event MetadataUpdate(uint256 _tokenId)
func (manufacturerId *ManufacturerId) UnpackMetadataUpdateEvent(log *types.Log) (*ManufacturerIdMetadataUpdate, error) {
	event := "MetadataUpdate"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdMetadataUpdate)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdPrivilegeCreated represents a PrivilegeCreated event raised by the ManufacturerId contract.
type ManufacturerIdPrivilegeCreated struct {
	PrivilegeId *big.Int
	Enabled     bool
	Description string
	Raw         *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdPrivilegeCreatedEventName = "PrivilegeCreated"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdPrivilegeCreated) ContractEventName() string {
	return ManufacturerIdPrivilegeCreatedEventName
}

// UnpackPrivilegeCreatedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeCreated(uint256 indexed privilegeId, bool enabled, string description)
func (manufacturerId *ManufacturerId) UnpackPrivilegeCreatedEvent(log *types.Log) (*ManufacturerIdPrivilegeCreated, error) {
	event := "PrivilegeCreated"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdPrivilegeCreated)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdPrivilegeDisabled represents a PrivilegeDisabled event raised by the ManufacturerId contract.
type ManufacturerIdPrivilegeDisabled struct {
	PrivilegeId *big.Int
	Raw         *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdPrivilegeDisabledEventName = "PrivilegeDisabled"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdPrivilegeDisabled) ContractEventName() string {
	return ManufacturerIdPrivilegeDisabledEventName
}

// UnpackPrivilegeDisabledEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeDisabled(uint256 indexed privilegeId)
func (manufacturerId *ManufacturerId) UnpackPrivilegeDisabledEvent(log *types.Log) (*ManufacturerIdPrivilegeDisabled, error) {
	event := "PrivilegeDisabled"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdPrivilegeDisabled)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdPrivilegeEnabled represents a PrivilegeEnabled event raised by the ManufacturerId contract.
type ManufacturerIdPrivilegeEnabled struct {
	PrivilegeId *big.Int
	Raw         *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdPrivilegeEnabledEventName = "PrivilegeEnabled"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdPrivilegeEnabled) ContractEventName() string {
	return ManufacturerIdPrivilegeEnabledEventName
}

// UnpackPrivilegeEnabledEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeEnabled(uint256 indexed privilegeId)
func (manufacturerId *ManufacturerId) UnpackPrivilegeEnabledEvent(log *types.Log) (*ManufacturerIdPrivilegeEnabled, error) {
	event := "PrivilegeEnabled"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdPrivilegeEnabled)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdPrivilegeSet represents a PrivilegeSet event raised by the ManufacturerId contract.
type ManufacturerIdPrivilegeSet struct {
	TokenId *big.Int
	Version *big.Int
	PrivId  *big.Int
	User    common.Address
	Expires *big.Int
	Raw     *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdPrivilegeSetEventName = "PrivilegeSet"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdPrivilegeSet) ContractEventName() string {
	return ManufacturerIdPrivilegeSetEventName
}

// UnpackPrivilegeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeSet(uint256 indexed tokenId, uint256 version, uint256 indexed privId, address indexed user, uint256 expires)
func (manufacturerId *ManufacturerId) UnpackPrivilegeSetEvent(log *types.Log) (*ManufacturerIdPrivilegeSet, error) {
	event := "PrivilegeSet"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdPrivilegeSet)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdRoleAdminChanged represents a RoleAdminChanged event raised by the ManufacturerId contract.
type ManufacturerIdRoleAdminChanged struct {
	Role              [32]byte
	PreviousAdminRole [32]byte
	NewAdminRole      [32]byte
	Raw               *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdRoleAdminChangedEventName = "RoleAdminChanged"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdRoleAdminChanged) ContractEventName() string {
	return ManufacturerIdRoleAdminChangedEventName
}

// UnpackRoleAdminChangedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
func (manufacturerId *ManufacturerId) UnpackRoleAdminChangedEvent(log *types.Log) (*ManufacturerIdRoleAdminChanged, error) {
	event := "RoleAdminChanged"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdRoleAdminChanged)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdRoleGranted represents a RoleGranted event raised by the ManufacturerId contract.
type ManufacturerIdRoleGranted struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdRoleGrantedEventName = "RoleGranted"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdRoleGranted) ContractEventName() string {
	return ManufacturerIdRoleGrantedEventName
}

// UnpackRoleGrantedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (manufacturerId *ManufacturerId) UnpackRoleGrantedEvent(log *types.Log) (*ManufacturerIdRoleGranted, error) {
	event := "RoleGranted"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdRoleGranted)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdRoleRevoked represents a RoleRevoked event raised by the ManufacturerId contract.
type ManufacturerIdRoleRevoked struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdRoleRevokedEventName = "RoleRevoked"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdRoleRevoked) ContractEventName() string {
	return ManufacturerIdRoleRevokedEventName
}

// UnpackRoleRevokedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (manufacturerId *ManufacturerId) UnpackRoleRevokedEvent(log *types.Log) (*ManufacturerIdRoleRevoked, error) {
	event := "RoleRevoked"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdRoleRevoked)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdTransfer represents a Transfer event raised by the ManufacturerId contract.
type ManufacturerIdTransfer struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdTransferEventName = "Transfer"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdTransfer) ContractEventName() string {
	return ManufacturerIdTransferEventName
}

// UnpackTransferEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (manufacturerId *ManufacturerId) UnpackTransferEvent(log *types.Log) (*ManufacturerIdTransfer, error) {
	event := "Transfer"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdTransfer)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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

// ManufacturerIdUpgraded represents a Upgraded event raised by the ManufacturerId contract.
type ManufacturerIdUpgraded struct {
	Implementation common.Address
	Raw            *types.Log // Blockchain specific contextual infos
}

const ManufacturerIdUpgradedEventName = "Upgraded"

// ContractEventName returns the user-defined event name.
func (ManufacturerIdUpgraded) ContractEventName() string {
	return ManufacturerIdUpgradedEventName
}

// UnpackUpgradedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Upgraded(address indexed implementation)
func (manufacturerId *ManufacturerId) UnpackUpgradedEvent(log *types.Log) (*ManufacturerIdUpgraded, error) {
	event := "Upgraded"
	if len(log.Topics) == 0 || log.Topics[0] != manufacturerId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(ManufacturerIdUpgraded)
	if len(log.Data) > 0 {
		if err := manufacturerId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range manufacturerId.abi.Events[event].Inputs {
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
func (manufacturerId *ManufacturerId) UnpackError(raw []byte) (any, error) {
	if bytes.Equal(raw[:4], manufacturerId.abi.Errors["ZeroAddress"].ID.Bytes()[:4]) {
		return manufacturerId.UnpackZeroAddressError(raw[4:])
	}
	return nil, errors.New("Unknown error")
}

// ManufacturerIdZeroAddress represents a ZeroAddress error raised by the ManufacturerId contract.
type ManufacturerIdZeroAddress struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error ZeroAddress()
func ManufacturerIdZeroAddressErrorID() common.Hash {
	return common.HexToHash("0xd92e233df2717d4a40030e20904abd27b68fcbeede117eaaccbbdac9618c8c73")
}

// UnpackZeroAddressError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error ZeroAddress()
func (manufacturerId *ManufacturerId) UnpackZeroAddressError(raw []byte) (*ManufacturerIdZeroAddress, error) {
	out := new(ManufacturerIdZeroAddress)
	if err := manufacturerId.abi.UnpackIntoInterface(out, "ZeroAddress", raw); err != nil {
		return nil, err
	}
	return out, nil
}
