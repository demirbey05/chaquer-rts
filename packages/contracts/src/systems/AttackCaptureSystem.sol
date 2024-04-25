//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import "./Errors.sol";
import { ArmyOwnable,ArtilleryConfig, ArtilleryOwnable,ClashResult,CastleHP, FleetOwnable, FleetConfigData, FleetConfig, ArmyOwnable, Position, ArmyConfig, ArmyConfigData, CastleOwnable, ResourceOwnable, Players, GameMetaData, DockOwnable, AddressToColorIndex, ColorOwnable } from "../codegen/index.sol";
import { LibMath, LibAttack, BattleScore, LibUtils, LibQueries, LibNaval } from "../libraries/Libraries.sol";
import { EntityType } from "../libraries/Types.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { MineType, ClashType ,AttackerType} from "../codegen/common.sol";

contract AttackCaptureSystem is System {
  function attackToArmy(bytes32 armyOne, bytes32 armyTwo, uint256 gameID) public returns (uint256) {
    (address owner, uint256 gameIDArmy) = ArmyOwnable.get(armyOne);
    (address ownerTwo, uint256 gameIDArmyTwo) = ArmyOwnable.get(armyTwo);
    ArmyConfigData memory armyOneConfig = ArmyConfig.get(armyOne);
    ArmyConfigData memory armyTwoConfig = ArmyConfig.get(armyTwo);
    {
      address sender = _msgSender();
      if ((owner != sender) || (gameIDArmy != gameID)) {
        revert AttackSystem__ArmyNotBelongYou();
      }
    }
    if (ArmyOwnable.getOwner(armyTwo) == address(0)) {
      revert AttackSystem__NoArmy();
    }
    if (gameID != gameIDArmyTwo) {
      revert AttackSystem__WrongGameID();
    }

    if (LibMath.distanceBetween(armyOne, armyTwo) > 3) {
      revert AttackSystem__TooAwayToAttack();
    }
    if (owner == ownerTwo) {
      revert AttackSystem__NoFriendFire();
    }

    BattleScore memory battleScore = LibAttack.calculateBattleScores(armyOneConfig, armyTwoConfig);

    if (battleScore.scoreArmyOne > battleScore.scoreArmyTwo) {
      LibUtils.deleteArmy(armyTwo);

      ArmyConfigData memory newConfig = ArmyConfigData(
        armyOneConfig.numSwordsman >> 1,
        armyOneConfig.numArcher >> 1,
        armyOneConfig.numCavalry >> 1,
        gameID
      );
      ArmyConfig.set(armyOne, newConfig);

      ClashResult.set(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        owner,
        ownerTwo,
        false,
        ClashType.Battle,
        gameID
      );
      return 1;
    } else if (battleScore.scoreArmyOne < battleScore.scoreArmyTwo) {
      LibUtils.deleteArmy(armyOne);

      ArmyConfigData memory newConfig = ArmyConfigData(
        armyTwoConfig.numSwordsman >> 1,
        armyTwoConfig.numArcher >> 1,
        armyTwoConfig.numCavalry >> 1,
        gameID
      );
      ArmyConfig.set(armyTwo, newConfig);
      ClashResult.set(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        ownerTwo,
        owner,
        false,
        ClashType.Battle,
        gameID
      );
      return 2;
    } else {
      LibUtils.deleteArmy(armyOne);
      LibUtils.deleteArmy(armyTwo);

      ClashResult.set(
        keccak256(abi.encodePacked(block.timestamp, armyTwo, armyOne, battleScore.scoreArmyTwo)),
        ownerTwo,
        owner,
        true,
        ClashType.Battle,
        gameID
      );
      return 0;
    }
  }

  function removeUser(address castleOwner, uint256 gameID) internal {
    bytes32[] memory castleOwnerArmies = LibQueries.getOwnedArmyIDs(IStore(_world()), castleOwner, gameID);

    for (uint i = 0; i < castleOwnerArmies.length; i++) {
      LibUtils.deleteArmy(castleOwnerArmies[i]);
    }
    LibUtils.takeOwnershipOfMines(IStore(_world()), castleOwner, MineType.Food, gameID);
    LibUtils.takeOwnershipOfMines(IStore(_world()), castleOwner, MineType.Wood, gameID);
    LibUtils.takeOwnershipOfMines(IStore(_world()), castleOwner, MineType.Gold, gameID);
    LibUtils.takeOwnershipOfDocks(IStore(_world()), castleOwner, gameID, castleOwner);
    GameMetaData.setNumberOfPlayer(gameID, GameMetaData.getNumberOfPlayer(gameID) - 1);
    Players.set(gameID, castleOwner, false);
    AddressToColorIndex.deleteRecord(castleOwner, gameID);
  }

  function captureCastle(bytes32 artilleryID, bytes32 castleID) public  {
    address armyOwner = ArtilleryOwnable.getOwner(artilleryID);
    address castleOwner = CastleOwnable.getOwner(castleID);
    uint32 artilleryConfig = ArtilleryConfig.getNumArtillery(artilleryID);

    // Some Checks
    if (armyOwner == castleOwner) {
      revert CaptureSystem__FriendFireNotAllowed();
    }

    if (armyOwner != msg.sender) {
      revert CaptureSystem__NoAuthorization();
    }

    (uint32 xArmy, uint32 yArmy, uint256 gameID) = Position.get(artilleryID);
    (uint32 xCastle, uint32 yCastle, uint256 gameIDTwo) = Position.get(castleID);

    uint32 distanceBetween = LibMath.manhattan(xArmy, yArmy, xCastle, yCastle);

    if (!(distanceBetween <= 3)) {
      revert CaptureSystem__TooFarToAttack();
    }
    if (gameID != gameIDTwo) {
      revert CaptureSystem__NonMatchedGameID();
    }

    uint256 currentHP = CastleHP.getCastleHP(castleID);
    uint256 newHP;
    if (currentHP > artilleryConfig) {
      newHP = currentHP - artilleryConfig;
    } else {
      newHP = 0;
    }
    CastleHP.setCastleHP(castleID, newHP);
  }

  function garrisonAttack(bytes32 armyID,bytes32 castleID) public returns (uint256) {
    address armyOwner = ArmyOwnable.getOwner(armyID);
    address castleOwner = CastleOwnable.getOwner(castleID);

    // Some Checks
    if (armyOwner == castleOwner) {
      revert CaptureSystem__FriendFireNotAllowed();
    }

    if (armyOwner != msg.sender) {
      revert CaptureSystem__NoAuthorization();
    }
    (uint32 xArmy, uint32 yArmy, uint256 gameID) = Position.get(armyID);
    
    {

    
    (uint32 xCastle, uint32 yCastle, uint256 gameIDTwo) = Position.get(castleID);
    uint32 distanceBetween = LibMath.manhattan(xArmy, yArmy, xCastle, yCastle);

    if (!(distanceBetween <= 3)) {
      revert CaptureSystem__TooFarToAttack();
    }
    if (gameID != gameIDTwo) {
      revert CaptureSystem__NonMatchedGameID();
    }

    uint256 currentHP = CastleHP.getCastleHP(castleID);

    if (currentHP > 0) {
      revert CaptureSystem__CastleWallAlive();
    }
    }

    bytes32[] memory ownerArmiesSurroundCastle = LibUtils.findSurroundingArmies(
      IStore(_world()),
      castleID,
      gameID,
      EntityType.Castle
    );
    uint256 result = LibAttack.warCaptureCastle(armyID, ownerArmiesSurroundCastle,true);

    if (result == 1) {
      CastleOwnable.setOwner(castleID, armyOwner);
      ColorOwnable.setColorIndex(castleID, AddressToColorIndex.getColorIndex(armyOwner, gameID));

      // Destroy all the army which belongs to castle owner
      if (!LibQueries.queryAddressHasCastle(IStore(_world()), castleOwner, gameID)) {
        removeUser(castleOwner, gameID);
      }
    }

    LibUtils.emitClashTableEvent(uint8(result), armyID, castleID, gameID, armyOwner, castleOwner, ClashType.Castle);
    

  }

  function attackFleet(bytes32 fleetOne, bytes32 fleetTwo, uint256 gameID) public {
    address fleetOneOwner = FleetOwnable.getOwner(fleetOne);
    address fleetTwoOwner = FleetOwnable.getOwner(fleetTwo);
    {
      // Checks
      if (fleetOneOwner == fleetTwoOwner) {
        revert FleetAttack__FriendFireNotAllowed();
      }
      if (fleetOneOwner != _msgSender()) {
        revert FleetAttack__NoAuthorization();
      }
      (uint32 xFleetOne, uint32 yFleetOne, uint256 gameIDOne) = Position.get(fleetOne);
      (uint32 xFleetTwo, uint32 yFleetTwo, uint256 gameIDTwo) = Position.get(fleetTwo);
      if (gameIDOne != gameIDTwo) {
        revert FleetAttack__NonMatchedGameID();
      }

      if (LibMath.manhattan(xFleetOne, yFleetOne, xFleetTwo, yFleetTwo) > 3) {
        revert FleetAttack__TooFar();
      }
    }

    // Execution
    FleetConfigData memory fleetOneConfig = FleetConfig.get(fleetOne);
    FleetConfigData memory fleetTwoConfig = FleetConfig.get(fleetTwo);
    (uint8 winner, FleetConfigData memory winnerNew) = LibNaval.fightTwoFleet(fleetOneConfig, fleetTwoConfig);
    LibUtils.emitClashTableEvent(winner, fleetOne, fleetTwo, gameID, fleetOneOwner, fleetTwoOwner, ClashType.NavalWar);
    if (winner == 0) {
      LibNaval.deleteFleet(IStore(_world()), fleetOne, gameID);
      LibNaval.deleteFleet(IStore(_world()), fleetTwo, gameID);
      return;
    }
    FleetConfig.set(winner == 1 ? fleetOne : fleetTwo, winnerNew);
    LibNaval.deleteFleet(IStore(_world()), winner == 1 ? fleetTwo : fleetOne, gameID);
  }

  function attackToArtillery(bytes32 attackerID, bytes32 artilleryID) public {
    address attackerOwner = ArmyOwnable.getOwner(attackerID);
    address artilleryOwner = ArtilleryOwnable.getOwner(artilleryID);
    address requester = _msgSender();

    if (attackerOwner == artilleryOwner) {
      revert AttackSystem__NoFriendFire();
    }
    if (attackerOwner != requester) {
      revert MineCapture__NoAuthorization();
    }
    (uint32 xArmy, uint32 yArmy, uint256 gameID) = Position.get(attackerID);
    (uint32 xArt, uint32 yArt, uint256 gameIDTwo) = Position.get(artilleryID);

    uint32 distanceBetween = LibMath.manhattan(xArmy, yArmy, xArt, yArt);

    if (!(distanceBetween <= 3)) {
      revert AttackSystem__TooAwayToAttack();
    }
    if (gameID != gameIDTwo) {
      revert AttackSystem__WrongGameID();
    }

    bytes32[] memory ownerEntitiesSurroundMine = LibUtils.findSurroundingAttackerEntities(
      IStore(_world()),
      artilleryID,
      gameID,
      EntityType.Artillery,
      AttackerType.Army
    );

    if (ownerEntitiesSurroundMine.length == 0) {
      ArtilleryOwnable.deleteRecord(artilleryID);
      ArtilleryConfig.deleteRecord(artilleryID);
      ColorOwnable.deleteRecord(artilleryID);
      Position.deleteRecord(artilleryID);
      return;
    }

    uint result = LibAttack.warCaptureCastle(attackerID, ownerEntitiesSurroundMine,false);
    if (result == 1) {
      ArtilleryOwnable.deleteRecord(artilleryID);
      ArtilleryConfig.deleteRecord(artilleryID);
      ColorOwnable.deleteRecord(artilleryID);
      Position.deleteRecord(artilleryID);
    }

  }
}
