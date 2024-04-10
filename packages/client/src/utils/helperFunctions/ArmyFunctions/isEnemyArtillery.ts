import { stringifyWrapper } from "../../stringifyWrapper";

export const isEnemyArmy = (
  position: any,
  artilleryPositions: any[],
  myArtilleryPositions: any[]
) => {
  if (artilleryPositions && myArtilleryPositions) {
    const filteredArray = artilleryPositions.filter(
      (element) =>
        !myArtilleryPositions.some(
          (data: any) =>
            stringifyWrapper(data.myArtilleryPosition) ===
            stringifyWrapper(element.artilleryPosition)
        )
    );
    if (filteredArray) {
      return filteredArray.some((data: any) => {
        return (
          data.artilleryPosition.x.toString() === position.x.toString() &&
          data.artilleryPosition.y.toString() === position.y.toString()
        );
      });
    }
  }
  return false;
};
