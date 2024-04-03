//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { query, QueryFragment, QueryType } from "@latticexyz/world-modules/src/modules/keysintable/query.sol";
import {Position,CastleOwnable,ArmyOwnable,ResourceOwnable,DockOwnable,FleetOwnable,FleetCarry,ArtilleryOwnable} from "../codegen/index.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { MineType } from "../codegen/common.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";

library LibQueries {
  function queryPositionEntity(
    IStore world,
    uint32 x,
    uint32 y,
    uint256 gameID
  ) internal view returns (uint256) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = Position.encode(x, y, gameID);
    bytes32[] memory entities = getKeysWithValue(world, Position._tableId, staticData, encodedLengths, dynamicDat);
    return entities.length;
  }

  function queryAddressHasCastle(
    IStore world,
    address ownerCandidate,
    uint256 gameID
  ) internal view returns (bool) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = CastleOwnable.encode(
      ownerCandidate,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, CastleOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities.length > 0;
  }

  function getOwnedCastleIDs(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (bytes32[] memory) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = CastleOwnable.encode(
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, CastleOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities;
  }

  function queryGetArmyNumber(
    IStore world,
    address ownerCandidate,
    uint256 gameID
  ) internal view returns (uint256) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = ArmyOwnable.encode(
      ownerCandidate,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, ArmyOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities.length;
  }

  function getOwnedArmyIDs(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (bytes32[] memory) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = ArmyOwnable.encode(
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, ArmyOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities;
  }

  function getMines(
    IStore world,
    address owner,
    uint256 gameID,
    MineType mineType
  ) internal view returns (bytes32[] memory) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = ResourceOwnable.encode(
      mineType,
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, ResourceOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities;
  }

  function getDocks(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (bytes32[] memory) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = DockOwnable.encode(
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, DockOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities;
  }

  function getDocksLength(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (uint256) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = DockOwnable.encode(
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, DockOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities.length;
  }

  function getFleetNumber(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (uint256) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = FleetOwnable.encode(
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, FleetOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities.length;
  }

  function getOwnedFleetIDs(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (bytes32[] memory) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = FleetOwnable.encode(
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, FleetOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities;
  }

  function queryNumCarriedArmyIDs(IStore world,bytes32 fleetID,uint256 gameID) internal view returns (uint256) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = FleetCarry.encode(
      fleetID,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, FleetCarry._tableId, staticData, encodedLengths, dynamicDat);
    return entities.length;
  }
  function queryCarriedArmyIDs(IStore world,bytes32 fleetID,uint256 gameID) internal view returns (bytes32[] memory) {
    (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = FleetCarry.encode(
      fleetID,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, FleetCarry._tableId, staticData, encodedLengths, dynamicDat);
    return entities;
  }

  function queryNumArtillery(IStore world,address owner,uint256 gameID) internal view returns(uint256) {
     (bytes memory staticData, PackedCounter encodedLengths, bytes memory dynamicDat) = ArtilleryOwnable.encode(
      owner,
      gameID
    );
    bytes32[] memory entities = getKeysWithValue(world, ArtilleryOwnable._tableId, staticData, encodedLengths, dynamicDat);
    return entities.length;

  }
}
