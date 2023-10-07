import { runQuery, HasValue } from "@latticexyz/recs";
export interface Coord {
  x: string;
  y: string;
}

export const getIDFromPosition = (
  coordinate: Coord,
  posComponent: any,
  gameID: number
) => {
  const matchingEntities = runQuery([
    HasValue(posComponent, {
      x: Number(coordinate.x),
      y: Number(coordinate.y),
      gameID: BigInt(gameID),
    }),
  ]);
  return matchingEntities;
};
