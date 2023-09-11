export const isMyArmy = (
  position: { x: number; y: number },
  myArmyPositions: any[]
) => {
  if (myArmyPositions) {
    return myArmyPositions.some((data: any) => {
      return (
        data.myArmyPosition.x.toString() === position.x.toString() &&
        data.myArmyPosition.y.toString() === position.y.toString()
      );
    });
  }
  return false;
};
