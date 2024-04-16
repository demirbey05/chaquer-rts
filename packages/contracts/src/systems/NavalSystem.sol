//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { ClashType } from "../codegen/common.sol";
import { LibMath, LibUtils, LibAttack } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { ColorOwnable, AddressToColorIndex, Position, DockOwnable, ArmyOwnable } from "../codegen/index.sol";

contract NavalSystem is System {
  function captureDock(bytes32 armyID, bytes32 dockID) public {
    address armyOwner = ArmyOwnable.getOwner(armyID);
    address dockOwner = DockOwnable.getOwner(dockID);

    // Some Checks
    if (armyOwner == dockOwner) {
      revert NavalCapture__FriendFireNotAllowed();
    }
    if (armyOwner != msg.sender) {
      revert NavalCapture__NoAuthorization();
    }
    (uint32 xArmy, uint32 yArmy, uint256 gameID) = Position.get(armyID);
    (uint32 xDock, uint32 yDock, uint256 gameIDTwo) = Position.get(dockID);

    uint32 distanceBetween = LibMath.manhattan(xArmy, yArmy, xDock, yDock);

    if (!(distanceBetween <= 3)) {
      revert NavalCapture__TooFarToAttack();
    }
    if (gameID != gameIDTwo) {
      revert NavalCapture__NonMatchedGameID();
    }

    bytes32[] memory ownerArmiesSurroundDock = LibUtils.findSurroundingArmies(
      IStore(_world()),
      dockID,
      gameID,
      EntityType.Dock
    );
    uint result = LibAttack.warCaptureCastle(armyID, ownerArmiesSurroundDock,false);

    if (result == 1) {
      DockOwnable.setOwner(dockID, armyOwner);
      ColorOwnable.setColorIndex(dockID, AddressToColorIndex.getColorIndex(armyOwner, gameID));

      // Destroy all the army which belongs to castle owner

      for (uint i = 0; i < ownerArmiesSurroundDock.length; i++) {
        if (ownerArmiesSurroundDock[i] == bytes32(0)) {
          continue;
        }
        LibUtils.deleteArmy(ownerArmiesSurroundDock[i]);
      }
    }
    LibUtils.emitClashTableEvent(uint8(result), armyID, dockID, gameID, armyOwner, dockOwner, ClashType.Dock);
  }
}
