//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { CreditOwn, ResourceOwn, DockOwnable, Position } from "../src/codegen/Tables.sol";

contract NavalFleetTest is NakamoTest {
  address payable[] users;
  address constant testUser1 = 0xa45448cea0B6258807380390D61125be4ac6566B;

  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/naval_test_map.txt", 50, 50, 1);
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
    users.push(payable(testUser1));
    TestUtils.initializeCapacityWithUsersStorage(world, 1, userName, users, 10);
    TestUtils.initializeAllCastlesStorage(world, 1, users, 9, 9);
    TestUtils.initializeSeedsOfUsersStorage(world, 1, 5, users);
    world.resourceSystemInit(1);
  }
}
