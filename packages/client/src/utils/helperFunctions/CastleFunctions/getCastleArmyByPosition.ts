export const getCastleArmyByPosition = (
  castlePositions: any[],
  position: any
) => {
  if (castlePositions && castlePositions.length > 0) {
    const castle = castlePositions.find((data) => {
      return (
        data.castlePosition.x.toString() === position.x.toString() &&
        data.castlePosition.y.toString() === position.y.toString()
      );
    });

    if (castle) {
      return castle.castleArmy;
    }
  }
  return { numSwordsman: 0, numArcher: 0, numCavalry: 0 };
};
