export const isMyArmy = (
  position: { x: number; y: number },
  myArmyPositions: any[]
) => {
  if (myArmyPositions) {
    return myArmyPositions.some((data: any) => {
      return (
        data.position.x.toString() === position.x.toString() &&
        data.position.y.toString() === position.y.toString()
      );
    });
  }
  return false;
};
