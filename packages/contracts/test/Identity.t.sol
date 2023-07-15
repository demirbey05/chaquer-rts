//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { PlayerSeeds, Players, LimitOfGame, NumberOfUsers, Position, MapConfig, ResourceOwnable, AddressToUsername } from "../src/codegen/Tables.sol";

contract IdentitySystemTest is NakamoTest {
  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    world.InitNumberOfGamer(1, 10);
  }

  function testNoInitializedMap() public {
    string memory userName = "demir";
    vm.expectRevert(IdentitySystem__GameDoesNotExist.selector);
    TestUtils.initializeID(world, 2, userName, user1);
  }

  function testAlreadyJoined() public {
    string memory userName = "demir";
    TestUtils.initializeID(world, 1, userName, user1);
    vm.expectRevert(IdentitySystem__AlreadyJoined.selector);
    TestUtils.initializeID(world, 1, userName, user1);
  }

  function testInvalidUserName() public {
    string
      memory userName = "sdfdsfsdfdsfdsfdsffsfdsfdsfdsfdsfdsfsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsfdsfdsfds";
    vm.expectRevert(IdentitySystem__InvalidUserName.selector);
    TestUtils.initializeID(world, 1, userName, user1);
  }

  function testGameIsFull() public {
    string memory userName = "demir";
    TestUtils.initializeID(world, 1, userName, user1);
    TestUtils.initializeID(world, 1, userName, user2);
    TestUtils.initializeID(world, 1, userName, user3);
    TestUtils.initializeID(world, 1, userName, user4);
    TestUtils.initializeID(world, 1, userName, user5);
    TestUtils.initializeID(world, 1, userName, user6);
    TestUtils.initializeID(world, 1, userName, user7);
    TestUtils.initializeID(world, 1, userName, user8);
    TestUtils.initializeID(world, 1, userName, user9);
    TestUtils.initializeID(world, 1, userName, user10);
    vm.expectRevert(IdentitySystem__GameIsFull.selector);
    TestUtils.initializeID(world, 1, userName, user11);
  }

  function testSuccessfulIdentityInit() public {
    string memory userName = "demir";
    bool isValidBefore = Players.get(world, 1, user1);
    uint256 numUserBefore = NumberOfUsers.get(world, 1);
    TestUtils.initializeID(world, 1, userName, user1);
    uint256 numUserAfter = NumberOfUsers.get(world, 1);
    bool isValidAfter = Players.get(world, 1, user1);
    string memory initUserName = AddressToUsername.get(world, user1, 1);
    assertEq(isValidBefore, false);
    assertEq(numUserBefore, 0);
    assertEq(numUserAfter, 1);
    assertEq(isValidAfter, true);
    assertEq(userName, initUserName);
  }
}
