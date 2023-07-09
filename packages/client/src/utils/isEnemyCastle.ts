import { stringifyWrapper } from "./stringifyWrapper";

export const isEnemyCastle = (
  position: any,
  myCastlePosition: any[],
  castlePositions: any[]
) => {
  if (myCastlePosition && castlePositions) {
    const filteredArray = castlePositions.filter((element: any) =>
      myCastlePosition.every(
        (pos) => stringifyWrapper(pos) !== stringifyWrapper(element)
      )
    );
    return filteredArray.some(
      (data: any) =>
        data.x.toString() === position.x.toString() &&
        data.y.toString() === position.y.toString()
    );
  }
  return false;
};
