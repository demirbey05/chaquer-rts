//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { ArmyConfig, Position, ArmyOwnable, ArmyConfigData } from "../src/codegen/Tables.sol";

contract ArmySettleTest is NakamoTest {
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

  function testSuccesfulArmySettle() public {
    bytes32 entityID = TestUtils.settleArmy(world, 31, 31, 33, 33, 33, user1, 1);
    (address owner, uint256 gameID) = ArmyOwnable.get(world, entityID);
    (uint32 x, uint32 y, uint256 gameIDSecond) = Position.get(world, entityID);
    ArmyConfigData memory config = ArmyConfig.get(world, entityID);

    assertEq(owner, user1);
    assertEq(gameID, 1);
    assertEq(gameIDSecond, 1);
    assertEq(config.gameID, 1);
    assertEq(x, 36);
    assertEq(y, 1);
    assertEq(config.numSwordsman, 33);
    assertEq(config.numArcher, 33);
    assertEq(config.numCavalry, 33);
  }

  function testCoordinatesOutOfBound() public {
    vm.expectRevert(ArmySettle__CoordinatesOutOfBound.selector);
    TestUtils.settleArmy(world, 400, 300, 33, 33, 33, user1, 1);
  }

  function testCannotDeployWithoutCastle() public {
    vm.expectRevert(ArmySettle__NoCastle.selector);
    TestUtils.settleArmy(world, 36, 1, 33, 33, 33, user1, 1);
  }

  function testWrongTerrainType() public {
    vm.expectRevert(ArmySettle__WrongTerrainType.selector);
    TestUtils.settleArmy(world, 0, 5, 33, 33, 33, user1, 1);
  }

  function testTileIsNotEmpty() public {
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    TestUtils.settleArmy(world, 36, 1, 33, 33, 33, user1, 1);
    TestUtils.settleCastle(world, 34, 1, 1, user2);
    vm.expectRevert(ArmySettle__TileIsNotEmpty.selector);
    TestUtils.settleArmy(world, 36, 1, 33, 33, 33, user2, 1);
  }

  function testNoArmyRight() public {
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    TestUtils.settleArmy(world, 36, 1, 33, 33, 33, user1, 1);
    TestUtils.settleArmy(world, 37, 1, 33, 33, 33, user1, 1);
    TestUtils.settleArmy(world, 38, 1, 33, 33, 33, user1, 1);
    vm.expectRevert(ArmySettle__NoArmyRight.selector);
    TestUtils.settleArmy(world, 35, 0, 33, 33, 33, user1, 1);
  }

  function testTooFarToSettle() public {
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    vm.expectRevert(ArmySettle__TooFarToSettle.selector);
    TestUtils.settleArmy(world, 31, 1, 33, 33, 33, user1, 1);
  }

  function testTooManySoldiers() public {
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    vm.expectRevert(ArmySettle__TooManySoldier.selector);
    TestUtils.settleArmy(world, 38, 1, 33, 33, 35, user1, 1);
  }

  function testDeployOverCastle() public {
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    vm.expectRevert(ArmySettle__TileIsNotEmpty.selector);
    TestUtils.settleArmy(world, 35, 1, 33, 33, 35, user1, 1);
  }
}
