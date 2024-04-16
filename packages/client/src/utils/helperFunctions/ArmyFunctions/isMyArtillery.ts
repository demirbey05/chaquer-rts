export const isMyArtillery = (
  position: { x: number; y: number },
  myArtilleryPositions: any[]
) => {
  if (myArtilleryPositions) {
    return myArtilleryPositions.some((data: any) => {
      return (
        data.myArtilleryPosition.x.toString() === position.x.toString() &&
        data.myArtilleryPosition.y.toString() === position.y.toString()
      );
    });
  }
  return false;
};
