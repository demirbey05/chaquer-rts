// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

/**
 * @title IAttackCaptureSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IAttackCaptureSystem {
  function attackToArmy(bytes32 armyOne, bytes32 armyTwo, uint256 gameID) external returns (uint256);

  function captureCastle(bytes32 armyID, bytes32 castleID) external returns (uint256 result);

  function attackFleet(bytes32 fleetOne, bytes32 fleetTwo, uint256 gameID) external;
}
