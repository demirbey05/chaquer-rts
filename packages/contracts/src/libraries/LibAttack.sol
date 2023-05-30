//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import {ArmyConfigData,ArmyConfig,ArmyOwnable,CastleOwnable,Position} from "../codegen/Tables.sol";
import { BattleResult, BattleScore, RemainingData } from "./Types.sol";
import { findRemainings, calculateScoreSingleRemaining, calculateScoreDoubleRemaining, calculateArmyScore } from "./Utils.sol";

library LibAttack {
    function firstBattle(
    ArmyConfigData memory armyOne,
    ArmyConfigData memory armyTwo
  ) internal pure returns (BattleResult memory firstBattle) {
    firstBattle.swordsman = int32(armyOne.numSwordsman) - int32(armyTwo.numSwordsman);
    firstBattle.archer = int32(armyOne.numArcher) - int32(armyTwo.numArcher);
    firstBattle.cavalry = int32(armyOne.numCavalry) - int32(armyTwo.numCavalry);
  }
  function calculateBattleScores(
    ArmyConfigData memory armyOne,
    ArmyConfigData memory armyTwo
  ) internal returns (BattleScore memory result) {

    BattleResult memory firstResultOne = firstBattle(armyOne, armyTwo);
    BattleResult memory firstResultTwo = firstBattle(armyTwo, armyOne);
    RemainingData memory remainingsOne = findRemainings(firstResultOne);
    RemainingData memory remainingsTwo = findRemainings(firstResultTwo);
    result.scoreArmyOne = calculateArmyScore(firstResultOne, remainingsOne);
    result.scoreArmyTwo = calculateArmyScore(firstResultTwo, remainingsTwo);
  }
    function warCaptureCastle(
    bytes32 attackerArmyID,
    bytes32[] memory defenderArmies
  ) internal returns (uint256) {
    ArmyConfigData memory attackerArmy = ArmyConfig.get(attackerArmyID);
    ArmyConfigData memory defenderArmy = ArmyConfigData(0,0,0,attackerArmy.gameID);



    for (uint i = 0; i < defenderArmies.length; i++) {
      if (defenderArmies[i] == bytes32(0)) {
        continue;
      }
      ArmyConfigData memory currentArmy = ArmyConfig.get(defenderArmies[i]);
      defenderArmy.numSwordsman += currentArmy.numSwordsman;
      defenderArmy.numArcher += currentArmy.numArcher;
      defenderArmy.numCavalry += currentArmy.numCavalry;
    }
    BattleScore memory battleScore = calculateBattleScores(attackerArmy, defenderArmy);

    if (battleScore.scoreArmyOne > battleScore.scoreArmyTwo) {
      for (uint i = 0; i < defenderArmies.length; i++) {        
        if (defenderArmies[i] == bytes32(0)) {
          continue;
        }
        ArmyConfig.deleteRecord(defenderArmies[i]);
        Position.deleteRecord(defenderArmies[i]);
        ArmyOwnable.deleteRecord(defenderArmies[i]);
      }
      ArmyConfigData memory newConfig = ArmyConfigData(
        attackerArmy.numSwordsman >> 1,
        attackerArmy.numArcher >> 1,
        attackerArmy.numCavalry >> 1,
        attackerArmy.gameID
      );
      ArmyConfig.set(attackerArmyID, newConfig);
      return 1;
    } else if (battleScore.scoreArmyOne < battleScore.scoreArmyTwo) {
      ArmyOwnable.deleteRecord(attackerArmyID);
      ArmyConfig.deleteRecord(attackerArmyID);
      Position.deleteRecord(attackerArmyID);
      ArmyConfigData memory currentArmy;
      for (uint i = 0; i < defenderArmies.length; i++) {
        currentArmy = ArmyConfig.get(defenderArmies[i]);
        ArmyConfigData memory newConfig = ArmyConfigData(
          currentArmy.numSwordsman >> 1,
          currentArmy.numArcher >> 1,
          currentArmy.numCavalry >> 1,
          currentArmy.gameID
        );
        ArmyConfig.set(defenderArmies[i], newConfig);
      }
      return 2;
    } else {
      ArmyOwnable.deleteRecord(attackerArmyID);
      ArmyConfig.deleteRecord(attackerArmyID);
      Position.deleteRecord(attackerArmyID);
      for (uint i = 0; i < defenderArmies.length; i++) {
        ArmyOwnable.deleteRecord(defenderArmies[i]);
        ArmyConfig.deleteRecord(defenderArmies[i]);
        Position.deleteRecord(defenderArmies[i]);
      }
      return 0;
    }
  }
}


