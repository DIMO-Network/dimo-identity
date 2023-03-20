// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.13;

contract Multicall {
    function multiDelegateCall(bytes[] calldata data)
        external
        returns (bytes[] memory results)
    {
        results = new bytes[](data.length);
        for (uint256 i = 0; i < data.length; i++) {
            (bool success, bytes memory result) = address(this).delegatecall(
                data[i]
            );
            require(success, "Delegate call failed");
            results[i] = result;
        }
        return results;
    }

    function multiStaticCall(bytes[] calldata data)
        external
        view
        returns (bytes[] memory results)
    {
        results = new bytes[](data.length);
        for (uint256 i = 0; i < data.length; i++) {
            (bool success, bytes memory result) = address(this).staticcall(
                data[i]
            );
            require(success, "Static call failed");
            results[i] = result;
        }
        return results;
    }
}
