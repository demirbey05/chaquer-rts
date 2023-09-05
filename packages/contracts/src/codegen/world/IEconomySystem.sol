// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

import { MineType } from "./../Types.sol";

interface IEconomySystem {
  function sellResource(uint256 gameID, uint256 amount, MineType mineType) external;

  function updateEconomyData(uint256 gameID) external;
}
