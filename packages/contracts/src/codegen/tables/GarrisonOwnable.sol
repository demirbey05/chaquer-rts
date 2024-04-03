// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { FieldLayout } from "@latticexyz/store/src/FieldLayout.sol";
import { Schema } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";

struct GarrisonOwnableData {
  uint32 numSwordsman;
  uint32 numArcher;
  uint32 numCavalry;
  uint256 gameID;
}

library GarrisonOwnable {
  // Hex below is the result of `WorldResourceIdLib.encode({ namespace: "", name: "GarrisonOwnable", typeId: RESOURCE_TABLE });`
  ResourceId constant _tableId = ResourceId.wrap(0x746200000000000000000000000000004761727269736f6e4f776e61626c6500);

  FieldLayout constant _fieldLayout =
    FieldLayout.wrap(0x002c040004040420000000000000000000000000000000000000000000000000);

  // Hex-encoded key schema of (bytes32)
  Schema constant _keySchema = Schema.wrap(0x002001005f000000000000000000000000000000000000000000000000000000);
  // Hex-encoded value schema of (uint32, uint32, uint32, uint256)
  Schema constant _valueSchema = Schema.wrap(0x002c04000303031f000000000000000000000000000000000000000000000000);

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "key";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](4);
    fieldNames[0] = "numSwordsman";
    fieldNames[1] = "numArcher";
    fieldNames[2] = "numCavalry";
    fieldNames[3] = "gameID";
  }

  /**
   * @notice Register the table with its config.
   */
  function register() internal {
    StoreSwitch.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config.
   */
  function _register() internal {
    StoreCore.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Get numSwordsman.
   */
  function getNumSwordsman(bytes32 key) internal view returns (uint32 numSwordsman) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Get numSwordsman.
   */
  function _getNumSwordsman(bytes32 key) internal view returns (uint32 numSwordsman) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Set numSwordsman.
   */
  function setNumSwordsman(bytes32 key, uint32 numSwordsman) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numSwordsman)), _fieldLayout);
  }

  /**
   * @notice Set numSwordsman.
   */
  function _setNumSwordsman(bytes32 key, uint32 numSwordsman) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numSwordsman)), _fieldLayout);
  }

  /**
   * @notice Get numArcher.
   */
  function getNumArcher(bytes32 key) internal view returns (uint32 numArcher) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Get numArcher.
   */
  function _getNumArcher(bytes32 key) internal view returns (uint32 numArcher) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Set numArcher.
   */
  function setNumArcher(bytes32 key, uint32 numArcher) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((numArcher)), _fieldLayout);
  }

  /**
   * @notice Set numArcher.
   */
  function _setNumArcher(bytes32 key, uint32 numArcher) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((numArcher)), _fieldLayout);
  }

  /**
   * @notice Get numCavalry.
   */
  function getNumCavalry(bytes32 key) internal view returns (uint32 numCavalry) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Get numCavalry.
   */
  function _getNumCavalry(bytes32 key) internal view returns (uint32 numCavalry) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint32(bytes4(_blob)));
  }

  /**
   * @notice Set numCavalry.
   */
  function setNumCavalry(bytes32 key, uint32 numCavalry) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((numCavalry)), _fieldLayout);
  }

  /**
   * @notice Set numCavalry.
   */
  function _setNumCavalry(bytes32 key, uint32 numCavalry) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((numCavalry)), _fieldLayout);
  }

  /**
   * @notice Get gameID.
   */
  function getGameID(bytes32 key) internal view returns (uint256 gameID) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get gameID.
   */
  function _getGameID(bytes32 key) internal view returns (uint256 gameID) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 3, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set gameID.
   */
  function setGameID(bytes32 key, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((gameID)), _fieldLayout);
  }

  /**
   * @notice Set gameID.
   */
  function _setGameID(bytes32 key, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setStaticField(_tableId, _keyTuple, 3, abi.encodePacked((gameID)), _fieldLayout);
  }

  /**
   * @notice Get the full data.
   */
  function get(bytes32 key) internal view returns (GarrisonOwnableData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

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
  function _get(bytes32 key) internal view returns (GarrisonOwnableData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

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
  function set(bytes32 key, uint32 numSwordsman, uint32 numArcher, uint32 numCavalry, uint256 gameID) internal {
    bytes memory _staticData = encodeStatic(numSwordsman, numArcher, numCavalry, gameID);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(bytes32 key, uint32 numSwordsman, uint32 numArcher, uint32 numCavalry, uint256 gameID) internal {
    bytes memory _staticData = encodeStatic(numSwordsman, numArcher, numCavalry, gameID);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(bytes32 key, GarrisonOwnableData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.numSwordsman, _table.numArcher, _table.numCavalry, _table.gameID);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(bytes32 key, GarrisonOwnableData memory _table) internal {
    bytes memory _staticData = encodeStatic(_table.numSwordsman, _table.numArcher, _table.numCavalry, _table.gameID);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(
    bytes memory _blob
  ) internal pure returns (uint32 numSwordsman, uint32 numArcher, uint32 numCavalry, uint256 gameID) {
    numSwordsman = (uint32(Bytes.getBytes4(_blob, 0)));

    numArcher = (uint32(Bytes.getBytes4(_blob, 4)));

    numCavalry = (uint32(Bytes.getBytes4(_blob, 8)));

    gameID = (uint256(Bytes.getBytes32(_blob, 12)));
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
  ) internal pure returns (GarrisonOwnableData memory _table) {
    (_table.numSwordsman, _table.numArcher, _table.numCavalry, _table.gameID) = decodeStatic(_staticData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(
    uint32 numSwordsman,
    uint32 numArcher,
    uint32 numCavalry,
    uint256 gameID
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(numSwordsman, numArcher, numCavalry, gameID);
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dynamic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    uint32 numSwordsman,
    uint32 numArcher,
    uint32 numCavalry,
    uint256 gameID
  ) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData = encodeStatic(numSwordsman, numArcher, numCavalry, gameID);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(bytes32 key) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    return _keyTuple;
  }
}