//SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {MapConfig,GameMetaData} from "../codegen/index.sol";
import "./Errors.sol";
import {State} from "../codegen/common.sol";

contract GameInitSystem is System {
    uint256 constant capacityLowerBound = 1;

  function initMapData(
    uint256 gameID,
    uint32 width,
    uint32 height,
    bytes calldata terrain
  ) public {
    (, , bytes memory terrainData) = MapConfig.get(gameID);

    if ((width < 10 && height < 10) || (width > 60 && height > 60)) {
      revert InitSystem__NotEnoughDimension();
    }
    if (terrainData.length > 0) {
      revert InitSystem__AlreadyInitialized();
    }
    if (width * height != terrain.length) {
      revert InitSystem__MismatchedSize();
    }
    MapConfig.set(gameID, width, height, terrain);
  }

  function InitNumberOfGamer(uint256 gameID, uint256 capacity) public {
    (, , bytes memory terrainData) = MapConfig.get(gameID);
    uint256 prevCapacity = GameMetaData.getLimitOfPlayer(gameID);

    if (terrainData.length <= 0) {
      revert InitSystem__NotInitialized();
    }
    if (prevCapacity > 0) {
      revert InitSystem__CapacityAlreadyInitialized();
    }
    if (capacity < capacityLowerBound) {
      revert InitSystem__CapacityIsTooLow();
    }
    GameMetaData.setLimitOfPlayer(gameID, capacity);
    GameMetaData.setState(gameID, State.Waiting);
  }

  function InitGame(uint256 gameID,uint256 capacity,uint32 width,uint32 height,bytes calldata terrain,string memory name,uint8 mapId) public {
    initMapData(gameID,width,height,terrain);
    InitNumberOfGamer(gameID,capacity);
    GameMetaData.setName(gameID,name);
    GameMetaData.setMapId(gameID,mapId);
    GameMetaData.setMirror(gameID,gameID);

  }
}