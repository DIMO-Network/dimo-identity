//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/IStreamRegistry.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/streamr/StreamrConfiguratorStorage.sol";
import "../../libraries/streamr/VehicleStreamStorage.sol";

import "../../shared/Errors.sol" as Errors;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error VehicleStreamAlreadySet(uint256 vehicleId, string streamId);
error StreamDoesNotExist(string streamId);
error VehicleStreamNotSet(uint256 vehicleId);
error NoStreamrPermission(
    address user,
    IStreamRegistry.PermissionType permissionType
);

/**
 * @title VehicleStream
 * @notice Contract to handle vehicle streams
 */
contract VehicleStream is AccessControlInternal {
    event VehicleStreamSet(uint256 indexed vehicleId, string streamId);
    event VehicleStreamUnset(uint256 indexed vehicleId, string streamId);
    event SubscribedToVehicleStream(
        string streamId,
        address indexed subscriber,
        uint256 expirationTime
    );

    /**
     * @notice Creates a vehicle stream associated with a vehicle id
     * Grants publishing permission to the DIMO Streamr Node
     * @dev Stream is in the format streams.dimo.eth/vehicle/<vehicleId>
     *  - Reverts if vehicle id does not exist or caller is not the owner
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
        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();

        try INFT(vehicleIdProxyAddress).ownerOf(vehicleId) returns (
            address vehicleOwner
        ) {
            if (vehicleOwner != msg.sender) {
                revert Errors.Unauthorized(msg.sender);
            }
        } catch {
            revert Errors.InvalidNode(vehicleIdProxyAddress, vehicleId);
        }

        string memory oldStreamId = vs.streams[vehicleId];
        if (bytes(oldStreamId).length != 0) {
            revert VehicleStreamAlreadySet(vehicleId, oldStreamId);
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

        vs.streams[vehicleId] = streamId;
        vs.isInternalStreamId[streamId] = true;

        emit VehicleStreamSet(vehicleId, streamId);

        streamRegistry.grantPermission(
            streamId,
            StreamrConfiguratorStorage.getStorage().dimoStreamrNode,
            IStreamRegistry.PermissionType.Publish
        );
    }

    /**
     * @notice Allows a vehicle owner to associate an existing stream Id from their vehicle Id
     * @dev This contract must have the Grant Streamr permission
     *  - Reverts if vehicle id does not exist, caller is not the owner,
     *    stream Id does not exist, DIMO Registry does not have grant permission or DIMO Streamr Node the publish permission
     *  - If there is an existing stream Id associated to the vehicle Id,
     *    and it was created by this contract, it will be deleted
     * @param vehicleId Vehicle node Id
     * @param streamId The stream Id
     */
    function setVehicleStream(
        uint256 vehicleId,
        string calldata streamId
    ) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        StreamrConfiguratorStorage.Storage
            storage scs = StreamrConfiguratorStorage.getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(scs.streamRegistry);
        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();

        try INFT(vehicleIdProxyAddress).ownerOf(vehicleId) returns (
            address vehicleOwner
        ) {
            if (vehicleOwner != msg.sender) {
                revert Errors.Unauthorized(msg.sender);
            }
        } catch {
            revert Errors.InvalidNode(vehicleIdProxyAddress, vehicleId);
        }

        if (!streamRegistry.exists(streamId)) {
            revert StreamDoesNotExist(streamId);
        }

        if (
            !streamRegistry.hasPermission(
                streamId,
                scs.dimoStreamrNode,
                IStreamRegistry.PermissionType.Publish
            )
        ) {
            revert NoStreamrPermission(
                scs.dimoStreamrNode,
                IStreamRegistry.PermissionType.Publish
            );
        }
        if (
            !streamRegistry.hasPermission(
                streamId,
                address(this),
                IStreamRegistry.PermissionType.Grant
            )
        ) {
            revert NoStreamrPermission(
                address(this),
                IStreamRegistry.PermissionType.Grant
            );
        }

        string memory oldStreamId = vs.streams[vehicleId];
        if (bytes(oldStreamId).length != 0) {
            if (vs.isInternalStreamId[oldStreamId]) {
                vs.isInternalStreamId[oldStreamId] = false;
                streamRegistry.deleteStream(oldStreamId);
            }
            emit VehicleStreamUnset(vehicleId, oldStreamId);
        }

        vs.streams[vehicleId] = streamId;

        emit VehicleStreamSet(vehicleId, streamId);
    }

    /**
     * @notice Allows a vehicle owner to dissociate the stream Id from their vehicle Id
     * @dev Reverts if vehicle id does not exist or caller is not the owner
     * @param vehicleId Vehicle node Id
     */
    function unsetVehicleStream(uint256 vehicleId) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();
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

        string memory oldStreamId = vs.streams[vehicleId];
        if (bytes(oldStreamId).length == 0) {
            revert VehicleStreamNotSet(vehicleId);
        }

        if (vs.isInternalStreamId[oldStreamId]) {
            vs.isInternalStreamId[oldStreamId] = false;
            streamRegistry.deleteStream(oldStreamId);
        }

        delete vs.streams[vehicleId];

        emit VehicleStreamUnset(vehicleId, oldStreamId);
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
            storage scs = StreamrConfiguratorStorage.getStorage();
        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(scs.streamRegistry);

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

        string memory streamId = vs.streams[vehicleId];
        if (bytes(streamId).length == 0) {
            revert VehicleStreamNotSet(vehicleId);
        }

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

    /**
     * @notice Transfers stream Id for the new vehicle Id owner
     * @dev Can only be called by the VehicleId contract
     *  - Deletes the existing stream Id and recreates it to reset existing permissions
     * @param vehicleId Vehicle node Id
     */
    function transferVehicleStream(uint256 vehicleId) external {
        if (msg.sender != VehicleStorage.getStorage().idProxyAddress) {
            revert Errors.Unauthorized(msg.sender);
        }

        string memory dimoStreamrEns = StreamrConfiguratorStorage
            .getStorage()
            .dimoStreamrEns;
        StreamrConfiguratorStorage.Storage
            storage scs = StreamrConfiguratorStorage.getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(scs.streamRegistry);
        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();

        string memory streamId = vs.streams[vehicleId];
        if (bytes(streamId).length == 0 || !vs.isInternalStreamId[streamId])
            return;

        string memory streamPath = string(
            abi.encodePacked("/vehicle/", Strings.toString(vehicleId))
        );

        streamRegistry.deleteStream(streamId);
        emit VehicleStreamUnset(vehicleId, streamId);

        streamRegistry.createStreamWithENS(dimoStreamrEns, streamPath, "{}");
        emit VehicleStreamSet(vehicleId, streamId);

        streamRegistry.grantPermission(
            streamId,
            StreamrConfiguratorStorage.getStorage().dimoStreamrNode,
            IStreamRegistry.PermissionType.Publish
        );
    }

    /**
     * @notice Gets the stream Id by the vehicle Id
     * @dev If there is not stream Id associated to the vehicle Id, it will return an empty string
     * @param vehicleId Vehicle node Id
     */
    function getVehicleStream(
        uint256 vehicleId
    ) external view returns (string memory streamId) {
        streamId = VehicleStreamStorage.getStorage().streams[vehicleId];
    }
}
