import { stringifyWrapper } from "../../stringifyWrapper";

export const isEnemyFleet = (
  position: any,
  myFleetPositions: any[] | undefined,
  fleetPositions: any[] | undefined
) => {
  if (myFleetPositions && fleetPositions) {
    const filteredArray = fleetPositions.filter((element: any) =>
      myFleetPositions.every(
        (pos) =>
          stringifyWrapper(pos) !== stringifyWrapper(element.fleetPosition)
      )
    );
    return filteredArray.some(
      (data: any) =>
        data.fleetPosition.x.toString() === position.x.toString() &&
        data.fleetPosition.y.toString() === position.y.toString()
    );
  }
  return false;
};
