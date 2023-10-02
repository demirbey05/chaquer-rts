//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Players, ChatMessages, AddressToUsername, LastMessageTime } from "../codegen/index.sol";

error ChatSystem__MessageIsTooLong();
error ChatSystem__NotJoined();
error ChatSystem__Cooldown();

contract ChatSystem is System {
  function sendMessage(uint256 gameID, string memory message) public {
    if (block.number - LastMessageTime.get(gameID, _msgSender()) < 10) {
      revert ChatSystem__Cooldown();
    }
    if (bytes(message).length > 32) {
      revert ChatSystem__MessageIsTooLong();
    }
    address sender = _msgSender();
    if (!Players.get(gameID, sender)) {
      revert ChatSystem__NotJoined();
    }
    ChatMessages.set(
      keccak256(abi.encodePacked(block.timestamp, sender, message, gameID)),
      block.number,
      gameID,
      AddressToUsername.getUserName(sender),
      message
    );
    LastMessageTime.set(gameID, sender, block.number);
  }
}
