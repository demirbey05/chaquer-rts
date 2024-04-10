import { runQuery, HasValue, Has } from "@latticexyz/recs";
export interface Coord {
  x: string;
  y: string;
}

export const getArtilleyIDFromPosition = (
  coordinate: Coord,
  posComponent: any,
  artilleryComponent: any,
  gameID: number
) => {
  const matchingEntities = runQuery([
    HasValue(posComponent, {
      x: Number(coordinate.x),
      y: Number(coordinate.y),
      gameID: BigInt(gameID),
    }),
    Has(artilleryComponent),
  ]);
  return matchingEntities;
};
