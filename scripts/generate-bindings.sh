#!/bin/bash

# Exit on error
set -e

# Check if abigen is installed
if ! command -v abigen &> /dev/null
then
    echo "⚠️  abigen not found, skipping Go bindings generation"
    echo "To generate Go bindings, install abigen: https://geth.ethereum.org/docs/tools/abigen"
    exit 0
fi

echo "Generating Go bindings..."

# Create bindings directory if it doesn't exist
mkdir -p bindings/registry
mkdir -p bindings/dimoForwarder
mkdir -p bindings/aftermarketDeviceId
mkdir -p bindings/integrationId
mkdir -p bindings/manufacturerId
mkdir -p bindings/syntheticDeviceId
mkdir -p bindings/vehicleId

abigen --abi abis/DimoRegistry.json --out bindings/registry/registry.go --pkg registry --type Registry --v2
echo "✅ DIMORegistry bindings generated"

abigen --abi abis/contracts/DimoForwarder.sol/DimoForwarder.json --out bindings/dimoForwarder/dimoForwarder.go --pkg dimoForwarder --type DimoForwarder --v2
echo "✅ DimoForwarder bindings generated"

abigen --abi abis/contracts/NFTs/AftermarketDeviceId.sol/AftermarketDeviceId.json --out bindings/aftermarketDeviceId/aftermarketDeviceId.go --pkg aftermarketDeviceId --type AftermarketDeviceId --v2
echo "✅ AftermarketDeviceId bindings generated"

abigen --abi abis/contracts/NFTs/IntegrationId.sol/IntegrationId.json --out bindings/integrationId/integrationId.go --pkg integrationId --type IntegrationId --v2
echo "✅ IntegrationId bindings generated"

abigen --abi abis/contracts/NFTs/ManufacturerId.sol/ManufacturerId.json --out bindings/manufacturerId/manufacturerId.go --pkg manufacturerId --type ManufacturerId --v2
echo "✅ ManufacturerId bindings generated"

abigen --abi abis/contracts/NFTs/SyntheticDeviceId.sol/SyntheticDeviceId.json --out bindings/syntheticDeviceId/syntheticDeviceId.go --pkg syntheticDeviceId --type SyntheticDeviceId --v2
echo "✅ SyntheticDeviceId bindings generated"

abigen --abi abis/contracts/NFTs/VehicleId.sol/VehicleId.json --out bindings/vehicleId/vehicleId.go --pkg vehicleId --type VehicleId --v2
echo "✅ VehicleId bindings generated"

echo "✅ Go bindings generated successfully in bindings/"