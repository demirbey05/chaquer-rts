export const isCastlePosition = (
  x: number,
  y: number,
  castlePosition: any[]
): boolean => {
  if (castlePosition && castlePosition.length > 0) {
    castlePosition.map((position) => {
      if (
        position.castlePosition.x.toString() === x.toString() &&
        position.castlePosition.y.toString() === y.toString()
      ) {
        return true;
      }
    });
  }

  return false;
};
