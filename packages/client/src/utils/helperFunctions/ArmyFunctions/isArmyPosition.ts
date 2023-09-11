export const isArmyPosition = (
  x: number,
  y: number,
  armyPositions: any[]
): boolean => {
  for (const data of armyPositions) {
    if (data.armyPosition.x === x && data.armyPosition.y === y) {
      return true;
    }
  }

  return false;
};
