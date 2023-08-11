//SPDX-License-Identifier:MIT

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { ArmyConfig, Position, ArmyOwnable, ArmyConfigData } from "../src/codegen/Tables.sol";
pragma solidity ^0.8.0;

contract AttackSystemTest is NakamoTest {
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

  function testArmyFightOne() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 19, 67, 12, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 44, 15, 25, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world, armyTwo);
    assertEq(TestUtils.isArmyExist(world, armyOne), true);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world, armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
    assertEq(TestUtils.isArmyExist(world, armyOne), false);
  }

  function testArmyFightTwo() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 62, 20, 8, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 66, 14, 11, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world, armyTwo);
    assertEq(TestUtils.isArmyExist(world, armyOne), true);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world, armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
    assertEq(TestUtils.isArmyExist(world, armyOne), false);
  }

  function testArmyFightThree() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 53, 21, 2, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 24, 28, 43, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world, armyTwo);
    assertEq(TestUtils.isArmyExist(world, armyOne), true);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world, armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
    assertEq(TestUtils.isArmyExist(world, armyOne), false);
  }

  function testArmyFightFour() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 67, 26, 6, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 50, 19, 14, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world, armyOne);
    assertEq(TestUtils.isArmyExist(world, armyTwo), true);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world, armyOne);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 1);
    assertEq(TestUtils.isArmyExist(world, armyTwo), false);
  }

  function testArmyFightFive() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 94, 3, 1, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world, armyOne);
    assertEq(TestUtils.isArmyExist(world, armyTwo), true);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world, armyOne);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 1);
    assertEq(TestUtils.isArmyExist(world, armyTwo), false);
  }

  function testTieTwoArmy() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 97, 2, 0, user2, 1);
    assertEq(TestUtils.isArmyExist(world, armyTwo), true);
    assertEq(TestUtils.isArmyExist(world, armyOne), true);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    assertEq(winnerid, 0);
    assertEq(TestUtils.isArmyExist(world, armyTwo), false);
    assertEq(TestUtils.isArmyExist(world, armyOne), false);
  }

  function testArmyNotBelongYou() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user2, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 97, 2, 0, user2, 1);
    vm.expectRevert(AttackSystem__ArmyNotBelongYou.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user2, 1);
  }

  function testFriendFire() public {
    TestUtils.cheatCredit(world, user1, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 31, 97, 2, 0, user1, 1);
    vm.expectRevert(AttackSystem__NoFriendFire.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
  }

  function testTooAwayToAttack() public {
    TestUtils.cheatCredit(world, user1, 1);
    TestUtils.cheatCredit(world, user3, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 29, 29, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 33, 97, 2, 0, user3, 1);

    vm.expectRevert(AttackSystem__TooAwayToAttack.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
  }

  function testNoArmy() public {
    TestUtils.cheatCredit(world, user1, 1);
    bytes32 armyOne = TestUtils.settleArmy(world, 31, 30, 97, 2, 0, user1, 1);
    vm.expectRevert(AttackSystem__NoArmy.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, keccak256(bytes("x-y-z")), user1, 1);
  }
}
