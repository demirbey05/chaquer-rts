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
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    vm.stopPrank();
    vm.startPrank(bob);
    uint256 foreignArmy = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(MoveArmy__NoAuthorized.selector);
    moveArmy.execute(abi.encode(foreignArmy, 38, 40));
    vm.stopPrank();
  }

    function testMoveTooFar() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    uint256 armyID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(MoveArmy__TooFar.selector);
    moveArmy.execute(abi.encode(armyID, 41, 40));
    vm.stopPrank();
    }

  function testTileIsNotEmpty() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    uint256 armyID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(MoveArmy__TileIsNotEmpty.selector);
    moveArmy.execute(abi.encode(armyID, 38, 40));
    vm.stopPrank();
   }

  function testTileIsNotEmptyArmy() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    vm.stopPrank();
    vm.startPrank(bob);
    settleSystem.executeTyped(39, 40);
    armySettle.execute(abi.encode(38, 41, 33, 33, 34));
    uint256 armyID = armyOwnable.getEntitiesWithValue(bob)[0];
    vm.expectRevert(MoveArmy__TileIsNotEmpty.selector);
    moveArmy.execute(abi.encode(armyID, 37, 40));

    vm.stopPrank();
  }



}