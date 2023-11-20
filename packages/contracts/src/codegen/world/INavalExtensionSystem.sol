// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

import { FleetConfigData, ArmyConfigData } from "./../index.sol";

/**
 * @title INavalExtensionSystem
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface INavalExtensionSystem {
  function buildDock(uint32 coord_x, uint32 coord_y, bytes32 requestedArmy, uint256 gameID) external returns (bytes32);

  function settleFleet(uint32 x, uint32 y, bytes32 dockID, FleetConfigData memory fleet) external returns (bytes32);

  function moveFleet(bytes32 fleetID, uint32 x, uint32 y) external;

  function loadFleet(bytes32 fleetID, bytes32 armyID, ArmyConfigData partOfData) external;
}
