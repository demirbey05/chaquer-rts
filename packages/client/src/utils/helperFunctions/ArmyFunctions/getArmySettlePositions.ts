import { getManhattanPositions } from "../CustomFunctions/getManhattanPositions";

export const getArmySettlePositions = (
  x: number,
  y: number,
  myCastlePosition: any[]
): boolean => {
  return myCastlePosition.some((position: any) => {
    return getManhattanPositions(position.myCastlePosition).some(
      (item) => item.x === x && item.y === y
    );
  });
};
