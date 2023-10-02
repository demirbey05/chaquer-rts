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
  bytes32(abi.encodePacked(RESOURCE_TABLE, bytes14(""), bytes16("NumberOfUsers")))
);
ResourceId constant NumberOfUsersTableId = _tableId;

FieldLayout constant _fieldLayout = FieldLayout.wrap(
  0x0020010020000000000000000000000000000000000000000000000000000000
);

library NumberOfUsers {
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
    SchemaType[] memory _keySchema = new SchemaType[](1);
    _keySchema[0] = SchemaType.UINT256;

    return SchemaLib.encode(_keySchema);
  }

  /**
   * @notice Get the table's value schema.
   * @return _valueSchema The value schema for the table.
   */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _valueSchema = new SchemaType[](1);
    _valueSchema[0] = SchemaType.UINT256;

    return SchemaLib.encode(_valueSchema);
  }

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "gameId";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](1);
    fieldNames[0] = "numOfUsers";
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
   * @notice Register the table with its config (using the specified store).
   */
  function register(IStore _store) internal {
    _store.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Get numOfUsers.
   */
  function getNumOfUsers(uint256 gameId) internal view returns (uint256 numOfUsers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfUsers.
   */
  function _getNumOfUsers(uint256 gameId) internal view returns (uint256 numOfUsers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfUsers (using the specified store).
   */
  function getNumOfUsers(IStore _store, uint256 gameId) internal view returns (uint256 numOfUsers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    bytes32 _blob = _store.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfUsers.
   */
  function get(uint256 gameId) internal view returns (uint256 numOfUsers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfUsers.
   */
  function _get(uint256 gameId) internal view returns (uint256 numOfUsers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfUsers (using the specified store).
   */
  function get(IStore _store, uint256 gameId) internal view returns (uint256 numOfUsers) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    bytes32 _blob = _store.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set numOfUsers.
   */
  function setNumOfUsers(uint256 gameId, uint256 numOfUsers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfUsers)), _fieldLayout);
  }

  /**
   * @notice Set numOfUsers.
   */
  function _setNumOfUsers(uint256 gameId, uint256 numOfUsers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfUsers)), _fieldLayout);
  }

  /**
   * @notice Set numOfUsers (using the specified store).
   */
  function setNumOfUsers(IStore _store, uint256 gameId, uint256 numOfUsers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    _store.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfUsers)), _fieldLayout);
  }

  /**
   * @notice Set numOfUsers.
   */
  function set(uint256 gameId, uint256 numOfUsers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfUsers)), _fieldLayout);
  }

  /**
   * @notice Set numOfUsers.
   */
  function _set(uint256 gameId, uint256 numOfUsers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfUsers)), _fieldLayout);
  }

  /**
   * @notice Set numOfUsers (using the specified store).
   */
  function set(IStore _store, uint256 gameId, uint256 numOfUsers) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    _store.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfUsers)), _fieldLayout);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(uint256 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(uint256 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Delete all data for given keys (using the specified store).
   */
  function deleteRecord(IStore _store, uint256 gameId) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    _store.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(uint256 numOfUsers) internal pure returns (bytes memory) {
    return abi.encodePacked(numOfUsers);
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dyanmic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(uint256 numOfUsers) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData = encodeStatic(numOfUsers);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(uint256 gameId) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameId));

    return _keyTuple;
  }
}
