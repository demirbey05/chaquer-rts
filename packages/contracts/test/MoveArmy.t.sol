//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import {TestUtils} from "./utils/TestUtils.sol";
import {NakamoTest} from "./utils/NakamoTest.sol";
import {Position} from "../src/codegen/Tables.sol";
import "../src/systems/Errors.sol";


contract MoveArmyTest is NakamoTest {

    function setUp() public override {
        super.setUp();
        TestUtils.initMap(world,"test/mock_data/map.txt",50,50,1);
        TestUtils.settleCastle(world,35,1,1,user1);
    }

    function testSuccessArmyMove() public {
        bytes32 armyID = TestUtils.settleArmy(world,36,1,33,33,33,user1,1);
        TestUtils.moveArmy(world,armyID,38,2,user1,1);
        (uint32 x,uint32 y,uint256 gameIDSecond) = Position.get(world,armyID);
        assertEq(x,38);
        assertEq(y,2);
    }
    function testMoveAnotherArmy() public {
    bytes32 armyID = TestUtils.settleArmy(world,36,1,33,33,33,user1,1);
    vm.expectRevert(MoveArmy__NoAuthorized.selector);
    TestUtils.moveArmy(world,armyID,38,2,user2,1);

    } 
    function testWrongGameIDArmy() public {
    bytes32 armyID = TestUtils.settleArmy(world,36,1,33,33,33,user1,1);
    vm.expectRevert(MoveArmy__NoAuthorized.selector);
    TestUtils.moveArmy(world,armyID,38,2,user1,2);

    } 

    function testMoveTooFar() public {
    bytes32 armyID = TestUtils.settleArmy(world,36,1,33,33,33,user1,1);
    vm.expectRevert(MoveArmy__TooFar.selector);
    TestUtils.moveArmy(world,armyID,31,2,user1,1);

    }

  function testTileIsNotEmpty() public {
    bytes32 armyID = TestUtils.settleArmy(world,36,1,33,33,33,user1,1);
    vm.expectRevert(MoveArmy__TileIsNotEmpty.selector);
    TestUtils.moveArmy(world,armyID,35,1,user1,1);

   }

  function testTileIsNotEmptyArmy() public {
    bytes32 armyID = TestUtils.settleArmy(world,36,1,33,33,33,user1,1);
    TestUtils.settleCastle(world,38,1,1,user2);
    bytes32 armyIDTwo = TestUtils.settleArmy(world,37,1,33,33,33,user2,1);
    vm.expectRevert(MoveArmy__TileIsNotEmpty.selector);
    TestUtils.moveArmy(world,armyIDTwo,36,1,user2,1);
  }



}