export const isCastlePosition = (
  x: number,
  y: number,
  castlePosition: any[]
): boolean => {
  if (castlePosition && castlePosition.length > 0) {
    castlePosition.map((position) => {
      if (position.x === x && position.y === y) {
        return true;
      }
    });
  }

  return false;
};
