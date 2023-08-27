export const isMyCastle = (myCastlePosition: any, x: number, y: number) => {
  const myCastle = myCastlePosition.find(
    (element: { x: number; y: number }) => {
      return element.x == x && element.y == y;
    }
  );
  return myCastle;
};
