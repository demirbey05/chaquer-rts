// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface IMineInitSystem {
  function commitSeed(uint256 gameID, uint256 seed) external;

  function resourceSystemInit(uint256 gameID) external;

  function captureMine(bytes32 armyID, bytes32 mineID) external;
}
