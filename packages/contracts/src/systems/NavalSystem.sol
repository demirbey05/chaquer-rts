//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { ClashType } from "../codegen/Types.sol";
import { LibQueries, LibMath, LibNaval, LibUtils, LibAttack } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { baseCostDock, requiredArmySize, baseWoodCostDock, maxShipInFleet, smallCreditCost, smallWoodCost, mediumCreditCost, mediumWoodCost, bigCreditCost, bigWoodCost } from "./Constants.sol";
import { CreditOwn, FleetOwnable, FleetConfig, Position, FleetConfigData, ArmyConfig, ArmyConfigData, MapConfig, DockOwnable, ResourceOwn, ClashResult, ArmyOwnable } from "../codegen/Tables.sol";

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
    uint result = LibAttack.warCaptureCastle(armyID, ownerArmiesSurroundDock);

    if (result == 1) {
      DockOwnable.setOwner(dockID, armyOwner);

      // Destroy all the army which belongs to castle owner

      for (uint i = 0; i < ownerArmiesSurroundDock.length; i++) {
        if (ownerArmiesSurroundDock[i] == bytes32(0)) {
          continue;
        }
        ArmyOwnable.deleteRecord(ownerArmiesSurroundDock[i]);
        ArmyConfig.deleteRecord(ownerArmiesSurroundDock[i]);
        Position.deleteRecord(ownerArmiesSurroundDock[i]);
      }

      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, dockID, gameID)),
        armyOwner,
        dockOwner,
        false,
        ClashType.Dock
      );
    } else if (result == 0) {
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, dockID, gameID)),
        armyOwner,
        dockOwner,
        true,
        ClashType.Dock
      );
    } else {
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, armyID, dockID, gameID)),
        dockOwner,
        armyOwner,
        false,
        ClashType.Dock
      );
    }
  }

  function settleFleet(
    uint32 x,
    uint32 y,
    bytes32 dockID,
    FleetConfigData memory fleet
  ) public returns (bytes32) {
    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(IStore(_world()), fleet.gameID);
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
    bytes32 entityID = keccak256(abi.encodePacked(x, y, "Fleet", ownerCandidate, fleet.gameID));
    Position.set(entityID, x, y, fleet.gameID);
    FleetConfig.set(entityID, fleet);
    FleetOwnable.set(entityID, ownerCandidate, fleet.gameID);
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
    if (fleetOwner != (_msgSender())) {
      revert FleetMove__NoAuthorization();
    }
    (uint32 xFleet, uint32 yFleet, uint256 gameID) = Position.get(fleetID);
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
  }

  function attackFleet(bytes32 fleetOne, bytes32 fleetTwo) public {
    address fleetOneOwner = FleetOwnable.getOwner(fleetOne);
    address fleetTwoOwner = FleetOwnable.getOwner(fleetTwo);

    // Checks
    if (fleetOneOwner == fleetTwoOwner) {
      revert FleetAttack__FriendFireNotAllowed();
    }
    if (fleetOneOwner != _msgSender()) {
      revert FleetAttack__NoAuthorization();
    }
    (uint32 xFleetOne, uint32 yFleetOne, uint256 gameID) = Position.get(fleetOne);
    (uint32 xFleetTwo, uint32 yFleetTwo, uint256 gameIDTwo) = Position.get(fleetTwo);
    if (gameID != gameIDTwo) {
      revert FleetAttack__NonMatchedGameID();
    }
    if (LibMath.manhattan(xFleetOne, yFleetOne, xFleetTwo, yFleetTwo) > 3) {
      revert FleetAttack__TooFar();
    }

    // Execution
    FleetConfigData memory fleetOneConfig = FleetConfig.get(fleetOne);
    FleetConfigData memory fleetTwoConfig = FleetConfig.get(fleetTwo);
    (uint8 winner, FleetConfigData memory winnerNew) = LibNaval.fightTwoFleet(fleetOneConfig, fleetTwoConfig);
    if (winner == 0) {
      LibNaval.deleteFleet(fleetOne);
      LibNaval.deleteFleet(fleetTwo);
      // Ephemeral event
      ClashResult.emitEphemeral(
        keccak256(abi.encodePacked(block.timestamp, xFleetOne, yFleetOne)),
        fleetOneOwner,
        fleetTwoOwner,
        true,
        ClashType.NavalWar
      );
      return;
    }
    FleetConfig.set(winner == 1 ? fleetOne : fleetTwo, winnerNew);
    LibNaval.deleteFleet(winner == 1 ? fleetTwo : fleetOne);
    // Ephemeral event
    ClashResult.emitEphemeral(
      keccak256(abi.encodePacked(block.timestamp, xFleetOne, yFleetOne)),
      winner == 1 ? fleetOneOwner : fleetTwoOwner,
      winner == 1 ? fleetTwoOwner : fleetOneOwner,
      false,
      ClashType.NavalWar
    );
  }
}
