//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/IStreamRegistry.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/streamr/StreamrManagerStorage.sol";

import "../../shared/Errors.sol" as Errors;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VehicleStream
 * @notice Contract to handle vehicle streams
 */
contract VehicleStream is AccessControlInternal {
    string constant DIMO_STREAM_ENS = "streams.dimo.eth";
    string constant DIMO_STREAM_ENS_VEHICLE = "streams.dimo.eth/vehicle/";

    event VehicleStreamAssociated(string streamId, uint256 indexed vehicleId);
    event SubscribedToVehicleStream(
        string streamId,
        address indexed subscriber,
        uint256 subscribeExpiration
    );

    /**
     * @notice Creates a vehicle stream associated with a vehicle id
     * @dev Stream is is in format streams.dimo.eth/vehicle/<vehicleId>
     * @dev Reverts if vehicle id does not exist or caller is not the owner
     * @param vehicleId Vehicle node Id
     */
    function createVehicleStream(uint256 vehicleId) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        IStreamRegistry streamRegistry = IStreamRegistry(
            StreamrManagerStorage.getStorage().streamRegistry
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

        emit VehicleStreamAssociated(streamId, vehicleId);
    }

    /**
     * @notice Set a subcription permission for a user
     * @dev Only the vehicle id owner can add new subscribers to their stream
     * @param vehicleId Vehicle node id
     * @param subscriber Vehicle stream subscriber
     * @param subscribeExpiration Subscription expiraton timestamp
     */
    function subscribeToVehicleStream(
        uint256 vehicleId,
        address subscriber,
        uint256 subscribeExpiration
    ) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        StreamrManagerStorage.Storage storage sms = StreamrManagerStorage
            .getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(sms.streamRegistry);

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

        // Creates the subscription permission setting subscribeExpiration
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
