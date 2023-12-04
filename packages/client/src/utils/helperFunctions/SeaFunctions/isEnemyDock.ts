export const isEnemyDock = (
  position: any,
  dockPositions: any[],
  myDockPositions: any[] | undefined
) => {
  const isInDockPositions = dockPositions.some(
    (dock) =>
      dock.dockPosition.x.toString() === position.x.toString() &&
      dock.dockPosition.y.toString() === position.y.toString()
  );

  const isNotInMyDockPositions = myDockPositions
    ? !myDockPositions.some(
        (myDock) =>
          myDock.myDockPosition.x.toString() === position.x.toString() &&
          myDock.myDockPosition.y.toString() === position.y.toString()
      )
    : true;

  return isInDockPositions && isNotInMyDockPositions;
};
