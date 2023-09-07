//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { ArmyConfig, ArmyConfigData, Position, MapConfig, FleetConfigData, FleetConfig, FleetOwnable } from "../codegen/Tables.sol";
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

  function calculateFleetPowerScore(FleetConfigData memory fleet) internal pure returns (uint32) {
    return fleet.numSmall + fleet.numMedium * 2 + fleet.numBig * 3;
  }

  function comparePowerScores(FleetConfigData memory fleet1, FleetConfigData memory fleet2)
    internal
    pure
    returns (uint32, uint8 winner)
  {
    uint32 powScoreF1 = calculateFleetPowerScore(fleet1);
    uint32 powScoreF2 = calculateFleetPowerScore(fleet2);
    if (powScoreF1 == powScoreF2) {
      return (0, 0);
    }
    bool isWin = powScoreF1 > powScoreF2;
    uint32 difference = isWin
      ? calculateFleetPowerScore(fleet1) - calculateFleetPowerScore(fleet2)
      : calculateFleetPowerScore(fleet2) - calculateFleetPowerScore(fleet1);
    return (difference, isWin ? 1 : 2);
  }

  function decomposeDifferenceScoreToRemainingFleet(FleetConfigData memory winnerOld, uint32 differenceScore)
    internal
    returns (FleetConfigData memory)
  {
    FleetConfigData memory winnerNew = winnerOld;
    if (differenceScore < winnerOld.numSmall) {
      winnerNew.numSmall = differenceScore;
      winnerNew.numMedium = 0;
      winnerNew.numBig = 0;
    } else if (differenceScore < winnerOld.numSmall + winnerOld.numMedium * 2) {
      winnerNew.numMedium = (differenceScore - winnerOld.numSmall) / 2;
      winnerNew.numBig = 0;
    } else if (differenceScore < winnerOld.numSmall + winnerOld.numMedium * 2 + winnerOld.numBig * 3) {
      winnerNew.numBig = (differenceScore - winnerOld.numSmall - winnerOld.numMedium * 2) / 3;
    }
    return winnerNew;
  }

  function fightTwoFleet(FleetConfigData memory fleetOneConfig, FleetConfigData memory fleetTwoConfig)
    internal
    returns (uint8, FleetConfigData memory)
  {
    (uint32 differenceScore, uint8 winner) = LibNaval.comparePowerScores(fleetOneConfig, fleetTwoConfig);
    if (winner == 0) {
      return (0, fleetOneConfig);
    }
    FleetConfigData memory winnerOld = winner == 1 ? fleetOneConfig : fleetTwoConfig;
    FleetConfigData memory winnerNew = LibNaval.decomposeDifferenceScoreToRemainingFleet(winnerOld, differenceScore);
    return (winner, winnerNew);
  }

  function deleteFleet(bytes32 fleetID) internal {
    FleetConfig.deleteRecord(fleetID);
    FleetOwnable.deleteRecord(fleetID);
    Position.deleteRecord(fleetID);
  }
}
