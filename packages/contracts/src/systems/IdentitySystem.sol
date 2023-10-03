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

contract IdentitySystem is System {
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
