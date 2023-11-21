import { getManhattanPositions } from "../CustomFunctions/getManhattanPositions";

export const getArmyMovePositions = (
  x: number,
  y: number,
  myArmyPositions: any[]
): boolean => {
  return myArmyPositions.some((position: any) => {
    return getManhattanPositions({
      x: position.myArmyPosition.x,
      y: position.myArmyPosition.y,
    }).some((item) => item.x === x && item.y === y);
  });
};
