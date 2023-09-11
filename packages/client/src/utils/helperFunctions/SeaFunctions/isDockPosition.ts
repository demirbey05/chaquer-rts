export const isDockPosition = (
  x: number,
  y: number,
  dockPositions: any[]
): boolean => {
  if (dockPositions && dockPositions.length > 0) {
    dockPositions.map((position) => {
      if (position.dockPosition.x === x && position.dockPosition.y === y) {
        return true;
      }
    });
  }
  return false;
};
