// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

/**
 * @title IGameInitSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface IGameInitSystem {
  function initMapData(uint256 gameID, uint32 width, uint32 height, bytes calldata terrain) external;

  function InitNumberOfGamer(uint256 gameID, uint256 capacity) external;

  function InitGame(
    uint256 gameID,
    uint256 capacity,
    uint32 width,
    uint32 height,
    bytes calldata terrain,
    string memory name,
    uint8 mapId
  ) external;
}
