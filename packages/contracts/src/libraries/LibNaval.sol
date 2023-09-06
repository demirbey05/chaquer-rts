//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { ArmyConfig, ArmyConfigData, Position, MapConfig } from "../codegen/Tables.sol";
import { LibMath } from "./LibMath.sol";

library LibNaval {
  function isInManhattanDistance(
    bytes32 armyID,
    uint32 coord_x,
    uint32 coord_y,
    uint32 threshold
  ) internal returns (bool) {
    (uint32 x, uint32 y, ) = Position.get(armyID);
    uint32 distanceBetween = LibMath.manhattan(x, y, coord_x, coord_y);
    return distanceBetween <= threshold;
  }

  function checkArmySize(bytes32 armyID, uint32 threshold) internal returns (bool) {
    ArmyConfigData memory config = ArmyConfig.get(armyID);
    return (config.numSwordsman + config.numArcher + config.numCavalry) >= threshold;
  }

  function checkSeaSide(
    uint32 x,
    uint32 y,
    uint256 gameID,
    uint32 width
  ) internal returns (bool) {
    return
      MapConfig.getItemTerrain(gameID, (x + 1) * width + y)[0] == hex"02" ||
      MapConfig.getItemTerrain(gameID, (x - 1) * width + y)[0] == hex"02" ||
      MapConfig.getItemTerrain(gameID, x * width + (y + 1))[0] == hex"02" ||
      MapConfig.getItemTerrain(gameID, x * width + (y - 1))[0] == hex"02";
  }
}
