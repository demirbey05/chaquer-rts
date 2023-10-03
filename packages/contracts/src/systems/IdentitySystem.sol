// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Players, AddressToColorIndex, MapConfig, GameMetaData, CreditOwn, AddressToUsername } from "../codegen/index.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibMath } from "../libraries/LibMath.sol";
import { LibUtils } from "../libraries/Utils.sol";
import "./Errors.sol";
import { State } from "../codegen/common.sol";
import { initialCredit } from "./Constants.sol";

contract IdentitySystem is System {
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
