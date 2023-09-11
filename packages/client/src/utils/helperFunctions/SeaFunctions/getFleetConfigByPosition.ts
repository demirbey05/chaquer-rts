export const getEnemyFleetConfigByPosition = (
  position: { x: any; y: any },
  fleetPositions: any[]
) => {
  if (fleetPositions) {
    const fleetConfig = fleetPositions.find((data: any) => {
      return (
        position.x.toString() === data.fleetPosition.x.toString() &&
        position.y.toString() === data.fleetPosition.y.toString()
      );
    });
    return fleetConfig;
  }
};

export const getMyFleetConfigByPosition = (
  position: { x: any; y: any },
  myFleetPositions: any[]
) => {
  if (myFleetPositions) {
    const fleetConfig = myFleetPositions.find((data: any) => {
      return (
        position.x.toString() === data.myFleetPosition.x.toString() &&
        position.y.toString() === data.myFleetPosition.y.toString()
      );
    });
    return fleetConfig;
  }
};
