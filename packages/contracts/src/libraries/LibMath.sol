// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library LibMath {
  function manhattan(uint32 xOne, uint32 yOne,uint32 xTwo,uint32 yTwo) internal pure returns (uint32) {
    uint32 dx = xOne > xTwo ? xOne - xTwo : xTwo - xOne;
    uint32 dy = yOne > yTwo ? yOne - yTwo : yTwo - yOne;
    return dx + dy;
  }
}
