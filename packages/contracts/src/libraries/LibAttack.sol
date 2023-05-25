//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import {ArmyConfigData,ArmyConfig} from "../codegen/Tables.sol";
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


}