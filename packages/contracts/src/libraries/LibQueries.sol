//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { PositionTableId, FleetOwnableTableId, FleetOwnable, DockOwnable, DockOwnableTableId, CastleOwnableTableId, Position, CastleOwnable, ArmyOwnableTableId, ArmyOwnable, ResourceOwnable, ResourceOwnableTableId } from "../codegen/Tables.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { MineType } from "../codegen/Types.sol";

library LibQueries {
  function queryPositionEntity(
    IStore world,
    uint32 x,
    uint32 y,
    uint256 gameID
  ) internal view returns (uint256) {
    bytes32[] memory entities = getKeysWithValue(world, PositionTableId, Position.encode(x, y, gameID));
    return entities.length;
  }

  function queryAddressHasCastle(
    IStore world,
    address ownerCandidate,
    uint256 gameID
  ) internal view returns (bool) {
    bytes32[] memory entities = getKeysWithValue(
      world,
      CastleOwnableTableId,
      CastleOwnable.encode(ownerCandidate, gameID)
    );
    return entities.length > 0;
  }

  function getOwnedCastleIDs(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (bytes32[] memory) {
    bytes32[] memory entities = getKeysWithValue(world, CastleOwnableTableId, CastleOwnable.encode(owner, gameID));
    return entities;
  }

  function queryGetArmyNumber(
    IStore world,
    address ownerCandidate,
    uint256 gameID
  ) internal view returns (uint256) {
    bytes32[] memory entities = getKeysWithValue(world, ArmyOwnableTableId, ArmyOwnable.encode(ownerCandidate, gameID));
    return entities.length;
  }

  function getOwnedArmyIDs(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (bytes32[] memory) {
    bytes32[] memory entities = getKeysWithValue(world, ArmyOwnableTableId, ArmyOwnable.encode(owner, gameID));
    return entities;
  }

  function getMines(
    IStore world,
    address owner,
    uint256 gameID,
    MineType mineType
  ) internal view returns (bytes32[] memory) {
    bytes32[] memory entities = getKeysWithValue(
      world,
      ResourceOwnableTableId,
      ResourceOwnable.encode(mineType, owner, gameID)
    );
    return entities;
  }

  function getDocksLength(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (uint256) {
    bytes32[] memory entities = getKeysWithValue(world, DockOwnableTableId, DockOwnable.encode(owner, gameID));
    return entities.length;
  }

  function getFleetNumber(
    IStore world,
    address owner,
    uint256 gameID
  ) internal view returns (uint256) {
    bytes32[] memory entities = getKeysWithValue(world, FleetOwnableTableId, FleetOwnable.encode(owner, gameID));
    return entities.length;
  }
}
