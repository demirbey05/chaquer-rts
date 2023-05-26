//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";


contract CaptureTest is NakamoTest {
    function setUp() public override {
        super.setUp();
        TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
        TestUtils.settleCastle(world, 35, 1, 1, user1);
        
    }
    function testSiegeOne() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 19, 67, 12, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 44, 15, 25, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        assertEq(result , 2);
    }
    function testSiegeTwo() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 62, 20, 8, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 66, 14, 11, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        assertEq(result , 2);
    }
    function testSiegeThree() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1,  53, 21, 2, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1,  24, 28, 43, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        assertEq(result , 2);
    }
    function testSiegeFour() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 50, 19, 14, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        assertEq(result , 1);
    }
    function testSiegeFive() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        bytes32 armyTwo = TestUtils.settleArmy(world, 32, 1, 94, 3, 1, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        assertEq(result , 1);
    }
    function testMultipleArmySiegeOne() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 97, 2, 0, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        TestUtils.settleArmy(world, 32, 1, 47, 3, 1, user2, 1);
        TestUtils.settleArmy(world, 31, 1, 47, 0, 0, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        assertEq(result , 1);
    }
    function testMultipleArmySiegeTwo() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 19, 67, 12, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        TestUtils.settleArmy(world, 32, 1, 44, 15, 0, user2, 1);
        TestUtils.settleArmy(world, 31, 1, 0, 0, 25, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        assertEq(result , 2);
    }
    function testMultipleArmySiegeThree() public {
        bytes32 armyOne = TestUtils.settleArmy(world, 34, 1, 67, 26, 6, user1, 1);
        bytes32 castleID = TestUtils.settleCastle(world, 33, 1, 1, user2);
        TestUtils.settleArmy(world, 32, 1, 50, 0, 0, user2, 1);
        TestUtils.settleArmy(world, 31, 1, 0, 19, 0, user2, 1);
        TestUtils.settleArmy(world, 30, 1, 0, 0, 14, user2, 1);
        uint256 result = TestUtils.attackCastle(world,armyOne,castleID,user1);
        //assertEq(result , 1);
    }

  

}