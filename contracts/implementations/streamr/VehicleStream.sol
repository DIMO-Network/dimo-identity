//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

import "../../interfaces/INFT.sol";
import "../../interfaces/IStreamRegistry.sol";
import "../../libraries/nodes/VehicleStorage.sol";
import "../../libraries/streamr/StreamrStorage.sol";
import "../../libraries/streamr/VehicleStreamStorage.sol";

import "@solidstate/contracts/access/access_control/AccessControlInternal.sol";

/// TODO Documentation
contract VehicleStream is AccessControlInternal {
    function createStream(uint256 vehicleId) external returns (uint256) {
        address vehicleIdProxyAddress = VehicleStorage
            .getStorage()
            .idProxyAddress;
        StreamrStorage.Storage storage ss = StreamrStorage.getStorage();
        VehicleStreamStorage.Storage storage vss = VehicleStreamStorage
            .getStorage(vehicleId);
        IStreamRegistry streamRegistry = IStreamRegistry(ss.streamrRegistry);

        // try INFT(vehicleIdProxyAddress).ownerOf(vehicleId) returns (
        //     address vehicleOwner
        // ) {
        //     if (vehicleOwner != msg.sender) {
        //         revert("Not the owner");
        //     }
        // } catch {
        //     revert("Invalid vehicle ID");
        // }

        string memory streamPath = string.concat(
            "/vehicle/",
            uintToString(vehicleId)
        );
        vss.streamId = string.concat(
            addressToString(address(this)),
            streamPath
        );
        streamRegistry.createStream(streamPath, "{}");
        // vss.streamId = string.concat(ss.dimoBaseStreamId, streamPath);
        // streamRegistry.createStreamWithENS(ss.dimoBaseStreamId, streamPath, "{}");

        return 0;
    }

    function addSubscription(
        uint256 vehicleId,
        address subscriber,
        uint256 expirationTimestamp
    ) public {
        StreamrStorage.Storage storage ss = StreamrStorage.getStorage();
        VehicleStreamStorage.Storage storage vss = VehicleStreamStorage
            .getStorage(vehicleId);
        IStreamRegistry streamRegistry = IStreamRegistry(ss.streamrRegistry);

        string memory streamId = string.concat(
            addressToString(address(this)),
            "/vehicle/",
            uintToString(vehicleId)
        );
        // string memory streamId = string.concat(ss.dimoBaseStreamId, "/vehicle/", uintToString(vehicleId));
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

    function uintToString(
        uint256 vehicleId
    ) public pure returns (string memory) {
        uint input = vehicleId;
        uint length = 0;
        while (input > 0) {
            length++;
            input /= 10;
        }
        if (length == 0) {
            length = 1;
        }

        bytes memory _digits = "0123456789";
        bytes memory _string = new bytes(length);
        input = vehicleId;
        for (uint i = 1; i <= length; i++) {
            uint digit = input % 10;
            input /= 10;
            _string[length - i] = _digits[digit];
        }
        return string(_string);
    }

    function addressToString(
        address _address
    ) public pure returns (string memory) {
        bytes32 _bytes = bytes32(uint256(uint160(_address)));
        bytes memory _hex = "0123456789abcdef";
        bytes memory _string = new bytes(42);
        _string[0] = "0";
        _string[1] = "x";
        for (uint i = 0; i < 20; i++) {
            _string[2 + i * 2] = _hex[uint8(_bytes[i + 12] >> 4)];
            _string[3 + i * 2] = _hex[uint8(_bytes[i + 12] & 0x0f)];
        }
        return string(_string);
    }

    function onTransfer(
        address /* from */,
        address /* to */,
        uint256 vehicleId
    ) public {
        StreamrStorage.Storage storage ss = StreamrStorage.getStorage();
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
