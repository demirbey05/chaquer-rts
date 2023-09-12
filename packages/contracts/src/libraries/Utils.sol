//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { BattleResult, RemainingData, EntityType } from "./Types.sol";
import "./Libraries.sol";
import { AttackerType, ClashType } from "../codegen/Types.sol";
import { CastleOwnable, Position, ResourceOwnable, DockOwnable, ArmyConfig, ArmyOwnable, ClashResult, ColorOwnable, AddressToUsername } from "../codegen/Tables.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";

error ErrorInCalculatingBattleScores();

function findRemainings(BattleResult memory result) pure returns (RemainingData memory remainings) {
  if (result.swordsman > 0) {
    remainings.isSwordsman = 1;
    remainings.numRemaining++;
  }
  if (result.archer > 0) {
    remainings.isArcher = 1;
    remainings.numRemaining++;
  }
  if (result.cavalry > 0) {
    remainings.isCavalry = 1;
    remainings.numRemaining++;
  }
  return remainings;
}

function calculateScoreSingleRemaining(BattleResult memory scoreArray, RemainingData memory remainings)
  returns (int32 result)
{
  if (remainings.isSwordsman == 1) {
    result = (scoreArray.swordsman + 2 * scoreArray.cavalry + (scoreArray.archer / 2));
  }
  if (remainings.isArcher == 1) {
    result = (scoreArray.archer + 2 * scoreArray.swordsman + (scoreArray.cavalry / 2));
  }
  if (remainings.isCavalry == 1) {
    result = (scoreArray.cavalry + 2 * scoreArray.archer + (scoreArray.swordsman / 2));
  }
}

function calculateScoreDoubleRemaining(BattleResult memory scoreArray, RemainingData memory remainings)
  returns (int32 result)
{
  if (remainings.isSwordsman == 1) {
    result = remainings.isArcher == 1
      ? scoreArray.swordsman + 2 * scoreArray.cavalry
      : scoreArray.swordsman + (scoreArray.archer / 2);
  } else if (remainings.isArcher == 1) {
    result = remainings.isCavalry == 1
      ? scoreArray.archer + 2 * scoreArray.swordsman
      : scoreArray.archer + (scoreArray.cavalry / 2);
  } else if (remainings.isCavalry == 1) {
    result = remainings.isSwordsman == 1
      ? scoreArray.cavalry + 2 * scoreArray.archer
      : scoreArray.cavalry + (scoreArray.swordsman / 2);
  }

  if (result < 0) {
    if (remainings.isCavalry == 1) {
      result = remainings.isSwordsman == 1 ? scoreArray.cavalry + 2 * result : scoreArray.cavalry + (result / 2);
    } else if (remainings.isArcher == 1) {
      result = remainings.isCavalry == 1 ? scoreArray.archer + 2 * result : scoreArray.archer + (result / 2);
    } else if (remainings.isSwordsman == 1) {
      result = remainings.isArcher == 1 ? scoreArray.swordsman + 2 * result : scoreArray.swordsman + (result / 2);
    }
  } else {
    if (remainings.isCavalry == 1) {
      result = result + scoreArray.cavalry;
    } else if (remainings.isArcher == 1) {
      result = result + scoreArray.archer;
    } else if (remainings.isSwordsman == 1) {
      result = result + scoreArray.swordsman;
    }
  }
}

function calculateArmyScore(BattleResult memory battleResult, RemainingData memory remainings) returns (int32 result) {
  if (remainings.numRemaining == 1) {
    result = calculateScoreSingleRemaining(battleResult, remainings);
  } else if (remainings.numRemaining == 2) {
    result = calculateScoreDoubleRemaining(battleResult, remainings);
  } else if (remainings.numRemaining == 3) {
    result = battleResult.swordsman + battleResult.archer + battleResult.cavalry;
  } else {
    result = -100;
  }
}

library LibUtils {
  function findSurroundingArmies(
    IStore world,
    bytes32 entityID,
    uint256 gameID,
    EntityType entityType
  ) internal view returns (bytes32[] memory) {
    address owner = address(0);
    if (entityType == EntityType.Castle) {
      owner = CastleOwnable.getOwner(entityID);
    } else if (entityType == EntityType.Mine) {
      owner = ResourceOwnable.getOwner(entityID);
    } else if (entityType == EntityType.Dock) {
      owner = DockOwnable.getOwner(entityID);
    }

    bytes32[] memory allArmies = LibQueries.getOwnedArmyIDs(world, owner, gameID);
    bytes32[] memory ownerArmiesSurroundCastle = new bytes32[](allArmies.length);
    (uint32 xCastle, uint32 yCastle, ) = Position.get(entityID);
    uint current = 0;
    for (uint i = 0; i < allArmies.length; i++) {
      (uint32 xArmy, uint32 yArmy, ) = Position.get(allArmies[i]);
      if (LibMath.manhattan(xCastle, yCastle, xArmy, yArmy) <= 3) {
        ownerArmiesSurroundCastle[current] = allArmies[i];
        current++;
      }
    }
    return ownerArmiesSurroundCastle;
  }

  function deleteArmy(bytes32 armyID) internal {
    ArmyOwnable.deleteRecord(armyID);
    ArmyConfig.deleteRecord(armyID);
    Position.deleteRecord(armyID);
    ColorOwnable.deleteRecord(armyID);
  }

  function findSurroundingAttackerEntities(
    IStore world,
    bytes32 entityID,
    uint256 gameID,
    EntityType entityType,
    AttackerType attackerType
  ) internal view returns (bytes32[] memory) {
    address owner = address(0);
    if (entityType == EntityType.Castle) {
      owner = CastleOwnable.getOwner(entityID);
    } else if (entityType == EntityType.Mine) {
      owner = ResourceOwnable.getOwner(entityID);
    } else if (entityType == EntityType.Dock) {
      owner = DockOwnable.getOwner(entityID);
    }

    bytes32[] memory allEntities = (attackerType == AttackerType.Army)
      ? LibQueries.getOwnedArmyIDs(world, owner, gameID)
      : LibQueries.getOwnedFleetIDs(world, owner, gameID);
    bytes32[] memory attackersSurroundingEntity = new bytes32[](allEntities.length);
    (uint32 xEntity, uint32 yEntity, ) = Position.get(entityID);
    uint current = 0;
    for (uint i = 0; i < allEntities.length; i++) {
      (uint32 xAttacker, uint32 yAttacker, ) = Position.get(allEntities[i]);
      if (LibMath.manhattan(xEntity, yEntity, xAttacker, yAttacker) <= 3) {
        attackersSurroundingEntity[current] = allEntities[i];
        current++;
      }
    }
    return attackersSurroundingEntity;
  }

  function emitClashTableEvent(
    uint8 result,
    bytes32 attackerID,
    bytes32 mineID,
    uint256 gameID,
    address attackerOwner,
    address mineOwner,
    ClashType clashType
  ) internal {
    if (result == 0) {
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, attackerID, mineID, gameID)),
        attackerOwner,
        mineOwner,
        true,
        clashType
      );
    } else if (result == 1) {
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, attackerID, mineID, gameID)),
        attackerOwner,
        mineOwner,
        false,
        clashType
      );
    } else if (result == 2) {
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, attackerID, mineID, gameID)),
        mineOwner,
        attackerOwner,
        false,
        clashType
      );
    }
  }

  function handleArmyAttack(
    bytes32 attackerID,
    bytes32 mineID,
    address attackerOwner,
    address mineOwner,
    bytes32[] memory ownerEntitiesSurrondMine,
    uint256 gameID
  ) internal {
    uint result = LibAttack.warCaptureCastle(attackerID, ownerEntitiesSurrondMine);

    if (result == 1) {
      ResourceOwnable.setOwner(mineID, attackerOwner);
      ColorOwnable.setColorIndex(mineID, AddressToUsername.getColorIndex(attackerOwner, gameID));

      // Destroy all the army which belongs to castle owner

      for (uint i = 0; i < ownerEntitiesSurrondMine.length; i++) {
        if (ownerEntitiesSurrondMine[i] == bytes32(0)) {
          continue;
        }
        LibUtils.deleteArmy(ownerEntitiesSurrondMine[i]);
      }
    }
    emitClashTableEvent(uint8(result), attackerID, mineID, gameID, attackerOwner, mineOwner, ClashType.Mine);
  }

  function handleFleetAttack(
    bytes32 attackerID,
    bytes32 mineID,
    address attackerOwner,
    address mineOwner,
    bytes32[] memory ownerEntitiesSurrondMine,
    uint256 gameID
  ) internal {
    uint8 result = LibNaval.fightFleetToFleetGroup(attackerID, ownerEntitiesSurrondMine, gameID);
    if (result == 1) {
      ResourceOwnable.setOwner(mineID, attackerOwner);
      ColorOwnable.setColorIndex(mineID, AddressToUsername.getColorIndex(attackerOwner, gameID));
    }
    emitClashTableEvent(result, attackerID, mineID, gameID, attackerOwner, mineOwner, ClashType.Mine);
  }

  function takeOwnershipOfMines(
    IStore world,
    address user,
    MineType mineType,
    uint256 gameID
  ) internal {
    bytes32[] memory castleOwnerMines = LibQueries.getMines(world, user, gameID, mineType);
    for (uint i = 0; i < castleOwnerMines.length; i++) {
      ResourceOwnable.setOwner(castleOwnerMines[i], address(0));
      ColorOwnable.setColorIndex(castleOwnerMines[i], 0);
    }
  }

  function takeOwnershipOfDocks(
    IStore world,
    address user,
    uint256 gameID,
    address getter
  ) internal {
    bytes32[] memory castleOwnerDocks = LibQueries.getDocks(world, user, gameID);
    for (uint i = 0; i < castleOwnerDocks.length; i++) {
      DockOwnable.setOwner(castleOwnerDocks[i], address(0));
      ColorOwnable.setColorIndex(castleOwnerDocks[i], 0);
    }
  }
}
