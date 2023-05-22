// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {MapConfig} from "../codegen/Tables.sol";

error InitSystem__AlreadyInitialized();
error InitSystem__MismatchedSize();
error InitSystem__NotEnoughDimension();

contract MapSystem is System {
  
  function initMapData(uint256 gameID,uint32 width,uint32 height, bytes calldata terrain) public {

    (,,bytes memory terrainData) = MapConfig.get(gameID);

    if((width < 10 && height < 10) || (width > 60 && height > 60)){
      revert InitSystem__NotEnoughDimension();
    }
    if (terrainData.length > 0){
      revert InitSystem__AlreadyInitialized();
    }
    if (width * height != terrain.length){
      revert InitSystem__MismatchedSize();
    }
    MapConfig.set(gameID,width,height,terrain);
  }
}
