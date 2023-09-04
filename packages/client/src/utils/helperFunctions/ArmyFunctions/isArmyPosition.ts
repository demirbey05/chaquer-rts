export const isArmyPosition = (
  x: number,
  y: number,
  armyPositions: any[]
): boolean => {
  for (const data of armyPositions) {
    if (data.position.x === x && data.position.y === y) {
      return true;
    }
  }

  return false;
};
