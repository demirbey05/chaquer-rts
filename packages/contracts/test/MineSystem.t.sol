//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { PlayerSeeds, Players, LimitOfGame, NumberOfUsers, ResourceInited, ResourceOwnableData, Position, MapConfig, ResourceOwnable } from "../src/codegen/Tables.sol";
import { LibQueries } from "../src/libraries/Libraries.sol";
import { MineType } from "../src/codegen/Types.sol";

contract MineSystemTest is NakamoTest {
  address payable[] users;

  function setUp() public override {
    super.setUp();
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
    TestUtils.initMap(world, "test/mock_data/map_full_land.txt", 50, 50, 1);
  }

  function testGameIsNotFull() public {
    string memory userName = "demir";
    address payable[] memory newArray = new address payable[](1);
    newArray[0] = user1;
    TestUtils.initializeCapacityWithUsers(world, 1, userName, newArray, 11);
    TestUtils.initializeAllCastles(world, 1, newArray, 30, 30);
    TestUtils.initializeSeedsOfUsers(world, 1, 10, newArray);
    vm.expectRevert(MineSystem__GameIsNotFull.selector);
    world.resourceSystemInit(1);
  }

  function testNotAllUsersSubmit() public {
    string memory userName = "demir";
    address payable[] memory newUserArray = new address payable[](10);
    newUserArray[0] = user1;
    newUserArray[1] = user2;
    newUserArray[2] = user3;
    newUserArray[3] = user4;
    newUserArray[4] = user5;
    newUserArray[5] = user6;
    newUserArray[6] = user7;
    newUserArray[7] = user8;
    newUserArray[8] = user9;
    newUserArray[9] = user10;
    TestUtils.initializeCapacityWithUsers(world, 1, userName, newUserArray, 10);
    address payable[] memory newArray = new address payable[](1);
    newArray[0] = user1;
    TestUtils.initializeAllCastles(world, 1, newUserArray, 30, 30);
    TestUtils.initializeSeedsOfUsers(world, 1, 10, newArray);
    vm.expectRevert(MineSystem__NotAllUsersSubmitSeed.selector);
    world.resourceSystemInit(1);
  }

  function testAlreadyInited() public {
    string memory userName = "demir";
    address payable[] memory newUserArray = new address payable[](10);
    newUserArray[0] = user1;
    newUserArray[1] = user2;
    newUserArray[2] = user3;
    newUserArray[3] = user4;
    newUserArray[4] = user5;
    newUserArray[5] = user6;
    newUserArray[6] = user7;
    newUserArray[7] = user8;
    newUserArray[8] = user9;
    newUserArray[9] = user10;
    TestUtils.initializeMinePlaces(world, 1, 1, newUserArray, userName, 10);
    vm.expectRevert(MineSystem__ResourceInitialized.selector);
    world.resourceSystemInit(1);
  }

  function testNoAuthorizedForSeeding() public {
    string memory userName = "demir";
    address payable[] memory newUserArray = new address payable[](10);
    newUserArray[0] = user1;
    newUserArray[1] = user2;
    newUserArray[2] = user3;
    newUserArray[3] = user4;
    newUserArray[4] = user5;
    newUserArray[5] = user6;
    newUserArray[6] = user7;
    newUserArray[7] = user8;
    newUserArray[8] = user9;
    newUserArray[9] = user10;
    TestUtils.initializeMinePlaces(world, 1, 1, newUserArray, userName, 10);
    vm.expectRevert(MineSystem__NoAuthorized.selector);
    TestUtils.commitSeedWrapper(world, 1, 5, user11);
  }

  function testSucessfulMineInit() public {
    string memory userName = "demir";
    address payable[] memory newUserArray = new address payable[](10);
    newUserArray[0] = user1;
    newUserArray[1] = user2;
    newUserArray[2] = user3;
    newUserArray[3] = user4;
    newUserArray[4] = user5;
    newUserArray[5] = user6;
    newUserArray[6] = user7;
    newUserArray[7] = user8;
    newUserArray[8] = user9;
    newUserArray[9] = user10;
    bool isInitedBefore = ResourceInited.get(world, 1);
    bytes32[] memory foodBefore = LibQueries.getMines(world, address(0), 1, MineType.Food);
    bytes32[] memory woodBefore = LibQueries.getMines(world, address(0), 1, MineType.Wood);
    bytes32[] memory goldBefore = LibQueries.getMines(world, address(0), 1, MineType.Gold);

    TestUtils.initializeMinePlaces(world, 1, 1, newUserArray, userName, 10);

    bool isInitedAfter = ResourceInited.get(world, 1);
    bytes32[] memory foodAfter = LibQueries.getMines(world, address(0), 1, MineType.Food);
    bytes32[] memory woodAfter = LibQueries.getMines(world, address(0), 1, MineType.Wood);
    bytes32[] memory goldAfter = LibQueries.getMines(world, address(0), 1, MineType.Gold);

    assertEq(foodBefore.length, 0);
    assertEq(woodBefore.length, 0);
    assertEq(goldBefore.length, 0);
    assertGt(foodAfter.length, 0);
    assertGt(woodAfter.length, 0);
    assertGt(goldAfter.length, 0);
    assertEq(isInitedBefore, false);
    assertEq(isInitedAfter, true);
  }
}
