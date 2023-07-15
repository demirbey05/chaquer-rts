// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { PlayerSeeds, Players, LimitOfGame, NumberOfUsers, ResourceInited, ResourceOwnableData, Position, MapConfig, ResourceOwnable } from "../codegen/Tables.sol";
import { MineType } from "../codegen/Types.sol";
import { LibRandom, LibQueries } from "../libraries/Libraries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

contract MineInitSystem is System {
  uint256 constant minePerResource = 4;
  uint256 constant maxIter = 30;

  function commitSeed(uint256 gameID, uint256 seed) public {
    address sender = _msgSender();
    bool isPlayer = Players.get(gameID, sender);
    if (isPlayer) {
      uint256[] memory temp = PlayerSeeds.get(gameID);
      temp[temp.length] = seed;
      PlayerSeeds.set(gameID, temp);
    } else {
      revert MineSystem__NoAuthorized();
    }
  }

  function resourceSystemInit(uint256 gameID) public {
    uint256 limit = LimitOfGame.get(gameID);
    uint32 width = MapConfig.getWidth(gameID);
    uint32 height = MapConfig.getHeight(gameID);
    uint256 currentNumOfUser = NumberOfUsers.get(gameID);
    uint256[] memory playerSeeds = PlayerSeeds.get(gameID);

    if (currentNumOfUser != limit) {
      revert MineSystem__GameIsNotFull();
    }
    if (playerSeeds.length != limit) {
      revert MineSystem__NotAllUsersSubmitSeed();
    }
    if (ResourceInited.get(gameID)) {
      revert MineSystem__ResourceInitialized();
    }
    uint256 numOfFoodMine = InitResourceType(MineType.Food, gameID, width, height);
    uint256 numOfWoodMine = InitResourceType(MineType.Wood, gameID, width, height);
    uint256 numOfGoldMine = InitResourceType(MineType.Gold, gameID, width, height);
    if (
      numOfFoodMine < minePerResource - 2 || numOfWoodMine < minePerResource - 2 || numOfGoldMine < minePerResource - 2
    ) {
      revert MineSystem__RandomizationError();
    }
    ResourceInited.set(gameID, true);
  }

  function InitResourceType(
    MineType mineType,
    uint256 gameID,
    uint256 width,
    uint256 height
  ) internal returns (uint256) {
    bytes32 previousHash = bytes32(0);
    uint256 i = 0;
    uint256 numIter = 0;
    uint32 x;
    uint32 y;
    while (i < minePerResource) {
      if (numIter > maxIter) {
        break;
      }
      numIter++;
      previousHash = LibRandom.generateRandomNumber(previousHash, gameID);
      x = uint32(uint256(previousHash) % width);
      previousHash = LibRandom.generateRandomNumber(previousHash, gameID);
      y = uint32(uint256(previousHash) % height);

      if (MapConfig.getItemTerrain(gameID, x * width + y)[0] != hex"01") {
        continue;
      }
      if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
        continue;
      }
      bytes32 entityID = getUniqueEntity();
      Position.set(entityID, x, y, gameID);
      ResourceOwnable.set(entityID, ResourceOwnableData(mineType, address(0), gameID));
      i++;
    }
    return i;
  }
}
