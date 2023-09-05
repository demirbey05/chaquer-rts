//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibQueries, LibMath } from "../libraries/Libraries.sol";
import { baseCostDock, requiredArmySize, baseWoodCostDock } from "./Constants.sol";
import { CreditOwn, Position, ArmyConfig, ArmyConfigData, MapConfig, DockOwnable, ResourceOwn } from "../codegen/Tables.sol";

contract NavalSystem is System {
  function buildDock(
    uint32 coord_x,
    uint32 coord_y,
    bytes32 requestedArmy,
    uint256 gameID
  ) public returns (bytes32) {
    address sender = _msgSender();
    uint32 width = MapConfig.getWidth(gameID);
    uint256 currentDocks = LibQueries.getDocksLength(IStore(_world()), sender, gameID);
    // Money and Wood is not sufficient
    uint256 creditCost = (currentDocks + 1) * baseCostDock;
    uint256 woodCost = (currentDocks + 1) * baseWoodCostDock;
    uint256 totalCredit = CreditOwn.get(gameID, sender);
    uint256 totalWood = ResourceOwn.getNumOfWood(sender, gameID);
    if ((totalCredit / 1e18) < creditCost || totalWood < woodCost) {
      revert NavalSystem__UnsufficientBalance();
    }
    // Army is far away
    if (!isInManhattanDistance(requestedArmy, coord_x, coord_y, 3)) {
      revert NavalSystem__ArmyIsTooFar();
    }

    // Army size is low
    if (!checkArmySize(requestedArmy, requiredArmySize)) {
      revert NavalSystem__ArmySizeIsLow();
    }

    // Location is not one step away from the naval area

    if (!checkSeaSide(coord_x, coord_y, gameID, width)) {
      revert NavalSystem__NotSeaSide();
    }

    // If there is any entity in that location
    if (LibQueries.queryPositionEntity(IStore(_world()), coord_x, coord_y, gameID) > 0) {
      revert NavalSystem__TileIsNotEmpty();
    }

    // Terrain should be land
    if (MapConfig.getItemTerrain(gameID, coord_x * width + coord_y)[0] != hex"01") {
      revert NavalSystem__WrongTile();
    }

    // Create entity with Position and DockOwnable
    bytes32 entityID = keccak256(abi.encodePacked(coord_x, coord_y, "Dock", sender, gameID));

    Position.set(entityID, coord_x, coord_y, gameID);
    DockOwnable.set(entityID, sender, gameID);
    CreditOwn.set(gameID, sender, totalCredit - (creditCost * 1e18));
    ResourceOwn.setNumOfWood(sender, gameID, totalWood - woodCost);
    return entityID;
  }

  function isInManhattanDistance(
    bytes32 armyID,
    uint32 coord_x,
    uint32 coord_y,
    uint32 threshold
  ) internal returns (bool) {
    (uint32 x, uint32 y, ) = Position.get(armyID);
    uint32 distanceBetween = LibMath.manhattan(x, y, coord_x, coord_y);
    return distanceBetween <= threshold;
  }

  function checkArmySize(bytes32 armyID, uint32 threshold) internal returns (bool) {
    ArmyConfigData memory config = ArmyConfig.get(armyID);
    return (config.numSwordsman + config.numArcher + config.numCavalry) >= threshold;
  }

  function checkSeaSide(
    uint32 x,
    uint32 y,
    uint256 gameID,
    uint32 width
  ) internal returns (bool) {
    return
      MapConfig.getItemTerrain(gameID, (x + 1) * width + y)[0] == hex"02" ||
      MapConfig.getItemTerrain(gameID, (x - 1) * width + y)[0] == hex"02" ||
      MapConfig.getItemTerrain(gameID, x * width + (y + 1))[0] == hex"02" ||
      MapConfig.getItemTerrain(gameID, x * width + (y - 1))[0] == hex"02";
  }
}
