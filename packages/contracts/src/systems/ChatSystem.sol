//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Players, ChatMessages, AddressToUsername } from "../codegen/Tables.sol";

error ChatSystem__MessageIsTooLong();
error ChatSystem__NotJoined();

contract ChatSystem is System {
  function sendMessage(uint256 gameID, string memory message) public {
    if (bytes(message).length > 32) {
      revert ChatSystem__MessageIsTooLong();
    }
    address sender = _msgSender();
    if (!Players.get(gameID, sender)) {
      revert ChatSystem__NotJoined();
    }
    ChatMessages.emitEphemeral(
      keccak256(abi.encodePacked(block.timestamp, sender, message, gameID)),
      block.number,
      gameID,
      AddressToUsername.getUserName(sender, gameID),
      message
    );
  }
}
