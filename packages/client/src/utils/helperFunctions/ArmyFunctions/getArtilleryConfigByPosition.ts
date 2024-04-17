export const getMyArtilleryConfigByPosition = (
  position: { x: any; y: any },
  myArtilleryPosition: any[]
) => {
  if (myArtilleryPosition) {
    const artilleryConfig = myArtilleryPosition.find((data: any) => {
      return (
        position.x.toString() === data.myArtilleryPosition.x.toString() &&
        position.y.toString() === data.myArtilleryPosition.y.toString()
      );
    });
    return artilleryConfig;
  }
};
