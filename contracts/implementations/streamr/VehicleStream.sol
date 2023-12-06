//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/IStreamRegistry.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/streamr/StreamrManagerStorage.sol";
import "../../libraries/streamr/VehicleStreamStorage.sol";

import "../../shared/Errors.sol" as Errors;

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// TODO Documentation
contract VehicleStream is AccessControlInternal {
    string constant DIMO_STREAM_ENS = "streams.dimo.eth";
    string constant DIMO_STREAM_ENS_VEHICLE = "streams.dimo.eth/vehicle/";

    // TODO Documentation
    function createStream(uint256 vehicleId) external {
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
    }

    // TODO Documentation
    function subscribe(
        uint256 vehicleId,
        address subscriber,
        uint256 expirationTimestamp
    ) public {
        StreamrManagerStorage.Storage storage ss = StreamrManagerStorage
            .getStorage();
        VehicleStreamStorage.Storage storage vss = VehicleStreamStorage
            .getStorage(vehicleId);
        IStreamRegistry streamRegistry = IStreamRegistry(ss.streamrRegistry);

        string memory streamId = string(
            abi.encodePacked(
                DIMO_STREAM_ENS_VEHICLE,
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
            expirationTimestamp
        );

        vss.subscribers.push(subscriber);
    }

    // TODO Documentation
    function onTransfer(
        address /* from */,
        address /* to */,
        uint256 vehicleId
    ) public {
        StreamrManagerStorage.Storage storage ss = StreamrManagerStorage
            .getStorage();
        VehicleStreamStorage.Storage storage vss = VehicleStreamStorage
            .getStorage(vehicleId);
        IStreamRegistry streamRegistry = IStreamRegistry(ss.streamrRegistry);

        string memory streamId = vss.streamId;

        for (uint i = 0; i < vss.subscribers.length; i++) {
            address subscriber = vss.subscribers[i];
            streamRegistry.revokePermission(
                streamId,
                subscriber,
                IStreamRegistry.PermissionType.Subscribe
            );
        }
    }
}
