export const isMyFleet = (
  position: { x: number; y: number },
  myFleetPositions: any[] | undefined
) => {
  if (myFleetPositions) {
    return myFleetPositions.some((data: any) => {
      return (
        data.x.toString() === position.x.toString() &&
        data.y.toString() === position.y.toString()
      );
    });
  }
  return false;
};
