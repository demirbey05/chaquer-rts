import { getManhattanPositions } from "../CustomFunctions/getManhattanPositions";

export const fleetSettlePositions = (
  x: number,
  y: number,
  myDockPositions: any[]
): boolean => {
  return myDockPositions.some((position: any) => {
    return getManhattanPositions(position).some(
      (item) => item.x === x && item.y === y
    );
  });
};
