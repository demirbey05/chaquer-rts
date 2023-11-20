// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

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
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { RESOURCE_TABLE, RESOURCE_OFFCHAIN_TABLE } from "@latticexyz/store/src/storeResourceTypes.sol";

ResourceId constant _tableId = ResourceId.wrap(
  bytes32(abi.encodePacked(RESOURCE_TABLE, bytes14(""), bytes16("AddressToColorIn")))
);
ResourceId constant AddressToColorIndexTableId = _tableId;

FieldLayout constant _fieldLayout = FieldLayout.wrap(
  0x0040020120200000000000000000000000000000000000000000000000000000
);

struct AddressToColorIndexData {
  uint256 mirror;
  uint256 colorIndex;
  string userName;
}

library AddressToColorIndex {
  /**
   * @notice Get the table values' field layout.
   * @return _fieldLayout The field layout for the table.
   */
  function getFieldLayout() internal pure returns (FieldLayout) {
    return _fieldLayout;
  }

  /**
   * @notice Get the table's key schema.
   * @return _keySchema The key schema for the table.
   */
  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _keySchema = new SchemaType[](2);
    _keySchema[0] = SchemaType.ADDRESS;
    _keySchema[1] = SchemaType.UINT256;

    return SchemaLib.encode(_keySchema);
  }

  /**
   * @notice Get the table's value schema.
   * @return _valueSchema The value schema for the table.
   */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _valueSchema = new SchemaType[](3);
    _valueSchema[0] = SchemaType.UINT256;
    _valueSchema[1] = SchemaType.UINT256;
    _valueSchema[2] = SchemaType.STRING;

    return SchemaLib.encode(_valueSchema);
  }

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](2);
    keyNames[0] = "ownerAddress";
    keyNames[1] = "gameID";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](3);
    fieldNames[0] = "mirror";
    fieldNames[1] = "colorIndex";
    fieldNames[2] = "userName";
  }

  /**
   * @notice Register the table with its config.
   */
  function register() internal {
    StoreSwitch.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config.
   */
  function _register() internal {
    StoreCore.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Get mirror.
   */
  function getMirror(address ownerAddress, uint256 gameID) internal view returns (uint256 mirror) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get mirror.
   */
  function _getMirror(address ownerAddress, uint256 gameID) internal view returns (uint256 mirror) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set mirror.
   */
  function setMirror(address ownerAddress, uint256 gameID, uint256 mirror) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((mirror)), _fieldLayout);
  }

  /**
   * @notice Set mirror.
   */
  function _setMirror(address ownerAddress, uint256 gameID, uint256 mirror) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((mirror)), _fieldLayout);
  }

  /**
   * @notice Get colorIndex.
   */
  function getColorIndex(address ownerAddress, uint256 gameID) internal view returns (uint256 colorIndex) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get colorIndex.
   */
  function _getColorIndex(address ownerAddress, uint256 gameID) internal view returns (uint256 colorIndex) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set colorIndex.
   */
  function setColorIndex(address ownerAddress, uint256 gameID, uint256 colorIndex) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((colorIndex)), _fieldLayout);
  }

  /**
   * @notice Set colorIndex.
   */
  function _setColorIndex(address ownerAddress, uint256 gameID, uint256 colorIndex) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((colorIndex)), _fieldLayout);
  }

  /**
   * @notice Get userName.
   */
  function getUserName(address ownerAddress, uint256 gameID) internal view returns (string memory userName) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes memory _blob = StoreSwitch.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Get userName.
   */
  function _getUserName(address ownerAddress, uint256 gameID) internal view returns (string memory userName) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes memory _blob = StoreCore.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Set userName.
   */
  function setUserName(address ownerAddress, uint256 gameID, string memory userName) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setDynamicField(_tableId, _keyTuple, 0, bytes((userName)));
  }

  /**
   * @notice Set userName.
   */
  function _setUserName(address ownerAddress, uint256 gameID, string memory userName) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setDynamicField(_tableId, _keyTuple, 0, bytes((userName)));
  }

  /**
   * @notice Get the length of userName.
   */
  function lengthUserName(address ownerAddress, uint256 gameID) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    uint256 _byteLength = StoreSwitch.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get the length of userName.
   */
  function _lengthUserName(address ownerAddress, uint256 gameID) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    uint256 _byteLength = StoreCore.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get an item of userName.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemUserName(address ownerAddress, uint256 gameID, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    unchecked {
      bytes memory _blob = StoreSwitch.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Get an item of userName.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function _getItemUserName(
    address ownerAddress,
    uint256 gameID,
    uint256 _index
  ) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    unchecked {
      bytes memory _blob = StoreCore.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Push a slice to userName.
   */
  function pushUserName(address ownerAddress, uint256 gameID, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Push a slice to userName.
   */
  function _pushUserName(address ownerAddress, uint256 gameID, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Pop a slice from userName.
   */
  function popUserName(address ownerAddress, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Pop a slice from userName.
   */
  function _popUserName(address ownerAddress, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Update a slice of userName at `_index`.
   */
  function updateUserName(address ownerAddress, uint256 gameID, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreSwitch.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update a slice of userName at `_index`.
   */
  function _updateUserName(address ownerAddress, uint256 gameID, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreCore.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Get the full data.
   */
  function get(address ownerAddress, uint256 gameID) internal view returns (AddressToColorIndexData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    (bytes memory _staticData, PackedCounter _encodedLengths, bytes memory _dynamicData) = StoreSwitch.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Get the full data.
   */
  function _get(address ownerAddress, uint256 gameID) internal view returns (AddressToColorIndexData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    (bytes memory _staticData, PackedCounter _encodedLengths, bytes memory _dynamicData) = StoreCore.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function set(
    address ownerAddress,
    uint256 gameID,
    uint256 mirror,
    uint256 colorIndex,
    string memory userName
  ) internal {
    bytes memory _staticData = encodeStatic(mirror, colorIndex);

    PackedCounter _encodedLengths = encodeLengths(userName);
    bytes memory _dynamicData = encodeDynamic(userName);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(
    address ownerAddress,
    uint256 gameID,
    uint256 mirror,
    uint256 colorIndex,
    string memory userName
  ) internal {
    bytes memory _staticData = encodeStatic(mirror, colorIndex);

    PackedCounter _encodedLengths = encodeLengths(userName);
    bytes memory _dynamicData = encodeDynamic(userName);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(address ownerAddress, uint256 gameID, AddressToColorIndexData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.mirror, _table.colorIndex);

    PackedCounter _encodedLengths = encodeLengths(_table.userName);
    bytes memory _dynamicData = encodeDynamic(_table.userName);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(address ownerAddress, uint256 gameID, AddressToColorIndexData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.mirror, _table.colorIndex);

    PackedCounter _encodedLengths = encodeLengths(_table.userName);
    bytes memory _dynamicData = encodeDynamic(_table.userName);

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(bytes memory _blob) internal pure returns (uint256 mirror, uint256 colorIndex) {
    mirror = (uint256(Bytes.slice32(_blob, 0)));

    colorIndex = (uint256(Bytes.slice32(_blob, 32)));
  }

  /**
   * @notice Decode the tightly packed blob of dynamic data using the encoded lengths.
   */
  function decodeDynamic(
    PackedCounter _encodedLengths,
    bytes memory _blob
  ) internal pure returns (string memory userName) {
    uint256 _start;
    uint256 _end;
    unchecked {
      _end = _encodedLengths.atIndex(0);
    }
    userName = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   * @param _staticData Tightly packed static fields.
   * @param _encodedLengths Encoded lengths of dynamic fields.
   * @param _dynamicData Tightly packed dynamic fields.
   */
  function decode(
    bytes memory _staticData,
    PackedCounter _encodedLengths,
    bytes memory _dynamicData
  ) internal pure returns (AddressToColorIndexData memory _table) {
    (_table.mirror, _table.colorIndex) = decodeStatic(_staticData);

    (_table.userName) = decodeDynamic(_encodedLengths, _dynamicData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(address ownerAddress, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(address ownerAddress, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(uint256 mirror, uint256 colorIndex) internal pure returns (bytes memory) {
    return abi.encodePacked(mirror, colorIndex);
  }

  /**
   * @notice Tightly pack dynamic data lengths using this table's schema.
   * @return _encodedLengths The lengths of the dynamic fields (packed into a single bytes32 value).
   */
  function encodeLengths(string memory userName) internal pure returns (PackedCounter _encodedLengths) {
    // Lengths are effectively checked during copy by 2**40 bytes exceeding gas limits
    unchecked {
      _encodedLengths = PackedCounterLib.pack(bytes(userName).length);
    }
  }

  /**
   * @notice Tightly pack dynamic (variable length) data using this table's schema.
   * @return The dynamic data, encoded into a sequence of bytes.
   */
  function encodeDynamic(string memory userName) internal pure returns (bytes memory) {
    return abi.encodePacked(bytes((userName)));
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dyanmic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    uint256 mirror,
    uint256 colorIndex,
    string memory userName
  ) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData = encodeStatic(mirror, colorIndex);

    PackedCounter _encodedLengths = encodeLengths(userName);
    bytes memory _dynamicData = encodeDynamic(userName);

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(address ownerAddress, uint256 gameID) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(ownerAddress)));
    _keyTuple[1] = bytes32(uint256(gameID));

    return _keyTuple;
  }
}
