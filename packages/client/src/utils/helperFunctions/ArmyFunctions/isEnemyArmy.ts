import { stringifyWrapper } from "../../stringifyWrapper";

export const isEnemyArmy = (
  position: any,
  armyPositions: any[],
  myArmyPositions: any[]
) => {
  if (armyPositions && myArmyPositions) {
    const filteredArray = armyPositions.filter(
      (element) =>
        !myArmyPositions.some(
          (data: any) =>
            stringifyWrapper(data.myArmyPosition) ===
            stringifyWrapper(element.armyPosition)
        )
    );
    if (filteredArray) {
      return filteredArray.some((data: any) => {
        return (
          data.armyPosition.x.toString() === position.x.toString() &&
          data.armyPosition.y.toString() === position.y.toString()
        );
      });
    }
  }
  return false;
};
