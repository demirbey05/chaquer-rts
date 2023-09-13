//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { IWorld } from "../../src/codegen/world/IWorld.sol";
import { ArmyOwnable, ArmyConfigData, Position } from "../../src/codegen/Tables.sol";
import { Vm } from "forge-std/Vm.sol";
import { hasKey } from "@latticexyz/world/src/modules/keysintable/hasKey.sol";
import { LibMath, LibQueries } from "../../src/libraries/Libraries.sol";
import { MineType, AttackerType } from "../../src/codegen/Types.sol";

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
      TestUtils.commitSeedWrapper(world, gameID, seed, users[i]);
    }
  }

  function initializeSeedsOfUsersStorage(
    IWorld world,
    uint256 gameID,
    uint256 seed,
    address payable[] storage users
  ) internal {
    for (uint i = 0; i < users.length; i++) {
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
      TestUtils.settleCastle(world, safeMarginX + 1 * i, safeMarginY + 1 * i, gameID, users[i]);
    }
  }

  function initializeAllCastlesStorage(
    IWorld world,
    uint256 gameID,
    address payable[] storage users,
    uint32 safeMarginX,
    uint32 safeMarginY,
    uint32 moveX,
    uint32 moveY
  ) internal {
    for (uint32 i = 0; i < users.length; i++) {
      TestUtils.settleCastle(world, safeMarginX + moveX * i, safeMarginY + moveY * i, gameID, users[i]);
    }
  }

  function initializeMinePlacesStorage(
    IWorld world,
    uint256 gameID,
    uint256 seed,
    address payable[] storage users,
    string memory userName,
    uint256 capacity
  ) internal returns (uint256 i) {
    initializeCapacityWithUsers(world, gameID, userName, users, capacity);
    TestUtils.initializeAllCastles(world, gameID, users, 30, 30);
    initializeSeedsOfUsers(world, gameID, seed, users);
    world.resourceSystemInit(gameID);
  }

  function findClosestMine(
    IWorld world,
    uint32 xCoord,
    uint32 yCoord,
    bytes32[] memory mineArray
  ) internal returns (bytes32) {
    bytes32 closestID = mineArray[0];
    (uint32 xMine, uint32 yMine, ) = Position.get(world, closestID);
    uint32 closestDistance = LibMath.manhattan(xCoord, yCoord, xMine, yMine);
    for (uint i = 1; i < mineArray.length; i++) {
      (xMine, yMine, ) = Position.get(world, mineArray[i]);
      uint32 currentDis = LibMath.manhattan(xCoord, yCoord, xMine, yMine);
      if (currentDis < closestDistance) {
        closestDistance = currentDis;
        closestID = mineArray[i];
      }
    }
    return closestID;
  }

  function moveArmyToLocation(
    IWorld world,
    bytes32 armyID,
    uint32 xCoord,
    uint32 yCoord,
    address user,
    uint256 gameID
  ) internal {
    (uint32 xArmy, uint32 yArmy, ) = Position.get(world, armyID);
    uint i = 0;
    while (xArmy != xCoord && i < 30) {
      if (xArmy > xCoord) {
        // Minus
        if (LibQueries.queryPositionEntity(world, xArmy - 1, yArmy, gameID) == 0) {
          TestUtils.moveArmy(world, armyID, xArmy - 1, yArmy, user, gameID);
        } else {
          TestUtils.moveArmy(world, armyID, xArmy - 2, yArmy, user, gameID);
        }
      } else {
        if (LibQueries.queryPositionEntity(world, xArmy + 1, yArmy, gameID) == 0) {
          TestUtils.moveArmy(world, armyID, xArmy + 1, yArmy, user, gameID);
        } else {
          TestUtils.moveArmy(world, armyID, xArmy + 2, yArmy, user, gameID);
        }
      }
      (xArmy, , ) = Position.get(world, armyID);
      i++;
    }
    i = 0;
    while (yArmy != yCoord && i < 30) {
      if (yArmy > yCoord) {
        // Minus
        if (LibQueries.queryPositionEntity(world, xArmy, yArmy - 1, gameID) == 0) {
          TestUtils.moveArmy(world, armyID, xArmy, yArmy - 1, user, gameID);
        } else {
          TestUtils.moveArmy(world, armyID, xArmy, yArmy - 2, user, gameID);
        }
      } else {
        if (LibQueries.queryPositionEntity(world, xArmy, yArmy + 1, gameID) == 0) {
          TestUtils.moveArmy(world, armyID, xArmy, yArmy + 1, user, gameID);
        } else {
          TestUtils.moveArmy(world, armyID, xArmy, yArmy + 2, user, gameID);
        }
      }
      (, yArmy, ) = Position.get(world, armyID);
      i++;
    }
  }

  function captureMine(
    IWorld world,
    bytes32 armyID,
    bytes32 mineID,
    address user,
    AttackerType attackerType
  ) internal {
    vm.startPrank(user);
    world.captureMine(armyID, mineID, attackerType);
    vm.stopPrank();
  }

  function captureClosestMineInitial(
    IWorld world,
    bytes32 armyID,
    address user,
    uint256 gameID,
    MineType mineType
  ) internal {
    bytes32[] memory mines = LibQueries.getMines(world, address(0), gameID, mineType);
    (uint32 xCoord, uint32 yCoord, ) = Position.get(world, armyID);
    bytes32 closestMine = findClosestMine(world, xCoord, yCoord, mines);
    (uint32 xMine, uint32 yMine, ) = Position.get(world, closestMine);
    moveArmyToLocation(world, armyID, xMine, yMine, user, gameID);
    captureMine(world, armyID, closestMine, user, AttackerType.Army);
  }

  /*function collectResource(
    IWorld world,
    address user,
    uint256 gameID
  ) internal {
    vm.startPrank(user);
    world.collectResource(gameID);
    vm.stopPrank();
  }*/

  function sellResource(
    IWorld world,
    address user,
    uint256 gameID,
    uint256 amount,
    MineType mineType
  ) internal {
    vm.startPrank(user);
    world.sellResource(gameID, amount, mineType);
    vm.stopPrank();
  }

  function cheatCredit(
    IWorld world,
    address user,
    uint256 gameID,
    uint256 amount
  ) internal {
    vm.startPrank(0xa45448cea0B6258807380390D61125be4ac6566B);
    world.economyIncreaseCredit(user, gameID, amount);
    vm.stopPrank();
  }

  function cheatResource(
    IWorld world,
    address user,
    uint256 gameID,
    uint256 amount
  ) internal {
    vm.startPrank(0xa45448cea0B6258807380390D61125be4ac6566B);
    world.economyIncreaseResource(user, gameID, amount);
    vm.stopPrank();
  }

  function buildDockWrapper(
    IWorld world,
    address user,
    bytes32 armyID,
    uint32 x,
    uint32 y,
    uint256 gameID
  ) internal returns (bytes32) {
    vm.startPrank(user);
    bytes32 dockID = world.buildDock(x, y, armyID, gameID);
    vm.stopPrank();
    return dockID;
  }

  function buyResource(
    IWorld world,
    address user,
    uint256 gameID,
    uint256 amount,
    MineType mineType
  ) internal {
    vm.startPrank(user);
    world.buyResource(gameID, amount, mineType);
    vm.stopPrank();
  }
}
