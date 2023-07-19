// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";

import { CastleOwnable, CastleOwnableTableId, MapConfig, Position } from "../src/codegen/Tables.sol";
import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";

contract CastleSettleTest is NakamoTest {
  address payable[] users;

  function setUp() public override {
    super.setUp();
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

  function testSettleCastle() public {
    string memory userName = "dem";
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    bytes32 entityID = TestUtils.settleCastle(world, 35, 1, 1, user1);
    (address owner, uint256 gameID) = CastleOwnable.get(world, entityID);
    (uint32 x, uint32 y, uint256 gameIDPos) = Position.get(world, entityID);
    assertEq(owner, user1);
    assertEq(gameID, 1);
    assertEq(gameIDPos, 1);
    assertEq(x, 35);
    assertEq(y, 1);
  }

  function testDifferentCastleSettle() public {
    string memory userName = "dem";
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    bytes32 entityOneID = TestUtils.settleCastle(world, 35, 1, 1, user1);
    bytes32 entityTwoID = TestUtils.settleCastle(world, 37, 1, 1, user2);

    (address ownerOne, uint256 gameIDOne) = CastleOwnable.get(world, entityOneID);
    (uint32 xOne, uint32 yOne, uint256 gameIDPosOne) = Position.get(world, entityOneID);

    (address ownerTwo, uint256 gameIDTwo) = CastleOwnable.get(world, entityTwoID);
    (uint32 xTwo, uint32 yTwo, uint256 gameIDPosTwo) = Position.get(world, entityTwoID);

    assertEq(ownerOne, user1);
    assertEq(gameIDOne, 1);
    assertEq(gameIDPosOne, 1);
    assertEq(xOne, 35);
    assertEq(yOne, 1);

    assertEq(ownerTwo, user2);
    assertEq(gameIDTwo, 1);
    assertEq(gameIDPosTwo, 1);
    assertEq(xTwo, 37);
    assertEq(yTwo, 1);
  }

  function testMapIsNotReady() public {
    vm.expectRevert(CastleSettle__MapIsNotReady.selector);
    TestUtils.settleCastle(world, 35, 1, 1, user1);
  }

  function testCoordinatesOutOfBound() public {
    string memory userName = "dem";
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    vm.expectRevert(CastleSettle__CoordinatesOutOfBound.selector);
    TestUtils.settleCastle(world, 300, 400, 1, user1);
  }

  function testTileIsNotEmpty() public {
    string memory userName = "dem";
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    vm.expectRevert(CastleSettle__TileIsNotEmpty.selector);
    TestUtils.settleCastle(world, 35, 1, 1, user2);
  }

  function testWrongTerrainType() public {
    string memory userName = "dem";
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    vm.expectRevert(CastleSettle__WrongTerrainType.selector);
    TestUtils.settleCastle(world, 1, 1, 1, user1);
  }

  function testNoCastleRight() public {
    string memory userName = "dem";
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.settleCastle(world, 35, 1, 1, user1);
    vm.expectRevert(CastleSettle__NoCastleRight.selector);
    TestUtils.settleCastle(world, 37, 1, 1, user1);
  }
}
