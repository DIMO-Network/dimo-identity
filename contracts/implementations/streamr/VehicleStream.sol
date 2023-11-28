//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/IStreamRegistry.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/streamr/StreamrStorage.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// TODO Documentation
contract VehicleStream is AccessControlInternal {
    function createStream(uint256 vehicleId) external returns (uint256) {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        StreamrStorage.Storage storage ss = StreamrStorage.getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(ss.streamrRegistry);

        try INFT(vehicleIdProxyAddress).ownerOf(vehicleId) returns (
            address vehicleOwner
        ) {
            if (vehicleOwner != msg.sender) {
                revert("Not the owner");
            }
        } catch {
            revert("Invalid vehicle ID");
        }

        streamRegistry.createStream(ss.dimoBaseStreamId, "mockMetadata");

        return 0;
    }
}
