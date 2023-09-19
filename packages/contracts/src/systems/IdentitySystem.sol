// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Players, NumberOfUsers, AddressToUsername, LimitOfGame, MapConfig, GameMetaData,CreditOwn } from "../codegen/Tables.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibMath } from "../libraries/LibMath.sol";
import { LibUtils } from "../libraries/Utils.sol";
import "./Errors.sol";
import { State } from "../codegen/Types.sol";
import {initialCredit} from "./Constants.sol";

contract IdentitySystem is System {
  function joinGame(uint256 gameID, string memory userName) public {
    address sender = _msgSender();
    uint256 limit = LimitOfGame.get(gameID);
    uint256 currentNumOfUser = NumberOfUsers.get(gameID);

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
    if (bytes(userName).length > 32) {
      revert IdentitySystem__InvalidUserName();
    }
    {
      uint256 colorCursor = GameMetaData.getColorCursor(gameID);
      AddressToUsername.set(sender, gameID, colorCursor + 1, userName);
      GameMetaData.setColorCursor(gameID, colorCursor + 1);
    }

    Players.set(gameID, sender, true);
    NumberOfUsers.set(gameID, currentNumOfUser + 1);
    CreditOwn.set(gameID, sender, initialCredit);
  }

  function exitGame(uint256 gameID) public {
    address sender = _msgSender();
    if (!Players.get(gameID, sender)) {
      revert IdentitySystem__NotJoined();
    }
    State state = GameMetaData.getState(gameID);
    if (state == State.Waiting) {
      LibUtils.deletePlayer(IStore(_world()), sender, gameID);
    }
    if (state == State.Seed) {
      LibUtils.deletePlayer(IStore(_world()), sender, gameID);
      GameMetaData.setState(gameID, State.Waiting);
    }
    return;
  }
}
