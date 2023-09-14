export const isMyFleet = (
  position: { x: number; y: number },
  myFleetPositions: any[] | undefined
) => {
  if (myFleetPositions) {
    return myFleetPositions.some((data: any) => {
      return (
        data.myFleetPosition.x.toString() === position.x.toString() &&
        data.myFleetPosition.y.toString() === position.y.toString()
      );
    });
  }
  return false;
};
