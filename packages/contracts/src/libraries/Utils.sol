//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { BattleResult, RemainingData } from "./Types.sol";
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

function calculateScoreSingleRemaining(
  BattleResult memory scoreArray,
  RemainingData memory remainings
) returns (int32 result) {
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

function calculateScoreDoubleRemaining(
  BattleResult memory scoreArray,
  RemainingData memory remainings
) returns (int32 result) {
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