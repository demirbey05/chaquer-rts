//SPDX-License-Identifier:MIT

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { ArmyConfig, Position, ArmyOwnable, ArmyConfigData, ResourceOwnable } from "../src/codegen/Tables.sol";
import { LibQueries, LibUtils, LibMath } from "../src/libraries/Libraries.sol";
import { MineType } from "../src/codegen/Types.sol";
import { console } from "forge-std/console.sol";

pragma solidity ^0.8.0;

contract MineCaptureTest is NakamoTest {
  address payable[] users;

  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/map_full_land.txt", 50, 50, 1);
    string memory userName = "demir";
    users.push(user1);
    users.push(user2);
    users.push(user3);
    users.push(user4);
    users.push(user5);
    users.push(user6);
    users.push(user7);
    users.push(user8);
    users.push(user9);
    users.push(user10);
    TestUtils.initializeMinePlacesStorage(world, 1, 1, users, userName, 10);
  }

  function testInitialCaptureOfMine() public {
    uint32 xCoord = 30;
    uint32 yCoord = 31;

    bytes32[] memory foodMine = LibQueries.getMines(world, address(0), 1, MineType.Food);
    bytes32 entityID = TestUtils.settleArmy(world, xCoord, yCoord, 33, 33, 33, user1, 1);

    bytes32 closestMine = TestUtils.findClosestMine(world, xCoord, yCoord, foodMine);
    (uint32 xMine, uint32 yMine, ) = Position.get(world, closestMine);
    TestUtils.moveArmyToLocation(world, entityID, xMine - 1, yMine, user1, 1);
    address prevOwner = ResourceOwnable.getOwner(world, closestMine);
    vm.startPrank(user1);
    world.captureMine(entityID, closestMine);
    vm.stopPrank();
    address postOwner = ResourceOwnable.getOwner(world, closestMine);
    assertEq(prevOwner, address(0));
    assertEq(postOwner, user1);
  }

  function testGoToMinePoint() public {
    uint32 xCoord = 30;
    uint32 yCoord = 31;

    bytes32[] memory foodMine = LibQueries.getMines(world, address(0), 1, MineType.Food);
    bytes32 entityID = TestUtils.settleArmy(world, xCoord, yCoord, 33, 33, 33, user1, 1);
    (uint32 xArmy, uint32 yArmy, ) = Position.get(world, entityID);
    bytes32 closestMine = TestUtils.findClosestMine(world, xCoord, yCoord, foodMine);
    (uint32 xMine, uint32 yMine, ) = Position.get(world, closestMine);
    TestUtils.moveArmyToLocation(world, entityID, xMine - 1, yMine, user1, 1);
    (xArmy, yArmy, ) = Position.get(world, entityID);
    assertEq(LibMath.manhattan(xMine - 1, yMine, xArmy, yArmy) < 3, true);
  }

  function testFriendlyFire() public {}
}
