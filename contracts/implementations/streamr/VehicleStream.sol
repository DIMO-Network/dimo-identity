//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/IStreamRegistry.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/streamr/StreamrConfiguratorStorage.sol";

import "../../shared/Errors.sol" as Errors;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title VehicleStream
 * @notice Contract to handle vehicle streams
 */
contract VehicleStream is AccessControlInternal {
    event VehicleStreamAssociated(string streamId, uint256 indexed vehicleId);
    event SubscribedToVehicleStream(
        string streamId,
        address indexed subscriber,
        uint256 expirationTime
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
        string memory dimoStreamrEns = StreamrConfiguratorStorage
            .getStorage()
            .dimoStreamrEns;
        IStreamRegistry streamRegistry = IStreamRegistry(
            StreamrConfiguratorStorage.getStorage().streamRegistry
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
        streamRegistry.createStreamWithENS(dimoStreamrEns, streamPath, "{}");

        string memory streamId = string(
            abi.encodePacked(
                dimoStreamrEns,
                "/vehicle/",
                Strings.toString(vehicleId)
            )
        );

        emit VehicleStreamAssociated(streamId, vehicleId);
    }

    /**
     * @notice Set a subscription permission for a user
     * @dev Only the vehicle id owner can add new subscribers to their stream
     * @param vehicleId Vehicle node id
     * @param subscriber Vehicle stream subscriber
     * @param expirationTime Subscription expiration timestamp
     */
    function subscribeToVehicleStream(
        uint256 vehicleId,
        address subscriber,
        uint256 expirationTime
    ) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        StreamrConfiguratorStorage.Storage
            storage sms = StreamrConfiguratorStorage.getStorage();
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
                sms.dimoStreamrEns,
                "/vehicle/",
                Strings.toString(vehicleId)
            )
        );

        streamRegistry.grantPermission(
            streamId,
            subscriber,
            IStreamRegistry.PermissionType.Subscribe
        );

        streamRegistry.setExpirationTime(
            streamId,
            subscriber,
            IStreamRegistry.PermissionType.Subscribe,
            expirationTime
        );

        emit SubscribedToVehicleStream(streamId, subscriber, expirationTime);
    }
}
