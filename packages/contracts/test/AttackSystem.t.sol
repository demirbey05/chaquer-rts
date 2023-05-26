//SPDX-License-Identifier:MIT

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { ArmyConfig, Position, ArmyOwnable, ArmyConfigData } from "../src/codegen/Tables.sol";
pragma solidity ^0.8.0;

contract AttackSystemTest is NakamoTest {
  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    TestUtils.settleCastle(world, 33, 1, 1, user2);
  }

  function testArmyFightOne() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 19, 67, 12, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 44, 15, 25, user2, 1);

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
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 62, 20, 8, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 66, 14, 11, user2, 1);

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
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 53, 21, 2, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 24, 28, 43, user2, 1);

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
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 50, 19, 14, user2, 1);

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
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 94, 3, 1, user2, 1);

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
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 97, 2, 0, user2, 1);
    assertEq(TestUtils.isArmyExist(world, armyTwo), true);
    assertEq(TestUtils.isArmyExist(world, armyOne), true);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    assertEq(winnerid, 0);
    assertEq(TestUtils.isArmyExist(world, armyTwo), false);
    assertEq(TestUtils.isArmyExist(world, armyOne), false);
  }

  function testArmyNotBelongYou() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 97, 2, 0, user2, 1);
    vm.expectRevert(AttackSystem__ArmyNotBelongYou.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user2, 1);
  }

  function testFriendFire() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 97, 2, 0, user1, 1);
    vm.expectRevert(AttackSystem__NoFriendFire.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
  }

  function testTooAwayToAttack() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    TestUtils.settleCastle(world, 30, 1, 1, user3);
    bytes32 armyTwo = TestUtils.settleArmy(world, 29, 1, 97, 2, 0, user3, 1);

    vm.expectRevert(AttackSystem__TooAwayToAttack.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
  }

  function testNoArmy() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    vm.expectRevert(AttackSystem__NoArmy.selector);
    uint256 winnerid = TestUtils.attackArmy(world, armyOne, keccak256(bytes("x-y-z")), user1, 1);
  }
}
