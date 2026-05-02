// Code generated via abigen V2 - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package vehicleId

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

// MultiPrivilegeSetPrivilegeData is an auto generated low-level Go binding around an user-defined struct.
type MultiPrivilegeSetPrivilegeData struct {
	TokenId *big.Int
	PrivId  *big.Int
	User    common.Address
	Expires *big.Int
}

// VehicleIdSacdInput is an auto generated low-level Go binding around an user-defined struct.
type VehicleIdSacdInput struct {
	Grantee     common.Address
	Permissions *big.Int
	Expiration  *big.Int
	Source      string
}

// VehicleIdMetaData contains all meta data concerning the VehicleId contract.
var VehicleIdMetaData = bind.MetaData{
	ABI: "[{\"inputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"idProxy\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"id\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"errorMessage\",\"type\":\"string\"}],\"name\":\"TransferFailed\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"Unauthorized\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"ZeroAddress\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"previousAdmin\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"address\",\"name\":\"newAdmin\",\"type\":\"address\"}],\"name\":\"AdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"approved\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"ApprovalForAll\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_fromTokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_toTokenId\",\"type\":\"uint256\"}],\"name\":\"BatchMetadataUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"beacon\",\"type\":\"address\"}],\"name\":\"BeaconUpgraded\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint8\",\"name\":\"version\",\"type\":\"uint8\"}],\"name\":\"Initialized\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_tokenId\",\"type\":\"uint256\"}],\"name\":\"MetadataUpdate\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privilegeId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"}],\"name\":\"PrivilegeCreated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privilegeId\",\"type\":\"uint256\"}],\"name\":\"PrivilegeDisabled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privilegeId\",\"type\":\"uint256\"}],\"name\":\"PrivilegeEnabled\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"version\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"expires\",\"type\":\"uint256\"}],\"name\":\"PrivilegeSet\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"previousAdminRole\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"newAdminRole\",\"type\":\"bytes32\"}],\"name\":\"RoleAdminChanged\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleGranted\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"RoleRevoked\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"implementation\",\"type\":\"address\"}],\"name\":\"Upgraded\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"BURNER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"DEFAULT_ADMIN_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"MINTER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"SAFE_TRANSFER_FROM\",\"outputs\":[{\"internalType\":\"bytes4\",\"name\":\"\",\"type\":\"bytes4\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"TRANSFERER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"UPGRADER_ROLE\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"_dimoRegistry\",\"outputs\":[{\"internalType\":\"contractIDimoRegistry\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"burn\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"}],\"name\":\"createPrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"}],\"name\":\"disablePrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"}],\"name\":\"enablePrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"exists\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getApproved\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"getDefinitionURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"definitionURI\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"}],\"name\":\"getRoleAdmin\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"grantRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"hasPrivilege\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"hasRole\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"name_\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"symbol_\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"baseUri_\",\"type\":\"string\"},{\"internalType\":\"address\",\"name\":\"dimoRegistry_\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"syntheticDeviceId_\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"sacd_\",\"type\":\"address\"},{\"internalType\":\"address[]\",\"name\":\"trustedForwarders_\",\"type\":\"address[]\"}],\"name\":\"initialize\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"}],\"name\":\"isApprovedForAll\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"ownerOf\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"privilegeEntry\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"}],\"name\":\"privilegeExpiresAt\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"privilegeRecord\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"enabled\",\"type\":\"bool\"},{\"internalType\":\"string\",\"name\":\"description\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"proxiableUUID\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"renounceRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes32\",\"name\":\"role\",\"type\":\"bytes32\"},{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"revokeRole\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"sacd\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"}],\"name\":\"safeMint\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"string\",\"name\":\"uri\",\"type\":\"string\"}],\"name\":\"safeMint\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"safeTransferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"operator\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"approved\",\"type\":\"bool\"}],\"name\":\"setApprovalForAll\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"baseURI_\",\"type\":\"string\"}],\"name\":\"setBaseURI\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setDimoRegistryAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expires\",\"type\":\"uint256\"}],\"name\":\"setPrivilege\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"components\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"privId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"user\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"expires\",\"type\":\"uint256\"}],\"internalType\":\"structMultiPrivilege.SetPrivilegeData[]\",\"name\":\"privData\",\"type\":\"tuple[]\"}],\"name\":\"setPrivileges\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"},{\"components\":[{\"internalType\":\"address\",\"name\":\"grantee\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"permissions\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"source\",\"type\":\"string\"}],\"internalType\":\"structVehicleId.SacdInput\",\"name\":\"sacdInput\",\"type\":\"tuple\"}],\"name\":\"setSacd\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setSacdAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"}],\"name\":\"setSyntheticDeviceIdAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"addr\",\"type\":\"address\"},{\"internalType\":\"bool\",\"name\":\"trusted\",\"type\":\"bool\"}],\"name\":\"setTrustedForwarder\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"syntheticDeviceId\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"tokenIdToVersion\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"tokenURI\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"tokenId\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"trustedForwarders\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"}],\"name\":\"upgradeTo\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newImplementation\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"upgradeToAndCall\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"}]",
	ID:  "VehicleId",
}

// VehicleId is an auto generated Go binding around an Ethereum contract.
type VehicleId struct {
	abi abi.ABI
}

// NewVehicleId creates a new instance of VehicleId.
func NewVehicleId() *VehicleId {
	parsed, err := VehicleIdMetaData.ParseABI()
	if err != nil {
		panic(errors.New("invalid ABI: " + err.Error()))
	}
	return &VehicleId{abi: *parsed}
}

// Instance creates a wrapper for a deployed contract instance at the given address.
// Use this to create the instance object passed to abigen v2 library functions Call, Transact, etc.
func (c *VehicleId) Instance(backend bind.ContractBackend, addr common.Address) *bind.BoundContract {
	return bind.NewBoundContract(addr, c.abi, backend, backend, backend)
}

// PackADMINROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x75b238fc.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function ADMIN_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) PackADMINROLE() []byte {
	enc, err := vehicleId.abi.Pack("ADMIN_ROLE")
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
func (vehicleId *VehicleId) TryPackADMINROLE() ([]byte, error) {
	return vehicleId.abi.Pack("ADMIN_ROLE")
}

// UnpackADMINROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x75b238fc.
//
// Solidity: function ADMIN_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) UnpackADMINROLE(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("ADMIN_ROLE", data)
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
func (vehicleId *VehicleId) PackBURNERROLE() []byte {
	enc, err := vehicleId.abi.Pack("BURNER_ROLE")
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
func (vehicleId *VehicleId) TryPackBURNERROLE() ([]byte, error) {
	return vehicleId.abi.Pack("BURNER_ROLE")
}

// UnpackBURNERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x282c51f3.
//
// Solidity: function BURNER_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) UnpackBURNERROLE(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("BURNER_ROLE", data)
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
func (vehicleId *VehicleId) PackDEFAULTADMINROLE() []byte {
	enc, err := vehicleId.abi.Pack("DEFAULT_ADMIN_ROLE")
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
func (vehicleId *VehicleId) TryPackDEFAULTADMINROLE() ([]byte, error) {
	return vehicleId.abi.Pack("DEFAULT_ADMIN_ROLE")
}

// UnpackDEFAULTADMINROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xa217fddf.
//
// Solidity: function DEFAULT_ADMIN_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) UnpackDEFAULTADMINROLE(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("DEFAULT_ADMIN_ROLE", data)
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
func (vehicleId *VehicleId) PackMINTERROLE() []byte {
	enc, err := vehicleId.abi.Pack("MINTER_ROLE")
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
func (vehicleId *VehicleId) TryPackMINTERROLE() ([]byte, error) {
	return vehicleId.abi.Pack("MINTER_ROLE")
}

// UnpackMINTERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd5391393.
//
// Solidity: function MINTER_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) UnpackMINTERROLE(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("MINTER_ROLE", data)
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
func (vehicleId *VehicleId) PackSAFETRANSFERFROM() []byte {
	enc, err := vehicleId.abi.Pack("SAFE_TRANSFER_FROM")
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
func (vehicleId *VehicleId) TryPackSAFETRANSFERFROM() ([]byte, error) {
	return vehicleId.abi.Pack("SAFE_TRANSFER_FROM")
}

// UnpackSAFETRANSFERFROM is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xe4cdbfdb.
//
// Solidity: function SAFE_TRANSFER_FROM() view returns(bytes4)
func (vehicleId *VehicleId) UnpackSAFETRANSFERFROM(data []byte) ([4]byte, error) {
	out, err := vehicleId.abi.Unpack("SAFE_TRANSFER_FROM", data)
	if err != nil {
		return *new([4]byte), err
	}
	out0 := *abi.ConvertType(out[0], new([4]byte)).(*[4]byte)
	return out0, nil
}

// PackTRANSFERERROLE is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0ade7dc1.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function TRANSFERER_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) PackTRANSFERERROLE() []byte {
	enc, err := vehicleId.abi.Pack("TRANSFERER_ROLE")
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
func (vehicleId *VehicleId) TryPackTRANSFERERROLE() ([]byte, error) {
	return vehicleId.abi.Pack("TRANSFERER_ROLE")
}

// UnpackTRANSFERERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x0ade7dc1.
//
// Solidity: function TRANSFERER_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) UnpackTRANSFERERROLE(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("TRANSFERER_ROLE", data)
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
func (vehicleId *VehicleId) PackUPGRADERROLE() []byte {
	enc, err := vehicleId.abi.Pack("UPGRADER_ROLE")
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
func (vehicleId *VehicleId) TryPackUPGRADERROLE() ([]byte, error) {
	return vehicleId.abi.Pack("UPGRADER_ROLE")
}

// UnpackUPGRADERROLE is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xf72c0d8b.
//
// Solidity: function UPGRADER_ROLE() view returns(bytes32)
func (vehicleId *VehicleId) UnpackUPGRADERROLE(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("UPGRADER_ROLE", data)
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
func (vehicleId *VehicleId) PackDimoRegistry() []byte {
	enc, err := vehicleId.abi.Pack("_dimoRegistry")
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
func (vehicleId *VehicleId) TryPackDimoRegistry() ([]byte, error) {
	return vehicleId.abi.Pack("_dimoRegistry")
}

// UnpackDimoRegistry is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x7625c605.
//
// Solidity: function _dimoRegistry() view returns(address)
func (vehicleId *VehicleId) UnpackDimoRegistry(data []byte) (common.Address, error) {
	out, err := vehicleId.abi.Unpack("_dimoRegistry", data)
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
func (vehicleId *VehicleId) PackApprove(to common.Address, tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("approve", to, tokenId)
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
func (vehicleId *VehicleId) TryPackApprove(to common.Address, tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("approve", to, tokenId)
}

// PackBalanceOf is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x70a08231.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (vehicleId *VehicleId) PackBalanceOf(owner common.Address) []byte {
	enc, err := vehicleId.abi.Pack("balanceOf", owner)
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
func (vehicleId *VehicleId) TryPackBalanceOf(owner common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("balanceOf", owner)
}

// UnpackBalanceOf is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x70a08231.
//
// Solidity: function balanceOf(address owner) view returns(uint256)
func (vehicleId *VehicleId) UnpackBalanceOf(data []byte) (*big.Int, error) {
	out, err := vehicleId.abi.Unpack("balanceOf", data)
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
func (vehicleId *VehicleId) PackBurn(tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("burn", tokenId)
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
func (vehicleId *VehicleId) TryPackBurn(tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("burn", tokenId)
}

// PackCreatePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xc1d58b3b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function createPrivilege(bool enabled, string description) returns()
func (vehicleId *VehicleId) PackCreatePrivilege(enabled bool, description string) []byte {
	enc, err := vehicleId.abi.Pack("createPrivilege", enabled, description)
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
func (vehicleId *VehicleId) TryPackCreatePrivilege(enabled bool, description string) ([]byte, error) {
	return vehicleId.abi.Pack("createPrivilege", enabled, description)
}

// PackDisablePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x1a153ed0.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function disablePrivilege(uint256 privId) returns()
func (vehicleId *VehicleId) PackDisablePrivilege(privId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("disablePrivilege", privId)
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
func (vehicleId *VehicleId) TryPackDisablePrivilege(privId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("disablePrivilege", privId)
}

// PackEnablePrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x831ba696.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function enablePrivilege(uint256 privId) returns()
func (vehicleId *VehicleId) PackEnablePrivilege(privId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("enablePrivilege", privId)
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
func (vehicleId *VehicleId) TryPackEnablePrivilege(privId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("enablePrivilege", privId)
}

// PackExists is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4f558e79.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function exists(uint256 tokenId) view returns(bool)
func (vehicleId *VehicleId) PackExists(tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("exists", tokenId)
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
func (vehicleId *VehicleId) TryPackExists(tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("exists", tokenId)
}

// UnpackExists is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x4f558e79.
//
// Solidity: function exists(uint256 tokenId) view returns(bool)
func (vehicleId *VehicleId) UnpackExists(data []byte) (bool, error) {
	out, err := vehicleId.abi.Unpack("exists", data)
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
func (vehicleId *VehicleId) PackGetApproved(tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("getApproved", tokenId)
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
func (vehicleId *VehicleId) TryPackGetApproved(tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("getApproved", tokenId)
}

// UnpackGetApproved is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x081812fc.
//
// Solidity: function getApproved(uint256 tokenId) view returns(address)
func (vehicleId *VehicleId) UnpackGetApproved(data []byte) (common.Address, error) {
	out, err := vehicleId.abi.Unpack("getApproved", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackGetDefinitionURI is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9b12f1c9.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getDefinitionURI(uint256 tokenId) view returns(string definitionURI)
func (vehicleId *VehicleId) PackGetDefinitionURI(tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("getDefinitionURI", tokenId)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackGetDefinitionURI is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x9b12f1c9.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function getDefinitionURI(uint256 tokenId) view returns(string definitionURI)
func (vehicleId *VehicleId) TryPackGetDefinitionURI(tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("getDefinitionURI", tokenId)
}

// UnpackGetDefinitionURI is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x9b12f1c9.
//
// Solidity: function getDefinitionURI(uint256 tokenId) view returns(string definitionURI)
func (vehicleId *VehicleId) UnpackGetDefinitionURI(data []byte) (string, error) {
	out, err := vehicleId.abi.Unpack("getDefinitionURI", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackGetRoleAdmin is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x248a9ca3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (vehicleId *VehicleId) PackGetRoleAdmin(role [32]byte) []byte {
	enc, err := vehicleId.abi.Pack("getRoleAdmin", role)
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
func (vehicleId *VehicleId) TryPackGetRoleAdmin(role [32]byte) ([]byte, error) {
	return vehicleId.abi.Pack("getRoleAdmin", role)
}

// UnpackGetRoleAdmin is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x248a9ca3.
//
// Solidity: function getRoleAdmin(bytes32 role) view returns(bytes32)
func (vehicleId *VehicleId) UnpackGetRoleAdmin(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("getRoleAdmin", data)
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
func (vehicleId *VehicleId) PackGrantRole(role [32]byte, account common.Address) []byte {
	enc, err := vehicleId.abi.Pack("grantRole", role, account)
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
func (vehicleId *VehicleId) TryPackGrantRole(role [32]byte, account common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("grantRole", role, account)
}

// PackHasPrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x05d80b00.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function hasPrivilege(uint256 tokenId, uint256 privId, address user) view returns(bool)
func (vehicleId *VehicleId) PackHasPrivilege(tokenId *big.Int, privId *big.Int, user common.Address) []byte {
	enc, err := vehicleId.abi.Pack("hasPrivilege", tokenId, privId, user)
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
func (vehicleId *VehicleId) TryPackHasPrivilege(tokenId *big.Int, privId *big.Int, user common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("hasPrivilege", tokenId, privId, user)
}

// UnpackHasPrivilege is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x05d80b00.
//
// Solidity: function hasPrivilege(uint256 tokenId, uint256 privId, address user) view returns(bool)
func (vehicleId *VehicleId) UnpackHasPrivilege(data []byte) (bool, error) {
	out, err := vehicleId.abi.Unpack("hasPrivilege", data)
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
func (vehicleId *VehicleId) PackHasRole(role [32]byte, account common.Address) []byte {
	enc, err := vehicleId.abi.Pack("hasRole", role, account)
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
func (vehicleId *VehicleId) TryPackHasRole(role [32]byte, account common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("hasRole", role, account)
}

// UnpackHasRole is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x91d14854.
//
// Solidity: function hasRole(bytes32 role, address account) view returns(bool)
func (vehicleId *VehicleId) UnpackHasRole(data []byte) (bool, error) {
	out, err := vehicleId.abi.Unpack("hasRole", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6b2ab28a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function initialize(string name_, string symbol_, string baseUri_, address dimoRegistry_, address syntheticDeviceId_, address sacd_, address[] trustedForwarders_) returns()
func (vehicleId *VehicleId) PackInitialize(name string, symbol string, baseUri string, dimoRegistry common.Address, syntheticDeviceId common.Address, sacd common.Address, trustedForwarders []common.Address) []byte {
	enc, err := vehicleId.abi.Pack("initialize", name, symbol, baseUri, dimoRegistry, syntheticDeviceId, sacd, trustedForwarders)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackInitialize is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x6b2ab28a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function initialize(string name_, string symbol_, string baseUri_, address dimoRegistry_, address syntheticDeviceId_, address sacd_, address[] trustedForwarders_) returns()
func (vehicleId *VehicleId) TryPackInitialize(name string, symbol string, baseUri string, dimoRegistry common.Address, syntheticDeviceId common.Address, sacd common.Address, trustedForwarders []common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("initialize", name, symbol, baseUri, dimoRegistry, syntheticDeviceId, sacd, trustedForwarders)
}

// PackIsApprovedForAll is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe985e9c5.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (vehicleId *VehicleId) PackIsApprovedForAll(owner common.Address, operator common.Address) []byte {
	enc, err := vehicleId.abi.Pack("isApprovedForAll", owner, operator)
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
func (vehicleId *VehicleId) TryPackIsApprovedForAll(owner common.Address, operator common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("isApprovedForAll", owner, operator)
}

// UnpackIsApprovedForAll is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xe985e9c5.
//
// Solidity: function isApprovedForAll(address owner, address operator) view returns(bool)
func (vehicleId *VehicleId) UnpackIsApprovedForAll(data []byte) (bool, error) {
	out, err := vehicleId.abi.Unpack("isApprovedForAll", data)
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
func (vehicleId *VehicleId) PackName() []byte {
	enc, err := vehicleId.abi.Pack("name")
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
func (vehicleId *VehicleId) TryPackName() ([]byte, error) {
	return vehicleId.abi.Pack("name")
}

// UnpackName is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x06fdde03.
//
// Solidity: function name() view returns(string)
func (vehicleId *VehicleId) UnpackName(data []byte) (string, error) {
	out, err := vehicleId.abi.Unpack("name", data)
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
func (vehicleId *VehicleId) PackOwnerOf(tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("ownerOf", tokenId)
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
func (vehicleId *VehicleId) TryPackOwnerOf(tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("ownerOf", tokenId)
}

// UnpackOwnerOf is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x6352211e.
//
// Solidity: function ownerOf(uint256 tokenId) view returns(address)
func (vehicleId *VehicleId) UnpackOwnerOf(data []byte) (common.Address, error) {
	out, err := vehicleId.abi.Unpack("ownerOf", data)
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
func (vehicleId *VehicleId) PackPrivilegeEntry(arg0 *big.Int, arg1 *big.Int, arg2 *big.Int, arg3 common.Address) []byte {
	enc, err := vehicleId.abi.Pack("privilegeEntry", arg0, arg1, arg2, arg3)
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
func (vehicleId *VehicleId) TryPackPrivilegeEntry(arg0 *big.Int, arg1 *big.Int, arg2 *big.Int, arg3 common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("privilegeEntry", arg0, arg1, arg2, arg3)
}

// UnpackPrivilegeEntry is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x48db4640.
//
// Solidity: function privilegeEntry(uint256 , uint256 , uint256 , address ) view returns(uint256)
func (vehicleId *VehicleId) UnpackPrivilegeEntry(data []byte) (*big.Int, error) {
	out, err := vehicleId.abi.Unpack("privilegeEntry", data)
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
func (vehicleId *VehicleId) PackPrivilegeExpiresAt(tokenId *big.Int, privId *big.Int, user common.Address) []byte {
	enc, err := vehicleId.abi.Pack("privilegeExpiresAt", tokenId, privId, user)
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
func (vehicleId *VehicleId) TryPackPrivilegeExpiresAt(tokenId *big.Int, privId *big.Int, user common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("privilegeExpiresAt", tokenId, privId, user)
}

// UnpackPrivilegeExpiresAt is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd0f8f5f6.
//
// Solidity: function privilegeExpiresAt(uint256 tokenId, uint256 privId, address user) view returns(uint256)
func (vehicleId *VehicleId) UnpackPrivilegeExpiresAt(data []byte) (*big.Int, error) {
	out, err := vehicleId.abi.Unpack("privilegeExpiresAt", data)
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
func (vehicleId *VehicleId) PackPrivilegeRecord(arg0 *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("privilegeRecord", arg0)
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
func (vehicleId *VehicleId) TryPackPrivilegeRecord(arg0 *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("privilegeRecord", arg0)
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
func (vehicleId *VehicleId) UnpackPrivilegeRecord(data []byte) (PrivilegeRecordOutput, error) {
	out, err := vehicleId.abi.Unpack("privilegeRecord", data)
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
func (vehicleId *VehicleId) PackProxiableUUID() []byte {
	enc, err := vehicleId.abi.Pack("proxiableUUID")
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
func (vehicleId *VehicleId) TryPackProxiableUUID() ([]byte, error) {
	return vehicleId.abi.Pack("proxiableUUID")
}

// UnpackProxiableUUID is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x52d1902d.
//
// Solidity: function proxiableUUID() view returns(bytes32)
func (vehicleId *VehicleId) UnpackProxiableUUID(data []byte) ([32]byte, error) {
	out, err := vehicleId.abi.Unpack("proxiableUUID", data)
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
func (vehicleId *VehicleId) PackRenounceRole(role [32]byte, account common.Address) []byte {
	enc, err := vehicleId.abi.Pack("renounceRole", role, account)
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
func (vehicleId *VehicleId) TryPackRenounceRole(role [32]byte, account common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("renounceRole", role, account)
}

// PackRevokeRole is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xd547741f.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function revokeRole(bytes32 role, address account) returns()
func (vehicleId *VehicleId) PackRevokeRole(role [32]byte, account common.Address) []byte {
	enc, err := vehicleId.abi.Pack("revokeRole", role, account)
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
func (vehicleId *VehicleId) TryPackRevokeRole(role [32]byte, account common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("revokeRole", role, account)
}

// PackSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x18973db8.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function sacd() view returns(address)
func (vehicleId *VehicleId) PackSacd() []byte {
	enc, err := vehicleId.abi.Pack("sacd")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x18973db8.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function sacd() view returns(address)
func (vehicleId *VehicleId) TryPackSacd() ([]byte, error) {
	return vehicleId.abi.Pack("sacd")
}

// UnpackSacd is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x18973db8.
//
// Solidity: function sacd() view returns(address)
func (vehicleId *VehicleId) UnpackSacd(data []byte) (common.Address, error) {
	out, err := vehicleId.abi.Unpack("sacd", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackSafeMint is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x40d097c3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function safeMint(address to) returns(uint256 tokenId)
func (vehicleId *VehicleId) PackSafeMint(to common.Address) []byte {
	enc, err := vehicleId.abi.Pack("safeMint", to)
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
func (vehicleId *VehicleId) TryPackSafeMint(to common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("safeMint", to)
}

// UnpackSafeMint is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x40d097c3.
//
// Solidity: function safeMint(address to) returns(uint256 tokenId)
func (vehicleId *VehicleId) UnpackSafeMint(data []byte) (*big.Int, error) {
	out, err := vehicleId.abi.Unpack("safeMint", data)
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
func (vehicleId *VehicleId) PackSafeMint0(to common.Address, uri string) []byte {
	enc, err := vehicleId.abi.Pack("safeMint0", to, uri)
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
func (vehicleId *VehicleId) TryPackSafeMint0(to common.Address, uri string) ([]byte, error) {
	return vehicleId.abi.Pack("safeMint0", to, uri)
}

// UnpackSafeMint0 is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xd204c45e.
//
// Solidity: function safeMint(address to, string uri) returns(uint256 tokenId)
func (vehicleId *VehicleId) UnpackSafeMint0(data []byte) (*big.Int, error) {
	out, err := vehicleId.abi.Unpack("safeMint0", data)
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
func (vehicleId *VehicleId) PackSafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("safeTransferFrom", from, to, tokenId)
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
func (vehicleId *VehicleId) TryPackSafeTransferFrom(from common.Address, to common.Address, tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("safeTransferFrom", from, to, tokenId)
}

// PackSafeTransferFrom0 is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xb88d4fde.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) returns()
func (vehicleId *VehicleId) PackSafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) []byte {
	enc, err := vehicleId.abi.Pack("safeTransferFrom0", from, to, tokenId, data)
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
func (vehicleId *VehicleId) TryPackSafeTransferFrom0(from common.Address, to common.Address, tokenId *big.Int, data []byte) ([]byte, error) {
	return vehicleId.abi.Pack("safeTransferFrom0", from, to, tokenId, data)
}

// PackSetApprovalForAll is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xa22cb465.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setApprovalForAll(address operator, bool approved) returns()
func (vehicleId *VehicleId) PackSetApprovalForAll(operator common.Address, approved bool) []byte {
	enc, err := vehicleId.abi.Pack("setApprovalForAll", operator, approved)
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
func (vehicleId *VehicleId) TryPackSetApprovalForAll(operator common.Address, approved bool) ([]byte, error) {
	return vehicleId.abi.Pack("setApprovalForAll", operator, approved)
}

// PackSetBaseURI is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x55f804b3.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setBaseURI(string baseURI_) returns()
func (vehicleId *VehicleId) PackSetBaseURI(baseURI string) []byte {
	enc, err := vehicleId.abi.Pack("setBaseURI", baseURI)
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
func (vehicleId *VehicleId) TryPackSetBaseURI(baseURI string) ([]byte, error) {
	return vehicleId.abi.Pack("setBaseURI", baseURI)
}

// PackSetDimoRegistryAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x0db857ea.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setDimoRegistryAddress(address addr) returns()
func (vehicleId *VehicleId) PackSetDimoRegistryAddress(addr common.Address) []byte {
	enc, err := vehicleId.abi.Pack("setDimoRegistryAddress", addr)
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
func (vehicleId *VehicleId) TryPackSetDimoRegistryAddress(addr common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("setDimoRegistryAddress", addr)
}

// PackSetPrivilege is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xeca3221a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setPrivilege(uint256 tokenId, uint256 privId, address user, uint256 expires) returns()
func (vehicleId *VehicleId) PackSetPrivilege(tokenId *big.Int, privId *big.Int, user common.Address, expires *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("setPrivilege", tokenId, privId, user, expires)
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
func (vehicleId *VehicleId) TryPackSetPrivilege(tokenId *big.Int, privId *big.Int, user common.Address, expires *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("setPrivilege", tokenId, privId, user, expires)
}

// PackSetPrivileges is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x57ae9754.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setPrivileges((uint256,uint256,address,uint256)[] privData) returns()
func (vehicleId *VehicleId) PackSetPrivileges(privData []MultiPrivilegeSetPrivilegeData) []byte {
	enc, err := vehicleId.abi.Pack("setPrivileges", privData)
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
func (vehicleId *VehicleId) TryPackSetPrivileges(privData []MultiPrivilegeSetPrivilegeData) ([]byte, error) {
	return vehicleId.abi.Pack("setPrivileges", privData)
}

// PackSetSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x75209e38.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setSacd(uint256 tokenId, (address,uint256,uint256,string) sacdInput) returns()
func (vehicleId *VehicleId) PackSetSacd(tokenId *big.Int, sacdInput VehicleIdSacdInput) []byte {
	enc, err := vehicleId.abi.Pack("setSacd", tokenId, sacdInput)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetSacd is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x75209e38.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setSacd(uint256 tokenId, (address,uint256,uint256,string) sacdInput) returns()
func (vehicleId *VehicleId) TryPackSetSacd(tokenId *big.Int, sacdInput VehicleIdSacdInput) ([]byte, error) {
	return vehicleId.abi.Pack("setSacd", tokenId, sacdInput)
}

// PackSetSacdAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x555b4c8a.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setSacdAddress(address addr) returns()
func (vehicleId *VehicleId) PackSetSacdAddress(addr common.Address) []byte {
	enc, err := vehicleId.abi.Pack("setSacdAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetSacdAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x555b4c8a.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setSacdAddress(address addr) returns()
func (vehicleId *VehicleId) TryPackSetSacdAddress(addr common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("setSacdAddress", addr)
}

// PackSetSyntheticDeviceIdAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xaa531530.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setSyntheticDeviceIdAddress(address addr) returns()
func (vehicleId *VehicleId) PackSetSyntheticDeviceIdAddress(addr common.Address) []byte {
	enc, err := vehicleId.abi.Pack("setSyntheticDeviceIdAddress", addr)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetSyntheticDeviceIdAddress is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xaa531530.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setSyntheticDeviceIdAddress(address addr) returns()
func (vehicleId *VehicleId) TryPackSetSyntheticDeviceIdAddress(addr common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("setSyntheticDeviceIdAddress", addr)
}

// PackSetTrustedForwarder is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe691d03b.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function setTrustedForwarder(address addr, bool trusted) returns()
func (vehicleId *VehicleId) PackSetTrustedForwarder(addr common.Address, trusted bool) []byte {
	enc, err := vehicleId.abi.Pack("setTrustedForwarder", addr, trusted)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSetTrustedForwarder is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xe691d03b.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function setTrustedForwarder(address addr, bool trusted) returns()
func (vehicleId *VehicleId) TryPackSetTrustedForwarder(addr common.Address, trusted bool) ([]byte, error) {
	return vehicleId.abi.Pack("setTrustedForwarder", addr, trusted)
}

// PackSupportsInterface is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x01ffc9a7.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (vehicleId *VehicleId) PackSupportsInterface(interfaceId [4]byte) []byte {
	enc, err := vehicleId.abi.Pack("supportsInterface", interfaceId)
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
func (vehicleId *VehicleId) TryPackSupportsInterface(interfaceId [4]byte) ([]byte, error) {
	return vehicleId.abi.Pack("supportsInterface", interfaceId)
}

// UnpackSupportsInterface is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) view returns(bool)
func (vehicleId *VehicleId) UnpackSupportsInterface(data []byte) (bool, error) {
	out, err := vehicleId.abi.Unpack("supportsInterface", data)
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
func (vehicleId *VehicleId) PackSymbol() []byte {
	enc, err := vehicleId.abi.Pack("symbol")
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
func (vehicleId *VehicleId) TryPackSymbol() ([]byte, error) {
	return vehicleId.abi.Pack("symbol")
}

// UnpackSymbol is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x95d89b41.
//
// Solidity: function symbol() view returns(string)
func (vehicleId *VehicleId) UnpackSymbol(data []byte) (string, error) {
	out, err := vehicleId.abi.Unpack("symbol", data)
	if err != nil {
		return *new(string), err
	}
	out0 := *abi.ConvertType(out[0], new(string)).(*string)
	return out0, nil
}

// PackSyntheticDeviceId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8ea5f4cd.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function syntheticDeviceId() view returns(address)
func (vehicleId *VehicleId) PackSyntheticDeviceId() []byte {
	enc, err := vehicleId.abi.Pack("syntheticDeviceId")
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackSyntheticDeviceId is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x8ea5f4cd.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function syntheticDeviceId() view returns(address)
func (vehicleId *VehicleId) TryPackSyntheticDeviceId() ([]byte, error) {
	return vehicleId.abi.Pack("syntheticDeviceId")
}

// UnpackSyntheticDeviceId is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x8ea5f4cd.
//
// Solidity: function syntheticDeviceId() view returns(address)
func (vehicleId *VehicleId) UnpackSyntheticDeviceId(data []byte) (common.Address, error) {
	out, err := vehicleId.abi.Unpack("syntheticDeviceId", data)
	if err != nil {
		return *new(common.Address), err
	}
	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)
	return out0, nil
}

// PackTokenIdToVersion is the Go binding used to pack the parameters required for calling
// the contract method with ID 0xf1a9d41c.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function tokenIdToVersion(uint256 ) view returns(uint256)
func (vehicleId *VehicleId) PackTokenIdToVersion(arg0 *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("tokenIdToVersion", arg0)
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
func (vehicleId *VehicleId) TryPackTokenIdToVersion(arg0 *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("tokenIdToVersion", arg0)
}

// UnpackTokenIdToVersion is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xf1a9d41c.
//
// Solidity: function tokenIdToVersion(uint256 ) view returns(uint256)
func (vehicleId *VehicleId) UnpackTokenIdToVersion(data []byte) (*big.Int, error) {
	out, err := vehicleId.abi.Unpack("tokenIdToVersion", data)
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
func (vehicleId *VehicleId) PackTokenURI(tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("tokenURI", tokenId)
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
func (vehicleId *VehicleId) TryPackTokenURI(tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("tokenURI", tokenId)
}

// UnpackTokenURI is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0xc87b56dd.
//
// Solidity: function tokenURI(uint256 tokenId) view returns(string)
func (vehicleId *VehicleId) UnpackTokenURI(data []byte) (string, error) {
	out, err := vehicleId.abi.Unpack("tokenURI", data)
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
func (vehicleId *VehicleId) PackTransferFrom(from common.Address, to common.Address, tokenId *big.Int) []byte {
	enc, err := vehicleId.abi.Pack("transferFrom", from, to, tokenId)
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
func (vehicleId *VehicleId) TryPackTransferFrom(from common.Address, to common.Address, tokenId *big.Int) ([]byte, error) {
	return vehicleId.abi.Pack("transferFrom", from, to, tokenId)
}

// PackTrustedForwarders is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x54776bb9.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function trustedForwarders(address ) view returns(bool)
func (vehicleId *VehicleId) PackTrustedForwarders(arg0 common.Address) []byte {
	enc, err := vehicleId.abi.Pack("trustedForwarders", arg0)
	if err != nil {
		panic(err)
	}
	return enc
}

// TryPackTrustedForwarders is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x54776bb9.  This method will return an error
// if any inputs are invalid/nil.
//
// Solidity: function trustedForwarders(address ) view returns(bool)
func (vehicleId *VehicleId) TryPackTrustedForwarders(arg0 common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("trustedForwarders", arg0)
}

// UnpackTrustedForwarders is the Go binding that unpacks the parameters returned
// from invoking the contract method with ID 0x54776bb9.
//
// Solidity: function trustedForwarders(address ) view returns(bool)
func (vehicleId *VehicleId) UnpackTrustedForwarders(data []byte) (bool, error) {
	out, err := vehicleId.abi.Unpack("trustedForwarders", data)
	if err != nil {
		return *new(bool), err
	}
	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)
	return out0, nil
}

// PackUpgradeTo is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x3659cfe6.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function upgradeTo(address newImplementation) returns()
func (vehicleId *VehicleId) PackUpgradeTo(newImplementation common.Address) []byte {
	enc, err := vehicleId.abi.Pack("upgradeTo", newImplementation)
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
func (vehicleId *VehicleId) TryPackUpgradeTo(newImplementation common.Address) ([]byte, error) {
	return vehicleId.abi.Pack("upgradeTo", newImplementation)
}

// PackUpgradeToAndCall is the Go binding used to pack the parameters required for calling
// the contract method with ID 0x4f1ef286.  This method will panic if any
// invalid/nil inputs are passed.
//
// Solidity: function upgradeToAndCall(address newImplementation, bytes data) payable returns()
func (vehicleId *VehicleId) PackUpgradeToAndCall(newImplementation common.Address, data []byte) []byte {
	enc, err := vehicleId.abi.Pack("upgradeToAndCall", newImplementation, data)
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
func (vehicleId *VehicleId) TryPackUpgradeToAndCall(newImplementation common.Address, data []byte) ([]byte, error) {
	return vehicleId.abi.Pack("upgradeToAndCall", newImplementation, data)
}

// VehicleIdAdminChanged represents a AdminChanged event raised by the VehicleId contract.
type VehicleIdAdminChanged struct {
	PreviousAdmin common.Address
	NewAdmin      common.Address
	Raw           *types.Log // Blockchain specific contextual infos
}

const VehicleIdAdminChangedEventName = "AdminChanged"

// ContractEventName returns the user-defined event name.
func (VehicleIdAdminChanged) ContractEventName() string {
	return VehicleIdAdminChangedEventName
}

// UnpackAdminChangedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event AdminChanged(address previousAdmin, address newAdmin)
func (vehicleId *VehicleId) UnpackAdminChangedEvent(log *types.Log) (*VehicleIdAdminChanged, error) {
	event := "AdminChanged"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdAdminChanged)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdApproval represents a Approval event raised by the VehicleId contract.
type VehicleIdApproval struct {
	Owner    common.Address
	Approved common.Address
	TokenId  *big.Int
	Raw      *types.Log // Blockchain specific contextual infos
}

const VehicleIdApprovalEventName = "Approval"

// ContractEventName returns the user-defined event name.
func (VehicleIdApproval) ContractEventName() string {
	return VehicleIdApprovalEventName
}

// UnpackApprovalEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
func (vehicleId *VehicleId) UnpackApprovalEvent(log *types.Log) (*VehicleIdApproval, error) {
	event := "Approval"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdApproval)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdApprovalForAll represents a ApprovalForAll event raised by the VehicleId contract.
type VehicleIdApprovalForAll struct {
	Owner    common.Address
	Operator common.Address
	Approved bool
	Raw      *types.Log // Blockchain specific contextual infos
}

const VehicleIdApprovalForAllEventName = "ApprovalForAll"

// ContractEventName returns the user-defined event name.
func (VehicleIdApprovalForAll) ContractEventName() string {
	return VehicleIdApprovalForAllEventName
}

// UnpackApprovalForAllEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event ApprovalForAll(address indexed owner, address indexed operator, bool approved)
func (vehicleId *VehicleId) UnpackApprovalForAllEvent(log *types.Log) (*VehicleIdApprovalForAll, error) {
	event := "ApprovalForAll"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdApprovalForAll)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdBatchMetadataUpdate represents a BatchMetadataUpdate event raised by the VehicleId contract.
type VehicleIdBatchMetadataUpdate struct {
	FromTokenId *big.Int
	ToTokenId   *big.Int
	Raw         *types.Log // Blockchain specific contextual infos
}

const VehicleIdBatchMetadataUpdateEventName = "BatchMetadataUpdate"

// ContractEventName returns the user-defined event name.
func (VehicleIdBatchMetadataUpdate) ContractEventName() string {
	return VehicleIdBatchMetadataUpdateEventName
}

// UnpackBatchMetadataUpdateEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)
func (vehicleId *VehicleId) UnpackBatchMetadataUpdateEvent(log *types.Log) (*VehicleIdBatchMetadataUpdate, error) {
	event := "BatchMetadataUpdate"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdBatchMetadataUpdate)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdBeaconUpgraded represents a BeaconUpgraded event raised by the VehicleId contract.
type VehicleIdBeaconUpgraded struct {
	Beacon common.Address
	Raw    *types.Log // Blockchain specific contextual infos
}

const VehicleIdBeaconUpgradedEventName = "BeaconUpgraded"

// ContractEventName returns the user-defined event name.
func (VehicleIdBeaconUpgraded) ContractEventName() string {
	return VehicleIdBeaconUpgradedEventName
}

// UnpackBeaconUpgradedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event BeaconUpgraded(address indexed beacon)
func (vehicleId *VehicleId) UnpackBeaconUpgradedEvent(log *types.Log) (*VehicleIdBeaconUpgraded, error) {
	event := "BeaconUpgraded"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdBeaconUpgraded)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdInitialized represents a Initialized event raised by the VehicleId contract.
type VehicleIdInitialized struct {
	Version uint8
	Raw     *types.Log // Blockchain specific contextual infos
}

const VehicleIdInitializedEventName = "Initialized"

// ContractEventName returns the user-defined event name.
func (VehicleIdInitialized) ContractEventName() string {
	return VehicleIdInitializedEventName
}

// UnpackInitializedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Initialized(uint8 version)
func (vehicleId *VehicleId) UnpackInitializedEvent(log *types.Log) (*VehicleIdInitialized, error) {
	event := "Initialized"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdInitialized)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdMetadataUpdate represents a MetadataUpdate event raised by the VehicleId contract.
type VehicleIdMetadataUpdate struct {
	TokenId *big.Int
	Raw     *types.Log // Blockchain specific contextual infos
}

const VehicleIdMetadataUpdateEventName = "MetadataUpdate"

// ContractEventName returns the user-defined event name.
func (VehicleIdMetadataUpdate) ContractEventName() string {
	return VehicleIdMetadataUpdateEventName
}

// UnpackMetadataUpdateEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event MetadataUpdate(uint256 _tokenId)
func (vehicleId *VehicleId) UnpackMetadataUpdateEvent(log *types.Log) (*VehicleIdMetadataUpdate, error) {
	event := "MetadataUpdate"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdMetadataUpdate)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdPrivilegeCreated represents a PrivilegeCreated event raised by the VehicleId contract.
type VehicleIdPrivilegeCreated struct {
	PrivilegeId *big.Int
	Enabled     bool
	Description string
	Raw         *types.Log // Blockchain specific contextual infos
}

const VehicleIdPrivilegeCreatedEventName = "PrivilegeCreated"

// ContractEventName returns the user-defined event name.
func (VehicleIdPrivilegeCreated) ContractEventName() string {
	return VehicleIdPrivilegeCreatedEventName
}

// UnpackPrivilegeCreatedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeCreated(uint256 indexed privilegeId, bool enabled, string description)
func (vehicleId *VehicleId) UnpackPrivilegeCreatedEvent(log *types.Log) (*VehicleIdPrivilegeCreated, error) {
	event := "PrivilegeCreated"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdPrivilegeCreated)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdPrivilegeDisabled represents a PrivilegeDisabled event raised by the VehicleId contract.
type VehicleIdPrivilegeDisabled struct {
	PrivilegeId *big.Int
	Raw         *types.Log // Blockchain specific contextual infos
}

const VehicleIdPrivilegeDisabledEventName = "PrivilegeDisabled"

// ContractEventName returns the user-defined event name.
func (VehicleIdPrivilegeDisabled) ContractEventName() string {
	return VehicleIdPrivilegeDisabledEventName
}

// UnpackPrivilegeDisabledEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeDisabled(uint256 indexed privilegeId)
func (vehicleId *VehicleId) UnpackPrivilegeDisabledEvent(log *types.Log) (*VehicleIdPrivilegeDisabled, error) {
	event := "PrivilegeDisabled"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdPrivilegeDisabled)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdPrivilegeEnabled represents a PrivilegeEnabled event raised by the VehicleId contract.
type VehicleIdPrivilegeEnabled struct {
	PrivilegeId *big.Int
	Raw         *types.Log // Blockchain specific contextual infos
}

const VehicleIdPrivilegeEnabledEventName = "PrivilegeEnabled"

// ContractEventName returns the user-defined event name.
func (VehicleIdPrivilegeEnabled) ContractEventName() string {
	return VehicleIdPrivilegeEnabledEventName
}

// UnpackPrivilegeEnabledEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeEnabled(uint256 indexed privilegeId)
func (vehicleId *VehicleId) UnpackPrivilegeEnabledEvent(log *types.Log) (*VehicleIdPrivilegeEnabled, error) {
	event := "PrivilegeEnabled"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdPrivilegeEnabled)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdPrivilegeSet represents a PrivilegeSet event raised by the VehicleId contract.
type VehicleIdPrivilegeSet struct {
	TokenId *big.Int
	Version *big.Int
	PrivId  *big.Int
	User    common.Address
	Expires *big.Int
	Raw     *types.Log // Blockchain specific contextual infos
}

const VehicleIdPrivilegeSetEventName = "PrivilegeSet"

// ContractEventName returns the user-defined event name.
func (VehicleIdPrivilegeSet) ContractEventName() string {
	return VehicleIdPrivilegeSetEventName
}

// UnpackPrivilegeSetEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event PrivilegeSet(uint256 indexed tokenId, uint256 version, uint256 indexed privId, address indexed user, uint256 expires)
func (vehicleId *VehicleId) UnpackPrivilegeSetEvent(log *types.Log) (*VehicleIdPrivilegeSet, error) {
	event := "PrivilegeSet"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdPrivilegeSet)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdRoleAdminChanged represents a RoleAdminChanged event raised by the VehicleId contract.
type VehicleIdRoleAdminChanged struct {
	Role              [32]byte
	PreviousAdminRole [32]byte
	NewAdminRole      [32]byte
	Raw               *types.Log // Blockchain specific contextual infos
}

const VehicleIdRoleAdminChangedEventName = "RoleAdminChanged"

// ContractEventName returns the user-defined event name.
func (VehicleIdRoleAdminChanged) ContractEventName() string {
	return VehicleIdRoleAdminChangedEventName
}

// UnpackRoleAdminChangedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
func (vehicleId *VehicleId) UnpackRoleAdminChangedEvent(log *types.Log) (*VehicleIdRoleAdminChanged, error) {
	event := "RoleAdminChanged"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdRoleAdminChanged)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdRoleGranted represents a RoleGranted event raised by the VehicleId contract.
type VehicleIdRoleGranted struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const VehicleIdRoleGrantedEventName = "RoleGranted"

// ContractEventName returns the user-defined event name.
func (VehicleIdRoleGranted) ContractEventName() string {
	return VehicleIdRoleGrantedEventName
}

// UnpackRoleGrantedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
func (vehicleId *VehicleId) UnpackRoleGrantedEvent(log *types.Log) (*VehicleIdRoleGranted, error) {
	event := "RoleGranted"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdRoleGranted)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdRoleRevoked represents a RoleRevoked event raised by the VehicleId contract.
type VehicleIdRoleRevoked struct {
	Role    [32]byte
	Account common.Address
	Sender  common.Address
	Raw     *types.Log // Blockchain specific contextual infos
}

const VehicleIdRoleRevokedEventName = "RoleRevoked"

// ContractEventName returns the user-defined event name.
func (VehicleIdRoleRevoked) ContractEventName() string {
	return VehicleIdRoleRevokedEventName
}

// UnpackRoleRevokedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
func (vehicleId *VehicleId) UnpackRoleRevokedEvent(log *types.Log) (*VehicleIdRoleRevoked, error) {
	event := "RoleRevoked"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdRoleRevoked)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdTransfer represents a Transfer event raised by the VehicleId contract.
type VehicleIdTransfer struct {
	From    common.Address
	To      common.Address
	TokenId *big.Int
	Raw     *types.Log // Blockchain specific contextual infos
}

const VehicleIdTransferEventName = "Transfer"

// ContractEventName returns the user-defined event name.
func (VehicleIdTransfer) ContractEventName() string {
	return VehicleIdTransferEventName
}

// UnpackTransferEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
func (vehicleId *VehicleId) UnpackTransferEvent(log *types.Log) (*VehicleIdTransfer, error) {
	event := "Transfer"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdTransfer)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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

// VehicleIdUpgraded represents a Upgraded event raised by the VehicleId contract.
type VehicleIdUpgraded struct {
	Implementation common.Address
	Raw            *types.Log // Blockchain specific contextual infos
}

const VehicleIdUpgradedEventName = "Upgraded"

// ContractEventName returns the user-defined event name.
func (VehicleIdUpgraded) ContractEventName() string {
	return VehicleIdUpgradedEventName
}

// UnpackUpgradedEvent is the Go binding that unpacks the event data emitted
// by contract.
//
// Solidity: event Upgraded(address indexed implementation)
func (vehicleId *VehicleId) UnpackUpgradedEvent(log *types.Log) (*VehicleIdUpgraded, error) {
	event := "Upgraded"
	if len(log.Topics) == 0 || log.Topics[0] != vehicleId.abi.Events[event].ID {
		return nil, errors.New("event signature mismatch")
	}
	out := new(VehicleIdUpgraded)
	if len(log.Data) > 0 {
		if err := vehicleId.abi.UnpackIntoInterface(out, event, log.Data); err != nil {
			return nil, err
		}
	}
	var indexed abi.Arguments
	for _, arg := range vehicleId.abi.Events[event].Inputs {
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
func (vehicleId *VehicleId) UnpackError(raw []byte) (any, error) {
	if bytes.Equal(raw[:4], vehicleId.abi.Errors["TransferFailed"].ID.Bytes()[:4]) {
		return vehicleId.UnpackTransferFailedError(raw[4:])
	}
	if bytes.Equal(raw[:4], vehicleId.abi.Errors["Unauthorized"].ID.Bytes()[:4]) {
		return vehicleId.UnpackUnauthorizedError(raw[4:])
	}
	if bytes.Equal(raw[:4], vehicleId.abi.Errors["ZeroAddress"].ID.Bytes()[:4]) {
		return vehicleId.UnpackZeroAddressError(raw[4:])
	}
	return nil, errors.New("Unknown error")
}

// VehicleIdTransferFailed represents a TransferFailed error raised by the VehicleId contract.
type VehicleIdTransferFailed struct {
	IdProxy      common.Address
	Id           *big.Int
	ErrorMessage string
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error TransferFailed(address idProxy, uint256 id, string errorMessage)
func VehicleIdTransferFailedErrorID() common.Hash {
	return common.HexToHash("0x32bd04fba17e3a4e042de2ca40e007e3f7478948cb07937b3e2059d4be9486e0")
}

// UnpackTransferFailedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error TransferFailed(address idProxy, uint256 id, string errorMessage)
func (vehicleId *VehicleId) UnpackTransferFailedError(raw []byte) (*VehicleIdTransferFailed, error) {
	out := new(VehicleIdTransferFailed)
	if err := vehicleId.abi.UnpackIntoInterface(out, "TransferFailed", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// VehicleIdUnauthorized represents a Unauthorized error raised by the VehicleId contract.
type VehicleIdUnauthorized struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error Unauthorized()
func VehicleIdUnauthorizedErrorID() common.Hash {
	return common.HexToHash("0x82b4290015f7ec7256ca2a6247d3c2a89c4865c0e791456df195f40ad0a81367")
}

// UnpackUnauthorizedError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error Unauthorized()
func (vehicleId *VehicleId) UnpackUnauthorizedError(raw []byte) (*VehicleIdUnauthorized, error) {
	out := new(VehicleIdUnauthorized)
	if err := vehicleId.abi.UnpackIntoInterface(out, "Unauthorized", raw); err != nil {
		return nil, err
	}
	return out, nil
}

// VehicleIdZeroAddress represents a ZeroAddress error raised by the VehicleId contract.
type VehicleIdZeroAddress struct {
}

// ErrorID returns the hash of canonical representation of the error's signature.
//
// Solidity: error ZeroAddress()
func VehicleIdZeroAddressErrorID() common.Hash {
	return common.HexToHash("0xd92e233df2717d4a40030e20904abd27b68fcbeede117eaaccbbdac9618c8c73")
}

// UnpackZeroAddressError is the Go binding used to decode the provided
// error data into the corresponding Go error struct.
//
// Solidity: error ZeroAddress()
func (vehicleId *VehicleId) UnpackZeroAddressError(raw []byte) (*VehicleIdZeroAddress, error) {
	out := new(VehicleIdZeroAddress)
	if err := vehicleId.abi.UnpackIntoInterface(out, "ZeroAddress", raw); err != nil {
		return nil, err
	}
	return out, nil
}
