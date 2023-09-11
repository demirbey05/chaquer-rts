// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { PlayerSeeds, Players, LimitOfGame, GameMetaData, NumberOfUsers, ResourceInited, ColorOwnable, SeedInited, ResourceOwnableData, Position, MapConfig, ResourceOwnable, ClashResult, ArmyConfig, ArmyOwnable, FleetOwnable } from "../codegen/Tables.sol";
import { MineType } from "../codegen/Types.sol";
import { LibRandom, LibQueries, LibAttack, LibUtils, LibMath, LibNaval } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { State, ClashType, AttackerType } from "../codegen/Types.sol";

uint256 constant minePerResource = 5;
uint256 constant maxIter = 30;

contract MineInitSystem is System {
  function commitSeed(uint256 gameID, uint256 seed) public {
    address sender = _msgSender();
    bool isPlayer = Players.get(gameID, sender);
    if (!isPlayer) {
      revert MineSystem__NoAuthorized();
    }
    if (LibQueries.getOwnedCastleIDs(IStore(_world()), sender, gameID).length == 0) {
      revert MineSystem__NoCastleOfUsers();
    }
    if (GameMetaData.getState(gameID) != State.Seed) {
      revert MineSystem__WrongState();
    }
    if (SeedInited.get(gameID, sender)) {
      revert MineSystem__SeedInited();
    }
    PlayerSeeds.push(gameID, seed);
    SeedInited.set(gameID, sender, true);
    if (PlayerSeeds.length(gameID) == LimitOfGame.get(gameID)) {
      GameMetaData.setState(gameID, State.Started);
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
    GameMetaData.setState(gameID, State.Started);
    GameMetaData.setStartBlock(gameID, block.number);
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

      if (MapConfig.getItemTerrain(gameID, x * width + y)[0] == hex"03") {
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
