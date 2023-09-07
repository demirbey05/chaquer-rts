export const isEnemyDock = (
  position: any,
  dockPositions: any[],
  myDockPositions: any[] | undefined
) => {
  const isInDockPositions = dockPositions.some(
    (dock) => dock.x === Number(position.x) && dock.y === Number(position.y)
  );

  const isNotInMyDockPositions = myDockPositions
    ? !myDockPositions.some(
        (myDock) =>
          myDock.x === Number(position.x) && myDock.y === Number(position.y)
      )
    : true;

  return isInDockPositions && isNotInMyDockPositions;
};
