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

library SoldierCreated {
  // Hex below is the result of `WorldResourceIdLib.encode({ namespace: "", name: "SoldierCreated", typeId: RESOURCE_TABLE });`
  ResourceId constant _tableId = ResourceId.wrap(0x74620000000000000000000000000000536f6c64696572437265617465640000);

  FieldLayout constant _fieldLayout =
    FieldLayout.wrap(0x0060030020202000000000000000000000000000000000000000000000000000);

  // Hex-encoded key schema of (uint256)
  Schema constant _keySchema = Schema.wrap(0x002001001f000000000000000000000000000000000000000000000000000000);
  // Hex-encoded value schema of (uint256, uint256, uint256)
  Schema constant _valueSchema = Schema.wrap(0x006003001f1f1f00000000000000000000000000000000000000000000000000);

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "gameID";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](3);
    fieldNames[0] = "numOfSwordsman";
    fieldNames[1] = "numOfArcher";
    fieldNames[2] = "numOfCavalry";
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
   * @notice Get numOfSwordsman.
   */
  function getNumOfSwordsman(uint256 gameID) internal view returns (uint256 numOfSwordsman) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfSwordsman.
   */
  function _getNumOfSwordsman(uint256 gameID) internal view returns (uint256 numOfSwordsman) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 0, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set numOfSwordsman.
   */
  function setNumOfSwordsman(uint256 gameID, uint256 numOfSwordsman) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfSwordsman)), _fieldLayout);
  }

  /**
   * @notice Set numOfSwordsman.
   */
  function _setNumOfSwordsman(uint256 gameID, uint256 numOfSwordsman) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 0, abi.encodePacked((numOfSwordsman)), _fieldLayout);
  }

  /**
   * @notice Get numOfArcher.
   */
  function getNumOfArcher(uint256 gameID) internal view returns (uint256 numOfArcher) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfArcher.
   */
  function _getNumOfArcher(uint256 gameID) internal view returns (uint256 numOfArcher) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 1, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set numOfArcher.
   */
  function setNumOfArcher(uint256 gameID, uint256 numOfArcher) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((numOfArcher)), _fieldLayout);
  }

  /**
   * @notice Set numOfArcher.
   */
  function _setNumOfArcher(uint256 gameID, uint256 numOfArcher) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 1, abi.encodePacked((numOfArcher)), _fieldLayout);
  }

  /**
   * @notice Get numOfCavalry.
   */
  function getNumOfCavalry(uint256 gameID) internal view returns (uint256 numOfCavalry) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes32 _blob = StoreSwitch.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Get numOfCavalry.
   */
  function _getNumOfCavalry(uint256 gameID) internal view returns (uint256 numOfCavalry) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes32 _blob = StoreCore.getStaticField(_tableId, _keyTuple, 2, _fieldLayout);
    return (uint256(bytes32(_blob)));
  }

  /**
   * @notice Set numOfCavalry.
   */
  function setNumOfCavalry(uint256 gameID, uint256 numOfCavalry) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((numOfCavalry)), _fieldLayout);
  }

  /**
   * @notice Set numOfCavalry.
   */
  function _setNumOfCavalry(uint256 gameID, uint256 numOfCavalry) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreCore.setStaticField(_tableId, _keyTuple, 2, abi.encodePacked((numOfCavalry)), _fieldLayout);
  }

  /**
   * @notice Get the full data.
   */
  function get(
    uint256 gameID
  ) internal view returns (uint256 numOfSwordsman, uint256 numOfArcher, uint256 numOfCavalry) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

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
  function _get(
    uint256 gameID
  ) internal view returns (uint256 numOfSwordsman, uint256 numOfArcher, uint256 numOfCavalry) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

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
  function set(uint256 gameID, uint256 numOfSwordsman, uint256 numOfArcher, uint256 numOfCavalry) internal {
    bytes memory _staticData = encodeStatic(numOfSwordsman, numOfArcher, numOfCavalry);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(uint256 gameID, uint256 numOfSwordsman, uint256 numOfArcher, uint256 numOfCavalry) internal {
    bytes memory _staticData = encodeStatic(numOfSwordsman, numOfArcher, numOfCavalry);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of static data using this table's field layout.
   */
  function decodeStatic(
    bytes memory _blob
  ) internal pure returns (uint256 numOfSwordsman, uint256 numOfArcher, uint256 numOfCavalry) {
    numOfSwordsman = (uint256(Bytes.getBytes32(_blob, 0)));

    numOfArcher = (uint256(Bytes.getBytes32(_blob, 32)));

    numOfCavalry = (uint256(Bytes.getBytes32(_blob, 64)));
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
  ) internal pure returns (uint256 numOfSwordsman, uint256 numOfArcher, uint256 numOfCavalry) {
    (numOfSwordsman, numOfArcher, numOfCavalry) = decodeStatic(_staticData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack static (fixed length) data using this table's schema.
   * @return The static data, encoded into a sequence of bytes.
   */
  function encodeStatic(
    uint256 numOfSwordsman,
    uint256 numOfArcher,
    uint256 numOfCavalry
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(numOfSwordsman, numOfArcher, numOfCavalry);
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dynamic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    uint256 numOfSwordsman,
    uint256 numOfArcher,
    uint256 numOfCavalry
  ) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData = encodeStatic(numOfSwordsman, numOfArcher, numOfCavalry);

    PackedCounter _encodedLengths;
    bytes memory _dynamicData;

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(uint256 gameID) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    return _keyTuple;
  }
}
