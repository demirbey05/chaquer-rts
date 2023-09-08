// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Position, ResourceOwnable, ArmyOwnable, FleetOwnable } from "../codegen/Tables.sol";
import { LibUtils, LibMath } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import "./Errors.sol";
import { AttackerType } from "../codegen/Types.sol";

contract MineCaptureSystem is System {
  function captureMine(
    bytes32 attackerID,
    bytes32 mineID,
    AttackerType attackerType
  ) public {
    address attackerOwner = (attackerType == AttackerType.Army)
      ? ArmyOwnable.getOwner(attackerID)
      : FleetOwnable.getOwner(attackerID);
    address mineOwner = ResourceOwnable.getOwner(mineID);

    // Some Checks
    if (attackerOwner == mineOwner) {
      revert MineCapture__FriendFireNotAllowed();
    }
    if (attackerOwner != msg.sender) {
      revert MineCapture__NoAuthorization();
    }
    (uint32 xArmy, uint32 yArmy, uint256 gameID) = Position.get(attackerID);
    (uint32 xMine, uint32 yMine, uint256 gameIDTwo) = Position.get(mineID);

    uint32 distanceBetween = LibMath.manhattan(xArmy, yArmy, xMine, yMine);

    if (!(distanceBetween <= 3)) {
      revert MineCapture__TooFarToAttack();
    }
    if (gameID != gameIDTwo) {
      revert MineCapture__NonMatchedGameID();
    }

    if (mineOwner == address(0)) {
      ResourceOwnable.setOwner(mineID, attackerOwner);
      return;
    }

    bytes32[] memory ownerEntitesSurroundMine = LibUtils.findSurroundingAttackerEntities(
      IStore(_world()),
      mineID,
      gameID,
      EntityType.Mine,
      attackerType
    );

    if (attackerType == AttackerType.Army) {
      LibUtils.handleArmyAttack(attackerID, mineID, attackerOwner, mineOwner, ownerEntitesSurroundMine, gameID);
    } else if (attackerType == AttackerType.Fleet) {
      LibUtils.handleFleetAttack(attackerID, mineID, attackerOwner, mineOwner, ownerEntitesSurroundMine, gameID);
    }
  }
}
