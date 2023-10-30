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
  bytes32(abi.encodePacked(RESOURCE_TABLE, bytes14(""), bytes16("ResourceOwn")))
);
ResourceId constant ResourceOwnTableId = _tableId;

FieldLayout constant _fieldLayout = FieldLayout.wrap(
  0x0060030020202000000000000000000000000000000000000000000000000000
);

struct ResourceOwnData {
  uint256 numOfFood;
  uint256 numOfWood;
  uint256 numOfGold;
}

library ResourceOwn {
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
    _valueSchema[2] = SchemaType.UINT256;

    return SchemaLib.encode(_valueSchema);
  }

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](2);
    keyNames[0] = "owner";
    keyNames[1] = "gameID";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](3);
    fieldNames[0] = "numOfFood";
    fieldNames[1] = "numOfWood";
    fieldNames[2] = "numOfGold";
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
   * @notice Get numOfFood.
   */
  function getNumOfFood(address owner, uint256 gameID) internal view returns (uint256 numOfFood) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfFood.
   */
  function _getNumOfFood(address owner, uint256 gameID) internal view returns (uint256 numOfFood) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set numOfFood.
   */
  function setNumOfFood(address owner, uint256 gameID, uint256 numOfFood) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfFood)), _fieldLayout);
  }

  /**
   * @notice Set numOfFood.
   */
  function _setNumOfFood(address owner, uint256 gameID, uint256 numOfFood) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfFood)), _fieldLayout);
  }

  /**
   * @notice Get numOfWood.
   */
  function getNumOfWood(address owner, uint256 gameID) internal view returns (uint256 numOfWood) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfWood.
   */
  function _getNumOfWood(address owner, uint256 gameID) internal view returns (uint256 numOfWood) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set numOfWood.
   */
  function setNumOfWood(address owner, uint256 gameID, uint256 numOfWood) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((numOfWood)), _fieldLayout);
  }

  /**
   * @notice Set numOfWood.
   */
  function _setNumOfWood(address owner, uint256 gameID, uint256 numOfWood) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((numOfWood)), _fieldLayout);
  }

  /**
   * @notice Get numOfGold.
   */
  function getNumOfGold(address owner, uint256 gameID) internal view returns (uint256 numOfGold) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfGold.
   */
  function _getNumOfGold(address owner, uint256 gameID) internal view returns (uint256 numOfGold) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set numOfGold.
   */
  function setNumOfGold(address owner, uint256 gameID, uint256 numOfGold) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((numOfGold)), _fieldLayout);
  }

  /**
   * @notice Set numOfGold.
   */
  function _setNumOfGold(address owner, uint256 gameID, uint256 numOfGold) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((numOfGold)), _fieldLayout);
  }

  /**
   * @notice Get the full data.
   */
  function get(address owner, uint256 gameID) internal view returns (ResourceOwnData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
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
  function _get(address owner, uint256 gameID) internal view returns (ResourceOwnData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
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
  function set(address owner, uint256 gameID, uint256 numOfFood, uint256 numOfWood, uint256 numOfGold) internal {
    bytes memory _staticData = encodeStatic(numOfFood, numOfWood, numOfGold);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(address owner, uint256 gameID, uint256 numOfFood, uint256 numOfWood, uint256 numOfGold) internal {
    bytes memory _staticData = encodeStatic(numOfFood, numOfWood, numOfGold);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(address owner, uint256 gameID, ResourceOwnData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.numOfFood, _table.numOfWood, _table.numOfGold);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(address owner, uint256 gameID, ResourceOwnData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.numOfFood, _table.numOfWood, _table.numOfGold);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(
    bytes memory _blob
  ) internal pure returns (uint256 numOfFood, uint256 numOfWood, uint256 numOfGold) {
    numOfFood = (uint256(Bytes.slice32(_blob, 0)));

    numOfWood = (uint256(Bytes.slice32(_blob, 32)));

    numOfGold = (uint256(Bytes.slice32(_blob, 64)));
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   * @param _staticData Tightly packed static fields.
   *
   *
   */
  function decode(
    bytes memory _staticData,
    PackedCounter,
    bytes memory
  ) internal pure returns (ResourceOwnData memory _table) {
    (_table.numOfFood, _table.numOfWood, _table.numOfGold) = decodeStatic(_staticData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(address owner, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(address owner, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(uint256 numOfFood, uint256 numOfWood, uint256 numOfGold) internal pure returns (bytes memory) {
    return abi.encodePacked(numOfFood, numOfWood, numOfGold);
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dyanmic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    uint256 numOfFood,
    uint256 numOfWood,
    uint256 numOfGold
  ) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData = encodeStatic(numOfFood, numOfWood, numOfGold);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(address owner, uint256 gameID) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](2);
    _keyTuple[0] = bytes32(uint256(uint160(owner)));
    _keyTuple[1] = bytes32(uint256(gameID));

    return _keyTuple;
  }
}
