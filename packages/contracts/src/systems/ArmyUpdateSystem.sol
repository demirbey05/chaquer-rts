//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { ArmyOwnable, ArmyConfig, ArmyConfigData, Position, CastleOwnable } from "../codegen/Tables.sol";
import { LibMath } from "../libraries/LibMath.sol";
import { LibUtils } from "../libraries/Utils.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

contract ArmyUpdateSystem is System {
  function updateArmy(
    bytes32 armyID,
    ArmyConfigData memory newArmyConfig,
    bytes32 castleID
  ) public {
    address owner = ArmyOwnable.getOwner(armyID);
    ArmyConfigData memory delta;

    // Checks
    if (owner != _msgSender()) {
      revert ArmyUpdateSystem__NotArmyOwner();
    }

    if (CastleOwnable.getOwner(castleID) != owner) {
      revert ArmySettle__NoCastle();
    }

    {
      (uint32 x, uint32 y, uint256 gameIDArmy) = Position.get(armyID);
      (uint32 x_castle, uint32 y_castle, uint256 gameIDCastle) = Position.get(castleID);
      uint32 distanceBetween = LibMath.manhattan(x_castle, y_castle, x, y);
      if (distanceBetween > 3) {
        revert ArmyUpdate__TooFar();
      }
      if (gameIDArmy != gameIDCastle) {
        revert ArmyUpdate__WrongGameID();
      }
    }

    {
      ArmyConfigData memory armyConfigOld = ArmyConfig.get(armyID);
      if (
        armyConfigOld.numSwordsman > newArmyConfig.numSwordsman ||
        armyConfigOld.numArcher > newArmyConfig.numArcher ||
        armyConfigOld.numCavalry > newArmyConfig.numCavalry
      ) {
        revert ArmyUpdate__InvalidUserSize();
      }
      delta = ArmyConfigData(
        newArmyConfig.numSwordsman - armyConfigOld.numSwordsman,
        newArmyConfig.numArcher - armyConfigOld.numArcher,
        newArmyConfig.numCavalry - armyConfigOld.numCavalry,
        newArmyConfig.gameID
      );
    }
    LibUtils.handleEconomyCheck(IWorld(_world()), owner, delta);
    ArmyConfig.set(armyID, newArmyConfig);
  }
}
