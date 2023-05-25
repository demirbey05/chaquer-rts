//SPDX-License-Identifier:MIT

import { NakamoTest } from "./utils/NakamoTest.sol";
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

    ArmyConfigData memory oldConfig = ArmyConfig.get(world,armyTwo);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world,armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
  }
  
  function testArmyFightTwo() public {

    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 62, 20, 8, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 66, 14, 11, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world,armyTwo);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world,armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
  }
  

  function testArmyFightThree() public {

    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 53, 21, 2, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 24, 28, 43, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world,armyTwo);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world,armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
  }

  function testArmyFightFour() public {

    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 50, 19, 14, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world,armyOne);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world,armyOne);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 1);
  }

  function testArmyFightFive() public {

    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 94, 3, 1, user2, 1);

    ArmyConfigData memory oldConfig = ArmyConfig.get(world,armyOne);

    uint256 winnerid = TestUtils.attackArmy(world, armyOne, armyTwo, user1, 1);
    ArmyConfigData memory newConfig = ArmyConfig.get(world,armyOne);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 1);
  }
    
  function testTieTwoArmy() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 97, 2, 0, user2, 1);

    vm.startPrank(alice);
    bool isOneExist = armyConfig.has(armyOne);
    bool isTwoExist = armyConfig.has(armyTwo);

    bytes memory winner = attackSystem.execute(abi.encode(armyOne, armyTwo));
    (uint256 winnerid, int32 score) = abi.decode(winner, (uint256, int32));

    bool newIsOneExist = armyConfig.has(armyOne);
    bool newIsTwoExist = armyConfig.has(armyTwo);
    assertEq(winnerid, 0);
    assertTrue(isOneExist == true);
    assertTrue(isTwoExist == true);
    assertTrue(newIsOneExist == false);
    assertTrue(newIsTwoExist == false);
  }
   function testArmyNotBelongYou() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(34, 35);
    armySettle.execute(abi.encode(33, 35, 33, 33, 34));
    uint256 armyOneID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.stopPrank();
    vm.startPrank(bob);
    settleSystem.executeTyped(35, 35);
    armySettle.execute(abi.encode(33, 36, 33, 33, 34));
    uint256 armyTwoID = armyOwnable.getEntitiesWithValue(bob)[0];
    vm.stopPrank();
    vm.expectRevert(AttackSystem__ArmyNotBelongYou.selector);
    attackSystem.execute(abi.encode(armyOneID, armyTwoID));
  }

  function testFriendFire() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(34, 35);
    armySettle.execute(abi.encode(33, 35, 33, 33, 34));
    armySettle.execute(abi.encode(32, 35, 33, 33, 34));
    uint256 armyOneID = armyOwnable.getEntitiesWithValue(alice)[0];
    uint256 armyTwoID = armyOwnable.getEntitiesWithValue(alice)[1];
    vm.expectRevert(AttackSystem__NoFriendFire.selector);
    attackSystem.execute(abi.encode(armyOneID, armyTwoID));
  }

  function testTooAwayToAttack() public {
    vm.startPrank(bob);
    settleSystem.executeTyped(34, 35);
    armySettle.execute(abi.encode(33, 35, 33, 33, 34));
    vm.stopPrank();

    vm.startPrank(alice);
    settleSystem.executeTyped(38, 38);
    armySettle.execute(abi.encode(37, 38, 33, 33, 34));
    uint256 armyOneID = armyOwnable.getEntitiesWithValue(alice)[0];
    uint256 armyTwoID = armyOwnable.getEntitiesWithValue(bob)[0];

    vm.expectRevert(AttackSystem__TooAwayToAttack.selector);
    attackSystem.execute(abi.encode(armyOneID, armyTwoID));
    vm.stopPrank();
  }

  function testNoArmy() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(34, 35);
    armySettle.execute(abi.encode(33, 35, 33, 33, 34));
    uint256 armyOneID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(AttackSystem__NoArmy.selector);
    attackSystem.execute(abi.encode(armyOneID, 50000));
    vm.stopPrank();
  */
}
