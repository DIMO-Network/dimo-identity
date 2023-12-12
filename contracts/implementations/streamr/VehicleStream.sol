//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/IStreamRegistry.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/streamr/StreamrManagerStorage.sol";

import "../../shared/Errors.sol" as Errors;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// TODO Documentation
contract VehicleStream is AccessControlInternal {
    string constant DIMO_STREAM_ENS = "streams.dimo.eth";
    string constant DIMO_STREAM_ENS_VEHICLE = "streams.dimo.eth/vehicle/";

    event VehicleStreamAssociated(uint256 indexed vehicleId, string streamId);
    event VehicleStreamDissociated(uint256 indexed vehicleId, string streamId);
    event SubscribedToVehicleStream(
        string streamId,
        address indexed subscriber,
        uint256 subscribeExpiration
    );

    // TODO Documentation
    function createVehicleStream(uint256 vehicleId) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        IStreamRegistry streamRegistry = IStreamRegistry(
            StreamrManagerStorage.getStorage().streamrRegistry
        );

        try INFT(vehicleIdProxyAddress).ownerOf(vehicleId) returns (
            address vehicleOwner
        ) {
            if (vehicleOwner != msg.sender) {
                revert Errors.Unauthorized(msg.sender);
            }
        } catch {
            revert Errors.InvalidNode(vehicleIdProxyAddress, vehicleId);
        }

        string memory streamPath = string(
            abi.encodePacked("/vehicle/", Strings.toString(vehicleId))
        );
        streamRegistry.createStreamWithENS(DIMO_STREAM_ENS, streamPath, "{}");

        string memory streamId = string(
            abi.encodePacked(
                DIMO_STREAM_ENS_VEHICLE,
                Strings.toString(vehicleId)
            )
        );

        emit VehicleStreamAssociated(vehicleId, streamId);
    }

    // TODO Documentation
    function subscribeToVehicleStream(
        uint256 vehicleId,
        address subscriber,
        uint256 subscribeExpiration
    ) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        StreamrManagerStorage.Storage storage ss = StreamrManagerStorage
            .getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(ss.streamrRegistry);

        // TODO To be possibly replaced by signature verification (like permit)
        try INFT(vehicleIdProxyAddress).ownerOf(vehicleId) returns (
            address vehicleOwner
        ) {
            if (vehicleOwner != msg.sender) {
                revert Errors.Unauthorized(msg.sender);
            }
        } catch {
            revert Errors.InvalidNode(vehicleIdProxyAddress, vehicleId);
        }

        string memory streamId = string(
            abi.encodePacked(
                DIMO_STREAM_ENS_VEHICLE,
                Strings.toString(vehicleId)
            )
        );

        // Creates the subscription permission setting subscribeExpiration > 0
        streamRegistry.setPermissionsForUser(
            streamId,
            subscriber,
            false,
            false,
            0,
            subscribeExpiration,
            false
        );

        emit SubscribedToVehicleStream(
            streamId,
            subscriber,
            subscribeExpiration
        );
    }
}
