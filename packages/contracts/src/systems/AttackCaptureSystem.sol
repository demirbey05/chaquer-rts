//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { ArmyOwnable, BattleResult, ArmyOwnable, Position, ArmyConfig, ArmyConfigData, CastleOwnable, CastleSiegeResult, ResourceOwnable } from "../codegen/Tables.sol";
import { LibMath, LibAttack, BattleScore, LibUtils, LibQueries } from "../libraries/Libraries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { MineType } from "../codegen/Types.sol";

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
      ArmyConfig.deleteRecord(armyTwo);
      ArmyOwnable.deleteRecord(armyTwo);
      Position.deleteRecord(armyTwo);

      ArmyConfigData memory newConfig = ArmyConfigData(
        armyOneConfig.numSwordsman >> 1,
        armyOneConfig.numArcher >> 1,
        armyOneConfig.numCavalry >> 1,
        gameID
      );
      ArmyConfig.set(armyOne, newConfig);

      BattleResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        owner,
        ownerTwo,
        false
      );
      return 1;
    } else if (battleScore.scoreArmyOne < battleScore.scoreArmyTwo) {
      ArmyConfig.deleteRecord(armyOne);
      ArmyOwnable.deleteRecord(armyOne);
      Position.deleteRecord(armyOne);

      ArmyConfigData memory newConfig = ArmyConfigData(
        armyTwoConfig.numSwordsman >> 1,
        armyTwoConfig.numArcher >> 1,
        armyTwoConfig.numCavalry >> 1,
        gameID
      );
      ArmyConfig.set(armyTwo, newConfig);
      BattleResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        ownerTwo,
        owner,
        false
      );
      return 2;
    } else {
      ArmyConfig.deleteRecord(armyTwo);
      ArmyOwnable.deleteRecord(armyTwo);
      Position.deleteRecord(armyTwo);
      ArmyConfig.deleteRecord(armyOne);
      ArmyOwnable.deleteRecord(armyOne);
      Position.deleteRecord(armyOne);
      BattleResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        ownerTwo,
        owner,
        true
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
    bytes32[] memory ownerArmiesSurroundCastle = LibUtils.findSurroundingArmies(IStore(_world()), castleID, gameID);
    result = LibAttack.warCaptureCastle(armyID, ownerArmiesSurroundCastle);

    if (result == 1) {
      CastleOwnable.setOwner(castleID, armyOwner);

      // Destroy all the army which belongs to castle owner

      bytes32[] memory castleOwnerArmies = LibQueries.getOwnedArmyIDs(IStore(_world()), castleOwner, gameID);

      for (uint i = 0; i < castleOwnerArmies.length; i++) {
        ArmyOwnable.deleteRecord(castleOwnerArmies[i]);
        ArmyConfig.deleteRecord(castleOwnerArmies[i]);
        Position.deleteRecord(castleOwnerArmies[i]);
      }
      takeOwnershipOfMines(castleOwner, MineType.Food, gameID);
      takeOwnershipOfMines(castleOwner, MineType.Wood, gameID);
      takeOwnershipOfMines(castleOwner, MineType.Gold, gameID);

      CastleSiegeResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, castleID, gameID)),
        armyOwner,
        castleOwner,
        false
      );
    } else if (result == 0) {
      CastleSiegeResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, castleID, gameID)),
        armyOwner,
        castleOwner,
        true
      );
    } else {
      CastleSiegeResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, castleID, gameID)),
        castleOwner,
        armyOwner,
        false
      );
    }
  }
}
