//SPDX-License-Identifier:MIT

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { CreditOwn, ResourceOwn, GameMetaData, ResourcesSold } from "../src/codegen/Tables.sol";
import { LibVRGDA } from "../src/libraries/LibVRGDA.sol";
import { MineType } from "../src/codegen/Types.sol";
pragma solidity ^0.8.0;

contract BuySystem is NakamoTest {
  address payable[] users;

  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/naval_test_map.txt", 50, 50, 1);
    string memory userName = "demir";
    address testUser1 = 0xa45448cea0B6258807380390D61125be4ac6566B;
    users.push(user1);
    users.push(user2);
    users.push(user3);
    users.push(user4);
    users.push(user5);
    users.push(user6);
    users.push(user7);
    users.push(user8);
    users.push(user9);
    users.push(payable(testUser1));
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.initializeAllCastlesStorage(world, 1, users, 9, 9);
    TestUtils.initializeSeedsOfUsersStorage(world, 1, 5, users);
    world.resourceSystemInit(1);
  }

  function testSuccessfulBuy() public {
    TestUtils.cheatCredit(world, user1, 1, 100000);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), 0);
    uint256 startBlock = GameMetaData.getStartBlock(1);
    vm.startPrank(user1);
    uint256 price = LibVRGDA.getResourcePrice(world, 1, MineType.Food, block.number - startBlock);
    world.buyResource(1, 100, MineType.Food);
    vm.stopPrank();
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), 100);
    assertEq(CreditOwn.get(world, 1, user1), 100000 * 1e18 - price * 100);
    assertEq(ResourcesSold.getFoodSold(world, 1), 900);
  }

  function testInsufficientCredit() public {
    vm.startPrank(user1);
    vm.expectRevert(EconomySystem__InsufficientCredit.selector);
    world.buyResource(1, 100, MineType.Food);
    vm.stopPrank();
  }

  function testInsufficientSUpply() public {
    TestUtils.cheatCredit(world, user1, 1, 100000);
    TestUtils.cheatCredit(world, user2, 1, 100000);

    for (uint i = 0; i < 10; i++) {
      TestUtils.buyResource(world, user1, 1, 100, MineType.Food);
    }
    vm.expectRevert(EconomySystem__InsufficientSupply.selector);
    TestUtils.buyResource(world, user2, 1, 100, MineType.Food);
  }
}
