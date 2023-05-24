// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";

import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { MapConfig, MapConfigTableId } from "../src/codegen/Tables.sol";
import {InitSystem__AlreadyInitialized,InitSystem__MismatchedSize,InitSystem__NotEnoughDimension} from "../src/systems/MapSystem.sol";

contract MapInitTest is MudV2Test {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testInitData() public {
    uint256 gameID = 1;
    uint256 terrainLength = MapConfig.lengthTerrain(world,1);
    assertEq(0, terrainLength);
    bytes memory map1 = bytes(vm.readFile("test/mock_data/full_data.txt"));
    world.initMapData(gameID,50,50,map1);
    (uint32 width, uint32 height, bytes memory terrainData) = MapConfig.get(world,gameID);
    assertEq(terrainData,map1);
    assertEq(width * height, map1.length);
    terrainLength = MapConfig.lengthTerrain(world,1);
    assertEq(50 * 50, terrainLength);

  }

  function testSecondInitRevert() public {
    uint256 gameID = 1;
    bytes memory map1 = bytes(vm.readFile("test/mock_data/full_data.txt"));
    world.initMapData(gameID,50,50,map1);
    vm.expectRevert(InitSystem__AlreadyInitialized.selector);
    world.initMapData(gameID,50,50,map1);
  }

  function testMismatchedSize() public {
    uint256 gameID = 1;
    bytes memory map1 = bytes(vm.readFile("test/mock_data/full_data.txt"));
    vm.expectRevert(InitSystem__MismatchedSize.selector);
    world.initMapData(gameID,35,35,map1); 
  }

  function testWrongDimensionLower() public {
    uint256 gameID = 1;
    bytes memory map1 = bytes(vm.readFile("test/mock_data/full_data.txt"));
    vm.expectRevert(InitSystem__NotEnoughDimension.selector);
    world.initMapData(gameID,8,8,map1); 

  }
  function testWrongDimensionHigher() public {
    uint256 gameID = 1;
    bytes memory map1 = bytes(vm.readFile("test/mock_data/full_data.txt"));
    vm.expectRevert(InitSystem__NotEnoughDimension.selector);
    world.initMapData(gameID,70,70,map1); 
  }


}
