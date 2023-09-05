//SPDX-License-Identifier:MIT

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { CreditOwn, ResourceOwn, DockOwnable, Position } from "../src/codegen/Tables.sol";
import { baseCostDock, baseWoodCostDock } from "../src/systems/Constants.sol";
pragma solidity ^0.8.0;

contract BuildDockTest is NakamoTest {
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

  function testCreditTestFunctions() public {
    assertEq(CreditOwn.get(world, 1, user1), 0);
    TestUtils.cheatCredit(world, user1, 1, 100000);
    assertEq(CreditOwn.get(world, 1, user1), 100000 * 1e18);
  }

  function testResourceTestFunctions() public {
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), 0);
    assertEq(ResourceOwn.getNumOfWood(world, user1, 1), 0);
    assertEq(ResourceOwn.getNumOfGold(world, user1, 1), 0);
    TestUtils.cheatResource(world, user1, 1, 100000);
    assertEq(ResourceOwn.getNumOfFood(world, user1, 1), 100000);
    assertEq(ResourceOwn.getNumOfWood(world, user1, 1), 100000);
    assertEq(ResourceOwn.getNumOfGold(world, user1, 1), 100000);
  }

  function testSuccessfullDockBuild() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    TestUtils.cheatResource(world, users[9], 1, 100000);
    assertEq(CreditOwn.get(world, 1, users[9]), 100000 * 1e18);
    assertEq(ResourceOwn.getNumOfWood(world, users[9], 1), 100000);

    // user1 has 18 18 castle
    bytes32 armyID = TestUtils.settleArmy(world, 19, 18, 15, 15, 15, users[9], 1);
    bytes32 dockID = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 19, 1);
    assertEq(CreditOwn.get(world, 1, users[9]), 100000 * 1e18 - (baseCostDock * 1e18) - 45 * 1e18);
    assertEq(ResourceOwn.getNumOfWood(world, users[9], 1), 100000 - baseWoodCostDock);
    (address dockOwner, uint256 gameID) = DockOwnable.get(dockID);
    (uint256 x, uint y, ) = Position.get(dockID);

    assertEq(dockOwner, users[9]);
    assertEq(gameID, 1);
    assertEq(x, 19);
    assertEq(y, 19);
  }

  function testTwoSuccessfullDockBuild() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    TestUtils.cheatResource(world, users[9], 1, 100000);
    assertEq(CreditOwn.get(world, 1, users[9]), 100000 * 1e18);
    assertEq(ResourceOwn.getNumOfWood(world, users[9], 1), 100000);

    // user1 has 18 18 castle
    bytes32 armyID = TestUtils.settleArmy(world, 19, 18, 15, 15, 15, users[9], 1);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 19, 1);
    bytes32 dockIDTwo = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 20, 1);
    assertEq(
      CreditOwn.get(world, 1, users[9]),
      100000 * 1e18 - (baseCostDock * 1e18) - 45 * 1e18 - (2 * baseCostDock * 1e18)
    );
    assertEq(ResourceOwn.getNumOfWood(world, users[9], 1), 100000 - baseWoodCostDock - 2 * baseWoodCostDock);
    (address dockOwnerOne, ) = DockOwnable.get(dockIDOne);
    (address dockOwnerTwo, ) = DockOwnable.get(dockIDTwo);
    (uint256 x, uint y, ) = Position.get(dockIDOne);
    (uint256 xOne, uint yOne, ) = Position.get(dockIDTwo);

    assertEq(dockOwnerOne, users[9]);
    assertEq(dockOwnerTwo, users[9]);
    assertEq(x, 19);
    assertEq(y, 19);
    assertEq(xOne, 19);
    assertEq(yOne, 20);
  }

  function testInsufficientCredit() public {
    TestUtils.cheatResource(world, users[9], 1, 100000);
    TestUtils.cheatCredit(world, users[9], 1, 50);
    assertEq(CreditOwn.get(world, 1, users[9]), 50 * 1e18);
    assertEq(ResourceOwn.getNumOfWood(world, users[9], 1), 100000);
    bytes32 armyID = TestUtils.settleArmy(world, 19, 18, 15, 15, 15, users[9], 1);
    vm.expectRevert(NavalSystem__UnsufficientBalance.selector);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 20, 1);
  }

  function testInsufficientWood() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    assertEq(CreditOwn.get(world, 1, users[9]), 100000 * 1e18);
    assertEq(ResourceOwn.getNumOfWood(world, users[9], 1), 0);
    bytes32 armyID = TestUtils.settleArmy(world, 19, 18, 15, 15, 15, users[9], 1);
    vm.expectRevert(NavalSystem__UnsufficientBalance.selector);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 20, 1);
  }

  function testArmyIsFarAway() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    TestUtils.cheatResource(world, users[9], 1, 100000);
    bytes32 armyID = TestUtils.settleArmy(world, 16, 18, 15, 15, 15, users[9], 1);
    vm.expectRevert(NavalSystem__ArmyIsTooFar.selector);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 20, 1);
  }

  function testArmySizeIsLow() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    TestUtils.cheatResource(world, users[9], 1, 100000);
    bytes32 armyID = TestUtils.settleArmy(world, 19, 18, 4, 5, 5, users[9], 1);
    vm.expectRevert(NavalSystem__ArmySizeIsLow.selector);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 20, 1);
  }

  function testNotSeaSide() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    TestUtils.cheatResource(world, users[9], 1, 100000);
    bytes32 armyID = TestUtils.settleArmy(world, 16, 18, 15, 15, 15, users[9], 1);
    vm.expectRevert(NavalSystem__NotSeaSide.selector);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 17, 18, 1);
  }

  function testTileIsNotEmpty() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    TestUtils.cheatResource(world, users[9], 1, 100000);

    // user1 has 18 18 castle
    bytes32 armyID = TestUtils.settleArmy(world, 19, 18, 15, 15, 15, users[9], 1);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 20, 1);
    vm.expectRevert(NavalSystem__TileIsNotEmpty.selector);
    bytes32 dockIDTwo = TestUtils.buildDockWrapper(world, users[9], armyID, 19, 20, 1);
  }

  function testWrongTile() public {
    TestUtils.cheatCredit(world, users[9], 1, 100000);
    TestUtils.cheatResource(world, users[9], 1, 100000);

    // user1 has 18 18 castle
    bytes32 armyID = TestUtils.settleArmy(world, 19, 18, 15, 15, 15, users[9], 1);
    vm.expectRevert(NavalSystem__WrongTile.selector);
    bytes32 dockIDOne = TestUtils.buildDockWrapper(world, users[9], armyID, 20, 18, 1);
  }
}
