//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

/// @dev derived from https://github.com/OpenZeppelin/openzeppelin-contracts (MIT license)

library AttributeSet {

    struct Set {
        bytes32[] _values;
        mapping(bytes32 => uint256) _indexes;
    }

    function add(Set storage set, bytes32 key) internal returns (bool) {
        if (!exists(set, key)) {
            set._values.push(key);
            set._indexes[key] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    function remove(Set storage set, bytes32 key) internal returns (bool) {
        uint256 valueIndex = set._indexes[key];

        if (valueIndex != 0) {

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            if (lastIndex != toDeleteIndex) {
                bytes32 lastvalue = set._values[lastIndex];

                // Move the last value to the index where the value to delete is
                set._values[toDeleteIndex] = lastvalue;
                // Update the index for the moved value
                set._indexes[lastvalue] = valueIndex; // Replace lastvalue's index to valueIndex
            }

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[key];

            return true;
        } else {
            return false;
        }
    }

    function count(Set storage set) internal view returns(uint) {
        return(set._values.length);
    }

    function exists(Set storage set, bytes32 key) internal view returns(bool) {
        return set._indexes[key] != 0;
    }
}