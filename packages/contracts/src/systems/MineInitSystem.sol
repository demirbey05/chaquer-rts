// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";
import { PlayerSeeds, Players, LimitOfGame, GameMetaData, NumberOfUsers, ResourceInited, ResourceOwnableData, Position, MapConfig, ResourceOwnable, MineCaptureResult, ArmyConfig, ArmyOwnable } from "../codegen/Tables.sol";
import { MineType } from "../codegen/Types.sol";
import { LibRandom, LibQueries, LibAttack, LibUtils, LibMath } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { State } from "../codegen/Types.sol";
import { getUniqueEntity } from "@latticexyz/world/src/modules/uniqueentity/getUniqueEntity.sol";

uint256 constant minePerResource = 4;
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
    PlayerSeeds.pushSeeds(gameID, seed);
    PlayerSeeds.pushSeedUsers(gameID, sender);
    if (PlayerSeeds.lengthSeedUsers(gameID) == LimitOfGame.get(gameID) - 1) {
      GameMetaData.setState(gameID, State.Started);
    }
  }

  function resourceSystemInit(uint256 gameID) public {
    uint256 limit = LimitOfGame.get(gameID);
    uint32 width = MapConfig.getWidth(gameID);
    uint32 height = MapConfig.getHeight(gameID);
    uint256 currentNumOfUser = NumberOfUsers.get(gameID);
    uint256[] memory playerSeeds = PlayerSeeds.getSeeds(gameID);

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

      if (MapConfig.getItemTerrain(gameID, x * width + y)[0] != hex"01") {
        continue;
      }
      if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
        continue;
      }
      bytes32 entityID = keccak256(abi.encodePacked(x, y, "Mine", gameID));
      Position.set(entityID, x, y, gameID);
      ResourceOwnable.set(entityID, ResourceOwnableData(mineType, address(0), gameID));
      i++;
    }
    return i;
  }

  function captureMine(bytes32 armyID, bytes32 mineID) public {
    address armyOwner = ArmyOwnable.getOwner(armyID);
    address mineOwner = ResourceOwnable.getOwner(mineID);

    // Some Checks
    if (armyOwner == mineOwner) {
      revert MineCapture__FriendFireNotAllowed();
    }
    if (armyOwner != msg.sender) {
      revert MineCapture__NoAuthorization();
    }
    (uint32 xArmy, uint32 yArmy, uint256 gameID) = Position.get(armyID);
    (uint32 xMine, uint32 yMine, uint256 gameIDTwo) = Position.get(mineID);

    uint32 distanceBetween = LibMath.manhattan(xArmy, yArmy, xMine, yMine);

    if (!(distanceBetween <= 3)) {
      revert MineCapture__TooFarToAttack();
    }
    if (gameID != gameIDTwo) {
      revert MineCapture__NonMatchedGameID();
    }

    if (mineOwner == address(0)) {
      ResourceOwnable.setOwner(mineID, armyOwner);
      return;
    }

    bytes32[] memory ownerArmiesSurroundCastle = LibUtils.findSurroundingArmies(
      IStore(_world()),
      mineID,
      gameID,
      EntityType.Mine
    );
    uint result = LibAttack.warCaptureCastle(armyID, ownerArmiesSurroundCastle);

    if (result == 1) {
      ResourceOwnable.setOwner(mineID, armyOwner);

      // Destroy all the army which belongs to castle owner

      for (uint i = 0; i < ownerArmiesSurroundCastle.length; i++) {
        if (ownerArmiesSurroundCastle[i] == bytes32(0)) {
          continue;
        }
        ArmyOwnable.deleteRecord(ownerArmiesSurroundCastle[i]);
        ArmyConfig.deleteRecord(ownerArmiesSurroundCastle[i]);
        Position.deleteRecord(ownerArmiesSurroundCastle[i]);
      }

      MineCaptureResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, mineID, gameID)),
        armyOwner,
        mineOwner,
        false
      );
    } else if (result == 0) {
      MineCaptureResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, mineID, gameID)),
        armyOwner,
        mineOwner,
        true
      );
    } else {
      MineCaptureResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, mineID, gameID)),
        mineOwner,
        armyOwner,
        false
      );
    }
  }
}
