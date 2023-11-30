//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { MapConfig, ResourceOwn, Position, ArtilleryOwnable, ArtilleryConfig, ColorOwnable, AddressToColorIndex, CastleOwnable, GameMetaData } from "../codegen/index.sol";
import { LibQueries } from "../libraries/LibQueries.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
import { LibMath } from "../libraries/LibMath.sol";
import { LibUtils } from "../libraries/Utils.sol";
import { State } from "../codegen/common.sol";
import "./Errors.sol";
import { IWorld } from "../codegen/world/IWorld.sol";
error ArmySettle__NotEnoughGold();

contract ArtillerySystem is System {
  function settleArtillery(
    uint32 x,
    uint32 y,
    uint32 config,
    bytes32 castleID,
    uint256 gameID
  ) public returns (bytes32) {
    // Get control parameters

    address ownerCandidate = _msgSender();
    uint32 width = MapConfig.getWidth(gameID);
    uint32 height = MapConfig.getHeight(gameID);

    if (MapConfig.getItemTerrain(gameID, x * width + y)[0] != hex"01") {
      revert ArmySettle__WrongTerrainType();
    }
    // If there is an another entity at that coordinate
    if (LibQueries.queryPositionEntity(IStore(_world()), x, y, gameID) > 0) {
      revert ArmySettle__TileIsNotEmpty();
    }
    // You can have 3 artillery
    if (
      LibQueries.queryNumArtillery(IStore(_world()), ownerCandidate, gameID) >=
      3 + LibQueries.getOwnedCastleIDs(IStore(_world()), ownerCandidate, gameID).length - 1
    ) {
      revert ArmySettle__NoArmyRight();
    }
    if (CastleOwnable.getOwner(castleID) != ownerCandidate) {
      revert ArmySettle__NoCastle();
    }
    if (GameMetaData.getState(gameID) != State.Started) {
      revert ArmySettle__WrongState();
    }
    {
      (uint32 x_castle, uint32 y_castle, ) = Position.get(castleID);
      uint32 distanceBetween = LibMath.manhattan(x_castle, y_castle, x, y);
      if (distanceBetween > 3) {
        revert ArmySettle__TooFarToSettle();
      }
    }
    if (config > 20 || config < 1) {
      revert ArmySettle__TooManySoldier();
    }

    uint256 amountGold = ResourceOwn.getNumOfGold(ownerCandidate, gameID);

    if (amountGold < config * 100) {
      revert ArmySettle__NotEnoughGold();
    }

    ResourceOwn.setNumOfGold(ownerCandidate, gameID, amountGold - config * 100);

    bytes32 entityID = keccak256(abi.encodePacked(x, y, "Artillery", ownerCandidate, gameID, block.timestamp));

    Position.set(entityID, x, y, gameID);
    ArtilleryOwnable.set(entityID, ownerCandidate, gameID);
    ArtilleryConfig.set(entityID, config, gameID);
    ColorOwnable.set(entityID, AddressToColorIndex.getColorIndex(ownerCandidate, gameID), gameID);

    return entityID;
  }
}
