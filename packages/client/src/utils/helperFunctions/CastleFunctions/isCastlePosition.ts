export const isCastlePosition = (
  x: number,
  y: number,
  castlePosition: any[]
): boolean => {
  for (const position of castlePosition) {
    if (position.x === x && position.y === y) {
      return true;
    }
  }

  return false;
};
