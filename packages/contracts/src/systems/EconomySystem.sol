// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { LastCollectTime, ResourceOwnData, ResourceOwn, GameMetaData, CreditOwn, ResourcesSold } from "../codegen/Tables.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { MineType } from "../codegen/Types.sol";
import { LibVRGDA } from "../libraries/LibVRGDA.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { wadMul, toWadUnsafe } from "solmate/src/utils/SignedWadMath.sol";

uint256 constant mineRate = 200;
uint256 constant blockRate = 100;
uint256 constant startFood = 1000;
uint256 constant startWood = 1000;
uint256 constant startGold = 1000;

contract EconomySystem is System {
  //@dev maybe game state check should be applied in the further
  //@dev last collect time should have initial value and initialized with map system

  function collectResource(uint256 gameID) public {
    address owner = _msgSender();
    bytes32[] memory foodMines = LibQueries.getMines(IStore(_world()), owner, gameID, MineType.Food);
    bytes32[] memory woodMines = LibQueries.getMines(IStore(_world()), owner, gameID, MineType.Wood);
    bytes32[] memory goldMines = LibQueries.getMines(IStore(_world()), owner, gameID, MineType.Gold);

    // First request is initialization.
    if (LastCollectTime.get(owner, gameID) == 0) {
      LastCollectTime.set(owner, gameID, block.number);
      ResourceOwn.set(owner, gameID, ResourceOwnData(startFood, startWood, startGold));

      return;
    }

    uint256 difference = block.number - LastCollectTime.get(owner, gameID);
    ResourceOwnData memory data = ResourceOwn.get(owner, gameID);

    if (difference < 0) {
      revert EconomySystem__DifferenceIsLess();
    }
    LastCollectTime.set(owner, gameID, block.number);
    data.numOfFood += mineRate * foodMines.length * difference + blockRate * difference;
    data.numOfWood += mineRate * woodMines.length * difference + blockRate * difference;
    data.numOfGold += mineRate * goldMines.length * difference + blockRate * difference;
    ResourceOwn.set(owner, gameID, data);
  }

  function sellResource(
    uint256 gameID,
    uint256 amount,
    MineType mineType
  ) public {
    address owner = _msgSender();
    ResourceOwnData memory resources = ResourceOwn.get(owner, gameID);
    uint256 startBlock = GameMetaData.getStartBlock(gameID);
    if (mineType == MineType.Food) {
      if (resources.numOfFood < amount) {
        revert EconomySystem__InsufficientSource();
      }
      uint256 price = LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Food, block.number - startBlock);
      int256 revenue = wadMul(int256(price), toWadUnsafe(amount));
      ResourceOwn.setNumOfFood(owner, gameID, resources.numOfFood - amount);
      CreditOwn.set(gameID, owner, CreditOwn.get(gameID, owner) + uint256(revenue));
      ResourcesSold.setFoodSold(gameID, ResourcesSold.getFoodSold(gameID) + amount);
    } else if (mineType == MineType.Wood) {
      if (resources.numOfWood < amount) {
        revert EconomySystem__InsufficientSource();
      }
      uint256 price = LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Wood, block.number - startBlock);
      int256 revenue = wadMul(int256(price), toWadUnsafe(amount));
      ResourceOwn.setNumOfWood(owner, gameID, resources.numOfWood - amount);
      CreditOwn.set(gameID, owner, CreditOwn.get(gameID, owner) + uint256(revenue));
      ResourcesSold.setWoodSold(gameID, ResourcesSold.getWoodSold(gameID) + amount);
    } else if (mineType == MineType.Gold) {
      if (resources.numOfGold < amount) {
        revert EconomySystem__InsufficientSource();
      }
      uint256 price = LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Gold, block.number - startBlock);
      int256 revenue = wadMul(int256(price), toWadUnsafe(amount));
      ResourceOwn.setNumOfGold(owner, gameID, resources.numOfGold - amount);
      CreditOwn.set(gameID, owner, CreditOwn.get(gameID, owner) + uint256(revenue));
      ResourcesSold.setGoldSold(gameID, ResourcesSold.getGoldSold(gameID) + amount);
    }
  }

  function economyIncreaseResource(address user, uint256 gameID) public {
    ResourceOwn.set(user, gameID, ResourceOwnData(100000, 100000, 100000));
  }
}
