//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

interface IStreamRegistry {
    function createStream(
        string calldata streamIdPath,
        string calldata metadataJsonString
    ) external;

    function createStreamWithENS(
        string calldata ensName,
        string calldata streamIdPath,
        string calldata metadataJsonString
    ) external;
}
