//SPDX-License-Identifier:MIT
pragma solidity >=0.8.19;
import { wadExp, wadLn, wadMul, unsafeWadMul, toWadUnsafe, unsafeWadDiv } from "solmate/src/utils/SignedWadMath.sol";
import { MineType } from "../codegen/common.sol";
import { ResourcesSold, SoldierCreated } from "../codegen/index.sol";
import "../systems/EconomySystem.sol";
import "../systems/MineInitSystem.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

int256 constant basePriceResource = 0.1e18;

library LibVRGDA {
  function getResourcePrice(
    IWorld world,
    uint256 gameID,
    MineType mineType,
    uint256 time
  ) internal view returns (uint256) {
    int256 decayConstant = wadLn(1e18 + 0.00005e18);
    int256 timeScaled = toWadUnsafe(time);
    if (mineType == MineType.Food) {
      uint256 sold = ResourcesSold.getFoodSold(world, gameID);
      unchecked {
        return
          uint256(
            wadMul(
              basePriceResource,
              wadExp(
                unsafeWadMul(decayConstant, timeScaled - getTargetSaleTimeResource(world, toWadUnsafe(sold), gameID))
              )
            )
          );
      }
    } else if (mineType == MineType.Wood) {
      uint256 sold = ResourcesSold.getWoodSold(world, gameID);
      unchecked {
        return
          uint256(
            wadMul(
              basePriceResource,
              wadExp(
                unsafeWadMul(decayConstant, timeScaled - getTargetSaleTimeResource(world, toWadUnsafe(sold), gameID))
              )
            )
          );
      }
    } else if (mineType == MineType.Gold) {
      uint256 sold = ResourcesSold.getGoldSold(world, gameID);
      unchecked {
        return
          uint256(
            wadMul(
              basePriceResource,
              wadExp(
                unsafeWadMul(decayConstant, timeScaled - getTargetSaleTimeResource(world, toWadUnsafe(sold), gameID))
              )
            )
          );
      }
    }
  }

  function getTargetSaleTimeResource(
    IWorld world,
    int256 sold,
    uint256 gameID
  ) internal view returns (int256) {
    uint256 numPlayers = GameMetaData.getNumberOfPlayer(world, gameID);
    //@dev minePerResource
    int256 perTimeUnit = wadMul(0.5e18, (int256((minePerResource * 3) * mineRate + blockRate * numPlayers)) * 1e18);
    return unsafeWadDiv(sold, perTimeUnit);
  }

  function getArmyPrice(
    IWorld world,
    uint256 gameID,
    uint256 armyTypeID,
    uint256 time
  ) internal returns (uint256) {
    int256 decayConstant = wadLn(1e18 - 0.00005e18);
    int256 timeScaled = toWadUnsafe(time);
    if (armyTypeID == 0) {
      uint256 sold = SoldierCreated.getNumOfSwordsman(world, gameID);
      unchecked {
        return
          uint256(
            wadMul(
              1e18,
              wadExp(unsafeWadMul(decayConstant, timeScaled - getTargetSaleTimeArmy(world, toWadUnsafe(sold), gameID)))
            )
          );
      }
    } else if (armyTypeID == 1) {
      uint256 sold = SoldierCreated.getNumOfArcher(world, gameID);
      unchecked {
        return
          uint256(
            wadMul(
              1e18,
              wadExp(unsafeWadMul(decayConstant, timeScaled - getTargetSaleTimeArmy(world, toWadUnsafe(sold), gameID)))
            )
          );
      }
    } else if (armyTypeID == 2) {
      uint256 sold = SoldierCreated.getNumOfCavalry(world, gameID);
      unchecked {
        return
          uint256(
            wadMul(
              1e18,
              wadExp(unsafeWadMul(decayConstant, timeScaled - getTargetSaleTimeArmy(world, toWadUnsafe(sold), gameID)))
            )
          );
      }
    }
  }

  function getTargetSaleTimeArmy(
    IWorld world,
    int256 sold,
    uint256 gameID
  ) internal view returns (int256) {
    uint256 numPlayers = GameMetaData.getNumberOfPlayer(world, gameID);
    int256 perTimeUnit = wadMul(0.5e18, (int256(500 * numPlayers)) * 1e18);
    return unsafeWadDiv(sold, perTimeUnit);
  }
}
