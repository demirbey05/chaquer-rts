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
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

// Import user types
import { State } from "./../Types.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("GameMetaData")));
bytes32 constant GameMetaDataTableId = _tableId;

struct GameMetaDataData {
  State state;
  uint256 startBlock;
  address winner;
  uint256 numberOfCastle;
}

library GameMetaData {
  /** Get the table's key schema */
  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.UINT256;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's value schema */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](4);
    _schema[0] = SchemaType.UINT8;
    _schema[1] = SchemaType.UINT256;
    _schema[2] = SchemaType.ADDRESS;
    _schema[3] = SchemaType.UINT256;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's key names */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "gameID";
  }

  /** Get the table's field names */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](4);
    fieldNames[0] = "state";
    fieldNames[1] = "startBlock";
    fieldNames[2] = "winner";
    fieldNames[3] = "numberOfCastle";
  }

  /** Register the table's key schema, value schema, key names and value names */
  function register() internal {
    StoreSwitch.registerTable(_tableId, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /** Register the table's key schema, value schema, key names and value names (using the specified store) */
  function register(IStore _store) internal {
    _store.registerTable(_tableId, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /** Get state */
  function getState(uint256 gameID) internal view returns (State state) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0, getValueSchema());
    return State(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Get state (using the specified store) */
  function getState(IStore _store, uint256 gameID) internal view returns (State state) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0, getValueSchema());
    return State(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Set state */
  function setState(uint256 gameID, State state) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked(uint8(state)), getValueSchema());
  }

  /** Set state (using the specified store) */
  function setState(IStore _store, uint256 gameID, State state) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked(uint8(state)), getValueSchema());
  }

  /** Get startBlock */
  function getStartBlock(uint256 gameID) internal view returns (uint256 startBlock) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1, getValueSchema());
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get startBlock (using the specified store) */
  function getStartBlock(IStore _store, uint256 gameID) internal view returns (uint256 startBlock) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1, getValueSchema());
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set startBlock */
  function setStartBlock(uint256 gameID, uint256 startBlock) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((startBlock)), getValueSchema());
  }

  /** Set startBlock (using the specified store) */
  function setStartBlock(IStore _store, uint256 gameID, uint256 startBlock) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((startBlock)), getValueSchema());
  }

  /** Get winner */
  function getWinner(uint256 gameID) internal view returns (address winner) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2, getValueSchema());
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Get winner (using the specified store) */
  function getWinner(IStore _store, uint256 gameID) internal view returns (address winner) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2, getValueSchema());
    return (address(Bytes.slice20(_blob, 0)));
  }

  /** Set winner */
  function setWinner(uint256 gameID, address winner) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((winner)), getValueSchema());
  }

  /** Set winner (using the specified store) */
  function setWinner(IStore _store, uint256 gameID, address winner) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((winner)), getValueSchema());
  }

  /** Get numberOfCastle */
  function getNumberOfCastle(uint256 gameID) internal view returns (uint256 numberOfCastle) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 3, getValueSchema());
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get numberOfCastle (using the specified store) */
  function getNumberOfCastle(IStore _store, uint256 gameID) internal view returns (uint256 numberOfCastle) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 3, getValueSchema());
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set numberOfCastle */
  function setNumberOfCastle(uint256 gameID, uint256 numberOfCastle) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setField(_tableId, _keyTuple, 3, abi.encodePacked((numberOfCastle)), getValueSchema());
  }

  /** Set numberOfCastle (using the specified store) */
  function setNumberOfCastle(IStore _store, uint256 gameID, uint256 numberOfCastle) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    _store.setField(_tableId, _keyTuple, 3, abi.encodePacked((numberOfCastle)), getValueSchema());
  }

  /** Get the full data */
  function get(uint256 gameID) internal view returns (GameMetaDataData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getValueSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, uint256 gameID) internal view returns (GameMetaDataData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getValueSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(uint256 gameID, State state, uint256 startBlock, address winner, uint256 numberOfCastle) internal {
    bytes memory _data = encode(state, startBlock, winner, numberOfCastle);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data, getValueSchema());
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    uint256 gameID,
    State state,
    uint256 startBlock,
    address winner,
    uint256 numberOfCastle
  ) internal {
    bytes memory _data = encode(state, startBlock, winner, numberOfCastle);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    _store.setRecord(_tableId, _keyTuple, _data, getValueSchema());
  }

  /** Set the full data using the data struct */
  function set(uint256 gameID, GameMetaDataData memory _table) internal {
    set(gameID, _table.state, _table.startBlock, _table.winner, _table.numberOfCastle);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, uint256 gameID, GameMetaDataData memory _table) internal {
    set(_store, gameID, _table.state, _table.startBlock, _table.winner, _table.numberOfCastle);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (GameMetaDataData memory _table) {
    _table.state = State(uint8(Bytes.slice1(_blob, 0)));

    _table.startBlock = (uint256(Bytes.slice32(_blob, 1)));

    _table.winner = (address(Bytes.slice20(_blob, 33)));

    _table.numberOfCastle = (uint256(Bytes.slice32(_blob, 53)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(
    State state,
    uint256 startBlock,
    address winner,
    uint256 numberOfCastle
  ) internal pure returns (bytes memory) {
    return abi.encodePacked(state, startBlock, winner, numberOfCastle);
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(uint256 gameID) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    return _keyTuple;
  }

  /* Delete all data for given keys */
  function deleteRecord(uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    StoreSwitch.deleteRecord(_tableId, _keyTuple, getValueSchema());
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, uint256 gameID) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(gameID));

    _store.deleteRecord(_tableId, _keyTuple, getValueSchema());
  }
}
