//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import {LibQueries} from "../src/libraries/LibQueries.sol";
import "../src/systems/Errors.sol";

contract CaptureTest is NakamoTest {
    bytes32 castleIDFirst;
  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    castleIDFirst = TestUtils.settleCastle(world, 35, 1, 1, user1);
  }

  function testSiegeOne() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 19, 67, 12, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 44, 15, 25, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 2);
  }

  function testSiegeTwo() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 62, 20, 8, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 66, 14, 11, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 2);
  }

  function testSiegeThree() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 53, 21, 2, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 24, 28, 43, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 2);
  }

  function testSiegeFour() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 50, 19, 14, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 1);
  }

  function testSiegeFive() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 94, 3, 1, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 1);
  }

  function testMultipleArmySiegeOne() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    TestUtils.settleArmy(world, 32, 1, 47, 3, 1, user2, 1);
    TestUtils.settleArmy(world, 31, 1, 47, 0, 0, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 1);
  }

  function testMultipleArmySiegeTwo() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 19, 67, 12, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    TestUtils.settleArmy(world, 32, 1, 44, 15, 0, user2, 1);
    TestUtils.settleArmy(world, 31, 1, 0, 0, 25, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 2);
  }

  function testMultipleArmySiegeThree() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    TestUtils.settleArmy(world, 32, 1, 50, 0, 0, user2, 1);
    TestUtils.settleArmy(world, 31, 1, 0, 19, 0, user2, 1);
    TestUtils.settleArmy(world, 30, 1, 0, 0, 14, user2, 1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(result, 1);
  }

  function testNoArmySiege() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(1, result);
  }

  function testNoCloseArmySiege() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 50, 0, 0, user2, 1);
    TestUtils.moveArmy(world,armyTwo,29,1,user2,1);
    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(1, result);
  }

  function testSiegeWithAwayedArmy() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 50, 0, 0, user2, 1);

    TestUtils.moveArmy(world,armyTwo,29,1,user2,1);
    bytes32[] memory aliceArmiesBefore = LibQueries.getOwnedArmyIDs(world,user2,1);
    assertEq(1, aliceArmiesBefore.length);

    uint256 result = TestUtils.attackCastle(world, armyOne, castleID, user1);
    assertEq(1, result);
    bytes32[] memory aliceArmiesAfter = LibQueries.getOwnedArmyIDs(world,user2,1);
    assertEq(0, aliceArmiesAfter.length);
  }
  function testNoAuthorization() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    vm.expectRevert(CaptureSystem__NoAuthorization.selector);
    TestUtils.attackCastle(world, armyOne, castleID, user3);
  }

  function testFailInvalidArmyID() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    TestUtils.attackCastle(world, keccak256(abi.encode(500)), castleID, user1);
  }

  function testFailInvalidCastleID() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
    vm.expectRevert(CaptureSystem__NoAuthorization.selector);
    TestUtils.attackCastle(world, armyOne, keccak256(abi.encode(500)), user1);
  }

  function testFriendlyFire() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);

    vm.expectRevert(CaptureSystem__FriendFireNotAllowed.selector);
    TestUtils.attackCastle(world, armyOne, castleIDFirst, user1);
  }

  function testTooFarToAttack() public {
    bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
    bytes32 castleID = TestUtils.settleCastle(world, 30, 1, 1, user2);
    vm.expectRevert(CaptureSystem__TooFarToAttack.selector);
    TestUtils.attackCastle(world, armyOne, castleID, user1);

  }
}
