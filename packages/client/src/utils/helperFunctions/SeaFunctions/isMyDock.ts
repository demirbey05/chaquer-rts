export const isMyDock = (
  x: number,
  y: number,
  myDockPositions: any[] | undefined
) => {
  if (myDockPositions && myDockPositions.length > 0) {
    return myDockPositions.some((data: any) => {
      return data.x === x && data.y === y;
    });
  }
  return false;
};
