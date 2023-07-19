//SPDX-License-Identifier:MIT

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { ArmyConfig, Position, ArmyOwnable, ArmyConfigData } from "../src/codegen/Tables.sol";
pragma solidity ^0.8.0;

contract MineCaptureTest is NakamoTest {
  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
    string memory userName = "demir";
    address payable[] memory newUserArray = new address payable[](10);
    newUserArray[0] = user1;
    newUserArray[1] = user2;
    newUserArray[2] = user3;
    newUserArray[3] = user4;
    newUserArray[4] = user5;
    newUserArray[5] = user6;
    newUserArray[6] = user7;
    newUserArray[7] = user8;
    newUserArray[8] = user9;
    newUserArray[9] = user10;
    TestUtils.initializeMinePlaces(world, 1, 1, newUserArray, userName, 10);
  }
}
