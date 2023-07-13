import { getManhattanPositions } from "./getManhattanPositions";

export const isUserClickedManhattanPosition = (
  fromArmyPosition: any,
  x: any,
  y: any
) => {
  const isValid = getManhattanPositions({
    x: parseInt(fromArmyPosition.x),
    y: parseInt(fromArmyPosition.y),
  }).some((item) => item.x.toString() === x && item.y.toString() === y);
  return isValid;
};
