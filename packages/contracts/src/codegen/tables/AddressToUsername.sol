// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { FieldLayout, FieldLayoutLib } from "@latticexyz/store/src/FieldLayout.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("AddressToUsernam")));
bytes32 constant AddressToUsernameTableId = _tableId;

struct AddressToUsernameData {
  uint256 colorIndex;
  string userName;
}

library AddressToUsername {
  /** Get the table values' field layout */
  function getFieldLayout() internal pure returns (FieldLayout) {
    uint256[] memory _fieldLayout = new uint256[](1);
    _fieldLayout[0] = 32;

    return FieldLayoutLib.encode(_fieldLayout, 1);
  }

  /** Get the table's key schema */
  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.ADDRESS;
    _schema[1] = SchemaType.UINT256;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's value schema */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](2);
    _schema[0] = SchemaType.UINT256;
    _schema[1] = SchemaType.STRING;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's key names */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](2);
    keyNames[0] = "ownerAddress";
    keyNames[1] = "gameId";
  }

  /** Get the table's field names */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](2);
    fieldNames[0] = "colorIndex";
    fieldNames[1] = "userName";
  }

  /** Register the table with its config */
  function register() internal {
    StoreSwitch.registerTable(
      _tableId,
      getFieldLayout(),
      getKeySchema(),
      getValueSchema(),
      getKeyNames(),
      getFieldNames()
    );
  }

  /** Register the table with its config (using the specified store) */
  function register(IStore _store) internal {
    _store.registerTable(_tableId, getFieldLayout(), getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /** Get colorIndex */
  function getColorIndex(address ownerAddress, uint256 gameId) internal view returns (uint256 colorIndex) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0, getFieldLayout());
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get colorIndex (using the specified store) */
  function getColorIndex(
    IStore _store,
    address ownerAddress,
    uint256 gameId
  ) internal view returns (uint256 colorIndex) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0, getFieldLayout());
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set colorIndex */
  function setColorIndex(address ownerAddress, uint256 gameId, uint256 colorIndex) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((colorIndex)), getFieldLayout());
  }

  /** Set colorIndex (using the specified store) */
  function setColorIndex(IStore _store, address ownerAddress, uint256 gameId, uint256 colorIndex) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((colorIndex)), getFieldLayout());
  }

  /** Get userName */
  function getUserName(address ownerAddress, uint256 gameId) internal view returns (string memory userName) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1, getFieldLayout());
    return (string(_blob));
  }

  /** Get userName (using the specified store) */
  function getUserName(
    IStore _store,
    address ownerAddress,
    uint256 gameId
  ) internal view returns (string memory userName) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1, getFieldLayout());
    return (string(_blob));
  }

  /** Set userName */
  function setUserName(address ownerAddress, uint256 gameId, string memory userName) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    StoreSwitch.setField(_tableId, _keyTuple, 1, bytes((userName)), getFieldLayout());
  }

  /** Set userName (using the specified store) */
  function setUserName(IStore _store, address ownerAddress, uint256 gameId, string memory userName) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    _store.setField(_tableId, _keyTuple, 1, bytes((userName)), getFieldLayout());
  }

  /** Get the length of userName */
  function lengthUserName(address ownerAddress, uint256 gameId) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 1, getFieldLayout());
    unchecked {
      return _byteLength / 1;
    }
  }

  /** Get the length of userName (using the specified store) */
  function lengthUserName(IStore _store, address ownerAddress, uint256 gameId) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 1, getFieldLayout());
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * Get an item of userName
   * (unchecked, returns invalid data if index overflows)
   */
  function getItemUserName(address ownerAddress, uint256 gameId, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    unchecked {
      bytes memory _blob = StoreSwitch.getFieldSlice(
        _tableId,
        _keyTuple,
        1,
        getFieldLayout(),
        _index * 1,
        (_index + 1) * 1
      );
      return (string(_blob));
    }
  }

  /**
   * Get an item of userName (using the specified store)
   * (unchecked, returns invalid data if index overflows)
   */
  function getItemUserName(
    IStore _store,
    address ownerAddress,
    uint256 gameId,
    uint256 _index
  ) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    unchecked {
      bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 1, getFieldLayout(), _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /** Push a slice to userName */
  function pushUserName(address ownerAddress, uint256 gameId, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    StoreSwitch.pushToField(_tableId, _keyTuple, 1, bytes((_slice)), getFieldLayout());
  }

  /** Push a slice to userName (using the specified store) */
  function pushUserName(IStore _store, address ownerAddress, uint256 gameId, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    _store.pushToField(_tableId, _keyTuple, 1, bytes((_slice)), getFieldLayout());
  }

  /** Pop a slice from userName */
  function popUserName(address ownerAddress, uint256 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    StoreSwitch.popFromField(_tableId, _keyTuple, 1, 1, getFieldLayout());
  }

  /** Pop a slice from userName (using the specified store) */
  function popUserName(IStore _store, address ownerAddress, uint256 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    _store.popFromField(_tableId, _keyTuple, 1, 1, getFieldLayout());
  }

  /**
   * Update a slice of userName at `_index`
   * (checked only to prevent modifying other tables; can corrupt own data if index overflows)
   */
  function updateUserName(address ownerAddress, uint256 gameId, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    unchecked {
      StoreSwitch.updateInField(_tableId, _keyTuple, 1, _index * 1, bytes((_slice)), getFieldLayout());
    }
  }

  /**
   * Update a slice of userName (using the specified store) at `_index`
   * (checked only to prevent modifying other tables; can corrupt own data if index overflows)
   */
  function updateUserName(
    IStore _store,
    address ownerAddress,
    uint256 gameId,
    uint256 _index,
    string memory _slice
  ) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    unchecked {
      _store.updateInField(_tableId, _keyTuple, 1, _index * 1, bytes((_slice)), getFieldLayout());
    }
  }

  /** Get the full data */
  function get(address ownerAddress, uint256 gameId) internal view returns (AddressToUsernameData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getFieldLayout());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(
    IStore _store,
    address ownerAddress,
    uint256 gameId
  ) internal view returns (AddressToUsernameData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getFieldLayout());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(address ownerAddress, uint256 gameId, uint256 colorIndex, string memory userName) internal {
    bytes memory _data = encode(colorIndex, userName);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data, getFieldLayout());
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    address ownerAddress,
    uint256 gameId,
    uint256 colorIndex,
    string memory userName
  ) internal {
    bytes memory _data = encode(colorIndex, userName);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    _store.setRecord(_tableId, _keyTuple, _data, getFieldLayout());
  }

  /** Set the full data using the data struct */
  function set(address ownerAddress, uint256 gameId, AddressToUsernameData memory _table) internal {
    set(ownerAddress, gameId, _table.colorIndex, _table.userName);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, address ownerAddress, uint256 gameId, AddressToUsernameData memory _table) internal {
    set(_store, ownerAddress, gameId, _table.colorIndex, _table.userName);
  }

  /**
   * Decode the tightly packed blob using this table's field layout.
   * Undefined behaviour for invalid blobs.
   */
  function decode(bytes memory _blob) internal pure returns (AddressToUsernameData memory _table) {
    // 32 is the total byte length of static data
    PackedCounter _encodedLengths = PackedCounter.wrap(Bytes.slice32(_blob, 32));

    _table.colorIndex = (uint256(Bytes.slice32(_blob, 0)));

    // Store trims the blob if dynamic fields are all empty
    if (_blob.length > 32) {
      // skip static data length + dynamic lengths word
      uint256 _start = 64;
      uint256 _end;
      unchecked {
        _end = 64 + _encodedLengths.atIndex(0);
      }
      _table.userName = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));
    }
  }

  /** Tightly pack full data using this table's field layout */
  function encode(uint256 colorIndex, string memory userName) internal pure returns (bytes memory) {
    PackedCounter _encodedLengths;
    // Lengths are effectively checked during copy by 2**40 bytes exceeding gas limits
    unchecked {
      _encodedLengths = PackedCounterLib.pack(bytes(userName).length);
    }

    return abi.encodePacked(colorIndex, _encodedLengths.unwrap(), bytes((userName)));
  }

  /** Encode keys as a bytes32 array using this table's field layout */
  function encodeKeyTuple(address ownerAddress, uint256 gameId) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    return _keyTuple;
  }

  /* Delete all data for given keys */
  function deleteRecord(address ownerAddress, uint256 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    StoreSwitch.deleteRecord(_tableId, _keyTuple, getFieldLayout());
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, address ownerAddress, uint256 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameId));

    _store.deleteRecord(_tableId, _keyTuple, getFieldLayout());
  }
}
