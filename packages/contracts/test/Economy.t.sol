//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { ResourceOwn } from "../src/codegen/Tables.sol";
import { LibQueries, LibUtils, LibMath } from "../src/libraries/Libraries.sol";
import { MineType } from "../src/codegen/Types.sol";
import { console } from "forge-std/console.sol";
import "../src/systems/EconomySystem.sol";

contract EconomyTest is NakamoTest {
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

  function testResourceCollectFirstInit() public {
    uint32 xCoord = 30;
    uint32 yCoord = 31;
    bytes32 armyID = TestUtils.settleArmy(world, xCoord, yCoord, 33, 33, 33, user1, 1);
    TestUtils.captureClosestMineInitial(world, armyID, user1, 1, MineType.Food);
    vm.roll(15);
    assertEq(LastCollectTime.get(world, user1, 1), 0);
    TestUtils.collectResource(world, user1, 1);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), startFood);
    assertEq(ResourceOwn.getNumOfWood(world, user1, 1), startWood);
    assertEq(ResourceOwn.getNumOfGold(world, user1, 1), startGold);
    assertEq(LastCollectTime.get(world, user1, 1), 15);
    vm.roll(20);
    TestUtils.collectResource(world, user1, 1);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), startFood + blockRate * 5 + mineRate * 5);
    assertEq(ResourceOwn.getNumOfWood(world, user1, 1), startWood + blockRate * 5);
    assertEq(ResourceOwn.getNumOfGold(world, user1, 1), startGold + blockRate * 5);
    assertEq(LastCollectTime.get(world, user1, 1), 20);
    vm.roll(21);
    TestUtils.collectResource(world, user1, 1);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), startFood + blockRate * 6 + mineRate * 6);
    assertEq(ResourceOwn.getNumOfWood(world, user1, 1), startWood + blockRate * 6);
    assertEq(ResourceOwn.getNumOfGold(world, user1, 1), startGold + blockRate * 6);
    TestUtils.captureClosestMineInitial(world, armyID, user1, 1, MineType.Wood);
    assertEq(LastCollectTime.get(world, user1, 1), 21);
    vm.roll(23);
    TestUtils.collectResource(world, user1, 1);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), startFood + blockRate * 8 + mineRate * 8);
    assertEq(ResourceOwn.getNumOfWood(world, user1, 1), startWood + blockRate * 8 + mineRate * 2);
    assertEq(ResourceOwn.getNumOfGold(world, user1, 1), startGold + blockRate * 8);
    assertEq(LastCollectTime.get(world, user1, 1), 23);
  }
}
