// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { ResourceOwnData, ResourceOwn, GameMetaData} from "../codegen/index.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { MineType } from "../codegen/common.sol";
import { LibVRGDA } from "../libraries/LibVRGDA.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

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

    uint256 lastCollectTime = ResourceOwn.getLastCollect(owner, gameID);

    // First request is initialization.
    if (lastCollectTime == 0) {
      ResourceOwn.set(owner, gameID, ResourceOwnData(startFood, startWood, startGold,block.number));

      return;
    }

    uint256 difference = block.number - lastCollectTime;
    ResourceOwnData memory data = ResourceOwn.get(owner, gameID);
    data.lastCollect = block.number;
    data.numOfFood += mineRate * foodMines.length * difference + blockRate * difference;
    data.numOfWood += mineRate * woodMines.length * difference + blockRate * difference;
    data.numOfGold += mineRate * goldMines.length * difference + blockRate * difference;
    ResourceOwn.set(owner, gameID, data);
  }
}
