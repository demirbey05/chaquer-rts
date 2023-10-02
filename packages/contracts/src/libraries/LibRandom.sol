//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { PlayerSeeds } from "../codegen/index.sol";

library LibRandom {
  function generateRandomNumber(bytes32 previousHash, uint256 gameID) internal returns (bytes32) {
    uint256[] memory seeds = PlayerSeeds.get(gameID);
    uint seedIndex = uint(blockhash(block.number - 1)) % seeds.length;
    bytes32 hashNumber = keccak256(abi.encodePacked(block.difficulty, block.timestamp, seeds[seedIndex], previousHash));
    return hashNumber;
  }
}
