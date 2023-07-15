// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, Position, PositionTableId, CastleOwnable, ArmyOwnable, ArmyConfig, ArmyConfigData, LimitOfGame } from "../codegen/Tables.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibMath } from "../libraries/LibMath.sol";
import "./Errors.sol";

contract MapSystem is System {
  uint256 constant capacityLowerBound = 10;

  function initMapData(
    uint256 gameID,
    uint32 width,
    uint32 height,
    bytes calldata terrain
  ) public {
    (, , bytes memory terrainData) = MapConfig.get(gameID);

    if ((width < 10 && height < 10) || (width > 60 && height > 60)) {
      revert InitSystem__NotEnoughDimension();
    }
    if (terrainData.length > 0) {
      revert InitSystem__AlreadyInitialized();
    }
    if (width * height != terrain.length) {
      revert InitSystem__MismatchedSize();
    }
    MapConfig.set(gameID, width, height, terrain);
  }

  function InitNumberOfGamer(uint256 gameID, uint256 capacity) public {
    (, , bytes memory terrainData) = MapConfig.get(gameID);
    uint256 prevCapacity = LimitOfGame.get(gameID);

    if (terrainData.length <= 0) {
      revert InitSystem__NotInitialized();
    }
    if (prevCapacity > 0) {
      revert InitSystem__CapacityAlreadyInitialized();
    }
    if (capacity < capacityLowerBound) {
      revert InitSystem__CapacityIsTooLow();
    }
    LimitOfGame.set(gameID, capacity);
  }

  function settleCastle(
    uint32 x,
    uint32 y,
    uint256 gameID
  ) public returns (bytes32) {
    // Get control parameters
    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(gameID);
    uint32 height = MapConfig.getHeight(gameID);
    uint256 terrainLength = MapConfig.lengthTerrain(gameID);

    if ((terrainLength < 100) || (terrainLength > 3600)) {
      revert CastleSettle__MapIsNotReady();
    }
    // x and y axis is exchanged because of frontend issues
    if (!(x < height && y < width && x >= 0 && y >= 0)) {
      revert CastleSettle__CoordinatesOutOfBound();
    }

    // If there is any entity in that position
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
      revert CastleSettle__TileIsNotEmpty();
    }

    // Terrain type should be land
    if (MapConfig.getItemTerrain(gameID, x * width + y)[0] != hex"01") {
      revert CastleSettle__WrongTerrainType();
    }

    if (LibQueries.queryAddressHasCastle(IStore(_world()), ownerCandidate, gameID)) {
      revert CastleSettle__NoCastleRight();
    }

    bytes32 entityID = keccak256(abi.encodePacked(x, y, "Castle", ownerCandidate, gameID));

    Position.set(entityID, x, y, gameID);
    CastleOwnable.set(entityID, ownerCandidate, gameID);

    return entityID;
  }

  function settleArmy(
    uint32 x,
    uint32 y,
    ArmyConfigData calldata config
  ) public returns (bytes32) {
    // Get control parameters

    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(IStore(_world()), config.gameID);
    uint32 height = MapConfig.getHeight(IStore(_world()), config.gameID);

    if (!(x < height && y < width && x >= 0 && y >= 0)) {
      revert ArmySettle__CoordinatesOutOfBound();
    }
    if (MapConfig.getItemTerrain(config.gameID, x * width + y)[0] != hex"01") {
      revert ArmySettle__WrongTerrainType();
    }
    // If there is an another entity at that coordinate
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, config.gameID) > 0) {
      revert ArmySettle__TileIsNotEmpty();
    }
    // You can have three army
    if (LibQueries.queryGetArmyNumber(IStore(_world()), ownerCandidate, config.gameID) >= 3) {
      revert ArmySettle__NoArmyRight();
    }
    if (!LibQueries.queryAddressHasCastle(IStore(_world()), ownerCandidate, config.gameID)) {
      revert ArmySettle__NoCastle();
    }

    bytes32[] memory castleIds = LibQueries.getOwnedCastleIDs(IStore(_world()), ownerCandidate, config.gameID);
    uint256 castleClose = 0;
    for (uint i = 0; i < castleIds.length; i++) {
      (uint32 x_castle, uint32 y_castle, ) = Position.get(castleIds[i]);
      uint32 distanceBetween = LibMath.manhattan(x_castle, y_castle, x, y);
      if (distanceBetween <= 3) {
        castleClose = 1;
      }
    }
    if (castleClose == 0) {
      revert ArmySettle__TooFarToSettle();
    }

    if (config.numArcher + config.numCavalry + config.numSwordsman > 100) {
      revert ArmySettle__TooManySoldier();
    }

    bytes32 entityID = keccak256(abi.encodePacked(x, y, "Army", ownerCandidate, config.gameID));

    Position.set(entityID, x, y, config.gameID);
    ArmyOwnable.set(entityID, ownerCandidate, config.gameID);
    ArmyConfig.set(entityID, config.numSwordsman, config.numArcher, config.numCavalry, config.gameID);

    return entityID;
  }

  function armyMove(
    bytes32 armyID,
    uint32 x,
    uint32 y,
    uint256 gameID
  ) public {
    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(IStore(_world()), gameID);
    (address armyOwner, uint256 gameIDArmy) = ArmyOwnable.get(armyID);
    (uint32 xArmy, uint32 yArmy, ) = Position.get(armyID);

    if ((armyOwner != ownerCandidate) || (gameIDArmy != gameID)) {
      revert MoveArmy__NoAuthorized();
    }
    if (MapConfig.getItemTerrain(gameID, x * width + y)[0] != hex"01") {
      revert MoveArmy__WrongTerrainType();
    }
    if (LibMath.manhattan(x, y, xArmy, yArmy) > 3) {
      revert MoveArmy__TooFar();
    }
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
      revert MoveArmy__TileIsNotEmpty();
    }
    Position.set(armyID, x, y, gameID);
  }
}
