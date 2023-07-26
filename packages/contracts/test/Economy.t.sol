//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import { UD60x18, intoUint256 } from "@prb/math/src/UD60x18.sol";
import "../src/systems/Errors.sol";
import { ResourceOwn, GameMetaData, ResourceOwn, ResourcesSold, CreditOwn } from "../src/codegen/Tables.sol";
import { LibQueries, LibUtils, LibMath } from "../src/libraries/Libraries.sol";
import { LibVRGDA } from "../src/libraries/LibVRGDA.sol";
import { MineType } from "../src/codegen/Types.sol";
import "../src/systems/EconomySystem.sol";
import "../src/systems/MineInitSystem.sol";
import { console } from "forge-std/console.sol";

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
    vm.roll(5);
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

  function testSuccessfullTrade() public {
    uint256 startBlock = GameMetaData.getStartBlock(world, 1);
    vm.roll(6);
    TestUtils.collectResource(world, user1, 1);
    uint256 creditInitial = CreditOwn.get(world, 1, user1);
    assertEq(ResourcesSold.getFoodSold(world, 1), 0);
    TestUtils.sellResource(world, user1, 1, 500, MineType.Food);
    uint256 creditAfter = CreditOwn.get(world, 1, user1);
    console.log(creditAfter);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), 500);
    assertEq(ResourcesSold.getFoodSold(world, 1), 500);
    TestUtils.sellResource(world, user1, 1, 500, MineType.Food);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), 0);
    assertEq(ResourcesSold.getFoodSold(world, 1), 1000);
  }

  // To observe behavior of vrgda system

  function testVRGDA() public {
    world.economyIncreaseResource(user1, 1);
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Food, 0));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Wood, 0));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Gold, 0));
    console.log("-----");
    vm.roll(6);
    TestUtils.sellResource(world, user1, 1, 500, MineType.Food);
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Food, 1));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Wood, 1));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Gold, 1));
    console.log("-----");
    vm.roll(7);
    TestUtils.sellResource(world, user1, 1, 5000, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 5000, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 5000, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 5000, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 5000, MineType.Food);
    TestUtils.sellResource(world, user1, 1, 5000, MineType.Food);
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Food, 2));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Wood, 2));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Gold, 2));
    console.log("-----");
    vm.roll(8);
    TestUtils.sellResource(world, user1, 1, 500, MineType.Food);
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Food, 3));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Wood, 3));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Gold, 3));
    console.log("-----");
    vm.roll(9);
    TestUtils.sellResource(world, user1, 1, 500, MineType.Food);
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Food, 4));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Wood, 4));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Gold, 4));
    console.log("-----");
    vm.roll(10);
    TestUtils.sellResource(world, user1, 1, 500, MineType.Food);
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Food, 5));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Wood, 5));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Gold, 5));
    console.log("-----");
    vm.roll(11);
    TestUtils.sellResource(world, user1, 1, 500, MineType.Food);
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Food, 6));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Wood, 6));
    console.log(LibVRGDA.getResourcePrice(world, 1, MineType.Gold, 6));
    console.log("-----");
  }
}
