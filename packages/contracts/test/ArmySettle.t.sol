//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { ArmyConfig, Position, ArmyOwnable, ArmyConfigData, CreditOwn, GameMetaData, SoldierCreated, MapConfig } from "../src/codegen/Tables.sol";
import { LibVRGDA } from "../src/libraries/LibVRGDA.sol";

contract ArmySettleTest is NakamoTest {
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

  function testSuccesfulArmySettle() public {
    string memory userName = "demir";

    vm.roll(5);
    TestUtils.initializeMinePlacesStorage(world, 1, 1, users, userName, 10);
    vm.roll(7);
    uint256 startBlock = GameMetaData.getStartBlock(world, 1);
    TestUtils.cheatCredit(world, user1, 1);
    uint256 initialCredit = CreditOwn.get(world, 1, user1);
    uint256 priceofSwordsman = LibVRGDA.getArmyPrice(world, 1, 0, block.number - startBlock);
    uint256 priceofArcher = LibVRGDA.getArmyPrice(world, 1, 1, block.number - startBlock);
    uint256 priceofCavalry = LibVRGDA.getArmyPrice(world, 1, 2, block.number - startBlock);
    bytes32 entityID = TestUtils.settleArmy(world, 30, 31, 33, 33, 33, user1, 1);
    (address owner, uint256 gameID) = ArmyOwnable.get(world, entityID);
    (uint32 x, uint32 y, uint256 gameIDSecond) = Position.get(world, entityID);
    ArmyConfigData memory config = ArmyConfig.get(world, entityID);

    assertEq(owner, user1);
    assertEq(gameID, 1);
    assertEq(gameIDSecond, 1);
    assertEq(config.gameID, 1);
    assertEq(x, 30);
    assertEq(y, 31);
    assertEq(config.numSwordsman, 33);
    assertEq(config.numArcher, 33);
    assertEq(config.numCavalry, 33);
    assertEq(SoldierCreated.getNumOfSwordsman(world, 1), 33);
    assertEq(SoldierCreated.getNumOfArcher(world, 1), 33);
    assertEq(SoldierCreated.getNumOfCavalry(world, 1), 33);
    assertEq(
      initialCredit - 33 * priceofSwordsman - 33 * priceofArcher - 33 * priceofCavalry,
      CreditOwn.get(world, 1, user1)
    );
  }

  function testCoordinatesOutOfBound() public {
    vm.expectRevert(ArmySettle__CoordinatesOutOfBound.selector);
    TestUtils.settleArmy(world, 400, 300, 33, 33, 33, user1, 1);
  }

  function testCannotDeployWithoutCastle() public {
    vm.expectRevert(ArmySettle__NoCastle.selector);
    TestUtils.settleArmy(world, 36, 1, 33, 33, 33, user1, 1);
  }

  function testTileIsNotEmpty() public {
    string memory userName = "demir";
    TestUtils.initializeMinePlacesStorage(world, 1, 1, users, userName, 10);
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    TestUtils.settleArmy(world, 30, 31, 33, 33, 33, user1, 1);
    vm.expectRevert(ArmySettle__TileIsNotEmpty.selector);
    TestUtils.settleArmy(world, 30, 31, 33, 33, 33, user2, 1);
  }

  function testNoArmyRight() public {
    string memory userName = "demir";
    TestUtils.initializeMinePlacesStorage(world, 1, 1, users, userName, 10);
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.settleArmy(world, 30, 31, 33, 33, 33, user1, 1);
    TestUtils.settleArmy(world, 31, 30, 33, 33, 33, user1, 1);
    TestUtils.settleArmy(world, 29, 30, 33, 33, 33, user1, 1);
    vm.expectRevert(ArmySettle__NoArmyRight.selector);
    TestUtils.settleArmy(world, 29, 31, 33, 33, 33, user1, 1);
  }

  function testTooFarToSettle() public {
    string memory userName = "demir";
    TestUtils.initializeMinePlacesStorage(world, 1, 1, users, userName, 10);
    TestUtils.cheatCredit(world, user1, 1);
    vm.expectRevert(ArmySettle__TooFarToSettle.selector);
    TestUtils.settleArmy(world, 25, 25, 33, 33, 33, user1, 1);
  }

  function testTooManySoldiers() public {
    string memory userName = "demir";
    TestUtils.initializeMinePlacesStorage(world, 1, 1, users, userName, 10);
    TestUtils.cheatCredit(world, user1, 1);
    vm.expectRevert(ArmySettle__TooManySoldier.selector);
    TestUtils.settleArmy(world, 31, 30, 332, 332, 35, user1, 1);
  }

  function testDeployOverCastle() public {
    string memory userName = "demir";
    TestUtils.initializeMinePlacesStorage(world, 1, 1, users, userName, 10);
    vm.expectRevert(ArmySettle__TileIsNotEmpty.selector);
    TestUtils.settleArmy(world, 30, 30, 33, 33, 35, user1, 1);
  }
}
