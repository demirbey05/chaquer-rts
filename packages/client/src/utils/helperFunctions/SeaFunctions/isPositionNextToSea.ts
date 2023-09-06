export const isPositionNextToSea = (
  x: any,
  y: any,
  terrainValues: number[][]
): boolean => {
  const numberX = parseInt(x);
  const numberY = parseInt(y);

  if (
    numberX + 1 <= 49 &&
    terrainValues[numberX + 1][numberY] === 2 &&
    terrainValues[numberX][numberY] === 1
  ) {
    return true;
  }

  if (
    numberY + 1 <= 49 &&
    terrainValues[numberX][numberY + 1] === 2 &&
    terrainValues[numberX][numberY] === 1
  ) {
    return true;
  }

  if (
    numberX - 1 >= 0 &&
    terrainValues[numberX - 1][numberY] === 2 &&
    terrainValues[numberX][numberY] === 1
  ) {
    return true;
  }

  if (
    numberY - 1 >= 0 &&
    terrainValues[numberX][numberY - 1] === 2 &&
    terrainValues[numberX][numberY] === 1
  ) {
    return true;
  }

  return false;
};
