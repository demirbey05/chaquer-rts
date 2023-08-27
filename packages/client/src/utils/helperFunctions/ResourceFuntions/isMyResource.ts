export const isMyResource = (
  x: number,
  y: number,
  myResourcePositions: any[]
) => {
  if (myResourcePositions) {
    return myResourcePositions.some((data: any) => {
      return (
        data.x.toString() === x.toString() && data.y.toString() === y.toString()
      );
    });
  }
  return false;
};
