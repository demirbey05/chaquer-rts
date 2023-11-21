// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { wadMul, toWadUnsafe } from "solmate/src/utils/SignedWadMath.sol";
import { MapConfig, Position, ResourceOwn, ResourceOwnData, ColorOwnable, AddressToColorIndex, CastleOwnable, ArmyOwnable, ArmyConfig, ArmyConfigData, Players, GameMetaData } from "../codegen/index.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { LibMath } from "../libraries/LibMath.sol";
import { LibVRGDA } from "../libraries/LibVRGDA.sol";
import { LibUtils } from "../libraries/Utils.sol";
import { State } from "../codegen/common.sol";
import { maxArmyNum, armyMoveFoodCost, armyMoveGoldCost } from "./Constants.sol";
import "./Errors.sol";
import { SystemSwitch } from "@latticexyz/world-modules/src/utils/SystemSwitch.sol";
import { IWorld } from "../codegen/world/IWorld.sol";


error MoveArmy__UnsufficientFood();
error MoveArmy__UnsufficientGold();

contract MapSystem is System {
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
    uint256 numOfCastle = GameMetaData.getNumberOfCastle(gameID);

    if ((terrainLength < 100) || (terrainLength > 3600)) {
      revert CastleSettle__MapIsNotReady();
    }
    if (!Players.get(gameID, ownerCandidate)) {
      revert CastleSettle__NotPlayer();
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

    bytes32 entityID = keccak256(abi.encodePacked(x, y, "Castle", ownerCandidate, gameID, block.timestamp));

    Position.set(entityID, x, y, gameID);
    CastleOwnable.set(entityID, ownerCandidate, gameID);
    GameMetaData.setNumberOfCastle(gameID, numOfCastle + 1);
    ColorOwnable.set(entityID, AddressToColorIndex.getColorIndex(ownerCandidate, gameID), gameID);
    if (numOfCastle + 1 == GameMetaData.getLimitOfPlayer(gameID)) {
      SystemSwitch.call(abi.encodeCall(IWorld(_world()).resourceSystemInit, (gameID)));
    }

    return entityID;
  }

  function settleArmy(
    uint32 x,
    uint32 y,
    ArmyConfigData calldata config,
    bytes32 castleID
  ) public returns (bytes32) {
    // Get control parameters

    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(config.gameID);
    uint32 height = MapConfig.getHeight(config.gameID);

    if (MapConfig.getItemTerrain(config.gameID, x * width + y)[0] != hex"01") {
      revert ArmySettle__WrongTerrainType();
    }
    // If there is an another entity at that coordinate
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, config.gameID) > 0) {
      revert ArmySettle__TileIsNotEmpty();
    }
    // You can have five + conquered castles army
    if (
      LibQueries.queryGetArmyNumber(IStore(_world()), ownerCandidate, config.gameID) >=
      maxArmyNum + LibQueries.getOwnedCastleIDs(IStore(_world()), ownerCandidate, config.gameID).length - 1
    ) {
      revert ArmySettle__NoArmyRight();
    }
    if (CastleOwnable.getOwner(castleID) != ownerCandidate) {
      revert ArmySettle__NoCastle();
    }
    if (GameMetaData.getState(config.gameID) != State.Started) {
      revert ArmySettle__WrongState();
    }
    {
      (uint32 x_castle, uint32 y_castle, ) = Position.get(castleID);
      uint32 distanceBetween = LibMath.manhattan(x_castle, y_castle, x, y);
      if (distanceBetween > 3) {
        revert ArmySettle__TooFarToSettle();
      }
    }
    if (config.numArcher + config.numCavalry + config.numSwordsman > 500) {
      revert ArmySettle__TooManySoldier();
    }
    // Economy System Integration
    LibUtils.handleEconomyCheck(IWorld(_world()), ownerCandidate, config);

    bytes32 entityID = keccak256(abi.encodePacked(x, y, "Army", ownerCandidate, config.gameID, block.timestamp));

    Position.set(entityID, x, y, config.gameID);
    ArmyOwnable.set(entityID, ownerCandidate, config.gameID);
    ArmyConfig.set(entityID, config.numSwordsman, config.numArcher, config.numCavalry, config.gameID);
    ColorOwnable.set(entityID, AddressToColorIndex.getColorIndex(ownerCandidate, config.gameID), config.gameID);

    return entityID;
  }

  function armyMove(
    bytes32 armyID,
    uint32 x,
    uint32 y,
    uint256 gameID
  ) public {
    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(gameID);
    SystemSwitch.call(abi.encodeCall(IWorld(_world()).collectResource, (gameID)));
    (address armyOwner, uint256 gameIDArmy) = ArmyOwnable.get(armyID);
    (uint32 xArmy, uint32 yArmy, ) = Position.get(armyID);
    ResourceOwnData memory resourcesOfUser = ResourceOwn.get(ownerCandidate, gameID);
    if (resourcesOfUser.numOfFood < armyMoveFoodCost) {
      revert MoveArmy__UnsufficientFood();
    }
    if (resourcesOfUser.numOfGold < armyMoveGoldCost) {
      revert MoveArmy__UnsufficientGold();
    }

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
    ResourceOwn.setNumOfFood(ownerCandidate, gameID, resourcesOfUser.numOfFood - armyMoveFoodCost);
    ResourceOwn.setNumOfGold(ownerCandidate, gameID, resourcesOfUser.numOfGold - armyMoveGoldCost);
  }

  function claimWinner(address winnerCandidate, uint256 gameID) public {
    if (!Players.get(gameID, winnerCandidate)) {
      revert GameSystem__NotPlayer();
    }
    if (GameMetaData.getNumberOfPlayer(gameID) != 1) {
      revert GameSystem__WrongClaim();
    }
    if (GameMetaData.getState(gameID) != State.Started) {
      revert GameSystem__WrongState();
    }
    GameMetaData.setWinner(gameID, winnerCandidate);
    GameMetaData.setState(gameID, State.Completed);
  }
}
