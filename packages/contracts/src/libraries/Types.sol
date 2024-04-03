//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

struct BattleResult {
  int32 swordsman;
  int32 archer;
  int32 cavalry;
}
struct BattleScore {
  int32 scoreArmyOne;
  int32 scoreArmyTwo;
}
struct RemainingData {
  uint8 isSwordsman;
  uint8 isArcher;
  uint8 isCavalry;
  uint8 numRemaining;
}
enum EntityType {
  Castle,
  Mine,
  Dock,
  Artillery
}
