import { getManhattanPositions } from "./getManhattanPositions";

export const isManhattanPosition = (data: any, x: any, y: any) => {
  return getManhattanPositions({ x: parseInt(x), y: parseInt(y) }).some(
    (position: any) => {
      return position.x === parseInt(data.x) && position.y === parseInt(data.y);
    }
  );
};
