import { getManhattanPositions } from "../CustomFunctions/getManhattanPositions";

export const armySettlePositions = (
  x: number,
  y: number,
  castlePositions: any[]
): boolean => {
  return castlePositions.some((position: any) => {
    return getManhattanPositions(position).some(
      (item) => item.x === x && item.y === y
    );
  });
};
