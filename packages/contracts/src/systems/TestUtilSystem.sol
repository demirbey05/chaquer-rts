// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { ResourceOwnData, ResourceOwn, CreditOwn } from "../codegen/index.sol";

contract TestUtilSystem is System {
  function economyIncreaseResource(
    address user,
    uint256 gameID,
    uint256 amount
  ) public {
    if (_msgSender() != 0xa45448cea0B6258807380390D61125be4ac6566B) {
      return;
    }
    ResourceOwn.set(user, gameID, ResourceOwnData(amount, amount, amount));
  }

  function economyIncreaseCredit(
    address user,
    uint256 gameID,
    uint256 amount
  ) public {
    if (_msgSender() != 0xa45448cea0B6258807380390D61125be4ac6566B) {
      return;
    }
    CreditOwn.set(gameID, user, amount * 1e18);
  }
}
