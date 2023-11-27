//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { LibQueries, LibMath, LibNaval, LibUtils } from "../libraries/Libraries.sol";
import { baseCostDock, maxArmyNum, requiredArmySize, baseWoodCostDock, maxShipInFleet, smallCreditCost, smallWoodCost, mediumCreditCost, mediumWoodCost, bigCreditCost, bigWoodCost, fleetMoveFoodCost, fleetMoveGoldCost } from "./Constants.sol";
import { CreditOwn, FleetCarry, ColorOwnable, AddressToColorIndex, ArmyConfig, ArmyConfigData, ResourceOwnData, FleetOwnable, FleetConfig, Position, FleetConfigData, MapConfig, DockOwnable, ResourceOwn, ArmyOwnable } from "../codegen/index.sol";
import { SystemSwitch } from "@latticexyz/world-modules/src/utils/SystemSwitch.sol";
import { IWorld } from "../codegen/world/IWorld.sol";

error FleetLoad__NoAuthorization();
error FleetLoad__WrongGameID();
error FleetLoad__WrongConfig();
error FleetLoad__UnsufficientCap();
error FleetLoad__NoArmyPlace();
error FleetLoad__NumArmyLow();
error FleetUnload__NoArmyPlace();
error FleetUnload__TooFar();
error FleetUnload__WrongTerrainType();
error FleetUnload__TileIsNotEmpty();
error FleetLoad__TooFar();

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
    if (LibQueries.queryNumCarriedArmyIDs(IStore(_world()), fleetID, gameID) != 0) {
      moveCarriedArmy(fleetID, gameID, x, y);
    }
    ResourceOwn.setNumOfFood(fleetOwner, gameID, resourcesOfUser.numOfFood - fleetMoveFoodCost);
    ResourceOwn.setNumOfGold(fleetOwner, gameID, resourcesOfUser.numOfGold - fleetMoveGoldCost);
  }

  function loadFleet(
    bytes32 fleetID,
    bytes32 armyID,
    ArmyConfigData calldata armyPart
  ) public {
    address fleetOwner = FleetOwnable.getOwner(fleetID);
    address armyOwner = ArmyOwnable.getOwner(armyID);
    if (fleetOwner != (_msgSender())) {
      revert FleetLoad__NoAuthorization();
    }
    if (fleetOwner != armyOwner) {
      revert FleetLoad__NoAuthorization();
    }
    FleetConfigData memory fleet = FleetConfig.get(fleetID);
    ArmyConfigData memory army = ArmyConfig.get(armyID);

    if (fleet.gameID != army.gameID) {
      revert FleetLoad__WrongGameID();
    }
    if (
      armyPart.numSwordsman > army.numSwordsman ||
      armyPart.numArcher > army.numArcher ||
      armyPart.numCavalry > army.numCavalry ||
      armyPart.numSwordsman + armyPart.numArcher + armyPart.numCavalry == 0
    ) {
      revert FleetLoad__WrongConfig();
    }
    if (
      fleet.numSmall + 2 * fleet.numMedium + 3 * fleet.numBig <
      armyPart.numSwordsman + armyPart.numArcher + armyPart.numCavalry
    ) {
      revert FleetLoad__UnsufficientCap();
    }
    if (LibQueries.queryNumCarriedArmyIDs(IStore(_world()), fleetID, fleet.gameID) != 0) {
      revert FleetLoad__NoArmyPlace();
    }

    (uint32 x, uint32 y, ) = Position.get(fleetID);
    {
      (uint32 xArmy, uint32 yArmy, ) = Position.get(armyID);
      if (LibMath.manhattan(x, y, xArmy, yArmy) > 1) {
        revert FleetLoad__TooFar();
      }
    }

    if (
      armyPart.numSwordsman != army.numSwordsman ||
      armyPart.numArcher != army.numArcher ||
      armyPart.numCavalry != army.numCavalry
    ) {
      if (
        LibQueries.queryGetArmyNumber(IStore(_world()), fleetOwner, fleet.gameID) >=
        maxArmyNum + LibQueries.getOwnedCastleIDs(IStore(_world()), fleetOwner, fleet.gameID).length - 1
      ) {
        revert FleetLoad__NumArmyLow();
      }
      bytes32 newArmy = LibUtils.divideArmy(armyID, armyPart);
      Position.set(newArmy, x, y, fleet.gameID);
      FleetCarry.set(newArmy, fleetID, fleet.gameID);
    } else {
      Position.set(armyID, x, y, fleet.gameID);
      FleetCarry.set(armyID, fleetID, fleet.gameID);
    }
  }

  function unloadArmy(
    bytes32 fleetID,
    uint32 x,
    uint32 y,
    uint256 gameID
  ) public {
    if (LibQueries.queryNumCarriedArmyIDs(IStore(_world()), fleetID, gameID) == 0) {
      revert FleetUnload__NoArmyPlace();
    }
    if (MapConfig.getItemTerrain(gameID, x * MapConfig.getWidth(gameID) + y)[0] != hex"01") {
      revert FleetUnload__WrongTerrainType();
    }
    // The tile is not empty
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
      revert FleetUnload__TileIsNotEmpty();
    }
    // max 3 point away from the fleet position
    (uint32 xFleet, uint32 yFleet, ) = Position.get(fleetID);
    if (LibMath.manhattan(x, y, xFleet, yFleet) > 1) {
      revert FleetUnload__TooFar();
    }

    bytes32 armyID = moveCarriedArmy(fleetID, gameID, x, y);
    FleetCarry.deleteRecord(armyID);
  }

  function moveCarriedArmy(
    bytes32 fleetID,
    uint256 gameID,
    uint32 x,
    uint32 y
  ) internal returns (bytes32) {
    bytes32 armyID = LibQueries.queryCarriedArmyIDs(IStore(_world()), fleetID, gameID)[0];
    Position.set(armyID, x, y, gameID);
    return armyID;
  }
}
