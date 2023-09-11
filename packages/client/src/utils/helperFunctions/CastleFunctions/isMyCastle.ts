export const isMyCastle = (myCastlePosition: any[], x: any, y: any) => {
  if (myCastlePosition) {
    return myCastlePosition.some((data: any) => {
      return (
        data.myCastlePosition.x.toString() === x.toString() &&
        data.myCastlePosition.y.toString() === y.toString()
      );
    });
  }
  return false;
};
