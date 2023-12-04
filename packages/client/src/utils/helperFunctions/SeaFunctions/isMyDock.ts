export const isMyDock = (
  x: number,
  y: number,
  myDockPositions: any[] | undefined
) => {
  if (myDockPositions && myDockPositions.length > 0) {
    return myDockPositions.some((data: any) => {
      return (
        data.myDockPosition.x.toString() === x.toString() &&
        data.myDockPosition.y.toString() === y.toString()
      );
    });
  }
  return false;
};
