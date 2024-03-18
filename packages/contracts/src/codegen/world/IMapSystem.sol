// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

import { ArmyConfigData } from "./../index.sol";

/**
 * @title IMapSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IMapSystem {
  function settleCastle(uint32 x, uint32 y, uint256 gameID) external returns (bytes32);

  function settleArmy(uint32 x, uint32 y, ArmyConfigData calldata config, bytes32 castleID) external returns (bytes32);

  function armyMove(bytes32 armyID, uint32 x, uint32 y, uint256 gameID) external;

  function claimWinner(address winnerCandidate, uint256 gameID) external;
}
