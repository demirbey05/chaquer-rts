//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { TestUtils } from "./utils/TestUtils.sol";
import { NakamoTest } from "./utils/NakamoTest.sol";
import "../src/systems/Errors.sol";
import { PlayerSeeds, Players, LimitOfGame, NumberOfUsers, ResourceInited, ResourceOwnableData, Position, MapConfig, ResourceOwnable } from "../src/codegen/Tables.sol";

contract MineSystemTest is NakamoTest {
  function setUp() public override {
    super.setUp();
    TestUtils.initMap(world, "test/mock_data/map.txt", 50, 50, 1);
  }
}
