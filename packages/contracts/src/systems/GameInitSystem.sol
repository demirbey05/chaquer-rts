//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, GameMetaData, AddressToUsername, LatestGameID, Players, AddressToColorIndex, CreditOwn } from "../codegen/index.sol";
import { IdentitySystem } from "./IdentitySystem.sol";
import "./Errors.sol";
import { State } from "../codegen/common.sol";
import { initialCredit } from "./Constants.sol";

error InitSystem__UsernameAlreadyInitialized();

contract GameInitSystem is System {
  uint256 constant capacityLowerBound = 3;
  uint256 constant capacityUpperBound = 5;

  function initMapData(
    uint256 gameID,
    uint32 width,
    uint32 height,
    bytes calldata terrain
  ) public {
    (, , bytes memory terrainData) = MapConfig.get(gameID);

    if ((width < 10 && height < 10) || (width > 60 && height > 60)) {
      revert InitSystem__NotEnoughDimension();
    }
    if (terrainData.length > 0) {
      revert InitSystem__AlreadyInitialized();
    }
    if (width * height != terrain.length) {
      revert InitSystem__MismatchedSize();
    }
    MapConfig.set(gameID, width, height, terrain);
  }

  function InitNumberOfGamer(uint256 gameID, uint256 capacity) public {
    (, , bytes memory terrainData) = MapConfig.get(gameID);
    uint256 prevCapacity = GameMetaData.getLimitOfPlayer(gameID);

    if (terrainData.length <= 0) {
      revert InitSystem__NotInitialized();
    }
    if (prevCapacity > 0) {
      revert InitSystem__CapacityAlreadyInitialized();
    }
    if (capacity < capacityLowerBound || capacity > capacityUpperBound) {
      revert InitSystem__CapacityBoundsExceeded();
    }
    GameMetaData.setLimitOfPlayer(gameID, capacity);
    GameMetaData.setState(gameID, State.Waiting);
  }

  //@dev founder user go into game
  function InitGame(
    uint256 capacity,
    uint32 width,
    uint32 height,
    bytes calldata terrain,
    string memory name,
    uint8 mapId
  ) public returns (uint256) {
    uint256 gameID = LatestGameID.get(keccak256("gameID")) + 1;
    initMapData(gameID, width, height, terrain);
    InitNumberOfGamer(gameID, capacity);
    GameMetaData.setName(gameID, name);
    GameMetaData.setMapId(gameID, mapId);
    GameMetaData.setMirror(gameID, gameID);
    joinGame(gameID);
    LatestGameID.set(keccak256("gameID"), gameID);
    return gameID;
  }

  function initUsername(string memory userName) public {
    address sender = _msgSender();

    if (bytes(userName).length > 32 || bytes(userName).length < 3) {
      revert IdentitySystem__InvalidUserName();
    }
    AddressToUsername.setUserName(sender, userName);
  }

  //@dev - if user has not username
  function joinGame(uint256 gameID) public {
    address sender = _msgSender();
    uint256 limit = GameMetaData.getLimitOfPlayer(gameID);
    uint256 currentNumOfUser = GameMetaData.getNumberOfPlayer(gameID);

    (, , bytes memory terrainData) = MapConfig.get(gameID);

    if (terrainData.length == 0) {
      revert IdentitySystem__GameDoesNotExist();
    }

    if (Players.get(gameID, sender)) {
      revert IdentitySystem__AlreadyJoined();
    }
    if (GameMetaData.getState(gameID) != State.Waiting) {
      revert IdentitySystem__WrongState();
    }

    if (currentNumOfUser >= limit) {
      revert IdentitySystem__GameIsFull();
    }
    {
      uint256 colorCursor = GameMetaData.getColorCursor(gameID);
      AddressToColorIndex.set(sender, gameID, gameID, colorCursor + 1, AddressToUsername.get(sender));
      GameMetaData.setColorCursor(gameID, colorCursor + 1);
    }

    Players.set(gameID, sender, true);
    GameMetaData.setNumberOfPlayer(gameID, currentNumOfUser + 1);
    CreditOwn.set(gameID, sender, initialCredit);
  }
}
