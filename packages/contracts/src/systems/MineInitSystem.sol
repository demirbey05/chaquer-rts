// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { PlayerSeeds, Players } from "../codegen/Tables.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibMath } from "../libraries/LibMath.sol";
import "./Errors.sol";

contract MineInitSystem is System {
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
}
