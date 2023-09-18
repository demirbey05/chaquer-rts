//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { ArmyOwnable, ArmyConfig, ArmyConfigData, Position, CastleOwnable } from "../codegen/Tables.sol";
import { LibMath } from "../libraries/LibMath.sol";

contract ArmyUpdateSystem is System {
  function updateArmy(
    bytes32 armyID,
    ArmyConfigData memory newArmyConfig,
    bytes32 castleID
  ) public {
    address owner = ArmyOwnable.getOwner(armyID);

    // Checks
    if (owner != _msgSender()) {
      revert ArmyUpdateSystem__NotArmyOwner();
    }

    if (CastleOwnable.getOwner(castleID) != owner) {
      revert ArmySettle__NoCastle();
    }

    {
      (uint32 x, uint32 y, ) = Position.get(armyID);
      (uint32 x_castle, uint32 y_castle, ) = Position.get(castleID);
      uint32 distanceBetween = LibMath.manhattan(x_castle, y_castle, x, y);
      if (distanceBetween > 3) {
        revert ArmyUpdate__TooFar();
      }
    }

    {
      ArmyConfigData memory armyConfigOld = ArmyConfig.get(armyID);
    }
  }
}
