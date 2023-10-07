export const isArmyMergePosition = (
  x: number,
  y: number,
  fromArmyPosition: any
) => {
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      if (xOffset !== 0 || yOffset !== 0) {
        const newPosition = {
          x: Number(fromArmyPosition.x) + xOffset,
          y: Number(fromArmyPosition.y) + yOffset,
        };
        if (newPosition.x === Number(x) && newPosition.y === Number(y)) {
          return true;
        }
      }
    }
  }

  return false;
};
