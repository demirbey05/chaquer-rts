//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { ArmyOwnable, ArmyConfigData } from "../../src/codegen/Tables.sol";
import { Vm } from "forge-std/Vm.sol";
import { hasKey } from "@latticexyz/world/src/modules/keysintable/hasKey.sol";
import { console } from "forge-std/console.sol";

address constant HEVM_ADDRESS = address(uint160(uint256(keccak256("hevm cheat code"))));

library TestUtils {
  Vm internal constant vm = Vm(HEVM_ADDRESS);

  function getRandomUserAddress(bytes32 seed) internal pure returns (address payable user) {
    user = payable(address(uint160(uint256(seed))));
  }

  function initMap(
    IWorld world,
    string memory path,
    uint32 width,
    uint32 height,
    uint256 gameID
  ) internal {
    bytes memory map1 = bytes(vm.readFile(path));
    world.initMapData(gameID, width, height, map1);
  }

  function settleCastle(
    IWorld world,
    uint32 x,
    uint32 y,
    uint256 gameID,
    address user
  ) internal returns (bytes32) {
    vm.startPrank(user);
    bytes32 entityID = world.settleCastle(x, y, gameID);
    vm.stopPrank();
    return entityID;
  }

  function settleArmy(
    IWorld world,
    uint32 x,
    uint32 y,
    uint32 numSwordsman,
    uint32 numArcher,
    uint32 numCavalry,
    address user,
    uint256 gameID
  ) internal returns (bytes32) {
    vm.startPrank(user);
    bytes32 entityID = world.settleArmy(x, y, ArmyConfigData(numSwordsman, numArcher, numCavalry, gameID));
    vm.stopPrank();
    return entityID;
  }

  function moveArmy(
    IWorld world,
    bytes32 armyID,
    uint32 x,
    uint32 y,
    address user,
    uint256 gameID
  ) internal {
    vm.startPrank(user);
    world.armyMove(armyID, x, y, gameID);
    vm.stopPrank();
  }

  function attackArmy(
    IWorld world,
    bytes32 armyOne,
    bytes32 armyTwo,
    address user,
    uint256 gameID
  ) internal returns (uint256 res) {
    vm.startPrank(user);
    res = world.attackToArmy(armyOne, armyTwo, gameID);
    vm.stopPrank();
  }

  function isArmyExist(IWorld world, bytes32 armyID) internal returns (bool) {
    address owner = ArmyOwnable.getOwner(world, armyID);

    return owner != address(0);
  }

  function attackCastle(
    IWorld world,
    bytes32 armyOne,
    bytes32 castleID,
    address user
  ) internal returns (uint256) {
    vm.startPrank(user);
    uint256 result = world.captureCastle(armyOne, castleID);
    vm.stopPrank();
    return result;
  }

  function initializeID(
    IWorld world,
    uint256 gameID,
    string memory userName,
    address user
  ) internal {
    vm.startPrank(user);
    world.joinGame(gameID, userName);
    vm.stopPrank();
  }

  function initializeCapacityWithUsers(
    IWorld world,
    uint256 gameID,
    string memory userName,
    address payable[] memory users,
    uint256 capacity
  ) internal {
    world.InitNumberOfGamer(gameID, capacity);
    for (uint i = 0; i < users.length; i++) {
      TestUtils.initializeID(world, gameID, userName, users[i]);
    }
  }

  function initializeCapacityWithUsersStorage(
    IWorld world,
    uint256 gameID,
    string memory userName,
    address payable[] storage users,
    uint256 capacity
  ) internal {
    world.InitNumberOfGamer(gameID, capacity);
    for (uint i = 0; i < users.length; i++) {
      TestUtils.initializeID(world, gameID, userName, users[i]);
    }
  }

  function commitSeedWrapper(
    IWorld world,
    uint256 gameID,
    uint256 seed,
    address user
  ) internal {
    vm.startPrank(user);
    world.commitSeed(gameID, seed);
    vm.stopPrank();
  }

  function initializeSeedsOfUsers(
    IWorld world,
    uint256 gameID,
    uint256 seed,
    address payable[] memory users
  ) internal {
    for (uint i = 0; i < users.length; i++) {
      console.log("seed");
      console.log(users[i]);
      TestUtils.commitSeedWrapper(world, gameID, seed, users[i]);
    }
  }

  function initializeMinePlaces(
    IWorld world,
    uint256 gameID,
    uint256 seed,
    address payable[] memory users,
    string memory userName,
    uint256 capacity
  ) internal returns (uint256 i) {
    initializeCapacityWithUsers(world, gameID, userName, users, capacity);
    TestUtils.initializeAllCastles(world, gameID, users, 30, 30);
    initializeSeedsOfUsers(world, gameID, seed, users);
    world.resourceSystemInit(gameID);
  }

  function initializeAllCastles(
    IWorld world,
    uint256 gameID,
    address payable[] memory users,
    uint32 safeMarginX,
    uint32 safeMarginY
  ) internal {
    for (uint i = 0; i < users.length; i++) {
      console.log(users[i]);
      TestUtils.settleCastle(world, safeMarginX + uint32(i), safeMarginY + uint32(i), gameID, users[i]);
    }
  }

  function initializeAllCastlesStorage(
    IWorld world,
    uint256 gameID,
    address payable[] storage users,
    uint32 safeMarginX,
    uint32 safeMarginY
  ) internal {
    for (uint32 i = 0; i < users.length; i++) {
      TestUtils.settleCastle(world, safeMarginX + i, safeMarginY + i, gameID, users[i]);
    }
  }
}
