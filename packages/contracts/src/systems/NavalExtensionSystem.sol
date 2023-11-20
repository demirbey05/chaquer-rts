//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibQueries, LibMath, LibNaval } from "../libraries/Libraries.sol";
import { baseCostDock, requiredArmySize, baseWoodCostDock, maxShipInFleet, smallCreditCost, smallWoodCost, mediumCreditCost, mediumWoodCost, bigCreditCost, bigWoodCost, fleetMoveFoodCost, fleetMoveGoldCost } from "./Constants.sol";
import { CreditOwn, ArmyOwnable, ColorOwnable, AddressToColorIndex, ResourceOwnData, FleetOwnable, FleetConfig, Position, FleetConfigData, MapConfig, DockOwnable, ResourceOwn, ArmyOwnable } from "../codegen/index.sol";
import { SystemSwitch } from "@latticexyz/world-modules/src/utils/SystemSwitch.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

contract NavalExtensionSystem is System {
  function buildDock(
    uint32 coord_x,
    uint32 coord_y,
    bytes32 requestedArmy,
    uint256 gameID
  ) public returns (bytes32) {
    address sender = _msgSender();
    uint32 width = MapConfig.getWidth(gameID);
    SystemSwitch.call(abi.encodeCall(IWorld(_world()).collectResource, (gameID)));
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
    if (!LibNaval.isInManhattanDistance(requestedArmy, coord_x, coord_y, 3)) {
      revert NavalSystem__ArmyIsTooFar();
    }

    // Army size is low
    if (!LibNaval.checkArmySize(requestedArmy, requiredArmySize)) {
      revert NavalSystem__ArmySizeIsLow();
    }

    // Location is not one step away from the naval area

    if (!LibNaval.checkSeaSide(coord_x, coord_y, gameID, width)) {
      revert NavalSystem__NotSeaSide();
    }

    // If there is any entity in that location
    if (LibQueries.queryPositionEntity(IStore(_world()), coord_x, coord_y, gameID) > 0) {
      revert NavalSystem__TileIsNotEmpty();
    }
    if (ArmyOwnable.getOwner(requestedArmy) != sender) {
      revert NavalSystem__NoAuthorization();
    }

    // Terrain should be land
    if (MapConfig.getItemTerrain(gameID, coord_x * width + coord_y)[0] != hex"01") {
      revert NavalSystem__WrongTile();
    }

    // Create entity with Position and DockOwnable
    bytes32 entityID = keccak256(abi.encodePacked(coord_x, coord_y, "Dock", sender, gameID));

    Position.set(entityID, coord_x, coord_y, gameID);
    DockOwnable.set(entityID, sender, gameID);
    ColorOwnable.set(entityID, AddressToColorIndex.getColorIndex(sender, gameID), gameID);
    CreditOwn.set(gameID, sender, totalCredit - (creditCost * 1e18));
    ResourceOwn.setNumOfWood(sender, gameID, totalWood - woodCost);
    return entityID;
  }

  function settleFleet(
    uint32 x,
    uint32 y,
    bytes32 dockID,
    FleetConfigData memory fleet
  ) public returns (bytes32) {
    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(fleet.gameID);
    SystemSwitch.call(abi.encodeCall(IWorld(_world()).collectResource, (fleet.gameID)));
    uint256 costCredit = fleet.numSmall *
      smallCreditCost +
      fleet.numMedium *
      mediumCreditCost +
      fleet.numBig *
      bigCreditCost;
    uint256 woodCost = fleet.numSmall * smallWoodCost + fleet.numMedium * mediumWoodCost + fleet.numBig * bigWoodCost;
    uint256 totalCredit = CreditOwn.get(fleet.gameID, ownerCandidate);
    uint256 totalWood = ResourceOwn.getNumOfWood(ownerCandidate, fleet.gameID);

    if (MapConfig.getItemTerrain(fleet.gameID, x * width + y)[0] != hex"02") {
      revert FleetSettle__WrongTerrainType();
    }
    // If there is an another entity at that coordinate
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, fleet.gameID) > 0) {
      revert FleetSettle__TileIsNotEmpty();
    }
    if (totalCredit < costCredit * 1e18 || totalWood < woodCost) {
      revert FleetSettle__InsufficientBalance();
    }
    if (fleet.numMedium + fleet.numBig + fleet.numSmall > maxShipInFleet) {
      revert FleetSettle__TooManyShip();
    }
    (uint32 xDock, uint32 yDock, ) = Position.get(dockID);

    if (LibMath.manhattan(x, y, xDock, yDock) > 3) {
      revert FleetSettle__TooFarFromDock();
    }
    if (
      LibQueries.getFleetNumber(IStore(_world()), ownerCandidate, fleet.gameID) >=
      LibQueries.getDocksLength(IStore(_world()), ownerCandidate, fleet.gameID)
    ) {
      revert FleetSettle__TooManyFleet();
    }
    bytes32 entityID = keccak256(abi.encodePacked(x, y, "Fleet", ownerCandidate, fleet.gameID, block.timestamp));
    Position.set(entityID, x, y, fleet.gameID);
    FleetConfig.set(entityID, fleet);
    FleetOwnable.set(entityID, ownerCandidate, fleet.gameID);
    ColorOwnable.set(entityID, AddressToColorIndex.getColorIndex(ownerCandidate, fleet.gameID), fleet.gameID);
    ResourceOwn.setNumOfWood(ownerCandidate, fleet.gameID, totalWood - woodCost);
    CreditOwn.set(fleet.gameID, ownerCandidate, totalCredit - (costCredit * 1e18));
    return entityID;
  }

  function moveFleet(
    bytes32 fleetID,
    uint32 x,
    uint32 y
  ) public {
    address fleetOwner = FleetOwnable.getOwner(fleetID);
    (uint32 xFleet, uint32 yFleet, uint256 gameID) = Position.get(fleetID);
    SystemSwitch.call(abi.encodeCall(IWorld(_world()).collectResource, (gameID)));
    ResourceOwnData memory resourcesOfUser = ResourceOwn.get(fleetOwner, gameID);
    if (resourcesOfUser.numOfFood < fleetMoveFoodCost || resourcesOfUser.numOfGold < fleetMoveGoldCost) {
      revert FleetMove__UnsufficientResource();
    }
    if (fleetOwner != (_msgSender())) {
      revert FleetMove__NoAuthorization();
    }

    uint32 width = MapConfig.getWidth(gameID);
    if (MapConfig.getItemTerrain(gameID, x * width + y)[0] != hex"02") {
      revert FleetMove__WrongTerrainType();
    }
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
      revert FleetMove__TileIsNotEmpty();
    }
    if (LibMath.manhattan(x, y, xFleet, yFleet) > 3) {
      revert FleetMove__TooFar();
    }
    Position.set(fleetID, x, y, gameID);
    ResourceOwn.setNumOfFood(fleetOwner, gameID, resourcesOfUser.numOfFood - fleetMoveFoodCost);
    ResourceOwn.setNumOfGold(fleetOwner, gameID, resourcesOfUser.numOfGold - fleetMoveGoldCost);
  }
}