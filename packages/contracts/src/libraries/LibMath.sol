// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import {Position} from "../codegen/Tables.sol";

library LibMath {
  function manhattan(uint32 xOne, uint32 yOne,uint32 xTwo,uint32 yTwo) internal pure returns (uint32) {
    uint32 dx = xOne > xTwo ? xOne - xTwo : xTwo - xOne;
    uint32 dy = yOne > yTwo ? yOne - yTwo : yTwo - yOne;
    return dx + dy;
  }
  function distanceBetween(bytes32 IDOne,bytes32 IDTwo) internal returns (uint32){
    (uint32 xOne,uint32 yOne,) = Position.get(IDOne);
    (uint32 xTwo,uint32 yTwo,) = Position.get(IDTwo);

    return manhattan(xOne, yOne, xTwo, yTwo);


  }
}
