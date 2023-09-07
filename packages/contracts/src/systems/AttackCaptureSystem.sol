//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { ArmyOwnable, ClashResult, ArmyOwnable, Position, ArmyConfig, ArmyConfigData, CastleOwnable, ResourceOwnable, Players, NumberOfUsers, DockOwnable } from "../codegen/Tables.sol";
import { LibMath, LibAttack, BattleScore, LibUtils, LibQueries } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { MineType, ClashType } from "../codegen/Types.sol";

contract AttackCaptureSystem is System {
  function attackToArmy(
    bytes32 armyOne,
    bytes32 armyTwo,
    uint256 gameID
  ) public returns (uint256) {
    (address owner, uint256 gameIDArmy) = ArmyOwnable.get(armyOne);
    (address ownerTwo, uint256 gameIDArmyTwo) = ArmyOwnable.get(armyTwo);
    ArmyConfigData memory armyOneConfig = ArmyConfig.get(armyOne);
    ArmyConfigData memory armyTwoConfig = ArmyConfig.get(armyTwo);
    address sender = _msgSender();

    if ((owner != sender) || (gameIDArmy != gameID)) {
      revert AttackSystem__ArmyNotBelongYou();
    }
    if (ArmyOwnable.getOwner(armyTwo) == address(0)) {
      revert AttackSystem__NoArmy();
    }
    if (gameID != gameIDArmyTwo) {
      revert AttackSystem__WrongGameID();
    }

    if (LibMath.distanceBetween(armyOne, armyTwo) > 3) {
      revert AttackSystem__TooAwayToAttack();
    }
    if (owner == ownerTwo) {
      revert AttackSystem__NoFriendFire();
    }

    BattleScore memory battleScore = LibAttack.calculateBattleScores(armyOneConfig, armyTwoConfig);

    if (battleScore.scoreArmyOne > battleScore.scoreArmyTwo) {
      LibUtils.deleteArmy(armyTwo);

      ArmyConfigData memory newConfig = ArmyConfigData(
        armyOneConfig.numSwordsman >> 1,
        armyOneConfig.numArcher >> 1,
        armyOneConfig.numCavalry >> 1,
        gameID
      );
      ArmyConfig.set(armyOne, newConfig);

      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        owner,
        ownerTwo,
        false,
        ClashType.Battle
      );
      return 1;
    } else if (battleScore.scoreArmyOne < battleScore.scoreArmyTwo) {
      LibUtils.deleteArmy(armyOne);

      ArmyConfigData memory newConfig = ArmyConfigData(
        armyTwoConfig.numSwordsman >> 1,
        armyTwoConfig.numArcher >> 1,
        armyTwoConfig.numCavalry >> 1,
        gameID
      );
      ArmyConfig.set(armyTwo, newConfig);
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        ownerTwo,
        owner,
        false,
        ClashType.Battle
      );
      return 2;
    } else {
      LibUtils.deleteArmy(armyOne);
      LibUtils.deleteArmy(armyTwo);

      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        ownerTwo,
        owner,
        true,
        ClashType.Battle
      );
      return 0;
    }
  }

  function takeOwnershipOfMines(
    address user,
    MineType mineType,
    uint256 gameID
  ) internal {
    bytes32[] memory castleOwnerMines = LibQueries.getMines(IStore(_world()), user, gameID, mineType);
    for (uint i = 0; i < castleOwnerMines.length; i++) {
      ResourceOwnable.setOwner(castleOwnerMines[i], address(0));
    }
  }

  function takeOwnershipOfDocks(
    address user,
    uint256 gameID,
    address getter
  ) internal {
    bytes32[] memory castleOwnerDocks = LibQueries.getDocks(IStore(_world()), user, gameID);
    for (uint i = 0; i < castleOwnerDocks.length; i++) {
      DockOwnable.setOwner(castleOwnerDocks[i], address(0));
    }
  }

  function removeUser(address castleOwner, uint256 gameID) internal {
    bytes32[] memory castleOwnerArmies = LibQueries.getOwnedArmyIDs(IStore(_world()), castleOwner, gameID);

    for (uint i = 0; i < castleOwnerArmies.length; i++) {
      ArmyOwnable.deleteRecord(castleOwnerArmies[i]);
      ArmyConfig.deleteRecord(castleOwnerArmies[i]);
      Position.deleteRecord(castleOwnerArmies[i]);
    }
    takeOwnershipOfMines(castleOwner, MineType.Food, gameID);
    takeOwnershipOfMines(castleOwner, MineType.Wood, gameID);
    takeOwnershipOfMines(castleOwner, MineType.Gold, gameID);
    takeOwnershipOfDocks(castleOwner, gameID, castleOwner);
    NumberOfUsers.set(gameID, NumberOfUsers.get(gameID) - 1);
    Players.set(gameID, castleOwner, false);
  }

  function captureCastle(bytes32 armyID, bytes32 castleID) public returns (uint256 result) {
    address armyOwner = ArmyOwnable.getOwner(armyID);
    address castleOwner = CastleOwnable.getOwner(castleID);

    // Some Checks
    if (armyOwner == castleOwner) {
      revert CaptureSystem__FriendFireNotAllowed();
    }

    if (armyOwner != msg.sender) {
      revert CaptureSystem__NoAuthorization();
    }

    (uint32 xArmy, uint32 yArmy, uint256 gameID) = Position.get(armyID);
    (uint32 xCastle, uint32 yCastle, uint256 gameIDTwo) = Position.get(castleID);

    uint32 distanceBetween = LibMath.manhattan(xArmy, yArmy, xCastle, yCastle);

    if (!(distanceBetween <= 3)) {
      revert CaptureSystem__TooFarToAttack();
    }
    if (gameID != gameIDTwo) {
      revert CaptureSystem__NonMatchedGameID();
    }
    bytes32[] memory ownerArmiesSurroundCastle = LibUtils.findSurroundingArmies(
      IStore(_world()),
      castleID,
      gameID,
      EntityType.Castle
    );
    result = LibAttack.warCaptureCastle(armyID, ownerArmiesSurroundCastle);

    if (result == 1) {
      CastleOwnable.setOwner(castleID, armyOwner);

      // Destroy all the army which belongs to castle owner
      if (!LibQueries.queryAddressHasCastle(IStore(_world()), castleOwner, gameID)) {
        removeUser(castleOwner, gameID);
      }

      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, castleID, gameID)),
        armyOwner,
        castleOwner,
        false,
        ClashType.Castle
      );
    } else if (result == 0) {
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, castleID, gameID)),
        armyOwner,
        castleOwner,
        true,
        ClashType.Castle
      );
    } else {
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, castleID, gameID)),
        castleOwner,
        armyOwner,
        false,
        ClashType.Castle
      );
    }
  }
}
