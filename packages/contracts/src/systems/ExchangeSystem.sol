//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { ResourceOwnData, ResourceOwn, GameMetaData, CreditOwn, ResourcesSold } from "../codegen/index.sol";
import "./Errors.sol";
import { MineType } from "../codegen/common.sol";
import { LibVRGDA } from "../libraries/LibVRGDA.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

contract ExchangeSystem is System {
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
      uint256 revenue = price * amount;
      ResourceOwn.setNumOfFood(owner, gameID, resources.numOfFood - amount);
      CreditOwn.set(gameID, owner, CreditOwn.get(gameID, owner) + revenue);
      ResourcesSold.setFoodSold(gameID, ResourcesSold.getFoodSold(gameID) + amount);
    } else if (mineType == MineType.Wood) {
      if (resources.numOfWood < amount) {
        revert EconomySystem__InsufficientSource();
      }
      uint256 price = LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Wood, block.number - startBlock);
      uint256 revenue = price * amount;
      ResourceOwn.setNumOfWood(owner, gameID, resources.numOfWood - amount);
      CreditOwn.set(gameID, owner, CreditOwn.get(gameID, owner) + revenue);
      ResourcesSold.setWoodSold(gameID, ResourcesSold.getWoodSold(gameID) + amount);
    } else if (mineType == MineType.Gold) {
      if (resources.numOfGold < amount) {
        revert EconomySystem__InsufficientSource();
      }
      uint256 price = LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Gold, block.number - startBlock);
      uint256 revenue = price * amount;
      ResourceOwn.setNumOfGold(owner, gameID, resources.numOfGold - amount);
      CreditOwn.set(gameID, owner, CreditOwn.get(gameID, owner) + revenue);
      ResourcesSold.setGoldSold(gameID, ResourcesSold.getGoldSold(gameID) + amount);
    }
  }

  function buyResource(
    uint256 gameID,
    uint256 amount,
    MineType mineType
  ) public {
    address owner = _msgSender();
    ResourceOwnData memory resources = ResourceOwn.get(owner, gameID);
    uint256 balance = CreditOwn.get(gameID, owner);
    uint256 startBlock = GameMetaData.getStartBlock(gameID);
    if (mineType == MineType.Food) {
      uint256 price = (3 *
        LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Food, block.number - startBlock)) / 2;
      uint256 cost = price * amount;
      if (balance < cost) {
        revert EconomySystem__InsufficientCredit();
      }
      if (amount > ResourcesSold.getFoodSold(gameID)) {
        revert EconomySystem__InsufficientSupply();
      }
      ResourceOwn.setNumOfFood(owner, gameID, resources.numOfFood + amount);
      CreditOwn.set(gameID, owner, balance - cost);
      ResourcesSold.setFoodSold(gameID, ResourcesSold.getFoodSold(gameID) - amount);
    } else if (mineType == MineType.Wood) {
      uint256 price = (3 *
        LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Wood, block.number - startBlock)) / 2;
      uint256 cost = price * amount;
      if (balance < cost) {
        revert EconomySystem__InsufficientCredit();
      }
      if (amount > ResourcesSold.getWoodSold(gameID)) {
        revert EconomySystem__InsufficientSupply();
      }
      ResourceOwn.setNumOfWood(owner, gameID, resources.numOfWood + amount);
      CreditOwn.set(gameID, owner, balance - cost);
      ResourcesSold.setWoodSold(gameID, ResourcesSold.getWoodSold(gameID) - amount);
    } else if (mineType == MineType.Gold) {
      uint256 price = (3 *
        LibVRGDA.getResourcePrice(IWorld(_world()), gameID, MineType.Gold, block.number - startBlock)) / 2;
      uint256 cost = price * amount;
      if (balance < cost) {
        revert EconomySystem__InsufficientCredit();
      }
      if (amount > ResourcesSold.getGoldSold(gameID)) {
        revert EconomySystem__InsufficientSupply();
      }
      ResourceOwn.setNumOfGold(owner, gameID, resources.numOfGold + amount);
      CreditOwn.set(gameID, owner, balance - cost);
      ResourcesSold.setGoldSold(gameID, ResourcesSold.getGoldSold(gameID) - amount);
    }
  }
}
