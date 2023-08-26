// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Players, NumberOfUsers, AddressToUsername, LimitOfGame, MapConfig, GameMetaData } from "../codegen/Tables.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibMath } from "../libraries/LibMath.sol";
import "./Errors.sol";
import { State } from "../codegen/Types.sol";

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

    AddressToUsername.set(sender, gameID, userName);
    Players.set(gameID, sender, true);
    NumberOfUsers.set(gameID, NumberOfUsers.get(gameID) + 1);
  }
}
