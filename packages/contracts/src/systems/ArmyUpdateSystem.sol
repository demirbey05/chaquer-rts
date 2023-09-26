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

  function mergeArmy(
    bytes32 armyOneID,
    bytes32 armyTwoID,
    uint256 gameID
  ) public {
    // Army two is destroyed and added to armyOne

    // Checks
    if (ArmyOwnable.getOwner(armyOneID) != _msgSender() || ArmyOwnable.getOwner(armyTwoID) != _msgSender()) {
      revert ArmyUpdateSystem__NotArmyOwner();
    }

    if (ArmyConfig.getGameID(armyOneID) != gameID || ArmyConfig.getGameID(armyTwoID) != gameID) {
      revert ArmyUpdate__WrongGameID();
    }

    //distance is max 1
    {
      (uint32 xOne, uint32 yOne, ) = Position.get(armyOneID);
      (uint32 xTwo, uint32 yTwo, ) = Position.get(armyTwoID);
      uint32 distanceBetween = LibMath.manhattan(xOne, yOne, xTwo, yTwo);
      if (distanceBetween > 2) {
        revert ArmyUpdate__TooFar();
      }
    }

    ArmyConfigData memory armyOneConfig = ArmyConfig.get(armyOneID);
    ArmyConfigData memory armyTwoConfig = ArmyConfig.get(armyTwoID);

    ArmyConfigData memory lastConfig = ArmyConfigData(
      armyOneConfig.numSwordsman + armyTwoConfig.numSwordsman,
      armyOneConfig.numArcher + armyTwoConfig.numArcher,
      armyOneConfig.numCavalry + armyTwoConfig.numCavalry,
      gameID
    );

    // New army's size cannot be more than 500
    if (lastConfig.numSwordsman + lastConfig.numArcher + lastConfig.numCavalry > 500) {
      revert ArmyUpdate__InvalidUserSize();
    }
    ArmyConfig.set(armyOneID, lastConfig);
    LibUtils.deleteArmy(armyTwoID);
  }
}
