import { getMyArmyConfigByPosition } from "./getArmyConfigByPosition";

export const getNumberOfSoldierInArmy = (
  fromArmyPosition: any,
  myArmyPositions: any[]
) => {
  let numberOfSoldier: number = 0;
  const armyConfig = getMyArmyConfigByPosition(
    { x: fromArmyPosition.x, y: fromArmyPosition.y },
    myArmyPositions
  );

  if (armyConfig) {
    numberOfSoldier =
      armyConfig.myArmyConfig.numSwordsman +
      armyConfig.myArmyConfig.numArcher +
      armyConfig.myArmyConfig.numCavalry;
  }

  return numberOfSoldier;
};
