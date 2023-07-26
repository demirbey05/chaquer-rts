//SPDX-License-Identifier:MIT
pragma solidity >=0.8.19;
import { wadExp, wadLn, wadMul, unsafeWadMul, toWadUnsafe, unsafeWadDiv } from "solmate/src/utils/SignedWadMath.sol";
import { MineType } from "../codegen/Types.sol";
import { ResourcesSold, NumberOfUsers } from "../codegen/Tables.sol";
import "../systems/EconomySystem.sol";
import "../systems/MineInitSystem.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

library LibVRGDA {
  function getResourcePrice(
    IWorld world,
    uint256 gameID,
    MineType mineType,
    uint256 time
  ) internal view returns (uint256) {
    int256 decayConstant = wadLn(1e18 + 0.15e18);
    int256 timeScaled = toWadUnsafe(time);
    if (mineType == MineType.Food) {
      uint256 sold = ResourcesSold.getFoodSold(world, gameID);
      unchecked {
        return
          uint256(
            wadMul(
              1e18,
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
              1e18,
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
              1e18,
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
    uint256 numPlayers = NumberOfUsers.get(world, gameID);
    int256 perTimeUnit = wadMul(0.7e18, (int256(minePerResource * mineRate + blockRate * numPlayers)) * 1e18);
    return unsafeWadDiv(sold, perTimeUnit);
  }

  function getArmyPrice(
    IWorld world,
    uint256 gameID,
    MineType mineType,
    uint256 time
  ) internal {}
}
