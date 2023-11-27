// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { PlayerSeeds, Players, GameMetaData, ResourcesSold, ColorOwnable, SeedInited, ResourceOwnableData, Position, MapConfig, ResourceOwnable, ArmyConfig, ArmyOwnable, FleetOwnable } from "../codegen/index.sol";
import { LibRandom, LibQueries, LibAttack, LibUtils, LibMath, LibNaval } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { initialMarketSupply } from "./Constants.sol";
import { State, ClashType, AttackerType, MineType } from "../codegen/common.sol";

uint256 constant minePerResource = 1;
uint256 constant maxIter = 30;

struct OffsetPack {
  uint32 xOffset;
  uint32 yOffset;
  uint32 dropFactor;
}

contract MineInitSystem is System {
  function commitSeed(uint256 gameID, uint256 seed) public {
    address sender = _msgSender();
    bool isPlayer = Players.get(gameID, sender);
    if (!isPlayer) {
      revert MineSystem__NoAuthorized();
    }
    if (GameMetaData.getState(gameID) != State.Waiting) {
      revert MineSystem__WrongState();
    }
    if (SeedInited.get(gameID, sender)) {
      revert MineSystem__SeedInited();
    }
    PlayerSeeds.push(gameID, seed);
    SeedInited.set(gameID, sender, true);

  }

  function resourceSystemInit(uint256 gameID) public {
    uint256 limit = GameMetaData.getLimitOfPlayer(gameID);
    uint32 width = MapConfig.getWidth(gameID);
    uint32 height = MapConfig.getHeight(gameID);
    uint256 currentNumOfUser = GameMetaData.getNumberOfPlayer(gameID);
    uint256[] memory playerSeeds = PlayerSeeds.get(gameID);

    if (currentNumOfUser != limit) {
      revert MineSystem__GameIsNotFull();
    }

    //@dev tolerance, it is not sustainable solution
    if (playerSeeds.length < limit - 2) {
      revert MineSystem__NotAllUsersSubmitSeed();
    }
    if (GameMetaData.getIsInited(gameID)) {
      revert MineSystem__ResourceInitialized();
    }
    for (uint i = 0; i < 4; i++) {
      OffsetPack memory offset = OffsetPack({
        xOffset: (uint32(i / 2) * height) / 2,
        yOffset: (uint32(i % 2) * width) / 2,
        dropFactor: 2
      });
      uint[3] memory res = initAllMines(gameID, width, height, offset);
      if (res[0] < minePerResource || res[1] < minePerResource || res[2] < minePerResource) {
        revert MineSystem__RandomizationError();
      }
    }
    GameMetaData.setIsInited(gameID, true);
    GameMetaData.setState(gameID, State.Started);
    GameMetaData.setStartBlock(gameID, block.number);
    ResourcesSold.set(gameID, initialMarketSupply, initialMarketSupply, initialMarketSupply);
  }

  function initAllMines(
    uint256 gameID,
    uint32 width,
    uint32 height,
    OffsetPack memory offset
  ) internal returns (uint[3] memory res) {
    res[0] = InitResourceType(MineType.Food, gameID, width / 2, height / 2, offset);
    res[1] = InitResourceType(MineType.Wood, gameID, width / 2, height / 2, offset);
    res[2] = InitResourceType(MineType.Gold, gameID, width / 2, height / 2, offset);
  }

  function InitResourceType(
    MineType mineType,
    uint256 gameID,
    uint256 width,
    uint256 height,
    OffsetPack memory offset
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
      x = uint32((uint256(previousHash) % width) + offset.xOffset);
      previousHash = LibRandom.generateRandomNumber(previousHash, gameID);
      y = uint32((uint256(previousHash) % height) + offset.yOffset);

      if (MapConfig.getItemTerrain(gameID, x * ((width * offset.dropFactor) + 1) + y)[0] == hex"03") {
        continue;
      }
      if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
        continue;
      }
      bytes32 entityID = keccak256(abi.encodePacked(x, y, "Mine", gameID));
      Position.set(entityID, x, y, gameID);
      ResourceOwnable.set(entityID, ResourceOwnableData(mineType, address(0), gameID));
      ColorOwnable.set(entityID, 0, gameID);
      i++;
    }
    return i;
  }
}
