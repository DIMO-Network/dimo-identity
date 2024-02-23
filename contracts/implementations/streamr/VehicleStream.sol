//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/INFTMultiPrivilege.sol";
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
    uint256 private constant VEHICLE_SUBSCRIBE_LIVE_DATA_PRIVILEGE = 6;
    uint256 private constant MAX_UINT = 2 ** 256 - 1;

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
     * @dev Stream is in the format streams.dimo.eth/vehicles/<vehicleId>
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
            abi.encodePacked("/vehicles/", Strings.toString(vehicleId))
        );
        string memory metadata = string(
            abi.encodePacked(
                '{"partitions":1,"description":"DIMO Vehicle Stream for Vehicle ',
                Strings.toString(vehicleId),
                '","config":{"fields":[]}}'
            )
        );
        streamRegistry.createStreamWithENS(
            dimoStreamrEns,
            streamPath,
            metadata
        );

        string memory streamId = string(
            abi.encodePacked(
                dimoStreamrEns,
                "/vehicles/",
                Strings.toString(vehicleId)
            )
        );

        vs.streams[vehicleId] = streamId;
        vs.isOfficialStreamId[streamId] = true;

        emit VehicleStreamSet(vehicleId, streamId);

        streamRegistry.grantPermission(
            streamId,
            msg.sender,
            IStreamRegistry.PermissionType.Subscribe
        );

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
                msg.sender,
                IStreamRegistry.PermissionType.Grant
            )
        ) {
            revert NoStreamrPermission(
                msg.sender,
                IStreamRegistry.PermissionType.Grant
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
            if (vs.isOfficialStreamId[oldStreamId]) {
                vs.isOfficialStreamId[oldStreamId] = false;
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

        if (vs.isOfficialStreamId[oldStreamId]) {
            vs.isOfficialStreamId[oldStreamId] = false;
            streamRegistry.deleteStream(oldStreamId);
        }

        delete vs.streams[vehicleId];

        emit VehicleStreamUnset(vehicleId, oldStreamId);
    }

    /**
     * @notice Allows a user to subscribe to a vehicle stream
     * @dev The vehicle owner must grant the subscribe live data privilege to the msg.sender
     * @param vehicleId Vehicle node id
     * @param expirationTime Subscription expiration timestamp
     */
    function subscribeToVehicleStream(
        uint256 vehicleId,
        uint256 expirationTime
    ) external {
        INFTMultiPrivilege vehicleIdProxy = INFTMultiPrivilege(
            VehicleStorage.getStorage().idProxyAddress
        );

        if (!vehicleIdProxy.exists(vehicleId))
            revert Errors.InvalidNode(address(vehicleIdProxy), vehicleId);

        if (
            !vehicleIdProxy.hasPrivilege(
                vehicleId,
                VEHICLE_SUBSCRIBE_LIVE_DATA_PRIVILEGE,
                msg.sender
            )
        ) revert Errors.Unauthorized(msg.sender);

        _subscribeToVehicleStream(vehicleId, msg.sender, expirationTime);
    }

    /**
     * @notice Set a subscription permission for a user
     * @dev Only the vehicle id owner can add new subscribers to their stream
     * @param vehicleId Vehicle node id
     * @param subscriber Vehicle stream subscriber
     * @param expirationTime Subscription expiration timestamp
     */
    function setSubscriptionToVehicleStream(
        uint256 vehicleId,
        address subscriber,
        uint256 expirationTime
    ) external {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;

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

        _subscribeToVehicleStream(vehicleId, subscriber, expirationTime);
    }

    /**
     * @notice Transfers stream Id for the new vehicle Id owner
     * @dev Can only be called by the VehicleId contract
     *  - Deletes the existing stream Id and recreates it to reset existing permissions
     * @param to New vehicle Id owner
     * @param vehicleId Vehicle node Id
     */
    function onTransferVehicleStream(address to, uint256 vehicleId) external {
        if (msg.sender != VehicleStorage.getStorage().idProxyAddress) {
            revert Errors.Unauthorized(msg.sender);
        }

        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();

        string memory streamId = vs.streams[vehicleId];
        if (!vs.isOfficialStreamId[streamId]) {
            delete vs.streams[vehicleId];
            return;
        }
        if (bytes(streamId).length == 0) return;

        string memory dimoStreamrEns = StreamrConfiguratorStorage
            .getStorage()
            .dimoStreamrEns;
        StreamrConfiguratorStorage.Storage
            storage scs = StreamrConfiguratorStorage.getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(scs.streamRegistry);

        string memory streamPath = string(
            abi.encodePacked("/vehicles/", Strings.toString(vehicleId))
        );

        streamRegistry.deleteStream(streamId);
        emit VehicleStreamUnset(vehicleId, streamId);

        streamRegistry.createStreamWithENS(dimoStreamrEns, streamPath, "{}");
        emit VehicleStreamSet(vehicleId, streamId);

        streamRegistry.grantPermission(
            streamId,
            to,
            IStreamRegistry.PermissionType.Subscribe
        );

        streamRegistry.grantPermission(
            streamId,
            StreamrConfiguratorStorage.getStorage().dimoStreamrNode,
            IStreamRegistry.PermissionType.Publish
        );
    }

    /**
     * @notice Dissociates stream Id from the vehicle Id when burned
     * @dev Can only be called by the VehicleId contract
     *  - If official, also deletes stream Id
     * @param vehicleId Vehicle node Id
     */
    function onBurnVehicleStream(uint256 vehicleId) external {
        if (msg.sender != VehicleStorage.getStorage().idProxyAddress) {
            revert Errors.Unauthorized(msg.sender);
        }

        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();

        string memory streamId = vs.streams[vehicleId];
        if (bytes(streamId).length != 0) {
            delete vs.streams[vehicleId];
            if (vs.isOfficialStreamId[streamId]) {
                StreamrConfiguratorStorage.Storage
                    storage scs = StreamrConfiguratorStorage.getStorage();
                IStreamRegistry streamRegistry = IStreamRegistry(
                    scs.streamRegistry
                );

                vs.isOfficialStreamId[streamId] = false;
                streamRegistry.deleteStream(streamId);
            }

            emit VehicleStreamUnset(vehicleId, streamId);
        }
    }

    /**
     * @notice Set a subscription permission for a user when
     * the privilege to subscribe to live data is set in the VehicleId contract
     * @dev Can only be called by the VehicleId contract
     * @param vehicleId Vehicle node Id
     * @param subscriber Vehicle stream subscriber
     */
    function onSetSubscribePrivilege(
        uint256 vehicleId,
        address subscriber
    ) external {
        if (msg.sender != VehicleStorage.getStorage().idProxyAddress) {
            revert Errors.Unauthorized(msg.sender);
        }

        StreamrConfiguratorStorage.Storage
            storage scs = StreamrConfiguratorStorage.getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(scs.streamRegistry);
        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();

        string memory streamId = vs.streams[vehicleId];
        if (bytes(streamId).length == 0) {
            return;
        }
        if (
            !streamRegistry.hasPermission(
                streamId,
                address(this),
                IStreamRegistry.PermissionType.Grant
            )
        ) {
            return;
        }

        streamRegistry.grantPermission(
            streamId,
            subscriber,
            IStreamRegistry.PermissionType.Subscribe
        );

        emit SubscribedToVehicleStream(streamId, subscriber, MAX_UINT);
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

    /**
     * @notice Private function to set a subscription permission for a subscriber
     * @param vehicleId Vehicle node id
     * @param subscriber Vehicle stream subscriber
     * @param expirationTime Subscription expiration timestamp
     */
    function _subscribeToVehicleStream(
        uint256 vehicleId,
        address subscriber,
        uint256 expirationTime
    ) private {
        StreamrConfiguratorStorage.Storage
            storage scs = StreamrConfiguratorStorage.getStorage();
        VehicleStreamStorage.Storage storage vs = VehicleStreamStorage
            .getStorage();
        IStreamRegistry streamRegistry = IStreamRegistry(scs.streamRegistry);

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
}
