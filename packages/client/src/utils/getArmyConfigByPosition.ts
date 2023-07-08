export const getEnemyArmyConfigByPosition = (
  position: { x: any; y: any },
  armyPositions: any[]
) => {
  if (armyPositions) {
    const armyConfig = armyPositions.find((data: any) => {
      return (
        position.x.toString() === data.position.x.toString() &&
        position.y.toString() === data.position.y.toString()
      );
    });
    return armyConfig;
  }
};

export const getMyArmyConfigByPosition = (
  position: { x: any; y: any },
  myArmyPosition: any[]
) => {
  if (myArmyPosition) {
    const armyConfig = myArmyPosition.find((data: any) => {
      return (
        position.x.toString() === data.position.x.toString() &&
        position.y.toString() === data.position.y.toString()
      );
    });
    return armyConfig;
  }
};
