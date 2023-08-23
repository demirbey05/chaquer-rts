//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { GameMetaData, NumberOfUsers } from "../src/codegen/Tables.sol";
import { LibQueries } from "../src/libraries/LibQueries.sol";
import { State } from "../src/codegen/Types.sol";
import { MineType } from "../../src/codegen/Types.sol";

contract GameSystemTest is NakamoTest {
  address payable[] users;

  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/map_full_land.txt", 50, 50, 1);
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
  }

  function testSuccessTransitionWaitingToStarted() public {
    string memory userName = "demir";
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    assertEq(uint(GameMetaData.getState(world, 1)), uint(State.Waiting));
    TestUtils.initializeAllCastlesStorage(world, 1, users, 30, 30);
    TestUtils.initializeSeedsOfUsersStorage(world, 1, 5, users);
    world.resourceSystemInit(1);
    assertEq(uint(GameMetaData.getState(world, 1)), uint(State.Started));
  }

  function testUserCannotEnterAfterGameStarted() public {
    string memory userName = "demir";
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.initializeAllCastlesStorage(world, 1, users, 30, 30);
    TestUtils.initializeSeedsOfUsersStorage(world, 1, 5, users);
    world.resourceSystemInit(1);
    vm.startPrank(user1);
    world.collectResource(1);
    vm.stopPrank();
    TestUtils.sellResource(world, user1, 1, 100, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Wood);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Gold);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 31, 5, 5, 5, user1, 1);
    bytes32[] memory castles = LibQueries.getOwnedCastleIDs(world, user2, 1);
    assertEq(NumberOfUsers.get(world, 1), 10);
    TestUtils.attackCastle(world, armyOne, castles[0], user1);
    assertEq(NumberOfUsers.get(world, 1), 9);
    vm.expectRevert(IdentitySystem__WrongState.selector);
    TestUtils.initializeID(world, 1, userName, user11);
  }

  function testFinishTheGame() public {
    string memory userName = "demir";
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.initializeAllCastlesStorage(world, 1, users, 30, 30, 2, 0);
    TestUtils.initializeSeedsOfUsersStorage(world, 1, 5, users);
    world.resourceSystemInit(1);
    vm.startPrank(user1);
    world.collectResource(1);
    vm.stopPrank();
    TestUtils.sellResource(world, user1, 1, 100, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Wood);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Gold);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 5, 5, 5, user1, 1);
    for (uint i = 1; i < users.length; i++) {
      TestUtils.moveArmy(world, armyOne, uint32(31 + (i * 2)), 30, user1, 1);
      bytes32[] memory castles = LibQueries.getOwnedCastleIDs(world, users[i], 1);
      TestUtils.attackCastle(world, armyOne, castles[0], user1);
      assertEq(NumberOfUsers.get(world, 1), 10 - i);
    }
    assertEq(uint(GameMetaData.getState(world, 1)), uint(State.Started));
    world.claimWinner(user1, 1);
    assertEq(GameMetaData.getWinner(world, 1), user1);
    assertEq(uint(GameMetaData.getState(world, 1)), uint(State.Completed));
  }

  function testWrongWinnerClaim() public {
    string memory userName = "demir";
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.initializeAllCastlesStorage(world, 1, users, 30, 30, 2, 0);
    TestUtils.initializeSeedsOfUsersStorage(world, 1, 5, users);
    world.resourceSystemInit(1);
    vm.startPrank(user1);
    world.collectResource(1);
    vm.stopPrank();
    TestUtils.sellResource(world, user1, 1, 100, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Wood);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Gold);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 5, 5, 5, user1, 1);
    for (uint i = 1; i < users.length; i++) {
      TestUtils.moveArmy(world, armyOne, uint32(31 + (i * 2)), 30, user1, 1);
      bytes32[] memory castles = LibQueries.getOwnedCastleIDs(world, users[i], 1);
      TestUtils.attackCastle(world, armyOne, castles[0], user1);
      assertEq(NumberOfUsers.get(world, 1), 10 - i);
    }
    vm.expectRevert(GameSystem__NotPlayer.selector);
    world.claimWinner(user2, 1);
  }

  function testWrongStateClaim() public {
    string memory userName = "demir";
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.initializeAllCastlesStorage(world, 1, users, 30, 30, 2, 0);
    TestUtils.initializeSeedsOfUsersStorage(world, 1, 5, users);
    world.resourceSystemInit(1);
    vm.startPrank(user1);
    world.collectResource(1);
    vm.stopPrank();
    TestUtils.sellResource(world, user1, 1, 100, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Wood);
    TestUtils.sellResource(world, user1, 1, 100, MineType.Gold);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 5, 5, 5, user1, 1);
    for (uint i = 1; i < users.length - 1; i++) {
      TestUtils.moveArmy(world, armyOne, uint32(31 + (i * 2)), 30, user1, 1);
      bytes32[] memory castles = LibQueries.getOwnedCastleIDs(world, users[i], 1);
      TestUtils.attackCastle(world, armyOne, castles[0], user1);
      assertEq(NumberOfUsers.get(world, 1), 10 - i);
    }
    vm.expectRevert(GameSystem__WrongClaim.selector);
    world.claimWinner(user1, 1);
  }

  function testClaimAtInitial() public {
    string memory userName = "demir";
    world.InitNumberOfGamer(1, 10);
    TestUtils.initializeID(world, 1, userName, user1);
    assertEq(NumberOfUsers.get(world, 1), 1);
    vm.expectRevert(GameSystem__WrongState.selector);
    world.claimWinner(user1, 1);
  }
}
