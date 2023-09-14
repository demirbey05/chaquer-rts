export const isEnemyDock = (
  position: any,
  dockPositions: any[],
  myDockPositions: any[] | undefined
) => {
  const isInDockPositions = dockPositions.some(
    (dock) =>
      dock.dockPosition.x === Number(position.x) &&
      dock.dockPosition.y === Number(position.y)
  );

  const isNotInMyDockPositions = myDockPositions
    ? !myDockPositions.some(
        (myDock) =>
          myDock.myDockPosition.x === Number(position.x) &&
          myDock.myDockPosition.y === Number(position.y)
      )
    : true;

  return isInDockPositions && isNotInMyDockPositions;
};
