export const isFleetPosition = (
  x: number,
  y: number,
  fleetPositions: any[]
): boolean => {
  if (fleetPositions && fleetPositions.length > 0) {
    fleetPositions.map((position) => {
      if (position.x === x && position.y === y) {
        return true;
      }
    });
  }

  return false;
};
