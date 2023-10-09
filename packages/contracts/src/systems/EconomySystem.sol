// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { LastCollectTime, ResourceOwnData, ResourceOwn, GameMetaData, ResourcePrices, ArmyPrices } from "../codegen/index.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { MineType } from "../codegen/common.sol";
import { LibVRGDA } from "../libraries/LibVRGDA.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { collectBlockDifference } from "./Constants.sol";

uint256 constant mineRate = 10;
uint256 constant blockRate = 1;
uint256 constant startFood = 300;
uint256 constant startWood = 100;
uint256 constant startGold = 300;

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

    if (difference < collectBlockDifference) {
      revert EconomySystem__DifferenceIsLess();
    }
    LastCollectTime.set(owner, gameID, block.number);
    data.numOfFood += mineRate * foodMines.length * difference + blockRate * difference;
    data.numOfWood += mineRate * woodMines.length * difference + blockRate * difference;
    data.numOfGold += mineRate * goldMines.length * difference + blockRate * difference;
    ResourceOwn.set(owner, gameID, data);
  }
}
