export const isMyResource = (
  x: number,
  y: number,
  myResourcePositions: any[]
) => {
  if (myResourcePositions) {
    return myResourcePositions.some((data: any) => {
      return (
        data.myResourcePosition.x.toString() === x.toString() &&
        data.myResourcePosition.y.toString() === y.toString()
      );
    });
  }
  return false;
};
