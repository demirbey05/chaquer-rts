import { stringifyWrapper } from "../../stringifyWrapper";

export const isEnemyCastle = (
  position: any,
  myCastlePosition: any[],
  castlePositions: any[]
) => {
  if (myCastlePosition && castlePositions) {
    const filteredArray = castlePositions.filter((element: any) =>
      myCastlePosition.every(
        (pos) =>
          stringifyWrapper(pos.myCastlePosition) !==
          stringifyWrapper(element.castlePosition)
      )
    );
    return filteredArray.some(
      (data: any) =>
        data.castlePosition.x.toString() === position.x.toString() &&
        data.castlePosition.y.toString() === position.y.toString()
    );
  }
  return false;
};
