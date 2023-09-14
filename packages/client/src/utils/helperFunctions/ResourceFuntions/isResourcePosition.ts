export const isResourcePosition = (
  x: number,
  y: number,
  resourcePositions: any[]
): boolean => {
  for (const data of resourcePositions) {
    if (data.positions.x === x && data.positions.y === y) {
      return true;
    }
  }

  return false;
};
